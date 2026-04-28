/* footer.js — Interactividad del Footer
   Maneja: navegación al catálogo con filtros, modales de información,
   logo como volver al inicio, y bottom-links legales. */

/* ─── Contenido de los modales informativos ─── */
var INFO_CONTENT = {

  faq: {
    title: 'Preguntas Frecuentes',
    html: [
      { q: '¿Los productos son oficiales?', a: 'Sí, todos nuestros productos son réplicas de alta calidad de la temporada 2026. Este es un proyecto educativo.' },
      { q: '¿Cuánto tarda el envío?', a: 'Envío estándar: 5–7 días hábiles. Express: 24–48 horas. Retiro en tienda: inmediato.' },
      { q: '¿Puedo cambiar mi pedido?', a: 'Puedes modificar o cancelar tu pedido dentro de las primeras 2 horas después de confirmarlo.' },
      { q: '¿Aceptan devoluciones?', a: 'Sí, tienes 30 días para devolver cualquier producto en perfectas condiciones con boleta.' },
      { q: '¿Tienen tallas internacionales?', a: 'Sí, manejamos S, M, L y XL equivalentes a estándares europeos. Consulta nuestra guía de tallas.' },
      { q: '¿Puedo rastrear mi pedido?', a: 'Una vez despachado, recibirás un correo con el número de seguimiento y link de rastreo.' }
    ]
  },

  envios: {
    title: 'Envíos y Devoluciones',
    table: {
      headers: ['Método', 'Tiempo', 'Costo'],
      rows: [
        ['Estándar', '5–7 días hábiles', '$3.990 CLP'],
        ['Express', '24–48 horas', '$7.990 CLP'],
        ['Retiro en tienda', 'Inmediato', 'Gratis']
      ]
    },
    extra: 'Devoluciones: 30 días desde la recepción. El producto debe estar sin uso, con etiquetas y embalaje original. El costo de devolución es absorbido por Paddock Store si el error es nuestro.'
  },

  tallas: {
    title: 'Guía de Tallas',
    table: {
      headers: ['Talla', 'Pecho (cm)', 'Largo (cm)', 'Equivalente EU'],
      rows: [
        ['S',  '88–96',  '68', 'S / 44'],
        ['M',  '96–104', '71', 'M / 46'],
        ['L',  '104–112','74', 'L / 48'],
        ['XL', '112–120','77', 'XL / 50']
      ]
    },
    extra: 'Consejo: Si estás entre dos tallas, te recomendamos elegir la talla mayor para mayor comodidad. Nuestras prendas están cortadas al estilo europeo (slim fit).'
  },

  pagos: {
    title: 'Métodos de Pago',
    list: [
      { icon: '💳', name: 'Visa / Mastercard', desc: 'Tarjetas de crédito y débito. Cuotas disponibles sin interés.' },
      { icon: '🇨🇱', name: 'WebPay Plus', desc: 'Plataforma oficial de Transbank. Pago 100% seguro con autenticación bancaria.' },
      { icon: '🏦', name: 'Transferencia Bancaria', desc: 'Banco de Chile / BancoEstado / Scotiabank. Se confirma en 24 horas hábiles.' },
      { icon: '💴', name: 'Tarjeta Débito', desc: 'Compatible con Redcompra y débito internacional Visa/Mastercard.' }
    ],
    extra: 'Todos los pagos están protegidos con cifrado SSL de 256 bits. Nunca almacenamos datos de tarjeta en nuestros servidores.'
  },

  contacto: {
    title: 'Contacto',
    contacts: [
      { icon: '📧', label: 'Email', value: 'soporte@paddockstore.cl' },
      { icon: '📱', label: 'WhatsApp', value: '+56 9 1234 5678' },
      { icon: '🕐', label: 'Horario', value: 'Lun–Vie 09:00–18:00 hrs' },
      { icon: '📍', label: 'Dirección', value: 'Av. Vitacura 2939, Las Condes, Santiago' }
    ],
    extra: 'Para consultas sobre pedidos, menciona tu número de orden. Tiempo de respuesta promedio: 2 horas en horario hábil.'
  },

  privacidad: {
    title: 'Política de Privacidad',
    paragraphs: [
      'Paddock Store F1 recopila únicamente los datos necesarios para procesar tu pedido: nombre, correo electrónico y dirección de envío.',
      'No compartimos tu información personal con terceros con fines comerciales. Tus datos son utilizados exclusivamente para gestionar tu compra y enviarte actualizaciones de estado.',
      'Tienes derecho a solicitar la eliminación de tus datos en cualquier momento escribiéndonos a privacidad@paddockstore.cl.',
      'Utilizamos cookies técnicas necesarias para el funcionamiento de la tienda y cookies analíticas anónimas para mejorar tu experiencia (puedes desactivarlas en la configuración de tu navegador).',
      'Este sitio es un proyecto educativo de Ingeniería Informática. No se procesan pagos reales.'
    ]
  },

  terminos: {
    title: 'Términos de Uso',
    paragraphs: [
      'Al utilizar Paddock Store F1, aceptas que se trata de un proyecto educativo sin fines comerciales reales, desarrollado en el contexto de la carrera de Ingeniería Informática.',
      'Los precios y productos mostrados son referencias educativas. Las imágenes y marcas pertenecen a sus respectivos dueños (FIA, Formula One Management, escuderías).',
      'No nos hacemos responsables por daños derivados del uso de este sitio. El sistema de pago es una simulación y no procesa transacciones reales.',
      'Queda prohibida la reproducción total o parcial del código fuente de este proyecto sin autorización expresa del autor.'
    ]
  },

  cookies: {
    title: 'Política de Cookies',
    list: [
      { icon: '⚙️', name: 'Cookies técnicas', desc: 'Necesarias para el funcionamiento del carrito y la sesión de usuario. No pueden desactivarse.' },
      { icon: '📊', name: 'Cookies analíticas', desc: 'Usamos métricas anónimas para mejorar la experiencia. Puedes rechazarlas sin afectar la navegación.' },
      { icon: '🚫', name: 'Cookies de publicidad', desc: 'No utilizamos cookies de seguimiento publicitario en este sitio.' }
    ],
    extra: 'Al continuar navegando en Paddock Store F1, aceptas el uso de cookies técnicas. Puedes gestionar las demás en la configuración de tu navegador.'
  }
};

/* ─── Renderizar contenido del modal ─── */
function renderInfoContent(key) {
  var data = INFO_CONTENT[key];
  if (!data) return;

  var body = document.getElementById('info-modal-body');
  if (!body) return;

  /* Limpiar */
  while (body.firstChild) body.removeChild(body.firstChild);

  /* Título */
  var h2 = document.createElement('h2');
  h2.className = 'info-modal-title';
  h2.textContent = data.title;
  body.appendChild(h2);

  var divider = document.createElement('div');
  divider.className = 'info-modal-divider';
  body.appendChild(divider);

  /* FAQ: accordión */
  if (data.html) {
    data.html.forEach(function(item) {
      var block = document.createElement('div');
      block.className = 'faq-item';

      var q = document.createElement('p');
      q.className = 'faq-q';
      q.textContent = '▸ ' + item.q;

      var a = document.createElement('p');
      a.className = 'faq-a';
      a.textContent = item.a;

      block.appendChild(q);
      block.appendChild(a);
      body.appendChild(block);
    });
  }

  /* Tabla */
  if (data.table) {
    var table = document.createElement('table');
    table.className = 'info-table';

    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    data.table.headers.forEach(function(h) {
      var th = document.createElement('th');
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    data.table.rows.forEach(function(row) {
      var tr = document.createElement('tr');
      row.forEach(function(cell) {
        var td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    body.appendChild(table);
  }

  /* Lista de items (pagos, cookies) */
  if (data.list) {
    data.list.forEach(function(item) {
      var row = document.createElement('div');
      row.className = 'info-list-item';

      var icon = document.createElement('span');
      icon.className = 'info-list-icon';
      icon.textContent = item.icon;

      var text = document.createElement('div');
      var name = document.createElement('strong');
      name.textContent = item.name;
      var desc = document.createElement('p');
      desc.className = 'info-list-desc';
      desc.textContent = item.desc;
      text.appendChild(name);
      text.appendChild(desc);

      row.appendChild(icon);
      row.appendChild(text);
      body.appendChild(row);
    });
  }

  /* Contacto */
  if (data.contacts) {
    data.contacts.forEach(function(c) {
      var row = document.createElement('div');
      row.className = 'info-contact-row';

      var icon = document.createElement('span');
      icon.className = 'info-contact-icon';
      icon.textContent = c.icon;

      var label = document.createElement('span');
      label.className = 'info-contact-label';
      label.textContent = c.label + ':';

      var value = document.createElement('span');
      value.className = 'info-contact-value';
      value.textContent = c.value;

      row.appendChild(icon);
      row.appendChild(label);
      row.appendChild(value);
      body.appendChild(row);
    });
  }

  /* Párrafos */
  if (data.paragraphs) {
    data.paragraphs.forEach(function(p) {
      var el = document.createElement('p');
      el.className = 'info-paragraph';
      el.textContent = p;
      body.appendChild(el);
    });
  }

  /* Extra (nota al pie) */
  if (data.extra) {
    var note = document.createElement('p');
    note.className = 'info-extra';
    note.textContent = data.extra;
    body.appendChild(note);
  }
}

/* ─── Abrir / cerrar info modal ─── */
function openInfoModal(key) {
  renderInfoContent(key);
  var modal = document.getElementById('info-modal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function closeInfoModal() {
  var modal = document.getElementById('info-modal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

/* ─── Navegar al catálogo con filtro ─── */
function goToCatalogWith(catValue, teamValue) {
  /* Mostrar sección catálogo */
  var hero    = document.querySelector('.hero');
  var catalog = document.getElementById('catalog');
  var cartBtn = document.getElementById('cart-toggle');

  if (hero)    hero.style.display    = 'none';
  if (catalog) catalog.style.display = 'block';
  if (cartBtn) cartBtn.style.display = 'flex';

  /* Aplicar filtro de categoría */
  if (catValue !== undefined) {
    document.querySelectorAll('[data-filter-cat]').forEach(function(b) { b.classList.remove('active'); });
    var catBtn = document.querySelector('[data-filter-cat="' + catValue + '"]');
    if (catBtn) catBtn.classList.add('active');
    if (typeof activeCategory !== 'undefined') activeCategory = catValue;
  }

  /* Aplicar filtro de equipo */
  if (teamValue !== undefined) {
    document.querySelectorAll('[data-filter-team]').forEach(function(b) { b.classList.remove('active'); });
    var teamBtn = document.querySelector('[data-filter-team="' + teamValue + '"]');
    if (teamBtn) teamBtn.classList.add('active');
    if (typeof activeTeam !== 'undefined') activeTeam = teamValue;
  }

  /* Volver a renderizar */
  if (typeof applyFilters === 'function') applyFilters();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Inicializar listeners del footer ─── */
document.addEventListener('DOMContentLoaded', function() {

  /* Logo footer → volver al inicio */
  var footerLogo = document.getElementById('footer-logo-link');
  if (footerLogo) {
    footerLogo.addEventListener('click', function() {
      var hero    = document.querySelector('.hero');
      var catalog = document.getElementById('catalog');
      var cartBtn = document.getElementById('cart-toggle');
      if (catalog) catalog.style.display = 'none';
      if (hero)    hero.style.display    = 'flex';
      if (cartBtn) cartBtn.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Links de categoría (Tienda) */
  document.querySelectorAll('.footer-link[data-cat]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      goToCatalogWith(link.getAttribute('data-cat'), 'all');
    });
  });

  /* Links de equipo (Equipos) */
  document.querySelectorAll('.footer-link[data-team]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      goToCatalogWith('all', link.getAttribute('data-team'));
    });
  });

  /* Links de info (Ayuda) + bottom links */
  document.querySelectorAll('[data-info]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openInfoModal(link.getAttribute('data-info'));
    });
  });

  /* Cerrar info modal */
  var closeBtn = document.getElementById('close-info-modal');
  var infoModal = document.getElementById('info-modal');
  if (closeBtn)  closeBtn.addEventListener('click', closeInfoModal);
  if (infoModal) {
    infoModal.addEventListener('click', function(e) {
      if (e.target === infoModal) closeInfoModal();
    });
  }

  /* ESC cierra también el info modal */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeInfoModal();
  });
});
