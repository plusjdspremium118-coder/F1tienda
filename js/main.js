/* main.js — Punto de entrada. Orquesta todos los módulos.
   Flujo unidireccional: acción → lógica → persistencia → render. */

var cart          = loadCart();
var activeCategory = 'all';
var activeTeam     = 'all';

/* ── Filtrado ── */
function getFiltered() {
  return inventory.filter(function(p) {
    return (activeCategory === 'all' || p.category === activeCategory)
        && (activeTeam     === 'all' || p.team     === activeTeam);
  });
}

function applyFilters() { renderCatalog(getFiltered(), handleAdd); }

/* ── Refresh carrito ── */
function refreshCart() {
  var totals = calculateTotal(cart);
  renderCartList(cart, handleInc, handleDec, handleRemove);
  renderSummary(totals);
  updateCartBadge(getTotalUnits(cart));
  saveCart(cart);
}

/* ── Handlers carrito ── */
function handleAdd(product) {
  var result = addItem(cart, product);
  if (result.added) {
    cart = result.cart;
    refreshCart();
    showToast('✓ ' + product.name + ' añadido', 'success');
  } else {
    showToast('⚠ ' + result.reason, 'error');
  }
}

function handleInc(id)    { cart = changeQty(cart, id, +1); refreshCart(); }
function handleDec(id)    { cart = changeQty(cart, id, -1); refreshCart(); }
function handleRemove(id) {
  var item = cart.find(function(i) { return i.id === id; });
  cart = removeItem(cart, id);
  refreshCart();
  if (item) showToast(item.name + ' eliminado', 'info');
}

/* ── Checkout ── */
function handleCheckout(e) {
  e.preventDefault();
  clearFormErrors();
  setFormSuccess('');

  if (cart.length === 0) { showToast('Tu carrito está vacío.', 'error'); return; }

  var fields = {
    name:  (document.getElementById('input-name')  || {}).value || '',
    email: (document.getElementById('input-email') || {}).value || '',
    qty:   (document.getElementById('input-qty')   || {}).value || ''
  };

  var result = validateForm(fields);
  if (!result.isValid) {
    Object.keys(result.errors).forEach(function(f) { setFieldError(f, result.errors[f]); });
    showToast('Corrige los errores del formulario.', 'error');
    return;
  }

  var totals = calculateTotal(cart);
  cart = clearCart();
  saveCart(cart);
  refreshCart();
  setFormSuccess('¡Pedido confirmado! Total: ' + totals.total.toLocaleString('es-CL') + ' CLP');
  showToast('¡Gracias por tu compra, campeón! 🏆', 'success', 5000);
  e.target.reset();
  setTimeout(function() { toggleCartSidebar(false); }, 2500);
}

/* ── Filtros ── */
function handleFilterGroup(groupId, dataAttr, setter) {
  var group = document.getElementById(groupId);
  if (!group) return;
  group.addEventListener('click', function(e) {
    var btn = e.target.closest('[' + dataAttr + ']');
    if (!btn) return;
    group.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    setter(btn.getAttribute(dataAttr));
    applyFilters();
  });
}

/* ── Registro de eventos ── */
function registerListeners() {
  var cartToggle = document.getElementById('cart-toggle');
  var closeCart  = document.getElementById('close-cart');
  var overlay    = document.getElementById('overlay');
  var form       = document.getElementById('checkout-form');
  var header     = document.getElementById('site-header');
  var scrollTop  = document.getElementById('scroll-top');

  var closeModalBtn = document.getElementById('close-modal');
  var productModal  = document.getElementById('product-modal');

  if (cartToggle) cartToggle.addEventListener('click', function() { toggleCartSidebar(true); });
  if (closeCart)  closeCart.addEventListener('click',  function() { toggleCartSidebar(false); });
  if (overlay)    overlay.addEventListener('click',    function() { toggleCartSidebar(false); });
  if (form)       form.addEventListener('submit', handleCheckout);

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
  if (productModal) {
    productModal.addEventListener('click', function(e) {
      if (e.target === productModal) closeProductModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      toggleCartSidebar(false);
      if (typeof closeProductModal === 'function') closeProductModal();
    }
  });

  /* Lógica de Scroll (Glassmorphism Header y Scroll Top) */
  window.addEventListener('scroll', function() {
    var isScrolled = window.scrollY > 40;
    if (header) header.classList.toggle('scrolled', isScrolled);
    if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  if (scrollTop) {
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Lógica SPA (Landing -> Catálogo) */
  var enterBtn = document.getElementById('btn-enter-catalog');
  var catalogSection = document.getElementById('catalog');
  var heroSection = document.querySelector('.hero');
  var logoBtn = document.getElementById('logo');
  var backBtn = document.getElementById('btn-back-home');
  var cartToggleBtn = document.getElementById('cart-toggle');

  if (enterBtn && catalogSection && heroSection) {
    enterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      heroSection.style.display = 'none';
      catalogSection.style.display = 'block';
      if (cartToggleBtn) cartToggleBtn.style.display = 'flex';
      window.scrollTo(0, 0);
    });
  }

  function goHome(e) {
    if (e) e.preventDefault();
    catalogSection.style.display = 'none';
    heroSection.style.display = 'flex';
    if (cartToggleBtn) cartToggleBtn.style.display = 'none';
    window.scrollTo(0, 0);
  }

  if (logoBtn && catalogSection && heroSection) {
    logoBtn.style.cursor = 'pointer';
    logoBtn.addEventListener('click', goHome);
  }

  if (backBtn && catalogSection && heroSection) {
    backBtn.addEventListener('click', goHome);
  }

  handleFilterGroup('filter-category', 'data-filter-cat',  function(v) { activeCategory = v; });
  handleFilterGroup('filter-team',     'data-filter-team', function(v) { activeTeam = v; });
}

/* ── Bootstrap ── */
function init() {
  applyFilters();
  refreshCart();
  registerListeners();
  if (cart.length > 0) {
    showToast('Bienvenido — ' + getTotalUnits(cart) + ' item(s) guardado(s).', 'info', 4000);
  }
}

document.addEventListener('DOMContentLoaded', init);
