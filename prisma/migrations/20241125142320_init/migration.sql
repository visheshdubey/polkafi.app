/*
  Warnings:

  - You are about to drop the `AIAssistedTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" TEXT DEFAULT 'USD',
ADD COLUMN     "textToStruturedJsonId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "defaultCurrency" TEXT DEFAULT 'USD';

-- DropTable
DROP TABLE "AIAssistedTransaction";

-- CreateTable
CREATE TABLE "Transcription" (
    "id" TEXT NOT NULL,
    "audioUrl" TEXT,
    "trxnText" TEXT,
    "rawWhisperResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextToStruturedJson" (
    "id" TEXT NOT NULL,
    "trxnText" TEXT,
    "rawCompletionResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transcriptionId" TEXT,

    CONSTRAINT "TextToStruturedJson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_textToStruturedJsonId_fkey" FOREIGN KEY ("textToStruturedJsonId") REFERENCES "TextToStruturedJson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextToStruturedJson" ADD CONSTRAINT "TextToStruturedJson_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "Transcription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
