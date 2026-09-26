// Get HTML elements

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const activeTasks = document.getElementById("activeTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// Load tasks from localStorage or initialize an empty array

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Save tasks to local Storage

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Display tasks based on the current filter

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // Filter tasks
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }


    // Show empty message
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    // Create task elements
    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        // Task text
        const taskText = document.createElement("span");

        taskText.className = "task-text";
        taskText.textContent = task.text;


        // Buttons container
        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {

            editTask(task.id);

        });


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(actions);


        taskList.appendChild(li);

    });


    updateStatistics();
}


// Add new task

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    // Validation
    if (taskText === "") {

        errorMessage.textContent = "Please enter a task.";

        taskInput.focus();

        return;
    }


    errorMessage.textContent = "";


    // Create new task
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);


    // Save to localStorage
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Display updated tasks
    displayTasks();

});


// Edit tasks

function editTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const updatedText = prompt("Edit your task:", task.text);


    if (updatedText === null) {
        return;
    }


    const trimmedText = updatedText.trim();


    // Validation
    if (trimmedText === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.text = trimmedText;


    saveTasks();

    displayTasks();

}


// Delete Task

function deleteTask(id) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// Complete/Uncomplete Task

function toggleTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    task.completed = !task.completed;


    saveTasks();

    displayTasks();

}


// Filter Tasks

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        displayTasks();

    });

});


// Update Statistics

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {

        return task.completed;

    }).length;


    const active = total - completed;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    activeTasks.textContent = active;

}


// Initial Display of Tasks

displayTasks();