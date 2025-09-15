async function loadUsers() {
  const res = await fetch('http://localhost:3000/users');
  users = await res.json();
  updateDisplay();
}

function updateDisplay() {
  showStats();
  showUsers();
}

function showStats() {
  const activeCount = users.filter(u => u.isActive).length;
  document.getElementById('total').textContent = users.length;
  document.getElementById('active').textContent = activeCount;
  document.getElementById('inactive').textContent = users.length - activeCount;
}

async function toggleStatus(id) {
  const res = await fetch(`http://localhost:3000/users/${id}`);
  const user = await res.json();
  if(user.type == "user"){
    user.isActive = !user.isActive;
  }
  
  await fetch(`http://localhost:3000/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  
  loadUsers();
}

async function deleteUser(id) {
  if (confirm('Delete this user?')) {
    await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
    loadUsers();
  }
}

function showUsers() {
  const tbody = document.getElementById('users');
  let rows = '';
  
  users.forEach(u => {
    rows += `
      <tr>
        <td>${u.firstName} ${u.secondName}</td>
        <td>${u.email}</td>
        <td>
          <button class="status-btn ${u.isActive ? 'active' : 'inactive'}" 
                  onclick="toggleStatus('${u.id}')">
            ${u.isActive ? 'Active' : 'Inactive'}
          </button>
        </td>
        <td>
          <button class="delete-btn" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = rows;
}

document.addEventListener('DOMContentLoaded', loadUsers);

document.getElementById('userDisplay').addEventListener('click', function() {
  updateDisplay();
});
