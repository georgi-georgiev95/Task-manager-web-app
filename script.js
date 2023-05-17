const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTimeInput");
const taskList = document.getElementById("taskList");
let tasks = [];

const addTaskButton = document.getElementById("addTaskButton");
addTaskButton.addEventListener("click", addTask);

window.addEventListener("DOMContentLoaded", () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
});

function addTask() {
    const task = taskInput.value;
    const taskTime = taskTimeInput.value;
    if (task && taskTime) {
        tasks.push({ task, taskTime, done: false });
        displayTasks();
        taskInput.value = "";
        taskTimeInput.value = "";
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function displayTasks() {
    taskList.innerHTML = "";
    tasks.forEach((taskObj, index) => {
        const { task, taskTime, done } = taskObj;
        const li = document.createElement("li");

        if (done) {
            li.classList.add("done");
        }

        const taskText = document.createElement("span");
        taskText.textContent = `${task} (scheduled for ${taskTime})`;
        li.appendChild(taskText);

        const markButton = document.createElement("button");
        markButton.textContent = done ? "Undo" : "Done";
        markButton.className = "mark-button";
        markButton.addEventListener("click", () => toggleTaskStatus(index));
        li.appendChild(markButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteTask(index));
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function toggleTaskStatus(index) {
    tasks[index].done = !tasks[index].done;
    displayTasks();

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
