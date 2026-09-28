export type QuizAttemptRow = {
  id: string;
  score: number;
  total_questions: number;
  started_at: string;
  submitted_at: string | null;
  duration_seconds: number | null;
  status: string;
  left_at: string | null;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
};
