/*
  Warnings:

  - Added the required column `userId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_id_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "chat_agent";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "chat_user";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "order_agent";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "order_product";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "order_user";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_id_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "agentId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "agentId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "order_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "order_agent" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "order_product" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "chat_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "chat_agent" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
