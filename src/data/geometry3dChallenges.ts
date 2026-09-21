import { Question, QuizPreset } from '../types';

export interface Geometry3DChallengeStep {
  id: string;
  title: string;
  subtitle: string;
  oa: string;
  description: string;
  problemStatement: string;
  svgDiagram: string;
  formulaBox: {
    title: string;
    formulas: string[];
    variables: string[];
  };
  individualTask: string;
  groupDiscussionPrompt: string;
  question: Question;
}

export const GEOMETRY_3D_CHALLENGES: Geometry3DChallengeStep[] = [
  {
    id: 'geo3d-d1',
    title: 'Desafío 1: Edificio Taller Don Bosco',
    subtitle: 'Prismas Rectos: Base Cuadrada, Rectangular y Cubo',
    oa: 'OA 11',
    description: 'Modelamiento arquitectónico de un edificio industrial compuesto por un galpón principal y un módulo de oficinas cúbico.',
    problemStatement: 'La escuela industrial Don Bosco proyecta un taller mecánico con forma de prisma rectangular de largo $L = 12\\text{ m}$, ancho $A = 8\\text{ m}$ y altura $H = 5\\text{ m}$. Adosado a él, se encuentra el laboratorio de control de calidad con forma de cubo de arista $a = 4\\text{ m}$. ¿Cuál es el volumen total de aire ($V_T$) que debe ventilar el sistema de climatización?',
    svgDiagram: `<svg viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.65"/>
        </linearGradient>
        <linearGradient id="cubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#047857" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <!-- Galpón Principal (Prisma Rectangular) -->
      <!-- Cara frontal -->
      <polygon points="40,170 180,170 180,90 40,90" fill="url(#prismGrad)" stroke="#2563eb" stroke-width="2.5"/>
      <!-- Cara superior -->
      <polygon points="40,90 180,90 240,40 100,40" fill="#60a5fa" fill-opacity="0.4" stroke="#2563eb" stroke-width="2"/>
      <!-- Cara lateral derecha -->
      <polygon points="180,170 240,120 240,40 180,90" fill="#1e40af" fill-opacity="0.5" stroke="#2563eb" stroke-width="2"/>
      
      <!-- Cubo Adosado -->
      <polygon points="180,170 250,170 250,110 180,110" fill="url(#cubeGrad)" stroke="#059669" stroke-width="2.5"/>
      <polygon points="180,110 250,110 280,80 210,80" fill="#34d399" fill-opacity="0.4" stroke="#059669" stroke-width="2"/>
      <polygon points="250,170 280,140 280,80 250,110" fill="#065f46" fill-opacity="0.5" stroke="#059669" stroke-width="2"/>

      <!-- Cotas y Textos -->
      <text x="110" y="190" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Largo L = 12 m</text>
      <text x="25" y="135" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">H = 5 m</text>
      <text x="225" y="70" fill="#1e293b" font-family="sans-serif" font-size="11" font-weight="bold">Ancho A = 8 m</text>
      <text x="260" y="190" fill="#047857" font-family="sans-serif" font-size="11" font-weight="bold">Cubo a = 4 m</text>
      <text x="110" y="130" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Galpón Taller</text>
      <text x="215" y="145" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="bold">Oficina</text>
    </svg>`,
    formulaBox: {
      title: 'Formulario: Prismas Rectos y Cubo',
      formulas: [
        '$$V_{\\text{prisma}} = A_{\\text{base}} \\cdot h = (L \\cdot A) \\cdot H$$',
        '$$V_{\\text{cubo}} = a^3 = a \\cdot a \\cdot a$$',
        '$$V_{\\text{total}} = V_{\\text{prisma}} + V_{\\text{cubo}}$$'
      ],
      variables: [
        '$L = 12\\text{ m}$ (Largo del galpón)',
        '$A = 8\\text{ m}$ (Ancho del galpón)',
        '$H = 5\\text{ m}$ (Altura del galpón)',
        '$a = 4\\text{ m}$ (Arista del cubo de oficina)'
      ]
    },
    individualTask: 'En tu cuaderno: dibuja el boceto en perspectiva isométrica, anota los datos y calcula el volumen de cada cuerpo por separado.',
    groupDiscussionPrompt: 'Consenso: ¿Cuántos metros cúbicos de aire ocupan ambos recintos juntos?',
    question: {
      id: 'geo3d-q1',
      text: '¿Cuál es el volumen total ($V_{\\text{total}}$) de aire que alberga la infraestructura de Don Bosco?',
      options: [
        '$V_{\\text{total}} = 544\\text{ m}^3$',
        '$V_{\\text{total}} = 480\\text{ m}^3$',
        '$V_{\\text{total}} = 512\\text{ m}^3$',
        '$V_{\\text{total}} = 608\\text{ m}^3$'
      ],
      correctAnswer: 0,
      explanation: '$V_{\\text{prisma}} = 12 \\cdot 8 \\cdot 5 = 480\\text{ m}^3$. Para el cubo: $V_{\\text{cubo}} = 4^3 = 64\\text{ m}^3$. Por lo tanto, $V_{\\text{total}} = 480 + 64 = 544\\text{ m}^3$.',
      hint: 'Multiplica $12 \\cdot 8 \\cdot 5$ y súmale $4 \\cdot 4 \\cdot 4$.',
      topic: 'Prismas Rectos y Cubo'
    }
  },
  {
    id: 'geo3d-d2',
    title: 'Desafío 2: Tanques de Almacenamiento',
    subtitle: 'Cilindros con Aproximación Curricular $\\pi \\approx 3$',
    oa: 'OA 11',
    description: 'Cálculo de capacidad volumétrica y área total de lámina de acero para un depósito cilíndrico de agua de riego.',
    problemStatement: 'Un depósito cilíndrico de almacenamiento de agua tiene un radio basal de $r = 3\\text{ m}$ y una altura de $h = 7\\text{ m}$. Considerando la aproximación curricular oficial MINEDUC $\\pi \\approx 3$: (1) Calcula el volumen en $\\text{m}^3$ y su capacidad en Litros ($1\\text{ m}^3 = 1.000\\text{ L}$); (2) Calcula el área total de chapa metálica requerida para su construcción.',
    svgDiagram: `<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="cylGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0284c7" stop-opacity="0.5"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      <!-- Base inferior elipse -->
      <ellipse cx="210" cy="160" rx="90" ry="25" fill="#0284c7" fill-opacity="0.4" stroke="#0284c7" stroke-width="2.5"/>
      <!-- Cuerpo lateral -->
      <rect x="120" y="60" width="180" height="100" fill="url(#cylGrad)" stroke="none"/>
      <line x1="120" y1="60" x2="120" y2="160" stroke="#0284c7" stroke-width="2.5"/>
      <line x1="300" y1="60" x2="300" y2="160" stroke="#0284c7" stroke-width="2.5"/>
      <!-- Base superior elipse -->
      <ellipse cx="210" cy="60" rx="90" ry="25" fill="#bae6fd" fill-opacity="0.6" stroke="#0284c7" stroke-width="2.5"/>
      <!-- Radio y Altura -->
      <line x1="210" y1="60" x2="300" y2="60" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4"/>
      <circle cx="210" cy="60" r="3" fill="#ef4444"/>
      <text x="255" y="52" fill="#b91c1c" font-family="sans-serif" font-size="12" font-weight="bold">r = 3 m</text>
      
      <line x1="100" y1="60" x2="100" y2="160" stroke="#1e293b" stroke-width="2"/>
      <text x="90" y="115" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">h = 7 m</text>
      
      <text x="210" y="115" fill="#0369a1" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">V = π · r² · h</text>
      <text x="210" y="135" fill="#0369a1" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">(usando π ≈ 3)</text>
    </svg>`,
    formulaBox: {
      title: 'Formulario: Cilindro Recto (con $\\pi \\approx 3$)',
      formulas: [
        '$$V = A_{\\text{base}} \\cdot h = (\\pi \\cdot r^2) \\cdot h$$',
        '$$A_{\\text{lateral}} = 2 \\cdot \\pi \\cdot r \\cdot h$$',
        '$$A_{\\text{total}} = 2 \\cdot (\\pi \\cdot r^2) + 2 \\cdot \\pi \\cdot r \\cdot h$$'
      ],
      variables: [
        '$r = 3\\text{ m}$ (Radio de la base)',
        '$h = 7\\text{ m}$ (Altura del cilindro)',
        '$\\pi \\approx 3$ (Aproximación pedagógica estándar)'
      ]
    },
    individualTask: 'En tu cuaderno: calcula el área basal $A_b = 3 \\cdot (3)^2$, el volumen $V = A_b \\cdot 7$ y el área total $A_T$.',
    groupDiscussionPrompt: 'Consenso de equipo: ¿Cuánto volumen en $\\text{m}^3$ y cuántos Litros almacena el tanque?',
    question: {
      id: 'geo3d-q2',
      text: 'Con $\\pi \\approx 3$, ¿cuál es el volumen del cilindro y cuántos Litros de agua almacena a capacidad completa?',
      options: [
        '$V = 189\\text{ m}^3$ (189.000 Litros)',
        '$V = 126\\text{ m}^3$ (126.000 Litros)',
        '$V = 243\\text{ m}^3$ (243.000 Litros)',
        '$V = 63\\text{ m}^3$ (63.000 Litros)'
      ],
      correctAnswer: 0,
      explanation: '$A_{\\text{base}} = \\pi \\cdot r^2 \\approx 3 \\cdot (3^2) = 3 \\cdot 9 = 27\\text{ m}^2$. Luego $V = 27 \\cdot 7 = 189\\text{ m}^3$. En litros: $189 \\cdot 1.000 = 189.000\\text{ L}$.',
      hint: '$A_{\\text{base}} = 3 \\cdot 9 = 27\\text{ m}^2$, luego multiplica por $7$.',
      topic: 'Cilindro y Capacidad'
    }
  },
  {
    id: 'geo3d-d3',
    title: 'Desafío 3: Rampas de Conexión',
    subtitle: 'Prismas Triangulares y Teorema de Pitágoras',
    oa: 'OA 12',
    description: 'Aplicación del Teorema de Pitágoras ($a^2 + b^2 = c^2$) para determinar la longitud de la rampa inclinada y el volumen del prisma triangular.',
    problemStatement: 'Para conectar dos niveles del taller, se construye una rampa de acceso de hormigón con forma de prisma recto triangular. La base del triángulo mide $b = 12\\text{ m}$ en el suelo y sube una altura vertical de $a = 5\\text{ m}$. El ancho transitable de la rampa es de $w = 4\\text{ m}$. ¿Cuánto mide la longitud de la rampa inclinada ($c$) y cuál es el volumen de hormigón ($V$) necesario?',
    svgDiagram: `<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="rampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#d97706" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <!-- Triángulo frontal -->
      <polygon points="50,170 260,170 50,70" fill="url(#rampGrad)" stroke="#d97706" stroke-width="2.5"/>
      <!-- Símbolo ángulo recto -->
      <rect x="50" y="150" width="20" height="20" fill="none" stroke="#b45309" stroke-width="2"/>
      <!-- Superficie inclinada rampa -->
      <polygon points="50,70 260,170 340,120 130,20" fill="#fbbf24" fill-opacity="0.5" stroke="#d97706" stroke-width="2"/>
      <!-- Cara trasera superior -->
      <polygon points="50,70 130,20 130,120 50,170" fill="#b45309" fill-opacity="0.25" stroke="#d97706" stroke-width="2" stroke-dasharray="4"/>

      <!-- Textos y Cotas -->
      <text x="155" y="190" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Base en suelo b = 12 m</text>
      <text x="35" y="120" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">Altura a = 5 m</text>
      <text x="180" y="105" fill="#b45309" font-family="sans-serif" font-size="13" font-weight="bold" transform="rotate(25, 180, 105)">Rampa c = ? (Pitágoras)</text>
      <text x="245" y="55" fill="#1e293b" font-family="sans-serif" font-size="12" font-weight="bold">Ancho w = 4 m</text>
    </svg>`,
    formulaBox: {
      title: 'Formulario: Teorema de Pitágoras & Prisma Triangular',
      formulas: [
        '$$c = \\sqrt{a^2 + b^2} = \\sqrt{5^2 + 12^2}$$',
        '$$A_{\\text{base}} = \\frac{b \\cdot a}{2} = \\frac{12 \\cdot 5}{2}$$',
        '$$V = A_{\\text{base}} \\cdot w = \\left(\\frac{b \\cdot a}{2}\\right) \\cdot w$$'
      ],
      variables: [
        '$a = 5\\text{ m}$ (Cateto vertical)',
        '$b = 12\\text{ m}$ (Cateto horizontal)',
        '$c = \\text{Hipotenusa de la rampa}$',
        '$w = 4\\text{ m}$ (Ancho o altura del prisma)'
      ]
    },
    individualTask: 'En tu cuaderno: aplica $c^2 = 5^2 + 12^2 = 25 + 144 = 169 \\implies c = 13\\text{ m}$. Luego calcula el área basal y el volumen de hormigón.',
    groupDiscussionPrompt: 'Consenso: Verifiquen en equipo el valor de la hipotenusa $c$ y el volumen total $V$.',
    question: {
      id: 'geo3d-q3',
      text: '¿Cuál es la longitud de la rampa inclinada ($c$) y el volumen total de hormigón ($V$)?',
      options: [
        '$c = 13\\text{ m}$ y $V = 120\\text{ m}^3$',
        '$c = 17\\text{ m}$ y $V = 240\\text{ m}^3$',
        '$c = 13\\text{ m}$ y $V = 240\\text{ m}^3$',
        '$c = 15\\text{ m}$ y $V = 60\\text{ m}^3$'
      ],
      correctAnswer: 0,
      explanation: 'Por Pitágoras: $c = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13\\text{ m}$. Área del triángulo base $= \\frac{12 \\cdot 5}{2} = 30\\text{ m}^2$. Volumen $= A_{\\text{base}} \\cdot w = 30 \\cdot 4 = 120\\text{ m}^3$.',
      hint: '$5^2 + 12^2 = 25 + 144 = 169 \\implies \\sqrt{169} = 13$. Luego $V = 30 \\cdot 4$.',
      topic: 'Teorema de Pitágoras en 3D'
    }
  },
  {
    id: 'geo3d-d4',
    title: 'Desafío 4: Eco-Diseño y Empaques Sostenibles',
    subtitle: 'Optimización de Área Superficial vs Volumen',
    oa: 'OA 11',
    description: 'Análisis de eficiencia ecológica de empaques para minimizar el gasto de cartón manteniendo la misma capacidad de $1.000\\text{ cm}^3$.',
    problemStatement: 'Una empresa desea envasar $1.000\\text{ cm}^3$ de producto ecológico y evalúa dos diseños: Envase A (Prisma rectangular alargado de base $5 \\times 5\\text{ cm}$ y altura $40\\text{ cm}$) vs Envase B (Prisma cúbico compacto de $10 \\times 10 \\times 10\\text{ cm}$). Ambos tienen $V = 1.000\\text{ cm}^3$. ¿Cuál es el área de material superficial ($A_T$) de cada envase y cuánto cartón ahorra el diseño B por unidad?',
    svgDiagram: `<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-lg">
      <!-- Envase A: Alargado -->
      <g transform="translate(30, 20)">
        <polygon points="20,160 50,160 50,20 20,20" fill="#f87171" fill-opacity="0.4" stroke="#dc2626" stroke-width="2"/>
        <polygon points="20,20 50,20 70,0 40,0" fill="#fca5a5" stroke="#dc2626" stroke-width="1.5"/>
        <polygon points="50,160 70,140 70,0 50,20" fill="#b91c1c" fill-opacity="0.3" stroke="#dc2626" stroke-width="1.5"/>
        <text x="45" y="180" fill="#991b1b" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Envase A (5x5x40)</text>
        <text x="45" y="90" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">1.000 cm³</text>
      </g>
      <!-- VS -->
      <text x="180" y="110" fill="#475569" font-family="sans-serif" font-size="18" font-weight="black" text-anchor="middle">VS</text>
      <!-- Envase B: Cúbico -->
      <g transform="translate(230, 40)">
        <polygon points="20,130 90,130 90,60 20,60" fill="#34d399" fill-opacity="0.5" stroke="#059669" stroke-width="2"/>
        <polygon points="20,60 90,60 120,30 50,30" fill="#6ee7b7" stroke="#059669" stroke-width="1.5"/>
        <polygon points="90,130 120,100 120,30 90,60" fill="#047857" fill-opacity="0.4" stroke="#059669" stroke-width="1.5"/>
        <text x="65" y="155" fill="#065f46" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Envase B (10x10x10)</text>
        <text x="65" y="100" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">1.000 cm³</text>
      </g>
    </svg>`,
    formulaBox: {
      title: 'Formulario: Área Total de Prismas',
      formulas: [
        '$$A_{\\text{total A}} = 2(5 \\cdot 5) + 4(5 \\cdot 40) = 50 + 800 = 850\\text{ cm}^2$$',
        '$$A_{\\text{total B}} = 6 \\cdot (10 \\cdot 10) = 600\\text{ cm}^2$$',
        '$$\\Delta A = 850\\text{ cm}^2 - 600\\text{ cm}^2 = 250\\text{ cm}^2$$'
      ],
      variables: [
        'Envase A: $5 \\times 5\\text{ cm}$ base, $h = 40\\text{ cm}$',
        'Envase B: Cubo de arista $a = 10\\text{ cm}$'
      ]
    },
    individualTask: 'En tu cuaderno: calcula el área total de las 6 caras de ambos envases y determina la diferencia de cartón.',
    groupDiscussionPrompt: 'Consenso: ¿Por qué los envases más cercanos al cubo o cilindro compacto ahorran material en la industria?',
    question: {
      id: 'geo3d-q4',
      text: '¿Cuánto cartón ahorra por unidad el Envase B (Cubo) en comparación con el Envase A?',
      options: [
        'Ahorra $250\\text{ cm}^2$ de material ($850\\text{ cm}^2$ vs $600\\text{ cm}^2$)',
        'Ahorra $150\\text{ cm}^2$ de material ($750\\text{ cm}^2$ vs $600\\text{ cm}^2$)',
        'Ahorra $400\\text{ cm}^2$ de material ($1.000\\text{ cm}^2$ vs $600\\text{ cm}^2$)',
        'Ambos envases usan exactamente la misma cantidad de material'
      ],
      correctAnswer: 0,
      explanation: 'Para A: $A_T = 2(25) + 4(200) = 50 + 800 = 850\\text{ cm}^2$. Para B: $A_T = 6 \\cdot 100 = 600\\text{ cm}^2$. El ahorro ecológico es $850 - 600 = 250\\text{ cm}^2$ de cartón por envase.',
      hint: 'Calcula $2(25) + 4(200) = 850$ y réstale $6 \\cdot 100 = 600$.',
      topic: 'Optimización de Área y Eco-Diseño'
    }
  },
  {
    id: 'geo3d-d5',
    title: 'Desafío 5: Efecto de Duplicación y Homotecia 3D',
    subtitle: 'Variación de Área ($k^2$) y Volumen ($k^3$)',
    oa: 'OA 11',
    description: 'Demostración de la propiedad de escala dimensional: qué sucede con la superficie y la capacidad cuando las dimensiones lineales se duplican ($k = 2$).',
    problemStatement: 'Un contenedor original tiene dimensiones de largo $L = 3\\text{ m}$, ancho $A = 2\\text{ m}$ y altura $H = 4\\text{ m}$ ($V_1 = 24\\text{ m}^3$, $A_{T1} = 52\\text{ m}^2$). Si se decide construir un modelo a doble escala donde cada una de las 3 dimensiones se duplica ($k = 2$, es decir $L=6$, $A=4$, $H=8$), ¿por qué factores se multiplican el Área Total y el Volumen?',
    svgDiagram: `<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="scaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <!-- Original Pequeño (k=1) -->
      <g transform="translate(30, 80)">
        <polygon points="10,80 50,80 50,40 10,40" fill="#a78bfa" stroke="#7c3aed" stroke-width="1.5"/>
        <polygon points="10,40 50,40 70,20 30,20" fill="#c4b5fd" stroke="#7c3aed" stroke-width="1.5"/>
        <polygon points="50,80 70,60 70,20 50,40" fill="#6d28d9" fill-opacity="0.4" stroke="#7c3aed" stroke-width="1.5"/>
        <text x="35" y="100" fill="#5b21b6" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Original: V₁ = 24 m³</text>
      </g>
      <!-- Flecha de Escala x2 -->
      <g transform="translate(135, 100)">
        <text x="25" y="-10" fill="#7c3aed" font-family="sans-serif" font-size="12" font-weight="black" text-anchor="middle">k = 2</text>
        <line x1="0" y1="10" x2="45" y2="10" stroke="#7c3aed" stroke-width="3" marker-end="url(#arrow)"/>
      </g>
      <!-- Duplicado Grande (k=2) -->
      <g transform="translate(210, 30)">
        <polygon points="20,150 100,150 100,70 20,70" fill="url(#scaleGrad)" stroke="#6d28d9" stroke-width="2.5"/>
        <polygon points="20,70 100,70 140,30 60,30" fill="#c4b5fd" fill-opacity="0.6" stroke="#6d28d9" stroke-width="2"/>
        <polygon points="100,150 140,110 140,30 100,70" fill="#4c1d95" fill-opacity="0.5" stroke="#6d28d9" stroke-width="2"/>
        <text x="75" y="175" fill="#4c1d95" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Duplicado: V₂ = 192 m³ (x8)</text>
        <text x="75" y="115" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Área x4</text>
      </g>
    </svg>`,
    formulaBox: {
      title: 'Teorema de Escala Dimensional 3D (Factor $k = 2$)',
      formulas: [
        '$$A_2 = k^2 \\cdot A_1 = 2^2 \\cdot A_1 = 4 \\cdot A_1 = 4 \\cdot 52 = 208\\text{ m}^2$$',
        '$$V_2 = k^3 \\cdot V_1 = 2^3 \\cdot V_1 = 8 \\cdot V_1 = 8 \\cdot 24 = 192\\text{ m}^3$$'
      ],
      variables: [
        '$k = 2$ (Razón de homotecia lineal)',
        '$k^2 = 4$ (Factor de variación superficial / área)',
        '$k^3 = 8$ (Factor de variación volumétrica / capacidad)'
      ]
    },
    individualTask: 'En tu cuaderno: calcula $V_2 = 6 \\cdot 4 \\cdot 8 = 192\\text{ m}^3$ y demuestra que $192 / 24 = 8$.',
    groupDiscussionPrompt: 'Consenso Grupal: Escriban la conclusión cooperativa sobre por qué el volumen crece mucho más rápido que el área.',
    question: {
      id: 'geo3d-q5',
      text: 'Al duplicar ($k = 2$) todas las aristas lineales del contenedor, ¿cuáles son los nuevos valores de Área Total y Volumen?',
      options: [
        'Área se multiplica por $4$ ($208\\text{ m}^2$) y Volumen se multiplica por $8$ ($192\\text{ m}^3$)',
        'Área se multiplica por $2$ ($104\\text{ m}^2$) y Volumen se multiplica por $4$ ($96\\text{ m}^3$)',
        'Área se multiplica por $2$ ($104\\text{ m}^2$) y Volumen se multiplica por $2$ ($48\\text{ m}^3$)',
        'Área se multiplica por $4$ ($208\\text{ m}^2$) y Volumen se multiplica por $4$ ($96\\text{ m}^3$)'
      ],
      correctAnswer: 0,
      explanation: 'Las áreas varían con $k^2 = 2^2 = 4 \\implies A_2 = 4 \\cdot 52 = 208\\text{ m}^2$. Los volúmenes varían con $k^3 = 2^3 = 8 \\implies V_2 = 8 \\cdot 24 = 192\\text{ m}^3$.',
      hint: 'Área es bidimensional ($2^2 = 4$), Volumen es tridimensional ($2^3 = 8$).',
      topic: 'Homotecia y Escala 3D'
    }
  }
];

export const GEOMETRY_3D_QUIZ_PRESET: QuizPreset = {
  id: 'desafio-geo3d-8basico-oa11-12',
  title: 'Desafío Cooperativo: Geometría 3D y Cuaderno de Evidencias (8° Básico - OA 11 y OA 12)',
  grade: '8° Básico',
  topic: 'Geometría 3D y Teorema de Pitágoras',
  description: '5 Desafíos de modelamiento 3D (Prismas, Cilindros con π ≈ 3, Rampas con Pitágoras, Eco-diseño y Homotecia) con captura de evidencias fotográficas del cuaderno.',
  questions: GEOMETRY_3D_CHALLENGES.map((d) => d.question),
};
