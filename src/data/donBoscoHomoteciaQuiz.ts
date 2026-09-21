import { Question, QuizPreset, TestFormVariant } from '../types';
import {
  HOMOTECIA_1MEDIO_FORMA_A,
  HOMOTECIA_1MEDIO_FORMA_B,
  HOMOTECIA_1MEDIO_FORMA_C,
  HOMOTECIA_1MEDIO_FORMA_D,
  HOMOTECIA_1MEDIO_FORMS,
  TEST_FORMS_CONFIG,
  getBalancedFormVariant,
} from './homoteciaVariantsData';

export {
  HOMOTECIA_1MEDIO_FORMA_A,
  HOMOTECIA_1MEDIO_FORMA_B,
  HOMOTECIA_1MEDIO_FORMA_C,
  HOMOTECIA_1MEDIO_FORMA_D,
  HOMOTECIA_1MEDIO_FORMS,
  TEST_FORMS_CONFIG,
  getBalancedFormVariant,
};

// Main 14 Questions for 1° Medio with attached 4-variant configurations (Formas A, B, C, D)
export const DON_BOSCO_HOMOTECIA_1MEDIO_QUESTIONS: Question[] = HOMOTECIA_1MEDIO_FORMA_A.map(
  (baseQ, idx) => ({
    ...baseQ,
    variants: {
      A: HOMOTECIA_1MEDIO_FORMA_A[idx],
      B: HOMOTECIA_1MEDIO_FORMA_B[idx],
      C: HOMOTECIA_1MEDIO_FORMA_C[idx],
      D: HOMOTECIA_1MEDIO_FORMA_D[idx],
    },
  })
);

export const DON_BOSCO_HOMOTECIA_PRESET: QuizPreset = {
  id: 'don-bosco-homotecia-1medio',
  title: 'Evaluación Sumativa: Homotecia Geométrica (1° Medio) — 4 Formas Aleatorias',
  grade: '1° Medio',
  topic: 'Geometría - MA01 OA 08',
  description:
    'Evaluación oficial Salesianos Antofagasta: 4 versiones (Formas A, B, C y D) con valores numéricos independientes para evitar copias. Monitoreo docente en tiempo real.',
  questions: DON_BOSCO_HOMOTECIA_1MEDIO_QUESTIONS,
};
