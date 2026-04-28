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

/* ── Checkout → Paso Pago ── */
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

  /* Mostrar paso de pago */
  var totals  = calculateTotal(cart);
  var payStep = document.getElementById('payment-step');
  if (payStep) {
    payStep.style.display = 'flex';
    selectedShipping = null;
    selectedPayment  = null;
    renderPaymentStep(totals, function(shipping, payment) {
      var grandTotal = totals.total + shipping.price;

      /* Capturamos los datos ANTES de limpiar el carrito */
      var snapshot = {
        items:    cart.slice(),
        totals:   totals,
        shipping: shipping,
        payment:  payment,
        grand:    grandTotal,
        client:   { name: fields.name, email: fields.email }
      };

      /* Limpiar carrito y cerrar sidebar */
      cart = clearCart();
      saveCart(cart);
      refreshCart();
      payStep.style.display = 'none';
      e.target.reset();
      toggleCartSidebar(false);

      /* Mostrar boleta */
      showReceipt(snapshot);
    });
    payStep.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ── Boleta de compra ── */
function showReceipt(data) {
  /* Número de pedido aleatorio con prefijo PS + año */
  var orderNum = 'PS2026-' + Math.floor(10000 + Math.random() * 90000);

  /* Fecha y hora */
  var now  = new Date();
  var pad  = function(n) { return n < 10 ? '0' + n : n; };
  var dateStr = pad(now.getDate()) + '/' + pad(now.getMonth()+1) + '/' + now.getFullYear()
              + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());

  /* Llenar número y fecha */
  var numEl  = document.getElementById('receipt-number');
  var datEl  = document.getElementById('receipt-date');
  if (numEl) numEl.textContent = 'N° ' + orderNum;
  if (datEl) datEl.textContent = dateStr;

  /* Datos del cliente */
  var clientEl = document.getElementById('receipt-client');
  if (clientEl) {
    while (clientEl.firstChild) clientEl.removeChild(clientEl.firstChild);

    /* Preferir sesión guardada si existe */
    var session = typeof getSession === 'function' ? getSession() : null;
    var clientName  = (session && session.name)  || data.client.name;
    var clientEmail = (session && session.email) || data.client.email;

    [['Cliente', clientName], ['Correo', clientEmail], ['Pedido', orderNum]].forEach(function(pair) {
      var label = document.createElement('span'); label.className = 'receipt-client-label'; label.textContent = pair[0];
      var value = document.createElement('span'); value.className = 'receipt-client-value'; value.textContent = pair[1];
      clientEl.appendChild(label);
      clientEl.appendChild(value);
    });
  }

  /* Tabla de productos */
  var tbody = document.getElementById('receipt-items');
  if (tbody) {
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    data.items.forEach(function(item) {
      var tr = document.createElement('tr');
      var lineTotal = item.price * item.qty;

      [item.name, item.team || '—', String(item.qty), formatCLP(item.price), formatCLP(lineTotal)].forEach(function(cell, i) {
        var td = document.createElement('td');
        td.textContent = cell;
        if (i >= 2) td.className = 'text-right';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  /* Totales */
  var totalsEl = document.getElementById('receipt-totals');
  if (totalsEl) {
    while (totalsEl.firstChild) totalsEl.removeChild(totalsEl.firstChild);

    var rows = [
      ['Subtotal', formatCLP(data.totals.subtotal)],
      ['Descuento', '-' + formatCLP(data.totals.discount)],
      ['IVA (19%)', formatCLP(data.totals.iva)],
      ['Envío', data.shipping.price === 0 ? 'Gratis' : formatCLP(data.shipping.price)]
    ];
    rows.forEach(function(r) {
      var row = document.createElement('div'); row.className = 'receipt-total-row';
      var lbl = document.createElement('span'); lbl.className = 'receipt-total-label'; lbl.textContent = r[0];
      var val = document.createElement('span'); val.className = 'receipt-total-value'; val.textContent = r[1];
      row.appendChild(lbl); row.appendChild(val);
      totalsEl.appendChild(row);
    });

    /* Total final destacado */
    var grandRow = document.createElement('div'); grandRow.className = 'receipt-grand-total';
    var gLbl = document.createElement('span'); gLbl.textContent = 'TOTAL PAGADO';
    var gVal = document.createElement('span'); gVal.textContent = formatCLP(data.grand);
    grandRow.appendChild(gLbl); grandRow.appendChild(gVal);
    totalsEl.appendChild(grandRow);
  }

  /* Logística */
  var logEl = document.getElementById('receipt-logistics');
  if (logEl) {
    while (logEl.firstChild) logEl.removeChild(logEl.firstChild);

    var title = document.createElement('p'); title.className = 'receipt-section-title'; title.textContent = 'ENVÍO Y PAGO';
    logEl.appendChild(title);

    var grid = document.createElement('div'); grid.className = 'receipt-client-grid';
    [['Método de envío', data.shipping.label], ['Método de pago', data.payment.label]].forEach(function(pair) {
      var lbl = document.createElement('span'); lbl.className = 'receipt-client-label'; lbl.textContent = pair[0];
      var val = document.createElement('span'); val.className = 'receipt-client-value'; val.textContent = pair[1];
      grid.appendChild(lbl); grid.appendChild(val);
    });
    logEl.appendChild(grid);
  }

  /* Abrir modal */
  var modal = document.getElementById('receipt-modal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  /* Botones */
  var printBtn = document.getElementById('btn-receipt-print');
  var closeBtn = document.getElementById('btn-receipt-close');
  if (printBtn) {
    printBtn.onclick = function() { window.print(); };
  }
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('visible');
      document.body.style.overflow = '';
      showToast('🏆 ¡Pedido ' + orderNum + ' confirmado!', 'success', 5000);
    };
  }
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
      if (typeof closeAuthModal === 'function') closeAuthModal();
    }
  });

  /* Auth Modal */
  var authBtn       = document.getElementById('btn-auth');
  var closeAuthBtn  = document.getElementById('close-auth-modal');
  var authModal     = document.getElementById('auth-modal');
  if (authBtn)      authBtn.addEventListener('click', openAuthModal);
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) closeAuthModal();
    });
  }
  updateAuthButton();

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

  function showCatalog() {
    heroSection.style.display = 'none';
    catalogSection.style.display = 'block';
    if (cartToggleBtn) cartToggleBtn.style.display = 'flex';
    /* Show the handle */
    var handle = document.getElementById('btn-filter-toggle');
    if (handle) handle.style.display = 'flex';
    window.scrollTo(0, 0);
  }

  function goHome(e) {
    if (e) e.preventDefault();
    catalogSection.style.display = 'none';
    heroSection.style.display = 'flex';
    if (cartToggleBtn) cartToggleBtn.style.display = 'none';
    /* Hide the handle */
    var handle = document.getElementById('btn-filter-toggle');
    if (handle) handle.style.display = 'none';
    window.scrollTo(0, 0);
  }

  if (enterBtn && catalogSection && heroSection) {
    enterBtn.addEventListener('click', function(e) { e.preventDefault(); showCatalog(); });
  }

  if (logoBtn && catalogSection && heroSection) {
    logoBtn.style.cursor = 'pointer';
    logoBtn.addEventListener('click', goHome);
  }

  if (backBtn && catalogSection && heroSection) {
    backBtn.addEventListener('click', goHome);
  }

  /* Toggle Sidebar de Filtros */
  var filterToggleBtn  = document.getElementById('btn-filter-toggle');
  var catalogBodyEl    = document.getElementById('catalog-body');
  var filtersSidebarEl = document.getElementById('filters-sidebar');

  /* Overlay dim para móvil */
  var sidebarOverlay = document.createElement('div');
  sidebarOverlay.id = 'sidebar-overlay';
  sidebarOverlay.style.cssText = [
    'position:fixed;inset:0;background:rgba(0,0,0,.5);',
    'z-index:75;display:none;opacity:0;',
    'transition:opacity .3s ease;'
  ].join('');
  document.body.appendChild(sidebarOverlay);

  function closeMobileSidebar() {
    if (!catalogBodyEl) return;
    catalogBodyEl.classList.remove('sidebar-open');
    if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'false');
    sidebarOverlay.style.opacity = '0';
    setTimeout(function() { sidebarOverlay.style.display = 'none'; }, 300);
  }

  sidebarOverlay.addEventListener('click', closeMobileSidebar);
  window.addEventListener('resize', function() {
    if (window.innerWidth > 860 && catalogBodyEl) {
      catalogBodyEl.classList.remove('sidebar-open');
      sidebarOverlay.style.display = 'none';
      sidebarOverlay.style.opacity = '0';
    }
  }, { passive: true });

  if (filterToggleBtn && catalogBodyEl) {
    filterToggleBtn.addEventListener('click', function() {
      var isMobile = window.innerWidth <= 860;
      if (isMobile) {
        var isOpen = catalogBodyEl.classList.toggle('sidebar-open');
        filterToggleBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
          sidebarOverlay.style.display = 'block';
          setTimeout(function() { sidebarOverlay.style.opacity = '1'; }, 10);
        } else {
          sidebarOverlay.style.opacity = '0';
          setTimeout(function() { sidebarOverlay.style.display = 'none'; }, 300);
        }
      } else {
        var isHidden = catalogBodyEl.classList.toggle('sidebar-hidden');
        filterToggleBtn.setAttribute('aria-expanded', String(!isHidden));
      }
    });
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
