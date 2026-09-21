import { Question, TestFormVariant } from '../types';
import { HOMOTECIA_1MEDIO_FORMA_A } from './homoteciaQuestionsRaw';
import {
  HOMOTECIA_1MEDIO_FORMA_B,
  HOMOTECIA_1MEDIO_FORMA_C,
  HOMOTECIA_1MEDIO_FORMA_D,
} from './homoteciaQuestionsBCD';

export {
  HOMOTECIA_1MEDIO_FORMA_A,
  HOMOTECIA_1MEDIO_FORMA_B,
  HOMOTECIA_1MEDIO_FORMA_C,
  HOMOTECIA_1MEDIO_FORMA_D,
};

// =========================================================================
// MAPA DE FORMAS PARA RENDERIZADO Y DISTRIBUCIÓN
// =========================================================================
export const HOMOTECIA_1MEDIO_FORMS: Record<TestFormVariant, Question[]> = {
  A: HOMOTECIA_1MEDIO_FORMA_A,
  B: HOMOTECIA_1MEDIO_FORMA_B,
  C: HOMOTECIA_1MEDIO_FORMA_C,
  D: HOMOTECIA_1MEDIO_FORMA_D,
};

// =========================================================================
// CONFIGURACIÓN DE COLORES Y BADGES PARA CADA FORMA
// =========================================================================
export const TEST_FORMS_CONFIG: Record<
  TestFormVariant,
  {
    label: string;
    fullName: string;
    badgeColor: string;
    pillBg: string;
    textColor: string;
    borderColor: string;
  }
> = {
  A: {
    label: 'Forma A',
    fullName: 'Evaluación Forma A (Azul)',
    badgeColor: 'bg-blue-600 text-white',
    pillBg: 'bg-blue-50 text-blue-700',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  B: {
    label: 'Forma B',
    fullName: 'Evaluación Forma B (Verde)',
    badgeColor: 'bg-emerald-600 text-white',
    pillBg: 'bg-emerald-50 text-emerald-700',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
  },
  C: {
    label: 'Forma C',
    fullName: 'Evaluación Forma C (Ámbar)',
    badgeColor: 'bg-amber-600 text-white',
    pillBg: 'bg-amber-50 text-amber-700',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  D: {
    label: 'Forma D',
    fullName: 'Evaluación Forma D (Púrpura)',
    badgeColor: 'bg-purple-600 text-white',
    pillBg: 'bg-purple-50 text-purple-700',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
};

/**
 * Assigns a balanced random form variant ('A' | 'B' | 'C' | 'D')
 * ensuring even distribution among participants in the room.
 */
export function getBalancedFormVariant(
  existingStudents: Record<string, any> = {},
  participantId?: string
): TestFormVariant {
  const forms: TestFormVariant[] = ['A', 'B', 'C', 'D'];
  const counts: Record<TestFormVariant, number> = { A: 0, B: 0, C: 0, D: 0 };

  Object.values(existingStudents).forEach((st) => {
    if (st?.testVariant && forms.includes(st.testVariant)) {
      counts[st.testVariant as TestFormVariant]++;
    }
  });

  let minCount = Infinity;
  let candidates: TestFormVariant[] = [];

  for (const f of forms) {
    if (counts[f] < minCount) {
      minCount = counts[f];
      candidates = [f];
    } else if (counts[f] === minCount) {
      candidates.push(f);
    }
  }

  if (participantId) {
    let hash = 0;
    for (let i = 0; i < participantId.length; i++) {
      hash = (hash << 5) - hash + participantId.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % candidates.length;
    return candidates[idx];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
