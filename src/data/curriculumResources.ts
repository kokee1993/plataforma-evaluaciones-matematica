import { Question } from '../types';
import { CURRICULUM_COMPLETO_MINEDUC } from './mineducCurriculum';
import { DON_BOSCO_8BASICO_FORMA_A } from './donBosco8BasicoUnidad3Quiz';
import { CLASE_DESAFIANTE_8BASICO_FORMA_A } from './claseDesafiante8Basico';

export interface StudyResourceItem {
  id: string;
  title: string;
  type: 'presentation' | 'summary' | 'infographic' | 'formula_sheet';
  tag: string;
  readTime: string;
  summary: string;
  contentMarkdown: string;
}

export interface GuidedExerciseItem {
  id: string;
  title: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  statement: string;
  steps: {
    title: string;
    description: string;
    mathExpression?: string;
    pedagogicalTip?: string;
  }[];
  finalAnswer: string;
}

export interface ProposedExerciseItem {
  id: string;
  title: string;
  estimatedTime: string;
  studentInstructions: string;
  problems: {
    number: number;
    statement: string;
    solution: string;
    points: number;
  }[];
}

export interface OAResources {
  oaId: string;
  title: string;
  description: string;
  materials: StudyResourceItem[];
  guidedExercises: GuidedExerciseItem[];
  proposedWorksheets: ProposedExerciseItem[];
  questions: Question[];
}

export interface UnitResourceItem {
  id: string; // 'unidad_1' | 'unidad_2' | 'unidad_3' | 'unidad_4'
  unitNumber: number;
  axisKey: 'numeros' | 'algebra' | 'geometria' | 'probabilidad';
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    gradient: string;
  };
  oas: OAResources[];
}

export interface CourseCurriculumItem {
  id: string; // '8_basico' | '1_medio' | '2_medio' | '3_medio_tp' | '4_medio_tp'
  name: string;
  category: string; // 'Educación Básica' | 'Formación General' | 'Técnico Profesional / Plan Común'
  badgeNumber: string; // '8' | '1' | '2' | '3 (TP)' | '4 (TP)'
  colorBadge: string;
  description: string;
  units: UnitResourceItem[];
}

// Generate rich resources based on official MINEDUC curriculum
function buildCurriculumResources(): Record<string, CourseCurriculumItem> {
  const courses: Record<string, CourseCurriculumItem> = {
    '7_basico': {
      id: '7_basico',
      name: '7° Básico',
      category: 'Educación Básica',
      badgeNumber: '7',
      colorBadge: 'bg-teal-600 text-white',
      description: 'Números enteros, porcentajes, proporcionalidad directa e inversa, geometría del círculo y probabilidades elementales.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Números',
          shortTitle: 'Números',
          icon: '🔢',
          description: 'Adición y sustracción de números enteros, porcentajes y problemas cotidianos, multiplicación/división de fracciones y potencias de base 10.',
          colorTheme: {
            bg: 'bg-teal-50',
            border: 'border-teal-200',
            text: 'text-teal-700',
            badge: 'bg-teal-100 text-teal-800',
            gradient: 'from-teal-600 to-emerald-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Adición y Sustracción de Números Enteros',
              description: 'Mostrar que comprenden la adición y la sustracción de números enteros: representando en la recta numérica y resolviendo problemas de la vida cotidiana.',
              materials: [
                {
                  id: '7b-oa01-mat1',
                  title: 'Presentación: Los Enteros en la Recta Numérica',
                  type: 'presentation',
                  tag: 'Números Enteros',
                  readTime: '12 min',
                  summary: 'Modelamiento de temperaturas, alturas, deudas y desplazamientos en la recta numérica.',
                  contentMarkdown: `### 🎯 Operaciones con Enteros $\\mathbb{Z}$
- **Signos iguales:** Se suman los valores absolutos y se conserva el signo: $(-4) + (-6) = -10$.
- **Signos distintos:** Se restan los valores absolutos y se conserva el signo del de mayor magnitud: $(+8) + (-12) = -4$.
- **Sustracción como suma del opuesto:** $a - b = a + (-b)$.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa01-g1',
                  title: 'Ejercicio Guiado: Variación Térmica en la Cordillera',
                  difficulty: 'Básico',
                  statement: 'A las 04:00 la temperatura en la cordillera es de $-6^\\circ\\text{C}$. Al mediodía la temperatura sube $11^\\circ\\text{C}$. ¿Qué temperatura marca el termómetro al mediodía?',
                  steps: [
                    {
                      title: 'Paso 1: Plantear la suma',
                      description: 'Partimos de $-6$ y sumamos el aumento $+11$.',
                      mathExpression: '(-6) + (+11)'
                    },
                    {
                      title: 'Paso 2: Calcular el resultado',
                      description: 'Como tienen signos opuestos, restamos $11 - 6 = 5$ conservando el signo positivo.',
                      mathExpression: '+5^\\circ\\text{C}'
                    }
                  ],
                  finalAnswer: '5°C'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa01-prop1',
                  title: 'Guía de Operatoria Básica en Z',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Resuelve utilizando la recta numérica como apoyo visual.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $(-14) + (+9) - (-5)$',
                      solution: '$(-5) + 5 = 0$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['numeros'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 02',
              title: 'Cálculo y Aplicación de Porcentajes',
              description: 'Explicar el porcentaje de manera concreta, pictórica y simbólica y resolver problemas de descuentos, recargos e IVA.',
              materials: [
                {
                  id: '7b-oa02-mat1',
                  title: 'Presentación: Estrategias Rápidas de Porcentajes',
                  type: 'presentation',
                  tag: 'Porcentajes e IVA',
                  readTime: '15 min',
                  summary: 'Equivalencias $10\\% = 0.1$, $25\\% = \\frac{1}{4}$, $50\\% = \\frac{1}{2}$ y cálculo de IVA ($19\\%$).',
                  contentMarkdown: `### 📊 ¿Qué es un Porcentaje?
Una razón donde el consecuente es 100:
$$P\\% = \\frac{P}{100}$$
- **Descuento del 15%:** Se paga el $85\\%$ del valor original.
- **Recargo de IVA (19%):** Precio final $= \\text{Neto} \\times 1.19$.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa02-g1',
                  title: 'Ejercicio Guiado: Descuento en Tienda Comercial',
                  difficulty: 'Intermedio',
                  statement: 'Una zapatilla de $\\$40.000$ tiene un $25\\%$ de descuento. ¿Cuánto dinero se descuenta y cuánto se paga?',
                  steps: [
                    {
                      title: 'Paso 1: Calcular el 25% (la cuarta parte)',
                      description: '$40.000 \\times 0.25 = \\$10.000$ de ahorro.'
                    },
                    {
                      title: 'Paso 2: Calcular el precio con descuento',
                      description: '$40.000 - 10.000 = \\$30.000$.'
                    }
                  ],
                  finalAnswer: 'Ahorro: $10.000 | Pago Final: $30.000'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa02-prop1',
                  title: 'Guía de Comercio, Descuentos y Facturas',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Calcula los valores finales con y sin IVA.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el $15\\%$ de propina sobre una cuenta de $\\$24.000$.',
                      solution: '$24.000 \\cdot 0.15 = \\$3.600$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['numeros'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 03',
              title: 'Multiplicación y División de Fracciones y Decimales',
              description: 'Resolver problemas que involucren la multiplicación y la división de fracciones y de decimales positivos en situaciones cotidianas.',
              materials: [
                {
                  id: '7b-oa03-mat1',
                  title: 'Presentación: Operaciones con Fracciones y Decimales',
                  type: 'presentation',
                  tag: 'Fracciones y Decimales',
                  readTime: '12 min',
                  summary: 'Multiplicación directa $\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{ac}{bd}$ y división invirtiendo la segunda fracción.',
                  contentMarkdown: `### 🥞 Operatoria con Fracciones Positivas
- **Multiplicación:** $\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$
- **División:** $\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa03-g1',
                  title: 'Ejercicio Guiado: Porciones de Tarta Fraccionales',
                  difficulty: 'Básico',
                  statement: 'Si se dispone de $\\frac{3}{4}\\text{ kg}$ de azúcar y se quieren preparar porciones de $\\frac{1}{8}\\text{ kg}$, ¿cuántas porciones se obtienen?',
                  steps: [
                    {
                      title: 'Paso 1: Plantear la división fraccionaria',
                      description: '$\\frac{3}{4} \\div \\frac{1}{8} = \\frac{3}{4} \\cdot \\frac{8}{1} = \\frac{24}{4} = 6$.'
                    }
                  ],
                  finalAnswer: '6 porciones'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa03-prop1',
                  title: 'Guía de Fracciones y Decimales en Recetas',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Simplifica cada fracción resultante.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $\\frac{2}{3} \\cdot \\frac{9}{4}$',
                      solution: '$\\frac{18}{12} = \\frac{3}{2} = 1.5$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['numeros'].oas[2]?.questions || []
            },
            {
              oaId: 'OA 04',
              title: 'Potencias de Base 10 y Notación Científica',
              description: 'Mostrar que comprenden las potencias de base 10 con exponente natural: aplicándolas a la representación de números muy grandes en astronomía y ciencias.',
              materials: [
                {
                  id: '7b-oa04-mat1',
                  title: 'Presentación: El Universo y las Potencias de 10',
                  type: 'presentation',
                  tag: 'Potencias de 10',
                  readTime: '12 min',
                  summary: '$10^n$ equivale al 1 seguido de $n$ ceros. Uso en distancias astronómicas.',
                  contentMarkdown: `### 🪐 Potencias de Base 10
$$10^1 = 10, \\quad 10^3 = 1.000, \\quad 10^6 = 1.000.000$$
Notación Científica: $a \\times 10^n$ donde $1 \\le a < 10$.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa04-g1',
                  title: 'Ejercicio Guiado: Distancia de la Tierra al Sol',
                  difficulty: 'Básico',
                  statement: 'La distancia media de la Tierra al Sol es de $150.000.000\\text{ km}$. Exprésala en notación científica.',
                  steps: [
                    {
                      title: 'Paso 1: Mover la coma decimal',
                      description: 'Movemos la coma 8 lugares a la izquierda hasta $1.5$.',
                      mathExpression: '1.5 \\times 10^8\\text{ km}'
                    }
                  ],
                  finalAnswer: '1.5 × 10⁸ km'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa04-prop1',
                  title: 'Guía de Notación Científica y Potencias de 10',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Transforma cada número a notación científica.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Escribe $7.200.000$ como potencia de base 10.',
                      solution: '$7.2 \\times 10^6$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['numeros'].oas[3]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Álgebra y Funciones',
          shortTitle: 'Álgebra y Funciones',
          icon: '📐',
          description: 'Lenguaje algebraico, razones y proporciones directas e inversas, y resolución de ecuaciones lineales.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 06',
              title: 'Lenguaje Algebraico y Reducción de Términos',
              description: 'Utilizar el lenguaje algebraico para generalizar relaciones entre números, modelar situaciones y reducir términos semejantes.',
              materials: [
                {
                  id: '7b-oa06-mat1',
                  title: 'Presentación: De la Palabra al Símbolo Algebraico',
                  type: 'presentation',
                  tag: 'Álgebra Inicial',
                  readTime: '12 min',
                  summary: 'Traducción de enunciados a expresiones algebraicas y suma/resta de términos con idéntico factor literal.',
                  contentMarkdown: `### 🔤 Expresiones Algebraicas
- El doble de un número: $2x$
- El consecutivo de un número: $x + 1$
- Términos semejantes: $3x + 5x = 8x$ (misma letra y exponente).`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa06-g1',
                  title: 'Ejercicio Guiado: Reducción de Términos Semejantes',
                  difficulty: 'Básico',
                  statement: 'Reduce la expresión: $5x + 3y - 2x + 7y - 4$',
                  steps: [
                    {
                      title: 'Paso 1: Agrupar términos en x',
                      description: '$5x - 2x = 3x$.'
                    },
                    {
                      title: 'Paso 2: Agrupar términos en y',
                      description: '$3y + 7y = 10y$.'
                    },
                    {
                      title: 'Paso 3: Unir con la constante',
                      description: '$3x + 10y - 4$.'
                    }
                  ],
                  finalAnswer: '3x + 10y - 4'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa06-prop1',
                  title: 'Guía de Traducción al Lenguaje Algebraico',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Plantea la expresión algebraica correspondiente.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Simplifica: $4a - 2b + 6a + 5b$',
                      solution: '$10a + 3b$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['algebra'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 08',
              title: 'Proporcionalidad Directa e Inversa',
              description: 'Mostrar que comprenden las proporciones directas e inversas: tablas de valores, gráficos cartesianos y constante de proporcionalidad k.',
              materials: [
                {
                  id: '7b-oa08-mat1',
                  title: 'Presentación: Proporción Directa vs Inversa',
                  type: 'presentation',
                  tag: 'Proporcionalidad',
                  readTime: '15 min',
                  summary: 'Directa ($y = kx$, recta que pasa por el origen) vs Inversa ($x \\cdot y = k$, hipérbola).',
                  contentMarkdown: `### ⚖️ Tipos de Proporcionalidad
- **Directa:** Al duplicar una, la otra se duplica. $\\frac{y}{x} = k$. Gráfico: Línea recta que pasa por $(0,0)$.
- **Inversa:** Al duplicar una, la otra se reduce a la mitad. $x \\cdot y = k$. Gráfico: Hipérbola equilátera.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa08-g1',
                  title: 'Ejercicio Guiado: Construcción con Trabajadores',
                  difficulty: 'Intermedio',
                  statement: 'Si 6 máquinas embotelladoras tardan 4 horas en llenar un pedido, ¿cuántas horas tardarán 8 máquinas iguales?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar el tipo de proporción',
                      description: 'A más máquinas, menos tiempo: Proporción Inversa.'
                    },
                    {
                      title: 'Paso 2: Calcular la constante k',
                      description: '$k = 6 \\times 4 = 24\\text{ máquina-horas}$.'
                    },
                    {
                      title: 'Paso 3: Calcular el nuevo tiempo',
                      description: '$t = \\frac{24}{8} = 3\\text{ horas}$.'
                    }
                  ],
                  finalAnswer: '3 horas'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa08-prop1',
                  title: 'Guía de Proporcionalidad y Regla de Tres',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Indica si la relación es directa o inversa antes de resolver.',
                  problems: [
                    {
                      number: 1,
                      statement: '3 metros de tela cuestan $\\$12.000$. ¿Cuánto cuestan 7 metros?',
                      solution: 'Proporción directa: $\\frac{12000}{3} \\cdot 7 = \\$28.000$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['algebra'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 09',
              title: 'Ecuaciones e Inecuaciones Lineales',
              description: 'Modelar y resolver problemas mediante ecuaciones e inecuaciones lineales de la forma ax + b = c y ax + b > c.',
              materials: [
                {
                  id: '7b-oa09-mat1',
                  title: 'Presentación: Balanza de Ecuaciones de Primer Grado',
                  type: 'presentation',
                  tag: 'Ecuaciones Lineales',
                  readTime: '12 min',
                  summary: 'Despeje de la incógnita aplicando operaciones inversas a ambos lados de la igualdad.',
                  contentMarkdown: `### ⚖️ Ecuación Lineal $ax + b = c$
1. Restar o sumar $b$ en ambos miembros: $ax = c - b$.
2. Dividir por $a$ ($a \\neq 0$): $x = \\frac{c - b}{a}$.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa09-g1',
                  title: 'Ejercicio Guiado: Ecuación con Incógnita',
                  difficulty: 'Básico',
                  statement: 'Resuelve: $3x + 8 = 29$',
                  steps: [
                    {
                      title: 'Paso 1: Restar 8 en ambos lados',
                      description: '$3x = 29 - 8 = 21$.'
                    },
                    {
                      title: 'Paso 2: Dividir por 3',
                      description: '$x = \\frac{21}{3} = 7$.'
                    }
                  ],
                  finalAnswer: 'x = 7'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa09-prop1',
                  title: 'Guía de Ecuaciones Lineales en Contexto',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Comprueba siempre tu respuesta sustituyendo en la ecuación original.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Resuelve $5x - 4 = 36$',
                      solution: '$5x = 40 \\implies x = 8$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['algebra'].oas[2]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Geometría',
          shortTitle: 'Geometría',
          icon: '📏',
          description: 'Círculo y circunferencia (perímetro y área), triángulos y transformaciones isométricas.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 11',
              title: 'Círculo y Circunferencia (Perímetro y Área)',
              description: 'Mostrar que comprenden el círculo y su circunferencia: deduciendo las fórmulas del perímetro $P = 2\\pi r$ y del área $A = \\pi r^2$.',
              materials: [
                {
                  id: '7b-oa11-mat1',
                  title: 'Presentación: El Número Pi y la Geometría Circular',
                  type: 'presentation',
                  tag: 'Círculo y Pi',
                  readTime: '15 min',
                  summary: 'Definición de $\\pi \\approx 3.1416$, diámetro $d = 2r$, perímetro $P = 2\\pi r$ y área $A = \\pi r^2$.',
                  contentMarkdown: `### 🔴 Fórmulas del Círculo
- **Perímetro (longitud de la circunferencia):**
  $$P = 2\\pi r = \\pi d$$
- **Área del círculo:**
  $$A = \\pi r^2$$`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa11-g1',
                  title: 'Ejercicio Guiado: Césped Circular en una Plaza',
                  difficulty: 'Intermedio',
                  statement: 'Se desea sembrar pasto en una rotonda circular de $10\\text{ metros}$ de diámetro. ¿Cuántos metros cuadrados de pasto se necesitan? (usa $\\pi \\approx 3.14$)',
                  steps: [
                    {
                      title: 'Paso 1: Determinar el radio',
                      description: 'El radio es la mitad del diámetro: $r = \\frac{10}{2} = 5\\text{ m}$.'
                    },
                    {
                      title: 'Paso 2: Calcular el área circular',
                      description: '$A = 3.14 \\times 5^2 = 3.14 \\times 25 = 78.5\\text{ m}^2$.'
                    }
                  ],
                  finalAnswer: '78.5 m²'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa11-prop1',
                  title: 'Guía de Ruedas, Plazas y Áreas Circulares',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Calcula perímetros y áreas redondeando a 2 decimales.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el perímetro de una rueda de bicicleta con radio $30\\text{ cm}$.',
                      solution: '$P = 2 \\cdot 3.14 \\cdot 30 = 188.4\\text{ cm}$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['geometria'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 12',
              title: 'Triángulos y Relaciones Angulares',
              description: 'Construir triángulos y calcular la suma de ángulos interiores ($180^\\circ$) y exteriores ($360^\\circ$).',
              materials: [
                {
                  id: '7b-oa12-mat1',
                  title: 'Presentación: Propiedades Angulares de los Triángulos',
                  type: 'presentation',
                  tag: 'Triángulos',
                  readTime: '12 min',
                  summary: 'Clasificación según lados y ángulos, y teorema fundamental de la suma interior $\\alpha + \\beta + \\gamma = 180^\\circ$.',
                  contentMarkdown: `### 🔺 Propiedad Fundamental de Triángulos
$$\\alpha + \\beta + \\gamma = 180^\\circ$$
- En un triángulo equilátero, cada ángulo mide $60^\\circ$.
- En un triángulo rectángulo, los dos ángulos agudos son complementarios: $\\alpha + \\beta = 90^\\circ$.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa12-g1',
                  title: 'Ejercicio Guiado: Ángulo Faltante en Triángulo Isósceles',
                  difficulty: 'Básico',
                  statement: 'Un triángulo isósceles tiene un ángulo basal de $50^\\circ$. ¿Cuánto mide el ángulo del vértice superior?',
                  steps: [
                    {
                      title: 'Paso 1: Sumar los dos ángulos basales iguales',
                      description: '$50^\\circ + 50^\\circ = 100^\\circ$.'
                    },
                    {
                      title: 'Paso 2: Restar a 180°',
                      description: '$\\text{Vértice} = 180^\\circ - 100^\\circ = 80^\\circ$.'
                    }
                  ],
                  finalAnswer: '80°'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa12-prop1',
                  title: 'Guía de Geometría de Triángulos y Ángulos',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Determina los ángulos faltantes en cada figura.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si un triángulo rectángulo tiene un ángulo de $35^\\circ$, ¿cuánto mide el otro ángulo agudo?',
                      solution: '$90^\\circ - 35^\\circ = 55^\\circ$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['geometria'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 14',
              title: 'Transformaciones Isométricas en el Plano',
              description: 'Identificar y realizar transformaciones isométricas (traslaciones, rotaciones y reflexiones) conservando forma y tamaño.',
              materials: [
                {
                  id: '7b-oa14-mat1',
                  title: 'Presentación: Traslación, Rotación y Reflexión',
                  type: 'presentation',
                  tag: 'Isometrías',
                  readTime: '12 min',
                  summary: 'Las transformaciones isométricas no alteran las distancias ni los ángulos de las figuras.',
                  contentMarkdown: `### 🔄 Transformaciones Isométricas
- **Traslación:** Desplazamiento según un vector $\\vec{v} = (a, b)$.
- **Rotación:** Giro respecto a un centro en un ángulo $\\theta$.
- **Reflexión:** Efecto espejo respecto a un eje de simetría.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa14-g1',
                  title: 'Ejercicio Guiado: Traslación Vectorial',
                  difficulty: 'Básico',
                  statement: 'Aplica una traslación con vector $\\vec{v} = (4, -3)$ al punto $A(2, 5)$.',
                  steps: [
                    {
                      title: 'Paso 1: Sumar componentes homólogas',
                      description: '$x\' = 2 + 4 = 6$, $y\' = 5 + (-3) = 2$.'
                    }
                  ],
                  finalAnswer: 'A\'(6, 2)'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa14-prop1',
                  title: 'Guía de Mosaicos e Isometrías',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Determina las coordenadas de los vértices transformados.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Refleja el punto $P(3, 4)$ respecto al eje X.',
                      solution: '$P\'(3, -4)$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['geometria'].oas[2]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Probabilidad y Estadística',
          shortTitle: 'Probabilidad y Estadística',
          icon: '📊',
          description: 'Medidas de tendencia central (media, mediana, moda), gráficos estadísticos y regla de Laplace.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 16',
              title: 'Estadística Descriptiva y Medidas de Tendencia Central',
              description: 'Representar datos obtenidos en una muestra mediante tablas de frecuencias y calcular media aritmética, mediana y moda.',
              materials: [
                {
                  id: '7b-oa16-mat1',
                  title: 'Presentación: Media, Mediana y Moda',
                  type: 'presentation',
                  tag: 'Estadística 1D',
                  readTime: '15 min',
                  summary: 'Cálculo del promedio $\\bar{x}$, dato central ordenado (mediana) y valor más frecuente (moda).',
                  contentMarkdown: `### 📈 Medidas de Tendencia Central
- **Media $(\\bar{x})$:** $\\frac{\\sum x_i}{N}$ (Promedio).
- **Mediana $(\\text{Me})$:** Dato central al ordenar de menor a mayor.
- **Moda $(\\text{Mo})$:** El valor con mayor frecuencia absoluta.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa16-g1',
                  title: 'Ejercicio Guiado: Cálculo de Mediana y Promedio',
                  difficulty: 'Básico',
                  statement: 'Dado el conjunto de notas: $4, 6, 5, 7, 6$, calcula la media y la mediana.',
                  steps: [
                    {
                      title: 'Paso 1: Calcular la media',
                      description: '$\\bar{x} = \\frac{4 + 6 + 5 + 7 + 6}{5} = \\frac{28}{5} = 5.6$.'
                    },
                    {
                      title: 'Paso 2: Ordenar datos para la mediana',
                      description: 'Datos ordenados: $4, 5, \\mathbf{6}, 6, 7$. El valor del medio es $6$.'
                    }
                  ],
                  finalAnswer: 'Media = 5.6 | Mediana = 6'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa16-prop1',
                  title: 'Guía de Encuestas y Gráficos Estadísticos',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Calcula media, mediana y moda para cada tabla de datos.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Halla la moda de: $3, 5, 5, 2, 8, 5, 9$.',
                      solution: 'Moda = 5 (aparece 3 veces).',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['probabilidad'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 18',
              title: 'Probabilidad y Regla de Laplace',
              description: 'Calcular la probabilidad de un evento en experimentos equiprobables mediante la regla de Laplace.',
              materials: [
                {
                  id: '7b-oa18-mat1',
                  title: 'Presentación: Juegos de Azar y Regla de Laplace',
                  type: 'presentation',
                  tag: 'Probabilidad Clásica',
                  readTime: '12 min',
                  summary: 'Fórmula $P(A) = \\frac{\\text{Casos Favorables}}{\\text{Casos Posibles}}$. Escala de $0$ a $1$.',
                  contentMarkdown: `### 🎲 Regla de Laplace
$$P(A) = \\frac{\\text{Número de casos favorables a } A}{\\text{Número total de casos posibles}}$$
- $P = 0 \\implies$ Evento imposible.
- $P = 1 \\implies$ Evento seguro.`
                }
              ],
              guidedExercises: [
                {
                  id: '7b-oa18-g1',
                  title: 'Ejercicio Guiado: Lanzamiento de Dado',
                  difficulty: 'Básico',
                  statement: '¿Cuál es la probabilidad de obtener un número mayor que 4 al lanzar un dado común de 6 caras?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar casos favorables',
                      description: 'Los números mayores que 4 son $\\{5, 6\\}$ (2 casos).'
                    },
                    {
                      title: 'Paso 2: Aplicar la regla de Laplace',
                      description: '$P = \\frac{2}{6} = \\frac{1}{3} \\approx 33.3\\%$.'
                    }
                  ],
                  finalAnswer: '1/3 ≈ 33.3%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '7b-oa18-prop1',
                  title: 'Guía de Probabilidad con Ruletas y Monedas',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Expresa las probabilidades en fracción y porcentaje.',
                  problems: [
                    {
                      number: 1,
                      statement: 'De una bolsa con 3 bolas rojas y 7 azules, ¿cuál es la probabilidad de sacar una roja?',
                      solution: '$\\frac{3}{10} = 30\\%$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['7_basico'].ejes['probabilidad'].oas[1]?.questions || []
            }
          ]
        }
      ]
    },

    '8_basico': {
      id: '8_basico',
      name: '8° Básico',
      category: 'Educación Básica',
      badgeNumber: '8',
      colorBadge: 'bg-blue-600 text-white',
      description: 'Consolidación de operaciones con racionales, álgebra básica, teorema de Pitágoras y estadística descriptiva.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Números',
          shortTitle: 'Números',
          icon: '🔢',
          description: 'Multiplicación y división de enteros, operaciones con números racionales, potencias de base racional y raíces cuadradas.',
          colorTheme: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            badge: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-600 to-indigo-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Multiplicación y División de Números Enteros',
              description: 'Mostrar que comprenden la multiplicación y la división de números enteros: representando de manera concreta, pictórica y simbólica.',
              materials: [
                {
                  id: '8b-oa01-mat1',
                  title: 'Presentación Magistral: Regla de los Signos y Operatoria en Z',
                  type: 'presentation',
                  tag: 'Diapositivas y Pizarra',
                  readTime: '15 min de exposición',
                  summary: 'Marco conceptual con recta numérica, modelamiento de la regla de signos $(+) \\cdot (-) = (-)$ y resolución de operaciones combinadas.',
                  contentMarkdown: `### 🎯 Objetivo de la Clase (OA 01)
Comprender la multiplicación y división en el conjunto $\\mathbb{Z}$ mediante recta numérica y jerarquía de operaciones.

---

### 1. La Regla de los Signos
La multiplicación y división de números enteros sigue el principio de signos iguales vs. signos distintos:

- **Signos Iguales $\\implies$ Positivo (+)**
  * $(+) \\cdot (+) = (+)$ $\\quad \\rightarrow \\quad (+4) \\cdot (+3) = +12$
  * $(-) \\cdot (-) = (+)$ $\\quad \\rightarrow \\quad (-5) \\cdot (-2) = +10$
- **Signos Distintos $\\implies$ Negativo (-)**
  * $(+) \\cdot (-) = (-)$ $\\quad \\rightarrow \\quad (+6) \\cdot (-3) = -18$
  * $(-) \\cdot (+) = (-)$ $\\quad \\rightarrow \\quad (-8) \\cdot (+2) = -16$

---

### 2. Jerarquía de Operaciones (PAPOMUDAS)
Al resolver operaciones combinadas en $\\mathbb{Z}$, el orden estricto es:
1. **PA**: Paréntesis desde adentro hacia afuera.
2. **PO**: Potencias.
3. **MU - D**: Multiplicaciones y Divisiones de izquierda a derecha.
4. **A - S**: Adiciones y Sustracciones de izquierda a derecha.

---

### 💡 Ejemplo Clave en Pizarra
$$(-18) \\div 3 + (-4) \\cdot (-5)$$
- Paso 1 (División): $(-18) \\div 3 = -6$
- Paso 2 (Multiplicación): $(-4) \\cdot (-5) = +20$
- Paso 3 (Suma): $(-6) + 20 = 14$`
                },
                {
                  id: '8b-oa01-mat2',
                  title: 'Apunte Teórico: Problemas de Aplicación en Contextos Reales',
                  type: 'summary',
                  tag: 'Ficha Teórica',
                  readTime: '10 min',
                  summary: 'Aplicación de números enteros en profundidad submarina, variaciones térmicas y saldos bancarios.',
                  contentMarkdown: `### 📌 Contextos Reales de Números Enteros

- **Temperatura:** Una cámara frigorífica desciende su temperatura $3^\\circ\\text{C}$ cada hora. En 5 horas el cambio es $(-3) \\cdot 5 = -15^\\circ\\text{C}$.
- **Finanzas:** Si una empresa pierde $\\$50.000$ diarios durante 4 días, el balance es $(-50000) \\cdot 4 = -\\$200.000$.
- **Geografía:** Un submarino desciende a una razón de $-12\\text{ m/min}$. En 6 minutos alcanza $(-12) \\cdot 6 = -72\\text{ metros}$.`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa01-g1',
                  title: 'Ejercicio Guiado: Operación Combinada con Doble Paréntesis',
                  difficulty: 'Intermedio',
                  statement: 'Resuelve paso a paso en la pizarra: $[(-15) + 3] \\cdot [(-4) - (-2)] \\div (-6)$',
                  steps: [
                    {
                      title: 'Paso 1: Resolver el primer corchete',
                      description: 'Efectuamos la suma de enteros con distinto signo.',
                      mathExpression: '(-15) + 3 = -12',
                      pedagogicalTip: 'Recordar a los alumnos que al sumar signos distintos se conserva el signo del número de mayor valor absoluto.'
                    },
                    {
                      title: 'Paso 2: Resolver el segundo corchete',
                      description: 'Convertimos la resta en suma del opuesto: $-(-2) = +2$.',
                      mathExpression: '(-4) - (-2) = (-4) + 2 = -2'
                    },
                    {
                      title: 'Paso 3: Multiplicar los resultados intermedios',
                      description: 'Multiplicamos dos enteros negativos (signos iguales $\\rightarrow$ positivo).',
                      mathExpression: '(-12) \\cdot (-2) = +24'
                    },
                    {
                      title: 'Paso 4: Realizar la división final',
                      description: 'Dividimos positivo entre negativo (signos distintos $\\rightarrow$ negativo).',
                      mathExpression: '24 \\div (-6) = -4'
                    }
                  ],
                  finalAnswer: '-4'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa01-prop1',
                  title: 'Guía de Trabajo N°1: Operatoria en Z y Problemas de Balance',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Resuelve cada ejercicio en tu cuaderno justificando cada paso según la jerarquía de operaciones.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $(-8) \\cdot (-3) - (-14) \\div 2$',
                      solution: '24 - (-7) = 24 + 7 = 31',
                      points: 3
                    },
                    {
                      number: 2,
                      statement: 'Un termómetro marca $-5^\\circ\\text{C}$ a las 06:00. Si la temperatura aumenta $3^\\circ\\text{C}$ cada 2 horas, ¿cuál será la temperatura a las 14:00?',
                      solution: 'Han pasado 8 horas (4 intervalos de 2h). Cambio: $4 \\cdot 3 = +12^\\circ\\text{C}$. Final: $-5 + 12 = 7^\\circ\\text{C}$.',
                      points: 4
                    },
                    {
                      number: 3,
                      statement: 'Determina el valor de $x$ en la ecuación: $x \\cdot (-4) = -72$',
                      solution: '$x = -72 / -4 = 18$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['numeros'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 02',
              title: 'Operaciones con Números Racionales',
              description: 'Utilizar las operaciones de adición y sustracción con los números racionales en el contexto de la resolución de problemas.',
              materials: [
                {
                  id: '8b-oa02-mat1',
                  title: 'Presentación: Mínimo Común Múltiplo y Fracciones Heterogéneas',
                  type: 'presentation',
                  tag: 'Presentación KaTeX',
                  readTime: '12 min',
                  summary: 'Estrategias para amplificar fracciones con distinto denominador y simplificación hasta fracción irreductible.',
                  contentMarkdown: `### 🎯 Números Racionales $\\mathbb{Q}$
Toda fracción de la forma $\\frac{a}{b}$ con $a, b \\in \\mathbb{Z}$ y $b \\neq 0$.

### Suma y Resta de Fracciones con Distinto Denominador
$$\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{a \\cdot d \\pm b \\cdot c}{b \\cdot d}$$

O bien utilizando el $\\text{m.c.m.}$ entre denominadores para amplificar de manera óptima.`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa02-g1',
                  title: 'Ejercicio Guiado: Suma combinada de racionales y decimales',
                  difficulty: 'Intermedio',
                  statement: 'Calcula el valor exacto de: $\\left(-\\frac{3}{4}\\right) + 0.5 - \\frac{2}{3}$',
                  steps: [
                    {
                      title: 'Paso 1: Convertir decimal a fracción',
                      description: 'Transformamos $0.5$ a fracción simplificada.',
                      mathExpression: '0.5 = \\frac{5}{10} = \\frac{1}{2}'
                    },
                    {
                      title: 'Paso 2: Calcular el mínimo común múltiplo (m.c.m.)',
                      description: 'Determinamos el m.c.m. entre los denominadores 4, 2 y 3.',
                      mathExpression: '\\text{m.c.m.}(4, 2, 3) = 12'
                    },
                    {
                      title: 'Paso 3: Amplificar cada fracción al denominador 12',
                      description: 'Multiplicamos numerador y denominador correspondientes.',
                      mathExpression: '-\\frac{3 \\cdot 3}{12} + \\frac{1 \\cdot 6}{12} - \\frac{2 \\cdot 4}{12} = \\frac{-9 + 6 - 8}{12}'
                    },
                    {
                      title: 'Paso 4: Reducir el numerador',
                      description: '$-9 + 6 - 8 = -11$.',
                      mathExpression: '-\\frac{11}{12}'
                    }
                  ],
                  finalAnswer: '-\\frac{11}{12}'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa02-prop1',
                  title: 'Guía de Racionales: Recetas y Proporciones',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Expresa todos los resultados en su forma fraccionaria irreducible.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Un pastelero tiene $\\frac{3}{4}\\text{ kg}$ de harina y usa $\\frac{2}{5}\\text{ kg}$. ¿Cuánta harina le queda?',
                      solution: '$\\frac{3}{4} - \\frac{2}{5} = \\frac{15 - 8}{20} = \\frac{7}{20}\\text{ kg}$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['numeros'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 03',
              title: 'Potencias de Base Racional y Exponente Entero',
              description: 'Explicar la multiplicación y la división de potencias de base racional y exponente entero de manera concreta, pictórica y simbólica.',
              materials: [
                {
                  id: '8b-oa03-mat1',
                  title: 'Infografía: Las 6 Propiedades Fundamentales de las Potencias',
                  type: 'infographic',
                  tag: 'Formulario Rápido',
                  readTime: '8 min',
                  summary: 'Multiplicación y división de igual base, igual exponente, potencia de una potencia y exponente negativo.',
                  contentMarkdown: `### ⚡ Propiedades de las Potencias
1. $a^n \\cdot a^m = a^{n+m}$
2. $\\frac{a^n}{a^m} = a^{n-m}$
3. $(a^n)^m = a^{n \\cdot m}$
4. $(a \\cdot b)^n = a^n \\cdot b^n$
5. $\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$
6. $a^{-n} = \\frac{1}{a^n} \\quad \\text{y} \\quad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa03-g1',
                  title: 'Ejercicio Guiado: Simplificación de Expresiones con Potencias',
                  difficulty: 'Intermedio',
                  statement: 'Simplifica la expresión $\\frac{2^4 \\cdot (2^3)^2}{2^7}$',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar potencia de una potencia',
                      description: '$(2^3)^2 = 2^{3 \\cdot 2} = 2^6$.',
                      mathExpression: '(2^3)^2 = 2^6'
                    },
                    {
                      title: 'Paso 2: Multiplicar potencias de igual base en el numerador',
                      description: '$2^4 \\cdot 2^6 = 2^{4+6} = 2^{10}$.',
                      mathExpression: '2^{10}'
                    },
                    {
                      title: 'Paso 3: Dividir potencias de igual base',
                      description: '$2^{10} \\div 2^7 = 2^{10-7} = 2^3 = 8$.',
                      mathExpression: '2^3 = 8'
                    }
                  ],
                  finalAnswer: '8'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa03-prop1',
                  title: 'Guía de Potencias y Notación Científica',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Aplica propiedades paso a paso.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $\\left(\\frac{2}{3}\\right)^{-2} + \\left(\\frac{1}{2}\\right)^3$',
                      solution: '$\\frac{9}{4} + \\frac{1}{8} = \\frac{18 + 1}{8} = \\frac{19}{8}$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['numeros'].oas[2]?.questions || []
            },
            {
              oaId: 'OA 04',
              title: 'Raíces Cuadradas y Estimación',
              description: 'Mostrar que comprenden las raíces cuadradas de números naturales: estimándolas de manera intuitiva y resolviendo problemas geométricos.',
              materials: [
                {
                  id: '8b-oa04-mat1',
                  title: 'Apunte: Raíces Exactas e Inexactas en la Recta Numérica',
                  type: 'summary',
                  tag: 'Geometría y Álgebra',
                  readTime: '10 min',
                  summary: 'Conexión entre el área del cuadrado y la longitud de su lado para aproximar raíces.',
                  contentMarkdown: `### 📐 Raíz Cuadrada Geométrica
Si un cuadrado tiene un área de $A\\text{ cm}^2$, la medida de su lado es $L = \\sqrt{A}$.

### Estimación por Cuadrados Perfectos
Para estimar $\\sqrt{50}$:
- Cuadrado perfecto menor: $7^2 = 49$
- Cuadrado perfecto mayor: $8^2 = 64$
- Como $49 < 50 < 64 \\implies 7 < \\sqrt{50} < 8$ (muy cercana a $7.07$).`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa04-g1',
                  title: 'Ejercicio Guiado: Estimación de un lado de un terreno cuadrado',
                  difficulty: 'Básico',
                  statement: 'Un terreno cuadrado tiene un área de $120\\text{ m}^2$. ¿Entre qué dos números enteros se encuentra la medida de su cerca perimetral?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar cuadrados perfectos',
                      description: '$10^2 = 100$ y $11^2 = 121$.',
                      mathExpression: '100 < 120 < 121'
                    },
                    {
                      title: 'Paso 2: Extraer raíz cuadrada',
                      description: '$10 < \\sqrt{120} < 11$ (muy próximo a 11 metros por lado).',
                      mathExpression: 'L \\approx 10.95\\text{ m}'
                    }
                  ],
                  finalAnswer: 'Entre 10 y 11 metros'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa04-prop1',
                  title: 'Guía de Estimación de Raíces Cuadradas',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Ubica cada raíz en la recta numérica.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Estima el valor de $\\sqrt{80}$ con un decimal.',
                      solution: 'Entre $8^2=64$ y $9^2=81$. $\\sqrt{80} \\approx 8.94$.',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['numeros'].oas[3]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Álgebra y Funciones',
          shortTitle: 'Álgebra y Funciones',
          icon: '📐',
          description: 'Expresiones algebraicas, ecuaciones lineales con coeficientes racionales, inecuaciones y función afín.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 06',
              title: 'Operaciones con Expresiones Algebraicas',
              description: 'Mostrar que comprenden las operaciones de expresiones algebraicas según sus propiedades.',
              materials: [
                {
                  id: '8b-oa06-mat1',
                  title: 'Presentación: Reducción de Términos Semejantes',
                  type: 'presentation',
                  tag: 'Pizarra Interactiva',
                  readTime: '15 min',
                  summary: 'Identificación de factores literales idénticos y multiplicación de monomios por polinomios.',
                  contentMarkdown: `### 🧩 Expresiones Algebraicas
Un término algebraico consta de:
- **Signo y Coeficiente Numérico**
- **Factor Literal** (variables y sus exponentes)

### Reducción de Términos Semejantes
$$3x^2y - 5xy + 7x^2y + 2xy = (3+7)x^2y + (-5+2)xy = 10x^2y - 3xy$$`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa06-g1',
                  title: 'Ejercicio Guiado: Multiplicación de Binomio por Monomio con Fracciones',
                  difficulty: 'Intermedio',
                  statement: 'Desarrolla y simplifica: $\\frac{2}{3}x \\cdot \\left(6x - 9y + 12\\right)$',
                  steps: [
                    {
                      title: 'Paso 1: Distribuir término a término',
                      description: 'Multiplicamos $\\frac{2}{3}x$ por cada sumando del paréntesis.',
                      mathExpression: '\\left(\\frac{2}{3}x \\cdot 6x\\right) - \\left(\\frac{2}{3}x \\cdot 9y\\right) + \\left(\\frac{2}{3}x \\cdot 12\\right)'
                    },
                    {
                      title: 'Paso 2: Simplificar coeficientes',
                      description: '$\\frac{12}{3}x^2 - \\frac{18}{3}xy + \\frac{24}{3}x = 4x^2 - 6xy + 8x$.',
                      mathExpression: '4x^2 - 6xy + 8x'
                    }
                  ],
                  finalAnswer: '4x^2 - 6xy + 8x'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa06-prop1',
                  title: 'Guía de Modelamiento Algebraico de Perímetros y Áreas',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Plantea la expresión algebraica para cada figura geométrica.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Un rectángulo tiene base $2x + 5$ y altura $x - 3$. Expresa su perímetro algebraico.',
                      solution: '$P = 2(2x+5) + 2(x-3) = 4x + 10 + 2x - 6 = 6x + 4$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['algebra'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 10',
              title: 'Función Lineal y Función Afín',
              description: 'Mostrar que comprenden la función afín: generalizándola como la comparación de dos variables y graficando en el plano cartesiano.',
              materials: [
                {
                  id: '8b-oa10-mat1',
                  title: 'Presentación: Pendiente e Intersección con el Eje Y',
                  type: 'presentation',
                  tag: 'Gráficos Cartesianos',
                  readTime: '15 min',
                  summary: 'Forma general $f(x) = mx + n$. Significado físico de la pendiente $m$ como tasa de cambio.',
                  contentMarkdown: `### 📈 Función Afín: $f(x) = mx + n$
- $m$: **Pendiente** (inclinación de la recta, $\\frac{\\Delta y}{\\Delta x}$).
  * Si $m > 0 \\implies$ Recta creciente.
  * Si $m < 0 \\implies$ Recta decreciente.
  * Si $m = 0 \\implies$ Recta horizontal (constante).
- $n$: **Coeficiente de Posición** (punto de corte con el eje Y en $(0, n)$).`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa10-g1',
                  title: 'Ejercicio Guiado: Tarifa de Taxi como Función Afín',
                  difficulty: 'Básico',
                  statement: 'Un servicio de transporte cobra un cargo fijo de bajada de bandera de $\\$400$ más $\\$250$ por cada kilómetro recorrido. Modela la función $f(x)$ y calcula el costo de un viaje de $8\\text{ km}$.',
                  steps: [
                    {
                      title: 'Paso 1: Identificar pendiente y coeficiente de posición',
                      description: 'Cargo fijo $n = 400$, costo variable por km $m = 250$.',
                      mathExpression: 'f(x) = 250x + 400'
                    },
                    {
                      title: 'Paso 2: Evaluar la función en x = 8',
                      description: 'Reemplazamos $x = 8$ en la función.',
                      mathExpression: 'f(8) = 250(8) + 400 = 2000 + 400 = 2400'
                    }
                  ],
                  finalAnswer: 'Costo total: $2.400'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa10-prop1',
                  title: 'Guía Práctica: Gráfica de Rectas en el Plano',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Construye la tabla de valores y grafica cada función afín.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Dada $f(x) = -2x + 6$, calcula los cortes con los ejes X e Y.',
                      solution: 'Corte con eje Y: $(0, 6)$. Corte con eje X: $0 = -2x + 6 \\implies x = 3$, punto $(3, 0)$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['algebra'].oas[1]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Geometría',
          shortTitle: 'Geometría',
          icon: '📏',
          description: 'Teorema de Pitágoras, área y volumen de prismas rectos y cilindros, transformaciones isométricas y teselaciones.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 11',
              title: 'Teorema de Pitágoras y Aplicaciones Cotidianas (Ítems 1 a 6)',
              description: 'Explicar el Teorema de Pitágoras geométrica y algebraicamente ($a^2 + b^2 = c^2$), identificar tríos pitagóricos y resolver problemas cotidianos con escaleras, cables tensores y diagonales.',
              materials: [
                {
                  id: '8b-u3-mat1',
                  title: 'Ficha Técnica: Teorema de Pitágoras y Tríos Pitagóricos',
                  type: 'formula_sheet',
                  tag: 'Geometría Plana',
                  readTime: '12 min',
                  summary: 'Fórmulas de hipotenusa, cateto faltante, tríos primitivos y comprobación del teorema recíproco.',
                  contentMarkdown: `### 🔺 Teorema de Pitágoras en Triángulos Rectángulos
En cualquier triángulo rectángulo de catetos $a$ y $b$, e hipotenusa $c$:
$$a^2 + b^2 = c^2$$

### 📐 Fórmulas Directas
- **Hipotenusa desconocida**: $c = \\sqrt{a^2 + b^2}$
- **Cateto faltante**: $a = \\sqrt{c^2 - b^2}$  o  $b = \\sqrt{c^2 - a^2}$

### 🎯 Tríos Pitagóricos Fundamentales y Múltiplos Limpios
- Trío $(3, 4, 5) \\implies (6, 8, 10), (9, 12, 15), (12, 16, 20), (15, 20, 25)$
- Trío $(5, 12, 13) \\implies (10, 24, 26)$
- Trío $(8, 15, 17) \\implies (16, 30, 34)$
- Trío $(7, 24, 25)$

### ⚖️ Teorema Recíproco
Si en un triángulo con lados $a, b, c$ (donde $c$ es el lado mayor) se cumple $a^2 + b^2 = c^2$, el triángulo es **obligatoriamente rectángulo**.`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-u3-g1',
                  title: 'Ejercicio Guiado 1: Longitud de la Hipotenusa (Ítem 1)',
                  difficulty: 'Básico',
                  statement: 'Un triángulo rectángulo tiene catetos de $6\\text{ cm}$ y $8\\text{ cm}$. ¿Cuál es la longitud exacta de su hipotenusa?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar los datos y la fórmula',
                      description: 'Los catetos son $a = 6\\text{ cm}$ y $b = 8\\text{ cm}$. La hipotenusa $c$ se calcula con $c = \\sqrt{a^2 + b^2}$.',
                      mathExpression: 'c = \\sqrt{6^2 + 8^2}'
                    },
                    {
                      title: 'Paso 2: Elevar al cuadrado y sumar',
                      description: '$6^2 = 36$ y $8^2 = 64$. Su suma es $36 + 64 = 100$.',
                      mathExpression: 'c = \\sqrt{36 + 64} = \\sqrt{100}'
                    },
                    {
                      title: 'Paso 3: Extraer la raíz cuadrada exacta',
                      description: 'La raíz cuadrada positiva de 100 es 10.',
                      mathExpression: 'c = 10\\text{ cm}'
                    }
                  ],
                  finalAnswer: 'La hipotenusa mide exactamente 10 cm'
                },
                {
                  id: '8b-u3-g2',
                  title: 'Ejercicio Guiado 2: Cateto Faltante en Escalera Apoyada (Ítems 2 y 3)',
                  difficulty: 'Intermedio',
                  statement: 'Una escalera de $13\\text{ metros}$ de largo se apoya contra una pared vertical. Si la base de la escalera está a $5\\text{ metros}$ de la pared, ¿a qué altura de la pared llega la escalera?',
                  steps: [
                    {
                      title: 'Paso 1: Modelar geométricamente el problema',
                      description: 'La escalera actúa como hipotenusa ($L = 13\\text{ m}$) y la distancia basal como cateto horizontal ($d = 5\\text{ m}$). La altura vertical de la pared es el cateto $h$.',
                      mathExpression: 'h^2 + 5^2 = 13^2'
                    },
                    {
                      title: 'Paso 2: Despejar el cateto altura',
                      description: '$h^2 = 13^2 - 5^2 = 169 - 25 = 144$.',
                      mathExpression: 'h = \\sqrt{144}'
                    },
                    {
                      title: 'Paso 3: Calcular la raíz cuadrada',
                      description: '$\\sqrt{144} = 12\\text{ metros}$.',
                      mathExpression: 'h = 12\\text{ m}'
                    }
                  ],
                  finalAnswer: 'La escalera alcanza una altura de 12 metros'
                },
                {
                  id: '8b-u3-g3',
                  title: 'Ejercicio Guiado 3: Aplicación Técnica - Cable Tensor de Poste (Ítems 4 y 6)',
                  difficulty: 'Intermedio',
                  statement: 'Un poste vertical de $12\\text{ m}$ de altura se sujeta con un cable tirante desde su extremo superior hasta un punto en el suelo a $9\\text{ m}$ de su base. ¿Cuál es la longitud del cable?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar el triángulo rectángulo',
                      description: 'El poste vertical y el piso forman un ángulo recto de $90^\\circ$. Los catetos son $h = 12\\text{ m}$ y $d = 9\\text{ m}$. El cable es la hipotenusa $L$.',
                      mathExpression: 'L = \\sqrt{12^2 + 9^2}'
                    },
                    {
                      title: 'Paso 2: Calcular las potencias y sumarlas',
                      description: '$12^2 = 144$ y $9^2 = 81$. Suma: $144 + 81 = 225$.',
                      mathExpression: 'L = \\sqrt{225}'
                    },
                    {
                      title: 'Paso 3: Obtener la longitud',
                      description: '$\\sqrt{225} = 15\\text{ metros}$.',
                      mathExpression: 'L = 15\\text{ m}'
                    }
                  ],
                  finalAnswer: 'El cable tirante mide 15 metros de largo'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-u3-prop1',
                  title: 'Guía de Ejercitación N° 1: Pitágoras, Catetos e Hipotenusas (Variantes Don Bosco)',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Resuelve cada ejercicio aplicando la fórmula correspondiente y verifica si las ternas forman tríos pitagóricos exactos.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Un triángulo rectángulo tiene catetos de $9\\text{ cm}$ y $12\\text{ cm}$ (Forma B). ¿Cuál es la longitud de su hipotenusa?',
                      solution: '$c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$',
                      points: 4
                    },
                    {
                      number: 2,
                      statement: 'Un triángulo rectángulo tiene una hipotenusa de $25\\text{ cm}$ y uno de sus catetos mide $7\\text{ cm}$ (Forma B). ¿Cuánto mide el otro cateto?',
                      solution: '$b = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24\\text{ cm}$',
                      points: 4
                    },
                    {
                      number: 3,
                      statement: '¿Cuál de los siguientes grupos de medidas corresponde a los lados de un triángulo rectángulo? A) 6, 7, 8  B) 8, 15, 17  C) 10, 12, 14  D) 5, 6, 9',
                      solution: 'Verificamos $8^2 + 15^2 = 64 + 225 = 289 = 17^2$. Corresponde al grupo B (8 cm, 15 cm, 17 cm).',
                      points: 4
                    },
                    {
                      number: 4,
                      statement: 'Un terreno rectangular mide $15\\text{ metros}$ de largo y $8\\text{ metros}$ de ancho (Forma A). ¿Cuánto mide la diagonal de dicho terreno?',
                      solution: '$D = \\sqrt{15^2 + 8^2} = \\sqrt{225 + 64} = \\sqrt{289} = 17\\text{ metros}$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: DON_BOSCO_8BASICO_FORMA_A.slice(0, 6)
            },
            {
              oaId: 'OA 13',
              title: 'Plano Cartesiano, Distancias y Geometría Analítica (Ítems 7 a 12)',
              description: 'Calcular distancias entre puntos en el plano cartesiano $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$, distancia al origen $O(0,0)$, y determinar perímetros y áreas de polígonos representados en el plano.',
              materials: [
                {
                  id: '8b-u3-mat2',
                  title: 'Ficha Técnica: Distancia Euclidiana y Polígonos en el Plano',
                  type: 'formula_sheet',
                  tag: 'Geometría Analítica',
                  readTime: '10 min',
                  summary: 'Fórmulas de distancia entre puntos, regla de los signos en coordenadas negativas y cálculo de áreas.',
                  contentMarkdown: `### 📍 Distancia entre dos puntos $P(x_1, y_1)$ y $Q(x_2, y_2)$
Por el Teorema de Pitágoras aplicado en el plano:
$$d(P, Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
Donde $\\Delta x = x_2 - x_1$ y $\\Delta y = y_2 - y_1$.

### 🎯 Distancia desde el Origen $O(0,0)$ a $B(x, y)$
$$d = \\sqrt{x^2 + y^2}$$

### 🔺 Área y Perímetro de Triángulo Rectángulo en el Plano
- **Base**: $b = |x_2 - x_1|$  (si el segmento es horizontal)
- **Altura**: $h = |y_2 - y_1|$  (si el segmento es vertical)
- **Área**: $\\text{Área} = \\frac{b \\cdot h}{2}$
- **Perímetro**: $P = b + h + d_{\\text{hipotenusa}}$`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-u3-g4',
                  title: 'Ejercicio Guiado 1: Distancia entre dos puntos (Ítem 7)',
                  difficulty: 'Básico',
                  statement: 'En el plano cartesiano, calcula la distancia exacta entre los puntos $A(1, 2)$ y $B(4, 6)$.',
                  steps: [
                    {
                      title: 'Paso 1: Calcular las diferencias de coordenadas',
                      description: '$\\Delta x = 4 - 1 = 3$ y $\\Delta y = 6 - 2 = 4$.',
                      mathExpression: '\\Delta x = 3, \\quad \\Delta y = 4'
                    },
                    {
                      title: 'Paso 2: Aplicar la fórmula de distancia euclidiana',
                      description: '$d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25}$.',
                      mathExpression: 'd = \\sqrt{25}'
                    },
                    {
                      title: 'Paso 3: Obtener el resultado',
                      description: '$\\sqrt{25} = 5\\text{ unidades}$.',
                      mathExpression: 'd = 5\\text{ u}'
                    }
                  ],
                  finalAnswer: 'La distancia entre A y B es 5 unidades'
                },
                {
                  id: '8b-u3-g5',
                  title: 'Ejercicio Guiado 2: Distancia con Coordenadas Negativas (Ítem 8)',
                  difficulty: 'Intermedio',
                  statement: 'Un punto $P$ se ubica en $(-2, 3)$ y un punto $Q$ en $(4, 11)$. ¿Cuál es la distancia entre $P$ y $Q$?',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar la resta con cuidado de signos',
                      description: '$\\Delta x = 4 - (-2) = 4 + 2 = 6$. Y $\\Delta y = 11 - 3 = 8$.',
                      mathExpression: '\\Delta x = 6, \\quad \\Delta y = 8'
                    },
                    {
                      title: 'Paso 2: Elevar al cuadrado y sumar',
                      description: '$6^2 + 8^2 = 36 + 64 = 100$.',
                      mathExpression: 'd = \\sqrt{100}'
                    },
                    {
                      title: 'Paso 3: Extraer la raíz',
                      description: '$\\sqrt{100} = 10\\text{ unidades}$.',
                      mathExpression: 'd = 10\\text{ u}'
                    }
                  ],
                  finalAnswer: 'La distancia entre P y Q es 10 unidades'
                },
                {
                  id: '8b-u3-g6',
                  title: 'Ejercicio Guiado 3: Perímetro y Área de Triángulo en el Plano (Ítems 9 y 11)',
                  difficulty: 'Avanzado',
                  statement: 'Un triángulo tiene vértices en $K(0, 0)$, $L(6, 0)$ y $M(0, 8)$. Calcula su perímetro y su área.',
                  steps: [
                    {
                      title: 'Paso 1: Medir la base y la altura en los ejes',
                      description: 'Base $KL = 6\\text{ u}$ (sobre el eje X) y altura $KM = 8\\text{ u}$ (sobre el eje Y).',
                      mathExpression: 'b = 6\\text{ u}, \\quad h = 8\\text{ u}'
                    },
                    {
                      title: 'Paso 2: Calcular la hipotenusa LM',
                      description: 'Por Pitágoras: $LM = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10\\text{ u}$.',
                      mathExpression: 'c = 10\\text{ u}'
                    },
                    {
                      title: 'Paso 3: Perímetro y Área',
                      description: 'Perímetro: $P = 6 + 8 + 10 = 24\\text{ u}$. Área: $A = \\frac{6 \\cdot 8}{2} = \\frac{48}{2} = 24\\text{ u}^2$.',
                      mathExpression: 'P = 24\\text{ u}, \\quad A = 24\\text{ u}^2'
                    }
                  ],
                  finalAnswer: 'El perímetro es 24 u y el área es 24 u²'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-u3-prop2',
                  title: 'Guía de Ejercitación N° 2: Geometría Analítica en el Plano Cartesiano',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Traza los puntos en un plano cartesiano auxiliar y aplica la fórmula de distancia euclidiana.',
                  problems: [
                    {
                      number: 1,
                      statement: 'En el plano cartesiano, ¿cuál es la distancia entre los puntos $A(2, 3)$ y $B(8, 11)$? (Forma B)',
                      solution: '$\\Delta x = 8 - 2 = 6$, $\\Delta y = 11 - 3 = 8$. $d = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10\\text{ u}$.',
                      points: 4
                    },
                    {
                      number: 2,
                      statement: 'Calcula la distancia entre los puntos $R(-3, -1)$ y $S(5, 5)$ representados en el plano cartesiano. (Forma A)',
                      solution: '$\\Delta x = 5 - (-3) = 8$, $\\Delta y = 5 - (-1) = 6$. $d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ u}$.',
                      points: 4
                    },
                    {
                      number: 3,
                      statement: 'Los vértices de un triángulo rectángulo son $A(1, 2)$, $B(11, 2)$ y $C(1, 8)$ (Forma B). ¿Cuál es el área de este triángulo?',
                      solution: 'Base $= 11 - 1 = 10\\text{ u}$, Altura $= 8 - 2 = 6\\text{ u}$. Área $= \\frac{10 \\cdot 6}{2} = 30\\text{ u}^2$.',
                      points: 4
                    },
                    {
                      number: 4,
                      statement: '¿Cuál es la distancia exacta desde el origen $O(0, 0)$ al punto $B(9, 12)$? (Forma D)',
                      solution: '$d = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ u}$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: DON_BOSCO_8BASICO_FORMA_A.slice(6, 12)
            },
            {
              oaId: 'OA 12',
              title: 'Cuerpos Geométricos: Cubo, Prisma Rectangular y Capacidad (Ítems 13 a 20)',
              description: 'Calcular el área de la superficie y el volumen de cubos y prismas rectangulares (paralelepípedos), despejar aristas y alturas desconocidas, y modelar la capacidad de estanques de fluidos en litros ($1\\text{ m}^3 = 1.000\\text{ L}$).',
              materials: [
                {
                  id: '8b-u3-mat3',
                  title: 'Ficha Técnica: Geometría Espacial 3D y Capacidad de Almacenamiento',
                  type: 'formula_sheet',
                  tag: 'Cuerpos del Espacio',
                  readTime: '12 min',
                  summary: 'Fórmulas de volumen y área total para cubos, paralelepípedos y equivalencias de volumen a litros.',
                  contentMarkdown: `### 📦 Cubo (Hexaedro Regular)
- **Volumen**: $V = a^3$
- **Área Total de la Superficie**: $A = 6 \\cdot a^2$ (6 caras cuadradas idénticas)
- **Arista desde el Volumen**: $a = \\sqrt[3]{V}$

### 🏢 Prisma Rectangular (Paralelepípedo)
Con largo $l$, ancho $a$, altura $h$:
- **Volumen**: $V = l \\cdot a \\cdot h$
- **Área Superficial Total**: $A = 2(l \\cdot a + l \\cdot h + a \\cdot h)$
- **Altura Desconocida**: $h = \\frac{V}{l \\cdot a}$

### 💧 Conversión Clave de Capacidad
$$1\\text{ m}^3 = 1.000\\text{ litros}$$
Para calcular los litros de un estanque rectangular de dimensiones en metros:
$$\\text{Capacidad (L)} = (l \\cdot a \\cdot h) \\cdot 1.000$$`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-u3-g7',
                  title: 'Ejercicio Guiado 1: Volumen y Área de un Cubo (Ítems 13 y 14)',
                  difficulty: 'Básico',
                  statement: 'Calcula el volumen y el área total de la superficie de un cubo cuya arista mide $5\\text{ cm}$.',
                  steps: [
                    {
                      title: 'Paso 1: Volumen del cubo',
                      description: 'Elevamos la arista al cubo: $V = a^3 = 5^3 = 5 \\cdot 5 \\cdot 5 = 125\\text{ cm}^3$.',
                      mathExpression: 'V = 125\\text{ cm}^3'
                    },
                    {
                      title: 'Paso 2: Área de una cara',
                      description: 'El área de una cara cuadrada es $a^2 = 5^2 = 25\\text{ cm}^2$.',
                      mathExpression: 'A_{\\text{cara}} = 25\\text{ cm}^2'
                    },
                    {
                      title: 'Paso 3: Área total de las 6 caras',
                      description: '$A_{\\text{total}} = 6 \\cdot a^2 = 6 \\cdot 25 = 150\\text{ cm}^2$.',
                      mathExpression: 'A_{\\text{total}} = 150\\text{ cm}^2'
                    }
                  ],
                  finalAnswer: 'El volumen es 125 cm³ y el área total es 150 cm²'
                },
                {
                  id: '8b-u3-g8',
                  title: 'Ejercicio Guiado 2: Arista de un Depósito Cúbico desde el Volumen (Ítem 15)',
                  difficulty: 'Intermedio',
                  statement: 'El volumen de un depósito cúbico es de $216\\text{ cm}^3$. ¿Cuánto mide cada una de sus aristas?',
                  steps: [
                    {
                      title: 'Paso 1: Plantear la ecuación',
                      description: 'Sabemos que $V = a^3 = 216$. Debemos encontrar el número cuyo cubo sea 216.',
                      mathExpression: 'a = \\sqrt[3]{216}'
                    },
                    {
                      title: 'Paso 2: Probar factores enteros',
                      description: '$4^3 = 64$, $5^3 = 125$, $6^3 = 6 \\cdot 6 \\cdot 6 = 36 \\cdot 6 = 216$.',
                      mathExpression: 'a = 6\\text{ cm}'
                    }
                  ],
                  finalAnswer: 'Cada arista del depósito mide 6 cm'
                },
                {
                  id: '8b-u3-g9',
                  title: 'Ejercicio Guiado 3: Área Total y Altura Desconocida de Prisma (Ítems 18 y 19)',
                  difficulty: 'Intermedio',
                  statement: 'Una caja rectangular tiene un volumen de $180\\text{ cm}^3$. Si su base mide $6\\text{ cm}$ de largo y $5\\text{ cm}$ de ancho, ¿cuál es la altura de la caja?',
                  steps: [
                    {
                      title: 'Paso 1: Área de la base',
                      description: 'El área basal es $A_b = \\text{largo} \\cdot \\text{ancho} = 6 \\cdot 5 = 30\\text{ cm}^2$.',
                      mathExpression: 'A_b = 30\\text{ cm}^2'
                    },
                    {
                      title: 'Paso 2: Despejar la altura',
                      description: '$V = A_b \\cdot h \\implies 180 = 30 \\cdot h \\implies h = \\frac{180}{30} = 6\\text{ cm}$.',
                      mathExpression: 'h = \\frac{180}{30} = 6\\text{ cm}'
                    }
                  ],
                  finalAnswer: 'La altura de la caja rectangular es 6 cm'
                },
                {
                  id: '8b-u3-g10',
                  title: 'Ejercicio Guiado 4: Aplicación Industrial - Capacidad en Litros de un Estanque (Ítem 20)',
                  difficulty: 'Avanzado',
                  statement: 'Un estanque rectangular mide $2\\text{ m}$ de largo, $1,5\\text{ m}$ de ancho y $1\\text{ m}$ de profundidad. Si $1\\text{ m}^3 = 1.000\\text{ litros}$, ¿cuántos litros de agua puede contener?',
                  steps: [
                    {
                      title: 'Paso 1: Calcular el volumen en metros cúbicos',
                      description: '$V = 2 \\cdot 1,5 \\cdot 1 = 3\\text{ m}^3$.',
                      mathExpression: 'V = 3\\text{ m}^3'
                    },
                    {
                      title: 'Paso 2: Multiplicar por el factor de conversión a litros',
                      description: '$\\text{Capacidad} = 3\\text{ m}^3 \\cdot 1.000\\frac{\\text{litros}}{\\text{m}^3} = 3.000\\text{ litros}$.',
                      mathExpression: '\\text{Capacidad} = 3.000\\text{ litros}'
                    }
                  ],
                  finalAnswer: 'El estanque puede contener 3.000 litros de agua al 100% de su capacidad'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-u3-prop3',
                  title: 'Guía de Ejercitación N° 3: Cuerpos Geométricos y Capacidad de Estanques',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Calcula áreas de superficie, volúmenes y capacidades en litros utilizando las fórmulas del paralelepípedo y cubo.',
                  problems: [
                    {
                      number: 1,
                      statement: '¿Cuál es el volumen de un cubo cuya arista mide $6\\text{ cm}$? (Forma B)',
                      solution: '$V = a^3 = 6^3 = 216\\text{ cm}^3$.',
                      points: 4
                    },
                    {
                      number: 2,
                      statement: 'Se desea forrar con papel de regalo una caja cúbica de $10\\text{ cm}$ de arista (Forma A). ¿Cuántos $\\text{cm}^2$ de papel se necesitan como mínimo?',
                      solution: '$A = 6 \\cdot a^2 = 6 \\cdot 10^2 = 6 \\cdot 100 = 600\\text{ cm}^2$.',
                      points: 4
                    },
                    {
                      number: 3,
                      statement: 'Calcula el área total de la superficie de una caja rectangular de dimensiones $4\\text{ cm}$ de largo, $3\\text{ cm}$ de ancho y $5\\text{ cm}$ de alto (Forma A).',
                      solution: '$A = 2(4 \\cdot 3 + 4 \\cdot 5 + 3 \\cdot 5) = 2(12 + 20 + 15) = 2(47) = 94\\text{ cm}^2$.',
                      points: 4
                    },
                    {
                      number: 4,
                      statement: 'Un estanque rectangular de agua mide $3\\text{ m}$ de largo, $2\\text{ m}$ de ancho y $1,5\\text{ m}$ de profundidad (Forma B). ¿Cuántos litros de agua puede contener al 100% de su capacidad?',
                      solution: '$V = 3 \\cdot 2 \\cdot 1,5 = 9\\text{ m}^3$. Capacidad $= 9 \\cdot 1.000 = 9.000\\text{ litros}$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: DON_BOSCO_8BASICO_FORMA_A.slice(12, 20)
            },
            {
              oaId: 'OA 13 • OA 14',
              title: 'Sección Especial: Clase Desafiante - Transformaciones Isométricas (OA 13 • OA 14)',
              description: 'Evaluación y estudio profundo de Transformaciones Isométricas en el plano cartesiano: Traslaciones vectoriales, Reflexiones (simetría axial y central), Rotaciones canónicas (90°, 180°, 270°) y Composición sucesiva de movimientos.',
              materials: [
                {
                  id: '8b-u3-mat-desafiante',
                  title: 'Manual Maestro: Isometrías en el Plano Cartesiano (Pauta Oficial)',
                  type: 'formula_sheet',
                  tag: 'Transformaciones Isométricas',
                  readTime: '15 min',
                  summary: 'Reglas algebraicas y propiedades geométricas para traslación, reflexión respecto a ejes X e Y, simetría central y rotación antihoraria en torno al origen.',
                  contentMarkdown: `### 🚀 1. Traslación Vectorial
Un vector $\\vec{v}(x, y)$ desplaza horizontalmente en $x$ (+ derecha, - izquierda) y verticalmente en $y$ (+ arriba, - abajo):
$$T_{\\vec{v}}(P(x_0, y_0)) = P'(x_0 + x_v, y_0 + y_v)$$
- **Vector entre preimagen e imagen**: $\\vec{v} = P' - P = (x' - x, y' - y)$
- **Adición de vectores**: $\\vec{u}(x_1, y_1) + \\vec{w}(x_2, y_2) = (x_1 + x_2, y_1 + y_2)$

---

### 🪞 2. Reflexiones (Simetrías)
- **Simetría Axial respecto al Eje X**: $S_x(x, y) = (x, -y)$
- **Simetría Axial respecto al Eje Y**: $S_y(x, y) = (-x, y)$
- **Simetría Central respecto al Origen $O(0, 0)$**: $S_O(x, y) = (-x, -y)$
- **Determinación del Centro $O$**: Punto medio entre cualquier punto homólogo:
  $$O = \\left(\\frac{x + x'}{2}, \\frac{y + y'}{2}\\right)$$

---

### 🔄 3. Rotación en torno al Origen (Sentido Antihorario)
| Ángulo | Regla Algebraica | Cuadrante de $P(+,+)$ |
| :--- | :--- | :--- |
| **90°** | $R_{90^\\circ}(x, y) = (-y, x)$ | II Cuadrante |
| **180°** | $R_{180^\\circ}(x, y) = (-x, -y)$ | III Cuadrante |
| **270°** | $R_{270^\\circ}(x, y) = (y, -x)$ | IV Cuadrante |
| **360°** | $R_{360^\\circ}(x, y) = (x, y)$ | I Cuadrante |

---

### 🧩 4. Composición de Transformaciones
Se aplica primero la transformación interior y luego sobre su resultado la transformación exterior:
- **$T$ seguido de Giro $G_{90^\\circ}$**: $P \\xrightarrow{T_{(a, b)}} P_1(x+a, y+b) \\xrightarrow{G_{90^\\circ}} P'(-(y+b), x+a)$
- **$T$ seguido de Simetría $S_x$**: $P \\xrightarrow{T_{(a, b)}} P_1(x+a, y+b) \\xrightarrow{S_x} P'(x+a, -(y+b))$`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-u3-gd1',
                  title: 'Ejercicio Guiado 1: Traslación Vectorial de Polígono (Ítem 1 y 4)',
                  difficulty: 'Básico',
                  statement: 'Al triángulo de vértices $A(3, 2)$, $B(5, 6)$ y $C(7, 1)$ se le aplica una traslación con vector $\\vec{v}(-2, -3)$. Determina sus coordenadas finales.',
                  steps: [
                    {
                      title: 'Paso 1: Sumar algebraicamente a cada vértice',
                      description: 'A cada par $(x, y)$ sumamos $(-2, -3)$.',
                      mathExpression: 'P\'(x - 2, y - 3)'
                    },
                    {
                      title: 'Paso 2: Calcular vértices',
                      description: '$A\'(3-2, 2-3) = (1, -1)$; $B\'(5-2, 6-3) = (3, 3)$; $C\'(7-2, 1-3) = (5, -2)$.',
                      mathExpression: 'A\'(1, -1), \\quad B\'(3, 3), \\quad C\'(5, -2)'
                    }
                  ],
                  finalAnswer: 'El triángulo trasladado queda en A\'(1, -1), B\'(3, 3) y C\'(5, -2)'
                },
                {
                  id: '8b-u3-gd2',
                  title: 'Ejercicio Guiado 2: Reflexión Axial y Central (Ítems 5 a 7)',
                  difficulty: 'Intermedio',
                  statement: 'Refleja el triángulo $A(2, -1)$, $B(4, 5)$ y $C(1, 6)$ respecto al eje X y luego determina su simétrico central respecto al origen.',
                  steps: [
                    {
                      title: 'Paso 1: Simetría axial respecto a X',
                      description: 'Se invierte el signo de $y$: $A\'(2, 1)$, $B\'(4, -5)$, $C\'(1, -6)$.',
                      mathExpression: '(x, y) \\to (x, -y)'
                    },
                    {
                      title: 'Paso 2: Simetría central respecto al origen',
                      description: 'Se invierte el signo de ambas coordenadas: $A\'\'(-2, 1)$, $B\'\'(-4, -5)$, $C\'\'(-1, -6)$.',
                      mathExpression: '(x, y) \\to (-x, -y)'
                    }
                  ],
                  finalAnswer: 'Simétrico axial en X: A\'(2, 1), B\'(4, -5), C\'(1, -6)'
                },
                {
                  id: '8b-u3-gd3',
                  title: 'Ejercicio Guiado 3: Rotación de 90° y Composición Sucesiva (Ítems 8 a 10)',
                  difficulty: 'Avanzado',
                  statement: 'Al punto $A(0, -3)$ se le aplica una traslación $\\vec{t}(2, 3)$ seguida de un giro de $90^\\circ$ antihorario en el origen. ¿Cuál es su posición final?',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar traslación t(2, 3)',
                      description: '$A_1 = (0 + 2, -3 + 3) = (2, 0)$.',
                      mathExpression: 'A_1 = (2, 0)'
                    },
                    {
                      title: 'Paso 2: Aplicar giro de 90° antihorario en el origen',
                      description: 'La regla es $(x, y) \\to (-y, x)$. Para $(2, 0)$, $-y = -0 = 0$ y nuevo $y = x = 2$.',
                      mathExpression: 'A\' = (0, 2)'
                    }
                  ],
                  finalAnswer: 'La posición final del punto transformado es (0, 2)'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-u3-prop-desafiante',
                  title: 'Guía de Trabajo N° 6: Clase Desafiante (Transformaciones Isométricas)',
                  estimatedTime: '60 minutos',
                  studentInstructions: 'Resuelve los ejercicios de traslación, reflexión y rotación aplicando las propiedades analíticas en el plano cartesiano.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el vector de traslación si $T_{\\vec{v}}(5, 8) = (-2, 3)$ y $T_{\\vec{v}}(0, 2) = (2, 6)$.',
                      solution: 'Caso 1: $\\vec{v} = (-2-5, 3-8) = (-7, -5)$. Caso 2: $\\vec{v} = (2-0, 6-2) = (2, 4)$.',
                      points: 6
                    },
                    {
                      number: 2,
                      statement: 'Un punto $B(8, 2)$ gira $270^\\circ$ en sentido antihorario en torno al origen. ¿Cuáles son sus nuevas coordenadas?',
                      solution: '$R_{270^\\circ}(x, y) = (y, -x) \\implies B\'\'\'(2, -8)$.',
                      points: 4
                    },
                    {
                      number: 3,
                      statement: 'Aplica al cuadrilátero con vértices $(-1, -3), (-1, -5), (2, -5), (2, -4)$ una traslación $\\vec{t}(5, 2)$ seguida de una reflexión en el eje X.',
                      solution: 'Traslación: $(4, -1), (4, -3), (7, -3), (7, -2)$. Reflexión en eje X: $(4, 1), (4, 3), (7, 3), (7, 2)$.',
                      points: 6
                    }
                  ]
                }
              ],
              questions: CLASE_DESAFIANTE_8BASICO_FORMA_A
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Probabilidad y Estadística',
          shortTitle: 'Probabilidad y Estadística',
          icon: '📊',
          description: 'Medidas de posición (cuartiles, percentiles), diagramas de cajón, medidas de dispersión y principio multiplicativo de probabilidad.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 15',
              title: 'Medidas de Posición (Cuartiles y Diagrama de Cajón)',
              description: 'Mostrar que comprenden las medidas de posición, percentiles y cuartiles: identificando el percentil en diagramas de cajón.',
              materials: [
                {
                  id: '8b-oa15-mat1',
                  title: 'Presentación: Diagrama de Caja y Bigotes (Boxplot)',
                  type: 'presentation',
                  tag: 'Análisis Estadístico',
                  readTime: '15 min',
                  summary: 'Los 5 números resumen: Mínimo, $Q_1$, Mediana ($Q_2$), $Q_3$ y Máximo. Interpretación de simetría y dispersión.',
                  contentMarkdown: `### 📦 Los 5 Puntos Clave del Diagrama de Cajón
1. **Mínimo:** Dato menor no atípico.
2. **$Q_1$ (Cuartil 1):** El $25\\%$ de los datos es menor o igual a este valor.
3. **$Q_2$ (Mediana):** El $50\\%$ de los datos es menor o igual a este valor.
4. **$Q_3$ (Cuartil 3):** El $75\\%$ de los datos es menor o igual a este valor.
5. **Máximo:** Dato mayor no atípico.

- **Rango Intercuartílico (RIC):** $\\text{RIC} = Q_3 - Q_1$ (representa el ancho de la caja central).`
                }
              ],
              guidedExercises: [
                {
                  id: '8b-oa15-g1',
                  title: 'Ejercicio Guiado: Cálculo de Cuartiles en Notas de Prueba',
                  difficulty: 'Intermedio',
                  statement: 'Se registran las notas de 9 estudiantes: $3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.2, 6.8, 7.0$. Determina los cuartiles $Q_1, Q_2, Q_3$.',
                  steps: [
                    {
                      title: 'Paso 1: Mediana (Q2)',
                      description: 'Como son 9 datos ordenados, la posición central es el dato 5 ($Q_2 = 5.5$).',
                      mathExpression: 'Q_2 = 5.5'
                    },
                    {
                      title: 'Paso 2: Cuartil 1 (Q1)',
                      description: 'Mediana de la mitad inferior $(3.5, 4.0, 4.5, 5.0)$: promedio entre 4.0 y 4.5 $\\rightarrow Q_1 = 4.25$.',
                      mathExpression: 'Q_1 = 4.25'
                    },
                    {
                      title: 'Paso 3: Cuartil 3 (Q3)',
                      description: 'Mediana de la mitad superior $(6.0, 6.2, 6.8, 7.0)$: promedio entre 6.2 y 6.8 $\\rightarrow Q_3 = 6.5$.',
                      mathExpression: 'Q_3 = 6.5'
                    }
                  ],
                  finalAnswer: 'Q1 = 4.25, Q2 = 5.5, Q3 = 6.5'
                }
              ],
              proposedWorksheets: [
                {
                  id: '8b-oa15-prop1',
                  title: 'Guía de Interpretación de Boxplots Comparativos',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Compara las dos distribuciones de datos y argumenta tus conclusiones.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si el $Q_3$ de un curso es $6.2$ y el de otro curso es $5.4$, ¿cuál curso tuvo mejor rendimiento superior?',
                      solution: 'El primer curso, ya que el 25% con mejores calificaciones obtuvo notas entre 6.2 y 7.0.',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['8_basico'].ejes['probabilidad'].oas[0]?.questions || []
            }
          ]
        }
      ]
    },

    '1_medio': {
      id: '1_medio',
      name: '1° Medio',
      category: 'Formación General',
      badgeNumber: '1',
      colorBadge: 'bg-emerald-600 text-white',
      description: 'Operatoria avanzada en Q, potencias racionales, productos notables, sistemas 2x2, homotecia (OA 08), vectores 2D, trigonometría básica y probabilidad compuesta.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Números',
          shortTitle: 'Números',
          icon: '🔢',
          description: 'Números racionales, orden y densidad en la recta numérica, potencias de base racional y propiedades de los exponentes.',
          colorTheme: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            badge: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-600 to-indigo-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Operaciones y Orden en Racionales',
              description: 'Calcular operaciones con números racionales en forma simbólica, conceptualizando el inverso multiplicativo y propiedades de clausura.',
              materials: [
                {
                  id: '1m-oa01-mat1',
                  title: 'Presentación: Densidad y Operatoria Avanzada en Q',
                  type: 'presentation',
                  tag: 'Álgebra y Números',
                  readTime: '15 min',
                  summary: 'Entre dos racionales siempre existe otro número racional. Inverso aditivo y multiplicativo.',
                  contentMarkdown: `### 🎯 Propiedad de Densidad en $\\mathbb{Q}$
Dados dos racionales $r_1 < r_2$, su promedio $\\frac{r_1 + r_2}{2}$ es siempre un nuevo racional estrictamente comprendido entre ellos.

### Inverso Multiplicativo (Recíproco)
Para toda fracción $\\frac{a}{b} \\neq 0$, su inverso multiplicativo es $\\left(\\frac{a}{b}\\right)^{-1} = \\frac{b}{a}$, cumpliendo:
$$\\frac{a}{b} \\cdot \\frac{b}{a} = 1$$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa01-g1',
                  title: 'Ejercicio Guiado: Fracción Compleja / Fracción de Fracciones',
                  difficulty: 'Intermedio',
                  statement: 'Simplifica a una sola fracción irreducible: $\\frac{\\frac{2}{3} - \\frac{1}{4}}{\\frac{5}{6} + \\frac{1}{2}}$',
                  steps: [
                    {
                      title: 'Paso 1: Resolver el numerador',
                      description: '$\\frac{2}{3} - \\frac{1}{4} = \\frac{8 - 3}{12} = \\frac{5}{12}$.',
                      mathExpression: '\\text{Numerador} = \\frac{5}{12}'
                    },
                    {
                      title: 'Paso 2: Resolver el denominador',
                      description: '$\\frac{5}{6} + \\frac{3}{6} = \\frac{8}{6} = \\frac{4}{3}$.',
                      mathExpression: '\\text{Denominador} = \\frac{4}{3}'
                    },
                    {
                      title: 'Paso 3: Multiplicar por el recíproco',
                      description: '$\\frac{5}{12} \\div \\frac{4}{3} = \\frac{5}{12} \\cdot \\frac{3}{4} = \\frac{15}{48} = \\frac{5}{16}$.',
                      mathExpression: '\\frac{5}{16}'
                    }
                  ],
                  finalAnswer: '\\frac{5}{16}'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa01-prop1',
                  title: 'Guía de Fracciones Complejas y Problemas de Reparto',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Desarrolla paso a paso simplificando antes de operar.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el recíproco de $-\\frac{7}{12}$ multiplicado por $\\frac{14}{3}$.',
                      solution: '$-\\frac{12}{7} \\cdot \\frac{14}{3} = -4 \\cdot 2 = -8$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['numeros'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 02',
              title: 'Potencias de Base Racional y Exponente Entero',
              description: 'Mostrar que comprenden las potencias de base racional y exponente entero: transfiriendo propiedades y resolviendo problemas de crecimiento exponencial.',
              materials: [
                {
                  id: '1m-oa02-mat1',
                  title: 'Presentación: Propiedades de Potencias con Exponente Negativo',
                  type: 'presentation',
                  tag: 'Exponentes en Q',
                  readTime: '15 min',
                  summary: 'Regla del exponente negativo $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$ y potencia de una potencia.',
                  contentMarkdown: `### ⚡ Potencias de Base Racional
Para toda fracción $\\frac{a}{b}$ con $a, b \\neq 0$ y $n \\in \\mathbb{Z}^+$:
$$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n = \\frac{b^n}{a^n}$$

### Multiplicación y División de Racionales con Potencias
- Igual base: $\\left(\\frac{a}{b}\\right)^n \\cdot \\left(\\frac{a}{b}\\right)^m = \\left(\\frac{a}{b}\\right)^{n+m}$
- Igual exponente: $\\left(\\frac{a}{b}\\right)^n \\cdot \\left(\\frac{c}{d}\\right)^n = \\left(\\frac{a \\cdot c}{b \\cdot d}\\right)^n$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa02-g1',
                  title: 'Ejercicio Guiado: Simplificación con Exponentes Negativos',
                  difficulty: 'Intermedio',
                  statement: 'Calcula el valor numérico de $\\frac{\\left(\\frac{2}{3}\\right)^{-2} \\cdot \\left(\\frac{3}{4}\\right)^2}{\\left(\\frac{1}{2}\\right)^{-1}}$',
                  steps: [
                    {
                      title: 'Paso 1: Invertir bases con exponentes negativos',
                      description: '$\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$ y $\\left(\\frac{1}{2}\\right)^{-1} = 2$.',
                      mathExpression: '\\frac{9}{4} \\cdot \\frac{9}{16} \\div 2'
                    },
                    {
                      title: 'Paso 2: Multiplicar numerador',
                      description: '$\\frac{9}{4} \\cdot \\frac{9}{16} = \\frac{81}{64}$.',
                      mathExpression: '\\frac{81}{64}'
                    },
                    {
                      title: 'Paso 3: Dividir por 2',
                      description: '$\\frac{81}{64} \\div 2 = \\frac{81}{128}$.',
                      mathExpression: '\\frac{81}{128}'
                    }
                  ],
                  finalAnswer: '81/128'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa02-prop1',
                  title: 'Guía de Potencias y Notación Científica en Q',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Expresa los resultados en su forma fraccionaria más simple.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $\\left(-\\frac{5}{2}\\right)^{-3}$',
                      solution: '$\\left(-\\frac{2}{5}\\right)^3 = -\\frac{8}{125}$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['numeros'].oas[1]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Álgebra y Funciones',
          shortTitle: 'Álgebra y Funciones',
          icon: '📐',
          description: 'Productos notables, factorización de trinomios, fracciones algebraicas y sistemas de ecuaciones lineales 2x2.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 03',
              title: 'Productos Notables y Factorización',
              description: 'Desarrollar los productos notables de manera concreta, pictórica y simbólica: cuadrado de binomio, suma por su diferencia y binomio con término común.',
              materials: [
                {
                  id: '1m-oa03-mat1',
                  title: 'Presentación: Los 4 Productos Notables Esenciales',
                  type: 'presentation',
                  tag: 'Álgebra Visual',
                  readTime: '15 min',
                  summary: '1. Cuadrado de Binomio, 2. Suma por Diferencia, 3. Binomios con Término Común, 4. Factorización.',
                  contentMarkdown: `### 📐 Las Fórmulas de Productos Notables
1. **Cuadrado de Binomio:**
   $$(a \\pm b)^2 = a^2 \\pm 2ab + b^2$$
2. **Suma por su Diferencia:**
   $$(a + b)(a - b) = a^2 - b^2$$
3. **Binomios con Término Común:**
   $$(x + a)(x + b) = x^2 + (a+b)x + ab$$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa03-g1',
                  title: 'Ejercicio Guiado: Factorización por Suma por Diferencia',
                  difficulty: 'Básico',
                  statement: 'Factoriza completamente la expresión: $25x^4 - 49y^2$',
                  steps: [
                    {
                      title: 'Paso 1: Extraer raíces cuadradas de cada término',
                      description: '$\\sqrt{25x^4} = 5x^2$ y $\\sqrt{49y^2} = 7y$.',
                      mathExpression: '(5x^2)^2 - (7y)^2'
                    },
                    {
                      title: 'Paso 2: Aplicar la estructura $(a-b)(a+b)$',
                      description: '$(5x^2 - 7y)(5x^2 + 7y)$.',
                      mathExpression: '(5x^2 - 7y)(5x^2 + 7y)'
                    }
                  ],
                  finalAnswer: '(5x^2 - 7y)(5x^2 + 7y)'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa03-prop1',
                  title: 'Guía de Factorización y Productos Notables',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Factoriza cada polinomio a su mínima expresión.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Desarrolla $(3x - 5)^2$.',
                      solution: '$9x^2 - 30x + 25$',
                      points: 3
                    },
                    {
                      number: 2,
                      statement: 'Factoriza el trinomio $x^2 - 7x + 12$.',
                      solution: '$(x - 3)(x - 4)$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['algebra'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 04',
              title: 'Fracciones Algebraicas',
              description: 'Resolver sistemas y operaciones de suma, resta, multiplicación y división de fracciones algebraicas simples con factorización.',
              materials: [
                {
                  id: '1m-oa04-mat1',
                  title: 'Presentación: Simplificación y Operaciones con Fracciones Algebraicas',
                  type: 'presentation',
                  tag: 'Álgebra Racional',
                  readTime: '15 min',
                  summary: 'Factorizar numerador y denominador antes de simplificar factores comunes. Restricciones del dominio ($x \\neq a$).',
                  contentMarkdown: `### 🧩 Fracciones Algebraicas
Para simplificar $\\frac{P(x)}{Q(x)}$, se factorizan ambos polinomios y se cancelan los factores idénticos:
$$\\frac{x^2 - 16}{x^2 + 7x + 12} = \\frac{(x-4)(x+4)}{(x+3)(x+4)} = \\frac{x-4}{x+3} \\quad (x \\neq -3, x \\neq -4)$$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa04-g1',
                  title: 'Ejercicio Guiado: Multiplicación de Fracciones Algebraicas',
                  difficulty: 'Intermedio',
                  statement: 'Calcula y simplifica: $\\frac{x^2 - 4}{2x + 6} \\cdot \\frac{x + 3}{x - 2}$',
                  steps: [
                    {
                      title: 'Paso 1: Factorizar cada binomio',
                      description: '$x^2 - 4 = (x-2)(x+2)$ y $2x + 6 = 2(x+3)$.',
                      mathExpression: '\\frac{(x-2)(x+2)}{2(x+3)} \\cdot \\frac{x+3}{x-2}'
                    },
                    {
                      title: 'Paso 2: Cancelar factores comunes',
                      description: 'Cancelamos $(x-2)$ y $(x+3)$ quedando $\\frac{x+2}{2}$.',
                      mathExpression: '\\frac{x+2}{2}'
                    }
                  ],
                  finalAnswer: '(x + 2) / 2'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa04-prop1',
                  title: 'Guía de Suma y Resta de Fracciones Algebraicas',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Determina el m.c.m. de los denominadores algebraicos.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula: $\\frac{3}{x} + \\frac{2}{x+1}$',
                      solution: '$\\frac{3(x+1) + 2x}{x(x+1)} = \\frac{5x + 3}{x(x+1)}$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['algebra'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 05',
              title: 'Sistemas de Ecuaciones Lineales 2x2',
              description: 'Resolver sistemas de ecuaciones lineales (2x2) relacionados a problemas de la vida diaria, utilizando métodos algebraicos y gráficos.',
              materials: [
                {
                  id: '1m-oa05-mat1',
                  title: 'Presentación: Métodos de Reducción, Igualación y Sustitución',
                  type: 'presentation',
                  tag: 'Sistemas Lineales',
                  readTime: '15 min',
                  summary: 'Comparativa de métodos de resolución y análisis de compatibilidad (solución única, infinitas o sin solución).',
                  contentMarkdown: `### 🎯 Métodos de Resolución 2x2
1. **Reducción (Eliminación):** Multiplicar ecuaciones para eliminar una variable al sumar.
2. **Sustitución:** Despejar una incógnita en una ecuación y reemplazarla en la otra.
3. **Igualación:** Despejar la misma incógnita en ambas ecuaciones e igualar.`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa05-g1',
                  title: 'Ejercicio Guiado: Problema de Compra de Entradas',
                  difficulty: 'Intermedio',
                  statement: 'En un cine, 2 entradas de adulto y 3 de niño cuestan $\\$18.000$. Además, 4 entradas de adulto y 1 de niño cuestan $\\$26.000$. ¿Cuánto cuesta cada entrada?',
                  steps: [
                    {
                      title: 'Paso 1: Plantear el sistema',
                      description: 'Sea $x$ precio adulto e $y$ precio niño: $\\begin{cases} 2x + 3y = 18000 \\\\ 4x + y = 26000 \\end{cases}$'
                    },
                    {
                      title: 'Paso 2: Aplicar método de reducción',
                      description: 'Multiplicamos la primera ecuación por $-2$: $-4x - 6y = -36000$. Sumamos con la segunda: $-5y = -10000 \\implies y = 2000$.'
                    },
                    {
                      title: 'Paso 3: Calcular x',
                      description: '$4x + 2000 = 26000 \\implies 4x = 24000 \\implies x = 6000$.'
                    }
                  ],
                  finalAnswer: 'Adulto: $6.000, Niño: $2.000'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa05-prop1',
                  title: 'Guía de Problemas Reales con Sistemas de Ecuaciones 2x2',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Define claramente las variables antes de plantear las ecuaciones.',
                  problems: [
                    {
                      number: 1,
                      statement: 'La suma de dos números es 45 y su diferencia es 15. Encuentra los números.',
                      solution: '$x+y=45$ y $x-y=15 \\implies 2x=60 \\implies x=30, y=15$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['algebra'].oas[2]?.questions || []
            },
            {
              oaId: 'OA 06',
              title: 'Función Lineal y Función Afín',
              description: 'Mostrar que comprenden la función lineal y afín: determinando la pendiente, intercepto, tabla de valores y trazado gráfico en el plano cartesiano.',
              materials: [
                {
                  id: '1m-oa06-mat1',
                  title: 'Presentación: Pendiente m y Coeficiente de Posición n',
                  type: 'presentation',
                  tag: 'Geometría Analítica',
                  readTime: '15 min',
                  summary: 'Ecuación principal $y = mx + n$. Pendiente a partir de dos puntos $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
                  contentMarkdown: `### 📈 Pendiente y Ecuación de la Recta
- **Pendiente:** $m = \\frac{y_2 - y_1}{x_2 - x_1}$
- **Ecuación Punto-Pendiente:** $y - y_1 = m(x - x_1)$
- **Intersección con el Eje Y:** Punto $(0, n)$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa06-g1',
                  title: 'Ejercicio Guiado: Recta que pasa por dos puntos',
                  difficulty: 'Intermedio',
                  statement: 'Determina la ecuación de la recta que pasa por los puntos $P(2, 5)$ y $Q(6, 13)$.',
                  steps: [
                    {
                      title: 'Paso 1: Calcular la pendiente m',
                      description: '$m = \\frac{13 - 5}{6 - 2} = \\frac{8}{4} = 2$.',
                      mathExpression: 'm = 2'
                    },
                    {
                      title: 'Paso 2: Aplicar punto-pendiente con P(2,5)',
                      description: '$y - 5 = 2(x - 2) \\implies y - 5 = 2x - 4 \\implies y = 2x + 1$.',
                      mathExpression: 'y = 2x + 1'
                    }
                  ],
                  finalAnswer: 'y = 2x + 1'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa06-prop1',
                  title: 'Guía de Ecuaciones de la Recta y Paralelismo',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Determina si las parejas de rectas son paralelas ($m_1 = m_2$) o secantes.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula la pendiente de la recta $3x - 2y = 8$.',
                      solution: '$-2y = -3x + 8 \\implies y = \\frac{3}{2}x - 4$, pendiente $m = \\frac{3}{2}$.',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['algebra'].oas[3]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Geometría',
          shortTitle: 'Geometría',
          icon: '📏',
          description: 'Cálculo de área y volumen de conos, homotecia (OA 08) con diagramas vectoriales y vectores en 2D.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 07',
              title: 'Área y Volumen del Cono',
              description: 'Desarrollar las fórmulas para encontrar el área de la superficie y el volumen del cono: aplicándolas en situaciones de la vida real.',
              materials: [
                {
                  id: '1m-oa07-mat1',
                  title: 'Presentación: Geometría del Cono y Teorema de Pitágoras',
                  type: 'presentation',
                  tag: 'Cuerpos Redondos',
                  readTime: '15 min',
                  summary: 'Relación $g^2 = r^2 + h^2$. Área lateral $A_L = \\pi r g$ y volumen $V = \\frac{1}{3}\\pi r^2 h$.',
                  contentMarkdown: `### 🍦 Fórmulas del Cono Recto
- **Generatriz:** $g = \\sqrt{r^2 + h^2}$
- **Área Basal:** $A_B = \\pi r^2$
- **Área Lateral:** $A_L = \\pi r g$
- **Área Total:** $A_T = \\pi r(r + g)$
- **Volumen:** $V = \\frac{1}{3}\\pi r^2 h$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa07-g1',
                  title: 'Ejercicio Guiado: Cono de Tránsito y Cantidad de Plástico',
                  difficulty: 'Intermedio',
                  statement: 'Un cono de señalización vial tiene un radio basal de $15\\text{ cm}$ y una altura de $20\\text{ cm}$. ¿Cuál es su generatriz $g$ y su volumen?',
                  steps: [
                    {
                      title: 'Paso 1: Calcular la generatriz con Pitágoras',
                      description: '$g = \\sqrt{15^2 + 20^2} = \\sqrt{225 + 400} = \\sqrt{625} = 25\\text{ cm}$.',
                      mathExpression: 'g = 25\\text{ cm}'
                    },
                    {
                      title: 'Paso 2: Calcular el volumen',
                      description: '$V = \\frac{1}{3}\\pi (15)^2(20) = \\frac{1}{3}\\pi (225)(20) = 1500\\pi\\text{ cm}^3$.',
                      mathExpression: 'V = 1500\\pi\\text{ cm}^3 \\approx 4712.4\\text{ cm}^3'
                    }
                  ],
                  finalAnswer: 'Generatriz = 25 cm, Volumen = 1500π cm³'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa07-prop1',
                  title: 'Guía de Conos y Cilindros',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Usa $\\pi \\approx 3.14$ o expresa en función de $\\pi$.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el área lateral de un cono de radio $6\\text{ cm}$ y generatriz $10\\text{ cm}$.',
                      solution: '$A_L = \\pi (6)(10) = 60\\pi\\text{ cm}^2$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['geometria'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 08',
              title: 'Homotecia Geométrica y Segmentos Proporcionales (Don Bosco)',
              description: 'Mostrar que comprenden la homotecia de figuras planas: determinando razón k, coordenadas homotéticas, paralelismo y relaciones entre perímetros (|k|) y áreas (k²).',
              materials: [
                {
                  id: '1m-oa08-mat1',
                  title: 'Presentación Magistral: Teoría de Homotecia Directa e Inversa',
                  type: 'presentation',
                  tag: 'Geometría Proporcional',
                  readTime: '20 min',
                  summary: 'Centro O, razón k, propiedades de lados homólogos paralelos, razón de perímetros |k| y razón de áreas k².',
                  contentMarkdown: `### 🎯 Fundamentos de la Homotecia
Una homotecia con centro $O$ y razón $k \\neq 0$ transforma cada punto $P$ en un punto $P'$ tal que:
$$\\vec{OP'} = k \\cdot \\vec{OP} \\implies P' = O + k(P - O)$$

### Clasificación según la Razón $k$:
1. **$k > 1$:** Ampliación directa (misma orientación respecto al centro).
2. **$0 < k < 1$:** Reducción directa.
3. **$k = 1$:** Figura congruente e idéntica (identidad).
4. **$k = -1$:** Simetría central (rotación en $180^\\circ$).
5. **$k < 0$ ($k \\neq -1$):** Homotecia inversa (la figura se invierte respecto al centro).

### 📐 Propiedades Clave:
- **Paralelismo:** $A'B' \\parallel AB$.
- **Perímetros:** $\\text{Perímetro}' = |k| \\cdot \\text{Perímetro}$.
- **Áreas:** $\\text{Área}' = k^2 \\cdot \\text{Área}$.`
                },
                {
                  id: '1m-oa08-mat2',
                  title: 'Formulario: Homotecia Analítica en el Plano Cartesiano',
                  type: 'formula_sheet',
                  tag: 'Formulario Rápido',
                  readTime: '10 min',
                  summary: 'Fórmulas de traslación de centro y coordenadas con centro en el origen (k·x, k·y).',
                  contentMarkdown: `### 📌 Homotecia con Centro en el Origen $O(0,0)$
$$P(x, y) \\xrightarrow{H(O, k)} P'(kx, ky)$$

### 📌 Homotecia con Centro Externo $O(x_0, y_0)$
$$x' = x_0 + k(x - x_0), \\quad y' = y_0 + k(y - y_0)$$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa08-g1',
                  title: 'Ejercicio Guiado: Razón de Áreas en Triángulos Homotéticos',
                  difficulty: 'Intermedio',
                  statement: 'Un triángulo $\\triangle ABC$ tiene un área de $18\\text{ cm}^2$. Si se le aplica una homotecia con razón $k = -3$, ¿cuál es el área del triángulo resultante $\\triangle A\'B\'C\'$?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar la fórmula de razón de áreas',
                      description: 'El área de la figura transformada es igual al área original multiplicada por el cuadrado de la razón de homotecia $k^2$.',
                      mathExpression: '\\text{Área}\' = k^2 \\cdot \\text{Área}'
                    },
                    {
                      title: 'Paso 2: Calcular el factor k²',
                      description: '$k^2 = (-3)^2 = 9$. El área se amplifica 9 veces.',
                      mathExpression: '(-3)^2 = 9'
                    },
                    {
                      title: 'Paso 3: Calcular el área final',
                      description: '$\\text{Área}\' = 9 \\cdot 18\\text{ cm}^2 = 162\\text{ cm}^2$.',
                      mathExpression: '162\\text{ cm}^2'
                    }
                  ],
                  finalAnswer: 'Área = 162 cm²'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa08-prop1',
                  title: 'Guía Oficial Don Bosco: 14 Desafíos de Homotecia y Taller',
                  estimatedTime: '60 minutos',
                  studentInstructions: 'Resuelve los ejercicios en tu cuaderno y sube la foto de desarrollo para obtener el bonus.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Un plano a escala técnica usa razón $k = 1:50$. Si una viga en el plano mide $8\\text{ cm}$, ¿cuánto mide en la realidad?',
                      solution: 'Longitud real $= 8\\text{ cm} \\times 50 = 400\\text{ cm} = 4\\text{ metros}$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['geometria'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 09',
              title: 'Vectores en el Plano Cartesiano',
              description: 'Desarrollar el concepto de vector en el plano cartesiano: sumando, restando y multiplicando por escalar de forma gráfica y analítica.',
              materials: [
                {
                  id: '1m-oa09-mat1',
                  title: 'Presentación: Vectores en 2D y Traslaciones',
                  type: 'presentation',
                  tag: 'Vectores y Física',
                  readTime: '15 min',
                  summary: 'Módulo, dirección y sentido. Suma por componentes y traslación geométrica.',
                  contentMarkdown: `### 🧭 Vectores en $\\mathbb{R}^2$
Un vector $\\vec{v} = (v_x, v_y)$ tiene:
- **Módulo (Magnitud):** $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$
- **Dirección:** Ángulo $\\theta = \\arctan\\left(\\frac{v_y}{v_x}\\right)$
- **Suma:** $\\vec{u} + \\vec{v} = (u_x + v_x, u_y + v_y)$
- **Ponderación Escalar:** $c \\cdot \\vec{u} = (c \\cdot u_x, c \\cdot u_y)$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa09-g1',
                  title: 'Ejercicio Guiado: Módulo y Combinación Lineal',
                  difficulty: 'Intermedio',
                  statement: 'Dados $\\vec{u} = (3, -4)$ y $\\vec{v} = (-1, 2)$, calcula el módulo de $2\\vec{u} + 3\\vec{v}$.',
                  steps: [
                    {
                      title: 'Paso 1: Multiplicar por los escalares',
                      description: '$2\\vec{u} = (6, -8)$ y $3\\vec{v} = (-3, 6)$.'
                    },
                    {
                      title: 'Paso 2: Sumar componentes',
                      description: '$(6 - 3, -8 + 6) = (3, -2)$.'
                    },
                    {
                      title: 'Paso 3: Calcular el módulo',
                      description: '$\\sqrt{3^2 + (-2)^2} = \\sqrt{9 + 4} = \\sqrt{13}$.'
                    }
                  ],
                  finalAnswer: '√13 ≈ 3.61'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa09-prop1',
                  title: 'Guía de Vectores y Fuerzas en el Plano',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Grafica los vectores en el plano cartesiano.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el módulo de $\\vec{w} = (6, 8)$.',
                      solution: '$|\\vec{w}| = \\sqrt{36 + 64} = \\sqrt{100} = 10$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['geometria'].oas[2]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Probabilidad y Estadística',
          shortTitle: 'Probabilidad y Estadística',
          icon: '📊',
          description: 'Medidas de posición (cuartiles, percentiles), tablas de frecuencia, muestreo aleatorio y reglas de probabilidad.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 10',
              title: 'Medidas de Posición y Diagramas de Caja',
              description: 'Mostrar que comprenden las medidas de posición (cuartiles, deciles, percentiles) y diagramas de caja y bigotes para comparar conjuntos de datos.',
              materials: [
                {
                  id: '1m-oa10-mat1',
                  title: 'Presentación: Cuartiles, Percentiles y Rango Intercuartílico',
                  type: 'presentation',
                  tag: 'Estadística Descriptiva',
                  readTime: '15 min',
                  summary: 'Cálculo de percentiles $P_k$, rango intercuartílico $RIC = Q_3 - Q_1$ y detección de valores atípicos.',
                  contentMarkdown: `### 📦 Medidas de Posición en 1° Medio
- **$Q_1$ (Percentil 25):** Divide al $25\\%$ menor.
- **$Q_2$ (Mediana / Percentil 50):** Centro de la distribución.
- **$Q_3$ (Percentil 75):** Divide al $75\\%$ menor.
- **Rango Intercuartílico ($RIC$):** $RIC = Q_3 - Q_1$.`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa10-g1',
                  title: 'Ejercicio Guiado: Cálculo de RIC',
                  difficulty: 'Básico',
                  statement: 'Si en un estudio de sueldos $Q_1 = \\$550.000$ y $Q_3 = \\$920.000$, calcula el rango intercuartílico.',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar definición de RIC',
                      description: '$RIC = Q_3 - Q_1 = 920.000 - 550.000 = 370.000$.'
                    }
                  ],
                  finalAnswer: 'RIC = $370.000'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa10-prop1',
                  title: 'Guía de Boxplot Comparativo',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Determina los 5 números de resumen de cada muestra.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula la mediana de: $12, 15, 19, 22, 28, 31, 35$.',
                      solution: 'Dato central (posición 4): 22.',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['probabilidad'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 11',
              title: 'Tablas de Frecuencia para Datos Agrupados',
              description: 'Construir tablas de frecuencias agrupadas en intervalos: marca de clase, frecuencias acumuladas e histogramas.',
              materials: [
                {
                  id: '1m-oa11-mat1',
                  title: 'Presentación: Intervalos, Marca de Clase e Histogramas',
                  type: 'presentation',
                  tag: 'Agrupación de Datos',
                  readTime: '15 min',
                  summary: 'Amplitud de intervalo, marca de clase $M_c = \\frac{L_i + L_s}{2}$ e interpretación de frecuencias relativas.',
                  contentMarkdown: `### 📊 Tablas de Frecuencia Agrupada
- **Marca de Clase ($x_i$):** $x_i = \\frac{\\text{Límite Inferior} + \\text{Límite Superior}}{2}$
- **Frecuencia Relativa ($h_i$):** $h_i = \\frac{f_i}{N}$
- **Frecuencia Porcentual ($h_i\\%$):** $h_i \\times 100\\%$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa11-g1',
                  title: 'Ejercicio Guiado: Marca de Clase en Intervalo de Edades',
                  difficulty: 'Básico',
                  statement: 'Determina la marca de clase para el intervalo de edades $[15, 25[$.',
                  steps: [
                    {
                      title: 'Paso 1: Promediar los extremos',
                      description: '$M_c = \\frac{15 + 25}{2} = \\frac{40}{2} = 20$.'
                    }
                  ],
                  finalAnswer: 'Marca de clase = 20 años'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa11-prop1',
                  title: 'Guía de Histogramas y Polígonos de Frecuencia',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Construye la tabla completa con frecuencias acumuladas.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula la marca de clase de $[40, 60[$.',
                      solution: '$\\frac{40+60}{2} = 50$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['probabilidad'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 12',
              title: 'Muestreo Aleatorio y Sesgo de Selección',
              description: 'Explicar el comportamiento de una muestra aleatoria en relación a una población: sesgos de selección y representatividad estadística.',
              materials: [
                {
                  id: '1m-oa12-mat1',
                  title: 'Presentación: Técnicas de Muestreo Probabilístico',
                  type: 'presentation',
                  tag: 'Inferencia Estadística',
                  readTime: '15 min',
                  summary: 'Muestreo aleatorio simple, estratificado y por conglomerados. Evitar sesgos de autoselección.',
                  contentMarkdown: `### 🎯 Muestreo y Representatividad
- **Población:** Conjunto total de elementos a estudiar.
- **Muestra:** Subconjunto representativo.
- **Sesgo:** Error sistemático por mala selección muestral.`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa12-g1',
                  title: 'Ejercicio Guiado: Identificación de Sesgo en Encuestas',
                  difficulty: 'Básico',
                  statement: 'Se quiere conocer el hábito de lectura de los chilenos y se encuesta únicamente a personas que salen de una librería. ¿Existe sesgo?',
                  steps: [
                    {
                      title: 'Paso 1: Analizar la representatividad',
                      description: 'La muestra tiene un claro sesgo de selección porque las personas en una librería tienen una propensión mucho más alta a leer que la población general.'
                    }
                  ],
                  finalAnswer: 'Existe sesgo de selección muestral'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa12-prop1',
                  title: 'Guía de Análisis Crítico de Muestreos y Encuestas',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Identifica si el método de muestreo es aleatorio o sesgado.',
                  problems: [
                    {
                      number: 1,
                      statement: '¿Por qué el muestreo voluntario en internet suele tener sesgo?',
                      solution: 'Porque solo responden personas con posturas extremas o alto interés en el tema.',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['probabilidad'].oas[2]?.questions || []
            },
            {
              oaId: 'OA 13',
              title: 'Regla de la Suma y del Producto',
              description: 'Desarrollar las reglas de las probabilidades de la unión y de la intersección de eventos en forma conceptual y simbólica.',
              materials: [
                {
                  id: '1m-oa13-mat1',
                  title: 'Presentación: Eventos Mutuamente Excluyentes e Independientes',
                  type: 'presentation',
                  tag: 'Teoría de Probabilidades',
                  readTime: '15 min',
                  summary: 'Regla aditiva $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ y regla multiplicativa $P(A \\cap B) = P(A) \\cdot P(B)$.',
                  contentMarkdown: `### 🎲 Regla Aditiva
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
- Si son **mutuamente excluyentes** (no pueden ocurrir a la vez): $P(A \\cap B) = 0 \\implies P(A \\cup B) = P(A) + P(B)$.

### 🎯 Regla Multiplicativa (Independientes)
$$P(A \\cap B) = P(A) \\cdot P(B)$$`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa13-g1',
                  title: 'Ejercicio Guiado: Extracción de Cartas de un Naipe',
                  difficulty: 'Intermedio',
                  statement: 'De un mazo estándar de 52 cartas, ¿cuál es la probabilidad de sacar un As o un Trébol?',
                  steps: [
                    {
                      title: 'Paso 1: Probabilidad individual de As',
                      description: 'Hay 4 ases: $P(\\text{As}) = \\frac{4}{52}$.'
                    },
                    {
                      title: 'Paso 2: Probabilidad individual de Trébol',
                      description: 'Hay 13 tréboles: $P(\\text{Trébol}) = \\frac{13}{52}$.'
                    },
                    {
                      title: 'Paso 3: Identificar intersección (As de Trébol)',
                      description: 'Hay 1 As de Trébol: $P(\\text{As} \\cap \\text{Trébol}) = \\frac{1}{52}$.'
                    },
                    {
                      title: 'Paso 4: Aplicar la regla de la suma',
                      description: '$P = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13} \\approx 30.77\\%$.'
                    }
                  ],
                  finalAnswer: '4/13 ≈ 30.77%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa13-prop1',
                  title: 'Guía de Eventos Compuestos y Diagramas de Árbol',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Construye el diagrama de árbol para cada experimento aleatorio.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Se lanzan 2 dados. ¿Cuál es la probabilidad de que la suma sea 7 u 11?',
                      solution: 'Suma 7 (6 casos), Suma 11 (2 casos). Mutuamente excluyentes: $\\frac{6+2}{36} = \\frac{8}{36} = \\frac{2}{9}$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['probabilidad'].oas[3]?.questions || []
            },
            {
              oaId: 'OA 14',
              title: 'Probabilidad Compuesta y Eventos con/sin Reposición',
              description: 'Calcular probabilidades de eventos compuestos en situaciones con reposición (independientes) y sin reposición (dependientes).',
              materials: [
                {
                  id: '1m-oa14-mat1',
                  title: 'Presentación: Eventos con Reposición vs Sin Reposición',
                  type: 'presentation',
                  tag: 'Probabilidad Avanzada',
                  readTime: '15 min',
                  summary: 'Con reposición el espacio muestral se mantiene constante. Sin reposición el denominador disminuye en 1 para cada extracción sucesiva.',
                  contentMarkdown: `### 🎱 Extracciones Sucesivas
- **Con Reposición:** $P(A \\text{ y luego } B) = P(A) \\cdot P(B)$ (Espacio constante).
- **Sin Reposición:** $P(A \\text{ y luego } B) = P(A) \\cdot P(B|A)$ (Espacio reducido en 1).`
                }
              ],
              guidedExercises: [
                {
                  id: '1m-oa14-g1',
                  title: 'Ejercicio Guiado: Bolas en una Urna sin Reposición',
                  difficulty: 'Intermedio',
                  statement: 'En una urna hay 5 bolas rojas y 3 bolas negras. Se extraen 2 bolas consecutivas sin reposición. ¿Cuál es la probabilidad de que ambas sean negras?',
                  steps: [
                    {
                      title: 'Paso 1: Probabilidad de la primera negra',
                      description: 'Total = 8 bolas. $P(N_1) = \\frac{3}{8}$.'
                    },
                    {
                      title: 'Paso 2: Probabilidad de la segunda negra',
                      description: 'Quedan 2 negras y 7 bolas en total: $P(N_2|N_1) = \\frac{2}{7}$.'
                    },
                    {
                      title: 'Paso 3: Multiplicar probabilidades',
                      description: '$P = \\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28} \\approx 10.71\\%$.'
                    }
                  ],
                  finalAnswer: '3/28 ≈ 10.71%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '1m-oa14-prop1',
                  title: 'Guía de Probabilidad Condicional y Urnas',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Calcula con y sin reposición comparando ambos resultados.',
                  problems: [
                    {
                      number: 1,
                      statement: 'De una bolsa con 4 fichas azules y 2 verdes, se extraen 2 sin reposición. ¿Probabilidad de 2 azules?',
                      solution: '$\\frac{4}{6} \\cdot \\frac{3}{5} = \\frac{12}{30} = \\frac{2}{5} = 40\\%$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['1_medio'].ejes['probabilidad'].oas[4]?.questions || []
            }
          ]
        }
      ]
    },

    '2_medio': {
      id: '2_medio',
      name: '2° Medio',
      category: 'Formación General',
      badgeNumber: '2',
      colorBadge: 'bg-indigo-600 text-white',
      description: 'Números reales, logaritmos, función cuadrática, trigonometría en triángulos rectángulos y variables aleatorias.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Números',
          shortTitle: 'Números',
          icon: '🔢',
          description: 'Números reales, aproximación de irracionales, propiedades de raíces enésimas y logaritmos.',
          colorTheme: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            badge: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-600 to-indigo-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Números Reales y Raíces Enésimas',
              description: 'Realizar cálculos y estimaciones que involucren operaciones con números reales y raíces enésimas.',
              materials: [
                {
                  id: '2m-oa01-mat1',
                  title: 'Presentación: Racionalización de Denominadores Monomios y Binomios',
                  type: 'presentation',
                  tag: 'Álgebra de Reales',
                  readTime: '15 min',
                  summary: 'Multiplicación por el conjugado radical $(\\sqrt{a} \\mp \\sqrt{b})$ para eliminar raíces del denominador.',
                  contentMarkdown: `### 🎯 Racionalización
Técnica algebraica para transformar una fracción con radicales en el denominador a una fracción equivalente con denominador entero.

1. **Denominador Monomio:**
   $$\\frac{a}{\\sqrt{b}} = \\frac{a \\cdot \\sqrt{b}}{\\sqrt{b} \\cdot \\sqrt{b}} = \\frac{a\\sqrt{b}}{b}$$
2. **Denominador Binomio (Conjugado):**
   $$\\frac{a}{\\sqrt{b} + \\sqrt{c}} = \\frac{a(\\sqrt{b} - \\sqrt{c})}{(\\sqrt{b} + \\sqrt{c})(\\sqrt{b} - \\sqrt{c})} = \\frac{a(\\sqrt{b} - \\sqrt{c})}{b - c}$$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa01-g1',
                  title: 'Ejercicio Guiado: Racionalización con Conjugado',
                  difficulty: 'Intermedio',
                  statement: 'Racionaliza y simplifica: $\\frac{6}{\\sqrt{5} - \\sqrt{2}}$',
                  steps: [
                    {
                      title: 'Paso 1: Multiplicar por el conjugado',
                      description: 'El conjugado de $\\sqrt{5} - \\sqrt{2}$ es $\\sqrt{5} + \\sqrt{2}$.',
                      mathExpression: '\\frac{6(\\sqrt{5} + \\sqrt{2})}{(\\sqrt{5} - \\sqrt{2})(\\sqrt{5} + \\sqrt{2})}'
                    },
                    {
                      title: 'Paso 2: Desarrollar la suma por su diferencia en el denominador',
                      description: '$(\\sqrt{5})^2 - (\\sqrt{2})^2 = 5 - 2 = 3$.',
                      mathExpression: '\\frac{6(\\sqrt{5} + \\sqrt{2})}{3}'
                    },
                    {
                      title: 'Paso 3: Simplificar con el numerador',
                      description: '$\\frac{6}{3}(\\sqrt{5} + \\sqrt{2}) = 2(\\sqrt{5} + \\sqrt{2}) = 2\\sqrt{5} + 2\\sqrt{2}$.',
                      mathExpression: '2\\sqrt{5} + 2\\sqrt{2}'
                    }
                  ],
                  finalAnswer: '2√5 + 2√2'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa01-prop1',
                  title: 'Guía de Raíces Enésimas y Racionalización',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Racionaliza todos los denominadores.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Racionaliza: $\\frac{10}{\\sqrt{5}}$',
                      solution: '$\\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['numeros'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 02',
              title: 'Logaritmos y sus Propiedades',
              description: 'Mostrar que comprenden las relaciones entre potencias, raíces y logaritmos: aplicando propiedades y resolviendo problemas en ciencias.',
              materials: [
                {
                  id: '2m-oa02-mat1',
                  title: 'Presentación: Definición y Propiedades de los Logaritmos',
                  type: 'presentation',
                  tag: 'Logaritmos',
                  readTime: '15 min',
                  summary: 'Definición $\\log_b(a) = c \\iff b^c = a$. Logaritmo de un producto, cociente, potencia y cambio de base.',
                  contentMarkdown: `### 🪵 Definición de Logaritmo
$$\\log_b(a) = c \\iff b^c = a \\quad (b > 0, b \\neq 1, a > 0)$$

### 📜 Propiedades Esenciales
1. $\\log_b(x \\cdot y) = \\log_b(x) + \\log_b(y)$
2. $\\log_b\\left(\\frac{x}{y}\\right) = \\log_b(x) - \\log_b(y)$
3. $\\log_b(x^k) = k \\cdot \\log_b(x)$
4. **Cambio de base:** $\\log_b(a) = \\frac{\\log_c(a)}{\\log_c(b)}$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa02-g1',
                  title: 'Ejercicio Guiado: Ecuación Logarítmica',
                  difficulty: 'Intermedio',
                  statement: 'Resuelve la ecuación: $\\log_2(x + 3) + \\log_2(x - 3) = 4$',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar propiedad de suma de logaritmos',
                      description: '$\\log_2((x+3)(x-3)) = \\log_2(x^2 - 9) = 4$.'
                    },
                    {
                      title: 'Paso 2: Aplicar definición exponencial',
                      description: '$x^2 - 9 = 2^4 = 16$.'
                    },
                    {
                      title: 'Paso 3: Despejar x',
                      description: '$x^2 = 25 \\implies x = 5$ (descartamos $x = -5$ por argumento negativo).'
                    }
                  ],
                  finalAnswer: 'x = 5'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa02-prop1',
                  title: 'Guía de Escala Richter y pH con Logaritmos',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Aplica propiedades de logaritmos para modelar fenómenos físicos.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el valor de $\\log_3(81) - \\log_5(125)$.',
                      solution: '$4 - 3 = 1$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['numeros'].oas[1]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Álgebra y Funciones',
          shortTitle: 'Álgebra y Funciones',
          icon: '📐',
          description: 'Función cuadrática $f(x)=ax^2+bx+c$, ecuaciones de segundo grado, inecuaciones y modelamiento parabólico.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 03',
              title: 'Función Cuadrática y Parábola',
              description: 'Mostrar que comprenden la función cuadrática $f(x)=ax^2+bx+c$: reconociendo el papel de los coeficientes, concavidad, vértice y ceros de la función.',
              materials: [
                {
                  id: '2m-oa03-mat1',
                  title: 'Presentación: Anatomía de la Parábola',
                  type: 'presentation',
                  tag: 'Modelamiento Cuadrático',
                  readTime: '15 min',
                  summary: 'Vértice $x_v = -\\frac{b}{2a}$, eje de simetría, concavidad ($a>0$ abre hacia arriba, $a<0$ abre hacia abajo) y ceros.',
                  contentMarkdown: `### 🎯 Función Cuadrática: $f(x) = ax^2 + bx + c$
- **Concavidad:** Si $a > 0 \\implies \\cup$ (Mínimo en vértice). Si $a < 0 \\implies \\cap$ (Máximo en vértice).
- **Vértice:** $V(x_v, y_v)$ donde $x_v = -\\frac{b}{2a}$ y $y_v = f(x_v)$.
- **Eje de Simetría:** Recta vertical $x = -\\frac{b}{2a}$.
- **Corte con eje Y:** $(0, c)$.
- **Ceros (raíces):** Puntos donde $f(x) = 0$.`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa03-g1',
                  title: 'Ejercicio Guiado: Trayectoria de un Proyectil',
                  difficulty: 'Intermedio',
                  statement: 'La altura $h(t)$ en metros de una pelota lanzada hacia arriba está dada por $h(t) = -5t^2 + 20t$. Determina en qué instante alcanza su altura máxima y cuál es dicha altura.',
                  steps: [
                    {
                      title: 'Paso 1: Identificar coeficientes cuadráticos',
                      description: '$a = -5, b = 20, c = 0$. Concavidad hacia abajo (posee un punto máximo).'
                    },
                    {
                      title: 'Paso 2: Calcular el tiempo del vértice',
                      description: '$t_v = -\\frac{b}{2a} = -\\frac{20}{2(-5)} = -\\frac{20}{-10} = 2\\text{ segundos}$.'
                    },
                    {
                      title: 'Paso 3: Evaluar la altura máxima',
                      description: '$h(2) = -5(2)^2 + 20(2) = -5(4) + 40 = -20 + 40 = 20\\text{ metros}$.'
                    }
                  ],
                  finalAnswer: 'Alcanza la altura máxima de 20 m a los 2 segundos'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa03-prop1',
                  title: 'Guía de Análisis Gráfico de la Parábola',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Determina vértice, concavidad y gráfica de cada función.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Dada $f(x) = x^2 - 6x + 8$, halla sus ceros y su vértice.',
                      solution: 'Ceros: $(x-2)(x-4)=0 \\implies x=2, 4$. Vértice: $x_v=3, y_v=9-18+8=-1 \\implies V(3, -1)$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['algebra'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 04',
              title: 'Ecuaciones de Segundo Grado y Discriminante',
              description: 'Resolver ecuaciones de segundo grado de la forma ax² + bx + c = 0 mediante factorización, completación de cuadrados y fórmula general, analizando la naturaleza de sus raíces según el discriminante Δ.',
              materials: [
                {
                  id: '2m-oa04-mat1',
                  title: 'Presentación: Fórmula General y el Discriminante Δ',
                  type: 'presentation',
                  tag: 'Ecuaciones Cuadráticas',
                  readTime: '15 min',
                  summary: 'Fórmula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ y análisis de $\\Delta = b^2 - 4ac$ ($\\,>0$ dos reales distintas, $=0$ una real doble, $<0$ complejas conjugadas).',
                  contentMarkdown: `### 🎯 Fórmula Cuadrática
$$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4ac$$
- **$\\Delta > 0$:** Dos soluciones reales y distintas (2 cortes con eje X).
- **$\\Delta = 0$:** Una solución real de multiplicidad 2 (1 corte tangente al eje X).
- **$\\Delta < 0$:** Sin soluciones en $\\mathbb{R}$ (no corta al eje X).`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa04-g1',
                  title: 'Ejercicio Guiado: Discriminante y Soluciones',
                  difficulty: 'Intermedio',
                  statement: 'Determina la naturaleza de las raíces y resuelve la ecuación: $2x^2 - 5x + 2 = 0$.',
                  steps: [
                    {
                      title: 'Paso 1: Identificar coeficientes y calcular Δ',
                      description: '$a = 2, b = -5, c = 2$. Luego $\\Delta = (-5)^2 - 4(2)(2) = 25 - 16 = 9 > 0$ (2 raíces reales).'
                    },
                    {
                      title: 'Paso 2: Aplicar la fórmula general',
                      description: '$x = \\frac{5 \\pm \\sqrt{9}}{2(2)} = \\frac{5 \\pm 3}{4}$.'
                    },
                    {
                      title: 'Paso 3: Obtener ambas raíces',
                      description: '$x_1 = \\frac{8}{4} = 2$, $x_2 = \\frac{2}{4} = \\frac{1}{2}$.'
                    }
                  ],
                  finalAnswer: 'x₁ = 2, x₂ = 1/2'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa04-prop1',
                  title: 'Guía de Ecuaciones de Segundo Grado',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Calcula el discriminante antes de resolver.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Resuelve $x^2 - 7x + 12 = 0$.',
                      solution: '$(x - 3)(x - 4) = 0 \\implies x_1 = 3, x_2 = 4$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['algebra'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 05',
              title: 'Ecuaciones Exponenciales Simples',
              description: 'Modelar y resolver problemas mediante ecuaciones exponenciales de bases iguales o reducibles mediante potencias.',
              materials: [
                {
                  id: '2m-oa05-mat1',
                  title: 'Presentación: Ecuaciones de la Forma a^(f(x)) = a^(g(x))',
                  type: 'presentation',
                  tag: 'Álgebra Exponencial',
                  readTime: '12 min',
                  summary: 'Si las bases son iguales ($a > 0, a \\neq 1$), entonces los exponentes son iguales: $a^u = a^v \\implies u = v$.',
                  contentMarkdown: `### ⚡ Ecuaciones Exponenciales
Técnica de igualación de bases:
$$a^{f(x)} = a^{g(x)} \\implies f(x) = g(x)$$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa05-g1',
                  title: 'Ejercicio Guiado: Reducción a Base Común',
                  difficulty: 'Intermedio',
                  statement: 'Resuelve: $2^{3x - 1} = 32$.',
                  steps: [
                    {
                      title: 'Paso 1: Expresar 32 en base 2',
                      description: '$32 = 2^5$. Por lo tanto, $2^{3x - 1} = 2^5$.'
                    },
                    {
                      title: 'Paso 2: Igualar exponentes',
                      description: '$3x - 1 = 5 \\implies 3x = 6 \\implies x = 2$.'
                    }
                  ],
                  finalAnswer: 'x = 2'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa05-prop1',
                  title: 'Guía de Ecuaciones Exponenciales y Crecimiento',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Expresa ambos lados en la misma potencia de base prima.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Resuelve $3^{x+2} = 81$.',
                      solution: '$3^{x+2} = 3^4 \\implies x + 2 = 4 \\implies x = 2$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['algebra'].oas[2]?.questions || []
            },
            {
              oaId: 'OA 06',
              title: 'Sistemas de Inecuaciones Lineales',
              description: 'Resolver sistemas de inecuaciones lineales con una incógnita y representar sus intervalos solución en la recta real.',
              materials: [
                {
                  id: '2m-oa06-mat1',
                  title: 'Presentación: Intersección de Intervalos Solución',
                  type: 'presentation',
                  tag: 'Inecuaciones',
                  readTime: '12 min',
                  summary: 'Resolución independiente de cada inecuación y determinación de la intersección $S = S_1 \\cap S_2$.',
                  contentMarkdown: `### ⚖️ Sistemas de Inecuaciones
1. Resolver inecuación 1 $\\implies S_1$.
2. Resolver inecuación 2 $\\implies S_2$.
3. La solución global es la intersección: $S = S_1 \\cap S_2$.`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa06-g1',
                  title: 'Ejercicio Guiado: Intersección de Intervalos',
                  difficulty: 'Intermedio',
                  statement: 'Resuelve el sistema: $2x + 1 > 5$ y $3x - 2 \\le 16$.',
                  steps: [
                    {
                      title: 'Paso 1: Resolver la primera inecuación',
                      description: '$2x > 4 \\implies x > 2 \\implies S_1 = (2, +\\infty)$.'
                    },
                    {
                      title: 'Paso 2: Resolver la segunda inecuación',
                      description: '$3x \\le 18 \\implies x \\le 6 \\implies S_2 = (-\\infty, 6]$.'
                    },
                    {
                      title: 'Paso 3: Intersectar intervalos',
                      description: '$S = S_1 \\cap S_2 = (2, 6]$.'
                    }
                  ],
                  finalAnswer: 'x ∈ ]2, 6]'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa06-prop1',
                  title: 'Guía de Desigualdades e Intervalos en R',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Dibuja la recta numérica para comprobar la intersección.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Resuelve $x + 3 \\ge 7$ y $2x < 14$.',
                      solution: '$x \\ge 4$ y $x < 7 \\implies [4, 7)$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['algebra'].oas[3]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Geometría',
          shortTitle: 'Geometría',
          icon: '📏',
          description: 'Razones trigonométricas en triángulos rectángulos (seno, coseno, tangente), área y volumen de esferas y ecuación de la recta.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 07',
              title: 'Razones Trigonométricas (SOH-CAH-TOA)',
              description: 'Mostrar que comprenden las razones trigonométricas de seno, coseno y tangente en triángulos rectángulos: aplicándolas a diversos problemas de medición indirecta.',
              materials: [
                {
                  id: '2m-oa07-mat1',
                  title: 'Presentación: SOH-CAH-TOA y Ángulos Notables',
                  type: 'presentation',
                  tag: 'Trigonometría 2D',
                  readTime: '15 min',
                  summary: 'Definiciones de $\\sin(\\alpha)$, $\\cos(\\alpha)$, $\\tan(\\alpha)$ y tabla de valores notables ($30^\\circ, 45^\\circ, 60^\\circ$).',
                  contentMarkdown: `### 📐 Razones Trigonométricas
$$\\sin(\\alpha) = \\frac{\\text{Cateto Opuesto}}{\\text{Hipotenusa}}, \\quad \\cos(\\alpha) = \\frac{\\text{Cateto Adyacente}}{\\text{Hipotenusa}}, \\quad \\tan(\\alpha) = \\frac{\\text{Cateto Opuesto}}{\\text{Cateto Adyacente}}$$

### Ángulos Notables Clave
| Ángulo $\\alpha$ | $\\sin(\\alpha)$ | $\\cos(\\alpha)$ | $\\tan(\\alpha)$ |
| :---: | :---: | :---: | :---: |
| $30^\\circ$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{3}}{3}$ |
| $45^\\circ$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $1$ |
| $60^\\circ$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{1}{2}$ | $\\sqrt{3}$ |`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa07-g1',
                  title: 'Ejercicio Guiado: Altura de un Edificio con Teodolito',
                  difficulty: 'Intermedio',
                  statement: 'Un observador situado a $40\\text{ metros}$ de la base de un edificio mide un ángulo de elevación de $30^\\circ$ hacia la cima. ¿Cuál es la altura del edificio?',
                  steps: [
                    {
                      title: 'Paso 1: Elegir la razón trigonométrica adecuada',
                      description: 'Conocemos el cateto adyacente ($40\\text{ m}$) y buscamos el cateto opuesto ($h$). Usamos $\\tan(30^\\circ)$.',
                      mathExpression: '\\tan(30^\\circ) = \\frac{h}{40}'
                    },
                    {
                      title: 'Paso 2: Despejar la altura',
                      description: '$h = 40 \\cdot \\tan(30^\\circ) = 40 \\cdot \\frac{\\sqrt{3}}{3} \\approx 23.09\\text{ metros}$.',
                      mathExpression: 'h \\approx 23.09\\text{ m}'
                    }
                  ],
                  finalAnswer: 'Altura ≈ 23.09 metros'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa07-prop1',
                  title: 'Guía de Medición Indirecta y Trigonometría',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Realiza el bosquejo y resuelve usando razones trigonométricas.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Un cable de $50\\text{ m}$ sostiene una antena formando un ángulo de $60^\\circ$ con el suelo. ¿A qué altura se conecta el cable a la antena?',
                      solution: '$h = 50 \\cdot \\sin(60^\\circ) = 50 \\cdot \\frac{\\sqrt{3}}{2} = 25\\sqrt{3} \\approx 43.3\\text{ m}$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['geometria'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 08',
              title: 'Área y Volumen de la Esfera 3D',
              description: 'Mostrar que comprenden la esfera: deduciendo y aplicando las fórmulas de área superficial $A = 4\\pi r^2$ y volumen $V = \\frac{4}{3}\\pi r^3$.',
              materials: [
                {
                  id: '2m-oa08-mat1',
                  title: 'Presentación: Geometría Espacial de la Esfera',
                  type: 'presentation',
                  tag: 'Cuerpos 3D',
                  readTime: '12 min',
                  summary: 'Fórmulas $A = 4\\pi r^2$ y $V = \\frac{4}{3}\\pi r^3$, aplicaciones en astronomía y diseño industrial.',
                  contentMarkdown: `### 🌐 Fórmulas de la Esfera
- **Área Superficial:** $A = 4\\pi r^2$
- **Volumen:** $V = \\frac{4}{3}\\pi r^3$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa08-g1',
                  title: 'Ejercicio Guiado: Volumen de un Balón de Fútbol',
                  difficulty: 'Intermedio',
                  statement: 'Un balón esférico tiene un radio de $r = 11\\text{ cm}$. Calcula su volumen exacto en función de $\\pi$.',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar la fórmula de volumen',
                      description: '$V = \\frac{4}{3}\\pi (11)^3 = \\frac{4}{3}\\pi (1331) = \\frac{5324}{3}\\pi\\text{ cm}^3 \\approx 1774.67\\pi\\text{ cm}^3$.'
                    }
                  ],
                  finalAnswer: '5324π/3 cm³'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa08-prop1',
                  title: 'Guía de Geometría de Cuerpos Redondos',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Calcula áreas y volúmenes de esferas y semiesferas.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el área superficial de una esfera de radio $3\\text{ cm}$.',
                      solution: '$A = 4\\pi(3)^2 = 36\\pi\\text{ cm}^2$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['geometria'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 09',
              title: 'Ecuación Vectorial y Continua de la Recta',
              description: 'Determinar la ecuación vectorial, paramétrica y continua de la recta en el plano cartesiano $\\mathbb{R}^2$ y en el espacio $\\mathbb{R}^3$.',
              materials: [
                {
                  id: '2m-oa09-mat1',
                  title: 'Presentación: Ecuaciones de la Recta con Vectores',
                  type: 'presentation',
                  tag: 'Geometría Vectorial',
                  readTime: '15 min',
                  summary: 'Ecuación vectorial $\\vec{r} = \\vec{p}_0 + \\lambda \\vec{d}$, vector director y paso a forma continua.',
                  contentMarkdown: `### 🧭 Recta Vectorial
$$\\vec{r}(t) = P_0 + t \\vec{d} = (x_0, y_0) + t(d_1, d_2)$$
- **Forma Continua:** $\\frac{x - x_0}{d_1} = \\frac{y - y_0}{d_2}$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa09-g1',
                  title: 'Ejercicio Guiado: Recta que pasa por Dos Puntos',
                  difficulty: 'Intermedio',
                  statement: 'Halla el vector director y la ecuación continua de la recta que pasa por $A(1, 2)$ y $B(4, 8)$.',
                  steps: [
                    {
                      title: 'Paso 1: Calcular vector director d = B - A',
                      description: '$\\vec{d} = (4 - 1, 8 - 2) = (3, 6)$.'
                    },
                    {
                      title: 'Paso 2: Escribir ecuación continua',
                      description: '$\\frac{x - 1}{3} = \\frac{y - 2}{6} \\implies y - 2 = 2(x - 1) \\implies y = 2x$.'
                    }
                  ],
                  finalAnswer: '(x - 1)/3 = (y - 2)/6'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa09-prop1',
                  title: 'Guía de Ecuaciones Vectoriales y Paramétricas',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Determina si dos rectas son paralelas o perpendiculares.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Escribe la ecuación vectorial de la recta que pasa por $(0,0)$ con vector director $(2, 5)$.',
                      solution: '$(x, y) = t(2, 5)$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['geometria'].oas[2]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Probabilidad y Estadística',
          shortTitle: 'Probabilidad y Estadística',
          icon: '📊',
          description: 'Variables aleatorias discretas, tablas de distribución, probabilidad condicional y técnicas combinatorias.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 10',
              title: 'Variables Aleatorias Discretas y Esperanza Matemática',
              description: 'Mostrar que comprenden el concepto de variable aleatoria discreta: construyendo su función de probabilidad $P(X=x)$ y calculando el valor esperado (esperanza).',
              materials: [
                {
                  id: '2m-oa10-mat1',
                  title: 'Presentación: Distribuciones de Probabilidad Discreta',
                  type: 'presentation',
                  tag: 'Variables Aleatorias',
                  readTime: '12 min',
                  summary: 'Definición de variable aleatoria $X$, tabla de probabilidad $\\sum P(X=x_i) = 1$ y esperanza $E(X) = \\sum x_i P(x_i)$.',
                  contentMarkdown: `### 🎲 Variable Aleatoria Discreta
- **Propiedad fundamental:** $\\sum_{i} P(X = x_i) = 1$
- **Esperanza Matemática:** $E(X) = \\sum x_i \\cdot P(X = x_i)$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa10-g1',
                  title: 'Ejercicio Guiado: Esperanza de un Juego de Azar',
                  difficulty: 'Intermedio',
                  statement: 'En una rifa ganas $\\$10.000$ con prob. $0.1$, $\\$2.000$ con prob. $0.3$, y $\\$0$ con prob. $0.6$. ¿Cuál es el premio esperado $E(X)$?',
                  steps: [
                    {
                      title: 'Paso 1: Aplicar fórmula de valor esperado',
                      description: '$E(X) = 10000(0.1) + 2000(0.3) + 0(0.6) = 1000 + 600 + 0 = \\$1.600$.'
                    }
                  ],
                  finalAnswer: 'E(X) = $1.600'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa10-prop1',
                  title: 'Guía de Variables Aleatorias y Juegos Justos',
                  estimatedTime: '30 minutos',
                  studentInstructions: 'Verifica que la suma de probabilidades sea igual a 1.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si $X$ toma valores $1$ y $2$ con $P(X=1) = 0.4$, calcula $E(X)$.',
                      solution: '$P(X=2) = 0.6 \\implies E(X) = 1(0.4) + 2(0.6) = 1.6$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['probabilidad'].oas[0]?.questions || []
            },
            {
              oaId: 'OA 11',
              title: 'Probabilidad Condicional',
              description: 'Mostrar que comprenden el concepto de probabilidad condicional: calculando e interpretando en tablas de doble entrada y árboles de decisión.',
              materials: [
                {
                  id: '2m-oa11-mat1',
                  title: 'Presentación: Probabilidad Condicional y Tablas 2x2',
                  type: 'presentation',
                  tag: 'Probabilidad Avanzada',
                  readTime: '15 min',
                  summary: 'Fórmula $P(B|A) = \\frac{P(A \\cap B)}{P(A)}$. Aplicación en pruebas diagnósticas y encuestas.',
                  contentMarkdown: `### 🎯 Probabilidad Condicional
La probabilidad de que ocurra el evento $B$ dado que ya ha ocurrido el evento $A$:
$$P(B|A) = \\frac{P(A \\cap B)}{P(A)} \\quad (P(A) > 0)$$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa11-g1',
                  title: 'Ejercicio Guiado: Encuesta de Preferencias Deportivas',
                  difficulty: 'Intermedio',
                  statement: 'En un grupo de 100 estudiantes, 60 juegan fútbol, 40 juegan básquetbol y 20 juegan ambos deportes. Si se elige al azar un estudiante que juega fútbol, ¿cuál es la probabilidad de que también juegue básquetbol?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar eventos y probabilidades',
                      description: '$P(\\text{Fútbol}) = \\frac{60}{100} = 0.6$, $P(\\text{Fútbol} \\cap \\text{Básquet}) = \\frac{20}{100} = 0.2$.'
                    },
                    {
                      title: 'Paso 2: Aplicar la fórmula condicional',
                      description: '$P(\\text{Básquet}|\\text{Fútbol}) = \\frac{P(\\text{Fútbol} \\cap \\text{Básquet})}{P(\\text{Fútbol})} = \\frac{0.2}{0.6} = \\frac{1}{3} \\approx 33.33\\%$.'
                    }
                  ],
                  finalAnswer: '1/3 ≈ 33.33%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa11-prop1',
                  title: 'Guía de Tablas de Contingencia y Probabilidad Condicional',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Completa la tabla de frecuencias antes de responder.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si $P(A) = 0.5$, $P(B) = 0.6$ y $P(A \\cap B) = 0.3$, calcula $P(A|B)$.',
                      solution: '$P(A|B) = \\frac{0.3}{0.6} = 0.5$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['probabilidad'].oas[1]?.questions || []
            },
            {
              oaId: 'OA 12',
              title: 'Permutaciones, Combinaciones y Principio Multiplicativo',
              description: 'Resolver problemas utilizando técnicas de conteo: principio multiplicativo, permutaciones simples y circulares, y combinaciones.',
              materials: [
                {
                  id: '2m-oa12-mat1',
                  title: 'Presentación: Técnicas Combinatorias de Conteo',
                  type: 'presentation',
                  tag: 'Combinatoria',
                  readTime: '15 min',
                  summary: 'Diferencia entre orden relevante (Permutaciones $P_n = n!$, Variaciones $V_k^n = \\frac{n!}{(n-k)!}$) y sin orden (Combinaciones $C_k^n = \\binom{n}{k}$).',
                  contentMarkdown: `### 🔢 Técnicas de Conteo
- **Permutación (importa el orden de todos):** $P_n = n!$
- **Combinación (NO importa el orden):** $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$`
                }
              ],
              guidedExercises: [
                {
                  id: '2m-oa12-g1',
                  title: 'Ejercicio Guiado: Elección de un Comité Escolar',
                  difficulty: 'Intermedio',
                  statement: 'De un curso de 10 estudiantes se debe elegir un comité representativo de 3 personas sin cargos específicos. ¿Cuántos comités distintos se pueden formar?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar técnica combinatoria',
                      description: 'Como no hay cargos ni jerarquía, el orden no importa $\\implies$ Combinación $\\binom{10}{3}$.'
                    },
                    {
                      title: 'Paso 2: Calcular el valor combinatorio',
                      description: '$\\binom{10}{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = \\frac{720}{6} = 120$.'
                    }
                  ],
                  finalAnswer: '120 comités'
                }
              ],
              proposedWorksheets: [
                {
                  id: '2m-oa12-prop1',
                  title: 'Guía de Combinatoria y Probabilidades en Juegos',
                  estimatedTime: '35 minutos',
                  studentInstructions: 'Determina si el orden de los elementos es relevante antes de calcular.',
                  problems: [
                    {
                      number: 1,
                      statement: '¿De cuántas formas se pueden ordenar 4 libros diferentes en un estante?',
                      solution: '$4! = 4 \\times 3 \\times 2 \\times 1 = 24$ formas',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['2_medio'].ejes['probabilidad'].oas[2]?.questions || []
            }
          ]
        }
      ]
    },

    '3_medio_tp': {
      id: '3_medio_tp',
      name: '3° Medio TP',
      category: 'Técnico Profesional / Plan Común',
      badgeNumber: '3 (TP)',
      colorBadge: 'bg-amber-600 text-white',
      description: 'Educación financiera aplicada, función potencia, modelamiento geométrico 3D y toma de decisiones con inferencia estadística.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Toma de Decisiones y Finanzas',
          shortTitle: 'Finanzas y Economía',
          icon: '🔢',
          description: 'Modelar situaciones financieras con interés simple, compuesto, inflación y valor del dinero en el tiempo.',
          colorTheme: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            badge: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-600 to-indigo-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Matemática Financiera e Interés Compuesto',
              description: 'Tomar decisiones en situaciones financieras y económicas personales o comunitarias, a partir de modelos que consideren el interés simple y compuesto, el ahorro y la inflación.',
              materials: [
                {
                  id: '3m-oa01-mat1',
                  title: 'Presentación: El Poder del Interés Compuesto y la Inflación',
                  type: 'presentation',
                  tag: 'Educación Financiera',
                  readTime: '15 min',
                  summary: 'Fórmula $C_f = C_i(1+i)^n$, comparación contra el interés simple y efecto de la UF y la inflación.',
                  contentMarkdown: `### 💰 Interés Compuesto
$$C_f = C_i(1 + i)^n$$
- $C_f$: Capital final
- $C_i$: Capital inicial
- $i$: Tasa de interés por período
- $n$: Número de períodos de capitalización`
                }
              ],
              guidedExercises: [
                {
                  id: '3m-oa01-g1',
                  title: 'Ejercicio Guiado: Comparación de Depósitos a Plazo',
                  difficulty: 'Intermedio',
                  statement: 'Se depositan $\\$1.000.000$ a una tasa del $6\\%$ anual durante 3 años. Compara el capital final con interés simple versus interés compuesto.',
                  steps: [
                    {
                      title: 'Paso 1: Interés Simple',
                      description: '$C_f = C_i(1 + n \\cdot i) = 1.000.000(1 + 3(0.06)) = 1.000.000(1.18) = \\$1.180.000$.'
                    },
                    {
                      title: 'Paso 2: Interés Compuesto',
                      description: '$C_f = 1.000.000(1.06)^3 = 1.000.000(1.191016) = \\$1.191.016$.'
                    },
                    {
                      title: 'Paso 3: Ganancia Adicional',
                      description: 'El interés compuesto genera $\\$11.016$ adicionales debido a los intereses sobre intereses.'
                    }
                  ],
                  finalAnswer: 'Compuesto: $1.191.016 vs Simple: $1.180.000'
                }
              ],
              proposedWorksheets: [
                {
                  id: '3m-oa01-prop1',
                  title: 'Guía de Créditos, Ahorro y CAE',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Calcula tablas de amortización simplificadas.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el monto final de $\\$500.000$ al $4\\%$ trimestral durante 1 año con interés compuesto.',
                      solution: '$n=4$ trimestres. $C_f = 500.000(1.04)^4 = \\$584.929$.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['3_medio'].ejes['numeros'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Álgebra y Funciones',
          shortTitle: 'Álgebra y Funciones',
          icon: '📐',
          description: 'Función Potencia $f(x)=a \\cdot x^n$, análisis de ramas, dilatación, contracción y simetría en problemas reales.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 03',
              title: 'Función Potencia y Modelamiento',
              description: 'Modelar fenómenos o situaciones cotidianas mediante la función potencia $f(x)=a \\cdot x^n$, analizando su comportamiento según el signo de a y la paridad de n.',
              materials: [
                {
                  id: '3m-oa03-mat1',
                  title: 'Presentación: Curvas de la Función Potencia',
                  type: 'presentation',
                  tag: 'Funciones Avanzadas',
                  readTime: '15 min',
                  summary: 'Análisis de $n$ par (simetría par respecto al eje Y) y $n$ impar (simetría impar respecto al origen).',
                  contentMarkdown: `### ⚡ Función Potencia: $f(x) = a \\cdot x^n$
- **Si $n$ es par:** Gráfica tipo parábola. Simétrica respecto al eje Y: $f(-x) = f(x)$.
- **Si $n$ es impar:** Gráfica tipo silla de montar. Simétrica respecto al origen: $f(-x) = -f(x)$.`
                }
              ],
              guidedExercises: [
                {
                  id: '3m-oa03-g1',
                  title: 'Ejercicio Guiado: Volumen de un Tanque Cúbico',
                  difficulty: 'Básico',
                  statement: 'El volumen de un contenedor cúbico de arista $x$ está dado por $V(x) = x^3$. Si la arista se duplica, ¿por qué factor se multiplica el volumen?',
                  steps: [
                    {
                      title: 'Paso 1: Evaluar en 2x',
                      description: '$V(2x) = (2x)^3 = 2^3 \\cdot x^3 = 8x^3$.'
                    },
                    {
                      title: 'Paso 2: Conclusión de proporcionalidad cúbica',
                      description: 'El volumen se multiplica por 8 (efecto de la potencia 3).'
                    }
                  ],
                  finalAnswer: 'El volumen se multiplica por 8'
                }
              ],
              proposedWorksheets: [
                {
                  id: '3m-oa03-prop1',
                  title: 'Guía de Modelamiento con Función Potencia',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Grafica y determina dominio y recorrido.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Dada $f(x) = -3x^4$, determina su recorrido.',
                      solution: '$]-\\infty, 0]$ (números reales negativos y el cero).',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['3_medio'].ejes['algebra'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Geometría y Modelamiento 3D',
          shortTitle: 'Geometría 3D',
          icon: '📏',
          description: 'Modelamiento espacial y vectores tridimensionales en arquitectura, diseño y mecánica industrial.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 04',
              title: 'Vectores en el Espacio 3D',
              description: 'Diseñar y modelar formas espaciales tridimensionales usando vectores $\\vec{u} = (x, y, z)$ y producto escalar.',
              materials: [
                {
                  id: '3m-oa04-mat1',
                  title: 'Presentación: Vectores en $\\mathbb{R}^3$ y Producto Punto',
                  type: 'presentation',
                  tag: 'Vectores 3D',
                  readTime: '15 min',
                  summary: 'Módulo de un vector en 3D $|\\vec{u}| = \\sqrt{x^2+y^2+z^2}$ y producto escalar $\\vec{u} \\cdot \\vec{v}$.',
                  contentMarkdown: `### 🧭 Vectores en $\\mathbb{R}^3$
- **Módulo:** $|\\vec{v}| = \\sqrt{x^2 + y^2 + z^2}$
- **Producto Escalar:** $\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z$
- Si $\\vec{u} \\cdot \\vec{v} = 0 \\implies$ Los vectores son perpendiculares (ortogonales).`
                }
              ],
              guidedExercises: [
                {
                  id: '3m-oa04-g1',
                  title: 'Ejercicio Guiado: Comprobación de Perpendicularidad 3D',
                  difficulty: 'Intermedio',
                  statement: 'Determina si los vectores $\\vec{u} = (2, -3, 4)$ y $\\vec{v} = (6, 4, 0)$ son ortogonales.',
                  steps: [
                    {
                      title: 'Paso 1: Calcular el producto escalar',
                      description: '$\\vec{u} \\cdot \\vec{v} = (2)(6) + (-3)(4) + (4)(0) = 12 - 12 + 0 = 0$.'
                    },
                    {
                      title: 'Paso 2: Conclusión',
                      description: 'Como el producto escalar es 0, los vectores forman un ángulo de $90^\\circ$.'
                    }
                  ],
                  finalAnswer: 'Sí, son ortogonales (perpendiculares)'
                }
              ],
              proposedWorksheets: [
                {
                  id: '3m-oa04-prop1',
                  title: 'Guía de Vectores en el Espacio Tridimensional',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Calcula módulos y ángulos entre vectores.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Calcula el módulo de $\\vec{w} = (2, 3, 6)$.',
                      solution: '$|\\vec{w}| = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['3_medio'].ejes['geometria'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Inferencia y Probabilidad',
          shortTitle: 'Inferencia y Probabilidad',
          icon: '📊',
          description: 'Toma de decisiones fundamentadas utilizando probabilidad condicional y el Teorema de Bayes.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 02',
              title: 'Inferencia y Teorema de Bayes',
              description: 'Tomar decisiones en situaciones de incerteza utilizando el teorema de Bayes y la probabilidad total en contextos médicos, legales y tecnológicos.',
              materials: [
                {
                  id: '3m-oa02-mat1',
                  title: 'Presentación: Teorema de Bayes y Árboles de Decisión',
                  type: 'presentation',
                  tag: 'Inferencia Estadística',
                  readTime: '15 min',
                  summary: 'Cálculo de probabilidades a posteriori en pruebas de detección de fallas y medicina.',
                  contentMarkdown: `### 🎯 Teorema de Bayes
$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$`
                }
              ],
              guidedExercises: [
                {
                  id: '3m-oa02-g1',
                  title: 'Ejercicio Guiado: Detección de Piezas Defectuosas en una Fábrica',
                  difficulty: 'Avanzado',
                  statement: 'La máquina A produce el $60\\%$ de las piezas con $2\\%$ de defectos. La máquina B produce el $40\\%$ con $5\\%$ de defectos. Si una pieza es defectuosa, ¿cuál es la probabilidad de que haya sido fabricada por la máquina B?',
                  steps: [
                    {
                      title: 'Paso 1: Probabilidad total de defecto',
                      description: '$P(D) = (0.60)(0.02) + (0.40)(0.05) = 0.012 + 0.020 = 0.032$.'
                    },
                    {
                      title: 'Paso 2: Aplicar Bayes',
                      description: '$P(B|D) = \\frac{(0.05)(0.40)}{0.032} = \\frac{0.020}{0.032} = \\frac{20}{32} = 0.625 = 62.5\\%$.'
                    }
                  ],
                  finalAnswer: '62.5%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '3m-oa02-prop1',
                  title: 'Guía de Inferencia y Probabilidad Bayesiana',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Construye el árbol de probabilidad completo antes de calcular.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Explica por qué la prevalencia afecta el resultado de una prueba médica.',
                      solution: 'Una baja prevalencia hace que los falsos positivos superen a los verdaderos positivos.',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['3_medio'].ejes['probabilidad'].oas[0]?.questions || []
            }
          ]
        }
      ]
    },

    '4_medio_tp': {
      id: '4_medio_tp',
      name: '4° Medio TP',
      category: 'Técnico Profesional / Plan Común',
      badgeNumber: '4 (TP)',
      colorBadge: 'bg-rose-600 text-white',
      description: 'Modelamiento económico y crédito (CAE), funciones exponenciales y logarítmicas, optimización 3D y distribución normal.',
      units: [
        {
          id: 'unidad_1',
          unitNumber: 1,
          axisKey: 'numeros',
          title: 'Unidad 1: Modelamiento Económico y Crédito',
          shortTitle: 'Créditos y Amortización',
          icon: '🔢',
          description: 'Evaluar críticamente información económica, tasas de interés, CAE, amortizaciones y endeudamiento responsable.',
          colorTheme: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            badge: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-600 to-indigo-700',
          },
          oas: [
            {
              oaId: 'OA 01',
              title: 'Evaluación Crítica de Créditos y CAE',
              description: 'Fundamentar decisiones financieras en la vida diaria considerando la Carga Anual Equivalente (CAE) y el Costo Total del Crédito (CTC).',
              materials: [
                {
                  id: '4m-oa01-mat1',
                  title: 'Presentación: CAE, CTC y Sistemas de Amortización',
                  type: 'presentation',
                  tag: 'Finanzas Críticas',
                  readTime: '15 min',
                  summary: 'Análisis de la Carga Anual Equivalente y la trampa del pago mínimo en tarjetas de crédito.',
                  contentMarkdown: `### 💳 CAE y CTC
- **CTC (Costo Total del Crédito):** Suma total de todas las cuotas pagadas (Capital + Interés + Seguros + Gastos Notariales).
- **CAE (Carga Anual Equivalente):** Porcentaje estandarizado que refleja el costo real anual del crédito.`
                }
              ],
              guidedExercises: [
                {
                  id: '4m-oa01-g1',
                  title: 'Ejercicio Guiado: Comparación de Dos Ofertas de Crédito Automotriz',
                  difficulty: 'Intermedio',
                  statement: 'Banco A ofrece $\\$5.000.000$ en 36 cuotas de $\\$180.000$. Banco B ofrece el mismo monto en 36 cuotas de $\\$175.000$ con un gasto inicial de apertura de $\\$300.000$. ¿Cuál opción tiene menor Costo Total del Crédito (CTC)?',
                  steps: [
                    {
                      title: 'Paso 1: Calcular CTC Banco A',
                      description: '$\\text{CTC}_A = 36 \\cdot 180000 = \\$6.480.000$.'
                    },
                    {
                      title: 'Paso 2: Calcular CTC Banco B',
                      description: '$\\text{CTC}_B = (36 \\cdot 175000) + 300000 = 6.300.000 + 300000 = \\$6.600.000$.'
                    },
                    {
                      title: 'Paso 3: Conclusión',
                      description: 'El Banco A es más económico por $\\$120.000$ en el costo total.'
                    }
                  ],
                  finalAnswer: 'Banco A es más conveniente (CTC: $6.480.000)'
                }
              ],
              proposedWorksheets: [
                {
                  id: '4m-oa01-prop1',
                  title: 'Guía de Educación Financiera para Egresados',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Evalúa las opciones de financiamiento para estudios superiores y emprendimientos.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si un crédito de $\\$2.000.000$ tiene un CTC de $\\$2.800.000$, ¿cuánto se pagó en intereses y gastos?',
                      solution: '$\\$2.800.000 - \\$2.000.000 = \\$800.000$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['4_medio'].ejes['numeros'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_2',
          unitNumber: 2,
          axisKey: 'algebra',
          title: 'Unidad 2: Función Potencia (OA 3)',
          shortTitle: 'Función Potencia y Modelamiento',
          icon: '⚡',
          description: 'Modelar fenómenos con función potencia: análisis de exponentes pares/impares, constantes de proporcionalidad, restricciones de dominio e indeterminación matemática.',
          colorTheme: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            gradient: 'from-emerald-600 to-teal-700',
          },
          oas: [
            {
              oaId: 'OA 03',
              title: 'OA 3: Modelar fenómenos con función potencia (4° Medio C - Don Bosco)',
              description: 'Evaluación oficial Don Bosco Antofagasta: Comportamiento gráfico con exponente par/impar, cuadrantes, cálculo de constante en bombas de extracción y vaciado de estanques.',
              materials: [
                {
                  id: '4m-oa03-mat1',
                  title: 'Presentación: Crecimiento y Decaimiento Exponencial',
                  type: 'presentation',
                  tag: 'Modelamiento Continuo',
                  readTime: '15 min',
                  summary: 'Modelo $N(t) = N_0 \\cdot e^{kt}$ y escala logarítmica de decibeles $B = 10 \\log\\left(\\frac{I}{I_0}\\right)$.',
                  contentMarkdown: `### 📈 Modelos Exponenciales
$$N(t) = N_0 \\cdot e^{kt}$$
- $k > 0 \\implies$ Crecimiento exponencial.
- $k < 0 \\implies$ Decaimiento exponencial.`
                }
              ],
              guidedExercises: [
                {
                  id: '4m-oa03-g1',
                  title: 'Ejercicio Guiado: Cultivo de Bacterias',
                  difficulty: 'Intermedio',
                  statement: 'Un cultivo de bacterias se duplica cada 3 horas. Si inicialmente hay 500 bacterias, ¿cuántas habrá después de 12 horas?',
                  steps: [
                    {
                      title: 'Paso 1: Número de ciclos de duplicación',
                      description: '$n = \\frac{12}{3} = 4$ ciclos de duplicación.'
                    },
                    {
                      title: 'Paso 2: Aplicar la fórmula de crecimiento',
                      description: '$N = 500 \\cdot 2^4 = 500 \\cdot 16 = 8000\\text{ bacterias}$.'
                    }
                  ],
                  finalAnswer: '8.000 bacterias'
                }
              ],
              proposedWorksheets: [
                {
                  id: '4m-oa03-prop1',
                  title: 'Guía de Aplicaciones Exponenciales y Logarítmicas',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Resuelve usando logaritmos naturales cuando sea necesario.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Una sustancia radiactiva decae según $M(t) = 100 \\cdot (0.5)^t$ donde $t$ son días. ¿Cuánto queda tras 3 días?',
                      solution: '$M(3) = 100 \\cdot (0.5)^3 = 100 \\cdot 0.125 = 12.5\\text{ gramos}$',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['4_medio'].ejes['algebra'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_3',
          unitNumber: 3,
          axisKey: 'geometria',
          title: 'Unidad 3: Optimización y Espacio 3D',
          shortTitle: 'Optimización 3D',
          icon: '📏',
          description: 'Resolver problemas de optimización de área superficial y volumen en cuerpos geométricos 3D.',
          colorTheme: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            gradient: 'from-amber-600 to-orange-700',
          },
          oas: [
            {
              oaId: 'OA 04',
              title: 'Optimización de Cuerpos 3D',
              description: 'Resolver problemas de optimización geométrica y embalaje maximizando volumen o minimizando material de fabricación.',
              materials: [
                {
                  id: '4m-oa04-mat1',
                  title: 'Presentación: Principios de Optimización en Ingeniería y Envases',
                  type: 'presentation',
                  tag: 'Diseño Óptimo',
                  readTime: '15 min',
                  summary: 'Cilindros de volumen óptimo, cajas de cartón sin tapa y relación superficie-volumen.',
                  contentMarkdown: `### 📦 Optimización Geométrica
Buscar las dimensiones que maximizan el volumen $V$ o minimizan el área superficial $A$ bajo restricciones de costo o material.`
                }
              ],
              guidedExercises: [
                {
                  id: '4m-oa04-g1',
                  title: 'Ejercicio Guiado: Caja Abierta de Máximo Volumen',
                  difficulty: 'Avanzado',
                  statement: 'Se desea construir una caja sin tapa a partir de una lámina cuadrada de cartón de $24\\text{ cm}$ cortando cuadrados de lado $x$ en las cuatro esquinas. Expresa el volumen de la caja en función de $x$.',
                  steps: [
                    {
                      title: 'Paso 1: Identificar dimensiones de la base y altura',
                      description: 'Largo $= 24 - 2x$, Ancho $= 24 - 2x$, Altura $= x$.'
                    },
                    {
                      title: 'Paso 2: Expresión del volumen',
                      description: '$V(x) = x(24 - 2x)^2 = x(576 - 96x + 4x^2) = 4x^3 - 96x^2 + 576x$.'
                    }
                  ],
                  finalAnswer: 'V(x) = 4x³ - 96x² + 576x'
                }
              ],
              proposedWorksheets: [
                {
                  id: '4m-oa04-prop1',
                  title: 'Guía de Optimización de Envases Industriales',
                  estimatedTime: '40 minutos',
                  studentInstructions: 'Modela la función objetivo para cada problema de producción.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Para un cilindro con volumen $V$, ¿cuándo se minimiza el área superficial?',
                      solution: 'Cuando la altura es igual al diámetro ($h = 2r$).',
                      points: 4
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['4_medio'].ejes['geometria'].oas[0]?.questions || []
            }
          ]
        },
        {
          id: 'unidad_4',
          unitNumber: 4,
          axisKey: 'probabilidad',
          title: 'Unidad 4: Distribuciones e Inferencia',
          shortTitle: 'Distribución Normal e Inferencia',
          icon: '📊',
          description: 'Modelar situaciones de incertidumbre mediante Distribución Binomial y Distribución Normal e intervalos de confianza.',
          colorTheme: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            badge: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-600 to-indigo-800',
          },
          oas: [
            {
              oaId: 'OA 02',
              title: 'Distribución Normal y Campana de Gauss',
              description: 'Modelar fenómenos aleatorios usando la distribución normal $N(\\mu, \\sigma)$ y calcular probabilidades estandarizadas con la variable Z.',
              materials: [
                {
                  id: '4m-oa02-mat1',
                  title: 'Presentación: La Campana de Gauss y Estandarización Z',
                  type: 'presentation',
                  tag: 'Estadística Inferencial',
                  readTime: '15 min',
                  summary: 'Fórmula de estandarización $Z = \\frac{X - \\mu}{\\sigma}$, regla empírica 68-95-99.7% y uso de tablas.',
                  contentMarkdown: `### 🔔 Distribución Normal: $X \\sim N(\\mu, \\sigma)$
- **Regla 68-95-99.7%:**
  * $[\mu - \sigma, \mu + \sigma] \implies 68.2\%$ de los datos.
  * $[\mu - 2\sigma, \mu + 2\sigma] \implies 95.4\%$ de los datos.
  * $[\mu - 3\sigma, \mu + 3\sigma] \implies 99.7\%$ de los datos.
- **Estandarización Z:** $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$.`
                }
              ],
              guidedExercises: [
                {
                  id: '4m-oa02-g1',
                  title: 'Ejercicio Guiado: Puntajes en una Prueba Nacional',
                  difficulty: 'Intermedio',
                  statement: 'Los puntajes de una prueba se distribuyen normalmente con media $\\mu = 500$ puntos y desviación estándar $\\sigma = 100$ puntos. ¿Qué porcentaje de estudiantes obtiene entre 400 y 600 puntos?',
                  steps: [
                    {
                      title: 'Paso 1: Identificar el intervalo',
                      description: '$400 = \\mu - 1\\sigma$ y $600 = \\mu + 1\\sigma$.'
                    },
                    {
                      title: 'Paso 2: Aplicar la regla empírica normal',
                      description: 'El área bajo la curva normal entre $\\pm 1$ desviación estándar corresponde aproximadamente al $68.26\\%$.'
                    }
                  ],
                  finalAnswer: 'Aproximadamente 68.3%'
                }
              ],
              proposedWorksheets: [
                {
                  id: '4m-oa02-prop1',
                  title: 'Guía de Estandarización Normal y Control de Calidad',
                  estimatedTime: '45 minutos',
                  studentInstructions: 'Calcula los valores Z correspondientes a cada situación.',
                  problems: [
                    {
                      number: 1,
                      statement: 'Si $\\mu = 50$ y $\\sigma = 5$, calcula el valor $Z$ para $X = 62$.',
                      solution: '$Z = \\frac{62 - 50}{5} = \\frac{12}{5} = 2.4$',
                      points: 3
                    }
                  ]
                }
              ],
              questions: CURRICULUM_COMPLETO_MINEDUC['4_medio'].ejes['probabilidad'].oas[0]?.questions || []
            }
          ]
        }
      ]
    }
  };

  // Helper to generate rich pedagogical resources for any OA
  const createDefaultOAResource = (
    courseKey: string,
    axisKey: string,
    oaItem: { id: string; code: string; desc: string; indicadores?: string[]; questions?: Question[] }
  ): OAResources => {
    // Generate clean title
    let title = oaItem.desc;
    if (title.length > 65) {
      const parts = title.split(/[:,–—\.]/);
      title = (parts[0] && parts[0].length > 10 ? parts[0] : title.slice(0, 60)).trim();
    }

    const matId = `${courseKey}-${oaItem.id.toLowerCase().replace(/\s+/g, '')}`;
    const cleanIndicators = oaItem.indicadores?.join('\n- ') || 'Desarrollo de habilidades y resolución de problemas según Bases Curriculares.';

    return {
      oaId: oaItem.id,
      title: title,
      description: oaItem.desc,
      materials: [
        {
          id: `${matId}-mat1`,
          title: `Presentación y Fundamentos: ${oaItem.id} (${oaItem.code})`,
          type: 'presentation',
          tag: oaItem.id,
          readTime: '15 min',
          summary: `Marco conceptual, definiciones clave e indicadores de evaluación oficial MINEDUC para ${oaItem.id}.`,
          contentMarkdown: `### 🎯 Objetivo de Aprendizaje: ${oaItem.id} (${oaItem.code})
**Descripción Oficial:**
> ${oaItem.desc}

---

### 📌 Indicadores de Evaluación Clave:
- ${cleanIndicators}

---

### 💡 Habilidades y Procedimientos:
1. **Modelar y Representar:** Traducir situaciones contextuales a modelos matemáticos precisos.
2. **Argumentar y Comunicar:** Fundamentar el procedimiento y verificar la validez del resultado.
3. **Resolución de Problemas:** Aplicar estrategias sistemáticas para resolver problemas rutinarios y no rutinarios.`
        },
        {
          id: `${matId}-mat2`,
          title: `Resumen Teórico y Formulario: ${oaItem.id}`,
          type: 'formula_sheet',
          tag: 'Formulario',
          readTime: '10 min',
          summary: `Fórmulas, propiedades y criterios fundamentales para el dominio de ${oaItem.id}.`,
          contentMarkdown: `### 📐 Resumen y Propiedades Clave (${oaItem.code})
- **Eje Curricular:** ${axisKey.toUpperCase()}
- **Nivel:** ${courseKey.replace('_', ' ').toUpperCase()}
- **Criterios de Éxito:** Comprensión conceptual, cálculo procedimental y aplicación en contextos reales.`
        }
      ],
      guidedExercises: [
        {
          id: `${matId}-g1`,
          title: `Ejercicio Guiado: Aplicación Práctica de ${oaItem.id}`,
          difficulty: 'Intermedio',
          statement: `Analiza la situación contextual y resuelve el problema correspondiente a ${oaItem.id}: "${oaItem.desc.slice(0, 100)}..."`,
          steps: [
            {
              title: 'Paso 1: Identificación de datos y variables',
              description: 'Extraemos las cantidades conocidas y definimos la incógnita o variable de interés.',
              pedagogicalTip: 'Subraya los datos numéricos y verifica las unidades de medida.'
            },
            {
              title: 'Paso 2: Planteamiento del modelo o ecuación matemática',
              description: 'Aplicamos la definición y propiedades correspondientes al objetivo de aprendizaje.',
              mathExpression: '\\text{Modelo: } f(x) \\text{ o expresión correspondiente}'
            },
            {
              title: 'Paso 3: Resolución sistemática y comprobación',
              description: 'Despejamos el resultado y validamos su pertinencia en el contexto del problema.',
              pedagogicalTip: 'Siempre verifica si la respuesta tiene sentido en el contexto real.'
            }
          ],
          finalAnswer: 'Resultado verificado según procedimiento oficial.'
        }
      ],
      proposedWorksheets: [
        {
          id: `${matId}-prop1`,
          title: `Guía de Ejercitación Formativa (${oaItem.id})`,
          estimatedTime: '40 minutos',
          studentInstructions: 'Resuelve cada ejercicio detallando tu desarrollo paso a paso.',
          problems: [
            {
              number: 1,
              statement: `Aplica los conceptos de ${oaItem.id} para resolver y justificar tu razonamiento matemático.`,
              solution: 'Desarrollo completo según criterios de evaluación MINEDUC.',
              points: 3
            },
            {
              number: 2,
              statement: `Resuelve el problema de aplicación contextual vinculado a: ${oaItem.desc.slice(0, 90)}...`,
              solution: 'Solución justificada con argumentación matemática.',
              points: 4
            }
          ]
        }
      ],
      questions: oaItem.questions || []
    };
  };

  // Synchronize and enrich all courses and units with 100% of MINEDUC OAs
  Object.keys(courses).forEach((courseId) => {
    const course = courses[courseId];
    const mineducKey = courseId === '3_medio_tp' ? '3_medio' : courseId === '4_medio_tp' ? '4_medio' : courseId;
    const mineducCourse = CURRICULUM_COMPLETO_MINEDUC[mineducKey];

    if (course && mineducCourse) {
      course.units.forEach((unit) => {
        const mineducAxis = mineducCourse.ejes[unit.axisKey];
        if (mineducAxis && mineducAxis.oas) {
          mineducAxis.oas.forEach((mineducOA) => {
            const existingOA = unit.oas.find(
              (o) => o.oaId.trim().toLowerCase() === mineducOA.id.trim().toLowerCase()
            );

            if (existingOA) {
              // Ensure questions are populated
              if ((!existingOA.questions || existingOA.questions.length === 0) && mineducOA.questions && mineducOA.questions.length > 0) {
                existingOA.questions = mineducOA.questions;
              }
            } else {
              // Add missing OA seamlessly
              const newOAResource = createDefaultOAResource(courseId, unit.axisKey, mineducOA);
              unit.oas.push(newOAResource);
            }
          });

          // Sort OAs numerically (e.g. OA 01, OA 02, OA 03...)
          unit.oas.sort((a, b) => {
            const numA = parseInt(a.oaId.replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(b.oaId.replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          });
        }
      });
    }
  });

  // Aliases for 3° Medio and 4° Medio general / TP
  courses['3_medio'] = courses['3_medio_tp'];
  courses['4_medio'] = courses['4_medio_tp'];

  return courses;
}

export const CURRICULUM_RECURSOS: Record<string, CourseCurriculumItem> = buildCurriculumResources();
