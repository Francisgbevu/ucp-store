// ⚡ 1. DOM SELECTORS — Pinpointing our display layers
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const checkoutBtn = document.getElementById('checkout-btn');

// 📊 2. APPLICATION STATE — Track quantites using an Object map
// This matches the 'data-id' attributes we put in our HTML file!
const cartState = {
    sneaker: { name: "Premium Canvas Sneaker", price: 350.00, quantity: 0 },
    tee: { name: "Vintage Graphic Tee", price: 180.00, quantity: 0 }
};

// 🎨 3. RENDER ENGINE — Redraws everything based on current memory numbers
function renderUI() {
    let totalItems = 0;
    let totalCash = 0;

    // Loop through each item in our memory state
    for (const key in cartState) {
        const item = cartState[key];
        totalItems += item.quantity;
        totalCash += item.quantity * item.price;

        // Update the tiny counter text inside the specific product card
        // We find the specific card by searching for its unique data-id container
        const card = document.querySelector(`[data-id="${key}"]`);
        if (card) {
            card.querySelector('.qty-count').innerText = item.quantity;
        }
    }

    // Update the master sticky checkout bar at the bottom
    cartCountEl.innerText = totalItems;
    cartTotalEl.innerText = `GHS ${totalCash.toFixed(2)}`;
}

// 🛠️ 4. STATE MUTATION ENGINE — Modifying data safely when clicked
productGrid.addEventListener('click', (event) => {
    const target = event.target;
    
    // Check if the clicked element is a plus or minus button
    const isPlus = target.classList.contains('plus-btn');
    const isMinus = target.classList.contains('minus-btn');
    
    // If it's neither, ignore the click completely
    if (!isPlus && !isMinus) return;

    // Find the nearest parent product card to see WHICH item was tapped
    const productCard = target.closest('.product-card');
    const productId = productCard.getAttribute('data-id');

    // Mutate the quantity value inside our central cartState brain
    if (isPlus) {
        cartState[productId].quantity += 1;
    } else if (isMinus) {
        // Prevent negative quantities (don't let quantities drop below 0!)
        if (cartState[productId].quantity > 0) {
            cartState[productId].quantity -= 1;
        }
    }

    // Immediately run the render engine to sync the screen with our updated brain!
    renderUI();
});

// 🚀 5. OUTBOUND WHATSAPP ROUTING INTEGRATION
checkoutBtn.addEventListener('click', () => {
    let orderLines = [];
    let grandTotal = 0;

    // Compile a list of items that have a quantity greater than zero
    for (const key in cartState) {
        const item = cartState[key];
        if (item.quantity > 0) {
            const lineTotal = item.quantity * item.price;
            orderLines.push(`• ${item.quantity}x ${item.name} (GHS ${lineTotal})`);
            grandTotal += lineTotal;
        }
    }

    // If they haven't picked anything, throw an alert box
    if (orderLines.length === 0) {
        alert("Chale, your cart is empty! Press + on an item to add it.");
        return;
    }

    // Your production MTN vendor destination path
    const vendorPhone = "233243217680";

    // Build the clean itemized text block layout
    const orderMessage = `🚀 *NEW UCP DIGITAL HUB ORDER*
----------------------------------
👋 Hello Vendor, I want to buy:

${orderLines.join('\n')}

💰 *Grand Total:* GHS ${grandTotal.toFixed(2)}
----------------------------------
✅ Please check stock availability for immediate delivery!`;

    // Safely encode symbols, spaces, and breaks into safe hex web packets
    const encodedMessage = encodeURIComponent(orderMessage);
    
    // Launch out to the WhatsApp communication layer
    window.location.href = `https://wa.me/${vendorPhone}?text=${encodedMessage}`;
});
