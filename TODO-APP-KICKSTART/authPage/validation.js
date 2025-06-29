const form = document.getElementById("form");
const firstname_input = document.getElementById("firstname-input");
const dob_input = document.getElementById("dob-input"); // Date of Birth input
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const repeat_password_input = document.getElementById("repeat-password-input");
const error_message = document.getElementById("error-message");
const currentPage = window.location.pathname.includes("login")
  ? "login"
  : "index";

// Form submit
form.addEventListener("submit", (e) => {
  let errors = [];
  e.preventDefault();

  if (currentPage === "index") {
    errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      repeat_password_input.value,
      dob_input.value
    );

    if (errors.length === 0) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already exists
      const alreadyExists = users.some(
        (user) => user.email === email_input.value
      );
      if (alreadyExists) {
        errors.push(
          "Email is already registered. Please use a different email."
        );
        email_input.parentElement.classList.add("incorrect");
      } else {
        // Save new user
        const newUser = {
          firstname: firstname_input.value,
          email: email_input.value,
          password: password_input.value,
          dob: dob_input.value,
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        window.location.href = "login.html";
      }
    }
  } else if (currentPage === "login") {
    errors = getLoginFormErrors(email_input.value, password_input.value);
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (user) =>
        user.email === email_input.value &&
        user.password === password_input.value
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.href = "todo.html";
    } else {
      errors.push("Invalid email or password");
      email_input.parentElement.classList.add("incorrect");
      password_input.parentElement.classList.add("incorrect");
    }
  }

  if (errors.length > 0) {
    error_message.innerText = errors.join(". ");
  }
});

function getSignupFormErrors(firstname, email, password, repeatPassword, dob) {
  let errors = [];

  if (firstname === "" || firstname == null) {
    errors.push("Firstname is required");
    firstname_input.parentElement.classList.add("incorrect");
  }
  if (email === "" || email == null) {
    errors.push("Email is required");
    email_input.parentElement.classList.add("incorrect");
  }
  if (password === "" || password == null) {
    errors.push("Password is required");
    password_input.parentElement.classList.add("incorrect");
  }
  if (password.length < 8) {
    errors.push("Password must have at least 8 characters");
    password_input.parentElement.classList.add("incorrect");
  }
  if (password !== repeatPassword) {
    errors.push("Password does not match repeated password");
    password_input.parentElement.classList.add("incorrect");
    repeat_password_input.parentElement.classList.add("incorrect");
  }

  if (!dob || !isAgeValid(dob)) {
    errors.push("You must be 10 years or older to sign up");
    dob_input.parentElement.classList.add("incorrect");
  }

  return errors;
}

function isAgeValid(dob) {
  const dobDate = new Date(dob);
  const age = calculateAge(dobDate);
  return age >= 10;
}

function calculateAge(dobDate) {
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const month = today.getMonth();
  if (
    month < dobDate.getMonth() ||
    (month === dobDate.getMonth() && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }
  return age;
}

function getLoginFormErrors(email, password) {
  let errors = [];
  if (email === "" || email == null) {
    errors.push("Email is required");
    email_input.parentElement.classList.add("incorrect");
  }
  if (password === "" || password == null) {
    errors.push("Password is required");
    password_input.parentElement.classList.add("incorrect");
  }
  return errors;
}

dob_input.addEventListener("input", () => {
  const dob = dob_input.value;
  const age = calculateAge(new Date(dob));

  if (age < 10) {
    dob_input.parentElement.classList.add("incorrect");
    error_message.innerText = "You must be 10 years or older to sign up";
  } else {
    dob_input.parentElement.classList.remove("incorrect");
    error_message.innerText = "";
  }
});

// Reset errors on typing
const allInputs = [
  firstname_input,
  email_input,
  password_input,
  repeat_password_input,
  dob_input,
].filter((input) => input != null);

allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.parentElement.classList.contains("incorrect")) {
      input.parentElement.classList.remove("incorrect");
      error_message.innerText = "";
    }
  });
});
