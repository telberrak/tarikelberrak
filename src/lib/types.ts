export type IconKey =
  | "bars"
  | "network"
  | "hexagons"
  | "toggle"
  | "rings"
  | "wave";

export interface ArticleFrontmatter {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  readMinutes: number;
  tags: string[];
  author: string;
  icon: IconKey;
  published: boolean;
}

export interface ArticleWithContent extends ArticleFrontmatter {
  content: string;
}

export type LabStatus = "Live" | "In Progress" | "Case Study" | "Prototype";

export type LabCategory = "AI & LLM" | "Cloud & Kubernetes" | "Trading & Quant" | "Event-Driven";

export interface LabFrontmatter {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: LabStatus;
  category: LabCategory;
  tags: string[];
  icon: IconKey;
  date: string;
  published: boolean;
}

export interface LabWithContent extends LabFrontmatter {
  content: string;
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  priceCents: number;
  isFree: boolean;
  coverImage: string | null;
  published: boolean;
}

export interface LessonSummary {
  id: string;
  sectionId: string | null;
  slug: string;
  title: string;
  position: number;
  durationSeconds: number;
  isPreview: boolean;
  completed: boolean;
  watchedSeconds: number;
}

export interface CourseSectionSummary {
  id: string;
  title: string;
  position: number;
}

export interface LessonAsset {
  provider: "html5" | "mux";
  videoAssetId: string;
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  durationSeconds: number;
  notes: string | null;
  watchedSeconds: number;
  completed: boolean;
  asset: LessonAsset | null;
  previousLessonSlug: string | null;
  nextLessonSlug: string | null;
}

export interface EnrolledCourse {
  course: CourseSummary;
  source: "free" | "stripe";
  enrolledAt: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  continueLessonSlug: string | null;
}

export interface CommentAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface CommentWithAuthor {
  id: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  author: CommentAuthor;
}

export type CommentTargetType = "article" | "lab" | "course" | "lesson";
