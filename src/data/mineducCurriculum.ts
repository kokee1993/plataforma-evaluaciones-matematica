import { Question } from '../types';
import { DON_BOSCO_HOMOTECIA_1MEDIO_QUESTIONS } from './donBoscoHomoteciaQuiz';
import { DON_BOSCO_4MEDIO_POTENCIA_QUESTIONS } from './donBosco4MedioQuiz';
import { DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS } from './donBosco8BasicoUnidad3Quiz';
import { CLASE_DESAFIANTE_QUESTIONS_WITH_VARIANTS } from './claseDesafiante8Basico';

export interface HabilidadTroncal {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
}

export interface ActitudOAA {
  id: string;
  codigo: string;
  descripcion: string;
}

export interface CurriculumOAItem {
  id: string; // e.g. "OA 01"
  code: string; // e.g. "MA08 OA 01" or "FG-MATE-3M-OA 01"
  desc: string;
  indicadores?: string[];
  questions?: Question[];
}

export interface CurriculumAxisItem {
  nombre: string;
  oas: CurriculumOAItem[];
}

export interface CurriculumNivelItem {
  nivel: string; // e.g. "8° Básico"
  ejes: Record<string, CurriculumAxisItem>;
}

// =======================================================
// HABILIDADES TRONCALES OFICIALES MINEDUC (8° Básico a 4° Medio)
// =======================================================
export const HABILIDADES_TRONCALES_MINEDUC: HabilidadTroncal[] = [
  {
    id: "resolver-problemas",
    nombre: "Resolver Problemas",
    descripcion: "Plantear y resolver problemas de diversa complejidad en contextos cotidianos, científicos y técnicos, aplicando estrategias como modelación, descomposición en subproblemas y validación de soluciones.",
    icon: "Target"
  },
  {
    id: "argumentar-comunicar",
    nombre: "Argumentar y Comunicar",
    descripcion: "Explicar razonamientos, deducciones y procedimientos usando lenguaje matemático riguroso; evaluar la validez de conjeturas y refutar afirmaciones erróneas.",
    icon: "MessageSquareText"
  },
  {
    id: "modelar",
    nombre: "Modelar",
    descripcion: "Traducir situaciones reales a estructuras y expresiones matemáticas para analizar variables, predecir comportamientos y tomar decisiones fundamentadas.",
    icon: "Cpu"
  },
  {
    id: "representar",
    nombre: "Representar",
    descripcion: "Manejar y transferir información fluidamente entre registros concretos, pictóricos, simbólicos, gráficos, tabulares y digitales.",
    icon: "LayoutGrid"
  }
];

// =======================================================
// ACTITUDES TRANSVERSALES (OAA) MINEDUC
// =======================================================
export const ACTITUDES_OAA_MINEDUC: ActitudOAA[] = [
  {
    id: "oaa-a",
    codigo: "OAA A",
    descripcion: "Abordar con flexibilidad y creatividad la búsqueda de soluciones."
  },
  {
    id: "oaa-b",
    codigo: "OAA B",
    descripcion: "Demostrar curiosidad y perseverancia frente a desafíos matemáticos."
  },
  {
    id: "oaa-c",
    codigo: "OAA C",
    descripcion: "Demostrar rigor, esfuerzo y precisión en el trabajo sistemático."
  },
  {
    id: "oaa-d",
    codigo: "OAA D",
    descripcion: "Trabajar colaborativamente, respetando argumentos y aportes de otros."
  },
  {
    id: "oaa-e",
    codigo: "OAA E",
    descripcion: "Actuar críticamente frente a datos cuantitativos y su uso en la sociedad."
  },
  {
    id: "oaa-f",
    codigo: "OAA F",
    descripcion: "Emplear tecnologías digitales de manera ética, responsable y fundamentada."
  }
];

// =======================================================
// MATRIZ CURRICULAR OFICIAL MINEDUC
// =======================================================
export const CURRICULUM_COMPLETO_MINEDUC: Record<string, CurriculumNivelItem> = {
  // ==========================================
  // 7° BÁSICO (14 OAs Oficiales MINEDUC 2026)
  // ==========================================
  "7_basico": {
    nivel: "7° Básico",
    ejes: {
      numeros: {
        nombre: "Números",
        oas: [
          {
            id: "OA 01",
            code: "MA07 OA 01",
            desc: "Mostrar que comprenden la adición y la sustracción de números enteros en la recta numérica.",
            indicadores: [
              "Representan números enteros en la recta numérica en contextos de temperatura y altitud.",
              "Aplican reglas de signos para sumar y restar enteros con signos iguales y opuestos."
            ],
            questions: [
              {
                id: "7b-oa01-1",
                text: "Calcula el resultado de la siguiente suma de números enteros: $(-15) + (+8) - (-4)$",
                options: ["$-3$", "$-11$", "$+3$", "$-19$"],
                correctAnswer: 0,
                explanation: "$(-15) + 8 = -7$. Luego $-7 - (-4) = -7 + 4 = -3$.",
                grade: "7° Básico",
                topic: "Adición y Sustracción de Enteros",
              }
            ]
          },
          {
            id: "OA 02",
            code: "MA07 OA 02",
            desc: "Explicar el porcentaje de manera concreta, pictórica y simbólica y resolver problemas de aplicación.",
            indicadores: [
              "Calculan porcentajes, descuentos e IVA (19%) en situaciones comerciales.",
              "Representan porcentajes como fracciones y razones decimales."
            ],
            questions: [
              {
                id: "7b-oa02-1",
                text: "Una polera tiene un precio original de $\\$15.000$ y cuenta con un $20\\%$ de descuento. ¿Cuál es el precio final a pagar?",
                options: ["$\\$12.000$", "$\\$13.000$", "$\\$3.000$", "$\\$11.500$"],
                correctAnswer: 0,
                explanation: "Descuento $= 15000 \\cdot 0.20 = \\$3000$. Precio final $= 15000 - 3000 = \\$12.000$.",
                grade: "7° Básico",
                topic: "Cálculo de Porcentajes",
              }
            ]
          },
          {
            id: "OA 03",
            code: "MA07 OA 03",
            desc: "Resolver problemas que involucren la multiplicación y la división de fracciones y de decimales positivos.",
            indicadores: [
              "Multiplican y dividen fracciones positivas simplificando al máximo.",
              "Resuelven problemas de medidas fraccionarias en recetas y reparto."
            ],
            questions: [
              {
                id: "7b-oa03-1",
                text: "Calcula el resultado exacto de: $\\frac{3}{5} \\cdot \\frac{10}{9}$",
                options: ["$\\frac{2}{3}$", "$\\frac{30}{45}$", "$\\frac{1}{2}$", "$\\frac{5}{6}$"],
                correctAnswer: 0,
                explanation: "$\\frac{3 \\cdot 10}{5 \\cdot 9} = \\frac{30}{45} = \\frac{2}{3}$.",
                grade: "7° Básico",
                topic: "Multiplicación de Fracciones",
              }
            ]
          },
          {
            id: "OA 04",
            code: "MA07 OA 04",
            desc: "Mostrar que comprenden las potencias de base 10 de exponente natural.",
            indicadores: [
              "Expresan cantidades muy grandes en notación científica con potencias de base 10."
            ],
            questions: [
              {
                id: "7b-oa04-1",
                text: "¿Cómo se escribe el número $4.500.000$ en notación científica usando potencias de base 10?",
                options: ["$4.5 \\times 10^6$", "$45 \\times 10^5$", "$4.5 \\times 10^5$", "$0.45 \\times 10^7$"],
                correctAnswer: 0,
                explanation: "La coma se desplaza 6 posiciones hacia la izquierda: $4.5 \\times 10^6$.",
                grade: "7° Básico",
                topic: "Potencias de Base 10",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 06",
            code: "MA07 OA 06",
            desc: "Utilizar el lenguaje algebraico para generalizar relaciones entre números y establecer reglas.",
            indicadores: ["Traducen enunciados verbales a expresiones algebraicas y reducen términos semejantes."],
            questions: [
              {
                id: "7b-oa06-1",
                text: "¿Cuál es la expresión algebraica que representa 'el triple de un número aumentado en 5'?",
                options: ["$3x + 5$", "$3(x + 5)$", "$x^3 + 5$", "$3x - 5$"],
                correctAnswer: 0,
                explanation: "El triple de $x$ es $3x$, aumentado en 5 resulta en $3x + 5$.",
                grade: "7° Básico",
                topic: "Lenguaje Algebraico",
              }
            ]
          },
          {
            id: "OA 08",
            code: "MA07 OA 08",
            desc: "Mostrar que comprenden las proporciones directas e inversas: tablas, gráficos y constante k.",
            indicadores: ["Diferencian proporcionalidad directa e inversa calculando la constante $k$."],
            questions: [
              {
                id: "7b-oa08-1",
                text: "Si 4 obreros construyen un muro en 6 horas, ¿cuántas horas tardarán 8 obreros trabajando al mismo ritmo?",
                options: ["3 horas", "12 horas", "4 horas", "2 horas"],
                correctAnswer: 0,
                explanation: "Es proporción inversa: $4 \\cdot 6 = 24$. Luego $24 / 8 = 3$ horas.",
                grade: "7° Básico",
                topic: "Proporcionalidad Inversa",
              }
            ]
          },
          {
            id: "OA 09",
            code: "MA07 OA 09",
            desc: "Modelar y resolver ecuaciones e inecuaciones lineales de la forma ax + b = c.",
            indicadores: ["Despejan incógnitas lineales aplicando operaciones inversas."],
            questions: [
              {
                id: "7b-oa09-1",
                text: "Resuelve la ecuación lineal: $4x - 7 = 25$",
                options: ["$x = 8$", "$x = 6$", "$x = 7$", "$x = 9$"],
                correctAnswer: 0,
                explanation: "$4x = 25 + 7 = 32 \\implies x = 32 / 4 = 8$.",
                grade: "7° Básico",
                topic: "Ecuaciones Lineales",
              }
            ]
          }
        ]
      },
      geometria: {
        nombre: "Geometría",
        oas: [
          {
            id: "OA 11",
            code: "MA07 OA 11",
            desc: "Mostrar que comprenden el círculo y su circunferencia: perímetro y área.",
            indicadores: ["Aplican $P = 2\\pi r$ y $A = \\pi r^2$ en problemas contextualizados."],
            questions: [
              {
                id: "7b-oa11-1",
                text: "Calcula el área de un círculo cuyo radio es $r = 5\\text{ cm}$ (usa $\\pi \\approx 3.14$):",
                options: ["$78.5\\text{ cm}^2$", "$31.4\\text{ cm}^2$", "$15.7\\text{ cm}^2$", "$100\\text{ cm}^2$"],
                correctAnswer: 0,
                explanation: "$A = \\pi \\cdot r^2 = 3.14 \\cdot 25 = 78.5\\text{ cm}^2$.",
                grade: "7° Básico",
                topic: "Área del Círculo",
              }
            ]
          },
          {
            id: "OA 12",
            code: "MA07 OA 12",
            desc: "Construir triángulos y calcular la suma de ángulos interiores y exteriores.",
            indicadores: ["Calculan ángulos faltantes aplicando $\\alpha + \\beta + \\gamma = 180^\\circ$."],
            questions: [
              {
                id: "7b-oa12-1",
                text: "En un triángulo, dos de sus ángulos interiores miden $45^\\circ$ y $65^\\circ$. ¿Cuánto mide el tercer ángulo interior?",
                options: ["$70^\\circ$", "$80^\\circ$", "$60^\\circ$", "$90^\\circ$"],
                correctAnswer: 0,
                explanation: "La suma interior es $180^\\circ$: $180 - (45 + 65) = 180 - 110 = 70^\\circ$.",
                grade: "7° Básico",
                topic: "Ángulos en el Triángulo",
              }
            ]
          },
          {
            id: "OA 14",
            code: "MA07 OA 14",
            desc: "Identificar y realizar transformaciones isométricas (traslación, rotación, reflexión).",
            indicadores: ["Aplican vectores de traslación en el plano cartesiano."],
            questions: [
              {
                id: "7b-oa14-1",
                text: "Al aplicar una traslación mediante el vector $\\vec{v} = (3, -2)$ al punto $P(1, 4)$, ¿cuáles son las nuevas coordenadas $P'$?",
                options: ["$P'(4, 2)$", "$P'(-2, 6)$", "$P'(3, -8)$", "$P'(2, 2)$"],
                correctAnswer: 0,
                explanation: "$P' = (1 + 3, 4 - 2) = (4, 2)$.",
                grade: "7° Básico",
                topic: "Traslaciones Isométricas",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 16",
            code: "MA07 OA 16",
            desc: "Representar datos obtenidos en una muestra mediante tablas de frecuencias y gráficos.",
            indicadores: ["Calculan promedio, mediana y moda en conjuntos de datos."],
            questions: [
              {
                id: "7b-oa16-1",
                text: "Calcula la media aritmética (promedio) de las siguientes notas: $5.0, 6.0, 7.0, 6.0$:",
                options: ["$6.0$", "$5.5$", "$6.5$", "$5.8$"],
                correctAnswer: 0,
                explanation: "$\\text{Promedio} = \\frac{5.0 + 6.0 + 7.0 + 6.0}{4} = \\frac{24}{4} = 6.0$.",
                grade: "7° Básico",
                topic: "Medidas de Tendencia Central",
              }
            ]
          },
          {
            id: "OA 18",
            code: "MA07 OA 18",
            desc: "Calcular la probabilidad de un evento mediante la regla de Laplace.",
            indicadores: ["Aplican la razón $P(A) = \\frac{\\text{casos favorables}}{\\text{casos posibles}}$."],
            questions: [
              {
                id: "7b-oa18-1",
                text: "Al lanzar un dado común de 6 caras, ¿cuál es la probabilidad de obtener un número primo (2, 3 o 5)?",
                options: ["$\\frac{3}{6} = 50\\%$", "$\\frac{1}{6}$", "$\\frac{2}{6} = 33.3\\%$", "$\\frac{4}{6} = 66.7\\%$"],
                correctAnswer: 0,
                explanation: "Casos favorables: $\\{2, 3, 5\\}$ (3 casos). Casos posibles: 6. $P = \\frac{3}{6} = \\frac{1}{2} = 50\\%$.",
                grade: "7° Básico",
                topic: "Regla de Laplace",
              }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // 8° BÁSICO (17 OAs Oficiales MINEDUC)
  // ==========================================
  "8_basico": {
    nivel: "8° Básico",
    ejes: {
      numeros: {
        nombre: "Números",
        oas: [
          {
            id: "OA 01",
            code: "MA08 OA 01",
            desc: "Mostrar que comprenden la multiplicación y la división de números enteros.",
            indicadores: [
              "Aplican la regla de los signos en operaciones aritméticas.",
              "Resuelven problemas rutinarios y no rutinarios con ganancias, pérdidas, temperaturas y altitudes."
            ],
            questions: [
              {
                id: "8b-oa01-1",
                text: "Calcula el resultado de la siguiente operación combinada con enteros: $(-12) \\div 3 + (-4) \\cdot (-2)$",
                options: ["$4$", "$-12$", "$-4$", "$12$"],
                correctAnswer: 0,
                explanation: "$(-12) \\div 3 = -4$. Luego $(-4) \\cdot (-2) = 8$. Finalmente $(-4) + 8 = 4$.",
                grade: "8° Básico",
                topic: "Números Enteros",
              },
              {
                id: "8b-oa01-2",
                text: "¿Cuál es el valor de $\\frac{(-3) \\cdot (-8)}{-6}$?",
                options: ["$-4$", "$4$", "$-6$", "$6$"],
                correctAnswer: 0,
                explanation: "Numerador: $(-3) \\cdot (-8) = 24$. Denominador: $-6$. Entonces $24 \\div (-6) = -4$.",
                grade: "8° Básico",
                topic: "Multiplicación y División de Enteros",
              }
            ]
          },
          {
            id: "OA 02",
            code: "MA08 OA 02",
            desc: "Utilizar las operaciones de multiplicación y división con números racionales ($\\mathbb{Q}$) en resolución de problemas.",
            indicadores: [
              "Multiplican y dividen fracciones y decimales positivos y negativos.",
              "Ubican y ordenan resultados en la recta numérica."
            ],
            questions: [
              {
                id: "8b-oa02-1",
                text: "Calcula el valor exacto de: $\\left(-\\frac{3}{4}\\right) \\cdot \\left(\\frac{8}{9}\\right)$",
                options: ["$-\\frac{2}{3}$", "$\\frac{2}{3}$", "$-\\frac{24}{36}$", "$-\\frac{1}{2}$"],
                correctAnswer: 0,
                explanation: "$-\\frac{3 \\cdot 8}{4 \\cdot 9} = -\\frac{24}{36} = -\\frac{2}{3}$.",
                grade: "8° Básico",
                topic: "Multiplicación de Racionales",
              }
            ]
          },
          {
            id: "OA 03",
            code: "MA08 OA 03",
            desc: "Explicar la multiplicación, la división y el cálculo de potencias de potencias de base y exponente natural hasta 3.",
            indicadores: [
              "Aplican propiedades de potencias de igual base y de igual exponente.",
              "Reducen expresiones numéricas aplicando $a^n \\cdot a^m = a^{n+m}$ y $(a^n)^m = a^{n \\cdot m}$."
            ],
            questions: [
              {
                id: "8b-oa03-1",
                text: "Aplica propiedades de potencias para simplificar: $\\frac{3^5 \\cdot 3^2}{(3^3)^2}$",
                options: ["$3^1 = 3$", "$3^3 = 27$", "$3^0 = 1$", "$3^2 = 9$"],
                correctAnswer: 0,
                explanation: "Numerador: $3^{5+2} = 3^7$. Denominador: $3^{3 \\cdot 2} = 3^6$. División: $3^{7-6} = 3^1 = 3$.",
                grade: "8° Básico",
                topic: "Propiedades de Potencias",
              }
            ]
          },
          {
            id: "OA 04",
            code: "MA08 OA 04",
            desc: "Mostrar que comprenden las raíces cuadradas de números naturales.",
            indicadores: [
              "Estiman raíces no exactas entre enteros consecutivos.",
              "Calculan raíces exactas geométricamente usando áreas de cuadrados.",
              "Resuelven problemas prácticos."
            ],
            questions: [
              {
                id: "8b-oa04-1",
                text: "¿Entre qué dos números enteros consecutivos se ubica la raíz cuadrada $\\sqrt{45}$ en la recta numérica?",
                options: ["Entre 6 y 7", "Entre 5 y 6", "Entre 7 y 8", "Entre 8 y 9"],
                correctAnswer: 0,
                explanation: "Como $6^2 = 36$ y $7^2 = 49$, y $36 < 45 < 49$, entonces $6 < \\sqrt{45} < 7$.",
                grade: "8° Básico",
                topic: "Estimación de Raíces",
              }
            ]
          },
          {
            id: "OA 05",
            code: "MA08 OA 05",
            desc: "Resolver problemas que involucran variaciones porcentuales (interés simple, IPC, descuentos sucesivos).",
            indicadores: [
              "Calculan aumentos y disminuciones porcentuales sucesivas.",
              "Representan variaciones porcentuales mediante factores decimales multiplicativos."
            ],
            questions: [
              {
                id: "8b-oa05-1",
                text: "Un producto cuesta $\\$50.000$ y recibe dos aumentos sucesivos del $10\\%$ y luego del $10\\%$. ¿Cuál es el precio final?",
                options: ["$\\$60.500$", "$\\$60.000$", "$\\$55.000$", "$\\$62.000$"],
                correctAnswer: 0,
                explanation: "$50.000 \\times 1.10 = 55.000$. Luego $55.000 \\times 1.10 = \\$60.500$ (aumento real del $21\\%$).",
                grade: "8° Básico",
                topic: "Variaciones Porcentuales Sucesivas",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 06",
            code: "MA08 OA 06",
            desc: "Mostrar que comprenden operaciones con expresiones algebraicas fraccionarias simples.",
            indicadores: [
              "Simplifican expresiones fraccionarias lineales.",
              "Suman y multiplican fracciones algebraicas con denominadores monómicos."
            ],
            questions: [
              {
                id: "8b-oa06-1",
                text: "Simplifica la expresión fraccionaria algebraica: $\\frac{12x^3y^2}{4xy}$ para $x, y \\neq 0$",
                options: ["$3x^2y$", "$3xy$", "$8x^2y$", "$3x^4y^3$"],
                correctAnswer: 0,
                explanation: "$\\frac{12}{4} = 3$, $\\frac{x^3}{x} = x^2$, $\\frac{y^2}{y} = y$. Resultado: $3x^2y$.",
                grade: "8° Básico",
                topic: "Fracciones Algebraicas Simples",
              }
            ]
          },
          {
            id: "OA 07",
            code: "MA08 OA 07",
            desc: "Mostrar que comprenden la noción de función por medio de un cambio lineal.",
            indicadores: [
              "Identifican variable dependiente e independiente.",
              "Representan funciones afines y lineales en tablas de valores y plano cartesiano."
            ],
            questions: [
              {
                id: "8b-oa07-1",
                text: "En la función lineal $f(x) = 4x$, si la variable independiente $x = -3$, ¿cuál es el valor de la variable dependiente $f(x)$?",
                options: ["$-12$", "$12$", "$-7$", "$1$"],
                correctAnswer: 0,
                explanation: "$f(-3) = 4(-3) = -12$.",
                grade: "8° Básico",
                topic: "Noción de Función Lineal",
              }
            ]
          },
          {
            id: "OA 08",
            code: "MA08 OA 08",
            desc: "Modelar situaciones usando ecuaciones lineales de la forma ax + b = c, ax = b + cx, a(x + b) = c(x + d).",
            indicadores: [
              "Traducen enunciados verbales a ecuaciones de primer grado.",
              "Despejan incógnitas aplicando propiedades de las operaciones inversas."
            ],
            questions: [
              {
                id: "8b-oa08-1",
                text: "Resuelve la ecuación: $3(x + 4) = 2(x + 9)$",
                options: ["$x = 6$", "$x = 5$", "$x = 7$", "$x = 3$"],
                correctAnswer: 0,
                explanation: "$3x + 12 = 2x + 18 \\implies 3x - 2x = 18 - 12 \\implies x = 6$.",
                grade: "8° Básico",
                topic: "Ecuaciones Lineales con Paréntesis",
              }
            ]
          },
          {
            id: "OA 09",
            code: "MA08 OA 09",
            desc: "Resolver inecuaciones lineales con coeficientes racionales.",
            indicadores: [
              "Representan conjuntos solución en la recta numérica.",
              "Interpretan desigualdades en contextos de cotas y restricciones de capacidad/presupuesto."
            ],
            questions: [
              {
                id: "8b-oa09-1",
                text: "Resuelve la inecuación en $\\mathbb{R}$: $2x - 5 < 11$",
                options: ["$x < 8$", "$x > 8$", "$x \\le 8$", "$x < 3$"],
                correctAnswer: 0,
                explanation: "$2x < 11 + 5 = 16 \\implies x < \\frac{16}{2} = 8$. Conjunto: $]-\\infty, 8[$.",
                grade: "8° Básico",
                topic: "Inecuaciones Lineales",
              }
            ]
          },
          {
            id: "OA 10",
            code: "MA08 OA 10",
            desc: "Mostrar que comprenden la función afín (f(x) = mx + n).",
            indicadores: [
              "Determinan pendiente ($m$) y coeficiente de posición ($n$).",
              "Modelan situaciones con costo fijo y costo variable."
            ],
            questions: [
              {
                id: "8b-oa10-1",
                text: "Un plan telefónico cobra un cargo fijo de $\\$5.000$ más $\\$100$ por cada minuto hablado. ¿Qué función modela el costo total $C(x)$?",
                options: ["$C(x) = 100x + 5000$", "$C(x) = 5000x + 100$", "$C(x) = 100x - 5000$", "$C(x) = 5100x$"],
                correctAnswer: 0,
                explanation: "La tarifa fija es el coeficiente de posición $n = 5000$ y el costo por minuto es la pendiente $m = 100$: $C(x) = 100x + 5000$.",
                grade: "8° Básico",
                topic: "Modelamiento con Función Afín",
              }
            ]
          }
        ]
      },
      geometria: {
        nombre: "Geometría",
        oas: [
          {
            id: "OA 11",
            code: "MA08 OA 11",
            desc: "Desarrollar fórmulas para encontrar el área de superficies y el volumen de prismas rectos y cilindros.",
            indicadores: [
              "Despliegan redes de prismas y cilindros para calcular área total.",
              "Calculan volumen mediante $V = A_{\\text{base}} \\cdot h$.",
              "Calculan volumen y área superficial de cubos y paralelepípedos rectangulares.",
              "Modelan capacidad de estanques y recipientes industriales ($1\\text{ m}^3 = 1.000\\text{ L}$)."
            ],
            questions: [
              ...DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS.slice(12, 20),
              {
                id: "8b-oa11-1",
                text: "Calcula el volumen de un cilindro con radio basal $r = 3\\text{ cm}$ y altura $h = 10\\text{ cm}$ (usa $\\pi \\approx 3.14$):",
                options: ["$282.6\\text{ cm}^3$", "$94.2\\text{ cm}^3$", "$565.2\\text{ cm}^3$", "$90\\text{ cm}^3$"],
                correctAnswer: 0,
                explanation: "$V = \\pi r^2 h = 3.14 \\times (3^2) \\times 10 = 3.14 \\times 9 \\times 10 = 282.6\\text{ cm}^3$.",
                grade: "8° Básico",
                topic: "Volumen del Cilindro",
              }
            ]
          },
          {
            id: "OA 12",
            code: "MA08 OA 12",
            desc: "Explicar la validez del Teorema de Pitágoras y aplicarlo a problemas geométricos y cotidianos.",
            indicadores: [
              "Verifican $a^2 + b^2 = c^2$ de forma geométrica y algebraica.",
              "Calculan medidas desconocidas de lados en triángulos rectángulos.",
              "Identifican tríos pitagóricos y aplican el teorema a problemas de escaleras, postes y diagonales."
            ],
            questions: [
              ...DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS.slice(0, 6)
            ]
          },
          {
            id: "OA 13",
            code: "MA08 OA 13",
            desc: "Describir la posición y movimiento de figuras 2D en el plano cartesiano mediante distancias, vectores de traslación, rotaciones y reflexiones.",
            indicadores: [
              "Calculan distancias entre puntos aplicando el teorema de Pitágoras en el plano cartesiano.",
              "Determinan distancias desde el origen y calculan áreas y perímetros de triángulos en el plano.",
              "Aplican traslaciones con vectores en el plano cartesiano."
            ],
            questions: [
              ...CLASE_DESAFIANTE_QUESTIONS_WITH_VARIANTS.slice(0, 13),
              ...DON_BOSCO_8BASICO_QUESTIONS_WITH_VARIANTS.slice(6, 12),
              {
                id: "8b-oa13-1",
                text: "Si al punto $P(3, -2)$ se le aplica un vector de traslación $\\vec{v} = (-5, 4)$, ¿cuáles son las coordenadas del punto transformado $P'$?",
                options: ["$P'(-2, 2)$", "$P'(8, -6)$", "$P'(-2, -6)$", "$P'(2, -2)$"],
                correctAnswer: 0,
                explanation: "$P' = (3 + (-5), -2 + 4) = (-2, 2)$.",
                grade: "8° Básico",
                topic: "Traslación Vectorial 2D",
              }
            ]
          },
          {
            id: "OA 14",
            code: "MA08 OA 14",
            desc: "Componer transformaciones isométricas en el plano cartesiano y el espacio.",
            indicadores: [
              "Aplican sucesiones de traslaciones, reflexiones y rotaciones sobre polígonos.",
              "Identifican simetrías axiales y centrales en teselaciones y poliedros."
            ],
            questions: [
              ...CLASE_DESAFIANTE_QUESTIONS_WITH_VARIANTS.slice(13, 15),
              {
                id: "8b-oa14-1",
                text: "¿Qué ocurre con el área y el perímetro de un triángulo tras aplicar dos reflexiones sucesivas respecto a rectas paralelas?",
                options: [
                  "Permanecen invariables (la figura resultante es congruente a la original)",
                  "El área se duplica",
                  "El perímetro se reduce a la mitad",
                  "Se invierte la orientación y cambia el tamaño"
                ],
                correctAnswer: 0,
                explanation: "La composición de isometrías conserva distancias, ángulos y áreas (la composición de dos reflexiones en ejes paralelos equivale a una traslación pura).",
                grade: "8° Básico",
                topic: "Composición de Isometrías",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 15",
            code: "MA08 OA 15",
            desc: "Mostrar que comprenden las medidas de posición: percentiles y cuartiles.",
            indicadores: [
              "Calculan $Q_1, Q_2, Q_3$ en datos agrupados y no agrupados.",
              "Construyen e interpretan diagramas de cajón (box-plots)."
            ],
            questions: [
              {
                id: "8b-oa15-1",
                text: "En un conjunto ordenado de datos, ¿qué porcentaje de observaciones es igual o menor al segundo cuartil ($Q_2$)?",
                options: ["$50\\%$ (equivale a la mediana)", "$25\\%$", "$75\\%$", "$100\\%$"],
                correctAnswer: 0,
                explanation: "El segundo cuartil $Q_2$ divide la distribución en dos mitades iguales ($50\\%$), coincidiendo con la mediana.",
                grade: "8° Básico",
                topic: "Cuartiles y Mediana",
              }
            ]
          },
          {
            id: "OA 16",
            code: "MA08 OA 16",
            desc: "Evaluar la presentación de datos en gráficos y la validez de conclusiones emitidas en medios de comunicación.",
            indicadores: [
              "Identifican escalas engañosas o sesgos en ejes de gráficos circulares e histogramas."
            ],
            questions: [
              {
                id: "8b-oa16-1",
                text: "Un gráfico de barras en televisión inicia su eje vertical en $1.000$ en lugar de $0$. ¿Qué distorsión visual provoca?",
                options: [
                  "Exagera visualmente las diferencias entre barras",
                  "Hace que todas las barras se vean iguales",
                  "Cambia los valores numéricos de los datos",
                  "Convierte los datos en un gráfico circular"
                ],
                correctAnswer: 0,
                explanation: "Al cortar el origen del eje vertical (eje truncado), las diferencias relativas aparentan ser mucho mayores de lo que realmente son.",
                grade: "8° Básico",
                topic: "Análisis Crítico de Gráficos",
              }
            ]
          },
          {
            id: "OA 17",
            code: "MA08 OA 17",
            desc: "Explicar el principio combinatorio multiplicativo y el cálculo de probabilidades.",
            indicadores: [
              "Construyen diagramas de árbol.",
              "Aplican la regla del producto para determinar el espacio muestral y la probabilidad clásica."
            ],
            questions: [
              {
                id: "8b-oa17-1",
                text: "Al lanzar una moneda y un dado estándar de 6 caras, ¿cuántos resultados posibles componen el espacio muestral?",
                options: ["$12$ resultados", "$8$ resultados", "$6$ resultados", "$36$ resultados"],
                correctAnswer: 0,
                explanation: "Moneda (2 resultados) $\\times$ Dado (6 resultados) $= 2 \\times 6 = 12$ resultados posibles.",
                grade: "8° Básico",
                topic: "Principio Multiplicativo",
              }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // 1° MEDIO (16 OAs Oficiales MINEDUC)
  // ==========================================
  "1_medio": {
    nivel: "1° Medio",
    ejes: {
      numeros: {
        nombre: "Números",
        oas: [
          {
            id: "OA 01",
            code: "MA1M OA 01",
            desc: "Calcular operaciones con números racionales ($\\mathbb{Q}$) en forma simbólica.",
            indicadores: [
              "Resuelven operatoria combinada con fracciones y decimales periódicos/semiperiódicos.",
              "Aproximan valores por redondeo y truncamiento."
            ],
            questions: [
              {
                id: "1m-oa01-1",
                text: "¿Cuál es el inverso multiplicativo (recíproco) del número racional $-\\frac{4}{7}$?",
                options: ["$-\\frac{7}{4}$", "$\\frac{4}{7}$", "$\\frac{7}{4}$", "$-\\frac{4}{7}$"],
                correctAnswer: 0,
                explanation: "El inverso multiplicativo de $\\frac{a}{b}$ es $\\frac{b}{a}$ manteniendo el mismo signo: $-\\frac{7}{4}$.",
                grade: "1° Medio",
                topic: "Propiedades en Racionales",
              }
            ]
          },
          {
            id: "OA 02",
            code: "MA1M OA 02",
            desc: "Mostrar que comprenden potencias de base racional y exponente entero.",
            indicadores: [
              "Aplican propiedades operacionales con potencias.",
              "Interpretan exponentes negativos ($a^{-n} = \\frac{1}{a^n}$).",
              "Modelan situaciones de crecimiento y decrecimiento."
            ],
            questions: [
              {
                id: "1m-oa02-1",
                text: "Calcula el valor de la expresión: $\\left(\\frac{3}{2}\\right)^{-3}$",
                options: ["$\\frac{8}{27}$", "$-\\frac{27}{8}$", "$\\frac{27}{8}$", "$-\\frac{8}{27}$"],
                correctAnswer: 0,
                explanation: "Invertimos la base por el exponente negativo: $\\left(\\frac{2}{3}\\right)^3 = \\frac{2^3}{3^3} = \\frac{8}{27}$.",
                grade: "1° Medio",
                topic: "Exponentes Enteros",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 03",
            code: "MA1M OA 03",
            desc: "Desarrollar productos notables de manera concreta, pictórica y simbólica.",
            indicadores: [
              "Desarrollan cuadrado de binomio, suma por diferencia, binomio con término común y cubo de binomio.",
              "Factorizan expresiones algebraicas."
            ],
            questions: [
              {
                id: "1m-oa03-1",
                text: "Desarrolla el cuadrado de binomio $(3x - 4)^2$:",
                options: ["$9x^2 - 24x + 16$", "$9x^2 - 16$", "$9x^2 - 12x + 16$", "$3x^2 - 24x + 16$"],
                correctAnswer: 0,
                explanation: "$(3x)^2 - 2(3x)(4) + 4^2 = 9x^2 - 24x + 16$.",
                grade: "1° Medio",
                topic: "Productos Notables",
              }
            ]
          },
          {
            id: "OA 04",
            code: "MA1M OA 04",
            desc: "Resolver sistemas de ecuaciones lineales ($2 \\times 2$).",
            indicadores: [
              "Aplican métodos de reducción, sustitución e igualación.",
              "Resuelven problemas contextualizados interpretando la solución gráfica (rectas secantes, paralelas o coincidentes)."
            ],
            questions: [
              {
                id: "1m-oa04-1",
                text: "Resuelve el sistema: $\\begin{cases} x + y = 14 \\\\ x - y = 4 \\end{cases}$. ¿Cuál es el par ordenado $(x,y)$?",
                options: ["$(9, 5)$", "$(10, 4)$", "$(8, 6)$", "$(7, 7)$"],
                correctAnswer: 0,
                explanation: "Sumando ambas ecuaciones: $2x = 18 \\implies x = 9$. Luego $9 + y = 14 \\implies y = 5$.",
                grade: "1° Medio",
                topic: "Sistemas 2x2",
              }
            ]
          },
          {
            id: "OA 05",
            code: "MA1M OA 05",
            desc: "Graficar ecuaciones lineales de la forma ax + by = c.",
            indicadores: [
              "Determinan pendientes, intersecciones con los ejes y transforman entre la forma general y principal de la recta."
            ],
            questions: [
              {
                id: "1m-oa05-1",
                text: "¿Cuál es la pendiente $m$ y el coeficiente de posición $n$ de la recta $2x + 3y = 6$?",
                options: [
                  "$m = -\\frac{2}{3}, \\; n = 2$",
                  "$m = \\frac{2}{3}, \\; n = 6$",
                  "$m = -2, \\; n = 3$",
                  "$m = -\\frac{3}{2}, \\; n = 2$"
                ],
                correctAnswer: 0,
                explanation: "Despejando $y$: $3y = -2x + 6 \\implies y = -\\frac{2}{3}x + 2$. Pendiente $m = -\\frac{2}{3}$, coeficiente $n = 2$.",
                grade: "1° Medio",
                topic: "Forma Principal de la Recta",
              }
            ]
          }
        ]
      },
      geometria: {
        nombre: "Geometría",
        oas: [
          {
            id: "OA 06",
            code: "MA1M OA 06",
            desc: "Desarrollar fórmulas de área y perímetro de sectores y segmentos circulares (60°, 90°, 120°, 180°).",
            indicadores: [
              "Calculan longitud de arco y área del sector circular en función del radio y ángulo central."
            ],
            questions: [
              {
                id: "1m-oa06-1",
                text: "Calcula el área de un sector circular con ángulo central de $90^\\circ$ en un círculo de radio $r = 6\\text{ cm}$:",
                options: ["$9\\pi\\text{ cm}^2$", "$36\\pi\\text{ cm}^2$", "$18\\pi\\text{ cm}^2$", "$6\\pi\\text{ cm}^2$"],
                correctAnswer: 0,
                explanation: "Un sector de $90^\\circ$ es la cuarta parte del círculo: $A = \\frac{90^\\circ}{360^\\circ}\\pi(6^2) = \\frac{1}{4}(36\\pi) = 9\\pi\\text{ cm}^2$.",
                grade: "1° Medio",
                topic: "Sector Circular",
              }
            ]
          },
          {
            id: "OA 07",
            code: "MA1M OA 07",
            desc: "Desarrollar fórmulas para área y volumen del cono.",
            indicadores: [
              "Calculan generatriz mediante Pitágoras.",
              "Determinan área lateral, área total y volumen ($V = \\frac{1}{3}\\pi r^2 h$)."
            ],
            questions: [
              {
                id: "1m-oa07-1",
                text: "Un cono tiene radio basal $r = 6\\text{ cm}$ y altura $h = 8\\text{ cm}$. ¿Cuál es su generatriz $g$ y volumen $V$?",
                options: [
                  "Generatriz $g = 10\\text{ cm}$ y Volumen $V = 96\\pi\\text{ cm}^3$",
                  "Generatriz $g = 14\\text{ cm}$ y Volumen $V = 288\\pi\\text{ cm}^3$",
                  "Generatriz $g = 10\\text{ cm}$ y Volumen $V = 288\\pi\\text{ cm}^3$",
                  "Generatriz $g = 8\\text{ cm}$ y Volumen $V = 48\\pi\\text{ cm}^3$"
                ],
                correctAnswer: 0,
                explanation: "$g = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. $V = \\frac{1}{3}\\pi (6^2)(8) = \\frac{1}{3}\\pi(36)(8) = 96\\pi\\text{ cm}^3$.",
                grade: "1° Medio",
                topic: "Volumen y Cono",
              }
            ]
          },
          {
            id: "OA 08",
            code: "MA1M OA 08",
            desc: "Mostrar que comprenden la homotecia de figuras planas.",
            indicadores: [
              "Aplican el centro y factor de homotecia ($k$).",
              "Determinan relaciones entre perímetros y áreas de figuras homotéticas."
            ],
            questions: DON_BOSCO_HOMOTECIA_1MEDIO_QUESTIONS,
          },
          {
            id: "OA 09",
            code: "MA1M OA 09",
            desc: "Desarrollar el Teorema de Tales mediante semejanza y proporcionalidad.",
            indicadores: [
              "Calculan trazos desconocidos en haces de rectas paralelas cortadas por transversales."
            ],
            questions: [
              {
                id: "1m-oa09-1",
                text: "En dos transversales cortadas por rectas paralelas $L_1 \\parallel L_2 \\parallel L_3$, los segmentos determinados en la primera son $4\\text{ cm}$ y $6\\text{ cm}$. Si en la segunda el primer segmento mide $8\\text{ cm}$, ¿cuánto mide el segmento homólogo $x$?",
                options: ["$12\\text{ cm}$", "$10\\text{ cm}$", "$16\\text{ cm}$", "$9\\text{ cm}$"],
                correctAnswer: 0,
                explanation: "Por Teorema de Tales: $\\frac{4}{6} = \\frac{8}{x} \\implies 4x = 48 \\implies x = 12\\text{ cm}$.",
                grade: "1° Medio",
                topic: "Teorema de Tales",
              }
            ]
          },
          {
            id: "OA 10",
            code: "MA1M OA 10",
            desc: "Aplicar criterios de semejanza de triángulos (AA, LLL, LAL) en problemas geométricos.",
            indicadores: [
              "Verifican semejanza mediante razones de lados homólogos y congruencia angular.",
              "Resuelven problemas de cálculo de alturas inaccesibles."
            ],
            questions: [
              {
                id: "1m-oa10-1",
                text: "Dos triángulos tienen dos pares de ángulos correspondientes que miden $40^\\circ$ y $70^\\circ$. ¿Bajo qué criterio son semejantes?",
                options: [
                  "Criterio Ángulo-Ángulo (AA)",
                  "Criterio Lado-Lado-Lado (LLL)",
                  "Criterio Lado-Ángulo-Lado (LAL)",
                  "No son semejantes"
                ],
                correctAnswer: 0,
                explanation: "Por el criterio AA, si dos triángulos tienen dos pares de ángulos congruentes, automáticamente el tercer ángulo también lo es y los triángulos son semejantes.",
                grade: "1° Medio",
                topic: "Criterios de Semejanza",
              }
            ]
          },
          {
            id: "OA 11",
            code: "MA1M OA 11",
            desc: "Representar y operar vectores en el plano cartesiano ($\\mathbb{R}^2$).",
            indicadores: [
              "Suman y restan vectores de forma gráfica y analítica.",
              "Multiplican vectores por un escalar."
            ],
            questions: [
              {
                id: "1m-oa11-1",
                text: "Dados los vectores $\\vec{u} = (2, -3)$ y $\\vec{v} = (-5, 1)$, ¿cuál es el resultado de $2\\vec{u} + \\vec{v}$?",
                options: ["$(-1, -5)$", "$(-1, -7)$", "$(9, -5)$", "$(-3, -2)$"],
                correctAnswer: 0,
                explanation: "$2\\vec{u} = (4, -6)$. Sumando $\\vec{v}$: $(4 + (-5), -6 + 1) = (-1, -5)$.",
                grade: "1° Medio",
                topic: "Vectores en 2D",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 12",
            code: "MA1M OA 12",
            desc: "Registrar datos bidimensionales continuos mediante nubes de puntos y gráficos de dispersión.",
            indicadores: [
              "Identifican relaciones de correlación lineal positiva, negativa o nula entre dos variables."
            ],
            questions: [
              {
                id: "1m-oa12-1",
                text: "En un gráfico de dispersión, si a mayor cantidad de horas de estudio los estudiantes obtienen mayores puntajes, la correlación observada es:",
                options: [
                  "Correlación lineal positiva",
                  "Correlación lineal negativa",
                  "Correlación nula",
                  "Correlación inversa perfecta"
                ],
                correctAnswer: 0,
                explanation: "Cuando ambas variables aumentan juntas en el plano cartesiano, la tendencia de la nube de puntos es creciente, indicando correlación positiva.",
                grade: "1° Medio",
                topic: "Gráficos de Dispersión y Correlación",
              }
            ]
          },
          {
            id: "OA 13",
            code: "MA1M OA 13",
            desc: "Comparar poblaciones usando tablas de frecuencia, diagramas de dispersión y percentiles.",
            indicadores: [
              "Comparan distribuciones estadísticas y analizan dispersión poblacional."
            ],
            questions: [
              {
                id: "1m-oa13-1",
                text: "Al comparar dos cursos con el mismo promedio ($5.5$), el curso A tiene percentil $P_{75} = 6.8$ y el curso B tiene $P_{75} = 5.8$. ¿Qué curso presenta mayor dispersión en las notas altas?",
                options: ["El curso A", "El curso B", "Ambos tienen idéntica dispersión", "No se puede determinar"],
                correctAnswer: 0,
                explanation: "El curso A alcanza un percentil 75 significativamente mayor, mostrando un rango de notas sobresalientes más amplio.",
                grade: "1° Medio",
                topic: "Comparación de Poblaciones con Percentiles",
              }
            ]
          },
          {
            id: "OA 14",
            code: "MA1M OA 14",
            desc: "Desarrollar las reglas aditiva y multiplicativa de probabilidades.",
            indicadores: [
              "Calculan probabilidades para sucesos mutuamente excluyentes y no excluyentes ($P(A \\cup B)$).",
              "Aplican regla del producto para sucesos independientes y dependientes."
            ],
            questions: [
              {
                id: "1m-oa14-1",
                text: "Si se lanzan dos monedas al aire, ¿cuál es la probabilidad de que ambas salgan cara?",
                options: ["$\\frac{1}{4} = 25\\%$", "$\\frac{1}{2} = 50\\%$", "$\\frac{3}{4} = 75\\%$", "$\\frac{1}{8} = 12.5\\%$"],
                correctAnswer: 0,
                explanation: "Eventos independientes: $P(\\text{Cara}_1) \\cdot P(\\text{Cara}_2) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}$.",
                grade: "1° Medio",
                topic: "Regla de Multiplicación",
              }
            ]
          },
          {
            id: "OA 15",
            code: "MA1M OA 15",
            desc: "Modelar el azar mediante simulación y frecuencias relativas.",
            indicadores: [
              "Estiman probabilidades teóricas a partir de la Ley de los Grandes Números."
            ],
            questions: [
              {
                id: "1m-oa15-1",
                text: "Según la Ley de los Grandes Números, a medida que aumenta indefinidamente el número de lanzamientos de una moneda:",
                options: [
                  "La frecuencia relativa de caras se aproxima a la probabilidad teórica $0.5$",
                  "El número exacto de caras y sellos siempre será idéntico en cada serie",
                  "La probabilidad cambia según los resultados anteriores",
                  "El experimento deja de ser aleatorio"
                ],
                correctAnswer: 0,
                explanation: "La frecuencia relativa converge a la probabilidad teórica $P=0.5$ conforme el número de ensayos tiende a infinito.",
                grade: "1° Medio",
                topic: "Ley de los Grandes Números",
              }
            ]
          },
          {
            id: "OA 16",
            code: "MA1M OA 16",
            desc: "Evaluar críticamente información estadística y probabilística difundida en medios.",
            indicadores: [
              "Detectan sesgos e inferencias no fundamentadas en reportes periodísticos y publicitarios."
            ],
            questions: [
              {
                id: "1m-oa16-1",
                text: "Un anuncio afirma: 'El $90\\%$ de los dentistas recomienda esta pasta', basado en una encuesta a sólo 10 odontólogos pagados por la marca. ¿Cuál es la falacia estadística?",
                options: [
                  "Tamaño de muestra insuficiente y sesgo de patrocinio",
                  "La media aritmética fue calculada incorrectamente",
                  "Faltó calcular la varianza poblacional",
                  "El porcentaje no suma 100%"
                ],
                correctAnswer: 0,
                explanation: "Una muestra de 10 personas no es representativa y el conflicto de interés introduce un sesgo grave en la inferencia.",
                grade: "1° Medio",
                topic: "Evaluación Crítica de Publicidad Estadística",
              }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // 2° MEDIO (12 OAs Oficiales MINEDUC)
  // ==========================================
  "2_medio": {
    nivel: "2° Medio",
    ejes: {
      numeros: {
        nombre: "Números",
        oas: [
          {
            id: "OA 01",
            code: "MA2M OA 01",
            desc: "Realizar cálculos y estimaciones con números reales ($\\mathbb{R}$) y raíces enésimas.",
            indicadores: [
              "Aplican descomposición y propiedades de raíces.",
              "Racionalizan expresiones con raíces cuadradas en el denominador.",
              "Resuelven operaciones combinadas."
            ],
            questions: [
              {
                id: "2m-oa01-1",
                text: "Racionaliza el denominador de la fracción: $\\frac{8}{\\sqrt{2}}$",
                options: ["$4\\sqrt{2}$", "$2\\sqrt{2}$", "$8\\sqrt{2}$", "$\\frac{\\sqrt{2}}{4}$"],
                correctAnswer: 0,
                explanation: "$\\frac{8 \\cdot \\sqrt{2}}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{8\\sqrt{2}}{2} = 4\\sqrt{2}$.",
                grade: "2° Medio",
                topic: "Racionalización",
              }
            ]
          },
          {
            id: "OA 02",
            code: "MA2M OA 02",
            desc: "Mostrar que comprenden la relación entre potencias, raíces y logaritmos.",
            indicadores: [
              "Convierten entre notación radical y exponente racional ($a^{m/n} = \\sqrt[n]{a^m}$).",
              "Aplican propiedades de logaritmos ($\\log(xy)$, $\\log(x/y)$, $\\log(x^k)$).",
              "Resuelven ecuaciones logarítmicas y exponenciales directas."
            ],
            questions: [
              {
                id: "2m-oa02-1",
                text: "Calcula el valor exacto de la expresión logarítmica: $\\log_2(32) + \\log_3(81) - \\log_{10}(100)$",
                options: ["$7$", "$9$", "$5$", "$11$"],
                correctAnswer: 0,
                explanation: "$\\log_2(32) = 5$, $\\log_3(81) = 4$, $\\log_{10}(100) = 2$. Entonces $5 + 4 - 2 = 7$.",
                grade: "2° Medio",
                topic: "Propiedades de Logaritmos",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 03",
            code: "MA2M OA 03",
            desc: "Mostrar que comprenden la función cuadrática f(x) = ax² + bx + c.",
            indicadores: [
              "Determinan orientación de concavidad, coordenadas del vértice, eje de simetría e intersecciones con los ejes coordenados.",
              "Grafican parábolas."
            ],
            questions: [
              {
                id: "2m-oa03-1",
                text: "¿Cuáles son las coordenadas del vértice de la parábola $f(x) = x^2 - 6x + 5$?",
                options: ["$(3, -4)$", "$(3, 4)$", "$(-3, -4)$", "$(6, 5)$"],
                correctAnswer: 0,
                explanation: "$x_v = -\\frac{b}{2a} = -\\frac{-6}{2(1)} = 3$. $y_v = f(3) = 3^2 - 6(3) + 5 = 9 - 18 + 5 = -4$. Vértice: $(3, -4)$.",
                grade: "2° Medio",
                topic: "Vértice de la Parábola",
              }
            ]
          },
          {
            id: "OA 04",
            code: "MA2M OA 04",
            desc: "Resolver ecuaciones cuadráticas de segundo grado.",
            indicadores: [
              "Resuelven ecuaciones por factorización, completación de cuadrados y fórmula general.",
              "Analizan la naturaleza de las raíces según el discriminante ($\\Delta = b^2 - 4ac$)."
            ],
            questions: [
              {
                id: "2m-oa04-1",
                text: "Si el discriminante de una ecuación cuadrática es $\\Delta = 0$, ¿qué tipo de soluciones tiene en $\\mathbb{R}$?",
                options: [
                  "Una única solución real de multiplicidad 2 (raíces reales e iguales)",
                  "Dos soluciones reales y distintas",
                  "No tiene soluciones en los números reales",
                  "Infinitas soluciones reales"
                ],
                correctAnswer: 0,
                explanation: "Cuando $\\Delta = b^2 - 4ac = 0$, la parábola es tangente al eje X y la ecuación tiene una única raíz real repetida ($x = -b / 2a$).",
                grade: "2° Medio",
                topic: "Discriminante Cuadrático",
              }
            ]
          },
          {
            id: "OA 05",
            code: "MA2M OA 05",
            desc: "Mostrar que comprenden la función inversa.",
            indicadores: [
              "Evalúan inyectividad y sobreyectividad.",
              "Determinan algebraicamente $f^{-1}(x)$ para funciones lineales y afines.",
              "Reconocen simetría respecto a la recta $y = x$."
            ],
            questions: [
              {
                id: "2m-oa05-1",
                text: "¿Cuál es la función inversa $f^{-1}(x)$ de la función afín $f(x) = 2x + 6$?",
                options: ["$f^{-1}(x) = \\frac{x - 6}{2}$", "$f^{-1}(x) = \\frac{x + 6}{2}$", "$f^{-1}(x) = 2x - 6$", "$f^{-1}(x) = \\frac{1}{2x + 6}$"],
                correctAnswer: 0,
                explanation: "Hacemos $y = 2x + 6 \\implies y - 6 = 2x \\implies x = \\frac{y - 6}{2}$. Luego $f^{-1}(x) = \\frac{x - 6}{2}$.",
                grade: "2° Medio",
                topic: "Función Inversa",
              }
            ]
          },
          {
            id: "OA 06",
            code: "MA2M OA 06",
            desc: "Modelar situaciones de crecimiento y decrecimiento exponencial.",
            indicadores: [
              "Modelan fenómenos de interés compuesto, crecimiento bacteriano y desintegración radiactiva mediante $f(t) = C \\cdot (1 \\pm r)^t$."
            ],
            questions: [
              {
                id: "2m-oa06-1",
                text: "Un cultivo de bacterias inicia con $500$ individuos y se triplica cada hora. ¿Qué función modela el número de bacterias tras $t$ horas?",
                options: ["$N(t) = 500 \\cdot 3^t$", "$N(t) = 500 \\cdot (1.3)^t$", "$N(t) = 3 \\cdot 500^t$", "$N(t) = 1500t$"],
                correctAnswer: 0,
                explanation: "Población inicial $C = 500$, factor multiplicador 3 por periodo: $N(t) = 500 \\cdot 3^t$.",
                grade: "2° Medio",
                topic: "Crecimiento Exponencial",
              }
            ]
          }
        ]
      },
      geometria: {
        nombre: "Geometría",
        oas: [
          {
            id: "OA 07",
            code: "MA2M OA 07",
            desc: "Desarrollar las razones trigonométricas en triángulos rectángulos (sen, cos, tan).",
            indicadores: [
              "Calculan razones trigonométricas directas.",
              "Resuelven problemas de cálculo de alturas y distancias usando ángulos de elevación y depresión."
            ],
            questions: [
              {
                id: "2m-oa07-1",
                text: "En un triángulo rectángulo, el cateto opuesto al ángulo $\\alpha$ mide $3\\text{ cm}$ y la hipotenusa mide $5\\text{ cm}$. ¿Cuál es el valor de $\\operatorname{sen}(\\alpha)$ y $\\cos(\\alpha)$?",
                options: [
                  "$\\operatorname{sen}(\\alpha) = \\frac{3}{5}, \\; \\cos(\\alpha) = \\frac{4}{5}$",
                  "$\\operatorname{sen}(\\alpha) = \\frac{4}{5}, \\; \\cos(\\alpha) = \\frac{3}{5}$",
                  "$\\operatorname{sen}(\\alpha) = \\frac{3}{4}, \\; \\cos(\\alpha) = \\frac{4}{3}$",
                  "$\\operatorname{sen}(\\alpha) = \\frac{5}{3}, \\; \\cos(\\alpha) = \\frac{5}{4}$"
                ],
                correctAnswer: 0,
                explanation: "Por Pitágoras, el cateto adyacente es $\\sqrt{5^2 - 3^2} = 4$. Luego $\\operatorname{sen}(\\alpha) = \\frac{3}{5}$ y $\\cos(\\alpha) = \\frac{4}{5}$.",
                grade: "2° Medio",
                topic: "Razones Trigonométricas",
              }
            ]
          },
          {
            id: "OA 08",
            code: "MA2M OA 08",
            desc: "Demostrar y aplicar relaciones trigonométricas fundamentales e identidades básicas (sen²α + cos²α = 1, tanα = senα / cosα).",
            indicadores: [
              "Simplifican identidades trigonométricas.",
              "Determinan valores exactos para ángulos notables ($30^\\circ, 45^\\circ, 60^\\circ$)."
            ],
            questions: [
              {
                id: "2m-oa08-1",
                text: "Si para un ángulo agudo $\\alpha$ se conoce que $\\operatorname{sen}(\\alpha) = \\frac{5}{13}$, calcula el valor exacto de $\\cos(\\alpha)$ aplicando la identidad fundamental:",
                options: ["$\\frac{12}{13}$", "$\\frac{8}{13}$", "$\\frac{144}{169}$", "$\\frac{1}{13}$"],
                correctAnswer: 0,
                explanation: "$\\cos(\\alpha) = \\sqrt{1 - \\operatorname{sen}^2(\\alpha)} = \\sqrt{1 - \\frac{25}{169}} = \\sqrt{\\frac{144}{169}} = \\frac{12}{13}$.",
                grade: "2° Medio",
                topic: "Identidad Fundamental Trigonométrica",
              }
            ]
          },
          {
            id: "OA 09",
            code: "MA2M OA 09",
            desc: "Describir cuerpos generados por rotación o traslación de figuras planas en el espacio 3D (cilindro, cono, esfera, prismas).",
            indicadores: [
              "Identifican ejes de revolución y figuras generatrices.",
              "Calculan áreas y volúmenes de sólidos de revolución."
            ],
            questions: [
              {
                id: "2m-oa09-1",
                text: "¿Qué cuerpo geométrico 3D se genera al rotar indefinidamente un semicírculo en torno a su diámetro?",
                options: ["Una esfera", "Un cono", "Un cilindro", "Un toroide"],
                correctAnswer: 0,
                explanation: "La rotación completa de $360^\\circ$ de un semicírculo alrededor de su diámetro genera una esfera perfecta.",
                grade: "2° Medio",
                topic: "Cuerpos de Revolución 3D",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 10",
            code: "MA2M OA 10",
            desc: "Mostrar que comprenden medidas de dispersión: rango, varianza, desviación estándar y coeficiente de variación.",
            indicadores: [
              "Calculan $\\sigma$ y $CV$.",
              "Comparan la homogeneidad o heterogeneidad de dos poblaciones con medias similares o diferentes."
            ],
            questions: [
              {
                id: "2m-oa10-1",
                text: "Si la varianza de las estaturas de un grupo de deportistas es $\\sigma^2 = 16\\text{ cm}^2$, ¿cuál es su desviación estándar $\\sigma$?",
                options: ["$4\\text{ cm}$", "$8\\text{ cm}$", "$256\\text{ cm}$", "$2\\text{ cm}$"],
                correctAnswer: 0,
                explanation: "La desviación estándar es la raíz cuadrada positiva de la varianza: $\\sigma = \\sqrt{16} = 4\\text{ cm}$.",
                grade: "2° Medio",
                topic: "Desviación Estándar",
              }
            ]
          },
          {
            id: "OA 11",
            code: "MA2M OA 11",
            desc: "Aplicar técnicas de conteo combinatorio (permutaciones, variaciones y combinatorias) en el cálculo de probabilidades.",
            indicadores: [
              "Diferencian situaciones donde el orden importa y no importa.",
              "Calculan probabilidades combinatorias en sorteos y comités."
            ],
            questions: [
              {
                id: "2m-oa11-1",
                text: "¿De cuántas maneras diferentes se pueden sentar 5 estudiantes en una fila de 5 asientos disponibles?",
                options: ["$5! = 120$", "$5^5 = 3125$", "$25$", "$\\binom{5}{2} = 10$"],
                correctAnswer: 0,
                explanation: "Es una permutación simple de 5 elementos: $P_5 = 5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.",
                grade: "2° Medio",
                topic: "Técnicas de Conteo y Permutaciones",
              }
            ]
          },
          {
            id: "OA 12",
            code: "MA2M OA 12",
            desc: "Analizar críticamente el rol de las probabilidades en la toma de decisiones ciudadanas y coberturas de riesgo.",
            indicadores: [
              "Evalúan decisiones bajo incertidumbre en pólizas de seguro, salud pública e inversiones financieras."
            ],
            questions: [
              {
                id: "2m-oa12-1",
                text: "Una compañía de seguros fija la prima anual de un automóvil considerando la probabilidad estadística de siniestros. Esto se fundamenta en:",
                options: [
                  "El cálculo de la esperanza matemática del costo del siniestro",
                  "Una estimación al azar sin base empírica",
                  "El cobro del valor total del auto cada año",
                  "Exclusivamente el color del vehículo"
                ],
                correctAnswer: 0,
                explanation: "El valor de una póliza se calcula a partir del valor esperado del riesgo ($E(X) = p \\cdot C$) más los costos operacionales y margen de seguridad.",
                grade: "2° Medio",
                topic: "Probabilidades en Toma de Decisiones y Seguros",
              }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // 3° MEDIO - PLAN COMÚN FORMACIÓN GENERAL (4 OAs)
  // ==========================================
  "3_medio": {
    nivel: "3° Medio",
    ejes: {
      numeros: {
        nombre: "Números y Álgebra",
        oas: [
          {
            id: "OA 01",
            code: "FG-MATE-3M-OA 01",
            desc: "Resolver problemas de adición, sustracción, multiplicación y división de números complejos ($\\mathbb{C}$), en forma pictórica, simbólica y con uso de herramientas tecnológicas.",
            indicadores: [
              "Representan la unidad imaginaria $i$ como solución a $x^2 + 1 = 0$.",
              "Operan con números complejos en forma binomial ($a + bi$) y de par ordenado $(a, b)$.",
              "Calculan módulo ($|z| = \\sqrt{a^2 + b^2}$) y conjugado ($\\bar{z} = a - bi$), representándolos en el plano complejo de Argand."
            ],
            questions: [
              {
                id: "3m-oa01-1",
                text: "Dados los números complejos $z_1 = 3 + 4i$ y $z_2 = 1 - 2i$, calcula el producto $z_1 \\cdot z_2$ (recordando que $i^2 = -1$):",
                options: [
                  "$11 - 2i$",
                  "$3 - 8i$",
                  "$11 + 2i$",
                  "$-5 - 2i$"
                ],
                correctAnswer: 0,
                explanation: "$z_1 \\cdot z_2 = (3)(1) + (3)(-2i) + (4i)(1) + (4i)(-2i) = 3 - 6i + 4i - 8i^2 = 3 - 2i - 8(-1) = 3 - 2i + 8 = 11 - 2i$.",
                grade: "3° Medio",
                topic: "Números Complejos",
              },
              {
                id: "3m-oa01-2",
                text: "¿Cuál es el módulo $|z|$ del número complejo $z = 5 - 12i$ en el plano de Argand?",
                options: ["$13$", "$\\sqrt{17}$", "$17$", "$7$"],
                correctAnswer: 0,
                explanation: "$|z| = \\sqrt{5^2 + (-12)^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.",
                grade: "3° Medio",
                topic: "Módulo en el Plano Complejo",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 02",
            code: "FG-MATE-3M-OA 02",
            desc: "Tomar decisiones en situaciones de incerteza que involucren el análisis de datos estadísticos con medidas de dispersión y probabilidades condicionales.",
            indicadores: [
              "Calculan e interpretan probabilidades condicionales mediante $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$.",
              "Construyen tablas de contingencia y diagramas de árbol para evaluar probabilidades compuestas.",
              "Aplican el Teorema de la Probabilidad Total y el Teorema de Bayes para calcular probabilidades a posteriori.",
              "Argumentan decisiones evaluando riesgos basados en dispersión ($\\sigma$) y probabilidad."
            ],
            questions: [
              {
                id: "3m-oa02-1",
                text: "En un test médico con alta sensibilidad, si una persona da positivo, la probabilidad real de que esté enferma depende fuertemente de:",
                options: [
                  "La prevalencia de la enfermedad en la población total (Teorema de Bayes)",
                  "Únicamente el precio del test médico",
                  "La cantidad de médicos en el hospital",
                  "La hora en que se tomó la muestra"
                ],
                correctAnswer: 0,
                explanation: "Por el Teorema de Bayes, el valor predictivo positivo $P(\\text{Enfermo}|\\text{Positivo})$ se ve fuertemente condicionado por la tasa de prevalencia basal de la enfermedad en la población.",
                grade: "3° Medio",
                topic: "Inferencia y Teorema de Bayes",
              },
              {
                id: "3m-oa02-2",
                text: "Si $P(A) = 0.4$, $P(B) = 0.5$ y $P(A \\cap B) = 0.2$, ¿cuál es la probabilidad condicional $P(A|B)$?",
                options: ["$0.40 = 40\\%$", "$0.50 = 50\\%$", "$0.20 = 20\\%$", "$0.80 = 80\\%$"],
                correctAnswer: 0,
                explanation: "$P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.2}{0.5} = 0.4 = 40\\%$.",
                grade: "3° Medio",
                topic: "Probabilidad Condicional",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Álgebra y Modelamiento",
        oas: [
          {
            id: "OA 03",
            code: "FG-MATE-3M-OA 03",
            desc: "Aplicar modelos matemáticos que describen fenómenos de crecimiento y decrecimiento que involucran las funciones exponencial y logarítmica.",
            indicadores: [
              "Determinan parámetros de funciones $f(x) = a \\cdot b^x$ y $f(x) = \\log_b(x)$ a partir de datos empíricos.",
              "Modelan y predicen comportamientos en biología (epidemias), física (decibeles) y geología (escala sísmica).",
              "Ajustan y grafican curvas usando software matemático (ej. GeoGebra o planillas de cálculo)."
            ],
            questions: [
              {
                id: "3m-oa03-1",
                text: "La escala de Richter para la magnitud de un terremoto se define como $M = \\log_{10}\\left(\\frac{I}{I_0}\\right)$. Si un terremoto tiene una intensidad $1.000.000$ de veces superior a $I_0$, ¿cuál es su magnitud $M$?",
                options: ["$M = 6.0$", "$M = 5.0$", "$M = 7.0$", "$M = 10.0$"],
                correctAnswer: 0,
                explanation: "$M = \\log_{10}(10^6) = 6.0$.",
                grade: "3° Medio",
                topic: "Modelos Logarítmicos y Escala Richter",
              }
            ]
          }
        ]
      },
      geometria: {
        nombre: "Geometría",
        oas: [
          {
            id: "OA 04",
            code: "FG-MATE-3M-OA 04",
            desc: "Resolver problemas de geometría euclidiana que involucran relaciones métricas entre ángulos, arcos, cuerdas y secantes en la circunferencia.",
            indicadores: [
              "Aplican teoremas de ángulos inscritos, del centro, semiinscritos e interiores/exteriores en la circunferencia.",
              "Resuelven problemas usando teoremas de cuerdas cortadas, secantes y tangentes.",
              "Modelan piezas mecánicas, engranajes y trazados topográficos basados en geometría circular."
            ],
            questions: [
              {
                id: "3m-oa04-1",
                text: "En una circunferencia, un ángulo del centro subtiende un arco de $80^\\circ$. ¿Cuánto mide un ángulo inscrito que subtiende ese mismo arco?",
                options: ["$40^\\circ$", "$80^\\circ$", "$160^\\circ$", "$20^\\circ$"],
                correctAnswer: 0,
                explanation: "Por el Teorema del Ángulo Inscrito, la medida del ángulo inscrito es exactamente la mitad del ángulo del centro que subtiende el mismo arco: $\\frac{80^\\circ}{2} = 40^\\circ$.",
                grade: "3° Medio",
                topic: "Ángulo Inscrito y del Centro",
              },
              {
                id: "3m-oa04-2",
                text: "Dos cuerdas $AB$ y $CD$ se cortan en un punto interior $P$. Si $AP = 3\\text{ cm}$, $PB = 8\\text{ cm}$ y $CP = 4\\text{ cm}$, ¿cuánto mide el segmento $PD$?",
                options: ["$6\\text{ cm}$", "$4\\text{ cm}$", "$9\\text{ cm}$", "$12\\text{ cm}$"],
                correctAnswer: 0,
                explanation: "Por el Teorema de las Cuerdas Cortadas: $AP \\cdot PB = CP \\cdot PD \\implies 3 \\cdot 8 = 4 \\cdot PD \\implies 24 = 4 \\cdot PD \\implies PD = 6\\text{ cm}$.",
                grade: "3° Medio",
                topic: "Teorema de las Cuerdas",
              }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // 4° MEDIO - PLAN COMÚN FORMACIÓN GENERAL (4 OAs)
  // ==========================================
  "4_medio": {
    nivel: "4° Medio",
    ejes: {
      numeros: {
        nombre: "Economía y Educación Financiera",
        oas: [
          {
            id: "OA 01",
            code: "FG-MATE-4M-OA 01",
            desc: "Fundamentar decisiones en el ámbito financiero y económico personal o comunitario, a partir de modelos que consideren porcentajes, tasas de interés e índices económicos.",
            indicadores: [
              "Calculan tablas de amortización, valor futuro y cuotas aplicando interés compuesto e interés simple.",
              "Analizan el impacto de la inflación (IPC), la Unidad de Fomento (UF) y el Costo Anual Equivalente (CAE) en créditos.",
              "Evalúan planes de ahorro previsional (AFP), fondos mutuos y alternativas de inversión contrastando rentabilidad y riesgo."
            ],
            questions: [
              {
                id: "4m-oa01-1",
                text: "¿Qué indicador financiero estandarizado permite comparar de forma objetiva el costo total entre diferentes ofertas de crédito en Chile?",
                options: [
                  "La Carga Anual Equivalente (CAE) y el Costo Total del Crédito (CTC)",
                  "Únicamente la tasa de interés nominal mensual",
                  "El valor del dólar observado",
                  "La tasa de política monetaria (TPM) sin comisiones"
                ],
                correctAnswer: 0,
                explanation: "La CAE reúne en un porcentaje anual todos los costos asociados (intereses, gastos notariales, seguros obligatorios), permitiendo una comparación transparente.",
                grade: "4° Medio",
                topic: "Evaluación Crítica Financiera",
              },
              {
                id: "4m-oa01-2",
                text: "Si la inflación anual medida por el IPC fue del $4\\%$ y un depósito a plazo ofreció una tasa nominal del $6\\%$, ¿cuál es la tasa de interés real aproximada obtenida?",
                options: ["$+2\\%$ anual", "$+10\\%$ anual", "$-2\\%$ anual", "$+24\\%$ anual"],
                correctAnswer: 0,
                explanation: "Tasa real aproximada $= \\text{Tasa Nominal} - \\text{Inflación} = 6\\% - 4\\% = +2\\%$ anual.",
                grade: "4° Medio",
                topic: "Tasa Real e Inflación",
              }
            ]
          }
        ]
      },
      probabilidad: {
        nombre: "Probabilidad y Estadística Inferencial",
        oas: [
          {
            id: "OA 02",
            code: "FG-MATE-4M-OA 02",
            desc: "Fundamentar decisiones en situaciones de incerteza a partir del análisis crítico de datos estadísticos y con base en los modelos binomial y normal.",
            indicadores: [
              "Identifican variables aleatorias discretas y continuas asociadas a fenómenos experimentales.",
              "Modelan distribuciones binomiales $B(n, p)$ calculando probabilidades de éxito en ensayos de Bernoulli.",
              "Aplican la distribución normal estándar $Z = \\frac{X - \\mu}{\\sigma}$ y el cálculo de áreas bajo la curva de Gauss para estimar percentiles e intervalos de confianza."
            ],
            questions: [
              {
                id: "4m-oa02-1",
                text: "En una distribución normal estándar $Z \\sim N(0, 1)$, ¿cuál es la media $\\mu$ y la desviación estándar $\\sigma$?",
                options: [
                  "Media $\\mu = 0$ y Desviación $\\sigma = 1$",
                  "Media $\\mu = 1$ y Desviación $\\sigma = 0$",
                  "Media $\\mu = 100$ y Desviación $\\sigma = 15$",
                  "Media $\\mu = 0.5$ y Desviación $\\sigma = 0.5$"
                ],
                correctAnswer: 0,
                explanation: "Por definición de la campana de Gauss estandarizada, su centro es $\\mu = 0$ y su dispersión estándar es $\\sigma = 1$.",
                grade: "4° Medio",
                topic: "Distribución Normal Estándar",
              },
              {
                id: "4m-oa02-2",
                text: "En un proceso industrial, el peso de un producto sigue una distribución $N(\\mu = 500\\text{ g}, \\sigma = 10\\text{ g})$. ¿Qué valor tipificado $Z$ corresponde a un paquete que pesa $520\\text{ g}$?",
                options: ["$Z = +2.0$", "$Z = +1.0$", "$Z = +20$", "$Z = -2.0$"],
                correctAnswer: 0,
                explanation: "$Z = \\frac{X - \\mu}{\\sigma} = \\frac{520 - 500}{10} = \\frac{20}{10} = +2.0$.",
                grade: "4° Medio",
                topic: "Tipificación Z en Distribución Normal",
              }
            ]
          }
        ]
      },
      algebra: {
        nombre: "Modelamiento y Funciones",
        oas: [
          {
            id: "OA 03",
            code: "FG-MATE-4M-OA 03",
            desc: "Construir modelos de situaciones o fenómenos periódicos y de potencias de exponente entero que involucren funciones trigonométricas (sen(x), cos(x)).",
            indicadores: [
              "Modelan fenómenos cíclicos (mareas, temperatura estacional, ondas acústicas, corriente alterna) mediante $f(x) = A\\operatorname{sen}(Bx - C) + D$.",
              "Determinan e interpretan amplitud ($A$), período ($T = \\frac{2\\pi}{B}$), desfase horizontal y traslación vertical.",
              "Validan la precisión de modelos computacionales frente a datos reales observados."
            ],
            questions: DON_BOSCO_4MEDIO_POTENCIA_QUESTIONS
          }
        ]
      },
      geometria: {
        nombre: "Geometría Analítica",
        oas: [
          {
            id: "OA 04",
            code: "FG-MATE-4M-OA 04",
            desc: "Resolver problemas acerca de rectas y circunferencias en el plano cartesiano mediante su representación analítica.",
            indicadores: [
              "Determinan ecuaciones de la recta en sus formas continua, general y simétrica; aplican condiciones de paralelismo ($m_1 = m_2$) y perpendicularidad ($m_1 \\cdot m_2 = -1$).",
              "Determinan la ecuación canónica, ordinaria $(x - h)^2 + (y - k)^2 = r^2$ y general de la circunferencia.",
              "Resuelven problemas de intersección y tangencia entre rectas y circunferencias de forma analítica y con software geométrico."
            ],
            questions: [
              {
                id: "4m-oa04-1",
                text: "¿Cuál es el centro $C(h,k)$ y el radio $r$ de la circunferencia de ecuación $(x - 3)^2 + (y + 5)^2 = 49$?",
                options: [
                  "Centro $C(3, -5)$ y Radio $r = 7$",
                  "Centro $C(-3, 5)$ y Radio $r = 49$",
                  "Centro $C(3, -5)$ y Radio $r = 49$",
                  "Centro $C(-3, 5)$ y Radio $r = 7$"
                ],
                correctAnswer: 0,
                explanation: "La ecuación ordinaria es $(x - h)^2 + (y - k)^2 = r^2$. Por comparación: $h = 3$, $k = -5$, $r = \\sqrt{49} = 7$.",
                grade: "4° Medio",
                topic: "Ecuación Ordinaria de la Circunferencia",
              },
              {
                id: "4m-oa04-2",
                text: "¿Cuál es la pendiente $m_2$ de una recta perpendicular a la recta de ecuación $y = 3x - 5$?",
                options: ["$m_2 = -\\frac{1}{3}$", "$m_2 = 3$", "$m_2 = -3$", "$m_2 = \\frac{1}{3}$"],
                correctAnswer: 0,
                explanation: "Para que dos rectas sean perpendiculares: $m_1 \\cdot m_2 = -1 \\implies 3 \\cdot m_2 = -1 \\implies m_2 = -\\frac{1}{3}$.",
                grade: "4° Medio",
                topic: "Rectas Perpendiculares en el Plano",
              }
            ]
          }
        ]
      }
    }
  }
};

// Aliases for Técnico Profesional / Plan Común keys
CURRICULUM_COMPLETO_MINEDUC["3_medio_tp"] = CURRICULUM_COMPLETO_MINEDUC["3_medio"];
CURRICULUM_COMPLETO_MINEDUC["4_medio_tp"] = CURRICULUM_COMPLETO_MINEDUC["4_medio"];

/**
 * Utility to retrieve all questions matching selected grade, axis, and OAs
 */
export function getQuestionsForSelectedCurriculum(
  gradeKey: string,
  axisKey: string,
  selectedOAIds: string[]
): Question[] {
  const gradeData = CURRICULUM_COMPLETO_MINEDUC[gradeKey];
  if (!gradeData) return [];

  const axisData = gradeData.ejes[axisKey];
  if (!axisData) return [];

  const matchedQuestions: Question[] = [];

  axisData.oas.forEach((oa) => {
    if (selectedOAIds.length === 0 || selectedOAIds.includes(oa.id) || selectedOAIds.includes(oa.code)) {
      if (oa.questions && oa.questions.length > 0) {
        matchedQuestions.push(...oa.questions);
      } else {
        // Fallback default question for that OA
        matchedQuestions.push({
          id: `${gradeKey}-${axisKey}-${oa.id}-default`,
          text: `[${oa.code || oa.id}] Ejercicio de evaluación formativa: ${oa.desc}`,
          options: ["Alternativa Correcta A", "Alternativa B", "Alternativa C", "Alternativa D"],
          correctAnswer: 0,
          explanation: `Resolución oficial para ${oa.code || oa.id}: ${oa.desc}`,
          grade: gradeData.nivel,
          topic: `${axisData.nombre} - ${oa.code || oa.id}`,
        });
      }
    }
  });

  return matchedQuestions;
}
