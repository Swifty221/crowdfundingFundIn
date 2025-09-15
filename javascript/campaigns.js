function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

var user = getCurrentUser();
var creatorId = user.id;
var creatorName = user.name;
console.log(user.name);

const titleInput = document.getElementById("campaingName");
const descriptionInput = document.getElementById("campaingDes");
const goalInput = document.getElementById("campaingGoal");
const endDateInput = document.getElementById("campaingEnd");
const pledgeInput = document.getElementById("campaingPledge");
const imageInput = document.getElementById("imageInput");
const campaignForm = document.getElementById("campaignForm");

const errorMsg = document.createElement("div");
errorMsg.style.display = "none";
errorMsg.style.color = "red";
campaignForm.appendChild(errorMsg);

const getBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

async function createCampaign(event) {
  event.preventDefault();

  errorMsg.style.display = "none";

  if (!titleInput.value || !descriptionInput.value || !goalInput.value) {
    errorMsg.textContent = "Please fill all required fields";
    errorMsg.style.display = "block";
    return;
  }

  let base64Image;
  base64Image = await getBase64(imageInput.files[0]);
  const response = await fetch("http://localhost:3000/campaigns");
  const campaigns = await response.json();

  const titleExists = campaigns.find(
    (campaign) => campaign.title === titleInput.value
  );

  if (titleExists) {
    errorMsg.textContent = "Campaign title already exists";
    errorMsg.style.display = "block";
    return;
  }

  const newCampaign = {
    title: titleInput.value,
    description: descriptionInput.value,
    goalAmount: goalInput.value,
    endDate: endDateInput.value,
    pledgeReward: pledgeInput.value,
    creator: creatorId,
    User: creatorName,
    imageBase64: base64Image,
    isActive: false,
    pldgeAmount: "0",
  };

  const createResponse = await fetch("http://localhost:3000/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCampaign),
  });

  if (createResponse.ok) {
    window.alert("Your Campaign is under proccess");
    window.location.href = "index.html";
  }
}

campaignForm.addEventListener("submit", createCampaign);


