/* ui.js — Manipulación del DOM. NUNCA usa innerHTML/outerHTML.
   Todo se construye con createElement + textContent + classList. */

/** @param {number} n @returns {string} */
function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

/** @param {string} msg @param {string} [type] @param {number} [ms] */
function showToast(msg, type, ms) {
  type = type || 'info'; ms = ms || 3000;
  var c = document.getElementById('toast-container');
  if (!c) return;
  var t = document.createElement('div');
  t.classList.add('toast', type);
  t.textContent = sanitize(msg);
  c.appendChild(t);
  setTimeout(function() {
    t.classList.add('hide');
    t.addEventListener('animationend', function() { t.remove(); }, { once: true });
  }, ms);
}

/** @param {number} count */
function updateCartBadge(count) {
  var b = document.getElementById('cart-count');
  if (!b) return;
  b.textContent = String(count);
  b.classList.remove('bump');
  void b.offsetWidth;
  b.classList.add('bump');
  setTimeout(function() { b.classList.remove('bump'); }, 350);
}

/** @param {boolean} open */
function toggleCartSidebar(open) {
  var s = document.getElementById('cart-sidebar');
  var o = document.getElementById('overlay');
  var btn = document.getElementById('cart-toggle');
  if (!s || !o) return;
  s.classList.toggle('open', open);
  o.classList.toggle('visible', open);
  s.setAttribute('aria-hidden', String(!open));
  if (btn) btn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

/**
 * Construye una tarjeta de producto con banner de color de equipo.
 * @param {Object} product @param {Function} onAdd @returns {HTMLElement}
 */
function createProductCard(product, onAdd) {
  var article = document.createElement('article');
  article.classList.add('product-card');
  article.setAttribute('role', 'listitem');
  article.dataset.productId = String(product.id);

  /* — Banner: gradiente color equipo + emoji (fallback) + imagen real encima — */
  var banner = document.createElement('div');
  banner.classList.add('card-banner');
  banner.style.background =
    'linear-gradient(145deg, ' + product.color + 'cc 0%, ' + product.color + '55 100%)';

  /* Emoji fallback (visible hasta que cargue la imagen) */
  var emojiEl = document.createElement('span');
  emojiEl.classList.add('card-emoji');
  emojiEl.textContent = product.emoji || '\uD83C\uDFCE\uFE0F';
  emojiEl.setAttribute('aria-hidden', 'true');

  /* Imagen real — cubre el banner si carga correctamente */
  var imgEl = document.createElement('img');
  imgEl.classList.add('card-img');
  imgEl.alt = sanitize(product.name) + ' - ' + sanitize(product.team);
  imgEl.loading = 'lazy';
  imgEl.style.opacity = '0'; /* oculta hasta que cargue */
  imgEl.onload = function() {
    imgEl.style.opacity = '1';
    emojiEl.style.display = 'none'; /* oculta emoji cuando la imagen carga */
  };
  imgEl.onerror = function() {
    imgEl.style.display = 'none'; /* imagen no existe → muestra emoji */
  };
  imgEl.src = sanitize(product.image || '');

  /* Stock pill */
  var stockPill = document.createElement('span');
  stockPill.classList.add('card-stock-pill');
  if (product.stock === 0) {
    stockPill.classList.add('no-stock');  stockPill.textContent = 'Sin stock';
  } else if (product.stock <= 3) {
    stockPill.classList.add('low-stock'); stockPill.textContent = 'Ultimas ' + product.stock;
  } else {
    stockPill.classList.add('in-stock');  stockPill.textContent = 'En stock';
  }

  banner.appendChild(emojiEl);
  banner.appendChild(imgEl);
  banner.appendChild(stockPill);
  article.appendChild(banner);

  /* — Body — */
  var body = document.createElement('div');
  body.classList.add('card-body');

  var nameEl = document.createElement('h3');
  nameEl.classList.add('card-name');
  nameEl.textContent = sanitize(product.name);

  var teamEl = document.createElement('p');
  teamEl.classList.add('card-team-name');
  teamEl.textContent = sanitize(product.teamFull || product.team);

  var priceEl = document.createElement('p');
  priceEl.classList.add('card-price');
  priceEl.textContent = formatCLP(product.price);

  var stockEl = document.createElement('p');
  stockEl.classList.add('card-stock-text');
  stockEl.textContent = product.stock > 0
    ? 'Stock: ' + product.stock + ' ud' + (product.stock !== 1 ? 's.' : '.')
    : 'Agotado';

  body.appendChild(nameEl);
  body.appendChild(teamEl);
  body.appendChild(priceEl);
  body.appendChild(stockEl);
  article.appendChild(body);

  /* — Footer / botón — */
  var footer = document.createElement('div');
  footer.classList.add('card-footer');

  var btn = document.createElement('button');
  btn.classList.add('btn-add');
  btn.disabled = product.stock === 0;

  var needsSize = (product.category === 'Polera' || product.category === 'Chaqueta');

  if (product.stock === 0) {
    btn.textContent = 'Sin stock';
  } else if (needsSize) {
    btn.textContent = 'Seleccionar Talla';
  } else {
    var iconEl = document.createElement('span');
    iconEl.textContent = '🛒'; iconEl.setAttribute('aria-hidden', 'true');
    var labelEl = document.createElement('span');
    labelEl.textContent = ' Añadir';
    btn.appendChild(iconEl);
    btn.appendChild(labelEl);
  }

  btn.addEventListener('click', function(e) {
    e.stopPropagation(); /* Prevent double open */
    if (needsSize && product.stock > 0) {
      openProductModal(product, onAdd);
    } else if (product.stock > 0) {
      onAdd(product);
    }
  });

  article.addEventListener('click', function() {
    openProductModal(product, onAdd);
  });

  footer.appendChild(btn);
  article.appendChild(footer);
  return article;
}

/**
 * Renderiza el catálogo filtrado en el grid.
 * @param {Array} products @param {Function} onAdd
 */
function renderCatalog(products, onAdd) {
  var grid    = document.getElementById('products-grid');
  var counter = document.getElementById('results-count');
  if (!grid) return;
  while (grid.firstChild) grid.removeChild(grid.firstChild);

  if (counter) {
    counter.textContent = products.length === 0
      ? 'Sin resultados.'
      : 'Mostrando ' + products.length + ' producto' + (products.length !== 1 ? 's' : '');
  }
  if (products.length === 0) {
    var empty = document.createElement('p');
    empty.classList.add('catalog-empty');
    empty.textContent = 'No hay productos con esos filtros.';
    grid.appendChild(empty);
    return;
  }
  products.forEach(function(p, index) {
    var card = createProductCard(p, onAdd);
    card.style.animationDelay = (index * 0.05) + 's';
    grid.appendChild(card);
  });
}

/**
 * Construye un elemento li para un item del carrito.
 * @param {Object} item @param {Function} onInc @param {Function} onDec @param {Function} onRemove
 * @returns {HTMLLIElement}
 */
function createCartItem(item, onInc, onDec, onRemove) {
  var li = document.createElement('li');
  li.classList.add('cart-item');
  li.id = 'cart-item-' + item.id;

  var nameEl = document.createElement('span');
  nameEl.classList.add('item-name');
  nameEl.textContent = sanitize(item.name);

  var subEl = document.createElement('span');
  subEl.classList.add('item-sub');
  subEl.textContent = sanitize(item.team);

  /* Controls col */
  var controls = document.createElement('div');
  controls.classList.add('item-controls');

  var priceEl = document.createElement('span');
  priceEl.classList.add('item-price');
  priceEl.textContent = formatCLP(item.price * item.qty);

  var btnRemove = document.createElement('button');
  btnRemove.classList.add('btn-remove');
  btnRemove.textContent = 'Quitar';
  btnRemove.setAttribute('aria-label', 'Quitar ' + sanitize(item.name) + ' del carrito');
  btnRemove.addEventListener('click', function() { onRemove(item.id); });

  controls.appendChild(priceEl);
  controls.appendChild(btnRemove);

  /* Qty row */
  var qtyRow = document.createElement('div');
  qtyRow.classList.add('item-qty-row');

  var btnDec = document.createElement('button');
  btnDec.classList.add('qty-btn');
  btnDec.textContent = '−';
  btnDec.setAttribute('aria-label', 'Disminuir cantidad');
  btnDec.addEventListener('click', function() { onDec(item.id); });

  var qtyDisp = document.createElement('span');
  qtyDisp.classList.add('qty-display');
  qtyDisp.textContent = String(item.qty);

  var btnInc = document.createElement('button');
  btnInc.classList.add('qty-btn');
  btnInc.textContent = '+';
  btnInc.setAttribute('aria-label', 'Aumentar cantidad');
  btnInc.disabled = item.qty >= item.maxStock;
  btnInc.addEventListener('click', function() { onInc(item.id); });

  qtyRow.appendChild(btnDec);
  qtyRow.appendChild(qtyDisp);
  qtyRow.appendChild(btnInc);

  li.appendChild(nameEl);
  li.appendChild(controls);
  li.appendChild(subEl);
  li.appendChild(qtyRow);
  return li;
}

/** @param {Array} cart @param {Function} onInc @param {Function} onDec @param {Function} onRemove */
function renderCartList(cart, onInc, onDec, onRemove) {
  var list = document.getElementById('cart-list');
  var emptyEl = document.getElementById('cart-empty');
  if (!list) return;
  while (list.firstChild) list.removeChild(list.firstChild);
  if (cart.length === 0) {
    if (emptyEl) emptyEl.classList.add('visible');
    return;
  }
  if (emptyEl) emptyEl.classList.remove('visible');
  cart.forEach(function(item) {
    list.appendChild(createCartItem(item, onInc, onDec, onRemove));
  });
}

/** @param {Object} totals */
function renderSummary(totals) {
  function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  set('summary-subtotal', formatCLP(totals.subtotal));
  set('summary-discount', '-' + formatCLP(totals.discount));
  set('summary-iva',      formatCLP(totals.iva));
  set('summary-total',    formatCLP(totals.total));

  var discRow   = document.getElementById('discount-row');
  var discLabel = document.getElementById('discount-label');
  if (discRow)   discRow.classList.toggle('visible', totals.pct > 0);
  if (discLabel) discLabel.textContent = 'Descuento (' + totals.pct + '%)';
}

/** @param {string} fieldId @param {string} message */
function setFieldError(fieldId, message) {
  var input = document.getElementById('input-' + fieldId);
  var span  = document.getElementById('error-' + fieldId);
  if (input) input.classList.toggle('invalid', Boolean(message));
  if (span)  span.textContent = sanitize(message);
}

function clearFormErrors() {
  ['name','email','qty'].forEach(function(f) { setFieldError(f, ''); });
}

/** @param {string} message */
function setFormSuccess(message) {
  var el = document.getElementById('form-success');
  if (el) el.textContent = sanitize(message);
}

/* ─── MODAL DE PRODUCTO ─── */

function openProductModal(product, onAdd) {
  var modal = document.getElementById('product-modal');
  var body = document.getElementById('modal-body');
  if (!modal || !body) return;

  while (body.firstChild) body.removeChild(body.firstChild);

  /* Banner visual */
  var banner = document.createElement('div');
  banner.classList.add('modal-banner');
  banner.style.background = 'linear-gradient(145deg, ' + product.color + 'cc 0%, ' + product.color + '55 100%)';

  var emojiEl = document.createElement('span');
  emojiEl.classList.add('modal-emoji');
  emojiEl.textContent = product.emoji || '\uD83C\uDFCE\uFE0F';

  var imgEl = document.createElement('img');
  imgEl.classList.add('modal-img');
  imgEl.alt = sanitize(product.name);
  imgEl.style.opacity = '0';
  imgEl.onload = function() { imgEl.style.opacity = '1'; emojiEl.style.display = 'none'; };
  imgEl.onerror = function() { imgEl.style.display = 'none'; };
  imgEl.src = sanitize(product.image || '');

  banner.appendChild(emojiEl);
  banner.appendChild(imgEl);

  /* Información */
  var infoWrap = document.createElement('div');
  infoWrap.classList.add('modal-info');

  var nameEl = document.createElement('h2');
  nameEl.classList.add('modal-name');
  nameEl.textContent = sanitize(product.name);

  var teamEl = document.createElement('div');
  teamEl.classList.add('modal-team');
  teamEl.textContent = sanitize(product.teamFull || product.team);

  /* Especificaciones */
  var specs = document.createElement('div');
  specs.classList.add('modal-specs');

  function createSpec(label, val) {
    var row = document.createElement('div'); row.classList.add('spec-row');
    var lbl = document.createElement('span'); lbl.classList.add('spec-label'); lbl.textContent = label;
    var vEl = document.createElement('span'); vEl.classList.add('spec-value'); vEl.textContent = val;
    row.appendChild(lbl); row.appendChild(vEl);
    return row;
  }
  specs.appendChild(createSpec('Material', sanitize(product.material || 'Estándar')));
  specs.appendChild(createSpec('Detalles', sanitize(product.details || 'Merchandising oficial')));
  if (product.stock > 0) {
    specs.appendChild(createSpec('Disponibilidad', product.stock + ' unidades en stock'));
  } else {
    specs.appendChild(createSpec('Disponibilidad', 'Agotado temporalmente'));
  }

  var needsSize = (product.category === 'Polera' || product.category === 'Chaqueta');
  var selectedSize = 'L'; // Talla por defecto

  if (needsSize) {
    var sizeWrap = document.createElement('div');
    sizeWrap.classList.add('size-wrap');
    
    var sizeTitle = document.createElement('div');
    sizeTitle.classList.add('spec-label');
    sizeTitle.textContent = 'Talla';
    sizeWrap.appendChild(sizeTitle);

    var sizeGroup = document.createElement('div');
    sizeGroup.classList.add('size-group');

    ['S', 'M', 'L', 'XL'].forEach(function(sz) {
      var sBtn = document.createElement('button');
      sBtn.classList.add('size-btn');
      if (sz === selectedSize) sBtn.classList.add('active');
      sBtn.textContent = sz;
      sBtn.addEventListener('click', function() {
        sizeGroup.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
        sBtn.classList.add('active');
        selectedSize = sz;
      });
      sizeGroup.appendChild(sBtn);
    });
    sizeWrap.appendChild(sizeGroup);
    specs.appendChild(sizeWrap);
  }

  /* Footer con precio y botón */
  var footer = document.createElement('div');
  footer.classList.add('modal-footer');

  var priceEl = document.createElement('div');
  priceEl.classList.add('modal-price');
  priceEl.textContent = formatCLP(product.price);

  var btn = document.createElement('button');
  btn.classList.add('btn-add');
  btn.style.width = 'auto';
  btn.disabled = product.stock === 0;
  btn.textContent = product.stock === 0 ? 'Sin Stock' : 'Añadir al carrito';
  btn.addEventListener('click', function() {
    var itemToAdd = product;
    if (needsSize) {
      itemToAdd = Object.assign({}, product, {
        id: product.id + '-' + selectedSize,
        name: product.name + ' (Talla ' + selectedSize + ')'
      });
    }
    onAdd(itemToAdd);
    closeProductModal();
  });

  footer.appendChild(priceEl);
  footer.appendChild(btn);

  infoWrap.appendChild(nameEl);
  infoWrap.appendChild(teamEl);
  infoWrap.appendChild(specs);
  infoWrap.appendChild(footer);

  body.appendChild(banner);
  body.appendChild(infoWrap);

  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  var modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('visible');
    var s = document.getElementById('cart-sidebar');
    if (!s || !s.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }
}
