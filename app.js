// ⚡ 1. DOM SELECTORS
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const checkoutBtn = document.getElementById('checkout-btn');
const nameInput = document.getElementById('customer-name');
const addressInput = document.getElementById('customer-address');
const nameError = document.getElementById('name-error');
const addressError = document.getElementById('address-error');

// Target selector for the fresh manual reset engine button
const clearCartBtn = document.getElementById('clear-cart-btn');

// 📊 2. APPLICATION STATE SETUP
const defaultState = {
    sneaker: { name: "Premium Canvas Sneaker", price: 350.00, quantity: 0 },
    tee: { name: "Vintage Graphic Tee", price: 180.00, quantity: 0 }
};

let cartState = JSON.parse(localStorage.getItem('ucp_cart_state')) || JSON.parse(JSON.stringify(defaultState));

// 💾 3. PERSISTENCE ENGINE — Saves active memory states into browser storage
function saveStateToStorage() {
    localStorage.setItem('ucp_cart_state', JSON.stringify(cartState));
    localStorage.setItem('ucp_customer_name', nameInput.value);
    localStorage.setItem('ucp_customer_address', addressInput.value);
}

// 🎨 4. RENDER ENGINE — Syncs memory data onto display layers
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

// 🛠️ 5. STATE MUTATION ENGINE
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

    saveStateToStorage();
    renderUI();
});

// ⌨️ LIVE INPUT TRACKING
nameInput.addEventListener('input', saveStateToStorage);
addressInput.addEventListener('input', saveStateToStorage);

// 🚀 6. ADVANCED VALIDATION & OUTBOUND WHATSAPP ROUTING
checkoutBtn.addEventListener('click', () => {
    nameError.innerText = "";
    addressError.innerText = "";

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

    if (!isFormValid) return;

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

    const encodedMessage = encodeURIComponent(orderMessage);
    
    // --- 🔄 CHECKOUT LIFECYCLE FLUSH ---
    // Clear out the browser's disk caches right before leaving so they return to a fresh slate!
    localStorage.removeItem('ucp_cart_state');
    localStorage.removeItem('ucp_customer_name');
    
    // Reset our active runtime brain object back to 0s
    cartState = JSON.parse(JSON.stringify(defaultState));
    
    // Clear the active screen text fields instantly
    nameInput.value = "";
    
    // Redraw the interface right before the window moves away
    renderUI();

    // Fire out into the live WhatsApp API gateway
    window.location.href = `https://wa.me/${vendorPhone}?text=${encodedMessage}`;
});

// 🔄 7. MANUAL CACHE RESET EVENT HANDLER
clearCartBtn.addEventListener('click', () => {
    if (confirm("Chale, are you sure you want to clear your cart and form fields?")) {
        // Purge storage records entirely
        localStorage.clear();
        
        // Restore cart states from pristine defaults
        cartState = JSON.parse(JSON.stringify(defaultState));
        
        // Clean out form text fields
        nameInput.value = "";
        addressInput.value = "";
        nameError.innerText = "";
        addressError.innerText = "";
        
        // Force the interface to drop counts and values to 0 instantly
        renderUI();
    }
});

// 🏁 8. INITIALIZATION CALL
window.addEventListener('DOMContentLoaded', () => {
    nameInput.value = localStorage.getItem('ucp_customer_name') || "";
    addressInput.value = localStorage.getItem('ucp_customer_address') || "";
    renderUI();
});
