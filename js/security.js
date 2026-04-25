/*
 * security.js — Sanitización y validación de inputs.
 *
 * ESTRATEGIA ANTI-XSS:
 * 1. PROHIBIDO innerHTML/outerHTML — todo DOM se construye con createElement+textContent.
 * 2. sanitize() elimina etiquetas HTML y caracteres peligrosos de cualquier string.
 * 3. Validaciones con Regex estrictas en cada campo del formulario.
 * 4. Se bloquean números negativos, scripts y formatos inválidos.
 * 5. Sin eval(), Function() ni setTimeout con strings.
 */

/** @param {string} raw @returns {string} */
function sanitize(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<[^>]*>|javascript:|on\w+\s*=|&[a-z]+;/gi, '')
    .replace(/[<>&"'`;\(\)]/g, '');
}

/** @param {string} v @returns {{valid:boolean,message:string}} */
function validateName(v) {
  var c = sanitize(v.trim());
  if (!c) return { valid: false, message: 'El nombre es requerido.' };
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s.\-]{2,80}$/.test(c))
    return { valid: false, message: 'Solo letras y espacios. Mín. 2 caracteres.' };
  return { valid: true, message: '' };
}

/** @param {string} v @returns {{valid:boolean,message:string}} */
function validateEmail(v) {
  var c = sanitize(v.trim());
  if (!c) return { valid: false, message: 'El correo es requerido.' };
  if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(c))
    return { valid: false, message: 'Ingresa un correo válido.' };
  return { valid: true, message: '' };
}

/** @param {string|number} v @returns {{valid:boolean,message:string}} */
function validateQty(v) {
  var s = String(v).trim();
  if (!s) return { valid: false, message: 'La cantidad es requerida.' };
  if (!/^([1-9]|10)$/.test(s))
    return { valid: false, message: 'Cantidad entre 1 y 10 (entero positivo).' };
  return { valid: true, message: '' };
}

/** @param {{name:string,email:string,qty:string}} f @returns {{isValid:boolean,errors:Object}} */
function validateForm(f) {
  var errors = {};
  var nr = validateName(f.name), er = validateEmail(f.email), qr = validateQty(f.qty);
  if (!nr.valid) errors.name  = nr.message;
  if (!er.valid) errors.email = er.message;
  if (!qr.valid) errors.qty   = qr.message;
  return { isValid: Object.keys(errors).length === 0, errors: errors };
}
