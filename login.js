// SELECT FORM
const form = document.querySelector(".form");
const page = document.title.toLowerCase();


// ================= SIGN UP =================
if (form && page.includes("sign up")) {

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll(".input");

    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[3].value;
    const confirmPassword = inputs[4].value;
    const role = document.getElementById("role")?.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(u => u.email === email);
    if (exists) {
      alert("User already exists!");
      return;
    }

    users.push({ name, email, password, role });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created!");
    window.location.href = "signin.html";
  });
}


// ================= ROLE ICON =================
const roleSelect = document.getElementById("role");
const roleIcon = document.getElementById("roleIcon");

if (roleSelect && roleIcon) {
  roleSelect.addEventListener("change", () => {
    const value = roleSelect.value;

    if (value === "user") {
      roleIcon.innerHTML = `<span class="material-symbols-outlined eye-logo">person</span>`;
    } 
    else if (value === "manager") {
      roleIcon.innerHTML = `<span class="material-symbols-outlined eye-logo">badge</span>`;
    } 
    else if (value === "admin") {
      roleIcon.innerHTML = `<span class="material-symbols-outlined eye-logo">admin_panel_settings</span>`;
    }
  });
}


// ================= SIGN IN =================
if (form && (page.includes("login") || page.includes("sign in"))) {

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll(".input");

    const email = inputs[0].value;
    const password = inputs[1].value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("Invalid credentials!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
}


// ================= FORGOT PASSWORD =================
if (form && page.includes("forgot")) {

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector(".input").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(u => u.email === email);

    if (!foundUser) {
      alert("Email not found!");
      return;
    }

    alert("Reset link sent! (demo)");
  });
}


// EYE TOGGLE 
const eyeIcons = document.querySelectorAll(".eye-logo");

eyeIcons.forEach(icon => {
  icon.addEventListener("click", () => {

    // safer way to find input
    const input = icon.parentElement.querySelector("input");

    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "visibility_off"; // icon change
    } else {
      input.type = "password";
      icon.textContent = "visibility";
    }
  });
});