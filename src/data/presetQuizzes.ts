import { QuizPreset } from '../types';
import { CLASE_DESAFIANTE_8BASICO_PRESET } from './claseDesafiante8Basico';
import { DON_BOSCO_8BASICO_UNIDAD3_PRESET } from './donBosco8BasicoUnidad3Quiz';
import { GEOMETRY_3D_QUIZ_PRESET } from './geometry3dChallenges';
import { DON_BOSCO_HOMOTECIA_PRESET } from './donBoscoHomoteciaQuiz';
import { DON_BOSCO_4MEDIO_POTENCIA_PRESET } from './donBosco4MedioQuiz';

export const PRESET_QUIZZES: QuizPreset[] = [
  CLASE_DESAFIANTE_8BASICO_PRESET,
  DON_BOSCO_8BASICO_UNIDAD3_PRESET,
  DON_BOSCO_HOMOTECIA_PRESET,
  DON_BOSCO_4MEDIO_POTENCIA_PRESET,
  GEOMETRY_3D_QUIZ_PRESET,
  {
    id: 'mat-8basico-pitagoras-algebra',
    title: '8° Básico: Teorema de Pitágoras y Ecuaciones Lineales',
    grade: '8° Básico',
    topic: 'Geometría y Álgebra',
    description: 'Cálculo de hipotenusas, catetos, ecuaciones de 1er grado y lenguaje algebraico con diagramas.',
    questions: [
      {
        id: '8b-q1',
        text: 'En un triángulo rectángulo, los catetos miden $a = 6\\text{ cm}$ y $b = 8\\text{ cm}$. ¿Cuál es la longitud de la hipotenusa $c$?',
        options: [
          '$c = 10\\text{ cm}$',
          '$c = 14\\text{ cm}$',
          '$c = 12\\text{ cm}$',
          '$c = 100\\text{ cm}$'
        ],
        correctAnswer: 0,
        explanation: 'Por el Teorema de Pitágoras: $c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100 \\implies c = \\sqrt{100} = 10\\text{ cm}$.',
        hint: 'Aplica $c = \\sqrt{a^2 + b^2}$.',
        svg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <polygon points="50,160 250,160 50,40" fill="#312e81" fill-opacity="0.3" stroke="#6366f1" stroke-width="3" stroke-linejoin="round"/>
          <rect x="50" y="140" width="20" height="20" fill="none" stroke="#818cf8" stroke-width="2"/>
          <text x="145" y="185" fill="#e0e7ff" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">Cateto b = 8 cm</text>
          <text x="30" y="105" fill="#e0e7ff" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">a = 6 cm</text>
          <text x="175" y="90" fill="#38bdf8" font-family="sans-serif" font-size="15" text-anchor="middle" font-weight="bold">Hipotenusa c = ?</text>
        </svg>`,
        grade: '8° Básico',
        topic: 'Teorema de Pitágoras'
      },
      {
        id: '8b-q2',
        text: 'Resuelve la siguiente ecuación de primer grado: $3(x - 4) + 5 = 2x + 7$. ¿Cuál es el valor de $x$?',
        options: [
          '$x = 14$',
          '$x = 6$',
          '$x = 12$',
          '$x = -2$'
        ],
        correctAnswer: 0,
        explanation: 'Expandimos: $3x - 12 + 5 = 2x + 7 \\implies 3x - 7 = 2x + 7 \\implies 3x - 2x = 7 + 7 \\implies x = 14$.',
        hint: 'Primero aplica propiedad distributiva $3 \\cdot x - 3 \\cdot 4$.',
        grade: '8° Básico',
        topic: 'Álgebra Lineal'
      },
      {
        id: '8b-q3',
        text: 'Un terreno rectangular tiene un perímetro de $64\\text{ m}$. Si el largo mide el triple del ancho ($L = 3a$), ¿cuánto mide el área del terreno?',
        options: [
          '$192\\text{ m}^2$',
          '$96\\text{ m}^2$',
          '$256\\text{ m}^2$',
          '$144\\text{ m}^2$'
        ],
        correctAnswer: 0,
        explanation: '$P = 2(L + a) = 2(3a + a) = 8a = 64 \\implies a = 8\\text{ m}$. Luego $L = 3(8) = 24\\text{ m}$. Área $= L \\cdot a = 24 \\cdot 8 = 192\\text{ m}^2$.',
        svg: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <rect x="40" y="30" width="240" height="90" rx="6" fill="#065f46" fill-opacity="0.3" stroke="#10b981" stroke-width="3"/>
          <text x="160" y="20" fill="#a7f3d0" font-family="sans-serif" font-size="13" text-anchor="middle" font-weight="bold">Largo = 3a (24 m)</text>
          <text x="160" y="80" fill="#ffffff" font-family="sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Área = ?</text>
          <text x="25" y="80" fill="#a7f3d0" font-family="sans-serif" font-size="13" text-anchor="middle" font-weight="bold">Ancho a</text>
        </svg>`,
        grade: '8° Básico',
        topic: 'Geometría y Perímetros'
      }
    ]
  },
  {
    id: 'mat-1medio-productos-sistemas',
    title: '1° Medio: Productos Notables y Sistemas 2x2',
    grade: '1° Medio',
    topic: 'Álgebra y Funciones',
    description: 'Cuadrado de binomio, suma por su diferencia y resolución de sistemas de ecuaciones lineales.',
    questions: [
      {
        id: '1m-q1',
        text: 'Al desarrollar el cuadrado de binomio $(2x - 5)^2$, se obtiene:',
        options: [
          '$4x^2 - 20x + 25$',
          '$4x^2 - 25$',
          '$4x^2 - 10x + 25$',
          '$2x^2 - 20x + 25$'
        ],
        correctAnswer: 0,
        explanation: 'Aplicando $(a - b)^2 = a^2 - 2ab + b^2$: $(2x)^2 - 2(2x)(5) + 5^2 = 4x^2 - 20x + 25$.',
        hint: 'Recuerda el doble del primer término por el segundo término.',
        grade: '1° Medio',
        topic: 'Productos Notables'
      },
      {
        id: '1m-q2',
        text: 'Dado el sistema de ecuaciones: $\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}$, el punto de intersección $(x,y)$ es:',
        options: [
          '$(4, 3)$',
          '$(5, 1)$',
          '$(3, 5)$',
          '$(6, -1)$'
        ],
        correctAnswer: 0,
        explanation: 'Sumando ambas ecuaciones: $(2x + y) + (x - y) = 11 + 1 \\implies 3x = 12 \\implies x = 4$. Reemplazando: $4 - y = 1 \\implies y = 3$.',
        svg: `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <line x1="40" y1="180" x2="290" y2="180" stroke="#64748b" stroke-width="2"/>
          <line x1="60" y1="200" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
          <!-- Line 1: 2x + y = 11 -->
          <line x1="60" y1="30" x2="270" y2="170" stroke="#f43f5e" stroke-width="3"/>
          <!-- Line 2: x - y = 1 -->
          <line x1="80" y1="180" x2="260" y2="60" stroke="#38bdf8" stroke-width="3"/>
          <!-- Point (4,3) -->
          <circle cx="170" cy="105" r="7" fill="#facc15" stroke="#ffffff" stroke-width="2"/>
          <text x="175" y="90" fill="#fef08a" font-family="sans-serif" font-size="14" font-weight="bold">Intersección (4, 3)</text>
          <text x="210" y="45" fill="#38bdf8" font-family="sans-serif" font-size="12">x - y = 1</text>
          <text x="240" y="160" fill="#f43f5e" font-family="sans-serif" font-size="12">2x + y = 11</text>
        </svg>`,
        grade: '1° Medio',
        topic: 'Sistemas 2x2'
      },
      {
        id: '1m-q3',
        text: '¿Cuál es el valor simplificado de $(3a + 7)(3a - 7)$?',
        options: [
          '$9a^2 - 49$',
          '$9a^2 + 49$',
          '$9a^2 - 42a - 49$',
          '$3a^2 - 49$'
        ],
        correctAnswer: 0,
        explanation: 'Es una suma por su diferencia: $(A+B)(A-B) = A^2 - B^2 = (3a)^2 - (7)^2 = 9a^2 - 49$.',
        grade: '1° Medio',
        topic: 'Suma por Diferencia'
      }
    ]
  },
  {
    id: 'mat-2medio-cuadratica-logaritmos',
    title: '2° Medio: Función Cuadrática y Logaritmos',
    grade: '2° Medio',
    topic: 'Álgebra y Funciones Cuadráticas',
    description: 'Vértice de parábolas, discriminante, raíces reales y propiedades fundamentales de logaritmos.',
    questions: [
      {
        id: '2m-q1',
        text: 'Dada la función cuadrática $f(x) = x^2 - 6x + 8$, ¿cuáles son sus raíces (intersecciones con el eje $X$) y las coordenadas de su vértice $V$?',
        options: [
          'Raíces $x_1=2, x_2=4$ y Vértice $V(3, -1)$',
          'Raíces $x_1=-2, x_2=-4$ y Vértice $V(-3, 1)$',
          'Raíces $x_1=1, x_2=8$ y Vértice $V(3, -1)$',
          'Raíces $x_1=2, x_2=4$ y Vértice $V(3, 1)$'
        ],
        correctAnswer: 0,
        explanation: 'Factorizando: $(x-2)(x-4)=0 \\implies x_1=2, x_2=4$. Vértice: $x_v = -\\frac{b}{2a} = \\frac{6}{2} = 3$. $y_v = f(3) = 3^2 - 6(3) + 8 = 9 - 18 + 8 = -1$.',
        svg: `<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <line x1="30" y1="140" x2="310" y2="140" stroke="#64748b" stroke-width="2"/>
          <line x1="90" y1="210" x2="90" y2="20" stroke="#64748b" stroke-width="2"/>
          <!-- Parabola f(x) = (x-3)^2 - 1 -->
          <path d="M 100,30 Q 180,240 260,30" fill="none" stroke="#a855f7" stroke-width="3.5"/>
          <!-- Roots -->
          <circle cx="150" cy="140" r="5" fill="#38bdf8"/>
          <text x="145" y="130" fill="#38bdf8" font-size="12" font-weight="bold">x=2</text>
          <circle cx="210" cy="140" r="5" fill="#38bdf8"/>
          <text x="215" y="130" fill="#38bdf8" font-size="12" font-weight="bold">x=4</text>
          <!-- Vertex -->
          <circle cx="180" cy="175" r="6" fill="#f43f5e"/>
          <text x="180" y="200" fill="#f43f5e" font-size="13" font-weight="bold" text-anchor="middle">V(3, -1)</text>
        </svg>`,
        grade: '2° Medio',
        topic: 'Función Cuadrática'
      },
      {
        id: '2m-q2',
        text: '¿Cuál es el valor exacto de la expresión $\\log_2(64) + \\log_3(81) - \\log_5(125)$?',
        options: [
          '$7$',
          '$5$',
          '$9$',
          '$6$'
        ],
        correctAnswer: 0,
        explanation: '$\\log_2(64) = 6$ (ya que $2^6 = 64$), $\\log_3(81) = 4$ ($3^4 = 81$), $\\log_5(125) = 3$ ($5^3 = 125$). Total: $6 + 4 - 3 = 7$.',
        hint: 'Calcula cada logaritmo por su definición de potencia base.',
        grade: '2° Medio',
        topic: 'Logaritmos'
      },
      {
        id: '2m-q3',
        text: 'El discriminante $\\Delta = b^2 - 4ac$ de la ecuación $2x^2 + 4x + 5 = 0$ es igual a:',
        options: [
          '$-24$ (Sin soluciones reales)',
          '$24$ (Dos soluciones reales)',
          '$0$ (Una solución real única)',
          '$-16$ (Sin soluciones reales)'
        ],
        correctAnswer: 0,
        explanation: '$\\Delta = 4^2 - 4(2)(5) = 16 - 40 = -24$. Al ser negativo, la ecuación no posee soluciones en los números reales.',
        grade: '2° Medio',
        topic: 'Discriminante'
      }
    ]
  },
  {
    id: 'mat-3medio-trigonometria-probabilidad',
    title: '3° Medio: Trigonometría y Probabilidad Condicionada',
    grade: '3° Medio',
    topic: 'Trigonometría y Estadística',
    description: 'Razones trigonométricas, teorema del seno/coseno, circunferencia unitaria y probabilidad condicionada $P(A|B)$.',
    questions: [
      {
        id: '3m-q1',
        text: 'En la circunferencia unitaria ($r = 1$), si un ángulo mide $\\theta = 150^\\circ$ ($\\frac{5\\pi}{6}\\text{ rad}$), ¿cuáles son los valores de $\\cos(150^\\circ)$ y $\\sin(150^\\circ)$?',
        options: [
          '$\\cos(150^\\circ) = -\\frac{\\sqrt{3}}{2},\\; \\sin(150^\\circ) = \\frac{1}{2}$',
          '$\\cos(150^\\circ) = -\\frac{1}{2},\\; \\sin(150^\\circ) = \\frac{\\sqrt{3}}{2}$',
          '$\\cos(150^\\circ) = \\frac{\\sqrt{3}}{2},\\; \\sin(150^\\circ) = -\\frac{1}{2}$',
          '$\\cos(150^\\circ) = -\\frac{\\sqrt{2}}{2},\\; \\sin(150^\\circ) = \\frac{\\sqrt{2}}{2}$'
        ],
        correctAnswer: 0,
        explanation: '$150^\\circ$ está en el II cuadrante con ángulo de referencia $30^\\circ$. El coseno es negativo ($-\\cos(30^\\circ) = -\\frac{\\sqrt{3}}{2}$) y el seno es positivo ($\\sin(30^\\circ) = \\frac{1}{2}$).',
        svg: `<svg viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <circle cx="140" cy="110" r="75" fill="none" stroke="#475569" stroke-width="2"/>
          <line x1="30" y1="110" x2="250" y2="110" stroke="#64748b" stroke-width="1.5"/>
          <line x1="140" y1="20" x2="140" y2="200" stroke="#64748b" stroke-width="1.5"/>
          <!-- Radius at 150 deg -->
          <line x1="140" y1="110" x2="75" y2="72" stroke="#ec4899" stroke-width="3"/>
          <circle cx="75" cy="72" r="5" fill="#f43f5e"/>
          <text x="50" y="55" fill="#f472b6" font-size="12" font-weight="bold">(-√3/2, 1/2)</text>
          <text x="148" y="100" fill="#facc15" font-size="12">150°</text>
        </svg>`,
        grade: '3° Medio',
        topic: 'Trigonometría'
      },
      {
        id: '3m-q2',
        text: 'En un curso de 40 alumnos, 24 juegan fútbol ($F$) y 16 juegan básquetbol ($B$). Si 8 alumnos juegan ambos deportes, ¿cuál es la probabilidad de que un alumno juegue básquetbol dado que ya sabemos que juega fútbol, $P(B|F)$?',
        options: [
          '$P(B|F) = \\frac{8}{24} = \\frac{1}{3} \\approx 33.3\\%$',
          '$P(B|F) = \\frac{8}{16} = \\frac{1}{2} = 50\\%$',
          '$P(B|F) = \\frac{8}{40} = \\frac{1}{5} = 20\\%$',
          '$P(B|F) = \\frac{16}{24} = \\frac{2}{3} \\approx 66.7\\%$'
        ],
        correctAnswer: 0,
        explanation: 'Fórmula de probabilidad condicionada: $P(B|F) = \\frac{P(B \\cap F)}{P(F)} = \\frac{8/40}{24/40} = \\frac{8}{24} = \\frac{1}{3}$.',
        hint: 'Divide el número de alumnos en la intersección por el total de los que juegan fútbol.',
        grade: '3° Medio',
        topic: 'Probabilidad Condicionada'
      }
    ]
  },
  {
    id: 'mat-4medio-distribucion-vectores',
    title: '4° Medio: Distribución Normal y Geometría Vectorial 3D',
    grade: '4° Medio',
    topic: 'Estadística Inferencial y Vectores 3D',
    description: 'Estandarización $Z = \\frac{X - \\mu}{\\sigma}$, campana de Gauss y producto punto entre vectores en $\\mathbb{R}^3$.',
    questions: [
      {
        id: '4m-q1',
        text: 'Una variable aleatoria $X$ sigue una distribución normal con media $\\mu = 500$ y desviación estándar $\\sigma = 50$. Al estandarizar el valor $x = 600$, el puntaje $Z$ correspondiente es:',
        options: [
          '$Z = +2.0$',
          '$Z = +1.5$',
          '$Z = +2.5$',
          '$Z = -2.0$'
        ],
        correctAnswer: 0,
        explanation: 'Aplicando la fórmula de estandarización: $Z = \\frac{x - \\mu}{\\sigma} = \\frac{600 - 500}{50} = \\frac{100}{50} = +2.0$. Esto indica que el dato está a 2 desviaciones estándar sobre el promedio.',
        svg: `<svg viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-xs mx-auto drop-shadow-md">
          <!-- Normal Bell Curve -->
          <path d="M 20,150 Q 120,150 150,80 Q 170,25 170,25 Q 170,25 190,80 Q 220,150 320,150" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="3"/>
          <line x1="20" y1="150" x2="320" y2="150" stroke="#64748b" stroke-width="2"/>
          <line x1="170" y1="25" x2="170" y2="150" stroke="#facc15" stroke-width="2" stroke-dasharray="4"/>
          <text x="170" y="168" fill="#facc15" font-size="12" text-anchor="middle">μ = 500 (Z=0)</text>
          <line x1="250" y1="105" x2="250" y2="150" stroke="#ef4444" stroke-width="2"/>
          <text x="250" y="168" fill="#ef4444" font-size="12" text-anchor="middle">x = 600 (Z=+2)</text>
        </svg>`,
        grade: '4° Medio',
        topic: 'Distribución Normal'
      },
      {
        id: '4m-q2',
        text: 'Dados los vectores en el espacio $\\vec{u} = (2, -3, 4)$ y $\\vec{v} = (5, 1, -2)$, ¿cuál es su producto escalar (producto punto $\\vec{u} \\cdot \\vec{v}$)?',
        options: [
          '$-1$',
          '$15$',
          '$7$',
          '$-19$'
        ],
        correctAnswer: 0,
        explanation: '$\\vec{u} \\cdot \\vec{v} = (2)(5) + (-3)(1) + (4)(-2) = 10 - 3 - 8 = -1$.',
        hint: 'Multiplica componente a componente y suma: $u_x v_x + u_y v_y + u_z v_z$.',
        grade: '4° Medio',
        topic: 'Geometría Vectorial 3D'
      }
    ]
  }
];
