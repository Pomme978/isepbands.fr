-- AlterTable
ALTER TABLE `group` ADD COLUMN `genre` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isOutOfSchool` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pronouns` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userinstrument` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `yearsPlaying` INTEGER NULL;

-- CreateTable
CREATE TABLE `Badge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Badge` ADD CONSTRAINT `Badge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
