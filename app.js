// ⚡ DOM SELECTORS — Connecting script logic to our layout visual nodes
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const checkoutBtn = document.getElementById('checkout-btn');

// 📊 APPLICATION STATE — Keeping track of checkout calculations in active memory
let cartCount = 0;
let cartSubtotal = 0;

// 🛠️ CORE LOGIC ENGINE — Processing product price details safely
function handleAddToCart(event) {
    // Escape early if what was clicked wasn't the correct action button
    if (!event.target.classList.contains('add-to-cart-btn')) return;

    // Capture the contextual details from the specific product card parent container
    const productCard = event.target.closest('.product-card');
    const priceText = productCard.querySelector('.price').innerText;

    // Strip currency tags to isolate clean numerical price strings (e.g., "GHS 350.00" -> 350.00)
    const numericPrice = parseFloat(priceText.replace('GHS', '').trim());

    // Update calculated quantities inside active variables
    cartCount = cartCount + 1;
    cartSubtotal = cartSubtotal + numericPrice;

    // Render the updated calculations to the UI immediately
    renderUpdatedCart();
}

// 🎨 RENDER ENGINE — Syncing internal numbers with display tags
function renderUpdatedCart() {
    cartCountEl.innerText = cartCount;
    cartTotalEl.innerText = `GHS ${cartSubtotal.toFixed(2)}`;
}

// 🚀 EVENT SYSTEM CONNECTIONS
// Listening to the layout container for any child item clicks using Event Delegation
productGrid.addEventListener('click', handleAddToCart);

// Connecting Checkout Control System to the External WhatsApp Messaging Network
checkoutBtn.addEventListener('click', () => {
    // Throw an absolute warning notice if the cart holds zero transactions
    if (cartCount === 0) {
        alert("Chale, your shopping cart is empty! Add an item first.");
        return;
    }

    // Official receiving business contact phone layout (No spaces or plus characters)
    const vendorPhone = "233243217680"; 

    // Construct the explicit multi-line dynamic string layout context
    const orderMessage = `🚀 *NEW UCP STORE ORDER*
----------------------------
👋 Hello Vendor, I want to place an order:

🛒 Total Items: ${cartCount}
💰 Total Amount: GHS ${cartSubtotal.toFixed(2)}

✅ Please confirm availability so I can process payment!`;

    // Safely transform plain formatting symbols into web-safe percent hex strings
    const encodedMessage = encodeURIComponent(orderMessage);

    // Assembly path leading straight to the WhatsApp network protocol gateway
    const whatsAppApiUrl = `https://wa.me/${vendorPhone}?text=${encodedMessage}`;

    // Direct the viewport to launch the compiled routing endpoint string
    window.location.href = whatsAppApiUrl;
});
