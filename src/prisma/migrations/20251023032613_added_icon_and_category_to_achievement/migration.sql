-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "achievementCategory" TEXT,
ADD COLUMN     "achievementIcon" TEXT;

-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "correctByDifficulty1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctByDifficulty2" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctByDifficulty3" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "percentageCorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalErrors" INTEGER NOT NULL DEFAULT 0;
