/*
  Warnings:

  - You are about to alter the column `status` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
    ADD COLUMN `emailVerificationTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `status` ENUM('INACTIVE', 'MEMBER', 'ADMIN', 'BANNED') NOT NULL DEFAULT 'INACTIVE';
