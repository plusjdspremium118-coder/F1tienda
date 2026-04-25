/* cart.js — Lógica de negocio del carrito. Funciones puras sin efectos de DOM.
   IVA Chile: 19%. Descuentos: 3+ items→5%, 5+→10%, 8+→15%. */

var STORAGE_KEY = 'paddock_cart_v1';

/** @returns {Array} */
function loadCart() {
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch(e) { return []; }
}

/** @param {Array} cart */
function saveCart(cart) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  catch(e) { console.warn('localStorage no disponible'); }
}

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 * @param {Array} cart @param {Object} product
 * @returns {{cart:Array, added:boolean, reason:string}}
 */
function addItem(cart, product) {
  if (product.stock <= 0) return { cart: cart, added: false, reason: 'Sin stock disponible.' };
  var existing = cart.find(function(i) { return i.id === product.id; });
  if (existing) {
    if (existing.qty >= product.stock)
      return { cart: cart, added: false, reason: 'Stock máximo alcanzado (' + product.stock + ' uds).' };
    return {
      cart: cart.map(function(i) { return i.id === product.id ? Object.assign({}, i, { qty: i.qty + 1 }) : i; }),
      added: true, reason: ''
    };
  }
  return {
    cart: cart.concat([{ id: product.id, name: product.name, team: product.team,
      price: product.price, qty: 1, maxStock: product.stock }]),
    added: true, reason: ''
  };
}

/**
 * Elimina un item del carrito por ID.
 * @param {Array} cart @param {number} id @returns {Array}
 */
function removeItem(cart, id) {
  return cart.filter(function(i) { return i.id !== id; });
}

/**
 * Cambia la cantidad de un item. Si queda en 0, lo elimina.
 * @param {Array} cart @param {number} id @param {number} delta @returns {Array}
 */
function changeQty(cart, id, delta) {
  return cart.reduce(function(acc, item) {
    if (item.id !== id) { acc.push(item); return acc; }
    var newQty = item.qty + delta;
    if (newQty <= 0) return acc;
    if (newQty > item.maxStock) { acc.push(item); return acc; }
    acc.push(Object.assign({}, item, { qty: newQty }));
    return acc;
  }, []);
}

/** @returns {Array} */
function clearCart() { return []; }

/**
 * Calcula totales: subtotal, descuento, IVA 19%, total.
 * @param {Array} cart @returns {Object}
 */
function calculateTotal(cart) {
  var subtotal   = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var totalItems = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  var pct        = totalItems >= 8 ? 15 : totalItems >= 5 ? 10 : totalItems >= 3 ? 5 : 0;
  var discount   = Math.round(subtotal * pct / 100);
  var afterDisc  = subtotal - discount;
  var iva        = Math.round(afterDisc * 0.19);
  var total      = afterDisc + iva;
  return { subtotal: subtotal, discount: discount, afterDisc: afterDisc,
           iva: iva, total: total, pct: pct, totalItems: totalItems };
}

/** @param {Array} cart @returns {number} */
function getTotalUnits(cart) {
  return cart.reduce(function(s, i) { return s + i.qty; }, 0);
}
