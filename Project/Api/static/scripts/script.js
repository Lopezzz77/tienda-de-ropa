/* ====== DATOS DE PRODUCTOS ====== */

const PRODUCTS = [
  { id:1, name:"Bomber Navy", cat:"jackets", price:189, color:"navy", sizes:["S","M","L","XL"], img:"{% static 'src/jacket-navy.png' %}", badge:"Nuevo" },
  { id:2, name:"Hoodie Teal", cat:"tops", price:89, color:"teal", sizes:["XS","S","M","L"], img:"{% static 'src/hoodie-teal.png' %}", badge:"" },
  { id:3, name:"Tee Sand", cat:"tops", price:39, color:"sand", sizes:["S","M","L","XL"], img:"{% static 'src/tee-sand.png' %}", badge:"" },
  { id:4, name:"Cargo Navy", cat:"pants", price:119, color:"navy", sizes:["S","M","L"], img:"{% static 'src/pants-navy.png' %}", badge:"Top" },
  { id:5, name:"Cap Gold", cat:"accessories", price:35, color:"gold", sizes:["M"], img:"{% static 'src/cap-gold.png' %}", badge:"" },
  { id:6, name:"Sneakers Aqua", cat:"shoes", price:149, color:"aqua", sizes:["S","M","L","XL"], img:"{% static 'src/sneakers-aqua.png' %}", badge:"Nuevo" },
  { id:7, name:"Overcoat Teal", cat:"jackets", price:259, color:"teal", sizes:["M","L","XL"], img:"{% static 'src/coat-teal.png' %}", badge:"" },
  { id:8, name:"Hoodie Sand", cat:"tops", price:79, color:"sand", sizes:["XS","S","M"], img:"{% static 'src/hoodie-sand.png' %}", badge:"" },
];

/* ====== ESTADO DE FILTROS ====== */
const state = { category:"all", size:null, color:null, maxPrice:300, search:"", sort:"featured" };

/* ====== ELEMENTOS ====== */
const $ = (s) => document.querySelector(s);
const grid = $("#productGrid");
const emptyMsg = $("#emptyMsg");
const resultsCount = $("#resultsCount");

/* ====== RENDER DE PRODUCTOS ====== */
function getFiltered(){
  let list = PRODUCTS.filter(p => {
    if(state.category !== "all" && p.cat !== state.category) return false;
    if(state.size && !p.sizes.includes(state.size)) return false;
    if(state.color && p.color !== state.color) return false;
    if(p.price > state.maxPrice) return false;
    if(state.search && !(p.name.toLowerCase().includes(state.search) || p.cat.toLowerCase().includes(state.search))) return false;
    return true;
  });
  if(state.sort === "price-asc") list.sort((a,b)=>a.price-b.price);
  if(state.sort === "price-desc") list.sort((a,b)=>b.price-a.price);
  if(state.sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

function render(){
  const list = getFiltered();
  resultsCount.textContent = `${list.length} producto${list.length!==1?"s":""}`;
  grid.innerHTML = "";
  emptyMsg.hidden = list.length !== 0;

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-name">${p.name}</span>
        <span class="product-cat">${p.cat}</span>
        <span class="product-price">$${p.price}</span>
        <button class="add-btn" data-add="${p.id}">Agregar al carrito</button>
      </div>`;
    grid.appendChild(card);
  });
}

/* ====== BUSCADOR ====== */
$("#searchToggle").addEventListener("click", () => {
  const search = $("#search");
  search.classList.toggle("open");
  if(search.classList.contains("open")) $("#searchInput").focus();
});
$("#searchInput").addEventListener("input", (e) => {
  state.search = e.target.value.trim().toLowerCase();
  render();
});

/* ====== FILTRO CATEGORÍA (radios) ====== */
document.querySelectorAll('input[name="category"]').forEach(r => {
  r.addEventListener("change", (e) => { state.category = e.target.value; render(); });
});

/* ====== QUICK CATS + NAV LINKS ====== */
function setCategory(cat){
  state.category = cat;
  const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
  if(radio) radio.checked = true;
  render();
  $("#shop").scrollIntoView({ behavior:"smooth" });
}
document.querySelectorAll("[data-filter-cat]").forEach(el => {
  el.addEventListener("click", (e) => {
    const cat = el.dataset.filterCat;
    // si la categoría no existe en radios (ej. nav 'all'), usar all
    setCategory(cat);
  });
});

/* ====== FILTRO TALLE ====== */
document.querySelectorAll(".size-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const val = chip.dataset.size;
    if(state.size === val){ state.size = null; chip.classList.remove("active"); }
    else {
      document.querySelectorAll(".size-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active"); state.size = val;
    }
    render();
  });
});

/* ====== FILTRO COLOR ====== */
document.querySelectorAll(".color-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const val = chip.dataset.color;
    if(state.color === val){ state.color = null; chip.classList.remove("active"); }
    else {
      document.querySelectorAll(".color-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active"); state.color = val;
    }
    render();
  });
});

/* ====== FILTRO PRECIO ====== */
$("#priceRange").addEventListener("input", (e) => {
  state.maxPrice = Number(e.target.value);
  $("#priceLabel").textContent = `$${state.maxPrice}`;
  render();
});

/* ====== ORDENAR ====== */
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

/* ====== LIMPIAR FILTROS ====== */
$("#clearFilters").addEventListener("click", () => {
  state.category="all"; state.size=null; state.color=null; state.maxPrice=300; state.search=""; state.sort="featured";
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.querySelectorAll(".size-chip,.color-chip").forEach(c => c.classList.remove("active"));
  $("#priceRange").value = 300; $("#priceLabel").textContent = "$300";
  $("#searchInput").value = ""; $("#sortSelect").value = "featured";
  render();
});

/* ====== MENÚ MÓVIL ====== */
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#nav");
  const btn = $("#menuToggle");
  nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", nav.classList.contains("open"));
});

/* ====== TOGGLE FILTROS MÓVIL ====== */
$("#filtersToggle").addEventListener("click", () => $("#filters").classList.toggle("open"));

/* ====== CARRITO ====== */
let cart = [];
const overlay = $("#overlay");
const cartDrawer = $("#cartDrawer");

function openCart(){ cartDrawer.classList.add("open"); cartDrawer.setAttribute("aria-hidden","false"); overlay.hidden = false; }
function closeCart(){ cartDrawer.classList.remove("open"); cartDrawer.setAttribute("aria-hidden","true"); overlay.hidden = true; $("#filters").classList.remove("open"); }

$("#cartToggle").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function addToCart(id){
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({ ...product, qty:1 });
  renderCart();
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  $("#cartCount").textContent = count;
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $("#cartTotal").textContent = `$${total}`;

  const wrap = $("#cartItems");
  if(cart.length === 0){ wrap.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'; return; }
  wrap.innerHTML = "";
  cart.forEach(i => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${i.img}" alt="${i.name}" />
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <span class="price">$${i.price}</span>
        <div class="qty">
          <button data-dec="${i.id}" aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${i.id}" aria-label="Eliminar">✕</button>`;
    wrap.appendChild(el);
  });
}

/* ====== DELEGACIÓN DE EVENTOS (add/qty/remove) ====== */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if(add){ addToCart(Number(add.dataset.add)); return; }
  const inc = e.target.closest("[data-inc]");
  if(inc){ changeQty(Number(inc.dataset.inc), 1); return; }
  const dec = e.target.closest("[data-dec]");
  if(dec){ changeQty(Number(dec.dataset.dec), -1); return; }
  const rem = e.target.closest("[data-remove]");
  if(rem){ cart = cart.filter(i => i.id !== Number(rem.dataset.remove)); renderCart(); return; }
});

$("#checkoutBtn").addEventListener("click", () => {
  if(cart.length === 0){ alert("Tu carrito está vacío."); return; }
  alert("¡Gracias por tu compra! (demo)");
  cart = []; renderCart(); closeCart();
});

/* ====== HEADER SHADOW ON SCROLL ====== */
window.addEventListener("scroll", () => {
  $("#header").style.boxShadow = window.scrollY > 10 ? "0 8px 30px rgba(8,58,79,.25)" : "var(--shadow)";
});

/* ====== INIT ====== */
render();
renderCart();
