/*
  Warnings:

  - A unique constraint covering the columns `[id,businessId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_businessId_key" ON "Customer"("id", "businessId");
