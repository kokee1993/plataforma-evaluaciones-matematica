import { Question } from '../types';
import * as svgs from './homoteciaSvgs';

// =========================================================================
// FORMA A (Forma 1) — 14 PREGUNTAS CON ALTERNATIVAS RANDOMIZADAS
// =========================================================================
export const HOMOTECIA_1MEDIO_FORMA_A: Question[] = [
  {
    id: 'db-homo-A-1',
    itemNumber: 1,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Qué característica geométrica presentan los lados homólogos (correspondientes) entre una figura original $ABC$ y su imagen homotética $A\'B\'C\'$ con razón $k = 2{,}5$?',
    options: [
      'Tienen exactamente la misma longitud independientemente de $k$',
      'Se cruzan perpendicularmente formando un ángulo de $90^\\circ$',
      'Son siempre paralelos entre sí ($A\'B\' \\parallel AB$)',
      'Son perpendiculares al centro de homotecia'
    ],
    correctAnswer: 2, // C
    explanation: 'En toda homotecia, los segmentos homólogos son siempre estrictamente paralelos entre sí ($A\'B\' \\parallel AB$).',
    hint: 'Observa la dirección y paralelismo de los lados homólogos.',
    topic: 'Propiedades de Lados Homólogos',
    grade: '1° Medio',
    svg: svgs.svgHomologousSides('2,5'),
  },
  {
    id: 'db-homo-A-2',
    itemNumber: 2,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si un lado $AB$ mide $8\\text{ cm}$ y se le aplica una homotecia de razón $k = 2{,}5$, ¿cuál es la longitud del lado resultante $A\'B\'$?',
    options: [
      '$10{,}5\\text{ cm}$',
      '$3{,}2\\text{ cm}$',
      '$16\\text{ cm}$',
      '$20\\text{ cm}$'
    ],
    correctAnswer: 3, // D
    explanation: 'La longitud homotética es $A\'B\' = |k| \\cdot AB = 2{,}5 \\cdot 8 = 20\\text{ cm}$.',
    hint: 'Calcula $8 \\cdot 2{,}5$.',
    topic: 'Cálculo de Longitudes Homólogas',
    grade: '1° Medio',
    svg: svgs.svgSideLength(8, 20, '2,5'),
  },
  {
    id: 'db-homo-A-3',
    itemNumber: 3,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En una homotecia de centro $O$, la distancia $OA$ mide $5\\text{ cm}$ y $OA\'$ mide $15\\text{ cm}$ (al mismo lado de $O$). El factor $k$ es:',
    options: [
      '$k = 3$',
      '$k = 0{,}33$',
      '$k = 10$',
      '$k = -3$'
    ],
    correctAnswer: 0, // A
    explanation: '$k = \\frac{OA\'}{OA} = \\frac{15}{5} = 3$.',
    hint: 'Divide $15 / 5$.',
    topic: 'Determinación de la Razón k',
    grade: '1° Medio',
    svg: svgs.svgCenterDistance(5, 15, 3),
  },
  {
    id: 'db-homo-A-4',
    itemNumber: 4,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Cuál de los siguientes valores de la razón $k$ indica que la figura resultante es una reducción y está al otro lado del centro $O$ (inversa)?',
    options: [
      '$k = 2$',
      '$k = 0{,}5$',
      '$k = -0{,}5$',
      '$k = -2$'
    ],
    correctAnswer: 2, // C
    explanation: 'Una reducción inversa ocurre cuando $-1 < k < 0$, lo que corresponde a $k = -0{,}5$.',
    hint: 'Busca un valor negativo de magnitud menor que 1.',
    topic: 'Homotecia Inversa y Reducción',
    grade: '1° Medio',
    svg: svgs.svgInverseReduction('-0,5'),
  },
  {
    id: 'db-homo-A-5',
    itemNumber: 5,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Un triángulo tiene ángulos interiores de $40^\\circ$, $60^\\circ$ y $80^\\circ$. Si se aplica una homotecia de razón $k = 3$, ¿cuánto miden los nuevos ángulos?',
    options: [
      '$120^\\circ$, $180^\\circ$ y $240^\\circ$',
      '$13{,}3^\\circ$, $20^\\circ$ y $26{,}7^\\circ$',
      '$70^\\circ$, $90^\\circ$ y $110^\\circ$',
      '$40^\\circ$, $60^\\circ$ y $80^\\circ$'
    ],
    correctAnswer: 3, // D
    explanation: 'La homotecia conserva los ángulos correspondientes (es una transformación conforme). Los ángulos permanecen iguales.',
    hint: 'Las homotecias conservan la forma y por lo tanto sus ángulos interiores.',
    topic: 'Conservación de Ángulos',
    grade: '1° Medio',
    svg: svgs.svgAnglePreservation(40, 60, 80),
  },
  {
    id: 'db-homo-A-6',
    itemNumber: 6,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El área de un rectángulo original es de $10\\text{ cm}^2$. Si se aplica una homotecia con razón $k = 3$, ¿cuál será el área de la nueva figura?',
    options: [
      '$30\\text{ cm}^2$',
      '$13\\text{ cm}^2$',
      '$90\\text{ cm}^2$',
      '$100\\text{ cm}^2$'
    ],
    correctAnswer: 2, // C
    explanation: '$\\text{Área}\' = k^2 \\cdot \\text{Área} = 3^2 \\cdot 10 = 9 \\cdot 10 = 90\\text{ cm}^2$.',
    hint: 'Multiplica por $k^2 = 9$.',
    topic: 'Variación de Áreas en Homotecia',
    grade: '1° Medio',
    svg: svgs.svgAreaVariation(10, 90, 3),
  },
  {
    id: 'db-homo-A-7',
    itemNumber: 7,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El perímetro de un polígono es $28\\text{ cm}$. Si se le aplica una homotecia con razón $k = -2$, ¿cuál es el perímetro del polígono resultante?',
    options: [
      '$56\\text{ cm}$',
      '$-56\\text{ cm}$',
      '$14\\text{ cm}$',
      '$26\\text{ cm}$'
    ],
    correctAnswer: 0, // A
    explanation: 'El perímetro es una magnitud física geométrica (longitud) siempre positiva: $P\' = |k| \\cdot P = |-2| \\cdot 28 = 2 \\cdot 28 = 56\\text{ cm}$.',
    hint: 'Usa el valor absoluto $|-2| = 2$.',
    topic: 'Variación del Perímetro',
    grade: '1° Medio',
    svg: svgs.svgPerimeterNegative(28, 56, -2),
  },
  {
    id: 'db-homo-A-8',
    itemNumber: 8,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si en una homotecia la razón es $k = -1$, la figura resultante es congruente a la original y el centro $O$ actúa como:',
    options: [
      'Eje de simetría axial reflexiva',
      'Centro de dilatación sin giro',
      'Centro de simetría central (rotación de $180^\\circ$)',
      'Vértice de traslación perpendicular'
    ],
    correctAnswer: 2, // C
    explanation: 'Una homotecia de razón $k = -1$ equivale exactamente a una simetría central o rotación de $180^\\circ$ respecto a $O$.',
    hint: 'Invierte la orientación a través del centro conservando el tamaño.',
    topic: 'Caso Especial k = -1 (Simetría Central)',
    grade: '1° Medio',
    svg: svgs.svgCentralSymmetry(),
  },
  {
    id: 'db-homo-A-9',
    itemNumber: 9,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Se sabe que una figura homotética tiene una razón $k = 2$ respecto a su original. Si la distancia del centro $O$ a un punto imagen $A\'$ es $OA\' = 10\\text{ cm}$, ¿cuánto medía la distancia original $OA$?',
    options: [
      '$20\\text{ cm}$',
      '$8\\text{ cm}$',
      '$12\\text{ cm}$',
      '$5\\text{ cm}$'
    ],
    correctAnswer: 3, // D
    explanation: '$OA = \\frac{OA\'}{k} = \\frac{10}{2} = 5\\text{ cm}$.',
    hint: 'Despeja $OA = OA\' / k$.',
    topic: 'Cálculo de Distancia Original',
    grade: '1° Medio',
    svg: svgs.svgReverseDistance(5, 10, 2),
  },
  {
    id: 'db-homo-A-10',
    itemNumber: 10,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En óptica, la formación de imágenes en una cámara oscura o en el ojo humano proyecta una imagen invertida y reducida. Este fenómeno se modela geométricamente como:',
    options: [
      'Una homotecia inversa con $k$ negativo ($-1 < k < 0$)',
      'Una homotecia directa con $k > 1$',
      'Una traslación isométrica lineal',
      'Una reflexión axial sobre un plano'
    ],
    correctAnswer: 0, // A
    explanation: 'La cámara oscura cruza los rayos en el orificio (centro $O$), produciendo una imagen invertida ($k < 0$) y reducida ($|k| < 1$).',
    hint: 'Invertida significa signo negativo y reducida magnitud menor a 1.',
    topic: 'Modelamiento Óptico en Cámara Oscura',
    grade: '1° Medio',
    svg: svgs.svgCameraObscura(),
  },
  {
    id: 'db-homo-A-11',
    itemNumber: 11,
    itemType: 'development',
    points: 4,
    text: 'Cálculo de Segmentos Homólogos y Distancias desde el Centro (Forma A):\nUn triángulo $ABC$ tiene lados $AB = 4\\text{ cm}$, $BC = 5\\text{ cm}$, $CA = 6\\text{ cm}$ y distancia al centro $OA = 4\\text{ cm}$. Se aplica una homotecia de centro $O$ y razón $k = 3$.\n\nI) Calcule la longitud de $A\'B\'$, $B\'C\'$ y $C\'A\'$.\nII) Calcule la distancia $OA\'$ desde el centro $O$ al vértice $A\'$.\nIII) Calcule el perímetro del triángulo original y del resultante.',
    options: [
      'I) A\'B\'=7 cm, B\'C\'=8 cm, C\'A\'=9 cm; II) OA\'=7 cm; III) P=15 cm, P\'=24 cm',
      'I) A\'B\'=12 cm, B\'C\'=15 cm, C\'A\'=18 cm; II) OA\'=12 cm; III) P=15 cm, P\'=45 cm',
      'I) A\'B\'=16 cm, B\'C\'=20 cm, C\'A\'=24 cm; II) OA\'=16 cm; III) P=15 cm, P\'=60 cm',
      'I) A\'B\'=12 cm, B\'C\'=15 cm, C\'A\'=18 cm; II) OA\'=4 cm; III) P=15 cm, P\'=135 cm'
    ],
    correctAnswer: 1, // B
    explanation: 'I) Lados: $4 \\cdot 3 = 12\\text{ cm}$, $5 \\cdot 3 = 15\\text{ cm}$, $6 \\cdot 3 = 18\\text{ cm}$.\nII) $OA\' = 3 \\cdot 4 = 12\\text{ cm}$.\nIII) $P = 4+5+6 = 15\\text{ cm}$, $P\' = 3 \\cdot 15 = 45\\text{ cm}$.',
    hint: 'Multiplica dimensiones lineales por $k=3$.',
    topic: 'Desarrollo: Segmentos y Distancias Homólogas',
    grade: '1° Medio',
    svg: svgs.svgTriangleDevelopment(4, 5, 6, 4, 3),
  },
  {
    id: 'db-homo-A-12',
    itemNumber: 12,
    itemType: 'development',
    points: 4,
    text: 'Variación de Área en Cuadriláteros Homotéticos (Forma A):\nUn cuadrado tiene lado $L = 5\\text{ cm}$ (Área original $= 25\\text{ cm}^2$). Se le aplica una homotecia de razón $k = 2$.\n\nI) Calcule la medida del nuevo lado $L\'$ del cuadrado resultante.\nII) Calcule la nueva área multiplicando los lados y aplicando la fórmula de homotecia.',
    options: [
      'I) L\' = 7 cm; II) Área\' = 50 cm²',
      'I) L\' = 10 cm; II) Área\' = 50 cm²',
      'I) L\' = 10 cm; II) Área\' = 100 cm²',
      'I) L\' = 25 cm; II) Área\' = 625 cm²'
    ],
    correctAnswer: 2, // C
    explanation: 'I) Lado $L\' = 2 \\cdot 5 = 10\\text{ cm}$.\nII) $\\text{Área}\' = 10^2 = 100\\text{ cm}^2$ ($2^2 \\cdot 25 = 100\\text{ cm}^2$).',
    hint: 'Lado se multiplica por 2; área por $2^2 = 4$.',
    topic: 'Desarrollo: Cuadriláteros y Escalamiento de Áreas',
    grade: '1° Medio',
    svg: svgs.svgSquareAreaDevelopment(5, 2),
  },
  {
    id: 'db-homo-A-13',
    itemNumber: 13,
    itemType: 'problem_solving',
    points: 4,
    text: 'Sombra Proyectada por una Escultura (Forma A):\nUna fuente de luz puntual en el suelo (centro $O$) ilumina una escultura de $1{,}5\\text{ m}$ de altura situada a $2\\text{ m}$ de distancia. La sombra se proyecta sobre una pared vertical situada a $6\\text{ m}$ de la fuente de luz.\n\nI) Determine la razón de homotecia directa $k$.\nII) ¿Cuál es la altura total de la sombra $h$ proyectada en la pared?',
    options: [
      'I) k = 4; II) Altura de la sombra h = 6,0 m',
      'I) k = 3; II) Altura de la sombra h = 3,0 m',
      'I) k = 2; II) Altura de la sombra h = 4,5 m',
      'I) k = 3; II) Altura de la sombra h = 4,5 m'
    ],
    correctAnswer: 3, // D
    explanation: 'I) $k = \\frac{6}{2} = 3$.\nII) Altura sombra: $h = 3 \\cdot 1{,}5 = 4{,}5\\text{ m}$.',
    hint: 'Calcula la razón de distancias $6/2 = 3$ y multiplica por la altura.',
    topic: 'Problemas: Proyección de Sombras y Fuentes de Luz',
    grade: '1° Medio',
    svg: svgs.svgShadowSculpture(1.5, 2, 6, 3),
  },
  {
    id: 'db-homo-A-14',
    itemNumber: 14,
    itemType: 'problem_solving',
    points: 4,
    text: 'Ampliación de un Plano a Escala (Forma A):\nUn plano rectangular mide $10\\text{ cm}$ de largo y $5\\text{ cm}$ de ancho. Se amplía fotocopiándolo con una razón de homotecia $k = 4$.\n\nI) ¿Cuáles son las nuevas dimensiones del plano ampliado (largo y ancho)?\nII) ¿Cuál es el área del plano ampliado en la fotocopia?',
    options: [
      'I) Largo = 14 cm, Ancho = 9 cm; II) Área = 126 cm²',
      'I) Largo = 40 cm, Ancho = 20 cm; II) Área = 800 cm²',
      'I) Largo = 40 cm, Ancho = 20 cm; II) Área = 200 cm²',
      'I) Largo = 20 cm, Ancho = 10 cm; II) Área = 400 cm²'
    ],
    correctAnswer: 1, // B
    explanation: 'I) Largo: $10 \\cdot 4 = 40\\text{ cm}$, Ancho: $5 \\cdot 4 = 20\\text{ cm}$.\nII) $\\text{Área}\' = 40 \\cdot 20 = 800\\text{ cm}^2$ ($4^2 \\cdot 50 = 800\\text{ cm}^2$).',
    hint: 'Multiplica dimensiones por 4 y luego calcula el producto.',
    topic: 'Problemas: Planos a Escala y Fotocopias',
    grade: '1° Medio',
    svg: svgs.svgFloorPlan(10, 5, 4),
  }
];
