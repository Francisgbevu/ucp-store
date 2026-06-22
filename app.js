// ⚡ 1. DOM SELECTORS — Pinpointing our display and input nodes
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const checkoutBtn = document.getElementById('checkout-btn');

// New Input Elements and Error Node Selectors
const nameInput = document.getElementById('customer-name');
const addressInput = document.getElementById('customer-address');
const nameError = document.getElementById('name-error');
const addressError = document.getElementById('address-error');

// 📊 2. APPLICATION STATE
const cartState = {
    sneaker: { name: "Premium Canvas Sneaker", price: 350.00, quantity: 0 },
    tee: { name: "Vintage Graphic Tee", price: 180.00, quantity: 0 }
};

// 🎨 3. RENDER ENGINE — Syncs memory quantities to the screen visual tags
function renderUI() {
    let totalItems = 0;
    let totalCash = 0;

    for (const key in cartState) {
        const item = cartState[key];
        totalItems += item.quantity;
        totalCash += item.quantity * item.price;

        const card = document.querySelector(`[data-id="${key}"]`);
        if (card) {
            card.querySelector('.qty-count').innerText = item.quantity;
        }
    }

    cartCountEl.innerText = totalItems;
    cartTotalEl.innerText = `GHS ${totalCash.toFixed(2)}`;
}

// 🛠️ 4. STATE MUTATION ENGINE — Handles plus and minus clicks safely
productGrid.addEventListener('click', (event) => {
    const target = event.target;
    const isPlus = target.classList.contains('plus-btn');
    const isMinus = target.classList.contains('minus-btn');
    
    if (!isPlus && !isMinus) return;

    const productCard = target.closest('.product-card');
    const productId = productCard.getAttribute('data-id');

    if (isPlus) {
        cartState[productId].quantity += 1;
    } else if (isMinus) {
        if (cartState[productId].quantity > 0) {
            cartState[productId].quantity -= 1;
        }
    }

    renderUI();
});

// 🚀 5. ADVANCED VALIDATION & OUTBOUND WHATSAPP ROUTING
checkoutBtn.addEventListener('click', () => {
    // Clear out any old error messages from previous attempts
    nameError.innerText = "";
    addressError.innerText = "";

    // --- 🔍 STEP A: SANITIZE AND VALIDATE USER INPUTS ---
    const customerName = nameInput.value.trim();
    const customerAddress = addressInput.value.trim();
    let isFormValid = true;

    if (customerName === "") {
        nameError.innerText = "Chale, please enter your name for the invoice!";
        isFormValid = false;
    }

    if (customerAddress === "") {
        addressError.innerText = "Delivery location cannot be blank!";
        isFormValid = false;
    }

    // --- 🛒 STEP B: VERIFY INVENTORY ITEMS IN CART ---
    let orderLines = [];
    let grandTotal = 0;

    for (const key in cartState) {
        const item = cartState[key];
        if (item.quantity > 0) {
            const lineTotal = item.quantity * item.price;
            orderLines.push(`• ${item.quantity}x ${item.name} (GHS ${lineTotal})`);
            grandTotal += lineTotal;
        }
    }

    if (orderLines.length === 0) {
        alert("Your shopping cart is empty! Press + on an item first.");
        return;
    }

    // If any input validation failed, STOP execution immediately and don't send to WhatsApp
    if (!isFormValid) return;

    // --- 📱 STEP C: ASSEMBLE ADVANCED STRING INVOICE ---
    const vendorPhone = "233243217680";

    const orderMessage = `🚀 *NEW UCP DIGITAL HUB ORDER*
----------------------------------
👤 *CUSTOMER DETAILS:*
• Name: ${customerName}
• Delivery Path: ${customerAddress}

📦 *ORDERED ITEMS:*
${orderLines.join('\n')}

💰 *Grand Total:* GHS ${grandTotal.toFixed(2)}
----------------------------------
✅ Please confirm stock availability so I can process payment!`;

    // Safely transform your template string into a web-safe hex payload URL
    const encodedMessage = encodeURIComponent(orderMessage);
    
    // Fire out into the live WhatsApp API network link gateway
    window.location.href = `https://wa.me/${vendorPhone}?text=${encodedMessage}`;
});
