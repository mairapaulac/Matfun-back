-- CreateEnum
CREATE TYPE "RankingPeriod" AS ENUM ('DIARIO', 'SEMANAL', 'MENSAL', 'GERAL');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Class" (
    "classId" SERIAL NOT NULL,
    "classLetter" CHAR(1) NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "Grade" (
    "gradeId" SERIAL NOT NULL,
    "gradeName" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("gradeId")
);

-- CreateTable
CREATE TABLE "School" (
    "schoolId" SERIAL NOT NULL,
    "school_name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("schoolId")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "achievementId" SERIAL NOT NULL,
    "achievementName" VARCHAR(30) NOT NULL,
    "achievementDescription" TEXT,
    "requiredStat" VARCHAR(50),
    "requiredValue" INTEGER,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("achievementId")
);

-- CreateTable
CREATE TABLE "userAchievements" (
    "userAchievementId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userAchievements_pkey" PRIMARY KEY ("userAchievementId")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "userId" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "answeredQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalCorrect" INTEGER NOT NULL DEFAULT 0,
    "fractionsCorrect" INTEGER NOT NULL DEFAULT 0,
    "geometryCorrect" INTEGER NOT NULL DEFAULT 0,
    "algebraCorrect" INTEGER NOT NULL DEFAULT 0,
    "loginStreak" INTEGER NOT NULL DEFAULT 0,
    "lastLoginDate" DATE,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Match" (
    "matchId" SERIAL NOT NULL,
    "scoreGained" INTEGER NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionsCorrect" INTEGER NOT NULL,
    "fractionsQuestions" INTEGER NOT NULL DEFAULT 0,
    "geometryQuestions" INTEGER NOT NULL DEFAULT 0,
    "algebraQuestions" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "rankingId" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "period" "RankingPeriod" NOT NULL,
    "referenceDate" DATE NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("rankingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Match_userId_playedAt_idx" ON "Match"("userId", "playedAt");

-- CreateIndex
CREATE INDEX "Ranking_period_referenceDate_score_idx" ON "Ranking"("period", "referenceDate", "score");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("schoolId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAchievements" ADD CONSTRAINT "userAchievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("achievementId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAchievements" ADD CONSTRAINT "userAchievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
