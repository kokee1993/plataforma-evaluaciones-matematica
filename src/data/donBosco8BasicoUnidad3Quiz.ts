import { Question, QuizPreset, TestFormVariantConfig } from '../types';

// =========================================================================
// SVGs EDUCATIVOS VECTORIALES PARA 8° BÁSICO - UNIDAD 3 DON BOSCO
// =========================================================================
export const UNIDAD3_8BASICO_SVGS = {
  // Triángulo rectángulo con catetos a, b e hipotenusa c
  trianguloRectangulo: (catA: string | number, catB: string | number, hip: string | number) => `
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="170" rx="12" fill="#0f172a"/>
      <!-- Triangle -->
      <polygon points="50,130 220,130 50,30" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <!-- Right angle marker -->
      <rect x="50" y="112" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="59" cy="121" r="2" fill="#94a3b8"/>
      <!-- Labels -->
      <text x="32" y="85" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="end">a = ${catA}</text>
      <text x="135" y="152" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">b = ${catB}</text>
      <text x="145" y="70" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="black" text-anchor="middle">c = ${hip}</text>
      <text x="140" y="25" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">c² = a² + b²</text>
    </svg>
  `,

  // Escalera apoyada en la pared
  escaleraPared: (L: string | number, d: string | number, h: string | number) => `
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="170" rx="12" fill="#0f172a"/>
      <!-- Pared vertical -->
      <line x1="60" y1="20" x2="60" y2="140" stroke="#f43f5e" stroke-width="4"/>
      <!-- Suelo horizontal -->
      <line x1="50" y1="140" x2="240" y2="140" stroke="#64748b" stroke-width="3"/>
      <!-- Escalera -->
      <line x1="60" y1="35" x2="190" y2="140" stroke="#fbbf24" stroke-width="3.5" stroke-dasharray="6,2"/>
      <!-- Labels -->
      <text x="45" y="85" fill="#fda4af" font-size="11" font-weight="bold" text-anchor="end">h = ${h}</text>
      <text x="125" y="158" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">d = ${d}</text>
      <text x="145" y="75" fill="#fde047" font-size="11" font-weight="black">Escalera L = ${L}</text>
    </svg>
  `,

  // Poste vertical y cable de sujeción
  posteVentanal: (h: string | number, d: string | number, L: string | number) => `
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="170" rx="12" fill="#0f172a"/>
      <!-- Poste -->
      <line x1="70" y1="25" x2="70" y2="135" stroke="#60a5fa" stroke-width="4"/>
      <circle cx="70" cy="25" r="4" fill="#93c5fd"/>
      <!-- Suelo -->
      <line x1="50" y1="135" x2="240" y2="135" stroke="#64748b" stroke-width="2"/>
      <!-- Cable tirante -->
      <line x1="70" y1="25" x2="210" y2="135" stroke="#34d399" stroke-width="3"/>
      <!-- Labels -->
      <text x="55" y="80" fill="#93c5fd" font-size="11" font-weight="bold" text-anchor="end">Poste: ${h}</text>
      <text x="140" y="153" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">Suelo: ${d}</text>
      <text x="160" y="70" fill="#6ee7b7" font-size="11" font-weight="black">Cable: ${L}</text>
    </svg>
  `,

  // Terreno rectangular y diagonal
  terrenoDiagonal: (largo: string | number, ancho: string | number, diag: string | number) => `
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="160" rx="12" fill="#0f172a"/>
      <!-- Terreno -->
      <rect x="50" y="30" width="180" height="100" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      <!-- Diagonal -->
      <line x1="50" y1="130" x2="230" y2="30" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="5,3"/>
      <!-- Labels -->
      <text x="140" y="148" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Largo: ${largo}</text>
      <text x="35" y="85" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Ancho: ${ancho}</text>
      <text x="145" y="70" fill="#fb7185" font-size="11" font-weight="black">Diagonal: ${diag}</text>
    </svg>
  `,

  // Distancia en plano cartesiano
  planoCartesiano: (p1: string, p2: string, dist: string) => `
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="160" rx="12" fill="#0f172a"/>
      <!-- Grid -->
      <line x1="30" y1="130" x2="250" y2="130" stroke="#475569" stroke-width="1.5"/>
      <line x1="50" y1="20" x2="50" y2="145" stroke="#475569" stroke-width="1.5"/>
      <!-- Vector / Segmento -->
      <line x1="80" y1="110" x2="210" y2="40" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="80" cy="110" r="4" fill="#38bdf8"/>
      <circle cx="210" cy="40" r="4" fill="#38bdf8"/>
      <!-- Triángulo auxiliar -->
      <line x1="80" y1="110" x2="210" y2="110" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="210" y1="110" x2="210" y2="40" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1"/>
      <!-- Labels -->
      <text x="75" y="125" fill="#cbd5e1" font-size="10" font-weight="bold">${p1}</text>
      <text x="210" y="30" fill="#cbd5e1" font-size="10" font-weight="bold">${p2}</text>
      <text x="145" y="65" fill="#7dd3fc" font-size="11" font-weight="black">d = ${dist}</text>
    </svg>
  `,

  // Cubo 3D
  cubo3D: (arista: string | number) => `
    <svg viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="260" height="160" rx="12" fill="#0f172a"/>
      <!-- Cara Frontal -->
      <rect x="70" y="55" width="80" height="80" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
      <!-- Cara Superior -->
      <polygon points="70,55 110,25 190,25 150,55" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
      <!-- Cara Lateral -->
      <polygon points="150,55 190,25 190,105 150,135" fill="#3730a3" stroke="#818cf8" stroke-width="2"/>
      <!-- Labels -->
      <text x="110" y="150" fill="#c7d2fe" font-size="11" font-weight="bold" text-anchor="middle">arista a = ${arista}</text>
      <text x="110" y="98" fill="#ffffff" font-size="11" font-weight="black" text-anchor="middle">V = a³</text>
      <text x="200" y="70" fill="#a5b4fc" font-size="10" font-weight="bold">Área = 6·a²</text>
    </svg>
  `,

  // Prisma Rectangular (Paralelepípedo)
  prismaRectangular: (largo: string | number, ancho: string | number, alto: string | number) => `
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="160" rx="12" fill="#0f172a"/>
      <!-- Front Face -->
      <rect x="50" y="60" width="120" height="70" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
      <!-- Top Face -->
      <polygon points="50,60 90,30 210,30 170,60" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
      <!-- Right Face -->
      <polygon points="170,60 210,30 210,100 170,130" fill="#065f46" stroke="#34d399" stroke-width="2"/>
      <!-- Labels -->
      <text x="110" y="148" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">Largo: ${largo}</text>
      <text x="195" y="70" fill="#a7f3d0" font-size="11" font-weight="bold">Ancho: ${ancho}</text>
      <text x="35" y="100" fill="#a7f3d0" font-size="11" font-weight="bold">Alto: ${alto}</text>
      <text x="110" y="98" fill="#ffffff" font-size="10" font-family="monospace" text-anchor="middle">V = l·a·h</text>
    </svg>
  `,

  // Estanque cilíndrico / rectangular con agua
  estanqueAgua: (litros: string) => `
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="280" height="160" rx="12" fill="#0f172a"/>
      <!-- Tank Body -->
      <rect x="60" y="40" width="150" height="90" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>
      <!-- Water Fill -->
      <rect x="62" y="65" width="146" height="63" rx="6" fill="#0284c7" opacity="0.6"/>
      <!-- Flow lines -->
      <path d="M 70,80 Q 100,75 130,80 T 190,80" fill="none" stroke="#7dd3fc" stroke-width="2"/>
      <path d="M 70,95 Q 100,90 130,95 T 190,95" fill="none" stroke="#7dd3fc" stroke-width="2"/>
      <!-- Label -->
      <text x="135" y="115" fill="#f0f9ff" font-size="13" font-weight="black" text-anchor="middle">${litros}</text>
      <text x="135" y="30" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">1 m³ = 1.000 L</text>
    </svg>
  `
};

// =========================================================================
// BANCO OFICIAL 8° BÁSICO UNIDAD 3: FORMA A (20 PREGUNTAS)
// =========================================================================
export const DON_BOSCO_8BASICO_FORMA_A: Question[] = [
  // 1. Hipotenusa
  {
    id: '8b-u3-q1-a',
    text: 'Un triángulo rectángulo tiene catetos de longitud 6 cm y 8 cm. ¿Cuál es la longitud de su hipotenusa?',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    correctAnswer: 0, // A
    explanation: 'Por el Teorema de Pitágoras: $c = \\sqrt{a^2 + b^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$.',
    hint: 'Aplica el Teorema de Pitágoras: eleva al cuadrado cada cateto ($6^2$ y $8^2$), súmalos y luego extrae la raíz cuadrada del resultado.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('6 cm', '8 cm', '?'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cálculo de la Hipotenusa'
  },
  // 2. Cateto Faltante
  {
    id: '8b-u3-q2-a',
    text: 'Un triángulo rectángulo tiene una hipotenusa de 13 cm y uno de sus catetos mide 5 cm. ¿Cuánto mide el otro cateto?',
    options: ['8 cm', '12 cm', '18 cm', '144 cm'],
    correctAnswer: 1, // B
    explanation: 'Para calcular un cateto faltante: $b = \\sqrt{c^2 - a^2} = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ cm}$.',
    hint: 'Para hallar un cateto se resta: resta el cuadrado del cateto conocido al cuadrado de la hipotenusa ($13^2 - 5^2$), y luego calcula la raíz cuadrada.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('5 cm', '?', '13 cm'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cateto Faltante'
  },
  // 3. Escalera en Pared
  {
    id: '8b-u3-q3-a',
    text: 'Una escalera de 5 metros de largo se apoya contra una pared vertical. Si la base de la escalera está a 3 metros de la pared, ¿a qué altura de la pared llega la escalera?',
    options: ['2 metros', '3,5 metros', '4 metros', '16 metros'],
    correctAnswer: 2, // C
    explanation: 'La escalera actúa como hipotenusa ($L = 5$) y la distancia al pie como cateto ($d = 3$). Altura: $h = \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4\\text{ metros}$.',
    hint: 'La escalera es la hipotenusa y la distancia en el suelo es un cateto. Aplica $h = \\sqrt{L^2 - d^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.escaleraPared('5 m', '3 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Cotidiana: Escalera en Pared'
  },
  // 4. Cable de Sujeción
  {
    id: '8b-u3-q4-a',
    text: 'Un poste vertical de 12 metros de altura se sujeta con un cable tirante desde su parte superior hasta un punto en el suelo a 9 metros de la base. ¿Cuál es la longitud del cable?',
    options: ['15 metros', '21 metros', '18 metros', '225 metros'],
    correctAnswer: 0, // A
    explanation: 'El poste y la distancia al suelo forman catetos de 12 y 9 m. Longitud del cable: $L = \\sqrt{12^2 + 9^2} = \\sqrt{144 + 81} = \\sqrt{225} = 15\\text{ metros}$.',
    hint: 'El poste vertical y el suelo son perpendiculares (catetos). El cable tirante es la hipotenusa.',
    svg: UNIDAD3_8BASICO_SVGS.posteVentanal('12 m', '9 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Técnica: Cable de Sujeción'
  },
  // 5. Tríos Pitagóricos
  {
    id: '8b-u3-q5-a',
    text: '¿Cuál de los siguientes grupos de medidas corresponde a los lados de un triángulo rectángulo?',
    options: ['4 cm, 5 cm, 6 cm', '9 cm, 12 cm, 15 cm', '5 cm, 10 cm, 15 cm', '7 cm, 8 cm, 10 cm'],
    correctAnswer: 1, // B
    explanation: 'Verificamos $a^2 + b^2 = c^2$: $9^2 + 12^2 = 81 + 144 = 225$, y $15^2 = 225$. Como son iguales, forman un triángulo rectángulo.',
    hint: 'Comprueba qué grupo cumple que la suma de los cuadrados de los dos menores sea igual al cuadrado del mayor ($a^2 + b^2 = c^2$).',
    grade: '8° Básico',
    topic: 'Teorema Recíproco: Tríos Pitagóricos'
  },
  // 6. Diagonal Terreno
  {
    id: '8b-u3-q6-a',
    text: 'Un terreno rectangular mide 15 metros de largo y 8 metros de ancho. ¿Cuánto mide la diagonal de dicho terreno?',
    options: ['17 metros', '23 metros', '289 metros', '161 metros'],
    correctAnswer: 0, // A
    explanation: 'Diagonal: $D = \\sqrt{15^2 + 8^2} = \\sqrt{225 + 64} = \\sqrt{289} = 17\\text{ metros}$.',
    hint: 'La diagonal de un rectángulo forma un triángulo rectángulo con el largo y el ancho como catetos.',
    svg: UNIDAD3_8BASICO_SVGS.terrenoDiagonal('15 m', '8 m', '?'),
    grade: '8° Básico',
    topic: 'Geometría Aplicada: Diagonal de Rectángulo'
  },
  // 7. Distancia entre Puntos
  {
    id: '8b-u3-q7-a',
    text: 'En el plano cartesiano, ¿cuál es la distancia entre los puntos A(1, 2) y B(4, 6)?',
    options: ['7 unidades', '5 unidades', '25 unidades', '12 unidades'],
    correctAnswer: 1, // B
    explanation: 'Distancia: $d = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5\\text{ unidades}$.',
    hint: 'Calcula la variación en X ($\\\\Delta x = 4-1 = 3$) y en Y ($\\\\Delta y = 6-2 = 4$), y aplica Pitágoras: $d = \\sqrt{\\\\Delta x^2 + \\\\Delta y^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.planoCartesiano('A(1,2)', 'B(4,6)', '?'),
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia entre Dos Puntos'
  },
  // 8. Distancia con Coordenadas Negativas
  {
    id: '8b-u3-q8-a',
    text: 'Un punto P se ubica en (-2, 3) y un punto Q en (4, 11). ¿Cuál es la distancia entre P y Q?',
    options: ['10 unidades', '14 unidades', '100 unidades', '8 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 4 - (-2) = 6$; $\\Delta y = 11 - 3 = 8$. Distancia: $d = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Ten cuidado con el signo negativo: restar un negativo equivale a sumar ($4 - (-2) = 6$). Luego eleva al cuadrado y suma.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Coordenadas Negativas'
  },
  // 9. Perímetro de Triángulo en el Plano
  {
    id: '8b-u3-q9-a',
    text: 'Un triángulo rectángulo en el plano cartesiano tiene sus vértices en K(0, 0), L(6, 0) y M(0, 8). ¿Cuál es el perímetro del triángulo KLM?',
    options: ['14 unidades', '24 unidades', '48 unidades', '20 unidades'],
    correctAnswer: 1, // B
    explanation: 'Los catetos miden $KL = 6$ y $KM = 8$. La hipotenusa es $LM = \\sqrt{6^2 + 8^2} = 10$. El perímetro es $P = 6 + 8 + 10 = 24\\text{ unidades}$.',
    hint: 'Calcula primero los lados sobre los ejes (longitud 6 y 8) y halla la hipotenusa con Pitágoras. Finalmente suma los 3 lados.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Perímetro de Triángulo'
  },
  // 10. Longitud de Segmento entre Cuadrantes
  {
    id: '8b-u3-q10-a',
    text: 'Calcula la distancia entre los puntos R(-3, -1) y S(5, 5) representados en el plano cartesiano.',
    options: ['10 unidades', '14 unidades', '12 unidades', '64 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 5 - (-3) = 8$; $\\Delta y = 5 - (-1) = 6$. Distancia: $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Calcula el cateto horizontal ($5 - (-3) = 8$) y el vertical ($5 - (-1) = 6$). La distancia es la hipotenusa de ese triángulo.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Longitud de Segmento'
  },
  // 11. Área de Triángulo en el Plano
  {
    id: '8b-u3-q11-a',
    text: 'Los vértices de un triángulo rectángulo son A(2, 1), B(8, 1) y C(2, 9). ¿Cuál es el área de este triángulo?',
    options: ['48 u²', '24 u²', '14 u²', '20 u²'],
    correctAnswer: 1, // B
    explanation: 'La base horizontal va de $(2,1)$ a $(8,1)$: $b = 8 - 2 = 6$. La altura vertical va de $(2,1)$ a $(2,9)$: $h = 9 - 1 = 8$. Área = $(6 \\cdot 8) / 2 = 48 / 2 = 24\\text{ u}^2$.',
    hint: 'Identifica la base restando las X ($8 - 2$) y la altura restando las Y ($9 - 1$). Recuerda que el área es $(\\text{base} \\cdot \\text{altura}) / 2$.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Área de Triángulo'
  },
  // 12. Distancia desde el Origen
  {
    id: '8b-u3-q12-a',
    text: 'En el plano cartesiano, ¿cuál es la distancia exacta desde el origen O(0, 0) al punto B(6, 8)?',
    options: ['14 unidades', '12 unidades', '10 unidades', '100 unidades'],
    correctAnswer: 2, // C
    explanation: 'Distancia al origen: $d = \\sqrt{x^2 + y^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Desde el origen $(0,0)$, la distancia a $(x,y)$ es simplemente $\\sqrt{x^2 + y^2}$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia desde el Origen'
  },
  // 13. Volumen del Cubo
  {
    id: '8b-u3-q13-a',
    text: '¿Cuál es el volumen de un cubo cuya arista mide 5 cm?',
    options: ['25 cm³', '125 cm³', '150 cm³', '30 cm³'],
    correctAnswer: 1, // B
    explanation: 'Volumen del cubo: $V = a^3 = 5^3 = 5 \\cdot 5 \\cdot 5 = 125\\text{ cm}^3$.',
    hint: 'El volumen de un cubo se calcula elevando la longitud de su arista al cubo ($a^3$).',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('5 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Volumen del Cubo'
  },
  // 14. Área Total del Cubo
  {
    id: '8b-u3-q14-a',
    text: 'Calcula el área total de la superficie de un cubo de 4 cm de arista.',
    options: ['64 cm²', '96 cm²', '16 cm²', '24 cm²'],
    correctAnswer: 1, // B
    explanation: 'Un cubo tiene 6 caras cuadradas idénticas. Área = $6 \\cdot a^2 = 6 \\cdot 4^2 = 6 \\cdot 16 = 96\\text{ cm}^2$.',
    hint: 'Un cubo tiene 6 caras cuadradas congruentes. Calcula el área de una cara ($a^2$) y multiplícala por 6.',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('4 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Área Total del Cubo'
  },
  // 15. Arista desde Volumen
  {
    id: '8b-u3-q15-a',
    text: 'El volumen de un depósito cúbico es de 216 cm³. ¿Cuánto mide cada una de sus aristas?',
    options: ['6 cm', '12 cm', '36 cm', '18 cm'],
    correctAnswer: 0, // A
    explanation: 'Arista: $a = \\sqrt[3]{V} = \\sqrt[3]{216} = 6\\text{ cm}$, pues $6 \\cdot 6 \\cdot 6 = 216$.',
    hint: 'Busca un número entero que multiplicado por sí mismo tres veces ($a \\cdot a \\cdot a$) resulte 216 (raíz cúbica).',
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Arista desde Volumen'
  },
  // 16. Forrar Cubo
  {
    id: '8b-u3-q16-a',
    text: 'Se desea forrar con papel de regalo una caja cúbica de 10 cm de arista. ¿Cuántos centímetros cuadrados de papel se necesitan como mínimo?',
    options: ['1000 cm²', '400 cm²', '600 cm²', '100 cm²'],
    correctAnswer: 2, // C
    explanation: 'Para forrar la caja se requiere su área total: $A = 6 \\cdot a^2 = 6 \\cdot 10^2 = 6 \\cdot 100 = 600\\text{ cm}^2$.',
    hint: 'Forrar el cubo equivale a cubrir sus 6 caras. Calcula $6 \\times (\\text{arista})^2$.',
    grade: '8° Básico',
    topic: 'Problema Aplicado: Forrar Caja Cúbica'
  },
  // 17. Volumen Prisma Rectangular
  {
    id: '8b-u3-q17-a',
    text: 'Un prisma rectangular (paralelepípedo) tiene un largo de 8 cm, un ancho de 5 cm y una altura de 6 cm. ¿Cuál es su volumen?',
    options: ['240 cm³', '118 cm³', '190 cm³', '40 cm³'],
    correctAnswer: 0, // A
    explanation: 'Volumen: $V = \\text{largo} \\cdot \\text{ancho} \\cdot \\text{alto} = 8 \\cdot 5 \\cdot 6 = 240\\text{ cm}^3$.',
    hint: 'El volumen de un paralelepípedo es el producto de sus tres dimensiones: largo por ancho por alto.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('8 cm', '5 cm', '6 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Volumen'
  },
  // 18. Área Superficial Caja Rectangular
  {
    id: '8b-u3-q18-a',
    text: 'Calcula el área total de la superficie de una caja rectangular de dimensiones 4 cm de largo, 3 cm de ancho y 5 cm de alto.',
    options: ['60 cm²', '94 cm²', '47 cm²', '120 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $2(la + lh + ah) = 2(4 \\cdot 3 + 4 \\cdot 5 + 3 \\cdot 5) = 2(12 + 20 + 15) = 2(47) = 94\\text{ cm}^2$.',
    hint: 'Suma las áreas de los 3 pares de caras opuestas: $2 \\times (\\text{largo} \\cdot \\text{ancho} + \\text{largo} \\cdot \\text{alto} + \\text{ancho} \\cdot \\text{alto})$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('4 cm', '3 cm', '5 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Área Superficial'
  },
  // 19. Altura Desconocida Prisma
  {
    id: '8b-u3-q19-a',
    text: 'El volumen de una caja rectangular es 180 cm³. Si la base tiene un largo de 6 cm y un ancho de 5 cm, ¿cuál es la altura de la caja?',
    options: ['6 cm', '10 cm', '8 cm', '12 cm'],
    correctAnswer: 0, // A
    explanation: 'Área basal: $6 \\cdot 5 = 30\\text{ cm}^2$. Altura: $h = V / (l \\cdot a) = 180 / 30 = 6\\text{ cm}$.',
    hint: 'Calcula primero el área de la base ($6 \\times 5 = 30$). Luego divide el volumen total por dicha área basal.',
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Altura Desconocida'
  },
  // 20. Capacidad en Litros
  {
    id: '8b-u3-q20-a',
    text: 'Un estanque rectangular de agua mide 2 m de largo, 1,5 m de ancho y 1 m de profundidad. Si 1 m³ equivale a 1.000 litros, ¿cuántos litros de agua puede contener al 100% de su capacidad?',
    options: ['3.000 litros', '4.500 litros', '300 litros', '1.500 litros'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $2 \\cdot 1,5 \\cdot 1 = 3\\text{ m}^3$. Capacidad en litros = $3 \\cdot 1.000 = 3.000\\text{ litros}$.',
    hint: 'Multiplica las 3 dimensiones en metros para obtener el volumen en metros cúbicos ($m^3$). Luego multiplica por 1.000 para convertir a litros.',
    svg: UNIDAD3_8BASICO_SVGS.estanqueAgua('3.000 L'),
    grade: '8° Básico',
    topic: 'Aplicación Industrial: Capacidad en Litros'
  }
];

// =========================================================================
// BANCO OFICIAL 8° BÁSICO UNIDAD 3: FORMA B (20 PREGUNTAS)
// =========================================================================
export const DON_BOSCO_8BASICO_FORMA_B: Question[] = [
  // 1. Hipotenusa
  {
    id: '8b-u3-q1-b',
    text: 'Un triángulo rectángulo tiene catetos de longitud 9 cm y 12 cm. ¿Cuál es la longitud de su hipotenusa?',
    options: ['15 cm', '21 cm', '18 cm', '225 cm'],
    correctAnswer: 0, // A
    explanation: 'Por el Teorema de Pitágoras: $c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$.',
    hint: 'Eleva al cuadrado los catetos ($9^2$ y $12^2$), súmalos y halla la raíz cuadrada del resultado.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('9 cm', '12 cm', '?'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cálculo de la Hipotenusa'
  },
  // 2. Cateto Faltante
  {
    id: '8b-u3-q2-b',
    text: 'Un triángulo rectángulo tiene una hipotenusa de 25 cm y uno de sus catetos mide 7 cm. ¿Cuánto mide el otro cateto?',
    options: ['18 cm', '24 cm', '32 cm', '576 cm'],
    correctAnswer: 1, // B
    explanation: '$b = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24\\text{ cm}$.',
    hint: 'Resta el cuadrado del cateto conocido al cuadrado de la hipotenusa ($25^2 - 7^2 = 625 - 49$) y extrae la raíz cuadrada.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('7 cm', '?', '25 cm'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cateto Faltante'
  },
  // 3. Escalera en Pared
  {
    id: '8b-u3-q3-b',
    text: 'Una escalera de 10 metros de largo se apoya contra una pared vertical. Si la base de la escalera está a 6 metros de la pared, ¿a qué altura de la pared llega la escalera?',
    options: ['4 metros', '7 metros', '8 metros', '64 metros'],
    correctAnswer: 2, // C
    explanation: 'Altura: $h = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64} = 8\\text{ metros}$.',
    hint: 'Aplica $h = \\sqrt{L^2 - d^2}$ con hipotenusa $L = 10$ y cateto basal $d = 6$.',
    svg: UNIDAD3_8BASICO_SVGS.escaleraPared('10 m', '6 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Cotidiana: Escalera en Pared'
  },
  // 4. Cable de Sujeción
  {
    id: '8b-u3-q4-b',
    text: 'Un poste vertical de 16 metros de altura se sujeta con un cable tirante desde su parte superior hasta un punto en el suelo a 12 metros de la base. ¿Cuál es la longitud del cable?',
    options: ['20 metros', '28 metros', '24 metros', '400 metros'],
    correctAnswer: 0, // A
    explanation: 'Longitud del cable: $L = \\sqrt{16^2 + 12^2} = \\sqrt{256 + 144} = \\sqrt{400} = 20\\text{ metros}$.',
    hint: 'Calcula la hipotenusa con catetos de 16 m y 12 m: $\\sqrt{16^2 + 12^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.posteVentanal('16 m', '12 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Técnica: Cable de Sujeción'
  },
  // 5. Tríos Pitagóricos
  {
    id: '8b-u3-q5-b',
    text: '¿Cuál de los siguientes grupos de medidas corresponde a los lados de un triángulo rectángulo?',
    options: ['6 cm, 7 cm, 8 cm', '8 cm, 15 cm, 17 cm', '10 cm, 12 cm, 14 cm', '5 cm, 6 cm, 9 cm'],
    correctAnswer: 1, // B
    explanation: 'Comprobamos: $8^2 + 15^2 = 64 + 225 = 289$, y $17^2 = 289$. Por tanto, (8, 15, 17) es un trío pitagórico exacto.',
    hint: 'Verifica la igualdad $a^2 + b^2 = c^2$ para los valores dados.',
    grade: '8° Básico',
    topic: 'Teorema Recíproco: Tríos Pitagóricos'
  },
  // 6. Diagonal Terreno
  {
    id: '8b-u3-q6-b',
    text: 'Un terreno rectangular mide 24 metros de largo y 10 metros de ancho. ¿Cuánto mide la diagonal de dicho terreno?',
    options: ['26 metros', '34 metros', '676 metros', '22 metros'],
    correctAnswer: 0, // A
    explanation: 'Diagonal: $D = \\sqrt{24^2 + 10^2} = \\sqrt{576 + 100} = \\sqrt{676} = 26\\text{ metros}$.',
    hint: 'Eleva al cuadrado el largo ($24^2$) y el ancho ($10^2$), suma y extrae raíz cuadrada.',
    svg: UNIDAD3_8BASICO_SVGS.terrenoDiagonal('24 m', '10 m', '?'),
    grade: '8° Básico',
    topic: 'Geometría Aplicada: Diagonal de Rectángulo'
  },
  // 7. Distancia entre Puntos
  {
    id: '8b-u3-q7-b',
    text: 'En el plano cartesiano, ¿cuál es la distancia entre los puntos A(2, 3) y B(8, 11)?',
    options: ['14 unidades', '10 unidades', '100 unidades', '12 unidades'],
    correctAnswer: 1, // B
    explanation: '$\\Delta x = 8 - 2 = 6$; $\\Delta y = 11 - 3 = 8$. Distancia: $d = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Calcula $\\Delta x$ y $\\Delta y$, luego $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.planoCartesiano('A(2,3)', 'B(8,11)', '?'),
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia entre Dos Puntos'
  },
  // 8. Distancia con Coordenadas Negativas
  {
    id: '8b-u3-q8-b',
    text: 'Un punto P se ubica en (1, -2) y un punto Q en (9, 4). ¿Cuál es la distancia entre P y Q?',
    options: ['10 unidades', '14 unidades', '100 unidades', '8 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 9 - 1 = 8$; $\\Delta y = 4 - (-2) = 6$. Distancia: $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Atención al signo: $4 - (-2) = 6$. Luego aplica Pitágoras con 8 y 6.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Coordenadas Negativas'
  },
  // 9. Perímetro de Triángulo en el Plano
  {
    id: '8b-u3-q9-b',
    text: 'Un triángulo rectángulo en el plano cartesiano tiene sus vértices en K(0, 0), L(9, 0) y M(0, 12). ¿Cuál es el perímetro del triángulo KLM?',
    options: ['21 unidades', '36 unidades', '54 unidades', '30 unidades'],
    correctAnswer: 1, // B
    explanation: 'Catetos: 9 y 12. Hipotenusa: $\\sqrt{9^2 + 12^2} = 15$. Perímetro = $9 + 12 + 15 = 36\\text{ unidades}$.',
    hint: 'Encuentra la hipotenusa de los catetos 9 y 12, y suma los tres lados del triángulo.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Perímetro de Triángulo'
  },
  // 10. Longitud de Segmento entre Cuadrantes
  {
    id: '8b-u3-q10-b',
    text: 'Calcula la distancia entre los puntos R(-1, -2) y S(11, 3) representados en el plano cartesiano.',
    options: ['13 unidades', '17 unidades', '15 unidades', '144 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 11 - (-1) = 12$; $\\Delta y = 3 - (-2) = 5$. Distancia: $d = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ unidades}$.',
    hint: 'Calcula las variaciones: $\\Delta x = 12$ y $\\Delta y = 5$. Luego $\\sqrt{12^2 + 5^2}$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Longitud de Segmento'
  },
  // 11. Área de Triángulo en el Plano
  {
    id: '8b-u3-q11-b',
    text: 'Los vértices de un triángulo rectángulo son A(1, 2), B(11, 2) y C(1, 8). ¿Cuál es el área de este triángulo?',
    options: ['60 u²', '30 u²', '16 u²', '26 u²'],
    correctAnswer: 1, // B
    explanation: 'Base horizontal: $11 - 1 = 10$. Altura vertical: $8 - 2 = 6$. Área = $(10 \\cdot 6) / 2 = 30\\text{ u}^2$.',
    hint: 'Base = $11 - 1 = 10$, Altura = $8 - 2 = 6$. Aplica $(\\text{base} \\cdot \\text{altura}) / 2$.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Área de Triángulo'
  },
  // 12. Distancia desde el Origen
  {
    id: '8b-u3-q12-b',
    text: 'En el plano cartesiano, ¿cuál es la distancia exacta desde el origen O(0, 0) al punto B(8, 6)?',
    options: ['14 unidades', '12 unidades', '10 unidades', '100 unidades'],
    correctAnswer: 2, // C
    explanation: 'Distancia al origen: $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: 'Calcula $\\sqrt{8^2 + 6^2}$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia desde el Origen'
  },
  // 13. Volumen del Cubo
  {
    id: '8b-u3-q13-b',
    text: '¿Cuál es el volumen de un cubo cuya arista mide 6 cm?',
    options: ['36 cm³', '216 cm³', '180 cm³', '18 cm³'],
    correctAnswer: 1, // B
    explanation: 'Volumen: $V = a^3 = 6^3 = 6 \\cdot 6 \\cdot 6 = 216\\text{ cm}^3$.',
    hint: 'Multiplica la arista por sí misma tres veces ($6 \\times 6 \\times 6$).',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('6 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Volumen del Cubo'
  },
  // 14. Área Total del Cubo
  {
    id: '8b-u3-q14-b',
    text: 'Calcula el área total de la superficie de un cubo de 5 cm de arista.',
    options: ['125 cm²', '150 cm²', '25 cm²', '30 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $6 \\cdot a^2 = 6 \\cdot 5^2 = 6 \\cdot 25 = 150\\text{ cm}^2$.',
    hint: 'Multiplica 6 por el cuadrado de la arista ($6 \\times 5^2$).',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('5 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Área Total del Cubo'
  },
  // 15. Arista desde Volumen
  {
    id: '8b-u3-q15-b',
    text: 'El volumen de un depósito cúbico es de 343 cm³. ¿Cuánto mide cada una de sus aristas?',
    options: ['7 cm', '14 cm', '49 cm', '21 cm'],
    correctAnswer: 0, // A
    explanation: 'Arista: $a = \\sqrt[3]{343} = 7\\text{ cm}$, pues $7 \\cdot 7 \\cdot 7 = 343$.',
    hint: '¿Qué número multiplicado tres veces da 343? Piensa en $7^3$.',
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Arista desde Volumen'
  },
  // 16. Forrar Cubo
  {
    id: '8b-u3-q16-b',
    text: 'Se desea forrar con papel de regalo una caja cúbica de 12 cm de arista. ¿Cuántos centímetros cuadrados de papel se necesitan como mínimo?',
    options: ['1728 cm²', '576 cm²', '864 cm²', '144 cm²'],
    correctAnswer: 2, // C
    explanation: 'Área total = $6 \\cdot 12^2 = 6 \\cdot 144 = 864\\text{ cm}^2$.',
    hint: 'Área requerida = $6 \\times 12^2 = 6 \\times 144$.',
    grade: '8° Básico',
    topic: 'Problema Aplicado: Forrar Caja Cúbica'
  },
  // 17. Volumen Prisma Rectangular
  {
    id: '8b-u3-q17-b',
    text: 'Un prisma rectangular (paralelepípedo) tiene un largo de 10 cm, un ancho de 6 cm y una altura de 4 cm. ¿Cuál es su volumen?',
    options: ['240 cm³', '124 cm³', '200 cm³', '48 cm³'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $10 \\cdot 6 \\cdot 4 = 240\\text{ cm}^3$.',
    hint: 'Multiplica las 3 dimensiones: $10 \\times 6 \\times 4$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('10 cm', '6 cm', '4 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Volumen'
  },
  // 18. Área Superficial Caja Rectangular
  {
    id: '8b-u3-q18-b',
    text: 'Calcula el área total de la superficie de una caja rectangular de dimensiones 6 cm de largo, 4 cm de ancho y 5 cm de alto.',
    options: ['120 cm²', '148 cm²', '74 cm²', '180 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $2(6 \\cdot 4 + 6 \\cdot 5 + 4 \\cdot 5) = 2(24 + 30 + 20) = 2(74) = 148\\text{ cm}^2$.',
    hint: 'Calcula $2 \\times (24 + 30 + 20)$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('6 cm', '4 cm', '5 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Área Superficial'
  },
  // 19. Altura Desconocida Prisma
  {
    id: '8b-u3-q19-b',
    text: 'El volumen de una caja rectangular es 280 cm³. Si la base tiene un largo de 8 cm y un ancho de 5 cm, ¿cuál es la altura de la caja?',
    options: ['7 cm', '12 cm', '9 cm', '14 cm'],
    correctAnswer: 0, // A
    explanation: 'Área basal: $8 \\cdot 5 = 40\\text{ cm}^2$. Altura: $h = 280 / 40 = 7\\text{ cm}$.',
    hint: 'Divide el volumen (280) por el producto de la base ($8 \\times 5 = 40$).',
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Altura Desconocida'
  },
  // 20. Capacidad en Litros
  {
    id: '8b-u3-q20-b',
    text: 'Un estanque rectangular de agua mide 3 m de largo, 2 m de ancho y 1,5 m de profundidad. Si 1 m³ equivale a 1.000 litros, ¿cuántos litros de agua puede contener al 100% de su capacidad?',
    options: ['9.000 litros', '12.000 litros', '900 litros', '4.500 litros'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $3 \\cdot 2 \\cdot 1,5 = 9\\text{ m}^3$. Capacidad = $9 \\cdot 1.000 = 9.000\\text{ litros}$.',
    hint: 'Volumen en $m^3 = 3 \\times 2 \\times 1,5 = 9$. Luego multiplica por 1.000.',
    svg: UNIDAD3_8BASICO_SVGS.estanqueAgua('9.000 L'),
    grade: '8° Básico',
    topic: 'Aplicación Industrial: Capacidad en Litros'
  }
];

// =========================================================================
// BANCO OFICIAL 8° BÁSICO UNIDAD 3: FORMA C (20 PREGUNTAS)
// =========================================================================
export const DON_BOSCO_8BASICO_FORMA_C: Question[] = [
  // 1. Hipotenusa
  {
    id: '8b-u3-q1-c',
    text: 'Un triángulo rectángulo tiene catetos de longitud 5 cm y 12 cm. ¿Cuál es la longitud de su hipotenusa?',
    options: ['13 cm', '17 cm', '15 cm', '169 cm'],
    correctAnswer: 0, // A
    explanation: 'Por el Teorema de Pitágoras: $c = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13\\text{ cm}$.',
    hint: 'Calcula $\\sqrt{5^2 + 12^2} = \\sqrt{25 + 144}$.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('5 cm', '12 cm', '?'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cálculo de la Hipotenusa'
  },
  // 2. Cateto Faltante
  {
    id: '8b-u3-q2-c',
    text: 'Un triángulo rectángulo tiene una hipotenusa de 15 cm y uno de sus catetos mide 9 cm. ¿Cuánto mide el otro cateto?',
    options: ['11 cm', '12 cm', '16 cm', '144 cm'],
    correctAnswer: 1, // B
    explanation: '$b = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12\\text{ cm}$.',
    hint: 'Resta los cuadrados: $15^2 - 9^2 = 225 - 81 = 144$.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('9 cm', '?', '15 cm'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cateto Faltante'
  },
  // 3. Escalera en Pared
  {
    id: '8b-u3-q3-c',
    text: 'Una escalera de 13 metros de largo se apoya contra una pared vertical. Si la base de la escalera está a 5 metros de la pared, ¿a qué altura de la pared llega la escalera?',
    options: ['8 metros', '10 metros', '12 metros', '144 metros'],
    correctAnswer: 2, // C
    explanation: 'Altura: $h = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ metros}$.',
    hint: 'Aplica $h = \\sqrt{13^2 - 5^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.escaleraPared('13 m', '5 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Cotidiana: Escalera en Pared'
  },
  // 4. Cable de Sujeción
  {
    id: '8b-u3-q4-c',
    text: 'Un poste vertical de 24 metros de altura se sujeta con un cable tirante desde su parte superior hasta un punto en el suelo a 10 metros de la base. ¿Cuál es la longitud del cable?',
    options: ['26 metros', '34 metros', '30 metros', '676 metros'],
    correctAnswer: 0, // A
    explanation: 'Longitud: $L = \\sqrt{24^2 + 10^2} = \\sqrt{576 + 100} = \\sqrt{676} = 26\\text{ metros}$.',
    hint: 'Calcula $\\sqrt{24^2 + 10^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.posteVentanal('24 m', '10 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Técnica: Cable de Sujeción'
  },
  // 5. Tríos Pitagóricos
  {
    id: '8b-u3-q5-c',
    text: '¿Cuál de los siguientes grupos de medidas corresponde a los lados de un triángulo rectángulo?',
    options: ['8 cm, 9 cm, 10 cm', '12 cm, 16 cm, 20 cm', '10 cm, 15 cm, 20 cm', '6 cm, 8 cm, 12 cm'],
    correctAnswer: 1, // B
    explanation: '$12^2 + 16^2 = 144 + 256 = 400$, y $20^2 = 400$. Por tanto, (12, 16, 20) es un trío pitagórico (múltiplo de 3-4-5).',
    hint: 'Verifica qué conjunto cumple $a^2 + b^2 = c^2$. Nota que $12, 16, 20$ es $4 \\times (3, 4, 5)$.',
    grade: '8° Básico',
    topic: 'Teorema Recíproco: Tríos Pitagóricos'
  },
  // 6. Diagonal Terreno
  {
    id: '8b-u3-q6-c',
    text: 'Un terreno rectangular mide 12 metros de largo y 9 metros de ancho. ¿Cuánto mide la diagonal de dicho terreno?',
    options: ['15 metros', '21 metros', '225 metros', '18 metros'],
    correctAnswer: 0, // A
    explanation: 'Diagonal: $D = \\sqrt{12^2 + 9^2} = \\sqrt{144 + 81} = \\sqrt{225} = 15\\text{ metros}$.',
    hint: 'Calcula $\\sqrt{12^2 + 9^2}$.',
    svg: UNIDAD3_8BASICO_SVGS.terrenoDiagonal('12 m', '9 m', '?'),
    grade: '8° Básico',
    topic: 'Geometría Aplicada: Diagonal de Rectángulo'
  },
  // 7. Distancia entre Puntos
  {
    id: '8b-u3-q7-c',
    text: 'En el plano cartesiano, ¿cuál es la distancia entre los puntos A(3, 1) y B(11, 7)?',
    options: ['14 unidades', '10 unidades', '100 unidades', '12 unidades'],
    correctAnswer: 1, // B
    explanation: '$\\Delta x = 11 - 3 = 8$; $\\Delta y = 7 - 1 = 6$. Distancia: $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: '$\\Delta x = 8$, $\\Delta y = 6$. Aplica Pitágoras.',
    svg: UNIDAD3_8BASICO_SVGS.planoCartesiano('A(3,1)', 'B(11,7)', '?'),
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia entre Dos Puntos'
  },
  // 8. Distancia con Coordenadas Negativas
  {
    id: '8b-u3-q8-c',
    text: 'Un punto P se ubica en (-4, 2) y un punto Q en (8, 7). ¿Cuál es la distancia entre P y Q?',
    options: ['13 unidades', '17 unidades', '169 unidades', '15 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 8 - (-4) = 12$; $\\Delta y = 7 - 2 = 5$. Distancia: $d = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ unidades}$.',
    hint: '$8 - (-4) = 12$ y $7 - 2 = 5$. $\\sqrt{12^2 + 5^2} = \\sqrt{169} = 13$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Coordenadas Negativas'
  },
  // 9. Perímetro de Triángulo en el Plano
  {
    id: '8b-u3-q9-c',
    text: 'Un triángulo rectángulo en el plano cartesiano tiene sus vértices en K(0, 0), L(12, 0) y M(0, 16). ¿Cuál es el perímetro del triángulo KLM?',
    options: ['28 unidades', '48 unidades', '96 unidades', '40 unidades'],
    correctAnswer: 1, // B
    explanation: 'Catetos: 12 y 16. Hipotenusa: $\\sqrt{12^2 + 16^2} = 20$. Perímetro = $12 + 16 + 20 = 48\\text{ unidades}$.',
    hint: 'Calcula la hipotenusa de 12 y 16 (que es 20) y suma los 3 lados.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Perímetro de Triángulo'
  },
  // 10. Longitud de Segmento entre Cuadrantes
  {
    id: '8b-u3-q10-c',
    text: 'Calcula la distancia entre los puntos R(-2, -3) y S(6, 3) representados en el plano cartesiano.',
    options: ['10 unidades', '14 unidades', '12 unidades', '100 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 6 - (-2) = 8$; $\\Delta y = 3 - (-3) = 6$. Distancia: $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: '$\\Delta x = 8$ y $\\Delta y = 6$. Hipotenusa = 10.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Longitud de Segmento'
  },
  // 11. Área de Triángulo en el Plano
  {
    id: '8b-u3-q11-c',
    text: 'Los vértices de un triángulo rectángulo son A(3, 3), B(11, 3) y C(3, 9). ¿Cuál es el área de este triángulo?',
    options: ['48 u²', '24 u²', '14 u²', '20 u²'],
    correctAnswer: 1, // B
    explanation: 'Base: $11 - 3 = 8$. Altura: $9 - 3 = 6$. Área = $(8 \\cdot 6) / 2 = 24\\text{ u}^2$.',
    hint: 'Base = 8, Altura = 6. Área = $(8 \\times 6)/2 = 24$.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Área de Triángulo'
  },
  // 12. Distancia desde el Origen
  {
    id: '8b-u3-q12-c',
    text: 'En el plano cartesiano, ¿cuál es la distancia exacta desde el origen O(0, 0) al punto B(6, 8)?',
    options: ['14 unidades', '12 unidades', '10 unidades', '100 unidades'],
    correctAnswer: 2, // C
    explanation: 'Distancia al origen: $d = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ unidades}$.',
    hint: '$\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia desde el Origen'
  },
  // 13. Volumen del Cubo
  {
    id: '8b-u3-q13-c',
    text: '¿Cuál es el volumen de un cubo cuya arista mide 7 cm?',
    options: ['49 cm³', '343 cm³', '294 cm³', '21 cm³'],
    correctAnswer: 1, // B
    explanation: 'Volumen: $V = 7^3 = 7 \\cdot 7 \\cdot 7 = 343\\text{ cm}^3$.',
    hint: 'Calcula $7^3 = 7 \\times 7 \\times 7$.',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('7 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Volumen del Cubo'
  },
  // 14. Área Total del Cubo
  {
    id: '8b-u3-q14-c',
    text: 'Calcula el área total de la superficie de un cubo de 8 cm de arista.',
    options: ['256 cm²', '384 cm²', '64 cm²', '512 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $6 \\cdot a^2 = 6 \\cdot 8^2 = 6 \\cdot 64 = 384\\text{ cm}^2$.',
    hint: 'Calcula $6 \\times 8^2 = 6 \\times 64 = 384$.',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('8 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Área Total del Cubo'
  },
  // 15. Arista desde Volumen
  {
    id: '8b-u3-q15-c',
    text: 'El volumen de un depósito cúbico es de 512 cm³. ¿Cuánto mide cada una de sus aristas?',
    options: ['8 cm', '16 cm', '64 cm', '24 cm'],
    correctAnswer: 0, // A
    explanation: 'Arista: $a = \\sqrt[3]{512} = 8\\text{ cm}$, pues $8 \\cdot 8 \\cdot 8 = 512$.',
    hint: 'Calcula la raíz cúbica de 512 ($8^3 = 512$).',
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Arista desde Volumen'
  },
  // 16. Forrar Cubo
  {
    id: '8b-u3-q16-c',
    text: 'Se desea forrar con papel de regalo una caja cúbica de 15 cm de arista. ¿Cuántos centímetros cuadrados de papel se necesitan como mínimo?',
    options: ['3375 cm²', '900 cm²', '1350 cm²', '225 cm²'],
    correctAnswer: 2, // C
    explanation: 'Área total = $6 \\cdot 15^2 = 6 \\cdot 225 = 1350\\text{ cm}^2$.',
    hint: 'Calcula $6 \\times 15^2 = 6 \\times 225$.',
    grade: '8° Básico',
    topic: 'Problema Aplicado: Forrar Caja Cúbica'
  },
  // 17. Volumen Prisma Rectangular
  {
    id: '8b-u3-q17-c',
    text: 'Un prisma rectangular (paralelepípedo) tiene un largo de 12 cm, un ancho de 4 cm y una altura de 5 cm. ¿Cuál es su volumen?',
    options: ['240 cm³', '112 cm³', '180 cm³', '48 cm³'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $12 \\cdot 4 \\cdot 5 = 240\\text{ cm}^3$.',
    hint: 'Multiplica $12 \\times 4 \\times 5$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('12 cm', '4 cm', '5 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Volumen'
  },
  // 18. Área Superficial Caja Rectangular
  {
    id: '8b-u3-q18-c',
    text: 'Calcula el área total de la superficie de una caja rectangular de dimensiones 7 cm de largo, 3 cm de ancho y 4 cm de alto.',
    options: ['84 cm²', '122 cm²', '61 cm²', '140 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $2(7 \\cdot 3 + 7 \\cdot 4 + 3 \\cdot 4) = 2(21 + 28 + 12) = 2(61) = 122\\text{ cm}^2$.',
    hint: 'Calcula $2 \\times (21 + 28 + 12)$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('7 cm', '3 cm', '4 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Área Superficial'
  },
  // 19. Altura Desconocida Prisma
  {
    id: '8b-u3-q19-c',
    text: 'El volumen de una caja rectangular es 360 cm³. Si la base tiene un largo de 10 cm y un ancho de 6 cm, ¿cuál es la altura de la caja?',
    options: ['6 cm', '12 cm', '8 cm', '10 cm'],
    correctAnswer: 0, // A
    explanation: 'Área basal: $10 \\cdot 6 = 60\\text{ cm}^2$. Altura: $h = 360 / 60 = 6\\text{ cm}$.',
    hint: 'Divide 360 por $(10 \\times 6 = 60)$.',
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Altura Desconocida'
  },
  // 20. Capacidad en Litros
  {
    id: '8b-u3-q20-c',
    text: 'Un estanque rectangular de agua mide 4 m de largo, 2,5 m de ancho y 2 m de profundidad. Si 1 m³ equivale a 1.000 litros, ¿cuántos litros de agua puede contener al 100% de su capacidad?',
    options: ['20.000 litros', '25.000 litros', '2.000 litros', '10.000 litros'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $4 \\cdot 2,5 \\cdot 2 = 20\\text{ m}^3$. Capacidad = $20 \\cdot 1.000 = 20.000\\text{ litros}$.',
    hint: 'Volumen en $m^3 = 4 \\times 2,5 \\times 2 = 20$. Multiplica por 1.000.',
    svg: UNIDAD3_8BASICO_SVGS.estanqueAgua('20.000 L'),
    grade: '8° Básico',
    topic: 'Aplicación Industrial: Capacidad en Litros'
  }
];

// =========================================================================
// BANCO OFICIAL 8° BÁSICO UNIDAD 3: FORMA D (20 PREGUNTAS)
// =========================================================================
export const DON_BOSCO_8BASICO_FORMA_D: Question[] = [
  // 1. Hipotenusa
  {
    id: '8b-u3-q1-d',
    text: 'Un triángulo rectángulo tiene catetos de longitud 15 cm y 20 cm. ¿Cuál es la longitud de su hipotenusa?',
    options: ['25 cm', '35 cm', '30 cm', '625 cm'],
    correctAnswer: 0, // A
    explanation: 'Por el Teorema de Pitágoras: $c = \\sqrt{15^2 + 20^2} = \\sqrt{225 + 400} = \\sqrt{625} = 25\\text{ cm}$.',
    hint: 'Calcula $\\sqrt{15^2 + 20^2} = \\sqrt{625} = 25$.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('15 cm', '20 cm', '?'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cálculo de la Hipotenusa'
  },
  // 2. Cateto Faltante
  {
    id: '8b-u3-q2-d',
    text: 'Un triángulo rectángulo tiene una hipotenusa de 20 cm y uno de sus catetos mide 12 cm. ¿Cuánto mide el otro cateto?',
    options: ['14 cm', '16 cm', '24 cm', '256 cm'],
    correctAnswer: 1, // B
    explanation: '$b = \\sqrt{20^2 - 12^2} = \\sqrt{400 - 144} = \\sqrt{256} = 16\\text{ cm}$.',
    hint: 'Resta los cuadrados: $20^2 - 12^2 = 400 - 144 = 256$. Raíz cuadrada = 16.',
    svg: UNIDAD3_8BASICO_SVGS.trianguloRectangulo('12 cm', '?', '20 cm'),
    grade: '8° Básico',
    topic: 'Teorema de Pitágoras: Cateto Faltante'
  },
  // 3. Escalera en Pared
  {
    id: '8b-u3-q3-d',
    text: 'Una escalera de 15 metros de largo se apoya contra una pared vertical. Si la base de la escalera está a 9 metros de la pared, ¿a qué altura de la pared llega la escalera?',
    options: ['6 metros', '10 metros', '12 metros', '144 metros'],
    correctAnswer: 2, // C
    explanation: 'Altura: $h = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12\\text{ metros}$.',
    hint: 'Calcula $\\sqrt{15^2 - 9^2} = \\sqrt{144} = 12$.',
    svg: UNIDAD3_8BASICO_SVGS.escaleraPared('15 m', '9 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Cotidiana: Escalera en Pared'
  },
  // 4. Cable de Sujeción
  {
    id: '8b-u3-q4-d',
    text: 'Un poste vertical de 30 metros de altura se sujeta con un cable tirante desde su parte superior hasta un punto en el suelo a 16 metros de la base. ¿Cuál es la longitud del cable?',
    options: ['34 metros', '46 metros', '40 metros', '1156 metros'],
    correctAnswer: 0, // A
    explanation: 'Longitud: $L = \\sqrt{30^2 + 16^2} = \\sqrt{900 + 256} = \\sqrt{1156} = 34\\text{ metros}$.',
    hint: 'Calcula $\\sqrt{30^2 + 16^2} = \\sqrt{1156} = 34$.',
    svg: UNIDAD3_8BASICO_SVGS.posteVentanal('30 m', '16 m', '?'),
    grade: '8° Básico',
    topic: 'Aplicación Técnica: Cable de Sujeción'
  },
  // 5. Tríos Pitagóricos
  {
    id: '8b-u3-q5-d',
    text: '¿Cuál de los siguientes grupos de medidas corresponde a los lados de un triángulo rectángulo?',
    options: ['10 cm, 12 cm, 15 cm', '15 cm, 20 cm, 25 cm', '12 cm, 14 cm, 18 cm', '8 cm, 10 cm, 14 cm'],
    correctAnswer: 1, // B
    explanation: '$15^2 + 20^2 = 225 + 400 = 625$, y $25^2 = 625$. Corresponde al trío pitagórico fundamental (3, 4, 5) multiplicado por 5.',
    hint: 'Verifica la relación $a^2 + b^2 = c^2$. Nota que $15, 20, 25$ es $5 \\times (3, 4, 5)$.',
    grade: '8° Básico',
    topic: 'Teorema Recíproco: Tríos Pitagóricos'
  },
  // 6. Diagonal Terreno
  {
    id: '8b-u3-q6-d',
    text: 'Un terreno rectangular mide 20 metros de largo y 15 metros de ancho. ¿Cuánto mide la diagonal de dicho terreno?',
    options: ['25 metros', '35 metros', '625 metros', '30 metros'],
    correctAnswer: 0, // A
    explanation: 'Diagonal: $D = \\sqrt{20^2 + 15^2} = \\sqrt{400 + 225} = \\sqrt{625} = 25\\text{ metros}$.',
    hint: 'Calcula $\\sqrt{20^2 + 15^2} = \\sqrt{625} = 25$.',
    svg: UNIDAD3_8BASICO_SVGS.terrenoDiagonal('20 m', '15 m', '?'),
    grade: '8° Básico',
    topic: 'Geometría Aplicada: Diagonal de Rectángulo'
  },
  // 7. Distancia entre Puntos
  {
    id: '8b-u3-q7-d',
    text: 'En el plano cartesiano, ¿cuál es la distancia entre los puntos A(4, 2) y B(16, 7)?',
    options: ['17 unidades', '13 unidades', '169 unidades', '15 unidades'],
    correctAnswer: 1, // B
    explanation: '$\\Delta x = 16 - 4 = 12$; $\\Delta y = 7 - 2 = 5$. Distancia: $d = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ unidades}$.',
    hint: '$\\Delta x = 12$, $\\Delta y = 5$. Hipotenusa = 13.',
    svg: UNIDAD3_8BASICO_SVGS.planoCartesiano('A(4,2)', 'B(16,7)', '?'),
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia entre Dos Puntos'
  },
  // 8. Distancia con Coordenadas Negativas
  {
    id: '8b-u3-q8-d',
    text: 'Un punto P se ubica en (-5, 1) y un punto Q en (7, 6). ¿Cuál es la distancia entre P y Q?',
    options: ['13 unidades', '17 unidades', '169 unidades', '15 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 7 - (-5) = 12$; $\\Delta y = 6 - 1 = 5$. Distancia: $d = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ unidades}$.',
    hint: '$7 - (-5) = 12$ y $6 - 1 = 5$. Distancia = 13.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Coordenadas Negativas'
  },
  // 9. Perímetro de Triángulo en el Plano
  {
    id: '8b-u3-q9-d',
    text: 'Un triángulo rectángulo en el plano cartesiano tiene sus vértices en K(0, 0), L(15, 0) y M(0, 20). ¿Cuál es el perímetro del triángulo KLM?',
    options: ['35 unidades', '60 unidades', '150 unidades', '50 unidades'],
    correctAnswer: 1, // B
    explanation: 'Catetos: 15 y 20. Hipotenusa: $\\sqrt{15^2 + 20^2} = 25$. Perímetro = $15 + 20 + 25 = 60\\text{ unidades}$.',
    hint: 'Hipotenusa = 25. Perímetro = $15 + 20 + 25 = 60$.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Perímetro de Triángulo'
  },
  // 10. Longitud de Segmento entre Cuadrantes
  {
    id: '8b-u3-q10-d',
    text: 'Calcula la distancia entre los puntos R(-4, -2) y S(8, 3) representados en el plano cartesiano.',
    options: ['13 unidades', '17 unidades', '15 unidades', '169 unidades'],
    correctAnswer: 0, // A
    explanation: '$\\Delta x = 8 - (-4) = 12$; $\\Delta y = 3 - (-2) = 5$. Distancia: $d = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ unidades}$.',
    hint: '$\\Delta x = 12$ y $\\Delta y = 5$. $\\sqrt{144 + 25} = 13$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Longitud de Segmento'
  },
  // 11. Área de Triángulo en el Plano
  {
    id: '8b-u3-q11-d',
    text: 'Los vértices de un triángulo rectángulo son A(4, 4), B(16, 4) y C(4, 9). ¿Cuál es el área de este triángulo?',
    options: ['60 u²', '30 u²', '17 u²', '25 u²'],
    correctAnswer: 1, // B
    explanation: 'Base: $16 - 4 = 12$. Altura: $9 - 4 = 5$. Área = $(12 \\cdot 5) / 2 = 30\\text{ u}^2$.',
    hint: 'Base = 12, Altura = 5. Área = $(12 \\times 5)/2 = 30$.',
    grade: '8° Básico',
    topic: 'Geometría Analítica: Área de Triángulo'
  },
  // 12. Distancia desde el Origen
  {
    id: '8b-u3-q12-d',
    text: 'En el plano cartesiano, ¿cuál es la distancia exacta desde el origen O(0, 0) al punto B(9, 12)?',
    options: ['21 unidades', '18 unidades', '15 unidades', '225 unidades'],
    correctAnswer: 2, // C
    explanation: 'Distancia al origen: $d = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ unidades}$.',
    hint: '$\\sqrt{9^2 + 12^2} = \\sqrt{225} = 15$.',
    grade: '8° Básico',
    topic: 'Plano Cartesiano: Distancia desde el Origen'
  },
  // 13. Volumen del Cubo
  {
    id: '8b-u3-q13-d',
    text: '¿Cuál es el volumen de un cubo cuya arista mide 8 cm?',
    options: ['64 cm³', '512 cm³', '384 cm³', '24 cm³'],
    correctAnswer: 1, // B
    explanation: 'Volumen: $V = 8^3 = 8 \\cdot 8 \\cdot 8 = 512\\text{ cm}^3$.',
    hint: 'Calcula $8^3 = 8 \\times 8 \\times 8$.',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('8 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Volumen del Cubo'
  },
  // 14. Área Total del Cubo
  {
    id: '8b-u3-q14-d',
    text: 'Calcula el área total de la superficie de un cubo de 6 cm de arista.',
    options: ['180 cm²', '216 cm²', '36 cm²', '144 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $6 \\cdot a^2 = 6 \\cdot 6^2 = 6 \\cdot 36 = 216\\text{ cm}^2$.',
    hint: 'Calcula $6 \\times 6^2 = 6 \\times 36 = 216$.',
    svg: UNIDAD3_8BASICO_SVGS.cubo3D('6 cm'),
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Área Total del Cubo'
  },
  // 15. Arista desde Volumen
  {
    id: '8b-u3-q15-d',
    text: 'El volumen de un depósito cúbico es de 729 cm³. ¿Cuánto mide cada una de sus aristas?',
    options: ['9 cm', '18 cm', '81 cm', '27 cm'],
    correctAnswer: 0, // A
    explanation: 'Arista: $a = \\sqrt[3]{729} = 9\\text{ cm}$, pues $9 \\cdot 9 \\cdot 9 = 729$.',
    hint: 'Busca el número que al cubo da 729 ($9^3 = 729$).',
    grade: '8° Básico',
    topic: 'Cuerpos Geométricos: Arista desde Volumen'
  },
  // 16. Forrar Cubo
  {
    id: '8b-u3-q16-d',
    text: 'Se desea forrar con papel de regalo una caja cúbica de 20 cm de arista. ¿Cuántos centímetros cuadrados de papel se necesitan como mínimo?',
    options: ['8000 cm²', '1600 cm²', '2400 cm²', '400 cm²'],
    correctAnswer: 2, // C
    explanation: 'Área total = $6 \\cdot 20^2 = 6 \\cdot 400 = 2400\\text{ cm}^2$.',
    hint: 'Calcula $6 \\times 20^2 = 6 \\times 400$.',
    grade: '8° Básico',
    topic: 'Problema Aplicado: Forrar Caja Cúbica'
  },
  // 17. Volumen Prisma Rectangular
  {
    id: '8b-u3-q17-d',
    text: 'Un prisma rectangular (paralelepípedo) tiene un largo de 15 cm, un ancho de 4 cm y una altura de 6 cm. ¿Cuál es su volumen?',
    options: ['360 cm³', '148 cm³', '240 cm³', '60 cm³'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $15 \\cdot 4 \\cdot 6 = 360\\text{ cm}^3$.',
    hint: 'Multiplica $15 \\times 4 \\times 6$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('15 cm', '4 cm', '6 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Volumen'
  },
  // 18. Área Superficial Caja Rectangular
  {
    id: '8b-u3-q18-d',
    text: 'Calcula el área total de la superficie de una caja rectangular de dimensiones 8 cm de largo, 5 cm de ancho y 4 cm de alto.',
    options: ['160 cm²', '184 cm²', '92 cm²', '200 cm²'],
    correctAnswer: 1, // B
    explanation: 'Área = $2(8 \\cdot 5 + 8 \\cdot 4 + 5 \\cdot 4) = 2(40 + 32 + 20) = 2(92) = 184\\text{ cm}^2$.',
    hint: 'Calcula $2 \\times (40 + 32 + 20) = 2 \\times 92$.',
    svg: UNIDAD3_8BASICO_SVGS.prismaRectangular('8 cm', '5 cm', '4 cm'),
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Área Superficial'
  },
  // 19. Altura Desconocida Prisma
  {
    id: '8b-u3-q19-d',
    text: 'El volumen de una caja rectangular es 450 cm³. Si la base tiene un largo de 15 cm y un ancho de 6 cm, ¿cuál es la altura de la caja?',
    options: ['5 cm', '10 cm', '8 cm', '12 cm'],
    correctAnswer: 0, // A
    explanation: 'Área basal: $15 \\cdot 6 = 90\\text{ cm}^2$. Altura: $h = 450 / 90 = 5\\text{ cm}$.',
    hint: 'Divide 450 por $(15 \\times 6 = 90)$.',
    grade: '8° Básico',
    topic: 'Prisma Rectangular: Altura Desconocida'
  },
  // 20. Capacidad en Litros
  {
    id: '8b-u3-q20-d',
    text: 'Un estanque rectangular de agua mide 5 m de largo, 3 m de ancho y 2 m de profundidad. Si 1 m³ equivale a 1.000 litros, ¿cuántos litros de agua puede contener al 100% de su capacidad?',
    options: ['30.000 litros', '35.000 litros', '3.000 litros', '15.000 litros'],
    correctAnswer: 0, // A
    explanation: 'Volumen = $5 \\cdot 3 \\cdot 2 = 30\\text{ m}^3$. Capacidad = $30 \\cdot 1.000 = 30.000\\text{ litros}$.',
    hint: 'Volumen en $m^3 = 5 \\times 3 \\times 2 = 30$. Multiplica por 1.000.',
    svg: UNIDAD3_8BASICO_SVGS.estanqueAgua('30.000 L'),
    grade: '8° Básico',
    topic: 'Aplicación Industrial: Capacidad en Litros'
  }
];

// =========================================================================
// 4 FORMAS VARIANTES PARALELAS TESTFORMVARIANT
// =========================================================================
export const DON_BOSCO_8BASICO_VARIANTS: TestFormVariantConfig[] = [
  {
    formCode: 'A',
    formLetter: 'A',
    label: 'Forma A Oficial',
    badgeColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    questions: DON_BOSCO_8BASICO_FORMA_A
  },
  {
    formCode: 'B',
    formLetter: 'B',
    label: 'Forma B Oficial',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    questions: DON_BOSCO_8BASICO_FORMA_B
  },
  {
    formCode: 'C',
    formLetter: 'C',
    label: 'Forma C Oficial',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    questions: DON_BOSCO_8BASICO_FORMA_C
  },
  {
    formCode: 'D',
    formLetter: 'D',
    label: 'Forma D Oficial',
    badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200',
    questions: DON_BOSCO_8BASICO_FORMA_D
  }
];

// =========================================================================
// MAPA MULTI-VARIANTE PARA ASIGNACIÓN EQUILIBRADA (A, B, C, D)
// =========================================================================
export const DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS: Question[] = DON_BOSCO_8BASICO_FORMA_A.map(
  (baseQ, idx) => ({
    ...baseQ,
    variants: {
      A: DON_BOSCO_8BASICO_FORMA_A[idx],
      B: DON_BOSCO_8BASICO_FORMA_B[idx],
      C: DON_BOSCO_8BASICO_FORMA_C[idx],
      D: DON_BOSCO_8BASICO_FORMA_D[idx],
    },
  })
);

// =========================================================================
// PRESET QUIZ OFICIAL PARA 8° BÁSICO UNIDAD 3
// =========================================================================
export const DON_BOSCO_8BASICO_UNIDAD3_PRESET: QuizPreset = {
  id: 'don-bosco-8basico-u3-official',
  title: 'Evaluación Sumativa: Pitágoras, Plano Cartesiano, Área y Volumen (8° Básico - Unidad 3)',
  grade: '8° Básico',
  topic: 'Unidad 3: Pitágoras, Plano Cartesiano, Área y Volumen (MA08 OA 11 • MA08 OA 12)',
  description:
    'Banco oficial Don Bosco de 20 preguntas con 4 variantes paralelas (Forma A, B, C y D). Total 80 reactivos alineados a las bases curriculares MINEDUC con apoyos visuales SVG y pauta completa.',
  questions: DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS,
  variants: DON_BOSCO_8BASICO_VARIANTS
};
