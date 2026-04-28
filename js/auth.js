/* auth.js — Sistema de autenticación local (localStorage).
   No usa backend real; simula registro/login con hash básico para EVA educativa.
   Mantiene política anti-XSS: cero innerHTML, todo createElement. */

var AUTH_KEY = 'paddock_users_v1';
var SESSION_KEY = 'paddock_session_v1';

/* ── Helpers ── */
function hashSimple(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h.toString(16);
}

function getUsers() {
  try { var r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : []; }
  catch(e) { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(users)); }
  catch(e) { console.warn('localStorage no disponible'); }
}

function getSession() {
  try { var r = localStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : null; }
  catch(e) { return null; }
}

function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name })); }
  catch(e) {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); }
  catch(e) {}
}

/* ── Validaciones ── */
var AUTH_RULES = {
  name:  /^[a-zA-ZÀ-ÿ\s]{3,60}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  pass:  /^(?=.*[A-Za-z])(?=.*\d).{6,}$/   /* mín 6 chars, 1 letra, 1 número */
};

function validateAuthForm(fields, isRegister) {
  var errors = {};
  if (isRegister && !AUTH_RULES.name.test(fields.name || '')) {
    errors.name = 'Nombre inválido (mín. 3 letras, solo caracteres permitidos).';
  }
  if (!AUTH_RULES.email.test(fields.email || '')) {
    errors.email = 'Correo electrónico inválido.';
  }
  if (!AUTH_RULES.pass.test(fields.pass || '')) {
    errors.pass = 'Contraseña: mín. 6 caracteres, al menos 1 letra y 1 número.';
  }
  if (isRegister && fields.pass !== fields.pass2) {
    errors.pass2 = 'Las contraseñas no coinciden.';
  }
  return { isValid: Object.keys(errors).length === 0, errors: errors };
}

/* ── Acciones ── */
function registerUser(fields) {
  var result = validateAuthForm(fields, true);
  if (!result.isValid) return { ok: false, errors: result.errors };
  var users = getUsers();
  if (users.find(function(u) { return u.email === fields.email; })) {
    return { ok: false, errors: { email: 'Este correo ya está registrado.' } };
  }
  var newUser = { name: sanitize(fields.name), email: fields.email, passHash: hashSimple(fields.pass) };
  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);
  return { ok: true, user: newUser };
}

function loginUser(fields) {
  var result = validateAuthForm(fields, false);
  if (!result.isValid) return { ok: false, errors: result.errors };
  var users = getUsers();
  var user = users.find(function(u) {
    return u.email === fields.email && u.passHash === hashSimple(fields.pass);
  });
  if (!user) return { ok: false, errors: { email: 'Correo o contraseña incorrectos.' } };
  saveSession(user);
  return { ok: true, user: user };
}

function logoutUser() {
  clearSession();
  updateAuthButton();
}

/* ── UI del botón de cuenta en header ── */
function updateAuthButton() {
  var btn = document.getElementById('btn-auth');
  if (!btn) return;
  var session = getSession();
  if (session) {
    btn.textContent = '👤 ' + session.name.split(' ')[0];
    btn.title = 'Cerrar sesión (' + session.email + ')';
    btn.dataset.loggedIn = 'true';
  } else {
    btn.textContent = 'Ingresar / Crear cuenta';
    btn.title = '';
    btn.dataset.loggedIn = 'false';
  }
}

/* ── Modal de Autenticación ── */
function openAuthModal() {
  var session = getSession();
  if (session) {
    if (confirm('¿Deseas cerrar sesión, ' + session.name.split(' ')[0] + '?')) {
      logoutUser();
      showToast('Sesión cerrada. ¡Hasta pronto!', 'info');
    }
    return;
  }
  var modal = document.getElementById('auth-modal');
  if (!modal) return;
  renderAuthForm(false);
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  var modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('visible');
  var session = document.getElementById('cart-sidebar');
  if (!session || !session.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function renderAuthForm(isRegister) {
  var body = document.getElementById('auth-modal-body');
  if (!body) return;
  while (body.firstChild) body.removeChild(body.firstChild);

  /* Título */
  var title = document.createElement('h2');
  title.className = 'auth-title';
  title.textContent = isRegister ? 'Crear Cuenta' : 'Iniciar Sesión';
  body.appendChild(title);

  /* Subtítulo / Switch */
  var sub = document.createElement('p');
  sub.className = 'auth-sub';
  var subText = document.createTextNode(isRegister ? '¿Ya tienes cuenta? ' : '¿Sin cuenta? ');
  var switchLink = document.createElement('button');
  switchLink.className = 'auth-switch-link';
  switchLink.textContent = isRegister ? 'Iniciar Sesión' : 'Regístrate gratis';
  switchLink.addEventListener('click', function() { renderAuthForm(!isRegister); });
  sub.appendChild(subText);
  sub.appendChild(switchLink);
  body.appendChild(sub);

  /* Formulario */
  var form = document.createElement('form');
  form.className = 'auth-form';
  form.id = 'auth-form-inner';
  form.noValidate = true;

  function createField(lbl, id, type, placeholder) {
    var grp = document.createElement('div'); grp.className = 'form-group';
    var label = document.createElement('label'); label.htmlFor = id; label.textContent = lbl;
    var input = document.createElement('input');
    input.type = type; input.id = id; input.placeholder = placeholder;
    input.autocomplete = id === 'auth-email' ? 'email' : (id === 'auth-pass' ? 'current-password' : 'off');
    var err = document.createElement('span'); err.className = 'field-error'; err.id = 'err-' + id;
    grp.appendChild(label); grp.appendChild(input); grp.appendChild(err);
    return grp;
  }

  if (isRegister) form.appendChild(createField('Nombre completo', 'auth-name', 'text', 'Carlos Sainz'));
  form.appendChild(createField('Correo electrónico', 'auth-email', 'email', 'carlos@ferrari.com'));
  form.appendChild(createField('Contraseña', 'auth-pass', 'password', 'Mín. 6 chars, 1 letra + 1 número'));
  if (isRegister) form.appendChild(createField('Confirmar contraseña', 'auth-pass2', 'password', 'Repite la contraseña'));

  var submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-checkout';
  submitBtn.textContent = isRegister ? 'Crear Cuenta ✓' : 'Ingresar →';
  form.appendChild(submitBtn);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    /* Limpiar errores */
    form.querySelectorAll('.field-error').forEach(function(el) { el.textContent = ''; });
    form.querySelectorAll('input').forEach(function(el) { el.classList.remove('invalid'); });

    var fields = {
      name:  (document.getElementById('auth-name')  || {}).value || '',
      email: (document.getElementById('auth-email') || {}).value || '',
      pass:  (document.getElementById('auth-pass')  || {}).value || '',
      pass2: (document.getElementById('auth-pass2') || {}).value || ''
    };

    var result = isRegister ? registerUser(fields) : loginUser(fields);

    if (!result.ok) {
      Object.keys(result.errors).forEach(function(key) {
        var errEl = document.getElementById('err-auth-' + key);
        var inputEl = document.getElementById('auth-' + key);
        if (errEl) errEl.textContent = result.errors[key];
        if (inputEl) inputEl.classList.add('invalid');
      });
      return;
    }

    updateAuthButton();
    closeAuthModal();
    showToast('¡Bienvenido/a, ' + result.user.name.split(' ')[0] + '! 🏎️', 'success', 4000);
  });

  body.appendChild(form);
}
/* ── Restaurar sesión al cargar la página ──
   Esto hace que el usuario siga "logueado" aunque recargue o cierre y abra el navegador.
   localStorage persiste indefinidamente hasta que el usuario limpia el navegador. */
document.addEventListener('DOMContentLoaded', function () {
  var session = getSession();

  /* Actualizar el botón del header inmediatamente */
  updateAuthButton();

  /* Si hay sesión activa, mostrar toast de bienvenida suave (solo una vez por sesión de pestaña) */
  if (session && !sessionStorage.getItem('paddock_welcomed')) {
    sessionStorage.setItem('paddock_welcomed', '1');
    setTimeout(function () {
      showToast('¡Bienvenido de vuelta, ' + session.name.split(' ')[0] + '! 🏎️', 'info', 3500);
    }, 900); /* espera a que la página cargue completamente */
  }
});
