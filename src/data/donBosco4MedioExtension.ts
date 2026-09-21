import { Question } from '../types';

// =========================================================================
// SVGs ADICIONALES PARA PREGUNTAS 7 A 15 DE 4° MEDIO
// =========================================================================
export const EXTENSION_4MEDIO_SVGS = {
  dilatacion: (coefF: number, coefG: number) => `
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="320" height="200" rx="12" fill="#0f172a"/>
      <!-- Ejes -->
      <line x1="30" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="2"/>
      <line x1="160" y1="190" x2="160" y2="20" stroke="#64748b" stroke-width="2"/>
      <!-- Curva f(x) = coefF * x^4 (Estrecha / Contraída al eje Y) -->
      <path d="M 125,30 Q 155,168 160,170 Q 165,168 195,30" fill="none" stroke="#f43f5e" stroke-width="3"/>
      <!-- Curva g(x) = coefG * x^4 (Abierta / Dilatada) -->
      <path d="M 80,40 Q 140,165 160,170 Q 180,165 240,40" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="5,3"/>
      <!-- Labels -->
      <text x="205" y="45" fill="#fb7185" font-size="11" font-weight="bold">f(x) = ${coefF}x⁴</text>
      <text x="245" y="65" fill="#38bdf8" font-size="11" font-weight="bold">g(x) = ${coefG}x⁴</text>
      <text x="160" y="192" fill="#cbd5e1" font-size="10" text-anchor="middle">|a| mayor ⇒ más estrecha</text>
    </svg>
  `,

  traslacion: (h: number, k: number) => `
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="320" height="200" rx="12" fill="#0f172a"/>
      <!-- Ejes -->
      <line x1="30" y1="150" x2="290" y2="150" stroke="#64748b" stroke-width="2"/>
      <line x1="100" y1="190" x2="100" y2="20" stroke="#64748b" stroke-width="2"/>
      <!-- Vértice (h, k) -->
      <circle cx="190" cy="70" r="5" fill="#facc15" stroke="#f43f5e" stroke-width="2"/>
      <!-- Líneas guías de coordenadas -->
      <line x1="190" y1="70" x2="190" y2="150" stroke="#94a3b8" stroke-dasharray="3,3"/>
      <line x1="100" y1="70" x2="190" y2="70" stroke="#94a3b8" stroke-dasharray="3,3"/>
      <!-- Parábola invertida con vértice en (h,k) -->
      <path d="M 120,185 Q 175,73 190,70 Q 205,73 260,185" fill="none" stroke="#f43f5e" stroke-width="3"/>
      <!-- Labels -->
      <text x="190" y="165" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">x = ${h}</text>
      <text x="90" y="74" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="end">y = ${k}</text>
      <text x="195" y="55" fill="#fde047" font-size="12" font-weight="black">V(${h}, ${k})</text>
    </svg>
  `,

  flujoIndustrial: (potencia: string) => `
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="320" height="180" rx="12" fill="#0f172a"/>
      <!-- Tubería -->
      <rect x="40" y="50" width="240" height="80" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2.5"/>
      <!-- Manómetro -->
      <circle cx="160" cy="40" r="22" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
      <line x1="160" y1="40" x2="172" y2="28" stroke="#ef4444" stroke-width="2"/>
      <!-- Texto -->
      <text x="160" y="95" fill="#f8fafc" font-size="13" font-weight="black" text-anchor="middle">ΔP(r) = k / r⁴</text>
      <text x="160" y="118" fill="#93c5fd" font-size="11" text-anchor="middle">${potencia}</text>
    </svg>
  `,

  masaEsferica: (r: number, masa: number) => `
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-sm">
      <rect width="320" height="180" rx="12" fill="#0f172a"/>
      <!-- Esfera 3D con gradiente -->
      <defs>
        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="50%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </radialGradient>
      </defs>
      <circle cx="110" cy="90" r="55" fill="url(#sphereGrad)" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Radio -->
      <line x1="110" y1="90" x2="165" y2="90" stroke="#facc15" stroke-width="2.5"/>
      <text x="135" y="82" fill="#fde047" font-size="11" font-weight="bold">r = ${r}</text>
      <!-- Texto datos -->
      <text x="235" y="75" fill="#f8fafc" font-size="13" font-weight="black" text-anchor="middle">M(r) = k · r³</text>
      <text x="235" y="100" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Masa = ${masa} g</text>
    </svg>
  `
};

// =========================================================================
// PREGUNTAS 7 A 15: FORMA A
// =========================================================================
export const EXTENSION_FORMA_A: Question[] = [
  // 7. Dilatación vs Contracción
  {
    id: '4m-pot-q7-a',
    text: 'Dadas las funciones potencias $f(x) = 8x^4$ y $g(x) = 0,5x^4$, ¿cuál de las siguientes afirmaciones describe correctamente la relación visual entre sus gráficas en el plano cartesiano?',
    options: [
      'La gráfica de $f(x)$ es más estrecha (más contraída hacia el eje Y) que la de $g(x)$, pues $|8| > |0,5|$.',
      'La gráfica de $g(x)$ es más estrecha que la de $f(x)$, pues los decimales crecen más velozmente.',
      'Ambas gráficas tienen idéntica abertura porque ambas poseen exponente 4.',
      'La gráfica de $f(x)$ se ubica en los cuadrantes III y IV, mientras que $g(x)$ en el I y II.'
    ],
    correctAnswer: 0,
    explanation: 'En las funciones potencia de la forma $f(x) = a x^n$ con $n$ par, a mayor valor absoluto del coeficiente $|a|$, la curva crece más rápidamente y sus ramas se aproximan más al eje Y (se contrae horizontalmente). Como $|8| > |0,5|$, la gráfica de $f$ es visiblemente más estrecha.',
    hint: 'Compara los coeficientes numéricos $a$: un coeficiente mayor multiplica el resultado por un número más grande, haciendo que la gráfica suba mucho más rápido y se acerque más al eje Y.',
    svg: EXTENSION_4MEDIO_SVGS.dilatacion(8, 0.5),
    grade: '4° Medio',
    topic: 'Dilatación y Contracción Vertical de Función Potencia'
  },
  // 8. Traslación
  {
    id: '4m-pot-q8-a',
    text: 'Se aplica una traslación a la función canónica $y = -2x^4$, obteniéndose la función $f(x) = -2(x - 3)^4 + 5$. ¿Cuáles son las coordenadas del vértice (punto máximo) de la nueva gráfica?',
    options: [
      'V(3, 5)',
      'V(-3, 5)',
      'V(3, -5)',
      'V(-3, -5)'
    ],
    correctAnswer: 0,
    explanation: 'En la forma canónica trasladada $f(x) = a(x - h)^n + k$, la expresión $(x - h)$ indica un desplazamiento horizontal de $h$ unidades hacia la derecha, y $+ k$ indica un desplazamiento vertical de $k$ unidades hacia arriba. Por tanto, el vértice en el origen $(0,0)$ se traslada a $(h, k) = (3, 5)$. Al ser $a = -2 < 0$, es un punto máximo.',
    hint: 'La traslación horizontal cambia de signo dentro del paréntesis $(x - h)$, mientras que la traslación vertical $+ k$ conserva su signo. El vértice pasa de $(0,0)$ a $(h, k)$.',
    svg: EXTENSION_4MEDIO_SVGS.traslacion(3, 5),
    grade: '4° Medio',
    topic: 'Traslación y Vértice de Función Potencia'
  },
  // 9. Dominio y Recorrido Exponente Negativo Par
  {
    id: '4m-pot-q9-a',
    text: 'Dada la función potencia con exponente negativo $f(x) = \\frac{4}{x^2} = 4x^{-2}$, ¿cuál es su Dominio y su Recorrido en el conjunto de los números reales?',
    options: [
      'Dom = ℝ \\ {0}  y  Rec = ]0, +∞[ (reales positivos)',
      'Dom = ℝ  y  Rec = ℝ \\ {0}',
      'Dom = [0, +∞[  y  Rec = [0, +∞[',
      'Dom = ℝ \\ {0}  y  Rec = ]-∞, 0[ (reales negativos)'
    ],
    correctAnswer: 0,
    explanation: 'Para el Dominio, $x$ no puede ser 0 por indeterminación de la división: $\\text{Dom} = \\mathbb{R} \\setminus \\{0\\}$. Para el Recorrido, como $x^2 > 0$ para todo $x \\neq 0$ y el numerador es $+4 > 0$, el cociente $\\frac{4}{x^2}$ siempre es estrictamente positivo: $\\text{Rec} = ]0, +\\infty[$.',
    hint: 'Recuerda: ningún denominador puede valer cero (eso restringe el dominio). Y dado que $x^2$ siempre es positivo para cualquier $x \\neq 0$, ¿qué signo tiene dividir un número positivo por otro positivo?',
    grade: '4° Medio',
    topic: 'Dominio y Recorrido de Función Potencia Negativa'
  },
  // 10. Modelamiento Técnico Caída de Presión
  {
    id: '4m-pot-q10-a',
    text: 'En una red de tuberías de concentrado de cobre, la caída de presión $\\Delta P$ (en kPa) se modela mediante la relación potencial $\\Delta P(r) = \\frac{k}{r^4}$, donde $r$ es el radio interior de la tubería en cm. Las pruebas en terreno determinaron que para un radio $r = 2\\text{ cm}$, la caída de presión es de $80\\text{ kPa}$. ¿Cuál será la caída de presión si se reemplaza por una tubería de radio $r = 4\\text{ cm}$?',
    options: [
      '5 kPa',
      '10 kPa',
      '20 kPa',
      '2,5 kPa'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: Hallar $k$: $80 = \\frac{k}{2^4} \\implies 80 = \\frac{k}{16} \\implies k = 80 \\cdot 16 = 1280$.\nPaso 2: Evaluar para $r = 4$: $\\Delta P(4) = \\frac{1280}{4^4} = \\frac{1280}{256} = 5\\text{ kPa}$.',
    hint: 'Primero despeja $k$ multiplicando la presión inicial por $r^4$ ($80 \\times 2^4 = 80 \\times 16$). Luego divide esa constante $k$ entre el nuevo radio elevado a 4 ($4^4 = 256$).',
    svg: EXTENSION_4MEDIO_SVGS.flujoIndustrial('r=2 ⇒ 80 kPa | r=4 ⇒ 5 kPa'),
    grade: '4° Medio',
    topic: 'Modelamiento Técnico Inverso Potencial'
  },
  // 11. Simetría Par e Impar
  {
    id: '4m-pot-q11-a',
    text: 'Al analizar algebraicamente la función $f(x) = -7x^6$, ¿qué tipo de simetría presenta respecto a su paridad analítica?',
    options: [
      'Es una función PAR, pues $f(-x) = f(x)$, presentando simetría axial respecto al eje Y.',
      'Es una función IMPAR, pues $f(-x) = -f(x)$, presentando simetría central respecto al origen.',
      'No posee ningún tipo de simetría por poseer coeficiente numérico negativo.',
      'Presenta simetría exclusivamente respecto al eje X.'
    ],
    correctAnswer: 0,
    explanation: 'Evaluamos $f(-x) = -7(-x)^6$. Dado que el exponente 6 es par, $(-x)^6 = x^6$. Por ende, $f(-x) = -7x^6 = f(x)$. Al cumplirse $f(-x) = f(x)$, la función es formalmente PAR y simétrica respecto al eje Y.',
    hint: 'Evalúa la función reemplazando $x$ por $-x$: recuerda que cualquier base negativa elevada a exponente par resulta positiva. Compara si el resultado es idéntico a $f(x)$.',
    grade: '4° Medio',
    topic: 'Simetría Par e Impar de Función Potencia'
  },
  // 12. Función Potencia Impar Negativa Coeficiente Negativo
  {
    id: '4m-pot-q12-a',
    text: '¿En qué cuadrantes se ubica la gráfica de la función $f(x) = -4x^3$ y cuál es su monotonía?',
    options: [
      'Se ubica en los cuadrantes II y IV, y es estrictamente decreciente en todo su dominio.',
      'Se ubica en los cuadrantes I y III, y es estrictamente creciente en todo su dominio.',
      'Se ubica en los cuadrantes I y II, y posee un punto mínimo en el origen.',
      'Se ubica en los cuadrantes III y IV, y es una parábola simétrica.'
    ],
    correctAnswer: 0,
    explanation: 'Para $x > 0$: $x^3 > 0 \\implies f(x) = -4(x^3) < 0$ (Cuadrante IV: $x>0, y<0$). Para $x < 0$: $x^3 < 0 \\implies f(x) = -4(x^3) > 0$ (Cuadrante II: $x<0, y>0$). A medida que $x$ aumenta, $f(x)$ desciende continuamente, por lo que es estrictamente decreciente.',
    hint: 'Evalúa un número positivo (ej. $x=1$, da $y=-4$, cuadrante IV) y un número negativo (ej. $x=-1$, da $y=+4$, cuadrante II). Observa cómo cambian los valores de izquierda a derecha.',
    grade: '4° Medio',
    topic: 'Comportamiento y Cuadrantes de Exponente Impar'
  },
  // 13. Modelamiento de Masa Esférica
  {
    id: '4m-pot-q13-a',
    text: 'La masa $M$ (en gramos) de bolas de acero para molinos de chancado varía en función directa del cubo de su radio $r$ (en cm), según $M(r) = k \\cdot r^3$. Si una bola de radio $r = 3\\text{ cm}$ tiene una masa de $540\\text{ gramos}$, ¿cuál será la masa de una bola de radio $r = 4\\text{ cm}$?',
    options: [
      '1.280 gramos',
      '960 gramos',
      '720 gramos',
      '1.080 gramos'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: Despejar $k$: $540 = k \\cdot 3^3 = k \\cdot 27 \\implies k = \\frac{540}{27} = 20\\text{ g/cm}^3$.\nPaso 2: Calcular masa para $r = 4$: $M(4) = 20 \\cdot 4^3 = 20 \\cdot 64 = 1.280\\text{ gramos}$.',
    hint: 'Calcula primero la constante $k$ dividiendo 540 entre $3^3 = 27$. Luego multiplica ese valor obtenido por $4^3 = 64$.',
    svg: EXTENSION_4MEDIO_SVGS.masaEsferica(3, 540),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico Industrial'
  },
  // 14. Asíntotas en el Infinito
  {
    id: '4m-pot-q14-a',
    text: 'Para la función potencia $f(x) = \\frac{8}{x^3}$, ¿qué ocurre con el valor de $f(x)$ a medida que $x$ toma valores positivos extremadamente grandes ($x \\to +\\infty$)?',
    options: [
      'El valor de f(x) se aproxima a 0 por valores positivos (asíntota horizontal y = 0).',
      'El valor de f(x) tiende a crecer indefinidamente hacia +∞.',
      'El valor de f(x) oscila entre -8 y +8 sin converger.',
      'El valor de f(x) se aproxima a la constante 8.'
    ],
    correctAnswer: 0,
    explanation: 'A medida que $x$ crece hacia infinito, $x^3$ se hace infinitamente grande, por lo que la fracción $\\frac{8}{x^3}$ tiende a cero: $\\lim_{x \\to \\infty} \\frac{8}{x^3} = 0$. La recta horizontal $y = 0$ (eje X) es la asíntota horizontal.',
    hint: 'Imagina dividir 8 entre números cada vez más gigantescos (1000, 1.000.000...): el resultado se vuelve tan diminuto que prácticamente se vuelve cero.',
    grade: '4° Medio',
    topic: 'Comportamiento Asintótico al Infinito'
  },
  // 15. Tasa de Reacción / Temperatura
  {
    id: '4m-pot-q15-a',
    text: 'En un ensayo de lixiviación metalúrgica, la tasa de disolución $R$ (en mg/s) depende de la temperatura $T$ (en unidades de control) según la ley potencial $R(T) = a \\cdot T^3$. A una temperatura $T = 2$, la tasa medida es de $72\\text{ mg/s}$.\n\n• Parte A: Determina el valor de la constante $a$.\n• Parte B: Calcula la tasa de disolución proyectada para $T = 3$.',
    options: [
      'Parte A: a = 9  |  Parte B: R(3) = 243 mg/s',
      'Parte A: a = 18 |  Parte B: R(3) = 486 mg/s',
      'Parte A: a = 6  |  Parte B: R(3) = 162 mg/s',
      'Parte A: a = 8  |  Parte B: R(3) = 216 mg/s'
    ],
    correctAnswer: 0,
    explanation: 'Parte A: $72 = a \\cdot 2^3 \\implies 72 = 8a \\implies a = \\frac{72}{8} = 9$.\nParte B: $R(3) = 9 \\cdot 3^3 = 9 \\cdot 27 = 243\\text{ mg/s}$.',
    hint: 'Primero divide 72 entre $2^3 = 8$ para obtener $a$. Luego calcula $a \\times 3^3 = a \\times 27$.',
    grade: '4° Medio',
    topic: 'Problema de Modelamiento Experimental'
  }
];

// =========================================================================
// PREGUNTAS 7 A 15: FORMA B
// =========================================================================
export const EXTENSION_FORMA_B: Question[] = [
  // 7. Dilatación vs Contracción
  {
    id: '4m-pot-q7-b',
    text: 'Dadas las funciones potencias $f(x) = 6x^4$ y $g(x) = 0,25x^4$, ¿cuál de las siguientes afirmaciones describe correctamente la relación visual entre sus gráficas en el plano cartesiano?',
    options: [
      'La gráfica de $f(x)$ es más estrecha (más contraída hacia el eje Y) que la de $g(x)$, pues $|6| > |0,25|$.',
      'La gráfica de $g(x)$ es más estrecha que la de $f(x)$, pues los decimales crecen más velozmente.',
      'Ambas gráficas tienen idéntica abertura porque ambas poseen exponente 4.',
      'La gráfica de $f(x)$ se ubica en los cuadrantes III y IV, mientras que $g(x)$ en el I y II.'
    ],
    correctAnswer: 0,
    explanation: 'Al tener mayor coeficiente ($|6| > |0,25|$), la función $f(x)$ crece a un ritmo significativamente mayor, de modo que sus ramas se cierran más hacia el eje Y (contracción horizontal).',
    hint: 'Compara los coeficientes numéricos: un coeficiente mayor multiplica los valores por una cantidad superior, haciendo la curva más empinada y estrecha.',
    svg: EXTENSION_4MEDIO_SVGS.dilatacion(6, 0.25),
    grade: '4° Medio',
    topic: 'Dilatación y Contracción Vertical de Función Potencia'
  },
  // 8. Traslación
  {
    id: '4m-pot-q8-b',
    text: 'Se aplica una traslación a la función canónica $y = -4x^4$, obteniéndose la función $f(x) = -4(x - 2)^4 + 7$. ¿Cuáles son las coordenadas del vértice (punto máximo) de la nueva gráfica?',
    options: [
      'V(2, 7)',
      'V(-2, 7)',
      'V(2, -7)',
      'V(-2, -7)'
    ],
    correctAnswer: 0,
    explanation: 'El desplazamiento horizontal es $h = 2$ hacia la derecha y el vertical es $k = 7$ hacia arriba. El vértice se localiza en $(2, 7)$. Al ser el coeficiente negativo, la curva abre hacia abajo y este punto es un máximo.',
    hint: 'Observa la forma canónica $a(x - h)^n + k$: el vértice está en el punto $(h, k)$.',
    svg: EXTENSION_4MEDIO_SVGS.traslacion(2, 7),
    grade: '4° Medio',
    topic: 'Traslación y Vértice de Función Potencia'
  },
  // 9. Dominio y Recorrido
  {
    id: '4m-pot-q9-b',
    text: 'Dada la función potencia con exponente negativo $f(x) = -\\frac{5}{x^2} = -5x^{-2}$, ¿cuál es su Dominio y su Recorrido en el conjunto de los números reales?',
    options: [
      'Dom = ℝ \\ {0}  y  Rec = ]-∞, 0[ (reales negativos)',
      'Dom = ℝ \\ {0}  y  Rec = ]0, +∞[ (reales positivos)',
      'Dom = ℝ  y  Rec = ℝ \\ {0}',
      'Dom = ]-∞, 0[  y  Rec = ℝ'
    ],
    correctAnswer: 0,
    explanation: '$x \\neq 0$ por el denominador, luego $\\text{Dom} = \\mathbb{R} \\setminus \\{0\\}$. Dado que $x^2 > 0$ siempre y el numerador es $-5 < 0$, la fracción siempre es negativa: $\\text{Rec} = ]-\\infty, 0[$.',
    hint: 'El denominador no puede ser 0. Dado que $x^2$ siempre es positivo, al dividir $-5$ entre un número positivo siempre obtendrás números negativos.',
    grade: '4° Medio',
    topic: 'Dominio y Recorrido de Función Potencia Negativa'
  },
  // 10. Modelamiento Caída de Presión
  {
    id: '4m-pot-q10-b',
    text: 'En una red de fluidos, la caída de presión se rige por $\\Delta P(r) = \\frac{k}{r^4}$. Para un radio de $r = 2\\text{ cm}$, la caída de presión registrada es de $50\\text{ kPa}$. ¿Cuál será la caída de presión si se instala una tubería de radio $r = 4\\text{ cm}$?',
    options: [
      '3,125 kPa',
      '6,25 kPa',
      '12,5 kPa',
      '1,5 kPa'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $50 = \\frac{k}{2^4} \\implies k = 50 \\cdot 16 = 800$.\nPaso 2: $\\Delta P(4) = \\frac{800}{4^4} = \\frac{800}{256} = 3,125\\text{ kPa}$.',
    hint: 'Multiplica $50 \\times 16 = 800$. Luego divide 800 entre $4^4 = 256$.',
    svg: EXTENSION_4MEDIO_SVGS.flujoIndustrial('r=2 ⇒ 50 kPa | r=4 ⇒ 3,125 kPa'),
    grade: '4° Medio',
    topic: 'Modelamiento Técnico Inverso Potencial'
  },
  // 11. Simetría Par e Impar
  {
    id: '4m-pot-q11-b',
    text: 'Al analizar algebraicamente la función $f(x) = 5x^5$, ¿qué tipo de simetría presenta respecto a su paridad analítica?',
    options: [
      'Es una función IMPAR, pues $f(-x) = -f(x)$, presentando simetría central respecto al origen.',
      'Es una función PAR, pues $f(-x) = f(x)$, presentando simetría axial respecto al eje Y.',
      'No posee ningún tipo de simetría.',
      'Presenta simetría exclusivamente respecto al eje X.'
    ],
    correctAnswer: 0,
    explanation: 'Evaluamos: $f(-x) = 5(-x)^5 = 5(-x^5) = -5x^5 = -f(x)$. Al cumplirse $f(-x) = -f(x)$, la función es IMPAR y simétrica con respecto al origen $(0,0)$.',
    hint: 'Evalúa $f(-x)$: como el exponente es impar, $(-x)^5 = -(x^5)$. Comprueba si el resultado es igual a $-f(x)$.',
    grade: '4° Medio',
    topic: 'Simetría Par e Impar de Función Potencia'
  },
  // 12. Exponente Impar Coeficiente Negativo
  {
    id: '4m-pot-q12-b',
    text: '¿En qué cuadrantes se ubica la gráfica de la función $f(x) = -2x^5$ y cuál es su monotonía?',
    options: [
      'Se ubica en los cuadrantes II y IV, y es estrictamente decreciente en todo su dominio.',
      'Se ubica en los cuadrantes I y III, y es estrictamente creciente en todo su dominio.',
      'Se ubica en los cuadrantes I y IV, y posee un vértice mínimo.',
      'Se ubica en los cuadrantes II y III, y es horizontal.'
    ],
    correctAnswer: 0,
    explanation: 'Para $x > 0$: $f(x) < 0$ (Cuadrante IV). Para $x < 0$: $f(x) > 0$ (Cuadrante II). Es estrictamente decreciente en todo $\\mathbb{R}$.',
    hint: 'Un exponente impar con signo negativo invierte las ramas normales, colocándolas en los cuadrantes II ($x<0, y>0$) y IV ($x>0, y<0$).',
    grade: '4° Medio',
    topic: 'Comportamiento y Cuadrantes de Exponente Impar'
  },
  // 13. Modelamiento Masa
  {
    id: '4m-pot-q13-b',
    text: 'La masa $M$ (en gramos) de una pieza esférica se modela por $M(r) = k \\cdot r^3$. Si para $r = 3\\text{ cm}$ la masa es de $810\\text{ gramos}$, ¿cuál es la masa de una pieza con radio $r = 2\\text{ cm}$?',
    options: [
      '240 gramos',
      '180 gramos',
      '360 gramos',
      '270 gramos'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $810 = k \\cdot 3^3 = 27k \\implies k = \\frac{810}{27} = 30$.\nPaso 2: $M(2) = 30 \\cdot 2^3 = 30 \\cdot 8 = 240\\text{ gramos}$.',
    hint: 'Calcula $k = 810 / 27 = 30$. Luego evalúa $30 \\times 2^3 = 30 \\times 8$.',
    svg: EXTENSION_4MEDIO_SVGS.masaEsferica(3, 810),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico Industrial'
  },
  // 14. Asíntotas
  {
    id: '4m-pot-q14-b',
    text: 'Para la función potencia $f(x) = \\frac{15}{x^4}$, ¿cuáles son sus asíntotas vertical y horizontal respectivamente?',
    options: [
      'Asíntota vertical x = 0 (eje Y) y asíntota horizontal y = 0 (eje X).',
      'Asíntota vertical x = 15 y asíntota horizontal y = 4.',
      'Asíntota vertical y = 0 y asíntota horizontal x = 0.',
      'No posee ninguna asíntota en los reales.'
    ],
    correctAnswer: 0,
    explanation: 'Al anularse el denominador en $x = 0$, se produce una indeterminación con tendencia a infinito (asíntota vertical $x = 0$). Cuando $x \\to \\pm\\infty$, $\\frac{15}{x^4} \\to 0$, por lo que la recta $y = 0$ es la asíntota horizontal.',
    hint: 'La indeterminación en el denominador $x=0$ marca la asíntota vertical, y la tendencia a cero cuando $x$ se va a infinito marca la asíntota horizontal $y=0$.',
    grade: '4° Medio',
    topic: 'Comportamiento Asintótico al Infinito'
  },
  // 15. Tasa de Reacción
  {
    id: '4m-pot-q15-b',
    text: 'En un ensayo metalúrgico, la tasa de disolución sigue $R(T) = a \\cdot T^3$. A $T = 2$, la tasa es de $40\\text{ mg/s}$.\n\n• Parte A: Determina el valor de la constante $a$.\n• Parte B: Calcula la tasa proyectada para $T = 3$.',
    options: [
      'Parte A: a = 5  |  Parte B: R(3) = 135 mg/s',
      'Parte A: a = 10 |  Parte B: R(3) = 270 mg/s',
      'Parte A: a = 4  |  Parte B: R(3) = 108 mg/s',
      'Parte A: a = 8  |  Parte B: R(3) = 200 mg/s'
    ],
    correctAnswer: 0,
    explanation: 'Parte A: $40 = a \\cdot 2^3 = 8a \\implies a = 5$.\nParte B: $R(3) = 5 \\cdot 3^3 = 5 \\cdot 27 = 135\\text{ mg/s}$.',
    hint: 'Divide 40 entre 8 para hallar $a = 5$. Luego calcula $5 \\times 27$.',
    grade: '4° Medio',
    topic: 'Problema de Modelamiento Experimental'
  }
];

// =========================================================================
// PREGUNTAS 7 A 15: FORMA C
// =========================================================================
export const EXTENSION_FORMA_C: Question[] = [
  // 7. Dilatación vs Contracción
  {
    id: '4m-pot-q7-c',
    text: 'Dadas las funciones potencias $f(x) = 10x^4$ y $g(x) = 0,4x^4$, ¿cuál de las siguientes afirmaciones describe correctamente la relación visual entre sus gráficas en el plano cartesiano?',
    options: [
      'La gráfica de $f(x)$ es más estrecha (más contraída hacia el eje Y) que la de $g(x)$, pues $|10| > |0,4|$.',
      'La gráfica de $g(x)$ es más estrecha que la de $f(x)$, pues los decimales crecen más velozmente.',
      'Ambas gráficas tienen idéntica abertura porque ambas poseen exponente 4.',
      'La gráfica de $f(x)$ se ubica en los cuadrantes III y IV, mientras que $g(x)$ en el I y II.'
    ],
    correctAnswer: 0,
    explanation: 'A mayor coeficiente $|a|$, mayor velocidad de crecimiento vertical, contrayendo la gráfica hacia el eje Y. $|10| > |0,4|$.',
    hint: 'A mayor $|a|$, la curva crece más rápido y es más estrecha.',
    svg: EXTENSION_4MEDIO_SVGS.dilatacion(10, 0.4),
    grade: '4° Medio',
    topic: 'Dilatación y Contracción Vertical de Función Potencia'
  },
  // 8. Traslación
  {
    id: '4m-pot-q8-c',
    text: 'Se aplica una traslación a la función canónica $y = -3x^4$, obteniéndose la función $f(x) = -3(x - 5)^4 + 8$. ¿Cuáles son las coordenadas del vértice (punto máximo) de la nueva gráfica?',
    options: [
      'V(5, 8)',
      'V(-5, 8)',
      'V(5, -8)',
      'V(-5, -8)'
    ],
    correctAnswer: 0,
    explanation: 'La gráfica se desplaza 5 unidades a la derecha y 8 hacia arriba, ubicando el vértice en $(5, 8)$.',
    hint: 'La forma $(x - h)$ desplaza a la derecha a $+h$, y $+k$ sube a $+k$. Vértice en $(h, k)$.',
    svg: EXTENSION_4MEDIO_SVGS.traslacion(5, 8),
    grade: '4° Medio',
    topic: 'Traslación y Vértice de Función Potencia'
  },
  // 9. Dominio y Recorrido
  {
    id: '4m-pot-q9-c',
    text: 'Dada la función potencia con exponente negativo $f(x) = \\frac{6}{x^4} = 6x^{-4}$, ¿cuál es su Dominio y su Recorrido en el conjunto de los números reales?',
    options: [
      'Dom = ℝ \\ {0}  y  Rec = ]0, +∞[ (reales positivos)',
      'Dom = ℝ  y  Rec = ℝ \\ {0}',
      'Dom = [0, +∞[  y  Rec = [0, +∞[',
      'Dom = ℝ \\ {0}  y  Rec = ]-∞, 0[ (reales negativos)'
    ],
    correctAnswer: 0,
    explanation: '$x \\neq 0$ por denominador. Como $x^4 > 0$ siempre y $6 > 0$, el cociente siempre es positivo: $\\text{Rec} = ]0, +\\infty[$.',
    hint: 'El denominador no puede ser 0 y una potencia par de cualquier número no nulo siempre es positiva.',
    grade: '4° Medio',
    topic: 'Dominio y Recorrido de Función Potencia Negativa'
  },
  // 10. Modelamiento Caída de Presión
  {
    id: '4m-pot-q10-c',
    text: 'En una red de fluidos, la caída de presión se rige por $\\Delta P(r) = \\frac{k}{r^4}$. Para un radio de $r = 2\\text{ cm}$, la caída de presión es de $100\\text{ kPa}$. ¿Cuál será la caída de presión si se instala una tubería de radio $r = 4\\text{ cm}$?',
    options: [
      '6,25 kPa',
      '12,5 kPa',
      '25 kPa',
      '3,125 kPa'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $100 = \\frac{k}{2^4} \\implies k = 100 \\cdot 16 = 1600$.\nPaso 2: $\\Delta P(4) = \\frac{1600}{4^4} = \\frac{1600}{256} = 6,25\\text{ kPa}$.',
    hint: 'Calcula $k = 100 \\times 16 = 1600$. Luego divide 1600 entre 256.',
    svg: EXTENSION_4MEDIO_SVGS.flujoIndustrial('r=2 ⇒ 100 kPa | r=4 ⇒ 6,25 kPa'),
    grade: '4° Medio',
    topic: 'Modelamiento Técnico Inverso Potencial'
  },
  // 11. Simetría Par e Impar
  {
    id: '4m-pot-q11-c',
    text: 'Al analizar algebraicamente la función $f(x) = -3x^8$, ¿qué tipo de simetría presenta respecto a su paridad analítica?',
    options: [
      'Es una función PAR, pues $f(-x) = f(x)$, presentando simetría axial respecto al eje Y.',
      'Es una función IMPAR, pues $f(-x) = -f(x)$, presentando simetría central respecto al origen.',
      'No posee ningún tipo de simetría.',
      'Presenta simetría exclusivamente respecto al eje X.'
    ],
    correctAnswer: 0,
    explanation: 'Como el exponente 8 es par, $(-x)^8 = x^8$, de modo que $f(-x) = -3(-x)^8 = -3x^8 = f(x)$. Es PAR.',
    hint: 'Reemplaza $x$ por $-x$: como el exponente es 8 (par), la base negativa se vuelve positiva.',
    grade: '4° Medio',
    topic: 'Simetría Par e Impar de Función Potencia'
  },
  // 12. Exponente Impar Coeficiente Negativo
  {
    id: '4m-pot-q12-c',
    text: '¿En qué cuadrantes se ubica la gráfica de la función $f(x) = -5x^3$ y cuál es su monotonía?',
    options: [
      'Se ubica en los cuadrantes II y IV, y es estrictamente decreciente en todo su dominio.',
      'Se ubica en los cuadrantes I y III, y es estrictamente creciente en todo su dominio.',
      'Se ubica en los cuadrantes I y II, con vértice en el origen.',
      'Se ubica en los cuadrantes III y IV, y es una parábola.'
    ],
    correctAnswer: 0,
    explanation: '$f(x) = -5x^3$ tiene ramas en los cuadrantes II y IV, y desciende a lo largo de todo $\\mathbb{R}$.',
    hint: 'Si $x>0$, $y<0$ (cuadrante IV). Si $x<0$, $y>0$ (cuadrante II). Decreciente.',
    grade: '4° Medio',
    topic: 'Comportamiento y Cuadrantes de Exponente Impar'
  },
  // 13. Modelamiento Masa
  {
    id: '4m-pot-q13-c',
    text: 'La masa $M$ de una bola de acero sigue $M(r) = k \\cdot r^3$. Para $r = 2\\text{ cm}$ su masa es $200\\text{ gramos}$. ¿Cuál es la masa de una bola de radio $r = 4\\text{ cm}$?',
    options: [
      '1.600 gramos',
      '800 gramos',
      '1.200 gramos',
      '2.000 gramos'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $200 = k \\cdot 2^3 = 8k \\implies k = 25$.\nPaso 2: $M(4) = 25 \\cdot 4^3 = 25 \\cdot 64 = 1.600\\text{ gramos}$.',
    hint: 'Despeja $k = 200 / 8 = 25$. Luego calcula $25 \\times 4^3 = 25 \\times 64$.',
    svg: EXTENSION_4MEDIO_SVGS.masaEsferica(2, 200),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico Industrial'
  },
  // 14. Asíntotas
  {
    id: '4m-pot-q14-c',
    text: 'Para la función potencia $f(x) = \\frac{10}{x^5}$, ¿cuáles son sus asíntotas en el plano cartesiano?',
    options: [
      'Asíntota vertical x = 0 (eje Y) y asíntota horizontal y = 0 (eje X).',
      'Asíntota vertical x = 10 y asíntota horizontal y = 5.',
      'Asíntota vertical y = 0 y asíntota horizontal x = 0.',
      'No posee asíntotas.'
    ],
    correctAnswer: 0,
    explanation: 'División por cero en $x = 0$ (asíntota vertical); cuando $x \\to \\pm\\infty$, el cociente tiende a 0 (asíntota horizontal $y = 0$).',
    hint: 'Analiza qué pasa cuando $x=0$ y cuando $x \\to \\infty$.',
    grade: '4° Medio',
    topic: 'Comportamiento Asintótico al Infinito'
  },
  // 15. Tasa de Reacción
  {
    id: '4m-pot-q15-c',
    text: 'En un proceso metalúrgico, la tasa de reacción sigue $R(T) = a \\cdot T^3$. A $T = 2$, la tasa es $56\\text{ mg/s}$.\n\n• Parte A: Determina el valor de la constante $a$.\n• Parte B: Calcula la tasa proyectada para $T = 3$.',
    options: [
      'Parte A: a = 7  |  Parte B: R(3) = 189 mg/s',
      'Parte A: a = 14 |  Parte B: R(3) = 378 mg/s',
      'Parte A: a = 6  |  Parte B: R(3) = 162 mg/s',
      'Parte A: a = 8  |  Parte B: R(3) = 216 mg/s'
    ],
    correctAnswer: 0,
    explanation: 'Parte A: $56 = a \\cdot 2^3 = 8a \\implies a = 7$.\nParte B: $R(3) = 7 \\cdot 3^3 = 7 \\cdot 27 = 189\\text{ mg/s}$.',
    hint: 'Divide 56 entre 8 para hallar $a = 7$. Luego calcula $7 \\times 27$.',
    grade: '4° Medio',
    topic: 'Problema de Modelamiento Experimental'
  }
];

// =========================================================================
// PREGUNTAS 7 A 15: FORMA D
// =========================================================================
export const EXTENSION_FORMA_D: Question[] = [
  // 7. Dilatación vs Contracción
  {
    id: '4m-pot-q7-d',
    text: 'Dadas las funciones potencias $f(x) = 5x^4$ y $g(x) = 0,2x^4$, ¿cuál de las siguientes afirmaciones describe correctamente la relación visual entre sus gráficas en el plano cartesiano?',
    options: [
      'La gráfica de $f(x)$ es más estrecha (más contraída hacia el eje Y) que la de $g(x)$, pues $|5| > |0,2|$.',
      'La gráfica de $g(x)$ es más estrecha que la de $f(x)$, pues los decimales crecen más velozmente.',
      'Ambas gráficas tienen idéntica abertura porque ambas poseen exponente 4.',
      'La gráfica de $f(x)$ se ubica en los cuadrantes III y IV, mientras que $g(x)$ en el I y II.'
    ],
    correctAnswer: 0,
    explanation: 'Como $|5| > |0,2|$, la función $f(x)$ tiene una pendiente mucho mayor y se contrae horizontalmente hacia el eje Y.',
    hint: 'Un coeficiente numérico mayor genera un crecimiento más rápido y una curva más cerrada.',
    svg: EXTENSION_4MEDIO_SVGS.dilatacion(5, 0.2),
    grade: '4° Medio',
    topic: 'Dilatación y Contracción Vertical de Función Potencia'
  },
  // 8. Traslación
  {
    id: '4m-pot-q8-d',
    text: 'Se aplica una traslación a la función canónica $y = -2x^4$, obteniéndose la función $f(x) = -2(x - 4)^4 + 6$. ¿Cuáles son las coordenadas del vértice (punto máximo) de la nueva gráfica?',
    options: [
      'V(4, 6)',
      'V(-4, 6)',
      'V(4, -6)',
      'V(-4, -6)'
    ],
    correctAnswer: 0,
    explanation: 'El desplazamiento traslada el vértice a $(4, 6)$ con concavidad hacia abajo.',
    hint: 'El término $(x - 4)$ indica desplazamiento horizontal a $+4$ y el término $+6$ desplazamiento vertical a $+6$. Vértice en $(4, 6)$.',
    svg: EXTENSION_4MEDIO_SVGS.traslacion(4, 6),
    grade: '4° Medio',
    topic: 'Traslación y Vértice de Función Potencia'
  },
  // 9. Dominio y Recorrido
  {
    id: '4m-pot-q9-d',
    text: 'Dada la función potencia con exponente negativo $f(x) = -\\frac{2}{x^4} = -2x^{-4}$, ¿cuál es su Dominio y su Recorrido en el conjunto de los números reales?',
    options: [
      'Dom = ℝ \\ {0}  y  Rec = ]-∞, 0[ (reales negativos)',
      'Dom = ℝ \\ {0}  y  Rec = ]0, +∞[ (reales positivos)',
      'Dom = ℝ  y  Rec = ℝ \\ {0}',
      'Dom = [0, +∞[  y  Rec = ]-∞, 0['
    ],
    correctAnswer: 0,
    explanation: '$x \\neq 0$. Dado que $x^4 > 0$ y el numerador es $-2 < 0$, todos los valores de $f(x)$ son estrictamente negativos: $\\text{Rec} = ]-\\infty, 0[$.',
    hint: 'Cualquier número real no nulo elevado a potencia par es positivo. Al dividir $-2$ por ese resultado, siempre se obtienen negativos.',
    grade: '4° Medio',
    topic: 'Dominio y Recorrido de Función Potencia Negativa'
  },
  // 10. Modelamiento Caída de Presión
  {
    id: '4m-pot-q10-d',
    text: 'En una red de fluidos, la caída de presión se rige por $\\Delta P(r) = \\frac{k}{r^4}$. Para un radio de $r = 2\\text{ cm}$, la caída de presión es de $60\\text{ kPa}$. ¿Cuál será la caída de presión si se instala una tubería de radio $r = 4\\text{ cm}$?',
    options: [
      '3,75 kPa',
      '7,5 kPa',
      '15 kPa',
      '1,875 kPa'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $60 = \\frac{k}{2^4} \\implies k = 60 \\cdot 16 = 960$.\nPaso 2: $\\Delta P(4) = \\frac{960}{4^4} = \\frac{960}{256} = 3,75\\text{ kPa}$.',
    hint: 'Calcula $k = 60 \\times 16 = 960$. Luego divide 960 entre 256.',
    svg: EXTENSION_4MEDIO_SVGS.flujoIndustrial('r=2 ⇒ 60 kPa | r=4 ⇒ 3,75 kPa'),
    grade: '4° Medio',
    topic: 'Modelamiento Técnico Inverso Potencial'
  },
  // 11. Simetría Par e Impar
  {
    id: '4m-pot-q11-d',
    text: 'Al analizar algebraicamente la función $f(x) = 4x^7$, ¿qué tipo de simetría presenta respecto a su paridad analítica?',
    options: [
      'Es una función IMPAR, pues $f(-x) = -f(x)$, presentando simetría central respecto al origen.',
      'Es una función PAR, pues $f(-x) = f(x)$, presentando simetría axial respecto al eje Y.',
      'No posee ningún tipo de simetría.',
      'Presenta simetría exclusivamente respecto al eje X.'
    ],
    correctAnswer: 0,
    explanation: 'Como 7 es impar, $(-x)^7 = -x^7$, luego $f(-x) = 4(-x^7) = -4x^7 = -f(x)$. Es una función IMPAR.',
    hint: 'Al elevar $-x$ a una potencia impar, el signo negativo se mantiene: $(-x)^7 = -x^7$. Esto define una función impar.',
    grade: '4° Medio',
    topic: 'Simetría Par e Impar de Función Potencia'
  },
  // 12. Exponente Impar Coeficiente Negativo
  {
    id: '4m-pot-q12-d',
    text: '¿En qué cuadrantes se ubica la gráfica de la función $f(x) = -3x^5$ y cuál es su monotonía?',
    options: [
      'Se ubica en los cuadrantes II y IV, y es estrictamente decreciente en todo su dominio.',
      'Se ubica en los cuadrantes I y III, y es estrictamente creciente en todo su dominio.',
      'Se ubica en los cuadrantes I y II, y posee un vértice mínimo.',
      'Se ubica en los cuadrantes III y IV, y es cóncava.'
    ],
    correctAnswer: 0,
    explanation: 'Las ramas ocupan los cuadrantes II y IV, decreciendo de manera monótona en todo su dominio real.',
    hint: 'Para $x>0 \\implies y<0$ (cuadrante IV); para $x<0 \\implies y>0$ (cuadrante II). Función decreciente.',
    grade: '4° Medio',
    topic: 'Comportamiento y Cuadrantes de Exponente Impar'
  },
  // 13. Modelamiento Masa
  {
    id: '4m-pot-q13-d',
    text: 'La masa $M$ de una pieza de acero se modela por $M(r) = k \\cdot r^3$. Si para $r = 3\\text{ cm}$ la masa es de $1.080\\text{ gramos}$, ¿cuál es la masa de una pieza con radio $r = 2\\text{ cm}$?',
    options: [
      '320 gramos',
      '240 gramos',
      '480 gramos',
      '360 gramos'
    ],
    correctAnswer: 0,
    explanation: 'Paso 1: $1080 = k \\cdot 3^3 = 27k \\implies k = \\frac{1080}{27} = 40$.\nPaso 2: $M(2) = 40 \\cdot 2^3 = 40 \\cdot 8 = 320\\text{ gramos}$.',
    hint: 'Calcula $k = 1080 / 27 = 40$. Luego multiplica $40 \\times 2^3 = 40 \\times 8$.',
    svg: EXTENSION_4MEDIO_SVGS.masaEsferica(3, 1080),
    grade: '4° Medio',
    topic: 'Modelamiento Cúbico Industrial'
  },
  // 14. Asíntotas
  {
    id: '4m-pot-q14-d',
    text: 'Para la función potencia $f(x) = \\frac{24}{x^2}$, ¿cuáles son sus asíntotas vertical y horizontal respectivamente?',
    options: [
      'Asíntota vertical x = 0 (eje Y) y asíntota horizontal y = 0 (eje X).',
      'Asíntota vertical x = 24 y asíntota horizontal y = 2.',
      'Asíntota vertical y = 0 y asíntota horizontal x = 0.',
      'No posee asíntotas.'
    ],
    correctAnswer: 0,
    explanation: 'Al anularse el denominador en $x = 0$, la gráfica se dispara hacia $+\\infty$ (asíntota vertical $x = 0$). Cuando $x \\to \\pm\\infty$, el cociente se reduce a cero (asíntota horizontal $y = 0$).',
    hint: 'La asíntota vertical ocurre en el valor prohibido del denominador ($x=0$) y la horizontal en el límite hacia infinito ($y=0$).',
    grade: '4° Medio',
    topic: 'Comportamiento Asintótico al Infinito'
  },
  // 15. Tasa de Reacción
  {
    id: '4m-pot-q15-d',
    text: 'En un ensayo metalúrgico, la tasa de reacción sigue $R(T) = a \\cdot T^3$. A $T = 2$, la tasa es $48\\text{ mg/s}$.\n\n• Parte A: Determina el valor de la constante $a$.\n• Parte B: Calcula la tasa proyectada para $T = 3$.',
    options: [
      'Parte A: a = 6  |  Parte B: R(3) = 162 mg/s',
      'Parte A: a = 12 |  Parte B: R(3) = 324 mg/s',
      'Parte A: a = 4  |  Parte B: R(3) = 108 mg/s',
      'Parte A: a = 8  |  Parte B: R(3) = 216 mg/s'
    ],
    correctAnswer: 0,
    explanation: 'Parte A: $48 = a \\cdot 2^3 = 8a \\implies a = 6$.\nParte B: $R(3) = 6 \\cdot 3^3 = 6 \\cdot 27 = 162\\text{ mg/s}$.',
    hint: 'Divide 48 entre 8 para hallar $a = 6$. Luego calcula $6 \\times 27$.',
    grade: '4° Medio',
    topic: 'Problema de Modelamiento Experimental'
  }
];
