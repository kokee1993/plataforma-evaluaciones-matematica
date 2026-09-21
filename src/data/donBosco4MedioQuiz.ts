import { Question, QuizPreset, TestFormVariantConfig } from '../types';

// =========================================================================
// SVGs EDUCATIVOS VECTORIALES PARA FUNCIÓN POTENCIA 4° MEDIO
// =========================================================================
export const POTENCIA_4MEDIO_SVGS = {
  // P1: Parábola invertida f(x) = -a * x^4 (Cuadrantes III y IV)
  pregunta1: (a: number) => `
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <defs>
        <linearGradient id="gradP1_${a}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0.5"/>
        </linearGradient>
      </defs>
      <!-- Background & Grid -->
      <rect width="340" height="220" rx="14" fill="#0f172a"/>
      <line x1="20" y1="40" x2="320" y2="40" stroke="#334155" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="20" y1="120" x2="320" y2="120" stroke="#334155" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="20" y1="180" x2="320" y2="180" stroke="#334155" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="90" y1="20" x2="90" y2="200" stroke="#334155" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="250" y1="20" x2="250" y2="200" stroke="#334155" stroke-dasharray="3,3" stroke-width="1"/>

      <!-- Cartesian Axes -->
      <line x1="20" y1="60" x2="320" y2="60" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="320,60 312,56 312,64" fill="#94a3b8"/>
      <line x1="170" y1="200" x2="170" y2="20" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="170,20 166,28 174,28" fill="#94a3b8"/>
      
      <!-- Axis Labels -->
      <text x="315" y="52" fill="#cbd5e1" font-size="12" font-family="sans-serif" font-weight="bold">X</text>
      <text x="178" y="32" fill="#cbd5e1" font-size="12" font-family="sans-serif" font-weight="bold">Y</text>
      <text x="156" y="55" fill="#94a3b8" font-size="11" font-family="sans-serif">O(0,0)</text>

      <!-- Quadrant Markers -->
      <text x="270" y="45" fill="#64748b" font-size="10" font-weight="bold">I Cuad.</text>
      <text x="45" y="45" fill="#64748b" font-size="10" font-weight="bold">II Cuad.</text>
      <text x="45" y="190" fill="#f87171" font-size="11" font-weight="black">III Cuadrante (-,-)</text>
      <text x="215" y="190" fill="#f87171" font-size="11" font-weight="black">IV Cuadrante (+,-)</text>

      <!-- Curve f(x) = -a * x^4 -->
      <path d="M 80,195 Q 150,65 170,60 Q 190,65 260,195" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="170" cy="60" r="4.5" fill="#fbbf24" stroke="#f43f5e" stroke-width="2"/>

      <!-- Title & Formula -->
      <rect x="90" y="80" width="160" height="28" rx="8" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5"/>
      <text x="170" y="98" fill="#fecdd3" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">
        f(x) = -${a}x⁴ &lt; 0
      </text>
    </svg>
  `,

  // P2: Función Impar Negativa f(x) = a * x^-3 (Ramas en Cuadrantes I y III)
  pregunta2: (a: number) => `
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <!-- Background & Grid -->
      <rect width="340" height="220" rx="14" fill="#0f172a"/>
      <line x1="20" y1="110" x2="320" y2="110" stroke="#334155" stroke-width="1"/>
      <line x1="170" y1="20" x2="170" y2="200" stroke="#334155" stroke-width="1"/>

      <!-- Cartesian Axes -->
      <line x1="20" y1="110" x2="320" y2="110" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="320,110 312,106 312,114" fill="#94a3b8"/>
      <line x1="170" y1="200" x2="170" y2="20" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="170,20 166,28 174,28" fill="#94a3b8"/>
      
      <!-- Axis Labels -->
      <text x="315" y="102" fill="#cbd5e1" font-size="12" font-family="sans-serif" font-weight="bold">X</text>
      <text x="178" y="32" fill="#cbd5e1" font-size="12" font-family="sans-serif" font-weight="bold">Y</text>

      <!-- Quadrant Highlighting -->
      <rect x="170" y="20" width="150" height="90" fill="#3b82f6" fill-opacity="0.1" rx="4"/>
      <rect x="20" y="110" width="150" height="90" fill="#3b82f6" fill-opacity="0.1" rx="4"/>
      <text x="240" y="45" fill="#60a5fa" font-size="11" font-weight="black">Rama I (+,+)</text>
      <text x="45" y="185" fill="#60a5fa" font-size="11" font-weight="black">Rama III (-,-)</text>

      <!-- Branch 1 (Quadrant I) -->
      <path d="M 185,30 Q 192,90 310,105" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Branch 2 (Quadrant III) -->
      <path d="M 30,115 Q 148,130 155,190" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Asymptotes indication -->
      <line x1="170" y1="20" x2="170" y2="200" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="1.5"/>
      <line x1="20" y1="110" x2="320" y2="110" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="1.5"/>

      <!-- Label -->
      <rect x="85" y="12" width="170" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="170" y="29" fill="#e0f2fe" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">
        f(x) = ${a}·x⁻³ = ${a}/x³
      </text>
    </svg>
  `,

  // P3: Bomba centrífuga P(v) = a * v^3
  pregunta3: (watts: number, a: number) => `
    <svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <rect width="340" height="210" rx="14" fill="#0f172a"/>
      <!-- Machine Frame -->
      <circle cx="90" cy="110" r="50" fill="#1e293b" stroke="#6366f1" stroke-width="3"/>
      <circle cx="90" cy="110" r="30" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
      <circle cx="90" cy="110" r="10" fill="#fbbf24"/>
      <!-- Blades -->
      <line x1="90" y1="65" x2="90" y2="155" stroke="#a5b4fc" stroke-width="4" stroke-linecap="round"/>
      <line x1="45" y1="110" x2="135" y2="110" stroke="#a5b4fc" stroke-width="4" stroke-linecap="round"/>
      <text x="90" y="180" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">Bomba v = 2 RPM</text>

      <!-- Graph P(v) -->
      <line x1="170" y1="170" x2="310" y2="170" stroke="#94a3b8" stroke-width="2"/>
      <line x1="170" y1="170" x2="170" y2="40" stroke="#94a3b8" stroke-width="2"/>
      <text x="305" y="185" fill="#94a3b8" font-size="10">v (RPM)</text>
      <text x="165" y="32" fill="#94a3b8" font-size="10">P (W)</text>

      <!-- Curve P = a*v^3 -->
      <path d="M 170,170 Q 230,165 290,50" fill="none" stroke="#22c55e" stroke-width="3.5"/>
      <circle cx="230" cy="110" r="4.5" fill="#facc15" stroke="#15803d" stroke-width="2"/>
      <line x1="230" y1="170" x2="230" y2="110" stroke="#facc15" stroke-dasharray="2,2"/>
      <line x1="170" y1="110" x2="230" y2="110" stroke="#facc15" stroke-dasharray="2,2"/>

      <!-- Data box -->
      <rect x="175" y="65" width="130" height="38" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
      <text x="240" y="82" fill="#86efac" font-size="11" font-weight="black" text-anchor="middle">P(2) = ${watts} Watts</text>
      <text x="240" y="96" fill="#fef08a" font-size="10" font-mono font-weight="bold" text-anchor="middle">${watts} = a·(2³) ⇒ a = ${a}</text>
    </svg>
  `,

  // P4: Indeterminación f(x) = k / x^n
  pregunta4: (k: number, n: number) => `
    <svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <rect width="340" height="210" rx="14" fill="#0f172a"/>
      <!-- Grid -->
      <line x1="20" y1="110" x2="320" y2="110" stroke="#94a3b8" stroke-width="2"/>
      <line x1="170" y1="20" x2="170" y2="190" stroke="#94a3b8" stroke-width="2"/>

      <!-- Discontinuity Asymptote Line x=0 -->
      <line x1="170" y1="20" x2="170" y2="190" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,4"/>

      <!-- Hyperbolic branches in bottom half (k is negative) -->
      <path d="M 40,120 Q 150,125 162,190" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 300,120 Q 190,125 178,190" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Warning Badge at x = 0 -->
      <rect x="110" y="70" width="120" height="42" rx="8" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
      <text x="170" y="88" fill="#fecaca" font-size="11" font-weight="black" text-anchor="middle">⚠️ ASÍNTOTA EN x = 0</text>
      <text x="170" y="103" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">División por 0 indefinida</text>

      <!-- Formula -->
      <text x="170" y="45" fill="#e2e8f0" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">
        f(x) = ${k} / x${n === 4 ? '⁴' : '⁶'}
      </text>
    </svg>
  `,

  // P5: Estanque de Decantación Minera T(d) = a * d^-2
  pregunta5: (h: number, a: number, t4: string) => `
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <rect width="340" height="220" rx="14" fill="#0f172a"/>
      <!-- Tank Outline -->
      <path d="M 50,40 L 290,40 L 250,150 L 190,150 L 190,180 L 150,180 L 150,150 L 90,150 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <!-- Water Level -->
      <path d="M 60,65 L 280,65 L 246,145 L 94,145 Z" fill="#0284c7" fill-opacity="0.4"/>
      <text x="170" y="100" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">Estanque Minero de Decantación</text>

      <!-- Drain Valve -->
      <rect x="145" y="175" width="50" height="15" fill="#f59e0b" stroke="#d97706" stroke-width="2" rx="3"/>
      <text x="170" y="186" fill="#78350f" font-size="9" font-weight="black" text-anchor="middle">Válvula d</text>

      <!-- Formula & Result Cards -->
      <rect x="25" y="130" width="105" height="48" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.5"/>
      <text x="77" y="146" fill="#a5b4fc" font-size="9" font-weight="bold" text-anchor="middle">d = 2" ⇒ ${h} h</text>
      <text x="77" y="162" fill="#34d399" font-size="11" font-weight="black" text-anchor="middle">a = ${a}</text>

      <rect x="210" y="130" width="105" height="48" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
      <text x="262" y="146" fill="#6ee7b7" font-size="9" font-weight="bold" text-anchor="middle">d = 4" ⇒ Proyección</text>
      <text x="262" y="162" fill="#fbbf24" font-size="11" font-weight="black" text-anchor="middle">T(4) = ${t4} h</text>
    </svg>
  `,

  // P6: Parábola f(x) = -a * x^2 con Tabla
  pregunta6: (a: number) => `
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto drop-shadow-md">
      <rect width="340" height="220" rx="14" fill="#0f172a"/>
      <!-- Axes -->
      <line x1="20" y1="50" x2="320" y2="50" stroke="#94a3b8" stroke-width="2"/>
      <line x1="170" y1="20" x2="170" y2="200" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="320,50 312,46 312,54" fill="#94a3b8"/>
      <polygon points="170,20 166,28 174,28" fill="#94a3b8"/>

      <!-- Parabola f(x) = -a * x^2 -->
      <path d="M 70,185 Q 170,45 270,185" fill="none" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Symmetrical points -->
      <circle cx="170" cy="50" r="4.5" fill="#fbbf24" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="120" cy="85" r="4" fill="#c084fc"/>
      <circle cx="220" cy="85" r="4" fill="#c084fc"/>
      <circle cx="90" cy="140" r="4" fill="#e9d5ff"/>
      <circle cx="250" cy="140" r="4" fill="#e9d5ff"/>

      <text x="170" y="38" fill="#fde047" font-size="10" font-weight="black" text-anchor="middle">Vértice (0,0)</text>

      <!-- Function Tag -->
      <rect x="85" y="180" width="170" height="26" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>
      <text x="170" y="197" fill="#f3e8ff" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">
        f(x) = -${a === 1 ? '' : a}x² (Cóncava hacia abajo)
      </text>
    </svg>
  `
};

// =========================================================================
// BANCO DE PREGUNTAS: FORMA A (Variantes 1.1, 2.1, 3.1, 4.1, 5.1, 6.1)
// =========================================================================
export const DON_BOSCO_4MEDIO_FORMA_A: Question[] = [
  // Pregunta 1: Variante 1.1
  {
    id: '4m-pot-q1-a',
    text: 'En el taller de mecánica, se analiza el perfil de una pieza modelada por la función $f(x) = -5x^4$. ¿Cuál de las siguientes descripciones corresponde al comportamiento gráfico de esta función en el plano cartesiano?',
    options: [
      'La curva es una parábola que se abre hacia arriba y posee simetría respecto al eje X.',
      'Es una curva que pasa exclusivamente por el primer y tercer cuadrante.',
      'La curva es una parábola que se abre hacia abajo, ubicándose en el tercer y cuarto cuadrante, con vértice en el origen.',
      'Sus ramas se abren hacia abajo y posee asíntotas en los ejes coordenados.'
    ],
    correctAnswer: 2, // C
    explanation:
      'Al tener un exponente par ($n = 4$), $x^4 \\ge 0$ para todo número real. Al multiplicarse por el coeficiente negativo $a = -5$, los valores de $f(x)$ son siempre no positivos ($f(x) \\le 0$). La curva tiene simetría par respecto al eje Y, vértice en $(0,0)$ y se abre hacia abajo en los cuadrantes III y IV.',
    hint: 'Observa el signo del coeficiente numérico y la paridad del exponente: si el exponente es par ($n=4$) y el coeficiente es negativo ($a < 0$), los valores resultantes siempre son negativos o cero ($y \\le 0$). ¿En qué cuadrantes los valores de Y son negativos y qué forma toma la curva?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta1(5),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Par y Coeficiente Negativo'
  },

  // Pregunta 2: Variante 2.1
  {
    id: '4m-pot-q2-a',
    text: 'Dada la función potencia $f(x) = 3x^{-3}$, ¿en qué cuadrantes del plano cartesiano se ubican sus ramas principales considerando que no existen desplazamientos?',
    options: [
      'Primer y segundo cuadrante.',
      'Primer y tercer cuadrante.',
      'Segundo y cuarto cuadrante.',
      'Tercer y cuarto cuadrante.'
    ],
    correctAnswer: 1, // B
    explanation:
      'La función se reescribe como $f(x) = \\frac{3}{x^3}$. Para valores positivos ($x > 0$), $x^3 > 0$ por lo que $f(x) > 0$ (Cuadrante I: $x>0, y>0$). Para valores negativos ($x < 0$), $(-x)^3 < 0$, de modo que $f(x) < 0$ (Cuadrante III: $x<0, y<0$). Sus ramas se ubican en el 1° y 3° cuadrante con simetría central en el origen.',
    hint: 'Escribe la función con exponente positivo como una fracción: $f(x) = \\frac{a}{x^3}$. Aplica la regla de signos: si evalúas un número positivo, ¿qué signo tiene el resultado? Y si evalúas un número negativo elevado a potencia impar, ¿qué signo resulta?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta2(3),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Impar Negativo'
  },

  // Pregunta 3: Variante 3.1
  {
    id: '4m-pot-q3-a',
    text: 'En el mantenimiento de una bomba centrífuga de extracción, la potencia consumida $P$ (en Watts) se modela según la velocidad $v$ (en RPM) mediante la relación $P(v) = a \\cdot v^3$. Si los instrumentos miden un consumo de $16\\text{ Watts}$ cuando la bomba opera a $2\\text{ RPM}$, ¿cuál es el valor de la constante $a$ de esta máquina?',
    options: [
      'a = 8',
      'a = 4',
      'a = 2',
      'a = 0.5'
    ],
    correctAnswer: 2, // C: a = 2
    explanation:
      'Sustituimos los valores en la ecuación: $P(v) = a \\cdot v^3 \\implies 16 = a \\cdot 2^3$. Calculando la potencia: $2^3 = 8$. Luego despejamos $a$: $16 = 8a \\implies a = \\frac{16}{8} = 2$.',
    hint: 'Reemplaza los datos entregados directamente en la fórmula dada $P = a \\cdot v^3$: sustituye la potencia $P$ y la velocidad $v$. Calcula primero la potencia cúbica de la velocidad ($v^3$) y luego despeja la constante $a$ mediante división.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta3(16, 2),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico de Potencia'
  },

  // Pregunta 4: Variante 4.1
  {
    id: '4m-pot-q4-a',
    text: '¿Qué condición hace que la expresión $f(x) = -4 / x^6$ se indefina matemáticamente?',
    options: [
      'La variable x no puede tomar números negativos.',
      'La variable x no puede tomar el valor 0.',
      'La función solo está definida para x = -4.',
      'La variable x admite cualquier número real sin restricciones.'
    ],
    correctAnswer: 1, // B
    explanation:
      'En el conjunto de los números reales ($\\mathbb{R}$), la división por cero no está definida. Si $x = 0$, el denominador se hace $0^6 = 0$, generando una indeterminación (división por cero y asíntota vertical en $x = 0$).',
    hint: 'Recuerda las restricciones operacionales básicas en los números reales: una fracción algebraica pierde validez o se indefine únicamente cuando su divisor (denominador) toma el valor cero.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta4(-4, 6),
    grade: '4° Medio',
    topic: 'Restricción de Dominio e Indeterminación Matemática'
  },

  // Pregunta 5: Variante 5.1 (Desarrollo / Modelamiento)
  {
    id: '4m-pot-q5-a',
    text: 'El tiempo $T$ (en horas) necesario para vaciar un estanque de decantación en una faena minera varía según el diámetro $d$ (en pulgadas) de la válvula de purga utilizada, modelado por la función de decrecimiento $T(d) = a \\cdot d^{-2} = \\frac{a}{d^2}$. Se sabe por pruebas técnicas que, al utilizar una válvula de $2\\text{ pulgadas}$ de diámetro, el estanque tarda exactamente $10\\text{ horas}$ en vaciarse por completo.\n\n• A) Determina algebraicamente el valor de la constante de proporcionalidad $a$.\n• B) Utilizando el modelo completo y dado el valor de la constante $a$, proyecta cuánto tiempo tardará en vaciarse el mismo estanque si se instala una válvula de $4\\text{ pulgadas}$.',
    options: [
      'A) a = 40  |  B) T(4) = 2,5 horas',
      'A) a = 20  |  B) T(4) = 5,0 horas',
      'A) a = 10  |  B) T(4) = 0,625 horas',
      'A) a = 80  |  B) T(4) = 10,0 horas'
    ],
    correctAnswer: 0, // A
    explanation:
      'Desarrollo oficial pauta:\nA) Para $d = 2\\text{ in}$ y $T = 10\\text{ h}$: $10 = \\frac{a}{2^2} \\implies 10 = \\frac{a}{4} \\implies a = 10 \\cdot 4 = 40$.\nB) Con $a = 40$ y $d = 4\\text{ in}$: $T(4) = \\frac{40}{4^2} = \\frac{40}{16} = 2,5\\text{ horas}$.',
    hint: 'Expresa la función como $T(d) = \\frac{a}{d^2}$. Para la parte A, sustituye $d = 2$ y el tiempo inicial dado para despejar $a$ multiplicando. Para la parte B, toma ese valor de $a$ y calcula $T(4) = \\frac{a}{4^2} = \\frac{a}{16}$.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta5(10, 40, '2,5'),
    grade: '4° Medio',
    topic: 'Modelamiento Industrial y Proyección de Tiempos'
  },

  // Pregunta 6: Variante 6.1 (Desarrollo / Análisis Gráfico y Tabla)
  {
    id: '4m-pot-q6-a',
    text: 'Dada la función potencia $f(x) = -3x^2$:\n\n• A) Completa los valores de la función para el conjunto: $x \\in \\{-2;\\ -1,5;\\ -1;\\ -0,5;\\ 0;\\ 0,5;\\ 1;\\ 1,5;\\ 2\\}$.\n• B) Realiza el análisis del gráfico cartesiano (orientación, vértice y cuadrantes donde se ubica).',
    options: [
      'Tabla: f(0)=0; f(±0,5)=-0,75; f(±1)=-3; f(±1,5)=-6,75; f(±2)=-12. Parábola cóncava hacia abajo con vértice en (0,0).',
      'Tabla: f(0)=0; f(±0,5)=0,75; f(±1)=3; f(±1,5)=6,75; f(±2)=12. Parábola cóncava hacia arriba con vértice en (0,0).',
      'Tabla: f(0)=-3; f(1)=0; f(2)=3. Recta lineal con pendiente constante.',
      'Tabla: f(0)=0; f(±1)=-6; f(±2)=-24. Parábola con dilatación incorrecta.'
    ],
    correctAnswer: 0, // A
    explanation:
      'Pauta oficial de valores exactos:\n• x = 0: f(0) = -3(0)² = 0\n• x = ±0,5: f(±0,5) = -3(0,25) = -0,75\n• x = ±1: f(±1) = -3(1) = -3\n• x = ±1,5: f(±1,5) = -3(2,25) = -6,75\n• x = ±2: f(±2) = -3(4) = -12\nDebido a la simetría par $f(-x) = f(x)$, los valores coinciden para signos opuestos. Al ser $a = -3 < 0$, la curva es cóncava hacia abajo con vértice en el origen $(0,0)$.',
    hint: 'Para evaluar cada punto, eleva primero el valor de $x$ al cuadrado (recuerda que cualquier número al cuadrado es positivo o cero) y luego multiplícalo por el coeficiente negativo. Debido a la simetría de la función par, los valores de $+x$ y $-x$ son siempre iguales.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta6(3),
    grade: '4° Medio',
    topic: 'Análisis Gráfico y Tabla de Valores Cuadrática'
  }
];

// =========================================================================
// BANCO DE PREGUNTAS: FORMA B (Variantes 1.2, 2.2, 3.2, 4.2, 5.2, 6.2)
// =========================================================================
export const DON_BOSCO_4MEDIO_FORMA_B: Question[] = [
  // Pregunta 1: Variante 1.2
  {
    id: '4m-pot-q1-b',
    text: 'En el taller de mecánica, se analiza el perfil de una pieza modelada por la función $f(x) = -3x^4$. ¿Cuál de las siguientes descripciones corresponde al comportamiento gráfico de esta función en el plano cartesiano?',
    options: [
      'La curva es una parábola que se abre hacia arriba y posee simetría respecto al eje X.',
      'Es una curva que pasa exclusivamente por el primer y tercer cuadrante.',
      'La curva es una parábola que se abre hacia abajo, ubicándose en el tercer y cuarto cuadrante, con vértice en el origen.',
      'Sus ramas se abren hacia abajo y posee asíntotas en los ejes coordenados.'
    ],
    correctAnswer: 2, // C
    explanation:
      'Al tener un exponente par ($n = 4$) y coeficiente negativo $a = -3$, para todo $x \\neq 0$ se cumple que $f(x) < 0$. La gráfica es una curva de tipo parabólico simétrica respecto al eje Y, con vértice en el origen $(0,0)$ y abierta hacia abajo en los cuadrantes III y IV.',
    hint: 'Observa el signo del coeficiente numérico y la paridad del exponente: si el exponente es par ($n=4$) y el coeficiente es negativo ($a < 0$), los valores resultantes siempre son negativos o cero ($y \\le 0$). ¿En qué cuadrantes los valores de Y son negativos y qué forma toma la curva?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta1(3),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Par y Coeficiente Negativo'
  },

  // Pregunta 2: Variante 2.2
  {
    id: '4m-pot-q2-b',
    text: 'Dada la función potencia $f(x) = 5x^{-3}$, ¿en qué cuadrantes del plano cartesiano se ubican sus ramas principales considerando que no existen desplazamientos?',
    options: [
      'Primer y segundo cuadrante.',
      'Primer y tercer cuadrante.',
      'Segundo y cuarto cuadrante.',
      'Tercer y cuarto cuadrante.'
    ],
    correctAnswer: 1, // B
    explanation:
      'Reescribiendo como $f(x) = \\frac{5}{x^3}$: si $x > 0$, el denominador es positivo, por lo que $f(x) > 0$ (Cuadrante I). Si $x < 0$, un número negativo al cubo es negativo, resultando $f(x) < 0$ (Cuadrante III). Sus ramas se ubican en el primer y tercer cuadrante.',
    hint: 'Escribe la función con exponente positivo como una fracción: $f(x) = \\frac{a}{x^3}$. Aplica la regla de signos: si evalúas un número positivo, ¿qué signo tiene el resultado? Y si evalúas un número negativo elevado a potencia impar, ¿qué signo resulta?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta2(5),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Impar Negativo'
  },

  // Pregunta 3: Variante 3.2
  {
    id: '4m-pot-q3-b',
    text: 'En el mantenimiento de una bomba centrífuga de extracción, la potencia consumida $P$ (en Watts) se modela según la velocidad $v$ (en RPM) mediante la relación $P(v) = a \\cdot v^3$. Si los instrumentos miden un consumo de $24\\text{ Watts}$ cuando la bomba opera a $2\\text{ RPM}$, ¿cuál es el valor de la constante $a$ de esta máquina?',
    options: [
      'a = 12',
      'a = 6',
      'a = 3',
      'a = 0.33'
    ],
    correctAnswer: 2, // C: a = 3
    explanation:
      'Sustituimos en el modelo: $P(v) = a \\cdot v^3 \\implies 24 = a \\cdot 2^3$. Como $2^3 = 8$, tenemos $24 = 8a \\implies a = \\frac{24}{8} = 3$.',
    hint: 'Reemplaza los datos entregados directamente en la fórmula dada $P = a \\cdot v^3$: sustituye la potencia $P$ y la velocidad $v$. Calcula primero la potencia cúbica de la velocidad ($v^3$) y luego despeja la constante $a$ mediante división.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta3(24, 3),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico de Potencia'
  },

  // Pregunta 4: Variante 4.2
  {
    id: '4m-pot-q4-b',
    text: '¿Qué condición hace que la expresión $f(x) = -3 / x^4$ se indefina matemáticamente?',
    options: [
      'La variable x no puede tomar números negativos.',
      'La variable x no puede tomar el valor 0.',
      'La función solo está definida para x = -3.',
      'La variable x admite cualquier número real sin restricciones.'
    ],
    correctAnswer: 1, // B
    explanation:
      'La división por cero no existe en $\\mathbb{R}$. Si $x = 0$, el denominador es $0^4 = 0$, provocando que la función se indefina.',
    hint: 'Recuerda las restricciones operacionales básicas en los números reales: una fracción algebraica pierde validez o se indefine únicamente cuando su divisor (denominador) toma el valor cero.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta4(-3, 4),
    grade: '4° Medio',
    topic: 'Restricción de Dominio e Indeterminación Matemática'
  },

  // Pregunta 5: Variante 5.2 (Desarrollo / Modelamiento)
  {
    id: '4m-pot-q5-b',
    text: 'El tiempo $T$ (en horas) necesario para vaciar un estanque de decantación en una faena minera varía según el diámetro $d$ (en pulgadas) de la válvula de purga utilizada, modelado por la función de decrecimiento $T(d) = a \\cdot d^{-2} = \\frac{a}{d^2}$. Se sabe por pruebas técnicas que, al utilizar una válvula de $2\\text{ pulgadas}$ de diámetro, el estanque tarda exactamente $12\\text{ horas}$ en vaciarse por completo.\n\n• A) Determina algebraicamente el valor de la constante de proporcionalidad $a$.\n• B) Utilizando el modelo completo y dado el valor de la constante $a$, proyecta cuánto tiempo tardará en vaciarse el mismo estanque si se instala una válvula de $4\\text{ pulgadas}$.',
    options: [
      'A) a = 48  |  B) T(4) = 3,0 horas',
      'A) a = 24  |  B) T(4) = 6,0 horas',
      'A) a = 12  |  B) T(4) = 1,5 horas',
      'A) a = 96  |  B) T(4) = 12,0 horas'
    ],
    correctAnswer: 0, // A
    explanation:
      'Desarrollo oficial pauta:\nA) Para $d = 2\\text{ in}$ y $T = 12\\text{ h}$: $12 = \\frac{a}{2^2} \\implies 12 = \\frac{a}{4} \\implies a = 12 \\cdot 4 = 48$.\nB) Con $a = 48$ y $d = 4\\text{ in}$: $T(4) = \\frac{48}{4^2} = \\frac{48}{16} = 3,0\\text{ horas}$.',
    hint: 'Expresa la función como $T(d) = \\frac{a}{d^2}$. Para la parte A, sustituye $d = 2$ y el tiempo inicial dado para despejar $a$ multiplicando. Para la parte B, toma ese valor de $a$ y calcula $T(4) = \\frac{a}{4^2} = \\frac{a}{16}$.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta5(12, 48, '3,0'),
    grade: '4° Medio',
    topic: 'Modelamiento Industrial y Proyección de Tiempos'
  },

  // Pregunta 6: Variante 6.2 (Desarrollo / Análisis Gráfico y Tabla)
  {
    id: '4m-pot-q6-b',
    text: 'Dada la función potencia $f(x) = -2x^2$:\n\n• A) Completa los valores de la función para el conjunto: $x \\in \\{-2;\\ -1,5;\\ -1;\\ -0,5;\\ 0;\\ 0,5;\\ 1;\\ 1,5;\\ 2\\}$.\n• B) Realiza el análisis del gráfico cartesiano (orientación, vértice y cuadrantes donde se ubica).',
    options: [
      'Tabla: f(0)=0; f(±0,5)=-0,5; f(±1)=-2; f(±1,5)=-4,5; f(±2)=-8. Parábola cóncava hacia abajo con vértice en (0,0).',
      'Tabla: f(0)=0; f(±0,5)=0,5; f(±1)=2; f(±1,5)=4,5; f(±2)=8. Parábola cóncava hacia arriba con vértice en (0,0).',
      'Tabla: f(0)=-2; f(1)=0; f(2)=2. Línea recta.',
      'Tabla: f(0)=0; f(±1)=-4; f(±2)=-16. Parábola con cálculo inexacto.'
    ],
    correctAnswer: 0, // A
    explanation:
      'Pauta oficial de valores exactos:\n• x = 0: f(0) = -2(0) = 0\n• x = ±0,5: f(±0,5) = -2(0,25) = -0,5\n• x = ±1: f(±1) = -2(1) = -2\n• x = ±1,5: f(±1,5) = -2(2,25) = -4,5\n• x = ±2: f(±2) = -2(4) = -8\nLa gráfica es una parábola invertida (abierta hacia abajo) con vértice en $(0,0)$ y simetría respecto al eje Y.',
    hint: 'Para evaluar cada punto, eleva primero el valor de $x$ al cuadrado (recuerda que cualquier número al cuadrado es positivo o cero) y luego multiplícalo por el coeficiente negativo. Debido a la simetría de la función par, los valores de $+x$ y $-x$ son siempre iguales.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta6(2),
    grade: '4° Medio',
    topic: 'Análisis Gráfico y Tabla de Valores Cuadrática'
  }
];

// =========================================================================
// BANCO DE PREGUNTAS: FORMA C (Variantes 1.3, 2.3, 3.3, 4.3, 5.3, 6.3)
// =========================================================================
export const DON_BOSCO_4MEDIO_FORMA_C: Question[] = [
  // Pregunta 1: Variante 1.3
  {
    id: '4m-pot-q1-c',
    text: 'En el taller de mecánica, se analiza el perfil de una pieza modelada por la función $f(x) = -4x^4$. ¿Cuál de las siguientes descripciones corresponde al comportamiento gráfico de esta función en el plano cartesiano?',
    options: [
      'La curva es una parábola que se abre hacia arriba y posee simetría respecto al eje X.',
      'Es una curva que pasa exclusivamente por el primer y tercer cuadrante.',
      'La curva es una parábola que se abre hacia abajo, ubicándose en el tercer y cuarto cuadrante, con vértice en el origen.',
      'Sus ramas se abren hacia abajo y posee asíntotas en los ejes coordenados.'
    ],
    correctAnswer: 2, // C
    explanation:
      'Con exponente par ($n=4$) y coeficiente negativo $a=-4$, la función toma exclusivamente valores negativos o cero ($y \\le 0$). La curva se abre hacia abajo en los cuadrantes III y IV con vértice en $(0,0)$.',
    hint: 'Observa el signo del coeficiente numérico y la paridad del exponente: si el exponente es par ($n=4$) y el coeficiente es negativo ($a < 0$), los valores resultantes siempre son negativos o cero ($y \\le 0$). ¿En qué cuadrantes los valores de Y son negativos y qué forma toma la curva?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta1(4),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Par y Coeficiente Negativo'
  },

  // Pregunta 2: Variante 2.3
  {
    id: '4m-pot-q2-c',
    text: 'Dada la función potencia $f(x) = 2x^{-3}$, ¿en qué cuadrantes del plano cartesiano se ubican sus ramas principales considerando que no existen desplazamientos?',
    options: [
      'Primer y segundo cuadrante.',
      'Primer y tercer cuadrante.',
      'Segundo y cuarto cuadrante.',
      'Tercer y cuarto cuadrante.'
    ],
    correctAnswer: 1, // B
    explanation:
      'La función es $f(x) = \\frac{2}{x^3}$. Para $x > 0$, $y > 0$ (Cuadrante I). Para $x < 0$, $y < 0$ (Cuadrante III). Por lo tanto, se ubica en el primer y tercer cuadrante.',
    hint: 'Escribe la función con exponente positivo como una fracción: $f(x) = \\frac{a}{x^3}$. Aplica la regla de signos: si evalúas un número positivo, ¿qué signo tiene el resultado? Y si evalúas un número negativo elevado a potencia impar, ¿qué signo resulta?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta2(2),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Impar Negativo'
  },

  // Pregunta 3: Variante 3.3
  {
    id: '4m-pot-q3-c',
    text: 'En el mantenimiento de una bomba centrífuga de extracción, la potencia consumida $P$ (en Watts) se modela según la velocidad $v$ (en RPM) mediante la relación $P(v) = a \\cdot v^3$. Si los instrumentos miden un consumo de $32\\text{ Watts}$ cuando la bomba opera a $2\\text{ RPM}$, ¿cuál es el valor de la constante $a$ de esta máquina?',
    options: [
      'a = 16',
      'a = 8',
      'a = 4',
      'a = 0.25'
    ],
    correctAnswer: 2, // C: a = 4
    explanation:
      'Sustituimos los datos: $32 = a \\cdot 2^3 \\implies 32 = a \\cdot 8 \\implies a = \\frac{32}{8} = 4$.',
    hint: 'Reemplaza los datos entregados directamente en la fórmula dada $P = a \\cdot v^3$: sustituye la potencia $P$ y la velocidad $v$. Calcula primero la potencia cúbica de la velocidad ($v^3$) y luego despeja la constante $a$ mediante división.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta3(32, 4),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico de Potencia'
  },

  // Pregunta 4: Variante 4.3
  {
    id: '4m-pot-q4-c',
    text: '¿Qué condición hace que la expresión $f(x) = -5 / x^6$ se indefina matemáticamente?',
    options: [
      'La variable x no puede tomar números negativos.',
      'La variable x no puede tomar el valor 0.',
      'La función solo está definida para x = -5.',
      'La variable x admite cualquier número real sin restricciones.'
    ],
    correctAnswer: 1, // B
    explanation:
      'Una fracción en $\\mathbb{R}$ no está definida cuando su denominador se anula. En $f(x) = -5 / x^6$, el valor $x = 0$ genera indeterminación por división por cero.',
    hint: 'Recuerda las restricciones operacionales básicas en los números reales: una fracción algebraica pierde validez o se indefine únicamente cuando su divisor (denominador) toma el valor cero.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta4(-5, 6),
    grade: '4° Medio',
    topic: 'Restricción de Dominio e Indeterminación Matemática'
  },

  // Pregunta 5: Variante 5.3 (Desarrollo / Modelamiento)
  {
    id: '4m-pot-q5-c',
    text: 'El tiempo $T$ (en horas) necesario para vaciar un estanque de decantación en una faena minera varía según el diámetro $d$ (en pulgadas) de la válvula de purga utilizada, modelado por la función de decrecimiento $T(d) = a \\cdot d^{-2} = \\frac{a}{d^2}$. Se sabe por pruebas técnicas que, al utilizar una válvula de $2\\text{ pulgadas}$ de diámetro, el estanque tarda exactamente $16\\text{ horas}$ en vaciarse por completo.\n\n• A) Determina algebraicamente el valor de la constante de proporcionalidad $a$.\n• B) Utilizando el modelo completo y dado el valor de la constante $a$, proyecta cuánto tiempo tardará en vaciarse el mismo estanque si se instala una válvula de $4\\text{ pulgadas}$.',
    options: [
      'A) a = 64  |  B) T(4) = 4,0 horas',
      'A) a = 32  |  B) T(4) = 8,0 horas',
      'A) a = 16  |  B) T(4) = 2,0 horas',
      'A) a = 128  |  B) T(4) = 16,0 horas'
    ],
    correctAnswer: 0, // A
    explanation:
      'Desarrollo oficial pauta:\nA) Para $d = 2\\text{ in}$ y $T = 16\\text{ h}$: $16 = \\frac{a}{2^2} \\implies 16 = \\frac{a}{4} \\implies a = 16 \\cdot 4 = 64$.\nB) Con $a = 64$ y $d = 4\\text{ in}$: $T(4) = \\frac{64}{4^2} = \\frac{64}{16} = 4,0\\text{ horas}$.',
    hint: 'Expresa la función como $T(d) = \\frac{a}{d^2}$. Para la parte A, sustituye $d = 2$ y el tiempo inicial dado para despejar $a$ multiplicando. Para la parte B, toma ese valor de $a$ y calcula $T(4) = \\frac{a}{4^2} = \\frac{a}{16}$.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta5(16, 64, '4,0'),
    grade: '4° Medio',
    topic: 'Modelamiento Industrial y Proyección de Tiempos'
  },

  // Pregunta 6: Variante 6.3 (Desarrollo / Análisis Gráfico y Tabla)
  {
    id: '4m-pot-q6-c',
    text: 'Dada la función potencia $f(x) = -4x^2$:\n\n• A) Completa los valores de la función para el conjunto: $x \\in \\{-2;\\ -1,5;\\ -1;\\ -0,5;\\ 0;\\ 0,5;\\ 1;\\ 1,5;\\ 2\\}$.\n• B) Realiza el análisis del gráfico cartesiano (orientación, vértice y cuadrantes donde se ubica).',
    options: [
      'Tabla: f(0)=0; f(±0,5)=-1; f(±1)=-4; f(±1,5)=-9; f(±2)=-16. Parábola cóncava hacia abajo con vértice en (0,0).',
      'Tabla: f(0)=0; f(±0,5)=1; f(±1)=4; f(±1,5)=9; f(±2)=16. Parábola cóncava hacia arriba con vértice en (0,0).',
      'Tabla: f(0)=-4; f(1)=0; f(2)=4. Línea recta.',
      'Tabla: f(0)=0; f(±1)=-8; f(±2)=-32. Parábola incorrecta.'
    ],
    correctAnswer: 0, // A
    explanation:
      'Pauta oficial de valores exactos:\n• x = 0: f(0) = -4(0) = 0\n• x = ±0,5: f(±0,5) = -4(0,25) = -1\n• x = ±1: f(±1) = -4(1) = -4\n• x = ±1,5: f(±1,5) = -4(2,25) = -9\n• x = ±2: f(±2) = -4(4) = -16\nLa gráfica es una parábola invertida orientada hacia abajo en los cuadrantes III y IV con vértice en el origen $(0,0)$.',
    hint: 'Para evaluar cada punto, eleva primero el valor de $x$ al cuadrado (recuerda que cualquier número al cuadrado es positivo o cero) y luego multiplícalo por el coeficiente negativo. Debido a la simetría de la función par, los valores de $+x$ y $-x$ son siempre iguales.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta6(4),
    grade: '4° Medio',
    topic: 'Análisis Gráfico y Tabla de Valores Cuadrática'
  }
];

// =========================================================================
// BANCO DE PREGUNTAS: FORMA D (Variantes 1.4, 2.4, 3.4, 4.4, 5.4, 6.4)
// =========================================================================
export const DON_BOSCO_4MEDIO_FORMA_D: Question[] = [
  // Pregunta 1: Variante 1.4
  {
    id: '4m-pot-q1-d',
    text: 'En el taller de mecánica, se analiza el perfil de una pieza modelada por la función $f(x) = -2x^4$. ¿Cuál de las siguientes descripciones corresponde al comportamiento gráfico de esta función en el plano cartesiano?',
    options: [
      'La curva es una parábola que se abre hacia arriba y posee simetría respecto al eje X.',
      'Es una curva que pasa exclusivamente por el primer y tercer cuadrante.',
      'La curva es una parábola que se abre hacia abajo, ubicándose en el tercer y cuarto cuadrante, con vértice en el origen.',
      'Sus ramas se abren hacia abajo y posee asíntotas en los ejes coordenados.'
    ],
    correctAnswer: 2, // C
    explanation:
      'Al tener un exponente par ($n = 4$) y coeficiente negativo $a = -2$, todos los valores resultantes de $f(x)$ son no positivos ($f(x) \\le 0$). La curva tiene forma parabólica invertida, ubicándose en los cuadrantes III y IV con vértice en el origen $(0,0)$.',
    hint: 'Observa el signo del coeficiente numérico y la paridad del exponente: si el exponente es par ($n=4$) y el coeficiente es negativo ($a < 0$), los valores resultantes siempre son negativos o cero ($y \\le 0$). ¿En qué cuadrantes los valores de Y son negativos y qué forma toma la curva?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta1(2),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Par y Coeficiente Negativo'
  },

  // Pregunta 2: Variante 2.4
  {
    id: '4m-pot-q2-d',
    text: 'Dada la función potencia $f(x) = 4x^{-3}$, ¿en qué cuadrantes del plano cartesiano se ubican sus ramas principales considerando que no existen desplazamientos?',
    options: [
      'Primer y segundo cuadrante.',
      'Primer y tercer cuadrante.',
      'Segundo y cuarto cuadrante.',
      'Tercer y cuarto cuadrante.'
    ],
    correctAnswer: 1, // B
    explanation:
      'Reescribiendo como $f(x) = \\frac{4}{x^3}$: para $x > 0$, $y > 0$ (Cuadrante I). Para $x < 0$, $y < 0$ (Cuadrante III). Las ramas principales se ubican en el primer y tercer cuadrante.',
    hint: 'Escribe la función con exponente positivo como una fracción: $f(x) = \\frac{a}{x^3}$. Aplica la regla de signos: si evalúas un número positivo, ¿qué signo tiene el resultado? Y si evalúas un número negativo elevado a potencia impar, ¿qué signo resulta?',
    svg: POTENCIA_4MEDIO_SVGS.pregunta2(4),
    grade: '4° Medio',
    topic: 'Función Potencia: Exponente Impar Negativo'
  },

  // Pregunta 3: Variante 3.4
  {
    id: '4m-pot-q3-d',
    text: 'En el mantenimiento de una bomba centrífuga de extracción, la potencia consumida $P$ (en Watts) se modela según la velocidad $v$ (en RPM) mediante la relación $P(v) = a \\cdot v^3$. Si los instrumentos miden un consumo de $40\\text{ Watts}$ cuando la bomba opera a $2\\text{ RPM}$, ¿cuál es el valor de la constante $a$ de esta máquina?',
    options: [
      'a = 20',
      'a = 10',
      'a = 5',
      'a = 0.2'
    ],
    correctAnswer: 2, // C: a = 5
    explanation:
      'Sustituimos: $40 = a \\cdot 2^3 \\implies 40 = a \\cdot 8 \\implies a = \\frac{40}{8} = 5$.',
    hint: 'Reemplaza los datos entregados directamente en la fórmula dada $P = a \\cdot v^3$: sustituye la potencia $P$ y la velocidad $v$. Calcula primero la potencia cúbica de la velocidad ($v^3$) y luego despeja la constante $a$ mediante división.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta3(40, 5),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico de Potencia'
  },

  // Pregunta 4: Variante 4.4
  {
    id: '4m-pot-q4-d',
    text: '¿Qué condición hace que la expresión $f(x) = -2 / x^4$ se indefina matemáticamente?',
    options: [
      'La variable x no puede tomar números negativos.',
      'La variable x no puede tomar el valor 0.',
      'La función solo está definida para x = -2.',
      'La variable x admite cualquier número real sin restricciones.'
    ],
    correctAnswer: 1, // B
    explanation:
      'La división por cero no está definida en los números reales. Cuando $x = 0$, la expresión $-2 / 0^4$ no existe en $\\mathbb{R}$.',
    hint: 'Recuerda las restricciones operacionales básicas en los números reales: una fracción algebraica pierde validez o se indefine únicamente cuando su divisor (denominador) toma el valor cero.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta4(-2, 4),
    grade: '4° Medio',
    topic: 'Restricción de Dominio e Indeterminación Matemática'
  },

  // Pregunta 5: Variante 5.4 (Desarrollo / Modelamiento)
  {
    id: '4m-pot-q5-d',
    text: 'El tiempo $T$ (en horas) necesario para vaciar un estanque de decantación en una faena minera varía según el diámetro $d$ (en pulgadas) de la válvula de purga utilizada, modelado por la función de decrecimiento $T(d) = a \\cdot d^{-2} = \\frac{a}{d^2}$. Se sabe por pruebas técnicas que, al utilizar una válvula de $2\\text{ pulgadas}$ de diámetro, el estanque tarda exactamente $8\\text{ horas}$ en vaciarse por completo.\n\n• A) Determina algebraicamente el valor de la constante de proporcionalidad $a$.\n• B) Utilizando el modelo completo y dado el valor de la constante $a$, proyecta cuánto tiempo tardará en vaciarse el mismo estanque si se instala una válvula de $4\\text{ pulgadas}$.',
    options: [
      'A) a = 32  |  B) T(4) = 2,0 horas',
      'A) a = 16  |  B) T(4) = 4,0 horas',
      'A) a = 8   |  B) T(4) = 1,0 horas',
      'A) a = 64  |  B) T(4) = 8,0 horas'
    ],
    correctAnswer: 0, // A
    explanation:
      'Desarrollo oficial pauta:\nA) Para $d = 2\\text{ in}$ y $T = 8\\text{ h}$: $8 = \\frac{a}{2^2} \\implies 8 = \\frac{a}{4} \\implies a = 8 \\cdot 4 = 32$.\nB) Con $a = 32$ y $d = 4\\text{ in}$: $T(4) = \\frac{32}{4^2} = \\frac{32}{16} = 2,0\\text{ horas}$.',
    hint: 'Expresa la función como $T(d) = \\frac{a}{d^2}$. Para la parte A, sustituye $d = 2$ y el tiempo inicial dado para despejar $a$ multiplicando. Para la parte B, toma ese valor de $a$ y calcula $T(4) = \\frac{a}{4^2} = \\frac{a}{16}$.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta5(8, 32, '2,0'),
    grade: '4° Medio',
    topic: 'Modelamiento Industrial y Proyección de Tiempos'
  },

  // Pregunta 6: Variante 6.4 (Desarrollo / Análisis Gráfico y Tabla)
  {
    id: '4m-pot-q6-d',
    text: 'Dada la función potencia $f(x) = -x^2$:\n\n• A) Completa los valores de la función para el conjunto: $x \\in \\{-2;\\ -1,5;\\ -1;\\ -0,5;\\ 0;\\ 0,5;\\ 1;\\ 1,5;\\ 2\\}$.\n• B) Realiza el análisis del gráfico cartesiano (orientación, vértice y cuadrantes donde se ubica).',
    options: [
      'Tabla: f(0)=0; f(±0,5)=-0,25; f(±1)=-1; f(±1,5)=-2,25; f(±2)=-4. Parábola cóncava hacia abajo con vértice en (0,0).',
      'Tabla: f(0)=0; f(±0,5)=0,25; f(±1)=1; f(±1,5)=2,25; f(±2)=4. Parábola cóncava hacia arriba con vértice en (0,0).',
      'Tabla: f(0)=-1; f(1)=0; f(2)=1. Línea recta.',
      'Tabla: f(0)=0; f(±1)=-2; f(±2)=-8. Parábola incorrecta.'
    ],
    correctAnswer: 0, // A
    explanation:
      'Pauta oficial de valores exactos:\n• x = 0: f(0) = -(0) = 0\n• x = ±0,5: f(±0,5) = -(0,25) = -0,25\n• x = ±1: f(±1) = -(1) = -1\n• x = ±1,5: f(±1,5) = -(2,25) = -2,25\n• x = ±2: f(±2) = -(4) = -4\nLa gráfica es la parábola canónica invertida con vértice en $(0,0)$, cóncava hacia abajo y simétrica respecto al eje Y.',
    hint: 'Para evaluar cada punto, eleva primero el valor de $x$ al cuadrado (recuerda que cualquier número al cuadrado es positivo o cero) y luego multiplícalo por el coeficiente negativo. Debido a la simetría de la función par, los valores de $+x$ y $-x$ son siempre iguales.',
    svg: POTENCIA_4MEDIO_SVGS.pregunta6(1),
    grade: '4° Medio',
    topic: 'Análisis Gráfico y Tabla de Valores Cuadrática'
  }
];

import {
  EXTENSION_FORMA_A,
  EXTENSION_FORMA_B,
  EXTENSION_FORMA_C,
  EXTENSION_FORMA_D
} from './donBosco4MedioExtension';

export const ALL_DON_BOSCO_4MEDIO_FORMA_A: Question[] = [
  ...DON_BOSCO_4MEDIO_FORMA_A,
  ...EXTENSION_FORMA_A
];

export const ALL_DON_BOSCO_4MEDIO_FORMA_B: Question[] = [
  ...DON_BOSCO_4MEDIO_FORMA_B,
  ...EXTENSION_FORMA_B
];

export const ALL_DON_BOSCO_4MEDIO_FORMA_C: Question[] = [
  ...DON_BOSCO_4MEDIO_FORMA_C,
  ...EXTENSION_FORMA_C
];

export const ALL_DON_BOSCO_4MEDIO_FORMA_D: Question[] = [
  ...DON_BOSCO_4MEDIO_FORMA_D,
  ...EXTENSION_FORMA_D
];

export const DON_BOSCO_4MEDIO_VARIANTS: TestFormVariantConfig[] = [
  {
    formCode: 'A',
    formLetter: 'A',
    label: 'Forma A Oficial',
    badgeColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    questions: ALL_DON_BOSCO_4MEDIO_FORMA_A
  },
  {
    formCode: 'B',
    formLetter: 'B',
    label: 'Forma B Oficial',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    questions: ALL_DON_BOSCO_4MEDIO_FORMA_B
  },
  {
    formCode: 'C',
    formLetter: 'C',
    label: 'Forma C Oficial',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    questions: ALL_DON_BOSCO_4MEDIO_FORMA_C
  },
  {
    formCode: 'D',
    formLetter: 'D',
    label: 'Forma D Oficial',
    badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200',
    questions: ALL_DON_BOSCO_4MEDIO_FORMA_D
  }
];

// =========================================================================
// MAPA MULTI-VARIANTE PARA ASIGNACIÓN EQUILIBRADA (A, B, C, D)
// =========================================================================
export const DON_BOSCO_4MEDIO_POTENCIA_QUESTIONS: Question[] = ALL_DON_BOSCO_4MEDIO_FORMA_A.map(
  (baseQ, idx) => ({
    ...baseQ,
    variants: {
      A: ALL_DON_BOSCO_4MEDIO_FORMA_A[idx],
      B: ALL_DON_BOSCO_4MEDIO_FORMA_B[idx],
      C: ALL_DON_BOSCO_4MEDIO_FORMA_C[idx],
      D: ALL_DON_BOSCO_4MEDIO_FORMA_D[idx],
    },
  })
);

export const DON_BOSCO_4MEDIO_POTENCIA_PRESET: QuizPreset = {
  id: 'don-bosco-potencia-4medio',
  title: 'Evaluación Sumativa: Función Potencia (4° Medio C) — 4 Formas Oficiales Don Bosco',
  grade: '4° Medio',
  topic: 'Álgebra y Funciones - Unidad 2 (OA 3): Modelar fenómenos con función potencia',
  description:
    'Evaluación oficial Colegio Don Bosco Antofagasta ampliada a 15 reactivos por forma paralela (Formas A, B, C y D; total 60 reactivos), manteniendo la linealidad pedagógica, gráficos SVG, modelamiento industrial y pauta completa.',
  questions: DON_BOSCO_4MEDIO_POTENCIA_QUESTIONS,
  variants: DON_BOSCO_4MEDIO_VARIANTS,
};
