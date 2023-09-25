window.addEventListener("DOMContentLoaded", () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
});

const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTimeInput");
const taskList = document.getElementById("taskList");
let tasks = [];

const addTaskButton = document.getElementById("addTaskButton");
addTaskButton.addEventListener("click", addTask);

let counter = 0;


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

const completedDiv = document.createElement('div');
document.querySelector('body').appendChild(completedDiv);
completedDiv.id = 'completed-area';

const completedTasks = document.createElement('p');
completedTasks.id = 'completed-tasks'
completedTasks.textContent = `Completed tasks: ${counter}`;

const resetButton = document.createElement('button');
resetButton.id = 'reset-btn';
resetButton.textContent = 'Reset couner';

completedDiv.appendChild(completedTasks);
completedDiv.appendChild(resetButton);


resetButton.addEventListener('click', resetCounter);

function resetCounter() {
    counter = 0;
    completedTasks.textContent = `Completed tasks: ${counter}`;
}

function displayTasks() {
    taskList.innerHTML = "";
    tasks.forEach((taskObj, index) => {
        const { task, taskTime, done, timerInterval } = taskObj;

        const li = document.createElement("li");

        if (done) {
            li.classList.add("done");
        }

        const taskText = document.createElement("span");
        taskText.textContent = `${task} (scheduled for ${taskTime})`;
        li.appendChild(taskText);

        const timerElement = document.createElement("p");
        timerElement.id = 'timer';
        li.appendChild(timerElement);

        function updateTimer() {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth();
            let currentYear = date.getFullYear();
            let countDownTo = new Date(`${month + 1} ${day}, ${currentYear} ${hours}:${minutes}:00`);

            let now = date.getTime();
            let distance = countDownTo - now;
            let timerHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let timerMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let timerSeconds = Math.floor((distance % (1000 * 60)) / 1000);
            timerElement.innerHTML = timerHours + "h " + timerMinutes + "m " + timerSeconds + "s ";

            if (distance < 0) {
                clearInterval(taskObj.timerInterval);
                timerElement.innerHTML = "It's time! Hurry up!";
                if (!done) { 
                    li.classList.add("flash-red");
                }
            } else {
                li.classList.remove("flash-red");
            }
        }

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        const [hours, minutes] = taskTime.split(':').map(Number);
        taskObj.timerInterval = setInterval(updateTimer, 1000);

        const markButton = document.createElement("button");
        markButton.textContent = done ? "Undo" : "Done";
        markButton.className = "mark-button";
        markButton.addEventListener("click", () => toggleTaskStatus(index));
        li.appendChild(markButton);

        function toggleTaskStatus(index) {
            tasks[index].done = !tasks[index].done;

            if (tasks[index].done) {
                clearInterval(taskObj.timerInterval); 
                counter++;
                li.classList.remove("flash-red"); 
            }

            displayTasks();
            completedTasks.textContent = `Completed tasks: ${counter}`;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteTask(index));
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        function deleteTask(index) {
            tasks.splice(index, 1);
            displayTasks();
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
}
