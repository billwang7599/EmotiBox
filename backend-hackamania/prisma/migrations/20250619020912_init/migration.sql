-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamleadid" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageid" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,
    "happiness" DECIMAL(3,2) NOT NULL,
    "sadness" DECIMAL(3,2) NOT NULL,
    "frustration" DECIMAL(3,2) NOT NULL,
    "tiredness" DECIMAL(3,2) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageid")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamleadid_fkey" FOREIGN KEY ("teamleadid") REFERENCES "User"("userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
