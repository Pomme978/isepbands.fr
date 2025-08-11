/*
  Warnings:

  - The primary key for the `groupmembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userinstrument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userrole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `groupmembership` DROP FOREIGN KEY `GroupMembership_userId_fkey`;

-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `News_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `registrationrequest` DROP FOREIGN KEY `RegistrationRequest_userId_fkey`;

-- DropForeignKey
ALTER TABLE `storageobject` DROP FOREIGN KEY `StorageObject_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userinstrument` DROP FOREIGN KEY `UserInstrument_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_userId_fkey`;

-- DropIndex
DROP INDEX `News_authorId_fkey` ON `news`;

-- DropIndex
DROP INDEX `StorageObject_userId_fkey` ON `storageobject`;

-- AlterTable
ALTER TABLE `groupmembership` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `groupId`);

-- AlterTable
ALTER TABLE `news` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `registrationrequest` ADD COLUMN `experience` VARCHAR(191) NULL,
    ADD COLUMN `motivation` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `storageobject` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `userinstrument` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `instrumentId`);

-- AlterTable
ALTER TABLE `userrole` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `roleId`);

-- AlterTable
ALTER TABLE `vote` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `songId`);

-- AddForeignKey
ALTER TABLE `RegistrationRequest` ADD CONSTRAINT `RegistrationRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageObject` ADD CONSTRAINT `StorageObject_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInstrument` ADD CONSTRAINT `UserInstrument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMembership` ADD CONSTRAINT `GroupMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
