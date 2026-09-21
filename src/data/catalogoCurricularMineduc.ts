/**
 * CATÁLOGO CURRICULAR OFICIAL MINEDUC - MATEMÁTICA (CHILE)
 * 
 * Marco Normativo:
 * - 8° Básico a 2° Medio: Decreto Supremo de Educación N° 614/2013 y Programas de Estudio.
 * - 3° y 4° Medio: Decreto Supremo de Educación N° 193/2019 (Bases Curriculares Formación General y Diferenciada TP).
 * 
 * Estructura para EduMath Pro:
 * Incluye Ejes temáticos, OAs oficiales con descripción pedagógica auténtica,
 * conceptos clave, y 4 categorías de recursos pedagógicos (material, guiados, propuestos, evaluación en vivo).
 */

export interface OARecursos {
  material: string;
  guiados: string;
  propuestos: string;
  evaluacionEnVivo: boolean;
}

export interface OAItem {
  id: string;
  tituloCorto: string;
  descripcion: string;
  conceptosClave: string[];
  recursos: OARecursos;
}

export interface UnidadCurricular {
  nombreUnidad?: string;
  eje: string;
  oas: OAItem[];
}

export interface NivelCurricular {
  nivel: string;
  descripcionNivel: string;
  marcoNormativo: string;
  unidades: Record<string, UnidadCurricular>;
}

export const CATALOGO_CURRICULAR_MINEDUC: Record<string, NivelCurricular> = {
  // =========================================================================
  // 8° BÁSICO - D.S. N° 614/2013
  // =========================================================================
  "8_basico": {
    nivel: "8° Básico",
    descripcionNivel: "Educación General Básica (Segundo Ciclo)",
    marcoNormativo: "Decreto Supremo N° 614/2013 - MINEDUC",
    unidades: {
      "unidad_1": {
        nombreUnidad: "Números Enteros, Racionales, Potencias y Raíces",
        eje: "Números",
        oas: [
          {
            id: "OA 01",
            tituloCorto: "Multiplicación y División de Enteros",
            descripcion: "Mostrar que comprenden la multiplicación y la división de números enteros: representándolas de manera concreta, pictórica y simbólica; aplicando procedimientos de cálculo; resolviendo problemas rutinarios y no rutinarios.",
            conceptosClave: ["Regla de los signos", "Recta numérica", "Operaciones combinadas", "Valor absoluto"],
            recursos: {
              material: "Presentación interactiva: Conjunto Z y reglas operatorias de la multiplicación y división",
              guiados: "Modelamiento paso a paso: Operatoria combinada con signos de agrupación y prioridad de operaciones",
              propuestos: "Guía de 10 desafíos en cuaderno con justificación y análisis de errores frecuentes",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 02",
            tituloCorto: "Operaciones con Racionales (Q)",
            descripcion: "Utilizar las operaciones de adición y sustracción con los números racionales en el contexto de la resolución de problemas: representándolos en la recta numérica; aplicando el algoritmo de la adición y de la sustracción de números racionales.",
            conceptosClave: ["Fracciones y decimales", "Mínimo común múltiplo", "Densidad en Q", "Problemas de contexto real"],
            recursos: {
              material: "Infografía y pizarra: Representación de racionales positivos y negativos en la recta",
              guiados: "Resolución guiada: Suma y resta de fracciones heterogéneas con signos positivos y negativos",
              propuestos: "Taller grupal: Resolución de situaciones de finanzas cotidianas y medidas en Q",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 03",
            tituloCorto: "Potencias de Base Racional y Exponente Entero",
            descripcion: "Explicar la multiplicación y la división de potencias de base racional y exponente entero, y potencias de base entera y exponente natural hasta 3: de manera concreta, pictórica y simbólica; aplicando las propiedades de la multiplicación y división de potencias.",
            conceptosClave: ["Base racional", "Exponente negativo y cero", "Multiplicación de igual base", "Potencia de una potencia"],
            recursos: {
              material: "Diapositivas animadas: Propiedades fundamentales de potencias y exponente negativo",
              guiados: "Ejercicio modelo: Simplificación de expresiones fraccionarias con potencias",
              propuestos: "Set de 8 ejercicios de cálculo mental y simplificación algebraica de potencias",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 04",
            tituloCorto: "Raíces Cuadradas y Estimación",
            descripcion: "Mostrar que comprenden las raíces cuadradas de números naturales: estimándolas de manera intuitiva; representándolas de manera concreta, pictórica y simbólica; aplicando la aproximación en la resolución de problemas en contextos diversos.",
            conceptosClave: ["Cuadrados perfectos", "Estimación acotada en la recta", "Área del cuadrado", "Algoritmo de aproximación"],
            recursos: {
              material: "Geometría interactiva: Relación entre área cuadrada y longitud del lado",
              guiados: "Paso a paso: Acotamiento de raíces inexactas entre enteros consecutivos",
              propuestos: "Desafío de cuaderno: Estimación de raíces cuadradas no perfectas con un decimal de precisión",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 05",
            tituloCorto: "Variaciones Porcentuales e Interés Simple",
            descripcion: "Resolver problemas que involucran variaciones porcentuales en contextos diversos, usando representaciones pictóricas y simbólicas y de manera manual y/o con software educativo.",
            conceptosClave: ["Porcentaje de aumento/descuento", "IVA y recargos", "Factor multiplicativo decimal", "Interés simple"],
            recursos: {
              material: "Lámina de educación financiera: Factores de descuento comercial e IVA",
              guiados: "Modelamiento de variaciones sucesivas de porcentajes sin sumar linealmente",
              propuestos: "Estudio de caso: Comparación de promociones comerciales y liquidaciones bancarias",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_2": {
        nombreUnidad: "Álgebra, Ecuaciones, Inecuaciones y Funciones",
        eje: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 06",
            tituloCorto: "Expresiones Algebraicas y Multiplicación de Polinomios",
            descripcion: "Mostrar que comprenden las operaciones de expresiones algebraicas: reduciendo términos semejantes; multiplicando monomios y polinomios de manera pictórica y simbólica.",
            conceptosClave: ["Términos semejantes", "Grado de un término", "Propiedad distributiva", "Áreas de rectángulos algebraicos"],
            recursos: {
              material: "Visualizador con bloques de álgebra (Algeblocks) y modelamiento de áreas",
              guiados: "Reducción de expresiones algebraicas con paréntesis anidados",
              propuestos: "Guía de desarrollo: Multiplicación de binomios por polinomios",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 07",
            tituloCorto: "Noción de Función Lineal",
            descripcion: "Mostrar que comprenden la noción de función por medio de un cambio lineal: utilizando tablas, representaciones gráficas y expresiones algebraicas f(x) = ax; distinguiendo entre función lineal y afín.",
            conceptosClave: ["Variable dependiente e independiente", "Tabla de valores", "Proporcionalidad directa", "Origen de coordenadas"],
            recursos: {
              material: "Gráfico interactivo: Variación de la constante de proporcionalidad m",
              guiados: "Construcción de tabla, diagrama sagital y gráfica cartesiana de f(x) = ax",
              propuestos: "Desafío contextualizado: Modelamiento de velocidad constante y cobro por minuto",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 08",
            tituloCorto: "Ecuaciones Lineales con Coeficientes Racionales",
            descripcion: "Modelar situaciones de la vida diaria y de otras asignaturas, usando ecuaciones lineales de la forma ax = b, x/a = b, ax + b = c, x/a + b = c, ax = b + cx, a(x + b) = c, ax + b = cx + d.",
            conceptosClave: ["Propiedad de igualdad (balanza)", "Lenguaje algebraico", "Despeje de incógnita", "Comprobación de soluciones"],
            recursos: {
              material: "Simulador de balanza virtual y equivalencias algebraicas",
              guiados: "Resolución paso a paso de ecuaciones con denominadores y paréntesis",
              propuestos: "12 problemas de planteo en cuaderno con justificación paso a paso",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 09",
            tituloCorto: "Función Afín, Pendiente y Coeficiente de Posición",
            descripcion: "Mostrar que comprenden la función afín: reconociendo su expresión algebraica f(x) = ax + b; graficándola e interpretando la pendiente y el coeficiente de posición en tablas y situaciones reales.",
            conceptosClave: ["Pendiente (m)", "Coeficiente de posición (n)", "Traslación vertical", "Razón de cambio constante"],
            recursos: {
              material: "Laboratorio GeoGebra: Modificación de parámetros 'm' y 'b' en f(x) = mx + n",
              guiados: "Cálculo de la pendiente a partir de dos puntos (x1, y1) y (x2, y2)",
              propuestos: "Guía de aplicación: Tarifas de servicios básicos (cargo fijo + consumo variable)",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 10",
            tituloCorto: "Inecuaciones Lineales y Conjuntos Solución",
            descripcion: "Mostrar que comprenden las inecuaciones lineales de la forma ax > b, ax < b, ax + b > c, ax + b < c: resolviéndolas simbólica y gráficamente; representándolas como intervalos en la recta numérica.",
            conceptosClave: ["Desigualdades", "Inversión del sentido al multiplicar por negativo", "Intervalos abiertos/cerrados", "Conjunto solución"],
            recursos: {
              material: "Pizarra explicativa: Propiedades del orden en los números reales y el signo de desigualdad",
              guiados: "Resolución de inecuación lineal con cambio de signo e intervalo gráfico",
              propuestos: "Problemas verbales de límites de peso, presupuestos máximos y rangos seguros",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_3": {
        nombreUnidad: "Geometría, Teorema de Pitágoras, Prismas y Cuerpos",
        eje: "Geometría",
        oas: [
          {
            id: "OA 11",
            tituloCorto: "Área y Volumen de Prismas y Cilindros",
            descripcion: "Desarrollar las fórmulas para encontrar el área de superficies y el volumen de prismas rectos con diferentes bases y cilindros: aplicando las fórmulas a la resolución de problemas geométricos y de la vida diaria.",
            conceptosClave: ["Red de cuerpos", "Área lateral y basal", "Volumen = Área basal × Altura", "Número Pi"],
            recursos: {
              material: "Modelado 3D interactivo: Despliegue de redes de prismas y cilindros",
              guiados: "Cálculo de volumen y capacidad en litros para envases cilíndricos y prismáticos",
              propuestos: "Taller práctico: Optimización de material de empaque y embalaje",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 12",
            tituloCorto: "Teorema de Pitágoras y Aplicaciones",
            descripcion: "Explicar, de manera concreta, pictórica y simbólica, la validez del teorema de Pitágoras y aplicar a la resolución de problemas geométricos y de la vida cotidiana, de manera manual o usando software geométrico.",
            conceptosClave: ["Catetos e hipotenusa", "Tríos pitagóricos", "Demostración por descomposición de áreas", "Diagonal de un polígono"],
            recursos: {
              material: "Demostración visual dinámica de Euclides y Bhaskara del Teorema de Pitágoras",
              guiados: "Cálculo de distancias inaccesibles y diagonales en cuadriláteros y prismas",
              propuestos: "10 problemas de aplicación contextualizada en el cuaderno de evidencias",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 13",
            tituloCorto: "Transformaciones Isométricas: Clase Desafiante (Traslación, Rotación y Reflexión)",
            descripcion: "Describir la posición y el movimiento de figuras 2D (traslaciones, rotaciones y reflexiones) de manera analítica en el plano cartesiano, identificando invariantes de forma, tamaño y orientación (Evaluación Oficial 'Clase Desafiante' 8° Básico).",
            conceptosClave: ["Vector de traslación", "Simetría axial (ejes X e Y)", "Simetría central (origen)", "Rotación canónica (90°, 180°, 270°)", "Composición T seguido de G o S"],
            recursos: {
              material: "Manual Maestro y Fórmulas: Reglas algebraicas (x,y) -> (x+a, y+b), (-y, x), (x, -y), (-x, -y)",
              guiados: "Ejercicios guiados paso a paso: Traslaciones vectoriales, reflexiones en los ejes y rotaciones en el origen",
              propuestos: "Guía de Trabajo N° 6 (36 puntos pauta oficial) y evaluación interactiva 'Clase Desafiante'",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 14",
            tituloCorto: "Composición de Isometrías y Homotecia",
            descripcion: "Caracterizar la composición de movimientos isométricos y la homotecia de figuras bidimensionales: determinando el factor de escala; identificando centro de homotecia; reconociendo ampliaciones, reducciones e inversiones.",
            conceptosClave: ["Composición sucesiva de isometrías", "Razón de homotecia (k)", "Homotecia directa e inversa", "Conservación de ángulos"],
            recursos: {
              material: "Construcciones de composición de traslaciones, reflexiones y homotecias",
              guiados: "Cálculo de coordenadas de figuras transformadas sucesivamente y razones de escala",
              propuestos: "Desafíos de composición de movimientos y proyección a escala",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_4": {
        nombreUnidad: "Estadística, Medidas de Tendencia Central y Principio Combinatorio",
        eje: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 15",
            tituloCorto: "Medidas de Tendencia Central y Rango",
            descripcion: "Mostrar que comprenden las medidas de tendencia central y el rango: determinándolas en datos agrupados y no agrupados; interpretando su significado para resumir un conjunto de datos.",
            conceptosClave: ["Media aritmética ponderada", "Mediana", "Moda y clase modal", "Rango muestral"],
            recursos: {
              material: "Tablas de frecuencia por intervalos y marcas de clase",
              guiados: "Cálculo paso a paso del promedio para datos tabulados en intervalos",
              propuestos: "Análisis comparativo de dos distribuciones de notas y salarios",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 16",
            tituloCorto: "Evaluación Crítica de Gráficos Estadísticos",
            descripcion: "Evaluar la forma en que los datos están presentados: comparando la información de los mismos datos en distintos tipos de gráficos; evaluando si los gráficos representan de manera fidedigna la información.",
            conceptosClave: ["Histogramas y polígonos de frecuencia", "Gráficos circulares y de barras", "Escalas truncadas", "Sesgo visual"],
            recursos: {
              material: "Galería de gráficos engañosos publicados en medios de prensa reales",
              guiados: "Detección de distorsión por ejes no proporcionales o áreas falseadas",
              propuestos: "Taller de corrección y rediseño de infografías estadísticas",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 17",
            tituloCorto: "Principio Multiplicativo y Aditivo de Conteo",
            descripcion: "Explicar el principio combinatorio multiplicativo y el principio aditivo: a partir de situaciones concretas; representándolo con tablas y diagramas de árbol regulares.",
            conceptosClave: ["Diagrama de árbol", "Espacio muestral", "Regla del producto", "Regla de la suma"],
            recursos: {
              material: "Presentación: Combinatoria inicial, códigos de seguridad y menús",
              guiados: "Cálculo de combinaciones de vestimentas y claves alfanuméricas",
              propuestos: "10 problemas de conteo con restricciones en el cuaderno",
              evaluacionEnVivo: true
            }
          }
        ]
      }
    }
  },

  // =========================================================================
  // 1° MEDIO - D.S. N° 614/2013
  // =========================================================================
  "1_medio": {
    nivel: "1° Medio",
    descripcionNivel: "Educación Media (Formación General)",
    marcoNormativo: "Decreto Supremo N° 614/2013 - MINEDUC",
    unidades: {
      "unidad_1": {
        nombreUnidad: "Números Racionales, Potencias y Productos Notables",
        eje: "Números",
        oas: [
          {
            id: "OA 01",
            tituloCorto: "Operatoria Avanzada en Números Racionales",
            descripcion: "Calcular operaciones con números racionales en forma simbólica: aplicando la jerarquía de las operaciones y las reglas de los signos; resolviendo problemas que involucren contextos financieros, científicos y geométricos.",
            conceptosClave: ["Fracciones complejas", "Decimales periódicos y semiperiódicos", "Fracción generatriz", "Exactitud de cálculo"],
            recursos: {
              material: "Manual de conversión de decimales infinitos periódicos a fracción irreductible",
              guiados: "Resolución de expresiones combinadas fraccionarias de alta densidad",
              propuestos: "Guía de desafíos con fracciones continuas y problemas aplicados",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 02",
            tituloCorto: "Potencias de Exponente Entero y Crecimiento Exponencial",
            descripcion: "Mostrar que comprenden las potencias de base racional y exponente entero: transfiriendo propiedades de la multiplicación y división de potencias a estas bases; relacionándolas con el crecimiento y decrecimiento exponencial.",
            conceptosClave: ["Notación científica", "Crecimiento bacteriano", "Decaimiento radiactivo", "Propiedades de potencias"],
            recursos: {
              material: "Lámina interactiva: Modelos exponenciales en biología y física",
              guiados: "Resolución de problemas en notación científica y órdenes de magnitud",
              propuestos: "Taller de modelación exponencial con tablas y gráficas",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 03",
            tituloCorto: "Productos Notables y Factorización",
            descripcion: "Desarrollar los productos notables de manera concreta, pictórica y simbólica: cuadrado de binomio, suma por su diferencia, binomio con término común y cubo de binomio; aplicándolos a la factorización y simplificación algebraica.",
            conceptosClave: ["Cuadrado de binomio", "Suma por su diferencia", "Binomio con término común", "Factorización"],
            recursos: {
              material: "Demostración geométrica de productos notables con áreas y volúmenes",
              guiados: "Factorización paso a paso de trinomios de la forma x² + px + q y ax² + bx + c",
              propuestos: "Batería de 15 ejercicios de simplificación de fracciones algebraicas",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_2": {
        nombreUnidad: "Sistemas de Ecuaciones Lineales y Relaciones Lineales",
        eje: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 04",
            tituloCorto: "Sistemas de Ecuaciones Lineales 2x2",
            descripcion: "Resolver sistemas de ecuaciones lineales (2x2) relacionados con problemas de la vida diaria y de otras asignaturas: mediante representaciones gráficas y métodos algebraicos de sustitución, igualación y reducción.",
            conceptosClave: ["Método de sustitución", "Método de igualación", "Método de reducción", "Interpretación geométrica (intersección)"],
            recursos: {
              material: "Pizarra interactiva de los 3 métodos algebraicos y clasificación de sistemas (compatible determinado, indeterminado, incompatible)",
              guiados: "Resolución completa de un sistema 2x2 por los tres métodos comparando eficiencia",
              propuestos: "10 problemas de modelamiento verbal (mezclas, móviles, edades, compras)",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 05",
            tituloCorto: "Relaciones Lineales en Dos Variables ax + by = c",
            descripcion: "Graficar relaciones lineales en dos variables de la forma ax + by = c: utilizando tablas; determinando intersecciones con los ejes coordenados; reconociendo la recta como lugar geométrico.",
            conceptosClave: ["Ecuación general de la recta", "Puntos de corte con ejes X e Y", "Plano cartesiano", "Transformación a forma principal"],
            recursos: {
              material: "Guía de construcción de rectas a partir de sus interceptos (x, 0) y (0, y)",
              guiados: "Paso de la ecuación general ax + by + c = 0 a la forma principal y = mx + n",
              propuestos: "Ejercicios de graficación rápida sin tabla de valores extensa",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 06",
            tituloCorto: "Modelamiento con Funciones Lineales y Afines",
            descripcion: "Modelar situaciones de la vida diaria y de otras asignaturas usando funciones lineales y afines: determinando su dominio, recorrido, pendiente y coeficiente de posición; interpretando la tasa de cambio en contextos aplicados.",
            conceptosClave: ["Dominio y recorrido", "Tasa de variación media", "Interpolación y extrapolación lineal", "Comportamiento creciente/decreciente"],
            recursos: {
              material: "Simulador de funciones económicas: Costos fijos, variables y punto de equilibrio",
              guiados: "Determinación de la función lineal a partir de dos puntos experimentales",
              propuestos: "Desafío STEM: Modelamiento de conversión de temperaturas y resortes (Ley de Hooke)",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 07",
            tituloCorto: "Homotecia y Coordenadas en el Plano",
            descripcion: "Mostrar que comprenden la homotecia en el plano cartesiano: calculando las coordenadas de figuras transformadas; relacionándola con la semejanza y la razón de homotecia k; reconociendo el producto de homotecias.",
            conceptosClave: ["Centro de homotecia en (0,0) y en (h,k)", "Vector posición", "Razón de ampliación/reducción", "Orientación"],
            recursos: {
              material: "Applet GeoGebra: Homotecia con centro arbitrario y factor k variable",
              guiados: "Cálculo analítico: P'(x', y') = O + k(P - O)",
              propuestos: "Transformación homotética de polígonos en el plano cartesiano",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_3": {
        nombreUnidad: "Semejanza, Teorema de Tales y Cuerpos de Revolución",
        eje: "Geometría",
        oas: [
          {
            id: "OA 08",
            tituloCorto: "Criterios de Semejanza de Triángulos",
            descripcion: "Desarrollar y aplicar las propiedades de la semejanza de figuras planas y criterios de semejanza de triángulos (AA, LAL, LLL): demostrando relaciones métricas y resolviendo problemas geométricos.",
            conceptosClave: ["Razón de semejanza (r)", "Criterio Ángulo-Ángulo (AA)", "Criterio Lado-Ángulo-Lado (LAL)", "Criterio Lado-Lado-Lado (LLL)"],
            recursos: {
              material: "Presentación con demostraciones formales de los criterios de semejanza",
              guiados: "Demostración paso a paso de triángulos semejantes en cuadriláteros",
              propuestos: "Guía de 10 problemas de semejanza con justificación deductiva",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 09",
            tituloCorto: "Teorema de Tales y Trazos Proporcionales",
            descripcion: "Desarrollar el teorema de Tales sobre trazos proporcionales y aplicarlo en la resolución de problemas geométricos: dividiendo segmentos en una razón dada; relacionándolo con rectas paralelas cortadas por transversales.",
            conceptosClave: ["Rectas paralelas y secantes", "Proporcionalidad de segmentos", "División interior de trazos", "Teorema de la bisectriz interior"],
            recursos: {
              material: "Construcción animada del Teorema de Tales y corolarios geométricos",
              guiados: "Cálculo de longitudes desconocidas en figuras con múltiples paralelas",
              propuestos: "Desafío de cuaderno: División de un trazo de 13 cm en razón 3:5 con regla y compás",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 10",
            tituloCorto: "Medición Indirecta de Alturas y Distancias",
            descripcion: "Aplicar propiedades de semejanza y proporcionalidad a situaciones de medición indirecta de alturas y distancias inaccesibles en topografía, arquitectura y astronomía básica.",
            conceptosClave: ["Sombra proyectada", "Goniometría casera", "Espejos y reflexión", "Escalas topográficas"],
            recursos: {
              material: "Estudio histórico: Medición del radio de la Tierra por Eratóstenes y pirámides por Tales",
              guiados: "Cálculo de altura de un edificio mediante sombra y estaca vertical",
              propuestos: "Proyecto de campo: Medición indirecta de la altura del colegio o gimnasio",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 11",
            tituloCorto: "Área y Volumen de Conos y Pirámides",
            descripcion: "Desarrollar y aplicar las fórmulas para determinar el área de la superficie y el volumen de conos y pirámides en diversos contextos geométricos y de la vida real.",
            conceptosClave: ["Generatriz del cono", "Apotema de la pirámide", "Volumen = (1/3) Área basal × Altura", "Troncos de cono/pirámide"],
            recursos: {
              material: "Animación de vaciado de fluidos: Demostración de que 3 conos llenan 1 cilindro de igual base y altura",
              guiados: "Cálculo del área total y volumen de un cono conociendo radio y generatriz",
              propuestos: "10 ejercicios de cálculo de capacidad y cantidad de pintura en estructuras cónicas",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_4": {
        nombreUnidad: "Estadística Bivariada, Medidas de Posición y Probabilidad Condicional",
        eje: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 12",
            tituloCorto: "Tablas de Doble Entrada y Nubes de Puntos",
            descripcion: "Registrar distribuciones de dos características cuantitativas en tablas de doble entrada y nubes de puntos: analizando correlaciones cualitativas (positiva, negativa, nula); interpretando la dispersión bivariada.",
            conceptosClave: ["Variable bivariada", "Diagrama de dispersión", "Tendencia lineal", "Correlación vs causalidad"],
            recursos: {
              material: "Visualizador de correlación entre horas de estudio y puntaje SIMCE/PAES",
              guiados: "Construcción de nube de puntos e identificación cualitativa de la recta de ajuste",
              propuestos: "Análisis de datos de peso y estatura en deportistas juveniles",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 13",
            tituloCorto: "Reglas de Probabilidades y Eventos",
            descripcion: "Desarrollar las reglas de las probabilidades: regla aditiva (eventos mutuamente excluyentes y no excluyentes); regla multiplicativa (eventos independientes y dependientes); probabilidad condicional elemental.",
            conceptosClave: ["P(A U B) = P(A) + P(B) - P(A ∩ B)", "Eventos independientes: P(A ∩ B) = P(A) · P(B)", "Probabilidad condicional P(A|B)", "Extracción con y sin reposición"],
            recursos: {
              material: "Diagramas de Venn interactivos y árboles de decisión de probabilidades",
              guiados: "Resolución de problemas de extracción de bolitas de urnas con y sin reposición",
              propuestos: "Guía de 12 problemas de juegos de azar, dados, cartas y tests médicos",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 14",
            tituloCorto: "Variable Aleatoria Discreta y Función de Probabilidad",
            descripcion: "Desarrollar y aplicar el concepto de variable aleatoria discreta: determinando su recorrido y su función de probabilidad f(x); calculando la esperanza matemática (valor esperado) en situaciones de juego y riesgo.",
            conceptosClave: ["Variable aleatoria (X)", "Función de probabilidad", "Suma de probabilidades = 1", "Esperanza matemática E(X)"],
            recursos: {
              material: "Presentación: Concepto de valor esperado en seguros y apuestas justas",
              guiados: "Construcción de la tabla de distribución de X = 'número de caras al lanzar 3 monedas'",
              propuestos: "Cálculo de esperanza matemática en rifas y juegos de feria",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 15",
            tituloCorto: "Medidas de Posición (Cuartiles, Percentiles) y Box-Plots",
            descripcion: "Comparar dos o más poblaciones usando medidas de posición: calculando cuartiles, deciles y percentiles; construyendo diagramas de cajón y bigotes (box-plots); identificando rango intercuartílico y asimetría.",
            conceptosClave: ["Q1, Q2 (Mediana), Q3", "Percentiles (P1 a P99)", "Rango Intercuartílico (RIC)", "Diagrama de cajón (Box-plot)"],
            recursos: {
              material: "Generador dinámico de diagramas de cajón y detección de valores atípicos (outliers)",
              guiados: "Cálculo de Q1, Q2 y Q3 para una muestra de 40 datos y dibujo a escala del box-plot",
              propuestos: "Comparación visual del rendimiento de dos cursos mediante box-plots paralelos",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 16",
            tituloCorto: "Simulación de Experimentos Aleatorios",
            descripcion: "Planificar y realizar experimentos aleatorios simples y compuestos: calculando probabilidades teóricas y frecuencias relativas; aplicando la Ley de los Grandes Números mediante simuladores digitales.",
            conceptosClave: ["Frecuencia relativa", "Ley de los grandes números", "Convergencia probabilística", "Simulación Montecarlo"],
            recursos: {
              material: "Simulador de lanzamientos masivos (10.000 iteraciones en JavaScript)",
              guiados: "Contraste entre probabilidad clásica de Laplace y probabilidad frecuentista",
              propuestos: "Informe experimental: Lanzamiento de chinchetas y estimación de probabilidad empírica",
              evaluacionEnVivo: true
            }
          }
        ]
      }
    }
  },

  // =========================================================================
  // 2° MEDIO - D.S. N° 614/2013
  // =========================================================================
  "2_medio": {
    nivel: "2° Medio",
    descripcionNivel: "Educación Media (Formación General)",
    marcoNormativo: "Decreto Supremo N° 614/2013 - MINEDUC",
    unidades: {
      "unidad_1": {
        nombreUnidad: "Números Reales, Raíces Enésimas y Logaritmos",
        eje: "Números",
        oas: [
          {
            id: "OA 01",
            tituloCorto: "Números Reales, Raíces Enésimas y Racionalización",
            descripcion: "Realizar cálculos y estimaciones que involucren operaciones con números reales y raíces enésimas: utilizando sus propiedades algebraicas; aplicando la racionalización del denominador (monomio y binomio con raíces cuadradas); resolviendo problemas en ciencias exactas.",
            conceptosClave: ["Conjunto de los Reales (R)", "Números irracionales notables", "Propiedades de raíces enésimas", "Racionalización con conjugado"],
            recursos: {
              material: "Pizarra interactiva: Álgebra de radicales, descomposición y racionalización",
              guiados: "Racionalización paso a paso de fracciones con binomios en el denominador (a / (√b ± √c))",
              propuestos: "Guía de 12 ejercicios de simplificación extrema de expresiones con raíces",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 02",
            tituloCorto: "Logaritmos y sus Propiedades",
            descripcion: "Mostrar que comprenden las relaciones entre potencias, raíces enésimas y logaritmos: convirtiendo de una forma a otra (b^c = a <=> log_b(a) = c); aplicando propiedades de logaritmos de productos, cocientes y potencias; resolviendo ecuaciones logarítmicas básicas.",
            conceptosClave: ["Definición de logaritmo", "Logaritmo de un producto y cociente", "Logaritmo de una potencia y raíz", "Cambio de base"],
            recursos: {
              material: "Presentación: Escalas logarítmicas en la naturaleza (Richter para sismos, pH químico, Decibeles sonoros)",
              guiados: "Aplicación de propiedades para reducir expresiones logarítmicas a un solo argumento",
              propuestos: "15 desafíos en cuaderno de cálculo de logaritmos y ecuaciones exponenciales sencillas",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_2": {
        nombreUnidad: "Función Cuadrática y Ecuaciones de Segundo Grado",
        eje: "Álgebra y Funciones",
        oas: [
          {
            id: "OA 03",
            tituloCorto: "Función Cuadrática y Análisis de la Parábola",
            descripcion: "Mostrar que comprenden la función cuadrática f(x) = ax² + bx + c: reconociendo su forma gráfica (parábola); determinando vértice V(-b/2a, f(-b/2a)), eje de simetría x = -b/2a, concavidad (signo de a) e intersecciones con los ejes; relacionándola con fenómenos cuadráticos.",
            conceptosClave: ["Parábola", "Vértice y eje de simetría", "Concavidad (a > 0 / a < 0)", "Máximos y mínimos"],
            recursos: {
              material: "Laboratorio GeoGebra: Efecto de los parámetros a, b y c en la posición y apertura de la parábola",
              guiados: "Cálculo analítico del vértice y bosquejo preciso de f(x) = -2x² + 8x - 3",
              propuestos: "Problemas de optimización: Área máxima de cercado de terrenos y trayectoria de proyectiles",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 04",
            tituloCorto: "Ecuaciones de Segundo Grado y Discriminante",
            descripcion: "Resolver ecuaciones de segundo grado de la forma ax² + bx + c = 0: mediante factorización, completación de cuadrados y fórmula general x = (-b ± √(b² - 4ac)) / (2a); analizando la naturaleza de sus raíces según el discriminante Δ = b² - 4ac.",
            conceptosClave: ["Fórmula general cuadrática", "Discriminante Δ > 0, Δ = 0, Δ < 0", "Raíces reales e imaginarias", "Propiedades de las raíces (suma -b/a y producto c/a)"],
            recursos: {
              material: "Árbol de decisión del discriminante y tipos de intersección con el eje X",
              guiados: "Resolución de ecuación cuadrática por completación de cuadrados perfecta",
              propuestos: "12 ecuaciones de 2° grado con coeficientes enteros y fraccionarios",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 05",
            tituloCorto: "Modelamiento con la Función Cuadrática",
            descripcion: "Modelar situaciones o fenómenos de la vida cotidiana y de otras ciencias (cinemática, economía de ingresos y costos, ingeniería estructural) mediante la función cuadrática y ecuaciones de segundo grado.",
            conceptosClave: ["Lanzamiento vertical y gravedad", "Ingreso = Precio × Cantidad", "Puntos de equilibrio", "Puentes colgantes y arcos parabólicos"],
            recursos: {
              material: "Simulador de física: Cinemática de proyectiles y altura máxima",
              guiados: "Modelamiento del ingreso máximo para una empresa de conciertos con variación de precio",
              propuestos: "Proyecto grupal en cuaderno: Diseño de un puente parabólico a escala",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_3": {
        nombreUnidad: "Trigonometría, Geometría de la Circunferencia y Cuerpos Redondos",
        eje: "Geometría",
        oas: [
          {
            id: "OA 06",
            tituloCorto: "Razones Trigonométricas en el Triángulo Rectángulo",
            descripcion: "Desarrollar el concepto de razones trigonométricas en triángulos rectángulos (seno, coseno, tangente): aplicándolas en la resolución de problemas geométricos y de topografía; deduciendo razones de ángulos notables (30°, 45°, 60°); aplicando la identidad fundamental sen²α + cos²α = 1.",
            conceptosClave: ["Seno (cateto opuesto/hipotenusa)", "Coseno (cateto adyacente/hipotenusa)", "Tangente (opuesto/adyacente)", "Ángulos de elevación y depresión"],
            recursos: {
              material: "Círculo trigonométrico interactivo y tabla de valores exactos de 30°, 45° y 60°",
              guiados: "Cálculo de la altura de un faro con ángulo de elevación y distancia basal",
              propuestos: "Guía de 10 problemas de navegación marítima y altimetría con razones trigonométricas",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 07",
            tituloCorto: "Ángulos en la Circunferencia",
            descripcion: "Desarrollar y aplicar propiedades de ángulos del centro y ángulos inscritos en una circunferencia: demostrando que el ángulo del centro mide el doble del ángulo inscrito que subtiende el mismo arco; aplicando propiedades de cuadriláteros inscritos.",
            conceptosClave: ["Ángulo del centro", "Ángulo inscrito", "Arco subtendido", "Ángulo semi-inscrito e interior/exterior"],
            recursos: {
              material: "Demostración dinámica: Invarianza del ángulo inscrito al mover el vértice sobre la circunferencia",
              guiados: "Cálculo de ángulos desconocidos en polígonos inscritos en la circunferencia",
              propuestos: "Desafíos deductivos de geometría euclidiana en el cuaderno",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 08",
            tituloCorto: "Relaciones Métricas en la Circunferencia",
            descripcion: "Aplicar relaciones métricas en la circunferencia: teorema de las cuerdas que se cortan interiormente; teorema de las secantes desde un punto exterior; teorema de la secante y la tangente.",
            conceptosClave: ["Teorema de las cuerdas (PA · PB = PC · PD)", "Teorema de las secantes", "Teorema de la tangente (PT² = PA · PB)", "Potencia de un punto"],
            recursos: {
              material: "Lámina geométrica con esquemas de proporcionalidad en la circunferencia",
              guiados: "Resolución algebraica de longitud de cuerdas aplicando ecuaciones lineales o cuadráticas",
              propuestos: "10 problemas de trazos y tangentes a la circunferencia",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 09",
            tituloCorto: "Área y Volumen de la Esfera y Cuerpos de Revolución",
            descripcion: "Determinar el área de la superficie y el volumen de la esfera y de cuerpos generados por rotación de figuras planas (cilindro, cono, toro) alrededor de un eje de revolución.",
            conceptosClave: ["Área de la esfera: A = 4πr²", "Volumen de la esfera: V = (4/3)πr³", "Eje de rotación", "Sólidos de revolución"],
            recursos: {
              material: "Animación 3D de rotación de triángulos, rectángulos y semicírculos en el espacio",
              guiados: "Cálculo del volumen de un tanque esférico de gas y su área de pintura exterior",
              propuestos: "Taller de cálculo de cuerpos compuestos (cilindro con cúpula semiesférica)",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "unidad_4": {
        nombreUnidad: "Medidas de Dispersión, Combinatoria y Variable Continua",
        eje: "Probabilidad y Estadística",
        oas: [
          {
            id: "OA 10",
            tituloCorto: "Medidas de Dispersión (Varianza, Desviación Estándar)",
            descripcion: "Utilizar medidas de dispersión (rango, desviación media, varianza y desviación estándar) para la toma de decisiones fundadas en datos muestrales: comparando la homogeneidad de dos o más conjuntos de datos con promedios similares.",
            conceptosClave: ["Varianza (σ² / s²)", "Desviación estándar (σ / s)", "Coeficiente de variación (CV)", "Homogeneidad muestral"],
            recursos: {
              material: "Calculadora estadística interactiva y visualización del alejamiento respecto a la media",
              guiados: "Cálculo manual de varianza y desviación estándar con tabla de desvíos al cuadrado",
              propuestos: "Toma de decisiones: Selección de un atleta de tiro al blanco según consistencia estadística",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 11",
            tituloCorto: "Combinatoria (Permutaciones, Variaciones, Combinaciones)",
            descripcion: "Comprender y aplicar técnicas de conteo: principio multiplicativo, permutaciones simples y con repetición, variaciones y combinaciones; utilizándolas en el cálculo formal de probabilidades de Laplace.",
            conceptosClave: ["Factorial (n!)", "Permutaciones P_n = n!", "Variaciones V(n,k) = n!/(n-k)!", "Combinaciones C(n,k) = n!/(k!(n-k)!)"],
            recursos: {
              material: "Esquema conceptual interactivo: ¿Importa el orden? ¿Se usan todos los elementos?",
              guiados: "Distinción entre armar una directiva (orden importa) vs una comisión de delegados (no importa)",
              propuestos: "15 problemas de combinatoria aplicada a loterías, claves de tarjetas y torneos deportivos",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 12",
            tituloCorto: "Variable Aleatoria Continua y Distribuciones",
            descripcion: "Explicar los conceptos de variable aleatoria continua y función de densidad: interpretando el área bajo la curva como probabilidad; reconociendo la distribución normal y la campana de Gauss en fenómenos biológicos y sociales.",
            conceptosClave: ["Variable continua", "Función de densidad f(x)", "Área bajo la curva = 1", "Distribución Normal estándar Z"],
            recursos: {
              material: "Simulador de la campana de Gauss y regla empírica 68-95-99.7%",
              guiados: "Cálculo de probabilidades continuas en intervalos mediante áreas geométricas simples",
              propuestos: "Análisis de distribución de estaturas y tiempos de reacción humana",
              evaluacionEnVivo: true
            }
          }
        ]
      }
    }
  },

  // =========================================================================
  // 3° MEDIO - D.S. N° 193/2019 (Formación General + Diferenciada TP)
  // =========================================================================
  "3_medio": {
    nivel: "3° Medio",
    descripcionNivel: "Educación Media (Formación General y Técnico Profesional)",
    marcoNormativo: "Decreto Supremo N° 193/2019 - MINEDUC",
    unidades: {
      "modulo_1": {
        nombreUnidad: "Modelación de Fenómenos con Crecimiento Exponencial y Logarítmico",
        eje: "Álgebra y Funciones / Modelamiento",
        oas: [
          {
            id: "OA 01",
            tituloCorto: "Modelos Exponenciales, Logarítmicos y de Potencias",
            descripcion: "Construir modelos de situaciones o fenómenos de crecimiento y decrecimiento exponencial, logarítmico y de potencias, utilizando representaciones gráficas, simbólicas y software digital: identificando asíntotas, dominios restringidos y tasas de cambio relativas.",
            conceptosClave: ["Función exponencial f(x) = a · b^x", "Función logarítmica f(x) = log_b(x)", "Asíntotas verticales y horizontales", "Tiempo de duplicación y vida media"],
            recursos: {
              material: "Applet GeoGebra: Modelado de propagación epidémica y desintegración de carbono 14",
              guiados: "Ajuste de una curva exponencial a partir de pares de datos experimentales",
              propuestos: "Guía de proyectos: Modelamiento del crecimiento de colonias de levadura en laboratorio TP",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "modulo_2": {
        nombreUnidad: "Toma de Decisiones en Incertidumbre y Probabilidad Condicional",
        eje: "Probabilidad y Estadística / Inferencia",
        oas: [
          {
            id: "OA 02",
            tituloCorto: "Probabilidad Condicional y Teorema de Bayes",
            descripcion: "Tomar decisiones fundamentadas en situaciones de incertidumbre, utilizando el cálculo de probabilidades condicionales, tablas de contingencia y el teorema de Bayes en contextos reales (diagnósticos médicos, filtros de spam, control de calidad industrial y peritajes).",
            conceptosClave: ["Probabilidad condicional P(A|B)", "Tablas de contingencia 2x2", "Sensibilidad y especificidad", "Teorema de Bayes y árboles ponderados"],
            recursos: {
              material: "Pizarra interactiva de Bayes: Paradoja del falso positivo en pruebas médicas masivas",
              guiados: "Cálculo de la probabilidad real de padecer una enfermedad dado un test positivo",
              propuestos: "10 problemas de toma de decisiones judiciales, industriales y financieras bajo incertidumbre",
              evaluacionEnVivo: true
            }
          },
          {
            id: "OA 03",
            tituloCorto: "Evaluación Crítica de Argumentos Estadísticos en Medios",
            descripcion: "Evaluar críticamente información estadística y argumentaciones presentes en medios de comunicación, redes sociales y reportes científicos: reconociendo sesgos muestrales, manipulación de escalas en gráficos, correlación espuria versus causalidad y muestras no representativas.",
            conceptosClave: ["Muestra representativa vs sesgada", "Correlación no implica causalidad", "Variables confusoras (lurking variables)", "Falacias estadísticas"],
            recursos: {
              material: "Dossier de noticias reales con gráficos manipulados y estudios de correlación absurda",
              guiados: "Análisis forense de una encuesta electoral con muestra autoreclutada",
              propuestos: "Taller crítico: Redacción de un informe de refutación de afirmaciones pseudocientíficas",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "modulo_3": {
        nombreUnidad: "Educación Económica y Financiera para la Ciudadanía",
        eje: "Números y Sociedad / Finanzas",
        oas: [
          {
            id: "OA 04",
            tituloCorto: "Matemática Financiera, Créditos e Inflación",
            descripcion: "Resolver problemas que involucren conceptos financieros básicos (tasa de interés simple y compuesto, UF, inflación / IPC, valor futuro, amortización de créditos de consumo/hipotecarios, CAE y rentabilidad de inversiones) para el bienestar y la toma de decisiones económicas responsables.",
            conceptosClave: ["Interés compuesto: Vf = Vi · (1 + i)^n", "Unidad de Fomento (UF) e IPC", "Carga Anual Equivalente (CAE) y Costo Total del Crédito (CTC)", "Sistemas de amortización"],
            recursos: {
              material: "Simulador de créditos SERNAC: Comparación de ofertas bancarias y casas comerciales",
              guiados: "Cálculo del costo total de un crédito de consumo de $1.000.000 a 24 cuotas",
              propuestos: "Simulación de presupuesto familiar: Plan de ahorro previsional y compra de vivienda",
              evaluacionEnVivo: true
            }
          }
        ]
      }
    }
  },

  // =========================================================================
  // 4° MEDIO - D.S. N° 193/2019 (Formación General + Diferenciada TP)
  // =========================================================================
  "4_medio": {
    nivel: "4° Medio",
    descripcionNivel: "Educación Media (Formación General y Técnico Profesional)",
    marcoNormativo: "Decreto Supremo N° 193/2019 - MINEDUC",
    unidades: {
      "modulo_1": {
        nombreUnidad: "Decisiones Financieras Avanzadas y Evaluación de Proyectos",
        eje: "Números y Finanzas / Proyectos",
        oas: [
          {
            id: "OA 01",
            tituloCorto: "Evaluación de Proyectos, Inversión, Riesgo y Retorno",
            descripcion: "Fundamentar decisiones en el ámbito financiero y de proyectos personales, técnicos o comunitarios: evaluando alternativas de ahorro, endeudamiento, inversión, riesgo y retorno con modelos matemáticos y simuladores (VAN, TIR, depreciación de activos).",
            conceptosClave: ["Valor Actual Neto (VAN)", "Tasa Interna de Retorno (TIR)", "Relación Riesgo-Retorno", "Depreciación de maquinaria técnica"],
            recursos: {
              material: "Plantilla de hoja de cálculo: Flujo de caja proyectado para emprendimiento o taller TP",
              guiados: "Evaluación de rentabilidad de dos alternativas de compra de equipamiento tecnológico",
              propuestos: "Proyecto integrador: Formulación de plan financiero para microempresa técnica",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "modulo_2": {
        nombreUnidad: "Modelación de Fenómenos Periódicos y Ondulatorios",
        eje: "Álgebra y Funciones / Fenómenos Periódicos",
        oas: [
          {
            id: "OA 02",
            tituloCorto: "Funciones Periódicas (Seno y Coseno) en la Naturaleza",
            descripcion: "Modelar fenómenos naturales, sociales, físicos y productivos mediante funciones periódicas (trigonométricas f(x) = A · sen(Bx + C) + D): analizando amplitud, frecuencia, período, desfase y tendencias a largo plazo.",
            conceptosClave: ["Amplitud (A)", "Período (T = 2π/B)", "Desfase horizontal y desplazamiento vertical", "Corriente alterna, mareas y ciclos biológicos"],
            recursos: {
              material: "Simulador de osciloscopio virtual: Ondas sonoras, voltaje alterno y funciones senoidales",
              guiados: "Ajuste de la ecuación senoidal para modelar la fluctuación de temperaturas a lo largo del año",
              propuestos: "10 problemas de modelamiento de mareas y vibraciones mecánicas en el cuaderno",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "modulo_3": {
        nombreUnidad: "Programación Lineal y Optimización de Recursos",
        eje: "Álgebra y Geometría / Optimización",
        oas: [
          {
            id: "OA 03",
            tituloCorto: "Programación Lineal y Región de Factibilidad",
            descripcion: "Resolver problemas de optimización lineal y toma de decisiones estratégicas en contextos cotidianos, productivos, logísticos y de gestión: utilizando sistemas de inecuaciones lineales, determinando la región factible poligonal y maximizando/minimizando la función objetivo en los vértices.",
            conceptosClave: ["Función objetivo Z = ax + by", "Restricciones lineales (inecuaciones)", "Región factible convexa", "Teorema fundamental de la programación lineal (vértices)"],
            recursos: {
              material: "Pizarra interactiva de Programación Lineal con sombreado de semiplanos y rectas de nivel",
              guiados: "Resolución de problema de maximización de utilidades en taller de producción con restricción de horas y materia prima",
              propuestos: "Desafío de optimización: Dieta balanceada al menor costo o mezcla óptima de fertilizantes",
              evaluacionEnVivo: true
            }
          }
        ]
      },
      "modulo_4": {
        nombreUnidad: "Inferencia Estadística, Muestreo e Intervalos de Confianza",
        eje: "Probabilidad y Estadística / Inferencia",
        oas: [
          {
            id: "OA 04",
            tituloCorto: "Muestreo Probabilístico e Intervalos de Confianza",
            descripcion: "Diseñar y evaluar estudios estadísticos y muestreos probabilísticos para inferir parámetros poblacionales (media y proporción): calculando e interpretando intervalos de confianza con niveles del 90%, 95% y 99%; comprendiendo el margen de error y el Teorema del Límite Central.",
            conceptosClave: ["Muestreo aleatorio simple", "Teorema del Límite Central", "Intervalo de confianza para la media: X̄ ± Z · (σ/√n)", "Margen de error"],
            recursos: {
              material: "Simulador de remuestreo (Bootstrap) y distribución de medias muestrales",
              guiados: "Cálculo del tamaño muestral necesario para estimar la aprobación de un producto con error menor al 3%",
              propuestos: "Informe de inferencia: Análisis de resultados de encuestas sociodemográficas reales",
              evaluacionEnVivo: true
            }
          }
        ]
      }
    }
  }
};
