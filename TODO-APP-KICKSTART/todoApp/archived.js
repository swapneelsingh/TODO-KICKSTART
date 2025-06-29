let archivedTasks = [];

// Helper to format timestamp
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

// Load archived tasks from localStorage
const loadArchivedTasks = () => {
  const savedArchived = localStorage.getItem("archivedTasks");
  if (savedArchived) {
    archivedTasks = JSON.parse(savedArchived);
  }
  updateUI();
  updateNavigationCounts();
};

// Update UI to show archived tasks
const updateUI = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  if (archivedTasks.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="taskItem">
        <div class="task">
          <p style="color: var(--teal); text-align: center;">No archived tasks yet!</p>
        </div>
      </div>
    `;
    taskList.appendChild(li);
    return;
  }

  archivedTasks.forEach((task) => {
    const li = document.createElement("li");
    const archivedTime = task.archivedAt
      ? formatTimestamp(task.archivedAt)
      : "Unknown";

    li.innerHTML = `
      <div class="taskItem">
        <div class="task archived">
          <input type="checkbox" checked disabled />
          <div class="task-details">
            <p>${task.text}</p>
            <small style="color: gray; font-size: 0.7rem;">
              Archived On: ${archivedTime}
            </small>
          </div>
        </div>
      </div>
    `;
    taskList.appendChild(li);
  });
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

window.addEventListener("DOMContentLoaded", () => {
  loadArchivedTasks();
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
