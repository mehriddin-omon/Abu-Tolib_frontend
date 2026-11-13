/** Backend bilan umumiy turlar (abu-tolib-api: src/users/users.service.ts → PublicUser) */
export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  phone: string | null;
  role: Role;
  grade: number | null;
  region: string | null;
  targetScore: number | null;
  profileComplete: boolean;
}

export interface StartedLogin {
  requestId: string;
  pollSecret: string;
  deepLink: string | null;
  expiresAt: string;
}

export type PollResult =
  | { status: 'pending' }
  | { status: 'expired' }
  | { status: 'confirmed'; user: User };

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export const homeFor = (role: Role) => (role === 'ADMIN' ? '/admin/panel' : '/bosh');

// ───────────── 2-qadam: kontent, savollar, testlar ─────────────

export interface LessonSummary {
  id: string;
  sectionId: string;
  code: string;
  title: string;
  order: number;
  isFinal: boolean;
  published: boolean;
  hasBody: boolean;
  questionCount: number;
}

export interface SectionTree {
  id: string;
  code: string;
  slug: string;
  title: string;
  order: number;
  questionCount: number;
  lessons: LessonSummary[];
}

export interface Lesson {
  id: string;
  code: string;
  title: string;
  order: number;
  bodyMd: string | null;
  isFinal: boolean;
  published: boolean;
  updatedAt: string;
  section: { id: string; code: string; title: string; slug: string };
}

/** Talaba ko'rinishi: faqat e'lon qilingan darslar */
export interface PublicSection {
  id: string;
  code: string;
  slug: string;
  title: string;
  order: number;
  lessons: { id: string; code: string; title: string; order: number; isFinal: boolean }[];
}

export type QuestionType = 'SINGLE_CHOICE' | 'NUMERIC';

export interface QuestionOption {
  id?: string;
  label: string;
  textMd: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  lessonCode: string;
  type: QuestionType;
  textMd: string;
  difficulty: 1 | 2 | 3;
  answerText: string | null;
  explanationMd: string | null;
  source: string | null;
  options: QuestionOption[];
  usedInTests?: number;
}

export type QuestionInput = Omit<Question, 'id' | 'usedInTests' | 'answerText' | 'explanationMd' | 'source'> & {
  answerText?: string;
  explanationMd?: string;
  source?: string;
};

export interface ImportResult {
  total: number;
  valid: number;
  created: number;
  errors: { row: number; errors: string[] }[];
  byLesson: Record<string, number>;
}

export type TestKind = 'DIAGNOSTIC' | 'SECTION_FINAL' | 'PRACTICE';

export const TEST_KIND_LABEL: Record<TestKind, string> = {
  DIAGNOSTIC: 'Diagnostika',
  SECTION_FINAL: "Bo'lim nazorati",
  PRACTICE: 'Mashq',
};

export const DIFFICULTY_LABEL = { 1: 'Oddiy', 2: "O'rta", 3: 'Qiyin' } as const;

export interface TestSummary {
  id: string;
  kind: TestKind;
  title: string;
  sectionId: string | null;
  section: { id: string; code: string; title: string } | null;
  timeLimitMin: number | null;
  published: boolean;
  questionCount: number;
  attemptCount: number;
  createdAt: string;
}

export interface TestDetail extends Omit<TestSummary, 'questionCount' | 'attemptCount'> {
  questions: Question[];
}
