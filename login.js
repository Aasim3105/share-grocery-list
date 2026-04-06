// SELECT ELEMENTS

const form = document.querySelector(".form");

// PAGE DETECTION

const page = document.title.toLowerCase();


// SIGN UP (MULTIPLE USERS)


if (page.includes("sign up")) {

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll(".input");

    const name = inputs[0].value;
    const email = inputs[1].value;
    const roll = inputs[2].value;
    const password = inputs[3].value;
    const confirmPassword = inputs[4].value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // get existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if user already exists
    const exists = users.find(u => u.email === email);
    if (exists) {
      alert("User already exists!");
      return;
    }

    // add new user
    users.push({ name, email, password, role });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created!");
    window.location.href = "signin.html";

  });
}


// INPUT USER,ADMIN, MANAGER ICON
const  rollSelect = document.getElementById("role")
const roleIcon = document.getElementById("roleIcon");

rollSelect.addEventListener("change", () => {
  const value = rollSelect.value;

  if (value === "user") {
    roleIcon.innerHTML =`  <svg class="icon" viewBox="0 0 24 24" width="20" height="20">
  <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-2.7-5.3-4-8-4zm8 0c-.3 0-.7 0-1 .1 1.3 1 2 2.2 2 3.9v2h7v-2c0-2.7-5.3-4-8-4z"/>
</svg>`;
  }

  else if (value === "manager") {
    roleIcon.innerHTML =`<svg class="icon" viewBox="0 0 24 24" width="20" height="20">
  <path d="M12 2l8 4v6c0 5.3-3.4 10.2-8 12-4.6-1.8-8-6.7-8-12V6l8-4z"/>
</svg>`;
  }

  else if (value === "admin") {
    roleIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24" width="20" height="20">
  <path d="M5 16l-2-9 5 4 4-7 4 7 5-4-2 9H5zm0 2h14v2H5v-2z"/>
</svg>`;
  }
});


// SIGN IN (MULTI USER)

if (page.includes("login") || page.includes("sign in")) {

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

    // save current logged in user
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
}


// FORGOT PASSWORD LOGIC

if (page.includes("forgot")) {

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector(".input").value;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No account found!");
      return;
    }

    if (email === storedUser.email) {
      alert("Reset link sent! (demo only)");
    } else {
      alert("Email not found!");
    }
  });
}

// PASSWORD SHOW / HIDE

const eyeIcons = document.querySelectorAll(".eye-logo");

eyeIcons.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  });
});