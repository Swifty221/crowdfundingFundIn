function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return JSON.parse(raw);
}
var user = getCurrentUser();
console.log(user.name);
console.log(user.id);
document.addEventListener("DOMContentLoaded", async function () {
  const campaignId = localStorage.getItem("selectedCampaignId");
  
  const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`);
  const campaign = await response.json();
  console.log(campaign.creator);
  document.getElementById("campaignImage").src = campaign.imageBase64;
  document.getElementById("campaignTitle").textContent = campaign.title;
  document.getElementById(
    "campaignCreator"
  ).textContent = `by ${campaign.User}`;
  document.getElementById("campaignDescription").textContent =
    campaign.description;
  document.getElementById(
    "campaignGoal"
  ).textContent = `$${campaign.pldgeAmount} raised of $${campaign.goalAmount}`;
  document.getElementById("campaignEndDate").textContent = campaign.endDate;
  document.getElementById("campaignReward").textContent = campaign.pledgeReward;
  const editBtn = document.getElementById("edit")
  editBtn.addEventListener('click', function() {
      localStorage.setItem('editCampaign', JSON.stringify(campaign));
      window.location.href = 'edit-campaign.html';
    });
    if (user.id != campaign.creator) {
    editBtn.className = "hidden";
  }
  const pledge = document.querySelector("button");
  if (user.id === campaign.creator) {
    pledge.className = "hidden";
  }
  console.log(campaign.pldgeAmount,campaign.goalAmount)
  pledge.addEventListener("click", async function () {
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
});
