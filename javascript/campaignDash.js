async function loadCampaigns() {
  const res = await fetch('http://localhost:3000/campaigns');
  campaigns = await res.json();
  updateDisplay();
}

function updateDisplay() {
  showStats();
  showCampaigns();
}

function showStats() {
  const activeCount = campaigns.filter(c => c.isActive).length;
  document.getElementById('total').textContent = campaigns.length;
  document.getElementById('active').textContent = activeCount;
  document.getElementById('inactive').textContent = campaigns.length - activeCount;
}

function showCampaigns() {
  const tbody = document.getElementById('campaigns');
  let rows = '';
  
  campaigns.forEach(c => {
    rows += `
      <tr>
        <td>${c.title}</td>
        <td>$${c.goalAmount}</td>
        <td>${c.endDate}</td>
        <td>${c.User}</td>
        <td>
          <button class="status-btn ${c.isActive ? 'active' : 'inactive'}" 
                  onclick="toggleStatus('${c.id}')">
            ${c.isActive ? 'Active' : 'Inactive'}
          </button>
        </td>
        <td>
          <button class="delete-btn" onclick="deleteCampaign('${c.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = rows;
}

async function toggleStatus(id) {
  const res = await fetch(`http://localhost:3000/campaigns/${id}`);
  const campaign = await res.json();
  
  campaign.isActive = !campaign.isActive;
  
  await fetch(`http://localhost:3000/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign)
  });
  
  loadCampaigns();
}

async function deleteCampaign(id) {
  if (confirm('Delete this campaign?')) {
    await fetch(`http://localhost:3000/campaigns/${id}`, { method: 'DELETE' });
    loadCampaigns();
  }
}

document.addEventListener('DOMContentLoaded', loadCampaigns);

document.getElementById('campaignDisplay').addEventListener('click', function() {
  updateDisplay();
});
