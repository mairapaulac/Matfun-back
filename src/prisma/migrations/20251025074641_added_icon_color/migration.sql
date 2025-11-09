-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "iconColor" TEXT;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "percentageQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "questionsIncorrect" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "totalIncorrect" INTEGER NOT NULL DEFAULT 0;
