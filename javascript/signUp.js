const fNameInput = document.getElementById("fName");
const sNameInput = document.getElementById("sName");
const emailInput = document.getElementById("emailSign");
const passInput = document.getElementById("passSign");
const signupBtn = document.getElementById("signupBtn");

const errorMsg = document.createElement("p");
errorMsg.textContent = "Please fill in all fields";
errorMsg.style.color = "magma";
errorMsg.style.display = "none";
passInput.insertAdjacentElement("afterend", errorMsg);

signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (
    !fNameInput.value ||
    !sNameInput.value ||
    !emailInput.value ||
    !passInput.value
  ) {
    errorMsg.style.display = "block";
    return;
  }
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();

  const emailExists = users.find((user) => user.email === emailInput.value);

  if (emailExists) {
    errorMsg.textContent = "Email already exists";
    errorMsg.style.display = "block";
    return;
  }

  const newUser = {
    firstName: fNameInput.value,
    secondName: sNameInput.value,
    email: emailInput.value,
    password: passInput.value,
    isActive: true,
    type: "user",
  };

  const createResponse = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(newUser),
  });

  if (createResponse.ok) {
    window.location.href = "login.html";
  }
});
