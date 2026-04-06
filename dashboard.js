const currentUser = JSON.parse(localStorage.getItem("currentUser"));
document.getElementById("username").textContent = currentUser.name;
// safety check
if (!currentUser) {
  window.location.href = "signin.html";
}
// ROLE BASED UI CONTROL

if (currentUser.role !== "admin") {
  document.querySelector(".admin-panel").style.display = "none";
}

if (currentUser.role !== "manager" && currentUser.role !== "admin") {
  document.querySelector(".manager-panel").style.display = "none";
}

// LOAD DATA

let groceryList = JSON.parse(localStorage.getItem("grocery")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

// demo user add
if (users.length === 0) {
  users.push("Aasim", "Sahil", "Rohan");
  localStorage.setItem("users", JSON.stringify(users));
}


// DISPLAY USERS

function showUsers() {
  const ul = document.getElementById("userList");
  ul.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    ul.appendChild(li);
  });
}


// DISPLAY GROCERY

function showItems() {
  const ul = document.getElementById("groceryList");
  ul.innerHTML = "";

  groceryList.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item}
      <button onclick="deleteItem(${index})">❌</button>
    `;
    ul.appendChild(li);
  });
}

// ========================
// ADD ITEM
// ========================
function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (!value) return;

  groceryList.push(value);
  localStorage.setItem("grocery", JSON.stringify(groceryList));

  input.value = "";
  showItems();
}

// ========================
// DELETE ITEM
// ========================
function deleteItem(index) {
  groceryList.splice(index, 1);
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();
}

// ========================
// MANAGER PANEL
// ========================
function clearList() {
  groceryList = [];
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();
}

// ADMIN PANEL
function deleteUsers() {
  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();
}


// LOGOUT
function logout() {
  window.location.href = "signin.html";
}

// TOAST FUNCTION

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  // show animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // auto remove
  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (!value) {
    showToast("Please enter item!", "error");
    return;
  }

  groceryList.push(value);
  localStorage.setItem("grocery", JSON.stringify(groceryList));

  input.value = "";
  showItems();

  showToast("Item added successfully ✅", "success");
}
function deleteItem(index) {
  groceryList.splice(index, 1);
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();

  showToast("Item removed ❌", "info"); // ✅ yaha
}
function clearList() {
  groceryList = [];
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();

  showToast("All items cleared 🧹", "error"); // ✅ yaha
}
function deleteUsers() {
  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();

  showToast("All users deleted ⚠️", "error"); // ✅ yaha
}
// INIT
showUsers();
showItems();