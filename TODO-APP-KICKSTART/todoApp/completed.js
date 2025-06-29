let tasks = [];

// Load tasks from localStorage (same key as app.js)
const loadTasks = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  updateUI();
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

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Update UI to show only completed tasks
const updateUI = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Filter tasks that are completed
  const completedTasks = tasks.filter((task) => task.completed === true);

  if (completedTasks.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="taskItem">
        <div class="task">
          <p style="color: var(--teal); text-align: center;">No completed tasks yet!</p>
        </div>
      </div>
    `;
    taskList.appendChild(li);
    return;
  }

  completedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="taskItem">
        <div class="task">
          <input type="checkbox" checked disabled />
          <p>${task.text}</p>
        </div>
        <div class="icons">
        <small style="font-size: 0.7rem; color: gray;">Last Modified: ${formatTimestamp(
          task.lastModified || task.createdAt
        )}</small>
      <img src="./img/todo.png" alt="Back to Todo" title="Back to Todo" class="action-btn" onclick="moveToTodo('${
        task.id
      }')"/>
      <img src="./img/archive.png" alt="Archive" title="Archive Task" class="action-btn" onclick="archiveTask('${
        task.id
      }')"/>
        </div>
      </div>
    `;
    taskList.appendChild(li);
  });
};

// Move task back to todo list
const moveToTodo = (id) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = false;
    tasks[taskIndex].status = "todo";
    saveTasks();
    updateUI();
    updateNavigationCounts();
    alert("Task moved back to Todo list!");
  }
};

// Archive task
const archiveTask = (id) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    const task = tasks[taskIndex];

    // Get existing archived tasks
    let archivedTasks = [];
    const savedArchived = localStorage.getItem("archivedTasks");
    if (savedArchived) {
      archivedTasks = JSON.parse(savedArchived);
    }

    // Add to archived tasks with archive date
    archivedTasks.push({
      ...task,
      status: "archived",
      archivedAt: new Date().toISOString(),
    });

    // Save archived tasks
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));

    // Remove from current tasks
    tasks.splice(taskIndex, 1);
    saveTasks();
    updateNavigationCounts();
    updateUI();
    alert("Task archived successfully!");
  }
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

// Initialize when page loads
// Display user name and avatar
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  // Check if username exists in localStorage
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
