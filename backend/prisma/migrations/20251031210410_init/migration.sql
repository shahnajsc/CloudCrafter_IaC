-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "headline" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topcompany" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "stockSym" TEXT NOT NULL,
    "capital" INTEGER NOT NULL,
    "shareVolume" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "dividend" DOUBLE PRECISION NOT NULL,
    "dividendYield" DOUBLE PRECISION NOT NULL,
    "sector" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topcompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topshare" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "marketCapital" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topshare_pkey" PRIMARY KEY ("id")
);
