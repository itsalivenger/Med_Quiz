// ─────────────────────────────────────────────────────────────
//  MedQuiz — TypeScript interfaces & domain types
// ─────────────────────────────────────────────────────────────

/** A single answer choice inside a Question */
export interface QuizOption {
  letter: string;        // "A" | "B" | "C" | "D" | "E"
  text: string;
  is_correct: boolean;
  explanation: string;   // shown after answer is submitted
}

/** A clinical vignette question fetched from the API */
export interface Question {
  id: string;
  vignette: string;                // the clinical scenario / stem
  options: QuizOption[];
  title_path: string;              // e.g. "Y1 > S2 > Anatomy > Skull Base > Course A"
  source_citation?: string;        // optional textbook / guideline reference
}

/** One completed quiz session recorded in history */
export interface QuizAttempt {
  course_id: string;
  date: string;                    // ISO-8601
  score: number;
  total: number;
  mode: 'static' | 'dynamic';
}

// ─── 5-Tier Academic Hierarchy ────────────────────────────────

export interface Course {
  id: string;
  name: string;
  question_count: number;
}

export interface SubSection {
  id: string;
  name: string;
  courses: Course[];
}

export interface Matter {
  id: string;
  name: string;
  subsections: SubSection[];
}

export interface Semester {
  id: string;
  name: string;                    // e.g. "Semester 1"
  matters: Matter[];
}

export interface Year {
  id: string;
  name: string;                    // e.g. "Year 1"
  semesters: Semester[];
}

/** Full academic catalog tree */
export type AcademicHierarchy = Year[];

// ─── API response envelopes ───────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  has_more: boolean;
}
