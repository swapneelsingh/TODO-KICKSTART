let tasks = [];
let editingIndex = null;

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Display user name and avatar
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateNavigationCounts();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.firstname) {
    // Set the user's name
    document.getElementById("userFirstname").textContent =
      currentUser.firstname;

    // Set the avatar using the UI Avatars API
    const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${currentUser.firstname}`;
    document.getElementById("userAvatar").src = avatarUrl;
  }

  // Sign out functionality
  document.getElementById("signOutBtn").addEventListener("click", () => {
    // Clear localStorage
    localStorage.removeItem("tasks");
    localStorage.removeItem("archivedTasks");
    window.location.href = "login.html";
  });

  // Load tasks
});

const loadTasks = async () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    // First visit, load dummy data
    await fetchDummyTodos();
  }
  updateTasksList();
  updateStats();
};

const formatTimestamp = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

const fetchDummyTodos = async () => {
  try {
    const response = await fetch("https://dummyjson.com/todos?limit=5");
    const data = await response.json();

    // Transform the API data to match your task object structure
    tasks = data.todos.map((todo) => ({
      text: todo.todo, // Use the "todo" field
      completed: false, // Ignore the "completed" field, default it to false
      status: "todo", // Default status is "todo"
      id: crypto.randomUUID(), // Generate a unique ID
      createdAt: new Date().toISOString(), // Add a timestamp for creation
    }));

    // Save to localStorage
    saveTasks();
  } catch (error) {
    console.error("Failed to fetch dummy todos:", error);
  }
};

// const addTask = () => {
//   const taskInput = document.getElementById("taskInput");
//   const taskText = taskInput.value.trim();

//   if (taskText) {
//     tasks.push({ text: taskText, completed: false });
//     taskInput.value = "";
//     updateTasksList();
//   }
// };

///////////////////////////////////////////////\

// const addTask = () => {
//   const taskInput = document.getElementById("taskInput");
//   const taskText = taskInput.value.trim();

//   if (taskText) {
//     if (editingIndex !== null) {
//       tasks[editingIndex].text = taskText;
//       asks[editingIndex].lastModified = now;
//       editingIndex = null;
//       document.getElementById("newTask").textContent = "+";
//     } else {
//       tasks.push({
//         text: taskText,
//         completed: false,
//         status: "todo",
//         id: crypto.randomUUID(), // or any unique id
//         createdAt: new Date().toISOString(),
//       });
//     }

//     taskInput.value = "";
//     updateTasksList();
//     updateStats();
//     saveTasks();
//   }
// };

const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText) {
    const now = new Date().toISOString();

    if (editingIndex !== null) {
      tasks[editingIndex].text = taskText;
      tasks[editingIndex].lastModified = now;
      editingIndex = null;
      // Reset button text to "+"
      document.getElementById("newTask").textContent = "+";
    } else {
      tasks.push({
        text: taskText,
        completed: false,
        status: "todo",
        id: crypto.randomUUID(),
        createdAt: now,
        lastModified: now,
      });
    }

    taskInput.value = "";
    updateTasksList();
    updateNavigationCounts();
    updateStats();
    saveTasks();
  }
};

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  // Update status accordingly
  tasks[index].status = tasks[index].completed ? "completed" : "todo";
  // Update task item class to reflect the completed status
  // ✅ Update the last modified timestamp
  tasks[index].lastModified = new Date().toISOString();
  const taskItem = document.querySelectorAll(".taskItem")[index];
  const taskText = taskItem.querySelector(".task p");

  if (tasks[index].completed) {
    taskText.classList.add("completed");
  } else {
    taskText.classList.remove("completed");
  }

  updateTasksList();
  updateStats();
  updateNavigationCounts();
  console.log({ tasks });
  saveTasks();
};

const deleteTask = (index) => {
  if (editingIndex === index) {
    editingIndex = null;
    document.getElementById("newTask").textContent = "+";
  }
  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  updateNavigationCounts();
  saveTasks();
};

// const editTask = (index) => {
//     const taskInput = document.getElementById("taskInput");
//     taskInput.value = tasks[index].text;
//     tasks.splice(index, 1);
//     updateTasksList();
// };
const editTask = (index) => {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = tasks[index].text;
  editingIndex = index; // don't remove it; just remember where

  // Change button text to "Update"
  const newTaskBtn = document.getElementById("newTask");
  newTaskBtn.innerHTML = `<img src="./img/update.svg" alt="Edit" style="width:24px; height:24px;" />`;

  newTaskBtn.style.fontSize = "1rem";
  updateTasksList();
  saveTasks();
};

const updateTasksList = () => {
  const tasksList = document.getElementById("task-list");

  tasksList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${
                      task.completed ? "checked" : ""
                    } />
                    <p>${task.text}</p>
                    
                </div>
                <div class="icons">
                    <small style="color: gray; font-size: 0.7rem;">Last Modified: ${formatTimestamp(
                      task.lastModified || task.createdAt
                    )}</small>
                    <img src="./img/edit (1).png" alt="Edit" onClick= "editTask(${index})"/>
                    <img src="./img/delete (1).png" alt="Delete" onClick= "deleteTask(${index})" />
                    <img src="./img/archive.png" alt="Archive" title="Archive Task" class="action-btn" onclick="archiveTask('${index}')"/>
                </div>
            </div>
        `;
    listItem.addEventListener("change", () => toggleTaskComplete(index));
    tasksList.appendChild(listItem);
  });
};

const updateStats = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;
  document.getElementById(
    "numbers"
  ).innerHTML = `${completedTasks} / ${totalTasks}`;
  // Add task button functionality
  document.getElementById("newTask").addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
  });
};

// Archive task
const archiveTask = (index) => {
  const task = tasks[index];

  // Save the task to archived tasks
  let archivedTasks = JSON.parse(localStorage.getItem("archivedTasks")) || [];
  archivedTasks.push({
    ...task,
    status: "archived",
    archivedAt: new Date().toISOString(),
  });

  // Remove task from current tasks
  tasks.splice(index, 1);

  // Save updated tasks and archived tasks
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));

  // Update UI
  updateTasksList();
  updateNavigationCounts();
  updateStats();
  alert("Task archived successfully!");
};

let updateCountTimeout;

function updateNavigationCounts() {
  // Cancel any pending update
  clearTimeout(updateCountTimeout);

  // Delay the actual update slightly
  updateCountTimeout = setTimeout(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const todoCount = tasks.filter((task) => task.status === "todo").length;
    const completedCount = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const archivedCount = tasks.filter(
      (task) => task.status === "archived"
    ).length;

    const todoEl = document.getElementById("todo-count");
    const completedEl = document.getElementById("completed-count");
    const archivedEl = document.getElementById("archived-count");

    if (todoEl) todoEl.textContent = todoCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (archivedEl) archivedEl.textContent = archivedCount;
  }, 100); // Adjust delay if needed
}

document.getElementById("newTask").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});
