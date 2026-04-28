/* payment.js — Sistema de pago y envío simulado.
   Opciones de pago y envío con validación. Anti-XSS: solo createElement. */

var SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Envío Estándar (5-7 días)',  price: 2990, icon: '📦' },
  { id: 'express',  label: 'Envío Express (1-2 días)',   price: 5990, icon: '⚡' },
  { id: 'pickup',   label: 'Retiro en tienda (Gratis)',  price: 0,    icon: '🏪' }
];

var PAYMENT_METHODS = [
  { id: 'card',       label: 'Tarjeta de Crédito / Débito', icon: '💳' },
  { id: 'transfer',   label: 'Transferencia Bancaria',       icon: '🏦' },
  { id: 'webpay',     label: 'WebPay',                       icon: '🇨🇱' }
];

var selectedShipping = null;
var selectedPayment  = null;

/* ── Validación de tarjeta (solo si método = card) ── */
var CARD_RULES = {
  number: /^\d{16}$/,
  expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvv:    /^\d{3,4}$/,
  holder: /^[a-zA-ZÀ-ÿ\s]{4,60}$/
};

function luhnCheck(num) {
  var sum = 0, alt = false;
  for (var i = num.length - 1; i >= 0; i--) {
    var n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function validateCard(fields) {
  var errors = {};
  var raw = (fields.number || '').replace(/\s/g, '');
  if (!CARD_RULES.number.test(raw) || !luhnCheck(raw)) errors.number = 'Número de tarjeta inválido.';
  if (!CARD_RULES.expiry.test(fields.expiry || '')) errors.expiry = 'Formato inválido (MM/AA).';
  if (!CARD_RULES.cvv.test(fields.cvv || ''))       errors.cvv    = 'CVV inválido (3-4 dígitos).';
  if (!CARD_RULES.holder.test(fields.holder || '')) errors.holder = 'Nombre inválido.';
  return { isValid: Object.keys(errors).length === 0, errors: errors };
}

/* ── Renderiza el paso de pago DENTRO del sidebar ── */
function renderPaymentStep(totalObj, onConfirm) {
  var container = document.getElementById('payment-step');
  if (!container) return;
  while (container.firstChild) container.removeChild(container.firstChild);
  container.style.display = 'block';

  /* ── Sección Envío ── */
  var shippingTitle = document.createElement('p');
  shippingTitle.className = 'pay-section-title';
  shippingTitle.textContent = '📦 Método de Envío';
  container.appendChild(shippingTitle);

  SHIPPING_OPTIONS.forEach(function(opt) {
    var lbl = document.createElement('label');
    lbl.className = 'pay-option';
    lbl.htmlFor = 'ship-' + opt.id;

    var radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'shipping'; radio.id = 'ship-' + opt.id; radio.value = opt.id;
    radio.addEventListener('change', function() {
      selectedShipping = opt;
      updatePayTotal(totalObj);
      document.querySelectorAll('.pay-option').forEach(function(l) { l.classList.remove('selected'); });
      lbl.classList.add('selected');
    });

    var icon = document.createElement('span'); icon.className = 'pay-opt-icon'; icon.textContent = opt.icon;
    var text = document.createElement('span'); text.className = 'pay-opt-label'; text.textContent = opt.label;
    var price = document.createElement('span'); price.className = 'pay-opt-price';
    price.textContent = opt.price === 0 ? 'Gratis' : formatCLP(opt.price);

    lbl.appendChild(radio); lbl.appendChild(icon); lbl.appendChild(text); lbl.appendChild(price);
    container.appendChild(lbl);
  });

  /* ── Sección Método de Pago ── */
  var payTitle = document.createElement('p');
  payTitle.className = 'pay-section-title';
  payTitle.textContent = '💳 Método de Pago';
  container.appendChild(payTitle);

  PAYMENT_METHODS.forEach(function(method) {
    var lbl = document.createElement('label');
    lbl.className = 'pay-option';
    lbl.htmlFor = 'pay-' + method.id;

    var radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'payment'; radio.id = 'pay-' + method.id; radio.value = method.id;
    radio.addEventListener('change', function() {
      selectedPayment = method;
      document.querySelectorAll('.pay-option').forEach(function(l) {
        if (l.htmlFor && l.htmlFor.indexOf('pay-') === 0) l.classList.remove('selected');
      });
      lbl.classList.add('selected');
      renderPaymentFields(method.id);
    });

    var icon = document.createElement('span'); icon.className = 'pay-opt-icon'; icon.textContent = method.icon;
    var text = document.createElement('span'); text.className = 'pay-opt-label'; text.textContent = method.label;

    lbl.appendChild(radio); lbl.appendChild(icon); lbl.appendChild(text);
    container.appendChild(lbl);
  });

  /* Contenedor dinámico según método */
  var cardSection = document.createElement('div');
  cardSection.id = 'card-fields-section';
  container.appendChild(cardSection);

  /* ── Total final con envío ── */
  var totalBlock = document.createElement('div');
  totalBlock.className = 'pay-total-block'; totalBlock.id = 'pay-total-block';
  var totalLbl = document.createElement('span'); totalLbl.className = 'total-label'; totalLbl.textContent = 'TOTAL FINAL';
  var totalAmt = document.createElement('span'); totalAmt.className = 'total-amount'; totalAmt.id = 'pay-total-amount';
  totalAmt.textContent = formatCLP(totalObj.total);
  totalBlock.appendChild(totalLbl); totalBlock.appendChild(totalAmt);
  container.appendChild(totalBlock);

  /* ── Botón Confirmar Pago ── */
  var errMsg = document.createElement('p');
  errMsg.className = 'field-error'; errMsg.id = 'pay-error'; errMsg.style.textAlign = 'center';
  container.appendChild(errMsg);

  var confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-checkout'; confirmBtn.type = 'button';
  confirmBtn.textContent = '🏁 Confirmar Pago';
  confirmBtn.addEventListener('click', function() {
    var errEl = document.getElementById('pay-error');
    errEl.textContent = '';

    if (!selectedShipping) { errEl.textContent = 'Selecciona un método de envío.'; return; }
    if (!selectedPayment)  { errEl.textContent = 'Selecciona un método de pago.'; return; }

    if (selectedPayment.id === 'card') {
      var cardErrors = validateCard({
        number: (document.getElementById('card-number') || {}).value || '',
        expiry: (document.getElementById('card-expiry') || {}).value || '',
        cvv:    (document.getElementById('card-cvv')    || {}).value || '',
        holder: (document.getElementById('card-holder') || {}).value || ''
      });
      if (!cardErrors.isValid) {
        var firstErr = Object.values(cardErrors.errors)[0];
        errEl.textContent = firstErr;
        return;
      }
    }

    if (selectedPayment.id === 'transfer') {
      var compEl = document.getElementById('transfer-comprobante');
      if (!compEl || !compEl.value.trim()) {
        errEl.textContent = 'Ingresa el número de comprobante de transferencia.';
        return;
      }
    }

    if (selectedPayment.id === 'webpay') {
      var wpBank = document.querySelector('input[name="webpay-bank"]:checked');
      if (!wpBank) {
        errEl.textContent = 'Selecciona tu banco para continuar con WebPay.';
        return;
      }
    }

    onConfirm(selectedShipping, selectedPayment);
  });
  container.appendChild(confirmBtn);
}

/* ── Dispatcher: muestra campos según método de pago ── */
function renderPaymentFields(methodId) {
  var section = document.getElementById('card-fields-section');
  if (!section) return;
  while (section.firstChild) section.removeChild(section.firstChild);

  if (methodId === 'card')     renderCardFields(section);
  if (methodId === 'transfer') renderTransferFields(section);
  if (methodId === 'webpay')   renderWebpayFields(section);
}

/* ── Tarjeta de crédito / débito ── */
function renderCardFields(section) {
  var card = document.createElement('div'); card.className = 'card-fields-wrap';

  function cardField(lbl, id, type, placeholder, numeric) {
    var grp = document.createElement('div'); grp.className = 'form-group';
    var label = document.createElement('label'); label.htmlFor = id; label.textContent = lbl;
    var input = document.createElement('input');
    input.type = type; input.id = id; input.placeholder = placeholder;
    if (numeric) input.setAttribute('inputmode', 'numeric');
    var err = document.createElement('span'); err.className = 'field-error'; err.id = 'err-' + id;
    if (id === 'card-number') {
      input.maxLength = 19;
      input.addEventListener('input', function() {
        var val = input.value.replace(/\D/g, '').slice(0, 16);
        input.value = val.replace(/(.{4})/g, '$1 ').trim();
      });
    }
    if (id === 'card-expiry') {
      input.maxLength = 5; input.placeholder = 'MM/AA';
      input.addEventListener('input', function() {
        var val = input.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
        input.value = val;
      });
    }
    grp.appendChild(label); grp.appendChild(input); grp.appendChild(err);
    return grp;
  }

  card.appendChild(cardField('Nombre en tarjeta', 'card-holder', 'text', 'CARLOS SAINZ', false));
  card.appendChild(cardField('Número de tarjeta', 'card-number', 'text', '0000 0000 0000 0000', true));
  var row = document.createElement('div'); row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:.75rem;';
  row.appendChild(cardField('Vencimiento', 'card-expiry', 'text', 'MM/AA', true));
  row.appendChild(cardField('CVV', 'card-cvv', 'password', '•••', true));
  card.appendChild(row);
  section.appendChild(card);
}

/* ── Transferencia bancaria ── */
function renderTransferFields(section) {
  var wrap = document.createElement('div'); wrap.className = 'card-fields-wrap transfer-info-wrap';

  var infoTitle = document.createElement('p');
  infoTitle.className = 'pay-section-title'; infoTitle.textContent = '🏦 Datos para transferir';
  wrap.appendChild(infoTitle);

  var bankData = [
    { label: 'Banco',          value: 'BancoEstado' },
    { label: 'Tipo de cuenta', value: 'Cuenta Corriente' },
    { label: 'Número',         value: '00-123-45678-90' },
    { label: 'RUT titular',    value: '12.345.678-9' },
    { label: 'Titular',        value: 'Paddock Store SpA' },
    { label: 'Correo',         value: 'pagos@paddockstore.cl' }
  ];

  var grid = document.createElement('div'); grid.className = 'transfer-data-grid';
  bankData.forEach(function(item) {
    var lbl = document.createElement('span'); lbl.className = 'transfer-label'; lbl.textContent = item.label;
    var val = document.createElement('span'); val.className = 'transfer-value'; val.textContent = item.value;
    grid.appendChild(lbl); grid.appendChild(val);
  });
  wrap.appendChild(grid);

  var note = document.createElement('p'); note.className = 'transfer-note';
  note.textContent = '⚠️ Incluye tu nombre completo en el comentario. El pedido se confirma en 24 hrs hábiles.';
  wrap.appendChild(note);

  var grp = document.createElement('div'); grp.className = 'form-group';
  var lbl2 = document.createElement('label'); lbl2.htmlFor = 'transfer-comprobante';
  lbl2.textContent = 'Número de comprobante (obligatorio)';
  var inp = document.createElement('input');
  inp.type = 'text'; inp.id = 'transfer-comprobante';
  inp.placeholder = 'Ej: 987654321'; inp.setAttribute('inputmode', 'numeric');
  var err = document.createElement('span'); err.className = 'field-error';
  grp.appendChild(lbl2); grp.appendChild(inp); grp.appendChild(err);
  wrap.appendChild(grp);

  section.appendChild(wrap);
}

/* ── WebPay ── */
function renderWebpayFields(section) {
  var wrap = document.createElement('div'); wrap.className = 'card-fields-wrap webpay-wrap';

  var header = document.createElement('div'); header.className = 'webpay-header';
  var wpLogo = document.createElement('div'); wpLogo.className = 'webpay-logo-badge';
  var wpIcon = document.createElement('span'); wpIcon.textContent = '🇨🇱';
  var wpName = document.createElement('span'); wpName.className = 'webpay-brand'; wpName.textContent = 'WebPay Plus';
  var wpSub  = document.createElement('span'); wpSub.className  = 'webpay-sub';   wpSub.textContent  = 'Powered by Transbank';
  wpLogo.appendChild(wpIcon); wpLogo.appendChild(wpName); wpLogo.appendChild(wpSub);
  header.appendChild(wpLogo);
  wrap.appendChild(header);

  var bankTitle = document.createElement('p');
  bankTitle.className = 'pay-section-title'; bankTitle.textContent = '🏦 Selecciona tu banco';
  wrap.appendChild(bankTitle);

  var banks = [
    { id: 'bch',    name: 'Banco de Chile', icon: '🔵' },
    { id: 'bce',    name: 'BancoEstado',    icon: '🟡' },
    { id: 'bci',    name: 'BCI',            icon: '🟠' },
    { id: 'santan', name: 'Santander',      icon: '🔴' },
    { id: 'scot',   name: 'Scotiabank',     icon: '🟣' },
    { id: 'itau',   name: 'Itaú',           icon: '⚫' }
  ];

  var bankGrid = document.createElement('div'); bankGrid.className = 'webpay-bank-grid';
  banks.forEach(function(bank) {
    var lbl = document.createElement('label'); lbl.className = 'webpay-bank-btn';
    var radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'webpay-bank'; radio.value = bank.id;
    radio.addEventListener('change', function() {
      bankGrid.querySelectorAll('.webpay-bank-btn').forEach(function(b) { b.classList.remove('selected'); });
      lbl.classList.add('selected');
    });
    var ico = document.createElement('span'); ico.className = 'wp-bank-icon'; ico.textContent = bank.icon;
    var nm  = document.createElement('span'); nm.className  = 'wp-bank-name'; nm.textContent  = bank.name;
    lbl.appendChild(radio); lbl.appendChild(ico); lbl.appendChild(nm);
    bankGrid.appendChild(lbl);
  });
  wrap.appendChild(bankGrid);

  var sec = document.createElement('p'); sec.className = 'webpay-security';
  sec.textContent = '🔒 Serás redirigido al portal seguro de tu banco. Transacción protegida con SSL 256-bit.';
  wrap.appendChild(sec);

  section.appendChild(wrap);
}

function updatePayTotal(totalObj) {
  var el = document.getElementById('pay-total-amount');
  if (!el) return;
  var shipCost = selectedShipping ? selectedShipping.price : 0;
  el.textContent = formatCLP(totalObj.total + shipCost);
}
