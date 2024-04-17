-- CreateTable
CREATE TABLE "driver_images" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "driver_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driver_images_key_key" ON "driver_images"("key");

-- AddForeignKey
ALTER TABLE "driver_images" ADD CONSTRAINT "driver_images_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
