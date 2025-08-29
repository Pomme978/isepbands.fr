-- Create Badge table if not exists
CREATE TABLE IF NOT EXISTS `Badge` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `userId` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Badge_userId_fkey`(`userId`),
    CONSTRAINT `Badge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Activity table if not exists
CREATE TABLE IF NOT EXISTS `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT,
    `metadata` JSON,
    `userId` INT,
    `createdBy` VARCHAR(191),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `Activity_userId_fkey`(`userId`),
    INDEX `Activity_createdAt_idx`(`createdAt`),
    CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add missing columns to User table
ALTER TABLE `User`
ADD COLUMN IF NOT EXISTS `phone` VARCHAR(191),
ADD COLUMN IF NOT EXISTS `preferredGenres` TEXT,
ADD COLUMN IF NOT EXISTS `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS `updatedAt` DATETIME(3) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(3);

-- Drop existing UserMusicGenre table if it exists with wrong type
DROP TABLE IF EXISTS `UserMusicGenre`;

-- Create UserMusicGenre table with correct userId type (INT)
CREATE TABLE `UserMusicGenre` (
    `userId` INT NOT NULL,
    `musicGenreId` VARCHAR(191) NOT NULL,
    INDEX `UserMusicGenre_musicGenreId_fkey`(`musicGenreId`),
    PRIMARY KEY (`userId`, `musicGenreId`),
    CONSTRAINT `UserMusicGenre_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `UserMusicGenre_musicGenreId_fkey` FOREIGN KEY (`musicGenreId`) REFERENCES `MusicGenre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;