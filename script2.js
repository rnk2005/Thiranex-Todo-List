const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(filter = "all") {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        if (filter === "active" && task.completed) return;

        if (filter === "completed" && !task.completed) return;

        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span>${task.text}</span>

            <div class="task-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks(filter);
        });

        li.querySelector(".edit-btn").addEventListener("click", () => {

            const newText = prompt("Edit your task:", task.text);

            if (newText && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                saveTasks();
                displayTasks(filter);
            }

        });

        li.querySelector(".delete-btn").addEventListener("click", () => {

            tasks.splice(index, 1);
            saveTasks();
            displayTasks(filter);

        });

        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();

});

taskInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        addBtn.click();
    }

});

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        displayTasks(filter.dataset.filter);

    });

});

displayTasks();