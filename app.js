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
// 🎨 4. OPTIMIZED RENDER ENGINE — Syncs memory data onto display layers
function renderUI() {
    // Convert our state object into an array and fold it to calculate total quantities [1]
    const totalItems = Object.values(cartState).reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    // Fold the array to calculate the precise monetary subtotal sum [4, 1]
    const totalCash = Object.values(cartState).reduce((acc, item) => {
        return acc + (item.quantity * item.price);
    }, 0);

    // Loop strictly to update individual quantity indicators on the card viewports
    for (const key in cartState) {
        const card = document.querySelector(`[data-id="${key}"]`);
        if (card) {
            card.querySelector('.qty-count').innerText = cartState[key].quantity;
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

    // Filter and compile items that have a quantity greater than zero
    const activeItems = Object.values(cartState).filter(item => item.quantity > 0);

    if (activeItems.length === 0) {
        alert("Your shopping cart is empty! Press + on an item first.");
        return;
    }

    if (!isFormValid) return;

    // Use.reduce() to cleanly calculate our grand total price in one line [4, 1]
    const grandTotal = activeItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    // Map out our formatted invoice items lines
    const orderLines = activeItems.map(item => `• ${item.quantity}x ${item.name} (GHS ${item.quantity * item.price})`);

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
    
    // CHECKOUT LIFECYCLE FLUSH
    localStorage.removeItem('ucp_cart_state');
    localStorage.removeItem('ucp_customer_name');
    cartState = JSON.parse(JSON.stringify(defaultState));
    nameInput.value = "";
    addressInput.value = "";
    renderUI();

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
