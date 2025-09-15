const emailInput = document.getElementById("emailLog");
const passInput  = document.getElementById("passLog");
const loginBtn   = document.querySelector("button");
const errorMsg   = document.createElement("p");
errorMsg.style.color = "magma";
errorMsg.style.display = "none";
passInput.after(errorMsg);


loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const res   = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const u = users.find(
    x => x.email === emailInput.value.trim() && x.password === passInput.value
  );

  if (!u) {
    errorMsg.textContent = "Invalid email or password";
    errorMsg.style.display = "block";
    return;
  }
  if (!u.isActive) {
    errorMsg.textContent = "Your account has been banned contact our support";
    errorMsg.style.display = "block";
    return;
  }


  localStorage.setItem("currentUser", JSON.stringify({
    id   : u.id,
    name : `${u.firstName} ${u.secondName}`,
    email: u.email,
    type : u.type
  }));

  const dest = u.type === "admin"? "dashboard.html" : "index.html";
  window.location.href=dest;            
});
