// Generador de apoyos visuales vectoriales (SVG) para los 14 ejercicios de Homotecia

export function svgHomologousSides(kVal: string = '2,5'): string {
  return `<svg viewBox="0 0 460 210" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="165" r="5" fill="#ef4444" />
    <text x="40" y="190" fill="#f87171" font-size="12" font-weight="bold">Centro O</text>
    <line x1="50" y1="165" x2="420" y2="40" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
    <line x1="50" y1="165" x2="445" y2="140" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
    <line x1="50" y1="165" x2="330" y2="195" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
    <!-- Original ABC -->
    <polygon points="120,135 165,160 135,105" fill="url(#g1)" fill-opacity="0.4" stroke="#38bdf8" stroke-width="2" />
    <text x="106" y="138" fill="#bae6fd" font-size="12" font-weight="bold">A</text>
    <text x="172" y="172" fill="#bae6fd" font-size="12" font-weight="bold">B</text>
    <text x="130" y="98" fill="#bae6fd" font-size="12" font-weight="bold">C</text>
    <!-- Imagen A'B'C' -->
    <polygon points="225,85 338,148 262,25" fill="url(#g2)" fill-opacity="0.4" stroke="#34d399" stroke-width="2.5" />
    <text x="206" y="88" fill="#a7f3d0" font-size="13" font-weight="bold">A'</text>
    <text x="346" y="156" fill="#a7f3d0" font-size="13" font-weight="bold">B'</text>
    <text x="256" y="20" fill="#a7f3d0" font-size="13" font-weight="bold">C'</text>
    <!-- Highlight parallelism -->
    <line x1="120" y1="135" x2="165" y2="160" stroke="#f59e0b" stroke-width="3" />
    <line x1="225" y1="85" x2="338" y2="148" stroke="#f59e0b" stroke-width="3" />
    <rect x="255" y="160" width="190" height="38" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
    <text x="350" y="176" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Lados Homólogos Paralelos</text>
    <text x="350" y="191" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">A'B' ∥ AB (k = ${kVal})</text>
  </svg>`;
}

export function svgSideLength(lVal: number, lpVal: number, kVal: string = '2,5'): string {
  return `<svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="50" cy="80" r="5" fill="#ef4444" />
    <text x="40" y="105" fill="#f87171" font-size="12" font-weight="bold">O</text>
    <line x1="50" y1="80" x2="430" y2="80" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
    <!-- Segmento original AB -->
    <line x1="110" y1="60" x2="110" y2="100" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
    <text x="110" y="50" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">AB = ${lVal} cm</text>
    <!-- Segmento ampliado A'B' -->
    <line x1="270" y1="30" x2="270" y2="130" stroke="#34d399" stroke-width="5" stroke-linecap="round" />
    <text x="270" y="22" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">A'B' = k · AB</text>
    <rect x="330" y="55" width="115" height="50" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
    <text x="387" y="75" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">k = ${kVal}</text>
    <text x="387" y="93" fill="#a7f3d0" font-size="12" font-weight="black" text-anchor="middle">${lpVal} cm</text>
  </svg>`;
}

export function svgCenterDistance(oa: number, oap: number, k: number = 3): string {
  return `<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="50" cy="85" r="5" fill="#ef4444" />
    <text x="40" y="110" fill="#f87171" font-size="12" font-weight="bold">O</text>
    <line x1="50" y1="85" x2="430" y2="85" stroke="#94a3b8" stroke-width="2" />
    <!-- Punto A -->
    <circle cx="160" cy="85" r="5" fill="#38bdf8" />
    <text x="160" y="70" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">A</text>
    <!-- Punto A' -->
    <circle cx="380" cy="85" r="5" fill="#34d399" />
    <text x="380" y="70" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">A'</text>
    <!-- Cota OA -->
    <path d="M 50,120 L 160,120" stroke="#38bdf8" stroke-width="1.5" marker-start="url(#dot)" marker-end="url(#dot)" />
    <text x="105" y="138" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">OA = ${oa} cm</text>
    <!-- Cota OA' -->
    <path d="M 50,150 L 380,150" stroke="#34d399" stroke-width="1.5" />
    <text x="215" y="165" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">OA' = ${oap} cm (k = OA'/OA = ${k})</text>
  </svg>`;
}

export function svgInverseReduction(kStr: string = '-0,5'): string {
  return `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Centro O en el centro -->
    <circle cx="230" cy="90" r="5" fill="#ef4444" />
    <text x="222" y="115" fill="#f87171" font-size="12" font-weight="bold">Centro O</text>
    <line x1="30" y1="90" x2="430" y2="90" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
    <!-- Figura original a la derecha (directa) -->
    <polygon points="340,50 390,130 310,130" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" />
    <text x="350" y="145" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Original F</text>
    <!-- Figura inversa reducida a la izquierda (k negativo y menor en tamaño) -->
    <polygon points="120,110 95,70 135,70" fill="#f43f5e" fill-opacity="0.4" stroke="#f43f5e" stroke-width="2" />
    <text x="115" y="60" fill="#fda4af" font-size="11" font-weight="bold" text-anchor="middle">Imagen F' (Invertida y Reducida)</text>
    <rect x="135" y="140" width="190" height="30" rx="6" fill="#1e293b" stroke="#f43f5e" stroke-width="1"/>
    <text x="230" y="160" fill="#fda4af" font-size="11" font-weight="bold" text-anchor="middle">-1 &lt; k &lt; 0 (k = ${kStr})</text>
  </svg>`;
}

export function svgAnglePreservation(a1: number, a2: number, a3: number): string {
  return `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Triángulo 1 -->
    <polygon points="60,140 160,140 100,50" fill="#38bdf8" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2" />
    <text x="100" y="125" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">${a1}° / ${a2}° / ${a3}°</text>
    <text x="100" y="160" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">Original ABC</text>
    <!-- Triángulo 2 (ampliado) -->
    <polygon points="230,150 420,150 310,20" fill="#34d399" fill-opacity="0.25" stroke="#34d399" stroke-width="2" />
    <text x="320" y="130" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">${a1}° / ${a2}° / ${a3}°</text>
    <text x="320" y="170" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">Homotético A'B'C' (Ángulos Invariantes)</text>
  </svg>`;
}

export function svgAreaVariation(origArea: number, newArea: number, k: number = 3): string {
  return `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Original -->
    <rect x="50" y="70" width="50" height="40" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" />
    <text x="75" y="95" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">${origArea} cm²</text>
    <text x="75" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">Área original</text>
    <!-- Flecha factor k^2 -->
    <text x="175" y="85" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">Área' = k² · Área</text>
    <text x="175" y="105" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">${k}² = ${k * k} veces</text>
    <!-- Ampliada en cuadrícula 3x3 -->
    <rect x="250" y="20" width="150" height="120" fill="#10b981" fill-opacity="0.2" stroke="#34d399" stroke-width="2" />
    <!-- Líneas internas de subdivisión -->
    <line x1="300" y1="20" x2="300" y2="140" stroke="#34d399" stroke-width="1" stroke-dasharray="2,2" />
    <line x1="350" y1="20" x2="350" y2="140" stroke="#34d399" stroke-width="1" stroke-dasharray="2,2" />
    <line x1="250" y1="60" x2="400" y2="60" stroke="#34d399" stroke-width="1" stroke-dasharray="2,2" />
    <line x1="250" y1="100" x2="400" y2="100" stroke="#34d399" stroke-width="1" stroke-dasharray="2,2" />
    <text x="325" y="85" fill="#34d399" font-size="14" font-weight="black" text-anchor="middle">${newArea} cm²</text>
    <text x="325" y="160" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">9 bloques de ${origArea} cm²</text>
  </svg>`;
}

export function svgPerimeterNegative(origP: number, newP: number, k: number = -2): string {
  return `<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="210" cy="85" r="5" fill="#ef4444" />
    <text x="202" y="110" fill="#f87171" font-size="11" font-weight="bold">Centro O</text>
    <line x1="30" y1="85" x2="430" y2="85" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
    <!-- Original a la izquierda -->
    <polygon points="120,55 170,115 100,115" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" />
    <text x="135" y="135" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">P = ${origP} cm</text>
    <!-- Invertida ampliada a la derecha -->
    <polygon points="330,135 270,35 390,35" fill="#ec4899" fill-opacity="0.3" stroke="#f472b6" stroke-width="2.5" />
    <text x="330" y="155" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">P' = |${k}| · P = ${newP} cm</text>
    <rect x="235" y="70" width="190" height="24" rx="4" fill="#1e293b" stroke="#f472b6" stroke-width="1"/>
    <text x="330" y="86" fill="#fbcfe8" font-size="10" font-weight="bold" text-anchor="middle">Perímetro SIEMPRE POSITIVO</text>
  </svg>`;
}

export function svgCentralSymmetry(): string {
  return `<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="230" cy="85" r="5" fill="#ef4444" />
    <text x="222" y="110" fill="#f87171" font-size="12" font-weight="bold">O (Punto Medio)</text>
    <line x1="70" y1="50" x2="390" y2="120" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
    <line x1="120" y1="120" x2="340" y2="50" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
    <!-- Figura F -->
    <polygon points="90,45 130,85 70,105" fill="#38bdf8" fill-opacity="0.35" stroke="#38bdf8" stroke-width="2" />
    <text x="95" y="125" fill="#38bdf8" font-size="12" font-weight="bold">Figura F</text>
    <!-- Figura F' (rotación 180°) -->
    <polygon points="370,125 330,85 390,65" fill="#a855f7" fill-opacity="0.35" stroke="#c084fc" stroke-width="2" />
    <text x="345" y="145" fill="#c084fc" font-size="12" font-weight="bold">F' (k = -1)</text>
    <!-- Arco de rotación 180° -->
    <path d="M 215,65 A 25 25 0 0 1 245,65" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
    <text x="230" y="55" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Giro de 180° (Simetría Central)</text>
  </svg>`;
}

export function svgReverseDistance(oa: number, oap: number, k: number = 2): string {
  return `<svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="50" cy="80" r="5" fill="#ef4444" />
    <text x="40" y="105" fill="#f87171" font-size="12" font-weight="bold">O</text>
    <line x1="50" y1="80" x2="420" y2="80" stroke="#94a3b8" stroke-width="2" />
    <!-- A incógnita -->
    <circle cx="210" cy="80" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5" />
    <text x="210" y="65" fill="#f59e0b" font-size="12" font-weight="black" text-anchor="middle">A = ?</text>
    <!-- A' conocido -->
    <circle cx="370" cy="80" r="5" fill="#34d399" />
    <text x="370" y="65" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">A'</text>
    <!-- Cota total OA' -->
    <path d="M 50,125 L 370,125" stroke="#34d399" stroke-width="1.5" />
    <text x="210" y="142" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">OA' = ${oap} cm (k = ${k}) &rarr; OA = ${oap}/${k} = ${oa} cm</text>
  </svg>`;
}

export function svgCameraObscura(): string {
  return `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Caja / Cámara oscura -->
    <rect x="220" y="30" width="200" height="130" fill="#0f172a" stroke="#64748b" stroke-width="2" rx="4"/>
    <!-- Orificio pinhole (Centro O) -->
    <line x1="220" y1="30" x2="220" y2="85" stroke="#64748b" stroke-width="4"/>
    <line x1="220" y1="105" x2="220" y2="160" stroke="#64748b" stroke-width="4"/>
    <circle cx="220" cy="95" r="5" fill="#ef4444"/>
    <text x="212" y="115" fill="#f87171" font-size="11" font-weight="bold">Centro O</text>
    <!-- Objeto exterior (árbol o flecha) -->
    <line x1="60" y1="160" x2="60" y2="35" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
    <polygon points="60,25 50,45 70,45" fill="#38bdf8"/>
    <text x="60" y="180" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Objeto Real</text>
    <!-- Rayos cruzados por el pinhole -->
    <line x1="60" y1="25" x2="400" y2="145" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="60" y1="160" x2="400" y2="45" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
    <!-- Imagen invertida en la pared posterior -->
    <line x1="400" y1="50" x2="400" y2="140" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
    <polygon points="400,150 392,135 408,135" fill="#f43f5e"/>
    <text x="340" y="175" fill="#fda4af" font-size="11" font-weight="bold" text-anchor="middle">Imagen Invertida (-1 &lt; k &lt; 0)</text>
  </svg>`;
}

export function svgTriangleDevelopment(ab: number, bc: number, ca: number, oa: number, k: number = 3): string {
  const abP = ab * k;
  const bcP = bc * k;
  const caP = ca * k;
  const oaP = oa * k;
  const pOrig = ab + bc + ca;
  const pNew = pOrig * k;

  return `<svg viewBox="0 0 460 210" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <circle cx="45" cy="160" r="5" fill="#ef4444" />
    <text x="35" y="185" fill="#f87171" font-size="11" font-weight="bold">O</text>
    <!-- Rayos de proyección -->
    <line x1="45" y1="160" x2="410" y2="35" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
    <line x1="45" y1="160" x2="435" y2="135" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
    <!-- Triángulo ABC -->
    <polygon points="120,135 160,155 130,95" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" />
    <text x="145" y="172" fill="#38bdf8" font-size="10" font-weight="bold">${ab}</text>
    <text x="153" y="125" fill="#38bdf8" font-size="10" font-weight="bold">${bc}</text>
    <text x="110" y="112" fill="#38bdf8" font-size="10" font-weight="bold">${ca}</text>
    <!-- Triángulo A'B'C' ampliado -->
    <polygon points="230,85 350,145 260,25" fill="#34d399" fill-opacity="0.3" stroke="#34d399" stroke-width="2.5" />
    <text x="300" y="145" fill="#34d399" font-size="11" font-weight="bold">${abP}</text>
    <text x="320" y="80" fill="#34d399" font-size="11" font-weight="bold">${bcP}</text>
    <text x="230" y="50" fill="#34d399" font-size="11" font-weight="bold">${caP}</text>
    <rect x="250" y="160" width="195" height="42" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
    <text x="347" y="175" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">OA = ${oa} cm &rarr; OA' = ${oaP} cm</text>
    <text x="347" y="192" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">P = ${pOrig} cm &rarr; P' = ${pNew} cm</text>
  </svg>`;
}

export function svgSquareAreaDevelopment(side: number, k: number = 2): string {
  const sideP = side * k;
  const areaOrig = side * side;
  const areaP = areaOrig * (k * k);

  return `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Cuadrado original -->
    <rect x="50" y="70" width="50" height="50" fill="#38bdf8" fill-opacity="0.35" stroke="#38bdf8" stroke-width="2" />
    <text x="75" y="62" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">L = ${side} cm</text>
    <text x="75" y="100" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">${areaOrig} cm²</text>
    <text x="75" y="140" fill="#94a3b8" font-size="10" text-anchor="middle">Original</text>
    <!-- Cuadrado ampliado k=2 -->
    <rect x="220" y="25" width="100" height="100" fill="#10b981" fill-opacity="0.25" stroke="#34d399" stroke-width="2" />
    <!-- 4 cuadrantes -->
    <line x1="270" y1="25" x2="270" y2="125" stroke="#34d399" stroke-width="1.5" stroke-dasharray="2,2" />
    <line x1="220" y1="75" x2="320" y2="75" stroke="#34d399" stroke-width="1.5" stroke-dasharray="2,2" />
    <text x="270" y="18" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">L' = ${sideP} cm</text>
    <text x="270" y="80" fill="#34d399" font-size="14" font-weight="black" text-anchor="middle">${areaP} cm²</text>
    <rect x="335" y="55" width="115" height="55" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
    <text x="392" y="75" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">k = ${k} (k² = ${k*k})</text>
    <text x="392" y="95" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">4 × ${areaOrig} = ${areaP}</text>
  </svg>`;
}

export function svgShadowSculpture(hSculpture: number, dLight: number, dWall: number, k: number = 3): string {
  const hShadow = (hSculpture * k).toFixed(1).replace('.', ',');
  const hSculptureStr = hSculpture.toString().replace('.', ',');

  return `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Suelo -->
    <line x1="30" y1="150" x2="430" y2="150" stroke="#64748b" stroke-width="3" />
    <!-- Foco de luz puntual en el suelo (Centro O) -->
    <circle cx="60" cy="150" r="7" fill="#f59e0b" />
    <text x="60" y="172" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Foco O (Luz)</text>
    <!-- Pared a la derecha -->
    <line x1="390" y1="150" x2="390" y2="20" stroke="#94a3b8" stroke-width="6" />
    <text x="390" y="15" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">Pared</text>
    <!-- Escultura a 2m -->
    <rect x="170" y="105" width="12" height="45" rx="3" fill="#38bdf8" />
    <text x="176" y="98" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">${hSculptureStr} m</text>
    <!-- Rayo de luz proyectado -->
    <line x1="60" y1="150" x2="390" y2="40" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,4" />
    <!-- Sombra proyectada en la pared -->
    <line x1="390" y1="150" x2="390" y2="40" stroke="#f43f5e" stroke-width="6" />
    <text x="355" y="55" fill="#f43f5e" font-size="12" font-weight="black" text-anchor="end">Sombra = ${hShadow} m</text>
    <!-- Cotas de distancia -->
    <path d="M 60,180 L 170,180" stroke="#38bdf8" stroke-width="1.5" />
    <text x="115" y="175" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${dLight} m</text>
    <path d="M 60,186 L 390,186" stroke="#94a3b8" stroke-width="1" />
    <text x="260" y="184" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">${dWall} m (k = ${dWall}/${dLight} = ${k})</text>
  </svg>`;
}

export function svgFloorPlan(w: number, h: number, k: number = 4): string {
  const wP = w * k;
  const hP = h * k;
  const aOrig = w * h;
  const aP = aOrig * (k * k);

  return `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto drop-shadow-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2">
    <!-- Plano original -->
    <rect x="50" y="60" width="60" height="35" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" rx="3" />
    <text x="80" y="52" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">${w} cm</text>
    <text x="38" y="82" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="end">${h}</text>
    <text x="80" y="82" fill="#bae6fd" font-size="10" font-weight="bold" text-anchor="middle">${aOrig} cm²</text>
    <text x="80" y="120" fill="#94a3b8" font-size="10" text-anchor="middle">Plano Original</text>
    <!-- Plano ampliado fotocopiado -->
    <rect x="180" y="25" width="160" height="95" fill="#059669" fill-opacity="0.3" stroke="#34d399" stroke-width="2.5" rx="4" />
    <text x="260" y="18" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Largo' = ${wP} cm</text>
    <text x="350" y="75" fill="#34d399" font-size="12" font-weight="bold">Ancho' = ${hP} cm</text>
    <text x="260" y="80" fill="#a7f3d0" font-size="13" font-weight="black" text-anchor="middle">Área = ${aP} cm²</text>
    <rect x="180" y="130" width="240" height="30" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
    <text x="300" y="150" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">k = ${k} &rarr; Área' = ${k}² · ${aOrig} = ${aP} cm²</text>
  </svg>`;
}
