// CURRENT USER 
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "signin.html";
}

document.getElementById("username").textContent = currentUser.name;


//ROLE BASED UI
if (currentUser.role !== "admin") {
  document.querySelector(".admin-panel").style.display = "none";
}

if (currentUser.role !== "manager" && currentUser.role !== "admin") {
  document.querySelector(".manager-panel").style.display = "none";
}


// LOAD DATA 
let groceryList = JSON.parse(localStorage.getItem("grocery")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];


//  DEMO USERS
if (users.length === 0) {
  users.push(
    { name: "Aasim" },
    { name: "Sahil" },
    { name: "Rohan" }
  );
  localStorage.setItem("users", JSON.stringify(users));
}


// SHOW USERS
function showUsers() {
  const ul = document.getElementById("userList");
  ul.innerHTML = "";

  users.forEach((user, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${user.name}
      ${
        currentUser.role === "admin"
          ? `<button onclick="removeUser(${index})">❌</button>`
          : ""
      }
    `;

    ul.appendChild(li);
  });
}


//REMOVE SINGLE USER
function removeUser(index) {
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();

  showToast("User removed ❌", "info");
}


// SHOW GROCERY
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


// ADD ITEM 
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


//  DELETE ITEM 
function deleteItem(index) {
  groceryList.splice(index, 1);
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();

  showToast("Item removed ❌", "info");
}


// CLEAR LIST (MANAGER) 
function clearList() {
  groceryList = [];
  localStorage.setItem("grocery", JSON.stringify(groceryList));
  showItems();

  showToast("All items cleared 🧹", "error");
}


//  DELETE ALL USERS (ADMIN) 
function deleteUsers() {
  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();

  showToast("All users deleted ⚠️", "error");
}


// LOGOUT 
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "signin.html";
}


// TOAST
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}


// INIT
document.addEventListener("DOMContentLoaded", () => {
  showUsers();
  showItems();
});