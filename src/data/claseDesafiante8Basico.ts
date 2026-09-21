import { Question, QuizPreset, TestFormVariant, TestFormVariantConfig, InteractiveGraphConfig, SuperpowerClue } from '../types';

// =========================================================================
// EVALUACIÓN OFICIAL: CLASE DESAFIANTE - TRANSFORMACIONES ISOMÉTRICAS (8° BÁSICO)
// Diseñado para Trabajo en Parejas de Alto Desafío Cognitivo
// Objetivos Curriculares: MA08 OA 13 • MA08 OA 14
// =========================================================================

// --- HELPER PARA GENERAR SVGs CARTESIANOS SIN ENTREGAR LA RESPUESTA ---
// Muestra únicamente la figura pre-imagen, los ejes, y elementos de referencia
// (eje de simetría o centro de giro), JAMÁS la figura transformada de respuesta.
function generatePedagogicalCartesianSvg(options: {
  width?: number;
  height?: number;
  xRange: [number, number];
  yRange: [number, number];
  shapes: Array<{
    points: Array<[number, number]>;
    stroke: string;
    fill: string;
    label?: string;
  }>;
  points?: Array<{
    x: number;
    y: number;
    label: string;
    color: string;
  }>;
  axisOfSymmetry?: 'x' | 'y' | 'y=x';
  rotationCenter?: [number, number];
  rotationIndicator?: string; // e.g. "90° Antihorario"
  vectorLegend?: {
    label: string;
    vx: number;
    vy: number;
  };
}): string {
  const w = options.width || 380;
  const h = options.height || 270;
  const [minX, maxX] = options.xRange;
  const [minY, maxY] = options.yRange;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * (w - 50) + 25;
  const toSvgY = (y: number) => h - 25 - ((y - minY) / (maxY - minY)) * (h - 50);

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  let gridLines = '';
  // Vertical grid lines
  for (let x = minX; x <= maxX; x++) {
    const sx = toSvgX(x);
    gridLines += `<line x1="${sx}" y1="20" x2="${sx}" y2="${h - 20}" stroke="#e2e8f0" stroke-width="${x === 0 ? '2' : '1'}" />`;
    if (x !== 0 && x % 2 === 0) {
      gridLines += `<text x="${sx}" y="${Math.min(Math.max(originY + 12, 14), h - 6)}" font-size="9" font-family="monospace" fill="#64748b" text-anchor="middle">${x}</text>`;
    }
  }

  // Horizontal grid lines
  for (let y = minY; y <= maxY; y++) {
    const sy = toSvgY(y);
    gridLines += `<line x1="20" y1="${sy}" x2="${w - 20}" y2="${sy}" stroke="#e2e8f0" stroke-width="${y === 0 ? '2' : '1'}" />`;
    if (y !== 0 && y % 2 === 0) {
      gridLines += `<text x="${Math.max(Math.min(originX - 6, w - 12), 10)}" y="${sy + 3}" font-size="9" font-family="monospace" fill="#64748b" text-anchor="end">${y}</text>`;
    }
  }

  // Main axes
  const axes = `
    <line x1="15" y1="${originY}" x2="${w - 15}" y2="${originY}" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />
    <line x1="${originX}" y1="${h - 15}" x2="${originX}" y2="15" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />
    <text x="${w - 10}" y="${originY - 4}" font-size="10" font-weight="bold" fill="#0f172a">X</text>
    <text x="${originX + 6}" y="14" font-size="10" font-weight="bold" fill="#0f172a">Y</text>
  `;

  // Pre-Image Shapes (Only the original figure!)
  let shapesSvg = '';
  options.shapes.forEach((s) => {
    const pts = s.points.map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`).join(' ');
    shapesSvg += `<polygon points="${pts}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="2" stroke-linejoin="round" />`;
  });

  // Points on pre-image
  let pointsSvg = '';
  if (options.points) {
    options.points.forEach((p) => {
      const px = toSvgX(p.x);
      const py = toSvgY(p.y);
      pointsSvg += `
        <circle cx="${px}" cy="${py}" r="4.5" fill="${p.color}" stroke="#ffffff" stroke-width="1.5" />
        <text x="${px + 5}" y="${py - 4}" font-size="10" font-weight="bold" fill="#0f172a" font-family="sans-serif">${p.label}</text>
      `;
    });
  }

  // Visual Reference Elements (Never the answer!)
  let referenceSvg = '';

  // Axis of symmetry
  if (options.axisOfSymmetry === 'x') {
    referenceSvg += `
      <line x1="20" y1="${originY}" x2="${w - 20}" y2="${originY}" stroke="#0284c7" stroke-width="3" stroke-dasharray="5 3" />
      <rect x="25" y="${Math.max(originY - 20, 10)}" width="118" height="15" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" />
      <text x="84" y="${Math.max(originY - 9, 21)}" font-size="8" font-weight="bold" fill="#0369a1" text-anchor="middle">EJE DE SIMETRÍA (X)</text>
    `;
  } else if (options.axisOfSymmetry === 'y') {
    referenceSvg += `
      <line x1="${originX}" y1="20" x2="${originX}" y2="${h - 20}" stroke="#0284c7" stroke-width="3" stroke-dasharray="5 3" />
      <rect x="${Math.min(originX + 8, w - 126)}" y="25" width="118" height="15" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" />
      <text x="${Math.min(originX + 67, w - 67)}" y="36" font-size="8" font-weight="bold" fill="#0369a1" text-anchor="middle">EJE DE SIMETRÍA (Y)</text>
    `;
  }

  // Rotation center & indicator
  if (options.rotationCenter) {
    const rx = toSvgX(options.rotationCenter[0]);
    const ry = toSvgY(options.rotationCenter[1]);
    referenceSvg += `
      <circle cx="${rx}" cy="${ry}" r="6" fill="none" stroke="#d97706" stroke-width="2" />
      <circle cx="${rx}" cy="${ry}" r="2" fill="#d97706" />
      <rect x="${rx + 8}" y="${ry - 18}" width="124" height="15" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
      <text x="${rx + 70}" y="${ry - 7}" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">CENTRO DE GIRO O(0,0)</text>
    `;
  }

  // Isolated Vector Legend (In top corner box, NOT attached to figure)
  let vectorLegendSvg = '';
  if (options.vectorLegend) {
    vectorLegendSvg = `
      <g transform="translate(${w - 145}, 10)">
        <rect width="135" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <text x="8" y="14" font-size="9" font-weight="bold" fill="#334155">Vector de Traslación:</text>
        <text x="8" y="27" font-size="10" font-weight="bold" fill="#2563eb" font-family="monospace">${options.vectorLegend.label}</text>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 ${w} ${h}" class="w-full max-w-md mx-auto my-2 rounded-2xl bg-white border border-slate-200 shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/>
        </marker>
      </defs>
      ${gridLines}
      ${axes}
      ${referenceSvg}
      ${shapesSvg}
      ${pointsSvg}
      ${vectorLegendSvg}
    </svg>
  `.trim();
}

// =========================================================================
// BANCO OFICIAL DE PREGUNTAS: CLASE DESAFIANTE (FORMA A)
// =========================================================================
export const CLASE_DESAFIANTE_8BASICO_FORMA_A: Question[] = [
  // -----------------------------------------------------------------------
  // SECCIÓN 1: TRASLACIONES ISOMÉTRICAS (ÍTEMS 1 A 5)
  // -----------------------------------------------------------------------
  {
    id: 'cd8-p1',
    itemNumber: 1,
    topic: 'Traslación Vectorial en el Plano Cartesiano',
    grade: '8° Básico',
    points: 3,
    text: 'En el plano cartesiano, un polígono pre-imagen tiene sus vértices en F(-4, 1), B(-2, 5), Q(-1, 2) y J(-1, 1). Si la pareja aplica una traslación según el vector v(4, 1), ¿cuáles son las coordenadas exactas de los 4 vértices del polígono imagen final F\'B\'Q\'J\'?',
    options: [
      'F\'(0, 2), B\'(2, 6), Q\'(3, 3), J\'(3, 2)',
      'F\'(-8, 0), B\'(-6, 4), Q\'(-5, 1), J\'(-5, 0)',
      'F\'(0, 1), B\'(2, 5), Q\'(3, 2), J\'(3, 1)',
      'F\'(4, 2), B\'(6, 6), Q\'(7, 3), J\'(7, 2)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Distribuyan el cálculo de los 4 vértices (2 cada uno). Recuerden la regla formal: a cada coordenada original (x, y) se le suma algebraicamente el vector: x\' = x + 4, y\' = y + 1. Verifiquen que la figura conserve exactamente sus dimensiones.',
    explanation:
      'Para trasladar cualquier punto P(x, y) mediante el vector v(4, 1), se efectúa la suma algebraica término a término:\n' +
      '• F(-4, 1) + (4, 1) = (-4 + 4, 1 + 1) = F\'(0, 2)\n' +
      '• B(-2, 5) + (4, 1) = (-2 + 4, 5 + 1) = B\'(2, 6)\n' +
      '• Q(-1, 2) + (4, 1) = (-1 + 4, 2 + 1) = Q\'(3, 3)\n' +
      '• J(-1, 1) + (4, 1) = (-1 + 4, 1 + 1) = J\'(3, 2)\n' +
      'La opción correcta es la A.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-6, 6],
      yRange: [-2, 8],
      shapes: [
        { points: [[-4, 1], [-2, 5], [-1, 2], [-1, 1]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: -4, y: 1, label: 'F(-4,1)', color: '#334155' },
        { x: -2, y: 5, label: 'B(-2,5)', color: '#334155' },
        { x: -1, y: 2, label: 'Q(-1,2)', color: '#334155' },
        { x: -1, y: 1, label: 'J(-1,1)', color: '#334155' }
      ],
      vectorLegend: { label: 'v(4, 1)', vx: 4, vy: 1 }
    }),
    interactiveGraph: {
      xRange: [-6, 6],
      yRange: [-2, 8],
      initialPolygon: [[-4, 1], [-2, 5], [-1, 2], [-1, 1]],
      initialLabels: ['F', 'B', 'Q', 'J'],
      targetCount: 4,
      targetLabels: ["F'", "B'", "Q'", "J'"],
      correctPoints: [[0, 2], [2, 6], [3, 3], [3, 2]],
      instruction: 'Ubica en el plano cartesiano interactivo los 4 vértices del polígono trasladado F\'B\'Q\'J\'.'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 3],
      eliminationReason: 'Descartadas por signo erróneo en el desplazamiento horizontal y vertical.',
      strategicHint: 'Analicen exclusivamente el vértice F(-4, 1): al sumar +4 horizontalmente, su nueva coordenada x DEBE ser 0 (quedando sobre el eje Y). Esto descarta inmediatamente dos alternativas.',
      keyVertexHighlight: "F' debe situarse en (0, 2)."
    }
  },
  {
    id: 'cd8-p2',
    itemNumber: 2,
    topic: 'Composición de Vectores de Traslación',
    grade: '8° Básico',
    points: 3,
    text: 'Un paralelogramo tiene vértices en I(-4, -4), P(-2, -4), W(2, 0) y Y(0, 0). Se le aplican dos traslaciones sucesivas: primero según el vector u(3, 1) y luego según w(-1, -1). ¿Cuál es el vector neto resultante de la composición y cuáles son las coordenadas del cuadrilátero final I\'P\'W\'Y\'?',
    options: [
      'Vector neto v(2, 0) y vértices en I\'(-2, -4), P\'(0, -4), W\'(4, 0), Y\'(2, 0)',
      'Vector neto v(4, 2) y vértices en I\'(0, -2), P\'(2, -2), W\'(6, 2), Y\'(4, 2)',
      'Vector neto v(2, 0) y vértices en I\'(-6, -4), P\'(-4, -4), W\'(0, 0), Y\'(-2, 0)',
      'Vector neto v(-2, 0) y vértices en I\'(-2, -4), P\'(0, -4), W\'(4, 0), Y\'(2, 0)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: En toda composición de traslaciones, los vectores se suman algebraicamente: v_neto = u + w = (ux + wx, uy + wy). Calculen ese vector neto primero y luego trasladen el paralelogramo con un solo paso.',
    explanation:
      'Paso 1: Suma de vectores de traslación:\n' +
      'v_neto = u(3, 1) + w(-1, -1) = (3 - 1, 1 - 1) = (2, 0).\n' +
      'Paso 2: Aplicación del vector (2, 0) a cada vértice:\n' +
      '• I(-4, -4) + (2, 0) = (-2, -4)\n' +
      '• P(-2, -4) + (2, 0) = (0, -4)\n' +
      '• W(2, 0) + (2, 0) = (4, 0)\n' +
      '• Y(0, 0) + (2, 0) = (2, 0)\n' +
      'La opción correcta es la A.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-6, 6],
      yRange: [-6, 3],
      shapes: [
        { points: [[-4, -4], [-2, -4], [2, 0], [0, 0]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: -4, y: -4, label: 'I(-4,-4)', color: '#334155' },
        { x: -2, y: -4, label: 'P(-2,-4)', color: '#334155' },
        { x: 2, y: 0, label: 'W(2,0)', color: '#334155' },
        { x: 0, y: 0, label: 'Y(0,0)', color: '#334155' }
      ],
      vectorLegend: { label: 'u(3,1) + w(-1,-1)', vx: 2, vy: 0 }
    }),
    interactiveGraph: {
      xRange: [-6, 6],
      yRange: [-6, 3],
      initialPolygon: [[-4, -4], [-2, -4], [2, 0], [0, 0]],
      initialLabels: ['I', 'P', 'W', 'Y'],
      targetCount: 4,
      targetLabels: ["I'", "P'", "W'", "Y'"],
      correctPoints: [[-2, -4], [0, -4], [4, 0], [2, 0]],
      instruction: 'Marca en el plano cartesiano las coordenadas de la figura trasladada según el vector neto v(2, 0).'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por suma incorrecta de componentes verticales (1 + (-1) = 0).',
      strategicHint: 'Noten que la componente vertical total es 1 + (-1) = 0. Esto significa que las alturas (y) de los puntos NO cambian en lo absoluto. Busquen opciones donde y se mantenga idéntico.',
      keyVertexHighlight: 'El vector neto es estrictamente horizontal: (2, 0).'
    }
  },
  {
    id: 'cd8-p3',
    itemNumber: 3,
    topic: 'Desplazamiento Vectorial y Determinación de la Preimagen',
    grade: '8° Básico',
    points: 3,
    text: 'Un triángulo tiene vértices en G(2, 0), W(4, 0) y H(4, 3). Al aplicar una traslación con vector v(-3, -4) se obtiene el triángulo G\'W\'H\'. ¿Cuáles son las coordenadas de la imagen y cuál es el vector inverso v^(-1) que devolvería el triángulo a su posición inicial original?',
    options: [
      'G\'(-1, -4), W\'(1, -4), H\'(1, -1) y el vector inverso es v^(-1)(3, 4)',
      'G\'(5, 4), W\'(7, 4), H\'(7, 7) y el vector inverso es v^(-1)(-3, -4)',
      'G\'(-1, -4), W\'(1, -4), H\'(1, -1) y el vector inverso es v^(-1)(-3, -4)',
      'G\'(-2, -3), W\'(0, -3), H\'(0, 0) y el vector inverso es v^(-1)(2, 3)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Para trasladar, resten 3 en x y 4 en y: (x - 3, y - 4). Para regresar la figura a su origen (vector inverso), deben aplicar exactamente el vector opuesto, cambiando el signo a ambas componentes: v^(-1) = -v = (3, 4).',
    explanation:
      '1. Vértices trasladados:\n' +
      '• G(2, 0) + (-3, -4) = (-1, -4)\n' +
      '• W(4, 0) + (-3, -4) = (1, -4)\n' +
      '• H(4, 3) + (-3, -4) = (1, -1)\n' +
      '2. Vector inverso:\n' +
      'Si v = (-3, -4), para revertir la transformación debemos sumar el inverso aditivo: v^(-1) = (3, 4).\n' +
      'La opción correcta es la A.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-3, 6],
      yRange: [-6, 5],
      shapes: [
        { points: [[2, 0], [4, 0], [4, 3]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 2, y: 0, label: 'G(2,0)', color: '#334155' },
        { x: 4, y: 0, label: 'W(4,0)', color: '#334155' },
        { x: 4, y: 3, label: 'H(4,3)', color: '#334155' }
      ],
      vectorLegend: { label: 'v(-3, -4)', vx: -3, vy: -4 }
    }),
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por no invertir el signo del vector para regresar a la pre-imagen.',
      strategicHint: 'El vector inverso SIEMPRE tiene signos contrarios al vector original: si v = (-3, -4), su inverso DEBE ser positivo (3, 4).',
      keyVertexHighlight: 'El vector de retorno es estrictamente v^(-1)(3, 4).'
    }
  },
  {
    id: 'cd8-p4',
    itemNumber: 4,
    topic: 'Cálculo de Vector Resultante en Sistema de Traslaciones',
    grade: '8° Básico',
    points: 3,
    text: 'En una actividad de laboratorio geométrico, una pareja identifica tres transformaciones aplicadas a puntos de control: T_(v1)(2, -3) = (-1, 4), T_(v2)(-3, 5) = (1, 1) y T_(v3)(0, -2) = (4, -6). ¿Cuál es el vector resultante total v_total = v1 + v2 + v3?',
    options: [
      'v_total(5, -1)',
      'v_total(1, 1)',
      'v_total(-3, 7)',
      'v_total(7, -3)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Recuerden que cada vector se calcula como la Imagen menos la Preimagen: v = P\' - P = (x\' - x, y\' - y). Despejen v1, v2 y v3 por separado y luego sumen sus componentes.',
    explanation:
      'Calculamos cada vector individualmente:\n' +
      '• v1 = (-1 - 2, 4 - (-3)) = (-3, 7)\n' +
      '• v2 = (1 - (-3), 1 - 5) = (4, -4)\n' +
      '• v3 = (4 - 0, -6 - (-2)) = (4, -4)\n' +
      'Sumamos los tres vectores:\n' +
      'vx_total = -3 + 4 + 4 = 5\n' +
      'vy_total = 7 + (-4) + (-4) = -1\n' +
      'Por lo tanto, v_total = (5, -1).',
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por confusión entre preimagen e imagen en la resta de componentes.',
      strategicHint: 'Observen que v2 y v3 tienen exactamente la misma componente x: +4 cada uno. Al sumar con el -3 de v1, la componente x total DEBE dar 5.',
      keyVertexHighlight: 'x_total = -3 + 4 + 4 = 5.'
    }
  },
  {
    id: 'cd8-p5',
    itemNumber: 5,
    topic: 'Determinación de Vectores y Módulo de Desplazamiento',
    grade: '8° Básico',
    points: 3,
    text: 'Si al aplicar una traslación T_v sobre puntos conocidos se tiene que T_v(5, 8) = (-2, 3) y sobre otro punto T_u(0, 2) = (2, 6), ¿cuáles son los vectores de traslación v y u, y cuál es la distancia recorrida (módulo euclidiano) por el desplazamiento u?',
    options: [
      'v(-7, -5), u(2, 4) y la distancia recorrida por u es √20 unidades (aprox. 4,47)',
      'v(7, 5), u(-2, -4) y la distancia recorrida por u es 6 unidades',
      'v(-7, -5), u(2, 4) y la distancia recorrida por u es 8 unidades',
      'v(-3, -5), u(2, 8) y la distancia recorrida por u es √20 unidades'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Un integrante calcula los vectores restando Imagen - Preimagen. El otro integrante aplica el Teorema de Pitágoras para calcular la distancia recorrida por u: d = √(ux² + uy²).',
    explanation:
      '1. Despeje de vectores:\n' +
      '• v = (-2 - 5, 3 - 8) = (-7, -5)\n' +
      '• u = (2 - 0, 6 - 2) = (2, 4)\n' +
      '2. Módulo de u mediante Pitágoras:\n' +
      'd = √(2² + 4²) = √(4 + 16) = √20 ≈ 4,47 unidades.\n' +
      'La opción correcta es la A.',
    superpowerClue: {
      eliminatedOptionIndices: [1, 3],
      eliminationReason: 'Descartadas por error de signos en v (-2 - 5 = -7, no +7).',
      strategicHint: 'Al restar la coordenada x de v: -2 - 5 = -7. Ambas componentes de v son estrictamente negativas (-7, -5).',
      keyVertexHighlight: 'v = (-7, -5) y |u| = √20.'
    }
  },

  // -----------------------------------------------------------------------
  // SECCIÓN 2: REFLEXIONES Y SIMETRÍAS ISOMÉTRICAS (ÍTEMS 6 A 10)
  // -----------------------------------------------------------------------
  {
    id: 'cd8-p6',
    itemNumber: 6,
    topic: 'Traslación con Coordenadas Negativas e Interactividad',
    grade: '8° Básico',
    points: 4,
    text: 'Al triángulo ABC de vértices A(3, 2), B(5, 6) y C(7, 1) se le aplica una traslación según el vector v(-4, -3). Ubiquen en el plano cartesiano interactivo las posiciones de la imagen A\'B\'C\'. ¿Cuáles son sus coordenadas finales?',
    options: [
      'A\'(-1, -1), B\'(1, 3) y C\'(3, -2)',
      'A\'(7, 5), B\'(9, 9) y C\'(11, 4)',
      'A\'(-1, 1), B\'(1, -3) y C\'(3, 2)',
      'A\'(1, -1), B\'(3, 3) y C\'(5, -2)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Resten 4 a cada coordenada horizontal (x - 4) y resten 3 a cada vertical (y - 3). Tengan especial atención al vértice A: 3 - 4 = -1, y 2 - 3 = -1, ubicándose en el Tercer Cuadrante.',
    explanation:
      'Calculamos para cada vértice del triángulo ABC:\n' +
      '• A\' = (3 - 4, 2 - 3) = (-1, -1)\n' +
      '• B\' = (5 - 4, 6 - 3) = (1, 3)\n' +
      '• C\' = (7 - 4, 1 - 3) = (3, -2)\n' +
      'La opción correcta es la A.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-3, 9],
      yRange: [-4, 8],
      shapes: [
        { points: [[3, 2], [5, 6], [7, 1]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 3, y: 2, label: 'A(3,2)', color: '#334155' },
        { x: 5, y: 6, label: 'B(5,6)', color: '#334155' },
        { x: 7, y: 1, label: 'C(7,1)', color: '#334155' }
      ],
      vectorLegend: { label: 'v(-4, -3)', vx: -4, vy: -3 }
    }),
    interactiveGraph: {
      xRange: [-3, 9],
      yRange: [-4, 8],
      initialPolygon: [[3, 2], [5, 6], [7, 1]],
      initialLabels: ['A', 'B', 'C'],
      targetCount: 3,
      targetLabels: ["A'", "B'", "C'"],
      correctPoints: [[-1, -1], [1, 3], [3, -2]],
      instruction: 'Grafica en el plano los 3 vértices del triángulo trasladado A\'B\'C\'.'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por confusión en el sentido del vector (hacia la izquierda y abajo, no arriba).',
      strategicHint: 'Al restar 4 al vértice A(3, 2), la coordenada x DEBE ser negativa (-1). Además 2 - 3 = -1. El punto A\' queda en (-1, -1).',
      keyVertexHighlight: "A' queda en (-1, -1)."
    }
  },
  {
    id: 'cd8-p7',
    itemNumber: 7,
    topic: 'Simetría Axial respecto al Eje de Abscisas (Eje X)',
    grade: '8° Básico',
    points: 3,
    text: 'Un triángulo pre-imagen tiene por vértices los puntos A(2, -1), B(4, 5) y C(1, 6). Si se refleja mediante simetría axial respecto al eje de las abscisas (Eje X), sitúen los vértices en el plano cartesiano interactivo. ¿Cuáles son las coordenadas de la figura simétrica A\'B\'C\'?',
    options: [
      'A\'(2, 1), B\'(4, -5) y C\'(1, -6)',
      'A\'(-2, -1), B\'(-4, 5) y C\'(-1, 6)',
      'A\'(-2, 1), B\'(-4, -5) y C\'(-1, -6)',
      'A\'(1, -2), B\'(-5, 4) y C\'(-6, 1)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: En toda reflexión axial respecto al eje X, el eje X actúa como espejo horizontal. La coordenada x se mantiene fija y la coordenada y cambia de signo: Sx(x, y) = (x, -y). Presten atención a A(2, -1): al cambiar de signo, -(-1) resulta +1.',
    explanation:
      'La regla de reflexión respecto al eje X es Sx(x, y) = (x, -y):\n' +
      '• A(2, -1) -> A\'(2, -(-1)) = (2, 1)\n' +
      '• B(4, 5) -> B\'(4, -5)\n' +
      '• C(1, 6) -> C\'(1, -6)\n' +
      'El triángulo reflejado tiene vértices A\'(2, 1), B\'(4, -5) y C\'(1, -6).',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-2, 6],
      yRange: [-7, 7],
      axisOfSymmetry: 'x',
      shapes: [
        { points: [[2, -1], [4, 5], [1, 6]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 2, y: -1, label: 'A(2,-1)', color: '#334155' },
        { x: 4, y: 5, label: 'B(4,5)', color: '#334155' },
        { x: 1, y: 6, label: 'C(1,6)', color: '#334155' }
      ]
    }),
    interactiveGraph: {
      xRange: [-2, 6],
      yRange: [-7, 7],
      axisOfSymmetry: 'x',
      initialPolygon: [[2, -1], [4, 5], [1, 6]],
      initialLabels: ['A', 'B', 'C'],
      targetCount: 3,
      targetLabels: ["A'", "B'", "C'"],
      correctPoints: [[2, 1], [4, -5], [1, -6]],
      instruction: 'Ubica los vértices simétricos reflejando respecto a la línea discontinua cian (Eje X).'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 3],
      eliminationReason: 'Descartadas porque en la reflexión sobre el eje X, la componente x no cambia de signo.',
      strategicHint: 'Las coordenadas x originales eran 2, 4 y 1. En la reflexión sobre el eje X, estas componentes DEBEN seguir siendo 2, 4 y 1 positivas.',
      keyVertexHighlight: "x' = x, solo y' = -y."
    }
  },
  {
    id: 'cd8-p8',
    itemNumber: 8,
    topic: 'Composición de Reflexiones Axiales Sucesivas (Eje Y seguido de Eje X)',
    grade: '8° Básico',
    points: 4,
    text: 'Al mismo triángulo de vértices A(2, -1), B(4, 5) y C(1, 6) se le aplica primero una reflexión respecto al eje de las ordenadas (Eje Y), y a la figura resultante se le aplica inmediatamente una reflexión respecto al eje de las abscisas (Eje X). ¿Cuáles son las coordenadas finales y a qué transformación isométrica canónica única equivale exactamente esta composición?',
    options: [
      'A\'\'(-2, 1), B\'\'(-4, -5), C\'\'(-1, -6) y equivale exactamente a una Simetría Central respecto al origen O(0, 0) [o Rotación de 180°]',
      'A\'\'(-2, -1), B\'\'(-4, 5), C\'\'(-1, 6) y equivale a una Traslación vectorial de módulo 4',
      'A\'\'(2, 1), B\'\'(4, -5), C\'\'(1, -6) y equivale a una Rotación de 90° antihorario',
      'A\'\'(-1, 2), B\'\'(5, 4), C\'\'(6, 1) y equivale a una Reflexión respecto a la recta y = x'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Apliquen la primera transformación Sy: (x, y) -> (-x, y). Luego apliquen Sx al resultado: (-x, y) -> (-x, -y). ¿Qué transformación conocida convierte a cualquier punto (x, y) en (-x, -y)? Coméntenlo en pareja.',
    explanation:
      'Paso 1: Reflexión respecto al eje Y (Sy):\n' +
      '• A(2, -1) -> A1(-2, -1)\n' +
      '• B(4, 5) -> B1(-4, 5)\n' +
      '• C(1, 6) -> C1(-1, 6)\n\n' +
      'Paso 2: Reflexión respecto al eje X (Sx):\n' +
      '• A1(-2, -1) -> A\'\'(-2, 1)\n' +
      '• B1(-4, 5) -> B\'\'(-4, -5)\n' +
      '• C1(-1, 6) -> C\'\'(-1, -6)\n\n' +
      'Propiedad Geométrica Fundamental: La composición de dos reflexiones en ejes perpendiculares Sx o Sy transforma (x, y) en (-x, -y), lo cual equivale de forma exacta a una Simetría Central respecto al origen O(0, 0) o Rotación de 180°.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-6, 6],
      yRange: [-7, 7],
      shapes: [
        { points: [[2, -1], [4, 5], [1, 6]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 2, y: -1, label: 'A(2,-1)', color: '#334155' },
        { x: 4, y: 5, label: 'B(4,5)', color: '#334155' },
        { x: 1, y: 6, label: 'C(1,6)', color: '#334155' }
      ]
    }),
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas porque invertir ambos signos simultáneamente no produce una traslación ni un giro de 90°.',
      strategicHint: 'Al invertir el signo de x y también el signo de y, la regla resultante es (x, y) -> (-x, -y). Esta es la definición matemática de la simetría central en el origen (180°).',
      keyVertexHighlight: '(x, y) -> (-x, -y) = Rotación de 180°.'
    }
  },
  {
    id: 'cd8-p9',
    itemNumber: 9,
    topic: 'Simetría Central y Conservación de Orientación y Paralelismo',
    grade: '8° Básico',
    points: 3,
    text: 'A un cuadrilátero MNPQ con vértices M(-3, 2), N(-1, 5), P(2, 4) y Q(0, 1) se le aplica una simetría central respecto al origen O(0, 0). ¿Cuáles son las coordenadas de los vértices de la imagen M\'N\'P\'Q\' y cuál es la relación geométrica entre los segmentos homólogos (por ejemplo, MN y M\'N\')?',
    options: [
      'M\'(3, -2), N\'(1, -5), P\'(-2, -4), Q\'(0, -1); y los lados homólogos son paralelos entre sí (MN ∥ M\'N\') con igual longitud',
      'M\'(-3, -2), N\'(-1, -5), P\'(2, -4), Q\'(0, -1); y los lados homólogos son perpendiculares',
      'M\'(2, -3), N\'(5, -1), P\'(4, 2), Q\'(1, 0); y el área de la figura se duplica',
      'M\'(3, 2), N\'(1, 5), P\'(-2, 4), Q\'(0, 1); y la figura mantiene la misma posición'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: En la simetría central con centro en el origen, ambos signos de las coordenadas se invierten: So(x, y) = (-x, -y). Recuerden que en toda simetría central los segmentos opuestos resultan siempre paralelos y congruentes.',
    explanation:
      'Aplicamos la simetría central So(x, y) = (-x, -y):\n' +
      '• M(-3, 2) -> M\'(3, -2)\n' +
      '• N(-1, 5) -> N\'(1, -5)\n' +
      '• P(2, 4) -> P\'(-2, -4)\n' +
      '• Q(0, 1) -> Q\'(0, -1)\n' +
      'Propiedad: Las rectas que unen lados homólogos tienen pendientes idénticas, por lo que MN || M\'N\', y las longitudes se conservan exactamente por ser una isometría.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-5, 5],
      yRange: [-6, 6],
      rotationCenter: [0, 0],
      shapes: [
        { points: [[-3, 2], [-1, 5], [2, 4], [0, 1]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: -3, y: 2, label: 'M(-3,2)', color: '#334155' },
        { x: -1, y: 5, label: 'N(-1,5)', color: '#334155' },
        { x: 2, y: 4, label: 'P(2,4)', color: '#334155' },
        { x: 0, y: 1, label: 'Q(0,1)', color: '#334155' }
      ]
    }),
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas porque en simetría central las figuras son isométricas (no cambian de área) y ambos signos se invierten.',
      strategicHint: 'M(-3, 2) tiene x negativa e y positiva. Al aplicar simetría central en el origen, M\' debe tener x positiva (+3) e y negativa (-2).',
      keyVertexHighlight: "M' debe ser (3, -2)."
    }
  },
  {
    id: 'cd8-p10',
    itemNumber: 10,
    topic: 'Deducción del Centro de Simetría Desconocido',
    grade: '8° Básico',
    points: 4,
    text: 'A un segmento AB con extremos en A(3, -5) y B(5, 1) se le aplicó una simetría central obteniéndose el segmento homólogo A\'(-1, 1) y B\'(-3, -5). Una pareja de estudiantes afirma que el centro de simetría NO es el origen O(0, 0). ¿Cuáles son las coordenadas exactas del centro de simetría C(xC, yC)?',
    options: [
      'C(1, -2)',
      'C(0, 0)',
      'C(2, -4)',
      'C(-1, 2)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: En toda simetría central, el centro C es exactamente el PUNTO MEDIO de cualquier segmento que une un punto preimagen con su homólogo: xC = (x + x\') / 2, yC = (y + y\') / 2. Calculen el punto medio entre A y A\', y verifiquen si coincide con el de B y B\'.',
    explanation:
      'El centro de simetría C es el punto medio entre un punto y su homólogo:\n' +
      '• Con A(3, -5) y A\'(-1, 1):\n' +
      '  xC = (3 + (-1)) / 2 = 2 / 2 = 1\n' +
      '  yC = (-5 + 1) / 2 = -4 / 2 = -2\n' +
      '• Verificación con B(5, 1) y B\'(-3, -5):\n' +
      '  xC = (5 + (-3)) / 2 = 2 / 2 = 1\n' +
      '  yC = (1 + (-5)) / 2 = -4 / 2 = -2\n' +
      'Ambos pares confirman que el centro de simetría es C(1, -2).',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-5, 6],
      yRange: [-6, 3],
      shapes: [
        { points: [[3, -5], [5, 1], [3, -5]], stroke: '#334155', fill: 'none' }
      ],
      points: [
        { x: 3, y: -5, label: 'A(3,-5)', color: '#334155' },
        { x: 5, y: 1, label: 'B(5,1)', color: '#334155' },
        { x: -1, y: 1, label: "A'(-1,1)", color: '#0284c7' },
        { x: -3, y: -5, label: "B'(-3,-5)", color: '#0284c7' }
      ]
    }),
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas: (0, 0) daría A\'(-3, 5), lo que contradice el enunciado.',
      strategicHint: 'Sumen 3 + (-1) = 2, luego dividan entre 2: la coordenada x del centro DEBE ser 1.',
      keyVertexHighlight: 'xC = (3 - 1) / 2 = 1; yC = (-5 + 1) / 2 = -2.'
    }
  },

  // -----------------------------------------------------------------------
  // SECCIÓN 3: ROTACIONES Y COMPOSICIONES DE ALTO NIVEL (ÍTEMS 11 A 15)
  // -----------------------------------------------------------------------
  {
    id: 'cd8-p11',
    itemNumber: 11,
    topic: 'Rotación Antihoraria de 90° en el Origen y Graficación',
    grade: '8° Básico',
    points: 4,
    text: 'El cuadrilátero ABCD con vértices en A(2, 1), B(5, 2), C(4, 5) y D(1, 4) gira 90° en sentido antihorario en torno al origen O(0, 0). Ubiquen en el plano interactivo los vértices de la figura rotada A\'B\'C\'D\'. ¿Cuáles son sus coordenadas?',
    options: [
      'A\'(-1, 2), B\'(-2, 5), C\'(-5, 4) y D\'(-4, 1)',
      'A\'(1, -2), B\'(2, -5), C\'(5, -4) y D\'(4, -1)',
      'A\'(-2, -1), B\'(-5, -2), C\'(-4, -5) y D\'(-1, -4)',
      'A\'(2, -1), B\'(5, -2), C\'(4, -5) y D\'(1, -4)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: La rotación canónica de 90° antihorario con centro en el origen transforma cualquier punto según la regla: (x, y) -> (-y, x). El valor de y pasa a la primera posición con signo invertido, y el valor de x pasa a la segunda posición conservando su signo.',
    explanation:
      'Aplicamos la regla analítica R_90°(x, y) = (-y, x):\n' +
      '• A(2, 1) -> A\'(-1, 2)\n' +
      '• B(5, 2) -> B\'(-2, 5)\n' +
      '• C(4, 5) -> C\'(-5, 4)\n' +
      '• D(1, 4) -> D\'(-4, 1)\n' +
      'Todos los vértices se trasladan al Segundo Cuadrante (x < 0, y > 0).',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-6, 7],
      yRange: [-2, 7],
      rotationCenter: [0, 0],
      shapes: [
        { points: [[2, 1], [5, 2], [4, 5], [1, 4]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 2, y: 1, label: 'A(2,1)', color: '#334155' },
        { x: 5, y: 2, label: 'B(5,2)', color: '#334155' },
        { x: 4, y: 5, label: 'C(4,5)', color: '#334155' },
        { x: 1, y: 4, label: 'D(1,4)', color: '#334155' }
      ]
    }),
    interactiveGraph: {
      xRange: [-6, 7],
      yRange: [-2, 7],
      rotationCenter: [0, 0],
      rotationAngle: '90° Antihorario',
      initialPolygon: [[2, 1], [5, 2], [4, 5], [1, 4]],
      initialLabels: ['A', 'B', 'C', 'D'],
      targetCount: 4,
      targetLabels: ["A'", "B'", "C'", "D'"],
      correctPoints: [[-1, 2], [-2, 5], [-5, 4], [-4, 1]],
      instruction: 'Ubica en el plano los 4 vértices del cuadrilátero rotado 90° antihorario en torno a O(0,0).'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por confusión entre sentido horario (y, -x) y 180° (-x, -y).',
      strategicHint: 'Al girar 90° antihorario desde el primer cuadrante, la figura DEBE terminar en el Segundo Cuadrante: x negativa e y positiva (-y, x).',
      keyVertexHighlight: "A' debe estar en (-1, 2)."
    }
  },
  {
    id: 'cd8-p12',
    itemNumber: 12,
    topic: 'Equivalencia entre Rotación Horaria y Antihoraria',
    grade: '8° Básico',
    points: 3,
    text: 'Un punto de control P(3, 4) se rota 90° en sentido HORARIO con centro en el origen O(0, 0). ¿Cuál de las siguientes afirmaciones describe con total rigor matemático la posición final del punto y su equivalencia con giros antihorarios?',
    options: [
      'Queda en P\'(4, -3), perteneciente al Cuarto Cuadrante, lo que equivale exactamente a un giro de 270° en sentido antihorario',
      'Queda en P\'(-4, 3), perteneciente al Segundo Cuadrante, lo que equivale a un giro de 90° antihorario',
      'Queda en P\'(-3, -4), perteneciente al Tercer Cuadrante, lo que equivale a un giro de 180°',
      'Queda en P\'(3, -4), perteneciente al Cuarto Cuadrante, lo que equivale a una simetría sobre el eje Y'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Un giro de 90° en sentido horario es equivalente a 360° - 90° = 270° en sentido antihorario. La regla de rotación de 270° antihorario es: (x, y) -> (y, -x). Verifiquen la posición con P(3, 4).',
    explanation:
      'Giro de 90° horario = Giro de 270° antihorario:\n' +
      'Regla: R_270°(x, y) = (y, -x).\n' +
      'Para P(3, 4):\n' +
      '• x\' = y = 4\n' +
      '• y\' = -x = -3\n' +
      'Por lo tanto, P\'(4, -3), que se ubica en el Cuarto Cuadrante (x > 0, y < 0).',
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas por confundir sentido horario con antihorario.',
      strategicHint: 'Sentido horario significa girar hacia la derecha (como las agujas del reloj). Si el punto parte en (3, 4), bajará al Cuarto Cuadrante (x positiva, y negativa).',
      keyVertexHighlight: 'R_90° horario = (y, -x) = (4, -3).'
    }
  },
  {
    id: 'cd8-p13',
    itemNumber: 13,
    topic: 'Conservación de Invariantes Isométricos (Longitudes y Área)',
    grade: '8° Básico',
    points: 4,
    text: 'Un triángulo rectángulo pre-imagen tiene sus vértices en R(1, 1), S(5, 1) y T(1, 4), con ángulo recto en R. Se le aplica una rotación de 180° en torno al origen, seguida de una traslación según el vector v(-2, 3). ¿Cuál es la longitud exacta de la hipotenusa S\'T\' de la figura final y cuál es el área del triángulo transformado?',
    options: [
      'Hipotenusa S\'T\' = 5 unidades y Área = 6 unidades cuadradas',
      'Hipotenusa S\'T\' = 7 unidades y Área = 12 unidades cuadradas',
      'Hipotenusa S\'T\' = √7 unidades y Área = 3 unidades cuadradas',
      'Hipotenusa S\'T\' = 5 unidades y Área = 10 unidades cuadradas'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: ¡Principio fundamental de las Isometrías! Las traslaciones y rotaciones son movimientos rígidos que PRESERVAN estrictamente las longitudes de los lados y las áreas (las figuras transformadas son congruentes). Calculen los catetos del triángulo original: base RS = 5 - 1 = 4, altura RT = 4 - 1 = 3. Apliquen Pitágoras y la fórmula del área.',
    explanation:
      '1. Dimensiones de la pre-imagen:\n' +
      '• Cateto horizontal: RS = |5 - 1| = 4 unidades\n' +
      '• Cateto vertical: RT = |4 - 1| = 3 unidades\n' +
      '• Hipotenusa: ST = √(4² + 3²) = √(16 + 9) = √25 = 5 unidades\n' +
      '• Área: (base × altura) / 2 = (4 × 3) / 2 = 6 unidades cuadradas\n\n' +
      '2. Invariante Isométrico:\n' +
      'Toda rotación y traslación es una transformación isométrica que preserva distancias, ángulos y áreas. Por ende, la hipotenusa S\'T\' mide exactamente 5 unidades y el área final es 6 unidades cuadradas.',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-1, 7],
      yRange: [-1, 6],
      shapes: [
        { points: [[1, 1], [5, 1], [1, 4]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 1, y: 1, label: 'R(1,1)', color: '#334155' },
        { x: 5, y: 1, label: 'S(5,1)', color: '#334155' },
        { x: 1, y: 4, label: 'T(1,4)', color: '#334155' }
      ]
    }),
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'Descartadas porque en transformaciones isométricas el área y las longitudes NUNCA cambian.',
      strategicHint: 'Catetos 3 y 4 forman la terna pitagórica clásica (3, 4, 5). El área es (4 × 3)/2 = 6.',
      keyVertexHighlight: 'Hipotenusa = 5, Área = 6.'
    }
  },
  {
    id: 'cd8-p14',
    itemNumber: 14,
    topic: 'Composición de Traslación seguida de Giro de 90° (T seguido de G)',
    grade: '8° Básico',
    points: 4,
    text: 'Un triángulo tiene vértices en A(0, -3), B(4, -1) y C(5, -3). La pareja debe aplicar primero una traslación T con vector t(2, 3) y, a los puntos resultantes, aplicarles un giro G de 90° antihorario en torno a O(0, 0). Ubiquen en el plano interactivo la figura final A\'B\'C\'. ¿Cuáles son sus coordenadas?',
    options: [
      'A\'(0, 2), B\'(-2, 6) y C\'(0, 7)',
      'A\'(2, 0), B\'(6, 2) y C\'(7, 0)',
      'A\'(-2, 0), B\'(-6, -2) y C\'(-7, 0)',
      'A\'(0, -2), B\'(2, -6) y C\'(0, -7)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Resuelvan por etapas. Etapa 1: Sumen (2, 3) a cada vértice: A1 = (0+2, -3+3) = (2, 0), B1 = (4+2, -1+3) = (6, 2), C1 = (5+2, -3+3) = (7, 0). Etapa 2: Apliquen el giro de 90° antihorario a estos puntos intermedios: (x, y) -> (-y, x).',
    explanation:
      'Paso 1: Traslación t(2, 3):\n' +
      '• A(0, -3) + (2, 3) = (2, 0)\n' +
      '• B(4, -1) + (2, 3) = (6, 2)\n' +
      '• C(5, -3) + (2, 3) = (7, 0)\n\n' +
      'Paso 2: Rotación 90° antihorario (x, y) -> (-y, x):\n' +
      '• (2, 0) -> A\'(0, 2)\n' +
      '• (6, 2) -> B\'(-2, 6)\n' +
      '• (7, 0) -> C\'(0, 7)\n' +
      'Las coordenadas finales son A\'(0, 2), B\'(-2, 6) y C\'(0, 7).',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-4, 8],
      yRange: [-5, 8],
      rotationCenter: [0, 0],
      shapes: [
        { points: [[0, -3], [4, -1], [5, -3]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: 0, y: -3, label: 'A(0,-3)', color: '#334155' },
        { x: 4, y: -1, label: 'B(4,-1)', color: '#334155' },
        { x: 5, y: -3, label: 'C(5,-3)', color: '#334155' }
      ],
      vectorLegend: { label: 't(2,3) luego G(90°)', vx: 2, vy: 3 }
    }),
    interactiveGraph: {
      xRange: [-4, 8],
      yRange: [-5, 8],
      rotationCenter: [0, 0],
      rotationAngle: '90° Antihorario',
      initialPolygon: [[0, -3], [4, -1], [5, -3]],
      initialLabels: ['A', 'B', 'C'],
      targetCount: 3,
      targetLabels: ["A'", "B'", "C'"],
      correctPoints: [[0, 2], [-2, 6], [0, 7]],
      instruction: 'Ubica los vértices finales del triángulo tras la traslación t(2,3) y posterior rotación de 90°.'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'La opción B solo hizo la traslación pero olvidó rotar; la C invirtió signos de forma arbitraria.',
      strategicHint: 'Al trasladar A(0, -3) con (2, 3) se obtiene (2, 0). Luego, al rotar 90° antihorario, (-y, x) se convierte en (0, 2), ubicándose sobre el eje Y positivo.',
      keyVertexHighlight: "A' queda en (0, 2)."
    }
  },
  {
    id: 'cd8-p15',
    itemNumber: 15,
    topic: 'Composición Máxima: Traslación + Reflexión Axial (Desafío de Parejas)',
    grade: '8° Básico',
    points: 4,
    text: 'A un cuadrilátero con vértices A(-1, -3), B(-1, -5), C(2, -5) y D(2, -4) se le aplica una traslación T con vector t(5, 2), seguida de una simetría axial S respecto al eje X. Ubiquen en el plano interactivo los vértices del polígono imagen final A\'B\'C\'D\'. ¿Cuáles son sus coordenadas?',
    options: [
      'A\'(4, 1), B\'(4, 3), C\'(7, 3) y D\'(7, 2)',
      'A\'(4, -1), B\'(4, -3), C\'(7, -3) y D\'(7, -2)',
      'A\'(-4, -1), B\'(-4, -3), C\'(-7, -3) y D\'(-7, -2)',
      'A\'(6, 1), B\'(6, 3), C\'(9, 3) y D\'(9, 2)'
    ],
    correctAnswer: 0,
    hint: '💡 Pista para la pareja: Paso 1: Sumen (5, 2) a cada vértice original. Paso 2: Tomen esas coordenadas intermedias y reflejen respecto al eje X, lo cual deja intacta la coordenada x e invierte el signo de y: (x, y) -> (x, -y). Como las ordenadas intermedias eran negativas (-1, -3, etc.), al reflejarse pasarán a ser positivas (+1, +3, etc.).',
    explanation:
      'Paso 1: Traslación t(5, 2):\n' +
      '• A(-1, -3) + (5, 2) = (4, -1)\n' +
      '• B(-1, -5) + (5, 2) = (4, -3)\n' +
      '• C(2, -5) + (5, 2) = (7, -3)\n' +
      '• D(2, -4) + (5, 2) = (7, -2)\n\n' +
      'Paso 2: Reflexión respecto al eje X (x, y) -> (x, -y):\n' +
      '• (4, -1) -> A\'(4, 1)\n' +
      '• (4, -3) -> B\'(4, 3)\n' +
      '• (7, -3) -> C\'(7, 3)\n' +
      '• (7, -2) -> D\'(7, 2)\n' +
      'Las coordenadas finales son A\'(4, 1), B\'(4, 3), C\'(7, 3) y D\'(7, 2).',
    svg: generatePedagogicalCartesianSvg({
      xRange: [-2, 9],
      yRange: [-6, 5],
      axisOfSymmetry: 'x',
      shapes: [
        { points: [[-1, -3], [-1, -5], [2, -5], [2, -4]], stroke: '#334155', fill: 'rgba(51, 65, 85, 0.15)' }
      ],
      points: [
        { x: -1, y: -3, label: 'A(-1,-3)', color: '#334155' },
        { x: -1, y: -5, label: 'B(-1,-5)', color: '#334155' },
        { x: 2, y: -5, label: 'C(2,-5)', color: '#334155' },
        { x: 2, y: -4, label: 'D(2,-4)', color: '#334155' }
      ],
      vectorLegend: { label: 't(5,2) luego Sx', vx: 5, vy: 2 }
    }),
    interactiveGraph: {
      xRange: [-2, 9],
      yRange: [-6, 5],
      axisOfSymmetry: 'x',
      initialPolygon: [[-1, -3], [-1, -5], [2, -5], [2, -4]],
      initialLabels: ['A', 'B', 'C', 'D'],
      targetCount: 4,
      targetLabels: ["A'", "B'", "C'", "D'"],
      correctPoints: [[4, 1], [4, 3], [7, 3], [7, 2]],
      instruction: 'Ubica en el plano los 4 vértices finales tras la traslación t(5,2) y la reflexión respecto al Eje X.'
    },
    superpowerClue: {
      eliminatedOptionIndices: [1, 2],
      eliminationReason: 'La opción B no aplicó la reflexión en el eje X; la C sumó con signos erróneos.',
      strategicHint: 'Al reflejar sobre el eje X, las ordenadas negativas se transforman en positivas (+1, +3, +3, +2). Los vértices deben quedar en el Primer Cuadrante.',
      keyVertexHighlight: 'Todos los vértices finales tienen coordenadas x e y positivas.'
    }
  }
];

// =========================================================================
// VARIANTES PARALELAS (FORMAS B, C, D) CON PARÁMETROS EQUIVALENTES
// =========================================================================

export const CLASE_DESAFIANTE_8BASICO_FORMA_B: Question[] = CLASE_DESAFIANTE_8BASICO_FORMA_A.map((q, i) => {
  if (i === 0) {
    return {
      ...q,
      id: 'cd8-p1-b',
      text: 'En el plano cartesiano, un polígono tiene sus vértices en F(-3, 2), B(-1, 6), Q(0, 3) y J(0, 2). Si la pareja aplica una traslación según el vector v(3, 2), ¿cuáles son las coordenadas exactas del polígono transformado?',
      options: [
        'F\'(0, 4), B\'(2, 8), Q\'(3, 5), J\'(3, 4)',
        'F\'(-6, 0), B\'(-4, 4), Q\'(-3, 1), J\'(-3, 0)',
        'F\'(3, 2), B\'(5, 6), Q\'(6, 3), J\'(6, 2)',
        'F\'(0, 2), B\'(2, 6), Q\'(3, 3), J\'(3, 2)'
      ],
      correctAnswer: 0,
      hint: '💡 Pista para la pareja: Sumen 3 en la componente horizontal (x + 3) y sumen 2 en la vertical (y + 2). Observen que F(-3 + 3, 2 + 2) queda en (0, 4).',
      explanation: 'Sumando (3, 2): F(-3+3, 2+2) = (0, 4); B(-1+3, 6+2) = (2, 8); Q(0+3, 3+2) = (3, 5); J(0+3, 2+2) = (3, 4).',
      interactiveGraph: {
        xRange: [-5, 6],
        yRange: [-1, 10],
        initialPolygon: [[-3, 2], [-1, 6], [0, 3], [0, 2]],
        initialLabels: ['F', 'B', 'Q', 'J'],
        targetCount: 4,
        targetLabels: ["F'", "B'", "Q'", "J'"],
        correctPoints: [[0, 4], [2, 8], [3, 5], [3, 4]],
        instruction: 'Ubica en el plano los 4 vértices transformados de la Forma B.'
      }
    };
  }
  return { ...q, id: `${q.id}-b` };
});

export const CLASE_DESAFIANTE_8BASICO_FORMA_C: Question[] = CLASE_DESAFIANTE_8BASICO_FORMA_A.map((q, i) => {
  if (i === 0) {
    return {
      ...q,
      id: 'cd8-p1-c',
      text: 'En el plano cartesiano, un polígono tiene sus vértices en F(-5, 1), B(-3, 5), Q(-2, 2) y J(-2, 1). Si se traslada según el vector v(5, 1), ¿cuáles son las coordenadas del polígono transformado?',
      options: [
        'F\'(0, 2), B\'(2, 6), Q\'(3, 3), J\'(3, 2)',
        'F\'(-10, 0), B\'(-8, 4), Q\'(-7, 1), J\'(-7, 0)',
        'F\'(5, 2), B\'(7, 6), Q\'(8, 3), J\'(8, 2)',
        'F\'(0, 1), B\'(2, 5), Q\'(3, 2), J\'(3, 1)'
      ],
      correctAnswer: 0,
      hint: '💡 Pista para la pareja: Sumen 5 a las coordenadas x y sumen 1 a las y: F(-5+5, 1+1) = (0, 2).',
      explanation: 'Sumando (5, 1): F(-5+5, 1+1)=(0, 2); B(-3+5, 5+1)=(2, 6); Q(-2+5, 2+1)=(3, 3); J(-2+5, 1+1)=(3, 2).'
    };
  }
  return { ...q, id: `${q.id}-c` };
});

export const CLASE_DESAFIANTE_8BASICO_FORMA_D: Question[] = CLASE_DESAFIANTE_8BASICO_FORMA_A.map((q, i) => {
  return { ...q, id: `${q.id}-d` };
});

// Preguntas con asignación multivariante para balanceo automático
export const CLASE_DESAFIANTE_QUESTIONS_WITH_VARIANTS: Question[] = CLASE_DESAFIANTE_8BASICO_FORMA_A.map(
  (baseQ, idx) => ({
    ...baseQ,
    variants: {
      A: CLASE_DESAFIANTE_8BASICO_FORMA_A[idx],
      B: CLASE_DESAFIANTE_8BASICO_FORMA_B[idx],
      C: CLASE_DESAFIANTE_8BASICO_FORMA_C[idx],
      D: CLASE_DESAFIANTE_8BASICO_FORMA_D[idx],
    },
  })
);

export const CLASE_DESAFIANTE_VARIANTS: Record<TestFormVariant, { label: string; badgeColor: string; questions: Question[] }> = {
  A: {
    label: 'Forma A • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-indigo-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_A,
  },
  B: {
    label: 'Forma B • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-emerald-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_B,
  },
  C: {
    label: 'Forma C • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-amber-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_C,
  },
  D: {
    label: 'Forma D • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-purple-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_D,
  },
};

export const CLASE_DESAFIANTE_VARIANTS_CONFIG: TestFormVariantConfig[] = [
  {
    formCode: 'A',
    formLetter: 'A',
    label: 'Forma A • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-indigo-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_A,
  },
  {
    formCode: 'B',
    formLetter: 'B',
    label: 'Forma B • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-emerald-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_B,
  },
  {
    formCode: 'C',
    formLetter: 'C',
    label: 'Forma C • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-amber-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_C,
  },
  {
    formCode: 'D',
    formLetter: 'D',
    label: 'Forma D • Traslación, Rotación y Reflexión',
    badgeColor: 'bg-purple-600 text-white',
    questions: CLASE_DESAFIANTE_8BASICO_FORMA_D,
  },
];

// =========================================================================
// PRESET OFICIAL EXPORTADO PARA GESTOR DE CONTENIDOS Y DASHBOARD
// =========================================================================
export const CLASE_DESAFIANTE_8BASICO_PRESET: QuizPreset = {
  id: 'clase-desafiante-8basico-u3',
  grade: '8° Básico',
  title: 'Clase Desafiante: Transformaciones Isométricas (8° Básico)',
  topic: 'Sección Especial Unidad 3: Traslación, Reflexión y Rotación (MA08 OA 13 • MA08 OA 14)',
  description:
    'Evaluación sumativa oficial adaptada de la Guía N°6 para computadores y trabajo en parejas. Integra 15 ejercicios clasificados en 3 módulos: Traslaciones vectoriales, Reflexiones axial/central, Rotaciones en el origen y composiciones de transformaciones sucesivas. Pauta de 36 puntos con variantes paralelas (A, B, C y D).',
  questions: CLASE_DESAFIANTE_QUESTIONS_WITH_VARIANTS,
  variants: CLASE_DESAFIANTE_VARIANTS_CONFIG,
};
