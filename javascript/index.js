function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return JSON.parse(raw);
}
function viewCampaignDetails(campaignId) {
    localStorage.setItem("selectedCampaignId", campaignId);
    window.location.href = "campaign-details.html";
}

var user = getCurrentUser();
console.log(user.name);
console.log(user.id);

const searchBar = document.getElementById('searchBar');

async function loadCampaigns() {
  const response = await fetch("http://localhost:3000/campaigns");
  const campaigns = await response.json();

  const projectsContainer = document.querySelector(".projects-cards");
  projectsContainer.innerHTML = "";

  campaigns.forEach((campaign) => {
    if (campaign.isActive === true) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";
      cardDiv.innerHTML = `
      <img src="${campaign.imageBase64}" class="card-img" />
      <a href="#" onclick="viewCampaignDetails('${campaign.id}')">${campaign.title}</a>
      <p>by ${campaign.User}</p>
      <p>${campaign.pldgeAmount}$ raised of ${campaign.goalAmount}$</p>
      <p>End date: ${campaign.endDate}</p>
    `;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit details";
      const pledgeBtn = document.createElement("button");
      pledgeBtn.textContent = "Pledge";
      if (user.id != campaign.creator) {
        editBtn.className = "hidden";
      } else {
        pledgeBtn.className = "hidden";
      }
      editBtn.addEventListener("click", function () {
        localStorage.setItem("editCampaign", JSON.stringify(campaign));
        window.location.href = "edit-campaign.html";
      });
      pledgeBtn.addEventListener("click", async function () {
        if (user.id !== campaign.creator) {
          let amountStr = prompt("Enter pledge amount: ");
          let amount = Number(amountStr);

          let currentAmount = Number(campaign.pldgeAmount);
          campaign.pldgeAmount = currentAmount + amount;

          await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaign),
          });
        }
      });

      projectsContainer.appendChild(cardDiv);
      cardDiv.appendChild(editBtn);
      cardDiv.appendChild(pledgeBtn);
    }
  });
}
async function searchCampaigns() {
  const search = searchBar.value.toLowerCase();
  
  const response = await fetch('http://localhost:3000/campaigns');
  const campaigns = await response.json();
  
  const filtered = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(search)
  );

  displayCampaigns(filtered);
}

searchBar.addEventListener('input', searchCampaigns);

function displayCampaigns(campaigns) {
  const projectsContainer = document.querySelector('.projects-cards');
  projectsContainer.innerHTML = '';

  campaigns.forEach((campaign) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      cardDiv.innerHTML = `
        <img src="${campaign.imageBase64}" class="card-img" />
        <a href="#" onclick="viewCampaignDetails('${campaign.id}')">${campaign.title}</a>
        <p>by ${campaign.User}</p>
        <p>$${campaign.pldgeAmount} raised of $${campaign.goalAmount}</p>
        <p>End date: ${campaign.endDate}</p>
      `;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit details";
      
      const pledgeBtn = document.createElement("button");
      pledgeBtn.textContent = "Pledge";
      
      if (user.id != campaign.creator) {
        editBtn.className = "hidden";
      } else {
        pledgeBtn.className = "hidden";
      }
      
      editBtn.addEventListener("click", function () {
        localStorage.setItem("editCampaign", JSON.stringify(campaign));
        window.location.href = "edit-campaign.html";
      });
      
      pledgeBtn.addEventListener("click", async function () {
        if (user.id !== campaign.creator) {
          let amountStr = prompt("Enter pledge amount: ");
          let amount = Number(amountStr);

          let currentAmount = Number(campaign.pldgeAmount);
          campaign.pldgeAmount = currentAmount + amount;

          await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaign),
          });
        }
      });
      cardDiv.appendChild(editBtn);
      cardDiv.appendChild(pledgeBtn);
      projectsContainer.appendChild(cardDiv);
  });
}

document.addEventListener("DOMContentLoaded", loadCampaigns);

document.getElementById("viewMore").addEventListener("click", function () {
  window.location.href = "projects.html";
});
