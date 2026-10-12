// Learner data only. Lesson content lives in the repo as MDX, never in the database.
import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

// One row per learner per lesson. Slugs look like "level-01/client-and-server".
export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    status: text("status", { enum: ["started", "completed"] }).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(now).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonSlug] })],
);

// Every quiz answer, kept so review can target weak spots.
export const quizAttempt = sqliteTable(
  "quiz_attempt",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    questionId: text("question_id").notNull(),
    correct: integer("correct", { mode: "boolean" }).notNull(),
    answeredAt: integer("answered_at", { mode: "timestamp_ms" }).default(now).notNull(),
  },
  (t) => [index("quiz_attempt_user_idx").on(t.userId, t.lessonSlug)],
);

// Spaced review schedule, one row per learner per question.
export const reviewItem = sqliteTable(
  "review_item",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    dueAt: integer("due_at", { mode: "timestamp_ms" }).notNull(),
    intervalDays: real("interval_days").default(1).notNull(),
    ease: real("ease").default(2.5).notNull(),
    reps: integer("reps").default(0).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.questionId] }),
    index("review_item_due_idx").on(t.userId, t.dueAt),
  ],
);
