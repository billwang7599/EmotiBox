/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userid_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamleadid_fkey";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "messageid" DROP DEFAULT,
ALTER COLUMN "messageid" SET DATA TYPE TEXT,
ALTER COLUMN "userid" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("messageid");
DROP SEQUENCE "Message_messageid_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ALTER COLUMN "userid" DROP DEFAULT,
ALTER COLUMN "userid" SET DATA TYPE TEXT,
ALTER COLUMN "teamleadid" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userid");
DROP SEQUENCE "User_userid_seq";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamleadid_fkey" FOREIGN KEY ("teamleadid") REFERENCES "User"("userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
