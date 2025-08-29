-- Add missing columns to Instrument table
ALTER TABLE `Instrument` 
ADD COLUMN `nameFr` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN `nameEn` VARCHAR(191) NOT NULL DEFAULT '';

-- Add missing columns to Permission table if needed
ALTER TABLE `Permission` 
ADD COLUMN IF NOT EXISTS `nameFr` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `nameEn` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `description` TEXT;

-- Add missing columns to Role table if needed
ALTER TABLE `Role` 
ADD COLUMN IF NOT EXISTS `nameFrMale` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `nameFrFemale` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `nameEnMale` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `nameEnFemale` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS `weight` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `isCore` BOOLEAN NOT NULL DEFAULT FALSE;

-- Create MusicGenre table if not exists
CREATE TABLE IF NOT EXISTS `MusicGenre` (
    `id` VARCHAR(191) NOT NULL,
    `nameFr` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create UserMusicGenre table if not exists
CREATE TABLE IF NOT EXISTS `UserMusicGenre` (
    `userId` VARCHAR(191) NOT NULL,
    `musicGenreId` VARCHAR(191) NOT NULL,
    INDEX `UserMusicGenre_musicGenreId_fkey`(`musicGenreId`),
    PRIMARY KEY (`userId`, `musicGenreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;