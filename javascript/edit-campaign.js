document.addEventListener("DOMContentLoaded", async function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const campaign = JSON.parse(localStorage.getItem("editCampaign"));

  if (user.id != campaign.creator) {
    alert("You can only edit your own campaigns");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("campaignTitle").value = campaign.title;
  document.getElementById("campaignDescription").value = campaign.description;
  document.getElementById("campaignGoal").value = campaign.goalAmount;
  document.getElementById("campaignEndDate").value = campaign.endDate;
  document.getElementById("campaignPledge").value = campaign.pledgeReward;

  document.getElementById("editCampaignForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let imageBase64 = campaign.imageBase64;
    const imageInput = document.getElementById("imageInput");

    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      const base64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      imageBase64 = base64;
    }
    
    campaign.title = document.getElementById("campaignTitle").value;
    campaign.description = document.getElementById("campaignDescription").value;
    campaign.goalAmount = document.getElementById("campaignGoal").value;
    campaign.endDate = document.getElementById("campaignEndDate").value;
    campaign.pledgeReward = document.getElementById("campaignPledge").value;
    campaign.imageBase64 = imageBase64;
    campaign.isActive=false;

    const updatedData = campaign;

    const updateResponse = await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (updateResponse.ok) {
      window.alert("your campaign is being procceced")
      window.location.href = "index.html";
    }
  });
});
document.getElementById("cancelButton").addEventListener("click", function () {
  window.location.href = "index.html";
});