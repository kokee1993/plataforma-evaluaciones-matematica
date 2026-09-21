import { Question } from '../types';
import * as svgs from './homoteciaSvgs';

// =========================================================================
// FORMA B (Forma 2) — 14 PREGUNTAS
// =========================================================================
export const HOMOTECIA_1MEDIO_FORMA_B: Question[] = [
  {
    id: 'db-homo-B-1',
    itemNumber: 1,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En una homotecia, ¿qué relación geométrica tienen siempre los lados correspondientes (homólogos) de la figura resultante con la original?',
    options: [
      'Son siempre paralelos entre sí ($A\'B\' \\parallel AB$)',
      'Son perpendiculares entre sí formando ángulos rectos',
      'Tienen siempre igual longitud',
      'Se intersectan en el centro de homotecia $O$'
    ],
    correctAnswer: 0, // A
    explanation: 'En toda homotecia, los lados homólogos son estrictamente paralelos entre sí.',
    hint: 'Verifica la propiedad angular de paralelismo.',
    topic: 'Propiedades de Lados Homólogos',
    grade: '1° Medio',
    svg: svgs.svgHomologousSides('2,5'),
  },
  {
    id: 'db-homo-B-2',
    itemNumber: 2,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si un lado $AB$ mide $6\\text{ cm}$ y se le aplica una homotecia de razón $k = 2{,}5$, ¿cuál es la longitud del lado resultante $A\'B\'$?',
    options: [
      '$8{,}5\\text{ cm}$',
      '$2{,}4\\text{ cm}$',
      '$15\\text{ cm}$',
      '$12\\text{ cm}$'
    ],
    correctAnswer: 2, // C
    explanation: '$A\'B\' = |k| \\cdot AB = 2{,}5 \\cdot 6 = 15\\text{ cm}$.',
    hint: 'Calcula $6 \\cdot 2{,}5$.',
    topic: 'Cálculo de Longitudes Homólogas',
    grade: '1° Medio',
    svg: svgs.svgSideLength(6, 15, '2,5'),
  },
  {
    id: 'db-homo-B-3',
    itemNumber: 3,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En una homotecia de centro $O$, la distancia $OA$ mide $4\\text{ cm}$ y $OA\'$ mide $12\\text{ cm}$ (al mismo lado de $O$). El factor $k$ es:',
    options: [
      '$k = 0{,}33$',
      '$k = 3$',
      '$k = 8$',
      '$k = -3$'
    ],
    correctAnswer: 1, // B
    explanation: '$k = \\frac{OA\'}{OA} = \\frac{12}{4} = 3$.',
    hint: 'Calcula $12 / 4$.',
    topic: 'Determinación de la Razón k',
    grade: '1° Medio',
    svg: svgs.svgCenterDistance(4, 12, 3),
  },
  {
    id: 'db-homo-B-4',
    itemNumber: 4,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Cuál de los siguientes valores de la razón $k$ indica que la figura resultante es una reducción inversa?',
    options: [
      '$k = -0{,}4$',
      '$k = 2{,}5$',
      '$k = 0{,}4$',
      '$k = -2{,}5$'
    ],
    correctAnswer: 0, // A
    explanation: 'Una reducción inversa requiere $-1 < k < 0$, lo que corresponde a $k = -0{,}4$.',
    hint: 'Busca un número negativo comprendido entre 0 y -1.',
    topic: 'Homotecia Inversa y Reducción',
    grade: '1° Medio',
    svg: svgs.svgInverseReduction('-0,4'),
  },
  {
    id: 'db-homo-B-5',
    itemNumber: 5,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Un triángulo tiene ángulos interiores de $30^\\circ$, $70^\\circ$ y $80^\\circ$. Si se aplica una homotecia de razón $k = 3$, ¿cuánto miden los nuevos ángulos?',
    options: [
      '$90^\\circ$, $210^\\circ$ y $240^\\circ$',
      '$10^\\circ$, $23{,}3^\\circ$ y $26{,}7^\\circ$',
      '$30^\\circ$, $70^\\circ$ y $80^\\circ$',
      '$60^\\circ$, $100^\\circ$ y $110^\\circ$'
    ],
    correctAnswer: 2, // C
    explanation: 'La homotecia conserva invariantes los ángulos interiores correspondientes.',
    hint: 'Los ángulos homólogos no varían con la homotecia.',
    topic: 'Conservación de Ángulos',
    grade: '1° Medio',
    svg: svgs.svgAnglePreservation(30, 70, 80),
  },
  {
    id: 'db-homo-B-6',
    itemNumber: 6,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El área de un rectángulo original es de $8\\text{ cm}^2$. Si se aplica una homotecia con razón $k = 3$, ¿cuál será el área de la nueva figura?',
    options: [
      '$24\\text{ cm}^2$',
      '$11\\text{ cm}^2$',
      '$64\\text{ cm}^2$',
      '$72\\text{ cm}^2$'
    ],
    correctAnswer: 3, // D
    explanation: '$\\text{Área}\' = k^2 \\cdot \\text{Área} = 3^2 \\cdot 8 = 9 \\cdot 8 = 72\\text{ cm}^2$.',
    hint: 'Multiplica por $k^2 = 9$.',
    topic: 'Variación de Áreas en Homotecia',
    grade: '1° Medio',
    svg: svgs.svgAreaVariation(8, 72, 3),
  },
  {
    id: 'db-homo-B-7',
    itemNumber: 7,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El perímetro de un polígono es $24\\text{ cm}$. Si se le aplica una homotecia con razón $k = -2$, ¿cuál es el perímetro del polígono resultante?',
    options: [
      '$-48\\text{ cm}$',
      '$48\\text{ cm}$',
      '$12\\text{ cm}$',
      '$22\\text{ cm}$'
    ],
    correctAnswer: 1, // B
    explanation: '$P\' = |-2| \\cdot 24 = 2 \\cdot 24 = 48\\text{ cm}$. El perímetro es siempre positivo.',
    hint: 'Aplica el valor absoluto $|-2| = 2$.',
    topic: 'Variación del Perímetro',
    grade: '1° Medio',
    svg: svgs.svgPerimeterNegative(24, 48, -2),
  },
  {
    id: 'db-homo-B-8',
    itemNumber: 8,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si en una homotecia la razón es $k = -1$, la figura resultante es congruente a la original y el centro $O$ actúa como:',
    options: [
      'Punto de fuga asimétrico',
      'Eje de reflexión paralela',
      'Origen de traslación horizontal',
      'Centro de simetría central (rotación de $180^\\circ$)'
    ],
    correctAnswer: 3, // D
    explanation: 'Una homotecia de razón $k = -1$ produce una rotación geométrica de $180^\\circ$ respecto a $O$.',
    hint: 'Es una simetría respecto a un punto central.',
    topic: 'Caso Especial k = -1 (Simetría Central)',
    grade: '1° Medio',
    svg: svgs.svgCentralSymmetry(),
  },
  {
    id: 'db-homo-B-9',
    itemNumber: 9,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Se sabe que una figura homotética tiene una razón $k = 2$. Si la distancia del centro $O$ al punto imagen $A\'$ es $OA\' = 12\\text{ cm}$, ¿cuánto medía la distancia original $OA$?',
    options: [
      '$6\\text{ cm}$',
      '$24\\text{ cm}$',
      '$10\\text{ cm}$',
      '$14\\text{ cm}$'
    ],
    correctAnswer: 0, // A
    explanation: '$OA = \\frac{12}{2} = 6\\text{ cm}$.',
    hint: 'Divide $12 / 2$.',
    topic: 'Cálculo de Distancia Original',
    grade: '1° Medio',
    svg: svgs.svgReverseDistance(6, 12, 2),
  },
  {
    id: 'db-homo-B-10',
    itemNumber: 10,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En óptica, la formación de imágenes en una cámara estenopeica o en el ojo humano proyecta una imagen invertida y reducida. Geométricamente esto corresponde a:',
    options: [
      'Una homotecia directa con $k > 1$',
      'Una reflexión respecto a una recta',
      'Una homotecia inversa con razón $-1 < k < 0$',
      'Una traslación con escala unitaria'
    ],
    correctAnswer: 2, // C
    explanation: 'El orificio invierte los rayos proyectando una imagen reducida ($-1 < k < 0$).',
    hint: 'La inversión geométrica indica razón negativa con magnitud menor que 1.',
    topic: 'Modelamiento Óptico en Cámara Oscura',
    grade: '1° Medio',
    svg: svgs.svgCameraObscura(),
  },
  {
    id: 'db-homo-B-11',
    itemNumber: 11,
    itemType: 'development',
    points: 4,
    text: 'Cálculo de Segmentos Homólogos y Distancias desde el Centro (Forma B):\nUn triángulo $ABC$ tiene lados $AB = 3\\text{ cm}$, $BC = 5\\text{ cm}$, $CA = 6\\text{ cm}$ y distancia al centro $OA = 5\\text{ cm}$. Se aplica una homotecia de centro $O$ y razón $k = 3$.\n\nI) Calcule la longitud de $A\'B\'$, $B\'C\'$ y $C\'A\'$.\nII) Calcule la distancia $OA\'$ desde el centro $O$ al vértice $A\'$.\nIII) Calcule el perímetro del triángulo original y del resultante.',
    options: [
      'I) A\'B\'=6 cm, B\'C\'=10 cm, C\'A\'=12 cm; II) OA\'=10 cm; III) P=14 cm, P\'=28 cm',
      'I) A\'B\'=9 cm, B\'C\'=15 cm, C\'A\'=18 cm; II) OA\'=5 cm; III) P=14 cm, P\'=126 cm',
      'I) A\'B\'=12 cm, B\'C\'=20 cm, C\'A\'=24 cm; II) OA\'=15 cm; III) P=14 cm, P\'=56 cm',
      'I) A\'B\'=9 cm, B\'C\'=15 cm, C\'A\'=18 cm; II) OA\'=15 cm; III) P=14 cm, P\'=42 cm'
    ],
    correctAnswer: 3, // D
    explanation: 'I) Lados: $3 \\cdot 3 = 9\\text{ cm}$, $5 \\cdot 3 = 15\\text{ cm}$, $6 \\cdot 3 = 18\\text{ cm}$.\nII) $OA\' = 3 \\cdot 5 = 15\\text{ cm}$.\nIII) $P = 3+5+6 = 14\\text{ cm}$, $P\' = 3 \\cdot 14 = 42\\text{ cm}$.',
    hint: 'Multiplica los lados por $k=3$ y suma.',
    topic: 'Desarrollo: Segmentos y Distancias Homólogas',
    grade: '1° Medio',
    svg: svgs.svgTriangleDevelopment(3, 5, 6, 5, 3),
  },
  {
    id: 'db-homo-B-12',
    itemNumber: 12,
    itemType: 'development',
    points: 4,
    text: 'Variación de Área en Cuadriláteros Homotéticos (Forma B):\nUn cuadrado tiene lado $L = 6\\text{ cm}$ (Área original $= 36\\text{ cm}^2$). Se le aplica una homotecia de razón $k = 2$.\n\nI) Calcule la medida del nuevo lado $L\'$ del cuadrado resultante.\nII) Calcule la nueva área multiplicando los lados y aplicando la fórmula de homotecia.',
    options: [
      'I) L\' = 8 cm; II) Área\' = 72 cm²',
      'I) L\' = 12 cm; II) Área\' = 144 cm²',
      'I) L\' = 12 cm; II) Área\' = 72 cm²',
      'I) L\' = 36 cm; II) Área\' = 1296 cm²'
    ],
    correctAnswer: 1, // B
    explanation: 'I) $L\' = 2 \\cdot 6 = 12\\text{ cm}$.\nII) $\\text{Área}\' = 12^2 = 144\\text{ cm}^2$ ($2^2 \\cdot 36 = 144\\text{ cm}^2$).',
    hint: 'Lado se duplica; área se cuadruplica ($k^2 = 4$).',
    topic: 'Desarrollo: Cuadriláteros y Escalamiento de Áreas',
    grade: '1° Medio',
    svg: svgs.svgSquareAreaDevelopment(6, 2),
  },
  {
    id: 'db-homo-B-13',
    itemNumber: 13,
    itemType: 'problem_solving',
    points: 4,
    text: 'Sombra Proyectada por una Escultura (Forma B):\nUna fuente de luz puntual en el suelo (centro $O$) ilumina una escultura de $1{,}2\\text{ m}$ de altura situada a $2\\text{ m}$ de distancia. La sombra se proyecta sobre una pared vertical situada a $6\\text{ m}$ de la fuente de luz.\n\nI) Determine la razón de homotecia directa $k$.\nII) ¿Cuál es la altura total de la sombra $h$ proyectada en la pared?',
    options: [
      'I) k = 3; II) Altura de la sombra h = 3,6 m',
      'I) k = 4; II) Altura de la sombra h = 4,8 m',
      'I) k = 3; II) Altura de la sombra h = 2,4 m',
      'I) k = 2; II) Altura de la sombra h = 3,6 m'
    ],
    correctAnswer: 0, // A
    explanation: 'I) $k = \\frac{6}{2} = 3$.\nII) Sombra: $h = 3 \\cdot 1{,}2 = 3{,}6\\text{ m}$.',
    hint: 'Calcula $k = 6/2 = 3$ y multiplica por $1{,}2$.',
    topic: 'Problemas: Proyección de Sombras y Fuentes de Luz',
    grade: '1° Medio',
    svg: svgs.svgShadowSculpture(1.2, 2, 6, 3),
  },
  {
    id: 'db-homo-B-14',
    itemNumber: 14,
    itemType: 'problem_solving',
    points: 4,
    text: 'Ampliación de un Plano a Escala (Forma B):\nUn plano rectangular mide $8\\text{ cm}$ de largo y $5\\text{ cm}$ de ancho. Se amplía fotocopiándolo con una razón de homotecia $k = 4$.\n\nI) ¿Cuáles son las nuevas dimensiones del plano ampliado (largo y ancho)?\nII) ¿Cuál es el área del plano ampliado en la fotocopia?',
    options: [
      'I) Largo = 12 cm, Ancho = 9 cm; II) Área = 108 cm²',
      'I) Largo = 32 cm, Ancho = 20 cm; II) Área = 160 cm²',
      'I) Largo = 32 cm, Ancho = 20 cm; II) Área = 640 cm²',
      'I) Largo = 16 cm, Ancho = 10 cm; II) Área = 320 cm²'
    ],
    correctAnswer: 2, // C
    explanation: 'I) Largo: $4 \\cdot 8 = 32\\text{ cm}$, Ancho: $4 \\cdot 5 = 20\\text{ cm}$.\nII) $\\text{Área}\' = 32 \\cdot 20 = 640\\text{ cm}^2$ ($4^2 \\cdot 40 = 640\\text{ cm}^2$).',
    hint: 'Multiplica dimensiones por 4 y calcula el área.',
    topic: 'Problemas: Planos a Escala y Fotocopias',
    grade: '1° Medio',
    svg: svgs.svgFloorPlan(8, 5, 4),
  }
];

// =========================================================================
// FORMA C (Forma 3) — 14 PREGUNTAS
// =========================================================================
export const HOMOTECIA_1MEDIO_FORMA_C: Question[] = [
  {
    id: 'db-homo-C-1',
    itemNumber: 1,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Al aplicar una homotecia a cualquier polígono, ¿cómo son entre sí los lados de la figura original y los lados de la figura imagen?',
    options: [
      'Tienen longitudes idénticas',
      'Son diagonales concurrentes',
      'Son secantes y oblicuos',
      'Son siempre paralelos entre sí ($A\'B\' \\parallel AB$)'
    ],
    correctAnswer: 3, // D
    explanation: 'Los lados homólogos resultantes son siempre paralelos a los originales correspondientes.',
    hint: 'Recuerda que la homotecia preserva el paralelismo.',
    topic: 'Propiedades de Lados Homólogos',
    grade: '1° Medio',
    svg: svgs.svgHomologousSides('2,5'),
  },
  {
    id: 'db-homo-C-2',
    itemNumber: 2,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si un lado $AB$ mide $10\\text{ cm}$ y se le aplica una homotecia de razón $k = 2{,}5$, ¿cuál es la longitud del lado resultante $A\'B\'$?',
    options: [
      '$25\\text{ cm}$',
      '$12{,}5\\text{ cm}$',
      '$4\\text{ cm}$',
      '$20\\text{ cm}$'
    ],
    correctAnswer: 0, // A
    explanation: '$A\'B\' = |k| \\cdot AB = 2{,}5 \\cdot 10 = 25\\text{ cm}$.',
    hint: 'Multiplica $10 \\cdot 2{,}5$.',
    topic: 'Cálculo de Longitudes Homólogas',
    grade: '1° Medio',
    svg: svgs.svgSideLength(10, 25, '2,5'),
  },
  {
    id: 'db-homo-C-3',
    itemNumber: 3,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En una homotecia de centro $O$, la distancia $OA$ mide $6\\text{ cm}$ y $OA\'$ mide $18\\text{ cm}$ (al mismo lado de $O$). El factor $k$ es:',
    options: [
      '$k = 0{,}33$',
      '$k = 12$',
      '$k = 3$',
      '$k = -3$'
    ],
    correctAnswer: 2, // C
    explanation: '$k = \\frac{OA\'}{OA} = \\frac{18}{6} = 3$.',
    hint: 'Divide $18 / 6$.',
    topic: 'Determinación de la Razón k',
    grade: '1° Medio',
    svg: svgs.svgCenterDistance(6, 18, 3),
  },
  {
    id: 'db-homo-C-4',
    itemNumber: 4,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Cuál de los siguientes valores de la razón $k$ indica que la figura resultante es una reducción inversa?',
    options: [
      '$k = 1{,}6$',
      '$k = -1{,}6$',
      '$k = 0{,}6$',
      '$k = -0{,}6$'
    ],
    correctAnswer: 3, // D
    explanation: 'Una reducción inversa exige que $-1 < k < 0$, lo que corresponde a $k = -0{,}6$.',
    hint: 'El valor debe ser negativo y tener valor absoluto menor a 1.',
    topic: 'Homotecia Inversa y Reducción',
    grade: '1° Medio',
    svg: svgs.svgInverseReduction('-0,6'),
  },
  {
    id: 'db-homo-C-5',
    itemNumber: 5,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Un triángulo tiene ángulos interiores de $50^\\circ$, $60^\\circ$ y $70^\\circ$. Si se aplica una homotecia de razón $k = 3$, ¿cuánto miden los nuevos ángulos?',
    options: [
      '$50^\\circ$, $60^\\circ$ y $70^\\circ$',
      '$150^\\circ$, $180^\\circ$ y $210^\\circ$',
      '$16{,}7^\\circ$, $20^\\circ$ y $23{,}3^\\circ$',
      '$80^\\circ$, $90^\\circ$ y $100^\\circ$'
    ],
    correctAnswer: 0, // A
    explanation: 'La homotecia preserva exactamente las medidas de los ángulos homólogos.',
    hint: 'Los ángulos son invariantes ante homotecias.',
    topic: 'Conservación de Ángulos',
    grade: '1° Medio',
    svg: svgs.svgAnglePreservation(50, 60, 70),
  },
  {
    id: 'db-homo-C-6',
    itemNumber: 6,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El área de un rectángulo original es de $12\\text{ cm}^2$. Si se aplica una homotecia con razón $k = 3$, ¿cuál será el área de la nueva figura?',
    options: [
      '$108\\text{ cm}^2$',
      '$36\\text{ cm}^2$',
      '$15\\text{ cm}^2$',
      '$96\\text{ cm}^2$'
    ],
    correctAnswer: 0, // A
    explanation: '$\\text{Área}\' = 3^2 \\cdot 12 = 9 \\cdot 12 = 108\\text{ cm}^2$.',
    hint: 'Multiplica por $k^2 = 9$.',
    topic: 'Variación de Áreas en Homotecia',
    grade: '1° Medio',
    svg: svgs.svgAreaVariation(12, 108, 3),
  },
  {
    id: 'db-homo-C-7',
    itemNumber: 7,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El perímetro de un polígono es $32\\text{ cm}$. Si se le aplica una homotecia con razón $k = -2$, ¿cuál es el perímetro del polígono resultante?',
    options: [
      '$-64\\text{ cm}$',
      '$16\\text{ cm}$',
      '$30\\text{ cm}$',
      '$64\\text{ cm}$'
    ],
    correctAnswer: 3, // D
    explanation: '$P\' = |-2| \\cdot 32 = 2 \\cdot 32 = 64\\text{ cm}$. Las medidas de contorno son siempre positivas.',
    hint: 'Toma el valor absoluto de $k$.',
    topic: 'Variación del Perímetro',
    grade: '1° Medio',
    svg: svgs.svgPerimeterNegative(32, 64, -2),
  },
  {
    id: 'db-homo-C-8',
    itemNumber: 8,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si en una homotecia la razón es $k = -1$, la figura resultante es congruente a la original y el centro $O$ actúa como:',
    options: [
      'Centro de simetría central (rotación de $180^\\circ$)',
      'Eje de traslación perpendicular',
      'Plano focal de reflexión',
      'Vértice de contracción nula'
    ],
    correctAnswer: 0, // A
    explanation: 'Una homotecia con razón $k = -1$ es idéntica a una simetría central respecto al centro $O$.',
    hint: 'La figura se rota $180^\\circ$ con el centro como pivote.',
    topic: 'Caso Especial k = -1 (Simetría Central)',
    grade: '1° Medio',
    svg: svgs.svgCentralSymmetry(),
  },
  {
    id: 'db-homo-C-9',
    itemNumber: 9,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Se sabe que una figura homotética tiene una razón $k = 2$. Si la distancia del centro $O$ al punto imagen $A\'$ es $OA\' = 16\\text{ cm}$, ¿cuánto medía la distancia original $OA$?',
    options: [
      '$32\\text{ cm}$',
      '$8\\text{ cm}$',
      '$14\\text{ cm}$',
      '$18\\text{ cm}$'
    ],
    correctAnswer: 1, // B
    explanation: '$OA = \\frac{16}{2} = 8\\text{ cm}$.',
    hint: 'Calcula $16 / 2$.',
    topic: 'Cálculo de Distancia Original',
    grade: '1° Medio',
    svg: svgs.svgReverseDistance(8, 16, 2),
  },
  {
    id: 'db-homo-C-10',
    itemNumber: 10,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En óptica, la formación de imágenes en una cámara oscura o en el ojo humano proyecta una imagen invertida y reducida. Este fenómeno se modela geométricamente como:',
    options: [
      'Una homotecia directa con $k > 1$',
      'Una homotecia inversa con razón $-1 < k < 0$',
      'Una reflexión especular',
      'Una proyección asimétrica'
    ],
    correctAnswer: 1, // B
    explanation: 'El orificio estenopeico genera una imagen invertida y de menor tamaño que el objeto original.',
    hint: 'Imagen invertida = signo negativo; menor tamaño = magnitud menor a 1.',
    topic: 'Modelamiento Óptico en Cámara Oscura',
    grade: '1° Medio',
    svg: svgs.svgCameraObscura(),
  },
  {
    id: 'db-homo-C-11',
    itemNumber: 11,
    itemType: 'development',
    points: 4,
    text: 'Cálculo de Segmentos Homólogos y Distancias desde el Centro (Forma C):\nUn triángulo $ABC$ tiene lados $AB = 4\\text{ cm}$, $BC = 5\\text{ cm}$, $CA = 7\\text{ cm}$ y distancia al centro $OA = 3\\text{ cm}$. Se aplica una homotecia de centro $O$ y razón $k = 3$.\n\nI) Calcule la longitud de $A\'B\'$, $B\'C\'$ y $C\'A\'$.\nII) Calcule la distancia $OA\'$ desde el centro $O$ al vértice $A\'$.\nIII) Calcule el perímetro del triángulo original y del resultante.',
    options: [
      'I) A\'B\'=12 cm, B\'C\'=15 cm, C\'A\'=21 cm; II) OA\'=9 cm; III) P=16 cm, P\'=48 cm',
      'I) A\'B\'=7 cm, B\'C\'=8 cm, C\'A\'=10 cm; II) OA\'=6 cm; III) P=16 cm, P\'=25 cm',
      'I) A\'B\'=16 cm, B\'C\'=20 cm, C\'A\'=28 cm; II) OA\'=12 cm; III) P=16 cm, P\'=64 cm',
      'I) A\'B\'=12 cm, B\'C\'=15 cm, C\'A\'=21 cm; II) OA\'=3 cm; III) P=16 cm, P\'=144 cm'
    ],
    correctAnswer: 0, // A
    explanation: 'I) Lados: $4 \\cdot 3 = 12\\text{ cm}$, $5 \\cdot 3 = 15\\text{ cm}$, $7 \\cdot 3 = 21\\text{ cm}$.\nII) $OA\' = 3 \\cdot 3 = 9\\text{ cm}$.\nIII) $P = 4+5+7 = 16\\text{ cm}$, $P\' = 3 \\cdot 16 = 48\\text{ cm}$.',
    hint: 'Multiplica dimensiones lineales por $k=3$.',
    topic: 'Desarrollo: Segmentos y Distancias Homólogas',
    grade: '1° Medio',
    svg: svgs.svgTriangleDevelopment(4, 5, 7, 3, 3),
  },
  {
    id: 'db-homo-C-12',
    itemNumber: 12,
    itemType: 'development',
    points: 4,
    text: 'Variación de Área en Cuadriláteros Homotéticos (Forma C):\nUn cuadrado tiene lado $L = 7\\text{ cm}$ (Área original $= 49\\text{ cm}^2$). Se le aplica una homotecia de razón $k = 2$.\n\nI) Calcule la medida del nuevo lado $L\'$ del cuadrado resultante.\nII) Calcule la nueva área multiplicando los lados y aplicando la fórmula de homotecia.',
    options: [
      'I) L\' = 9 cm; II) Área\' = 98 cm²',
      'I) L\' = 14 cm; II) Área\' = 98 cm²',
      'I) L\' = 49 cm; II) Área\' = 2401 cm²',
      'I) L\' = 14 cm; II) Área\' = 196 cm²'
    ],
    correctAnswer: 3, // D
    explanation: 'I) $L\' = 2 \\cdot 7 = 14\\text{ cm}$.\nII) $\\text{Área}\' = 14^2 = 196\\text{ cm}^2$ ($2^2 \\cdot 49 = 196\\text{ cm}^2$).',
    hint: 'Lado se multiplica por 2; área por $k^2 = 4$.',
    topic: 'Desarrollo: Cuadriláteros y Escalamiento de Áreas',
    grade: '1° Medio',
    svg: svgs.svgSquareAreaDevelopment(7, 2),
  },
  {
    id: 'db-homo-C-13',
    itemNumber: 13,
    itemType: 'problem_solving',
    points: 4,
    text: 'Sombra Proyectada por una Escultura (Forma C):\nUna fuente de luz puntual en el suelo (centro $O$) ilumina una escultura de $1{,}4\\text{ m}$ de altura situada a $2\\text{ m}$ de distancia. La sombra se proyecta sobre una pared vertical situada a $6\\text{ m}$ de la fuente de luz.\n\nI) Determine la razón de homotecia directa $k$.\nII) ¿Cuál es la altura total de la sombra $h$ proyectada en la pared?',
    options: [
      'I) k = 4; II) Altura de la sombra h = 5,6 m',
      'I) k = 3; II) Altura de la sombra h = 4,2 m',
      'I) k = 3; II) Altura de la sombra h = 2,8 m',
      'I) k = 2; II) Altura de la sombra h = 4,2 m'
    ],
    correctAnswer: 1, // B
    explanation: 'I) $k = \\frac{6}{2} = 3$.\nII) Sombra: $h = 3 \\cdot 1{,}4 = 4{,}2\\text{ m}$.',
    hint: 'Calcula $k = 6/2 = 3$ y multiplica por $1{,}4$.',
    topic: 'Problemas: Proyección de Sombras y Fuentes de Luz',
    grade: '1° Medio',
    svg: svgs.svgShadowSculpture(1.4, 2, 6, 3),
  },
  {
    id: 'db-homo-C-14',
    itemNumber: 14,
    itemType: 'problem_solving',
    points: 4,
    text: 'Ampliación de un Plano a Escala (Forma C):\nUn plano rectangular mide $9\\text{ cm}$ de largo y $5\\text{ cm}$ de ancho. Se amplía fotocopiándolo con una razón de homotecia $k = 4$.\n\nI) ¿Cuáles son las nuevas dimensiones del plano ampliado (largo y ancho)?\nII) ¿Cuál es el área del plano ampliado en la fotocopia?',
    options: [
      'I) Largo = 13 cm, Ancho = 9 cm; II) Área = 117 cm²',
      'I) Largo = 36 cm, Ancho = 20 cm; II) Área = 180 cm²',
      'I) Largo = 18 cm, Ancho = 10 cm; II) Área = 360 cm²',
      'I) Largo = 36 cm, Ancho = 20 cm; II) Área = 720 cm²'
    ],
    correctAnswer: 3, // D
    explanation: 'I) Largo: $4 \\cdot 9 = 36\\text{ cm}$, Ancho: $4 \\cdot 5 = 20\\text{ cm}$.\nII) $\\text{Área}\' = 36 \\cdot 20 = 720\\text{ cm}^2$ ($4^2 \\cdot 45 = 720\\text{ cm}^2$).',
    hint: 'Multiplica dimensiones por 4 y calcula el área total.',
    topic: 'Problemas: Planos a Escala y Fotocopias',
    grade: '1° Medio',
    svg: svgs.svgFloorPlan(9, 5, 4),
  }
];

// =========================================================================
// FORMA D (Forma 4) — 14 PREGUNTAS
// =========================================================================
export const HOMOTECIA_1MEDIO_FORMA_D: Question[] = [
  {
    id: 'db-homo-D-1',
    itemNumber: 1,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Cuál de las siguientes afirmaciones describe con exactitud la relación entre los lados homólogos de una figura y su imagen homotética?',
    options: [
      'Tienen exactamente las mismas medidas angulares y de longitud',
      'Son siempre paralelos entre sí ($A\'B\' \\parallel AB$)',
      'Se cruzan perpendicularmente en el baricentro',
      'Son diagonales proyectivas que no conservan dirección'
    ],
    correctAnswer: 1, // B
    explanation: 'En cualquier homotecia los lados homólogos son estrictamente paralelos.',
    hint: 'Recuerda el paralelismo de segmentos homólogos.',
    topic: 'Propiedades de Lados Homólogos',
    grade: '1° Medio',
    svg: svgs.svgHomologousSides('2,5'),
  },
  {
    id: 'db-homo-D-2',
    itemNumber: 2,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si un lado $AB$ mide $12\\text{ cm}$ y se le aplica una homotecia de razón $k = 2{,}5$, ¿cuál es la longitud del lado resultante $A\'B\'$?',
    options: [
      '$14{,}5\\text{ cm}$',
      '$30\\text{ cm}$',
      '$4{,}8\\text{ cm}$',
      '$24\\text{ cm}$'
    ],
    correctAnswer: 1, // B
    explanation: '$A\'B\' = |k| \\cdot AB = 2{,}5 \\cdot 12 = 30\\text{ cm}$.',
    hint: 'Calcula $12 \\cdot 2{,}5$.',
    topic: 'Cálculo de Longitudes Homólogas',
    grade: '1° Medio',
    svg: svgs.svgSideLength(12, 30, '2,5'),
  },
  {
    id: 'db-homo-D-3',
    itemNumber: 3,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En una homotecia de centro $O$, la distancia $OA$ mide $7\\text{ cm}$ y $OA\'$ mide $21\\text{ cm}$ (al mismo lado de $O$). El factor $k$ es:',
    options: [
      '$k = 0{,}33$',
      '$k = 14$',
      '$k = 3$',
      '$k = -3$'
    ],
    correctAnswer: 2, // C
    explanation: '$k = \\frac{OA\'}{OA} = \\frac{21}{7} = 3$.',
    hint: 'Divide $21 / 7$.',
    topic: 'Determinación de la Razón k',
    grade: '1° Medio',
    svg: svgs.svgCenterDistance(7, 21, 3),
  },
  {
    id: 'db-homo-D-4',
    itemNumber: 4,
    itemType: 'multiple_choice',
    points: 2,
    text: '¿Cuál de los siguientes valores de la razón $k$ indica que la figura resultante es una reducción inversa?',
    options: [
      '$k = 1{,}2$',
      '$k = -0{,}2$',
      '$k = 0{,}2$',
      '$k = -1{,}2$'
    ],
    correctAnswer: 1, // B
    explanation: 'Una reducción inversa exige que $-1 < k < 0$, lo que corresponde a $k = -0{,}2$.',
    hint: 'Busca un número negativo con valor absoluto menor que 1.',
    topic: 'Homotecia Inversa y Reducción',
    grade: '1° Medio',
    svg: svgs.svgInverseReduction('-0,2'),
  },
  {
    id: 'db-homo-D-5',
    itemNumber: 5,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Un triángulo tiene ángulos interiores de $35^\\circ$, $65^\\circ$ y $80^\\circ$. Si se aplica una homotecia de razón $k = 3$, ¿cuánto miden los nuevos ángulos?',
    options: [
      '$105^\\circ$, $195^\\circ$ y $240^\\circ$',
      '$35^\\circ$, $65^\\circ$ y $80^\\circ$',
      '$11{,}7^\\circ$, $21{,}7^\\circ$ y $26{,}7^\\circ$',
      '$70^\\circ$, $100^\\circ$ y $115^\\circ$'
    ],
    correctAnswer: 1, // B
    explanation: 'Las homotecias conservan invariantes los ángulos interiores correspondientes.',
    hint: 'Los ángulos homólogos permanecen inalterados.',
    topic: 'Conservación de Ángulos',
    grade: '1° Medio',
    svg: svgs.svgAnglePreservation(35, 65, 80),
  },
  {
    id: 'db-homo-D-6',
    itemNumber: 6,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El área de un rectángulo original es de $6\\text{ cm}^2$. Si se aplica una homotecia con razón $k = 3$, ¿cuál será el área de la nueva figura?',
    options: [
      '$18\\text{ cm}^2$',
      '$54\\text{ cm}^2$',
      '$9\\text{ cm}^2$',
      '$48\\text{ cm}^2$'
    ],
    correctAnswer: 1, // B
    explanation: '$\\text{Área}\' = 3^2 \\cdot 6 = 9 \\cdot 6 = 54\\text{ cm}^2$.',
    hint: 'Multiplica el área original por $k^2 = 9$.',
    topic: 'Variación de Áreas en Homotecia',
    grade: '1° Medio',
    svg: svgs.svgAreaVariation(6, 54, 3),
  },
  {
    id: 'db-homo-D-7',
    itemNumber: 7,
    itemType: 'multiple_choice',
    points: 2,
    text: 'El perímetro de un polígono es $26\\text{ cm}$. Si se le aplica una homotecia con razón $k = -2$, ¿cuál es el perímetro del polígono resultante?',
    options: [
      '$-52\\text{ cm}$',
      '$13\\text{ cm}$',
      '$52\\text{ cm}$',
      '$24\\text{ cm}$'
    ],
    correctAnswer: 2, // C
    explanation: '$P\' = |-2| \\cdot 26 = 2 \\cdot 26 = 52\\text{ cm}$. Los perímetros siempre tienen valores positivos.',
    hint: 'Aplica el valor absoluto $|k| = 2$.',
    topic: 'Variación del Perímetro',
    grade: '1° Medio',
    svg: svgs.svgPerimeterNegative(26, 52, -2),
  },
  {
    id: 'db-homo-D-8',
    itemNumber: 8,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Si en una homotecia la razón es $k = -1$, la figura resultante es congruente a la original y el centro $O$ actúa como:',
    options: [
      'Punto de reflexión especular',
      'Centro de simetría central (rotación de $180^\\circ$)',
      'Eje de traslación unitaria',
      'Vértice de escala nula'
    ],
    correctAnswer: 1, // B
    explanation: 'Una homotecia de razón $k = -1$ produce una rotación de $180^\\circ$ respecto a $O$, equivalente a una simetría central.',
    hint: 'La figura gira $180^\\circ$ respecto al centro $O$.',
    topic: 'Caso Especial k = -1 (Simetría Central)',
    grade: '1° Medio',
    svg: svgs.svgCentralSymmetry(),
  },
  {
    id: 'db-homo-D-9',
    itemNumber: 9,
    itemType: 'multiple_choice',
    points: 2,
    text: 'Se sabe que una figura homotética tiene una razón $k = 2$. Si la distancia del centro $O$ al punto imagen $A\'$ es $OA\' = 14\\text{ cm}$, ¿cuánto medía la distancia original $OA$?',
    options: [
      '$28\\text{ cm}$',
      '$12\\text{ cm}$',
      '$7\\text{ cm}$',
      '$16\\text{ cm}$'
    ],
    correctAnswer: 2, // C
    explanation: '$OA = \\frac{14}{2} = 7\\text{ cm}$.',
    hint: 'Divide $14 / 2$.',
    topic: 'Cálculo de Distancia Original',
    grade: '1° Medio',
    svg: svgs.svgReverseDistance(7, 14, 2),
  },
  {
    id: 'db-homo-D-10',
    itemNumber: 10,
    itemType: 'multiple_choice',
    points: 2,
    text: 'En óptica, la formación de imágenes en una cámara oscura o en el ojo humano proyecta una imagen invertida y reducida. Este fenómeno se modela geométricamente como:',
    options: [
      'Una homotecia directa con $k > 1$',
      'Una traslación isométrica',
      'Una rotación ortogonal pura',
      'Una homotecia inversa con razón $-1 < k < 0$'
    ],
    correctAnswer: 3, // D
    explanation: 'El orificio pinhole invierte los rayos proyectando una imagen reducida ($-1 < k < 0$).',
    hint: 'Invertida significa signo negativo con valor absoluto menor que 1.',
    topic: 'Modelamiento Óptico en Cámara Oscura',
    grade: '1° Medio',
    svg: svgs.svgCameraObscura(),
  },
  {
    id: 'db-homo-D-11',
    itemNumber: 11,
    itemType: 'development',
    points: 4,
    text: 'Cálculo de Segmentos Homólogos y Distancias desde el Centro (Forma D):\nUn triángulo $ABC$ tiene lados $AB = 5\\text{ cm}$, $BC = 6\\text{ cm}$, $CA = 7\\text{ cm}$ y distancia al centro $OA = 4\\text{ cm}$. Se aplica una homotecia de centro $O$ y razón $k = 3$.\n\nI) Calcule la longitud de $A\'B\'$, $B\'C\'$ y $C\'A\'$.\nII) Calcule la distancia $OA\'$ desde el centro $O$ al vértice $A\'$.\nIII) Calcule el perímetro del triángulo original y del resultante.',
    options: [
      'I) A\'B\'=8 cm, B\'C\'=9 cm, C\'A\'=10 cm; II) OA\'=7 cm; III) P=18 cm, P\'=27 cm',
      'I) A\'B\'=20 cm, B\'C\'=24 cm, C\'A\'=28 cm; II) OA\'=16 cm; III) P=18 cm, P\'=72 cm',
      'I) A\'B\'=15 cm, B\'C\'=18 cm, C\'A\'=21 cm; II) OA\'=12 cm; III) P=18 cm, P\'=54 cm',
      'I) A\'B\'=15 cm, B\'C\'=18 cm, C\'A\'=21 cm; II) OA\'=4 cm; III) P=18 cm, P\'=162 cm'
    ],
    correctAnswer: 2, // C
    explanation: 'I) Lados: $5 \\cdot 3 = 15\\text{ cm}$, $6 \\cdot 3 = 18\\text{ cm}$, $7 \\cdot 3 = 21\\text{ cm}$.\nII) $OA\' = 3 \\cdot 4 = 12\\text{ cm}$.\nIII) $P = 5+6+7 = 18\\text{ cm}$, $P\' = 3 \\cdot 18 = 54\\text{ cm}$.',
    hint: 'Multiplica dimensiones lineales por $k=3$.',
    topic: 'Desarrollo: Segmentos y Distancias Homólogas',
    grade: '1° Medio',
    svg: svgs.svgTriangleDevelopment(5, 6, 7, 4, 3),
  },
  {
    id: 'db-homo-D-12',
    itemNumber: 12,
    itemType: 'development',
    points: 4,
    text: 'Variación de Área en Cuadriláteros Homotéticos (Forma D):\nUn cuadrado tiene lado $L = 8\\text{ cm}$ (Área original $= 64\\text{ cm}^2$). Se le aplica una homotecia de razón $k = 2$.\n\nI) Calcule la medida del nuevo lado $L\'$ del cuadrado resultante.\nII) Calcule la nueva área multiplicando los lados y aplicando la fórmula de homotecia.',
    options: [
      'I) L\' = 16 cm; II) Área\' = 256 cm²',
      'I) L\' = 10 cm; II) Área\' = 128 cm²',
      'I) L\' = 16 cm; II) Área\' = 128 cm²',
      'I) L\' = 64 cm; II) Área\' = 4096 cm²'
    ],
    correctAnswer: 0, // A
    explanation: 'I) $L\' = 2 \\cdot 8 = 16\\text{ cm}$.\nII) $\\text{Área}\' = 16^2 = 256\\text{ cm}^2$ ($2^2 \\cdot 64 = 256\\text{ cm}^2$).',
    hint: 'El lado se duplica y el área se multiplica por $k^2 = 4$.',
    topic: 'Desarrollo: Cuadriláteros y Escalamiento de Áreas',
    grade: '1° Medio',
    svg: svgs.svgSquareAreaDevelopment(8, 2),
  },
  {
    id: 'db-homo-D-13',
    itemNumber: 13,
    itemType: 'problem_solving',
    points: 4,
    text: 'Sombra Proyectada por una Escultura (Forma D):\nUna fuente de luz puntual en el suelo (centro $O$) ilumina una escultura de $1{,}6\\text{ m}$ de altura situada a $2\\text{ m}$ de distancia. La sombra se proyecta sobre una pared vertical situada a $6\\text{ m}$ de la fuente de luz.\n\nI) Determine la razón de homotecia directa $k$.\nII) ¿Cuál es la altura total de la sombra $h$ proyectada en la pared?',
    options: [
      'I) k = 4; II) Altura de la sombra h = 6,4 m',
      'I) k = 3; II) Altura de la sombra h = 3,2 m',
      'I) k = 3; II) Altura de la sombra h = 4,8 m',
      'I) k = 2; II) Altura de la sombra h = 4,8 m'
    ],
    correctAnswer: 2, // C
    explanation: 'I) $k = \\frac{6}{2} = 3$.\nII) Sombra: $h = 3 \\cdot 1{,}6 = 4{,}8\\text{ m}$.',
    hint: 'Calcula $k = 6/2 = 3$ y multiplica por $1{,}6$.',
    topic: 'Problemas: Proyección de Sombras y Fuentes de Luz',
    grade: '1° Medio',
    svg: svgs.svgShadowSculpture(1.6, 2, 6, 3),
  },
  {
    id: 'db-homo-D-14',
    itemNumber: 14,
    itemType: 'problem_solving',
    points: 4,
    text: 'Ampliación de un Plano a Escala (Forma D):\nUn plano rectangular mide $11\\text{ cm}$ de largo y $5\\text{ cm}$ de ancho. Se amplía fotocopiándolo con una razón de homotecia $k = 4$.\n\nI) ¿Cuáles son las nuevas dimensiones del plano ampliado (largo y ancho)?\nII) ¿Cuál es el área del plano ampliado en la fotocopia?',
    options: [
      'I) Largo = 44 cm, Ancho = 20 cm; II) Área = 880 cm²',
      'I) Largo = 15 cm, Ancho = 9 cm; II) Área = 135 cm²',
      'I) Largo = 44 cm, Ancho = 20 cm; II) Área = 220 cm²',
      'I) Largo = 22 cm, Ancho = 10 cm; II) Área = 440 cm²'
    ],
    correctAnswer: 0, // A
    explanation: 'I) Largo: $4 \\cdot 11 = 44\\text{ cm}$, Ancho: $4 \\cdot 5 = 20\\text{ cm}$.\nII) $\\text{Área}\' = 44 \\cdot 20 = 880\\text{ cm}^2$ ($4^2 \\cdot 55 = 880\\text{ cm}^2$).',
    hint: 'Multiplica dimensiones por 4 y calcula el producto de área.',
    topic: 'Problemas: Planos a Escala y Fotocopias',
    grade: '1° Medio',
    svg: svgs.svgFloorPlan(11, 5, 4),
  }
];
