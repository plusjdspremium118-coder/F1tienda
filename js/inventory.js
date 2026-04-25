/* inventory.js — Catalogo Paddock Store F1. 50 productos: 5 categorias x 10 equipos.
   Precios en CLP.

   IMAGENES en assets/:
     Incluidas (por categoria):
       f1_gorra.png · f1_polera.png · f1_vaso.png · f1_chaqueta.png · f1_auto.png
     Para agregar imagen especifica de equipo, sigue el patron:
       assets/redbull-gorra.png  |  assets/ferrari-polera.png  |  etc.
     Actualiza el campo "image" del producto correspondiente en este archivo.
*/

var IMG = {
  gorra:    'assets/f1_gorra.png',
  polera:   'assets/f1_polera.png',
  vaso:     'assets/f1_vaso.png',
  chaqueta: 'assets/f1_chaqueta.png',
  auto:     'assets/f1_auto.png'
};

var inventory = [
  /* RED BULL */
  { id:1,  name:'Gorra Team Red Bull 2025',       team:'Red Bull',      teamFull:'Oracle Red Bull Racing',       category:'Gorra',       price:34990, stock:10, color:'#1B3A6B', emoji:'\uD83E\uDDE2', image:'assets/redbull_gorra.png'    },
  { id:2,  name:'Polera Replica Red Bull',         team:'Red Bull',      teamFull:'Oracle Red Bull Racing',       category:'Polera',      price:49990, stock:7,  color:'#1B3A6B', emoji:'\uD83D\uDC55', image:'assets/redbull_polera.png'   },
  { id:3,  name:'Termo Red Bull Racing',           team:'Red Bull',      teamFull:'Oracle Red Bull Racing',       category:'Vaso',        price:18990, stock:12, color:'#1B3A6B', emoji:'\uD83E\uDD64', image:'assets/redbull_vaso.png'     },
  { id:4,  name:'Chaqueta Softshell Red Bull',     team:'Red Bull',      teamFull:'Oracle Red Bull Racing',       category:'Chaqueta',    price:89990, stock:4,  color:'#1B3A6B', emoji:'\uD83E\uDDE5', image:'assets/redbull_chaqueta.png' },
  { id:5,  name:'RB20 Escala 1:43 Verstappen',    team:'Red Bull',      teamFull:'Oracle Red Bull Racing',       category:'Auto Escala', price:64990, stock:5,  color:'#1B3A6B', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/redbull_auto.png' },
  /* FERRARI */
  { id:6,  name:'Gorra Scuderia Ferrari 2025',     team:'Ferrari',       teamFull:'Scuderia Ferrari HP',          category:'Gorra',       price:37990, stock:8,  color:'#E8002D', emoji:'\uD83E\uDDE2', image:'assets/ferrari_gorra.png'    },
  { id:7,  name:'Polera Polo Ferrari Primaloft',   team:'Ferrari',       teamFull:'Scuderia Ferrari HP',          category:'Polera',      price:54990, stock:5,  color:'#E8002D', emoji:'\uD83D\uDC55', image:'assets/ferrari_polera.png'   },
  { id:8,  name:'Mug Ceramica Ferrari',            team:'Ferrari',       teamFull:'Scuderia Ferrari HP',          category:'Vaso',        price:15990, stock:15, color:'#E8002D', emoji:'\uD83E\uDD64', image:'assets/ferrari_vaso.png'     },
  { id:9,  name:'Chaqueta Bomber Ferrari',         team:'Ferrari',       teamFull:'Scuderia Ferrari HP',          category:'Chaqueta',    price:99990, stock:3,  color:'#E8002D', emoji:'\uD83E\uDDE5', image:'assets/ferrari_chaqueta.png' },
  { id:10, name:'SF-24 Escala 1:43 Leclerc',      team:'Ferrari',       teamFull:'Scuderia Ferrari HP',          category:'Auto Escala', price:69990, stock:6,  color:'#E8002D', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/ferrari_auto.png' },
  /* MERCEDES */
  { id:11, name:'Gorra Driver Mercedes 2025',      team:'Mercedes',      teamFull:'Mercedes-AMG Petronas F1',     category:'Gorra',       price:35990, stock:9,  color:'#00A19C', emoji:'\uD83E\uDDE2', image:'assets/mercedes_gorra.png'    },
  { id:12, name:'Polera AMG Petronas 2025',        team:'Mercedes',      teamFull:'Mercedes-AMG Petronas F1',     category:'Polera',      price:47990, stock:6,  color:'#00A19C', emoji:'\uD83D\uDC55', image:'assets/mercedes_polera.png'   },
  { id:13, name:'Botella Termica Mercedes',        team:'Mercedes',      teamFull:'Mercedes-AMG Petronas F1',     category:'Vaso',        price:19990, stock:11, color:'#00A19C', emoji:'\uD83E\uDD64', image:'assets/mercedes_vaso.png'     },
  { id:14, name:'Chaqueta Windbreaker Mercedes',   team:'Mercedes',      teamFull:'Mercedes-AMG Petronas F1',     category:'Chaqueta',    price:84990, stock:5,  color:'#00A19C', emoji:'\uD83E\uDDE5', image:'assets/mercedes_chaqueta.png' },
  { id:15, name:'W15 Escala 1:43 Hamilton',        team:'Mercedes',      teamFull:'Mercedes-AMG Petronas F1',     category:'Auto Escala', price:62990, stock:4,  color:'#00A19C', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/mercedes_auto.png' },
  /* McLAREN */
  { id:16, name:'Gorra Papaya McLaren 2025',       team:'McLaren',       teamFull:'McLaren F1 Team',              category:'Gorra',       price:36990, stock:10, color:'#FF8000', emoji:'\uD83E\uDDE2', image:'assets/mclaren_gorra.png'    },
  { id:17, name:'Polera Team McLaren Papaya',      team:'McLaren',       teamFull:'McLaren F1 Team',              category:'Polera',      price:51990, stock:7,  color:'#FF8000', emoji:'\uD83D\uDC55', image:'assets/mclaren_polera.png'   },
  { id:18, name:'Vaso Viaje McLaren Papaya',       team:'McLaren',       teamFull:'McLaren F1 Team',              category:'Vaso',        price:17990, stock:14, color:'#FF8000', emoji:'\uD83E\uDD64', image:'assets/mclaren_vaso.png'     },
  { id:19, name:'Chaqueta Puffer McLaren',         team:'McLaren',       teamFull:'McLaren F1 Team',              category:'Chaqueta',    price:94990, stock:3,  color:'#FF8000', emoji:'\uD83E\uDDE5', image:'assets/mclaren_chaqueta.png' },
  { id:20, name:'MCL38 Escala 1:43 Norris',        team:'McLaren',       teamFull:'McLaren F1 Team',              category:'Auto Escala', price:67990, stock:5,  color:'#FF8000', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/mclaren_auto.png' },
  /* ASTON MARTIN */
  { id:21, name:'Gorra Aston Martin Aramco',       team:'Aston Martin',  teamFull:'Aston Martin Aramco F1',       category:'Gorra',       price:34990, stock:7,  color:'#00594F', emoji:'\uD83E\uDDE2', image:'assets/aston_gorra.png'    },
  { id:22, name:'Polera Aston Martin 2025',        team:'Aston Martin',  teamFull:'Aston Martin Aramco F1',       category:'Polera',      price:48990, stock:5,  color:'#00594F', emoji:'\uD83D\uDC55', image:'assets/aston_polera.png'   },
  { id:23, name:'Termo Racing Aston Martin',       team:'Aston Martin',  teamFull:'Aston Martin Aramco F1',       category:'Vaso',        price:18490, stock:9,  color:'#00594F', emoji:'\uD83E\uDD64', image:'assets/aston_vaso.png'     },
  { id:24, name:'Chaqueta Softshell Aston Martin', team:'Aston Martin',  teamFull:'Aston Martin Aramco F1',       category:'Chaqueta',    price:87990, stock:2,  color:'#00594F', emoji:'\uD83E\uDDE5', image:'assets/aston_chaqueta.png' },
  { id:25, name:'AMR24 Escala 1:43 Alonso',        team:'Aston Martin',  teamFull:'Aston Martin Aramco F1',       category:'Auto Escala', price:65990, stock:4,  color:'#00594F', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/aston_auto.png' },
  /* ALPINE */
  { id:26, name:'Gorra BWT Alpine 2025',           team:'Alpine',        teamFull:'BWT Alpine F1 Team',           category:'Gorra',       price:32990, stock:9,  color:'#0078C1', emoji:'\uD83E\uDDE2', image:'assets/alpine_gorra.png'    },
  { id:27, name:'Polera Alpine F1 Blue',           team:'Alpine',        teamFull:'BWT Alpine F1 Team',           category:'Polera',      price:45990, stock:6,  color:'#0078C1', emoji:'\uD83D\uDC55', image:'assets/alpine_polera.png'   },
  { id:28, name:'Mug BWT Alpine Racing',           team:'Alpine',        teamFull:'BWT Alpine F1 Team',           category:'Vaso',        price:14990, stock:13, color:'#0078C1', emoji:'\uD83E\uDD64', image:'assets/alpine_vaso.png'     },
  { id:29, name:'Chaqueta Alpine Esteban',         team:'Alpine',        teamFull:'BWT Alpine F1 Team',           category:'Chaqueta',    price:81990, stock:4,  color:'#0078C1', emoji:'\uD83E\uDDE5', image:'assets/alpine_chaqueta.png' },
  { id:30, name:'A524 Escala 1:43 Gasly',          team:'Alpine',        teamFull:'BWT Alpine F1 Team',           category:'Auto Escala', price:58990, stock:5,  color:'#0078C1', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/alpine_auto.png' },
  /* WILLIAMS */
  { id:31, name:'Gorra Williams Racing 2025',      team:'Williams',      teamFull:'Williams Racing',              category:'Gorra',       price:33990, stock:6,  color:'#00A0E1', emoji:'\uD83E\uDDE2', image:'assets/williams_gorra.png'    },
  { id:32, name:'Polera Oficial Williams',         team:'Williams',      teamFull:'Williams Racing',              category:'Polera',      price:46990, stock:4,  color:'#00A0E1', emoji:'\uD83D\uDC55', image:'assets/williams_polera.png'   },
  { id:33, name:'Termo Williams Albon',            team:'Williams',      teamFull:'Williams Racing',              category:'Vaso',        price:16990, stock:10, color:'#00A0E1', emoji:'\uD83E\uDD64', image:'assets/williams_vaso.png'     },
  { id:34, name:'Chaqueta Equipo Williams',        team:'Williams',      teamFull:'Williams Racing',              category:'Chaqueta',    price:83990, stock:2,  color:'#00A0E1', emoji:'\uD83E\uDDE5', image:'assets/williams_chaqueta.png' },
  { id:35, name:'FW46 Escala 1:43 Albon',          team:'Williams',      teamFull:'Williams Racing',              category:'Auto Escala', price:61990, stock:3,  color:'#00A0E1', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/williams_auto.png' },
  /* RACING BULLS */
  { id:36, name:'Gorra VCARB 2025',                team:'Racing Bulls',  teamFull:'Visa Cash App RB F1 Team',     category:'Gorra',       price:31990, stock:8,  color:'#002DDB', emoji:'\uD83E\uDDE2', image:'assets/vcarb_gorra.png'    },
  { id:37, name:'Polera VCARB Tsunoda',            team:'Racing Bulls',  teamFull:'Visa Cash App RB F1 Team',     category:'Polera',      price:44990, stock:5,  color:'#002DDB', emoji:'\uD83D\uDC55', image:'assets/vcarb_polera.png'   },
  { id:38, name:'Vaso Team Racing Bulls',          team:'Racing Bulls',  teamFull:'Visa Cash App RB F1 Team',     category:'Vaso',        price:13990, stock:12, color:'#002DDB', emoji:'\uD83E\uDD64', image:'assets/vcarb_vaso.png'     },
  { id:39, name:'Chaqueta VCARB Oficial',          team:'Racing Bulls',  teamFull:'Visa Cash App RB F1 Team',     category:'Chaqueta',    price:79990, stock:3,  color:'#002DDB', emoji:'\uD83E\uDDE5', image:'assets/vcarb_chaqueta.png' },
  { id:40, name:'VCARB 01 Escala 1:43',            team:'Racing Bulls',  teamFull:'Visa Cash App RB F1 Team',     category:'Auto Escala', price:57990, stock:4,  color:'#002DDB', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/vcarb_auto.png' },
  /* SAUBER */
  { id:41, name:'Gorra Stake F1 Sauber',           team:'Sauber',        teamFull:'Stake F1 Team Kick Sauber',    category:'Gorra',       price:30990, stock:10, color:'#00E701', emoji:'\uD83E\uDDE2', image:'assets/sauber_gorra.png'    },
  { id:42, name:'Polera Kick Sauber 2025',         team:'Sauber',        teamFull:'Stake F1 Team Kick Sauber',    category:'Polera',      price:43990, stock:6,  color:'#00E701', emoji:'\uD83D\uDC55', image:'assets/sauber_polera.png'   },
  { id:43, name:'Termo Neon Sauber',               team:'Sauber',        teamFull:'Stake F1 Team Kick Sauber',    category:'Vaso',        price:12990, stock:14, color:'#00E701', emoji:'\uD83E\uDD64', image:'assets/sauber_vaso.png'     },
  { id:44, name:'Chaqueta Verde Stake',            team:'Sauber',        teamFull:'Stake F1 Team Kick Sauber',    category:'Chaqueta',    price:78990, stock:2,  color:'#00E701', emoji:'\uD83E\uDDE5', image:'assets/sauber_chaqueta.png' },
  { id:45, name:'C44 Escala 1:43 Bottas',          team:'Sauber',        teamFull:'Stake F1 Team Kick Sauber',    category:'Auto Escala', price:52990, stock:4,  color:'#1A7A1A', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/sauber_auto.png' },
  /* HAAS */
  { id:46, name:'Gorra Haas F1 MoneyGram',         team:'Haas',          teamFull:'MoneyGram Haas F1 Team',       category:'Gorra',       price:29990, stock:7,  color:'#B6BABD', emoji:'\uD83E\uDDE2', image:'assets/haas_gorra.png'    },
  { id:47, name:'Polera Oficial Haas F1',          team:'Haas',          teamFull:'MoneyGram Haas F1 Team',       category:'Polera',      price:41990, stock:4,  color:'#B6BABD', emoji:'\uD83D\uDC55', image:'assets/haas_polera.png'   },
  { id:48, name:'Taza Termica Haas',               team:'Haas',          teamFull:'MoneyGram Haas F1 Team',       category:'Vaso',        price:11990, stock:9,  color:'#B6BABD', emoji:'\uD83E\uDD64', image:'assets/haas_vaso.png'     },
  { id:49, name:'Chaqueta Equipo Haas',            team:'Haas',          teamFull:'MoneyGram Haas F1 Team',       category:'Chaqueta',    price:75990, stock:2,  color:'#B6BABD', emoji:'\uD83E\uDDE5', image:'assets/haas_chaqueta.png' },
  { id:50, name:'VF-24 Escala 1:43 Bearman',       team:'Haas',          teamFull:'MoneyGram Haas F1 Team',       category:'Auto Escala', price:51990, stock:3,  color:'#B6BABD', emoji:'\uD83C\uDFCE\uFE0F', image:'assets/haas_auto.png' }
];

var SPECS = {
  'Gorra': { material: '100% Poliester reciclado', details: 'Gorra oficial con logo bordado en 3D y cierre ajustable.' },
  'Polera': { material: '90% Algodon, 10% Elastano', details: 'Polo tecnico transpirable con diseño ergonomico.' },
  'Vaso': { material: 'Acero inoxidable doble pared', details: 'Termo de viaje oficial. Mantiene temperatura por 12h.' },
  'Chaqueta': { material: 'Tejido Softshell', details: 'Chaqueta cortavientos resistente al agua con forro interior.' },
  'Auto Escala': { material: 'Aleacion de metal (Diecast)', details: 'Modelo a escala 1:43 altamente detallado con base de exhibicion.' }
};

inventory = inventory.map(function(item) {
  item.material = SPECS[item.category].material;
  item.details = SPECS[item.category].details;
  return item;
});

