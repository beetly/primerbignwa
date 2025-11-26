// Initialize sample packages from localStorage or defaults
let packages = JSON.parse(localStorage.getItem("packages")) || [
  { id: 1, name: "250MB Bundle", data: "250MB", validity: "24 hours", provider: "Safaricom", type: "data", price: 20 },
  { id: 2, name: "1GB Bundle", data: "1GB", validity: "1 hour", provider: "Safaricom", type: "data", price: 19 },
  { id: 3, name: "1.25GB Bundle", data: "1.25GB", validity: "Till midnight", provider: "Safaricom", type: "data", price: 55 },
  { id: 4, name: "100 Airtime", data: "100 Credit", validity: "30 days", provider: "Safaricom", type: "airtime", price: 100 },
  { id: 5, name: "250 Airtime", data: "250 Credit", validity: "30 days", provider: "Safaricom", type: "airtime", price: 250 },
  { id: 6, name: "20 Minutes", data: "20 Mins", validity: "Till midnight", provider: "Safaricom", type: "minutes", price: 21 },
  { id: 7, name: "50 Minutes", data: "50 Mins", validity: "Till midnight", provider: "Safaricom", type: "minutes", price: 51 }
];

const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const paymentModal = document.getElementById("paymentModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let selectedPackage = null;

// Render packages by category
function renderAllPackages() {
  const dataGrid = document.getElementById("dataBundlesGrid");
  const airtimeGrid = document.getElementById("airtimeGrid");
  const minutesGrid = document.getElementById("minutesGrid");

  dataGrid.innerHTML = "";
  airtimeGrid.innerHTML = "";
  minutesGrid.innerHTML = "";

  packages.forEach(pkg => {
    const card = createPackageCard(pkg);
    
    if (pkg.type === "data") {
      dataGrid.appendChild(card);
    } else if (pkg.type === "airtime") {
      airtimeGrid.appendChild(card);
    } else if (pkg.type === "minutes") {
      minutesGrid.appendChild(card);
    }
  });
}

// Create a package card element
function createPackageCard(pkg) {
  const card = document.createElement("div");
  card.className = "package-card";
  card.innerHTML = `
    <div class="package-header">
      <h3 class="package-name">${pkg.name}</h3>
      <span class="package-provider">${pkg.provider}</span>
    </div>
    <div class="package-details">
      <p class="package-amount"><strong>${pkg.data}</strong></p>
      <p class="package-validity">Valid: ${pkg.validity}</p>
    </div>
    <div class="package-footer">
      <p class="package-price">Ksh ${pkg.price}</p>
      <button class="btn btn-buy" onclick="openPaymentModal(${pkg.id})">Buy Now</button>
    </div>
  `;
  return card;
}

// Open payment modal
function openPaymentModal(id) {
  selectedPackage = packages.find(p => p.id === id);
  if (!selectedPackage) return;
  
  document.getElementById("selectedPkg").textContent = `${selectedPackage.name} - Ksh ${selectedPackage.price}`;
  document.getElementById("phoneInput").value = "";
  checkoutMessage.textContent = "";
  paymentModal.classList.remove("hidden");
}

// Close payment modal
function closePaymentModal() {
  paymentModal.classList.add("hidden");
  selectedPackage = null;
  checkoutMessage.textContent = "";
}

// Handle payment form submission
checkoutForm.addEventListener("submit", async e => {
  e.preventDefault();

  if (!selectedPackage) {
    checkoutMessage.textContent = "Please select a package first.";
    return;
  }

  const phone = document.getElementById("phoneInput").value.trim();
  if (!phone || phone.length < 9) {
    checkoutMessage.textContent = "Enter a valid phone number.";
    return;
  }

  // Call backend /stkpush endpoint instead of direct Safaricom
  try {
    checkoutMessage.textContent = "Processing payment...";

    const response = await axios.post("/stkpush", {
      phone: phone,
      amount: selectedPackage.price
    });

    if (response.data.ResponseCode === "0") {
      checkoutMessage.textContent = `Success! Payment prompt sent to ${phone}. Confirm to complete purchase.`;
    } else {
      checkoutMessage.textContent = "Payment request failed. Try again.";
    }
  } catch (error) {
    console.error(error);
    checkoutMessage.textContent = "Error initiating payment. Please try again later.";
  }

  setTimeout(closePaymentModal, 2000);
});

// Modal close button event listener
closeModalBtn.addEventListener("click", closePaymentModal);

// Close modal when clicking outside
paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) {
    closePaymentModal();
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", renderAllPackages);
