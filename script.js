const products = [
  {id:1,name:"เค้กสตรอว์เบอร์รี",price:89,emoji:"🍰",desc:"เค้กนุ่มครีมหอมหวาน ท็อปด้วยสตรอว์เบอร์รี"},
  {id:2,name:"ครัวซองต์เนยสด",price:45,emoji:"🥐",desc:"ครัวซองต์กรอบนอกนุ่มใน หอมเนยสด"},
  {id:3,name:"คัพเค้กวานิลลา",price:35,emoji:"🧁",desc:"คัพเค้กเนื้อนุ่ม ครีมละมุน ทานง่าย"},
  {id:4,name:"ช็อกโกแลตบราวนี่",price:55,emoji:"🍫",desc:"บราวนี่เข้มข้น เนื้อหนึบ ช็อกโกแลตเต็มคำ"},
  {id:5,name:"โดนัทน้ำตาล",price:30,emoji:"🍩",desc:"โดนัทนุ่ม ๆ เคลือบน้ำตาลหวานกำลังดี"},
  {id:6,name:"คุกกี้ช็อกโกแลต",price:25,emoji:"🍪",desc:"คุกกี้กรอบนอกนุ่มใน ช็อกโกแลตชิพแน่น ๆ"},
  {id:7,name:"พายแอปเปิล",price:65,emoji:"🥧",desc:"พายหอมเนย ไส้แอปเปิลหวานหอม"},
  {id:8,name:"เค้กช็อกโกแลต",price:99,emoji:"🎂",desc:"เค้กช็อกโกแลตเนื้อนุ่ม รสเข้มข้น"}
];

let cart = JSON.parse(localStorage.getItem("bakeryCart") || "[]");

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function money(n){ return "฿" + n.toLocaleString("th-TH"); }

function renderProducts(){
  productGrid.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">+ เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </article>
  `).join("");
}

function saveCart(){
  localStorage.setItem("bakeryCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart();
  showToast("เพิ่มสินค้าในตะกร้าแล้ว ♡");
}

function changeQty(id, amount){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function removeItem(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
  showToast("ลบสินค้าแล้ว");
}

function renderCart(){
  const totalQty = cart.reduce((sum,x)=>sum+x.qty,0);
  cartCount.textContent = totalQty;
  if(cart.length === 0){
    cartItems.innerHTML = '<div class="empty">ยังไม่มีสินค้าในตะกร้า 🧁<br>เลือกขนมที่ชอบแล้วเพิ่มลงตะกร้าได้เลย</div>';
    cartTotal.textContent = money(0);
    return;
  }
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const p = products.find(x=>x.id===item.id);
    const subtotal = p.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-row">
        <span class="emoji">${p.emoji}</span>
        <div class="cart-name"><b>${p.name}</b><small>${money(p.price)} / ชิ้น</small></div>
        <div class="qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
        <b>${money(subtotal)}</b>
        <button class="remove" onclick="removeItem(${p.id})">ลบ</button>
      </div>`;
  }).join("");
  cartTotal.textContent = money(total);
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
}

document.getElementById("openCart").addEventListener("click",()=>cartModal.classList.add("show"));
document.getElementById("closeCart").addEventListener("click",()=>cartModal.classList.remove("show"));
cartModal.addEventListener("click",e=>{if(e.target===cartModal)cartModal.classList.remove("show")});

document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(cart.length===0){ showToast("กรุณาเลือกสินค้าก่อนสั่งซื้อ"); return; }
  alert("ขอบคุณสำหรับการสั่งซื้อ ♡\nระบบตัวอย่างได้รับรายการของคุณแล้ว\nกรุณาติดต่อร้านเพื่อยืนยันการชำระเงิน");
  cart = [];
  saveCart();
  cartModal.classList.remove("show");
});

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  alert(`ขอบคุณคุณ ${name} ♡\nได้รับข้อความของคุณแล้ว ร้านจะติดต่อกลับโดยเร็วที่สุด`);
  e.target.reset();
});

document.getElementById("menuToggle").addEventListener("click",()=>{
  document.getElementById("mainNav").classList.toggle("open");
});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{
  document.getElementById("mainNav").classList.remove("open");
}));

renderProducts();
renderCart();
