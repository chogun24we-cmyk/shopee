// ข้อมูลสินค้า Streetwear ในร้าน mizt.xz
const productsData = [
    {
        id: 1,
        title: "MIZT.XZ x CARNIVAL Heavyweight Oversized Tee — Washed Black",
        category: "CARNIVAL",
        price: 1290,
        oldPrice: 1590,
        discount: "-19%",
        sold: "2.4k",
        soldNum: 2400,
        rating: 4.9,
        isLatest: true,
        image: "https://i.pinimg.com/1200x/c2/d0/48/c2d0487405a68fe35bfc28d1fc3d54da.jpg"
    },
    {
        id: 2,
        title: "MIZT.XZ Dark Archive Zip-Up Hoodie (ผ้าฟอกหนาพิเศษ 480gsm)",
        category: "CLOTHING",
        price: 2490,
        oldPrice: 2990,
        discount: "-17%",
        sold: "1.8k",
        soldNum: 1800,
        rating: 5.0,
        isLatest: true,
        image: "https://i.pinimg.com/736x/57/5d/ff/575dfff4abdd871cd9582f9c9117b541.jpg"
    },
    {
        id: 3,
        title: "CARNIVAL Limited Graphic Boxy T-Shirt — Black Edition",
        category: "CARNIVAL",
        price: 1150,
        oldPrice: 1450,
        discount: "-21%",
        sold: "3.1k",
        soldNum: 3100,
        rating: 4.9,
        isLatest: false,
        image: "https://i.pinimg.com/736x/60/ae/80/60ae804d9abf5af2eb577a6ecaa76f03.jpg"
    },
    {
        id: 4,
        title: "MIZT.XZ Tactical Parachute Cargo Pants — Matte Black",
        category: "CLOTHING",
        price: 1890,
        oldPrice: 2290,
        discount: "-18%",
        sold: "960",
        soldNum: 960,
        rating: 4.8,
        isLatest: false,
        image: "https://i.pinimg.com/736x/d6/a4/da/d6a4daf34ec69ca29d84de19616fe693.jpg"
    },
    {
        id: 5,
        title: "MIZT.XZ Chunky Streetwear Low Sneakers — Monochrome",
        category: "FOOTWEAR",
        price: 3290,
        oldPrice: 3990,
        discount: "-18%",
        sold: "1.2k",
        soldNum: 1200,
        rating: 4.9,
        isLatest: true,
        image: "https://i.pinimg.com/1200x/91/52/5b/91525b29919d8ddf14ff1008ad7e7114.jpg"
    },
    {
        id: 6,
        title: "HOME & Away Collector Rug & Street Studio Mat (Limited)",
        category: "HOME & Away",
        price: 1690,
        oldPrice: 2100,
        discount: "-20%",
        sold: "540",
        soldNum: 540,
        rating: 4.9,
        isLatest: false,
        image: "https://i.pinimg.com/736x/e7/60/d0/e760d0049c9515219cb3dcd90224116c.jpg"
    },
    {
        id: 7,
        title: "MIZT.XZ Distressed Emblem Cap & Silver Chain Pack",
        category: "HOME & Away",
        price: 890,
        oldPrice: 1190,
        discount: "-25%",
        sold: "4.2k",
        soldNum: 4200,
        rating: 5.0,
        isLatest: false,
        image: "https://i.pinimg.com/736x/9a/35/dc/9a35dc64f48b3e0c561aea3b73164e43.jpg"
    },
    {
        id: 8,
        title: "FOOTWEAR Combat Platform Boots — Onyx Leather",
        category: "FOOTWEAR",
        price: 3590,
        oldPrice: 4200,
        discount: "-15%",
        sold: "780",
        soldNum: 780,
        rating: 4.9,
        isLatest: true,
        image: "https://i.pinimg.com/736x/3c/09/88/3c0988052c172b9681ff9e7c6a493fc8.jpg"
    }
];

// สถานะเริ่มต้น
let currentCategory = "HOME";
let currentSort = "popular";
let searchQuery = "";
let isFollowing = false;
let claimedDiscount = 0;

let cart = [
    { ...productsData[0], qty: 1 },
    { ...productsData[1], qty: 1 }
];

// ฟังก์ชันสลับโหมดหน้าจอ (Desktop / Tablet / Mobile)
function setViewportMode(mode, btnEl) {
    const wrapper = document.getElementById("app-viewport-wrapper");
    wrapper.classList.remove("view-tablet", "view-mobile");

    if (mode === "tablet") wrapper.classList.add("view-tablet");
    if (mode === "mobile") wrapper.classList.add("view-mobile");

    document.querySelectorAll(".preview-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    const modeNames = {
        desktop: "โหมดหน้าจอ Desktop เต็มจอ",
        tablet: "โหมดหน้าจอ Tablet (991px)",
        mobile: "โหมดหน้าจอ Mobile (390px)"
    };
    showToast("📱 สลับเป็น " + modeNames[mode]);
}

// แสดงการ์ดสินค้า
function renderProducts() {
    const grid = document.getElementById("productGrid");
    const countEl = document.getElementById("productResultCount");

    let filtered = productsData.filter(item => {
        const matchCat = (currentCategory === "HOME" || currentCategory === "ALL")
            ? true
            : item.category.toLowerCase() === currentCategory.toLowerCase();
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    if (currentSort === "latest") {
        filtered.sort((a, b) => Number(b.isLatest) - Number(a.isLatest));
    } else if (currentSort === "sales") {
        filtered.sort((a, b) => b.soldNum - a.soldNum);
    } else if (currentSort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    }

    countEl.textContent = `แสดง ${filtered.length} รายการ`;

    if (filtered.length === 0) {
        grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #111; border-radius: 8px; border: 1px solid #222;">
                        <i class="fa-solid fa-box-open" style="font-size: 36px; color: #ff1f02; margin-bottom: 12px;"></i>
                        <h4 style="font-size: 16px;">ไม่พบสินค้าที่ค้นหา</h4>
                        <p style="font-size: 13px; color: #888; margin-top: 4px;">ลองเปลี่ยนคำค้นหา หรือเลือกดูหมวดหมู่สินค้าทั้งหมด</p>
                    </div>
                `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
                <div class="product-card">
                    <div class="product-thumb" onclick="openLightbox('${item.image}')">
                        <img src="${item.image}" alt="${item.title}">
                        <span class="mall-tag">Mall</span>
                        <span class="discount-tag">${item.discount}</span>
                    </div>
                    <div class="product-body">
                        <div>
                            <div class="product-cat">${item.category}</div>
                            <div class="product-title">${item.title}</div>
                            <div class="product-price-row">
                                <span class="price-now">฿${item.price.toLocaleString()}</span>
                                <span class="price-old">฿${item.oldPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <div>
                            <div class="product-meta">
                                <span class="stars"><i class="fa-solid fa-star"></i> ${item.rating}</span>
                                <span>ขายแล้ว ${item.sold} ชิ้น</span>
                            </div>
                            <button class="add-cart-btn" onclick="addToCart(${item.id})">
                                <i class="fa-solid fa-cart-plus"></i> เพิ่มลงรถเข็น
                            </button>
                        </div>
                    </div>
                </div>
            `).join("");
}

// กรองหมวดหมู่สินค้าจากเมนู .manus
function filterCategory(category, linkEl) {
    currentCategory = category;
    if (linkEl) {
        document.querySelectorAll("#categoryMenu a").forEach(a => a.classList.remove("active"));
        linkEl.classList.add("active");
    }

    const lookbook = document.getElementById("lookbookSection");
    if (category === "HOME") {
        lookbook.style.display = "block";
    } else {
        lookbook.style.display = "none";
    }

    renderProducts();
}

// เรียงลำดับสินค้า
function sortProducts(sortType, btnEl) {
    currentSort = sortType;
    document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderProducts();
}

// ค้นหาสินค้าแบบ Real-time
function handleSearchInput(val) {
    searchQuery = val.trim();
    renderProducts();
}

function handleSearchSubmit(e) {
    e.preventDefault();
    document.getElementById("products-anchor").scrollIntoView({ behavior: "smooth" });
    if (searchQuery) {
        showToast(`🔍 ค้นหา "${searchQuery}" ในร้าน mizt.xz`);
    }
}

// ปุ่มติดตามร้านค้า
function toggleFollow() {
    isFollowing = !isFollowing;
    const btn = document.getElementById("followBtn");
    const icon = document.getElementById("followIcon");
    const text = document.getElementById("followText");
    const countText = document.getElementById("followerCountText");

    if (isFollowing) {
        btn.classList.add("following");
        icon.textContent = "✓";
        text.textContent = "กำลังติดตาม";
        countText.textContent = "210.3k";
        showToast("❤️ ติดตามร้าน mizt.xz เรียบร้อยแล้ว!");
    } else {
        btn.classList.remove("following");
        icon.textContent = "+";
        text.textContent = "ติดตาม";
        countText.textContent = "210.2k";
        showToast("ยกเลิกการติดตามร้านค้าแล้ว");
    }
}

// เก็บโค้ดส่วนลด
function claimVoucher(btnEl, amount, title) {
    if (btnEl.classList.contains("claimed")) return;
    btnEl.classList.add("claimed");
    btnEl.textContent = "เก็บแล้ว ✓";
    if (amount > claimedDiscount) {
        claimedDiscount = amount;
    }
    renderCart();
    showToast(`🎟️ เก็บโค้ด "${title}" สำเร็จ! ใช้ลดในตะกร้าได้ทันที`);
}

// ระบบตะกร้าสินค้า
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
    showToast(`🛒 เพิ่ม "${product.title.substring(0, 26)}..." ลงรถเข็นแล้ว`);
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    renderCart();
}

function renderCart() {
    const listEl = document.getElementById("cartItemsList");
    const badgeEl = document.getElementById("cart-count-badge");
    const mobBadgeEl = document.getElementById("mob-cart-count");
    const subtotalEl = document.getElementById("cartSubtotal");
    const discountEl = document.getElementById("cartDiscount");
    const totalEl = document.getElementById("cartTotal");
    const checkoutCountEl = document.getElementById("checkoutCount");

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    badgeEl.textContent = totalQty;
    mobBadgeEl.textContent = totalQty;
    checkoutCountEl.textContent = totalQty;

    if (cart.length === 0) {
        listEl.innerHTML = `
                    <div style="text-align:center; padding: 50px 15px; color:#777;">
                        <i class="fa-solid fa-bag-shopping" style="font-size:38px; margin-bottom:10px; color:#444;"></i>
                        <p>ยังไม่มีสินค้าในรถเข็น</p>
                    </div>
                `;
        subtotalEl.textContent = "฿0";
        discountEl.textContent = "-฿0";
        totalEl.textContent = "฿0";
        return;
    }

    listEl.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">฿${(item.price * item.qty).toLocaleString()}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                            <span style="font-size:12.5px; min-width:20px; text-align:center;">${item.qty}</span>
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `).join("");

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discount = subtotal >= 1000 ? claimedDiscount : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    subtotalEl.textContent = `฿${subtotal.toLocaleString()}`;
    discountEl.textContent = `-฿${discount.toLocaleString()}`;
    totalEl.textContent = `฿${finalTotal.toLocaleString()}`;
}

function toggleCart(open) {
    document.getElementById("cartBackdrop").classList.toggle("open", open);
    document.getElementById("cartDrawer").classList.toggle("open", open);
}

function handleCheckout() {
    if (cart.length === 0) {
        showToast("กรุณาเลือกสินค้าลงรถเข็นก่อนสั่งซื้อครับ");
        return;
    }
    showToast("✅ สร้างคำสั่งซื้อสำเร็จ! ขอบคุณที่ช้อปกับ mizt.xz Shopee Mall");
    cart = [];
    renderCart();
    toggleCart(false);
}

// ระบบแชทร้านค้า
function toggleChat(open) {
    document.getElementById("chatWidget").classList.toggle("open", open);
}

function sendQuickChat(text) {
    appendChatMessage(text, "user");
    setTimeout(() => {
        let reply = "แอดมินรับทราบครับ สินค้าทุกรายการเป็นของแท้ 100% พร้อมจัดส่งด่วนวันนี้เลยครับ 🖤";
        if (text.includes("ไซส์")) {
            reply = "เสื้อทรง Oversize ของร้าน: ไซส์ M (อก 44\"), L (อก 46\"), XL (อก 48\") ชอบทรงหลวมแนะนำบวก 1 ไซส์ครับ!";
        } else if (text.includes("โค้ด")) {
            reply = "คุณลูกค้าสามารถกดปุ่ม 'เก็บโค้ด' ที่แถบคูปองหน้าร้านเพื่อรับส่วนลดสูงสุด ฿350 ได้เลยครับ 🎟️";
        }
        appendChatMessage(reply, "bot");
    }, 450);
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;
    input.value = "";
    sendQuickChat(msg);
}

function appendChatMessage(text, sender) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = `chat-bubble ${sender}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// Lightbox ดูภาพแบนเนอร์ขยาย
function openLightbox(src) {
    document.getElementById("lightboxImg").src = src;
    document.getElementById("lightboxModal").classList.add("open");
}

function closeLightbox() {
    document.getElementById("lightboxModal").classList.remove("open");
}

// เปลี่ยนภาษา & ขอบเขตค้นหา
function setLanguage(lang) {
    document.getElementById("current-lang").textContent = lang;
    showToast(`🌐 เปลี่ยนภาษาเป็น ${lang}`);
}

function setSearchScope(scope) {
    document.getElementById("search-scope-label").textContent = scope;
    showToast(`ตั้งค่าการค้นหา: ${scope}`);
}

// Toast แจ้งเตือน
function showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2600);
}

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บ
window.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderCart();
});