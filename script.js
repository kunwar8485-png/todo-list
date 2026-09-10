const input = document.querySelector("input");
const addButton = document.querySelector(".input-section button");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");
const emptyMessage = document.querySelector(".empty-message");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "All";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update counter and empty message
function updateTaskCount() {
    taskCount.textContent = "Tasks: " + tasks.length;

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

// Display tasks according to filter
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "Active") {
        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentFilter === "Completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }

    filteredTasks.forEach(function (taskData) {
        createTask(taskData);
    });
}

// Create task
function createTask(taskData) {

    const task = document.createElement("li");

    task.textContent = taskData.text;

    if (taskData.completed) {
        task.classList.add("completed");
    }

    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function (event) {

        event.stopPropagation();

        tasks = tasks.filter(function (item) {
            return item.id !== taskData.id;
        });

        saveTasks();
        renderTasks();
        updateTaskCount();
    });

    task.appendChild(deleteButton);

    // Complete task
    task.addEventListener("click", function () {

        taskData.completed = !taskData.completed;

        saveTasks();
        renderTasks();
    });

    taskList.appendChild(task);
}

// Add task
function addTask() {

    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    input.value = "";

    renderTasks();
    updateTaskCount();
}

// Add button
addButton.addEventListener("click", function () {
    addTask();
});

// Enter key
input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Filters
filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.textContent;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        renderTasks();
    });

});

// Initial load
renderTasks();
updateTaskCount();