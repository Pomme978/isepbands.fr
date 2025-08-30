-- Create BadgeDefinition table
CREATE TABLE IF NOT EXISTS `BadgeDefinition` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(191) NOT NULL,
  `labelFr` VARCHAR(191) NOT NULL,
  `labelEn` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `color` VARCHAR(191) NOT NULL DEFAULT '#4ECDC4',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `BadgeDefinition_key_key`(`key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add badgeDefinitionId column to Badge table
ALTER TABLE `Badge` 
ADD COLUMN `badgeDefinitionId` INTEGER NULL,
ADD CONSTRAINT `Badge_badgeDefinitionId_fkey` 
FOREIGN KEY (`badgeDefinitionId`) REFERENCES `BadgeDefinition`(`id`) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert default badges
INSERT INTO `BadgeDefinition` (`key`, `labelFr`, `labelEn`, `description`, `color`) VALUES
('founding_member', 'Membre Fondateur', 'Founding Member', 'Membre original d''ISEP Bands', '#FF6B35'),
('former_board_2024', 'Ancien Bureau 2024-25', 'Former Board 2024-25', 'Membre du bureau pendant l''année académique 2024-25', '#4ECDC4'),
('concert_performer', 'Artiste de Concert', 'Concert Performer', 'A participé aux concerts officiels d''ISEP Bands', '#45B7D1'),
('jam_regular', 'Habitué des Jams', 'Jam Session Regular', 'Participant actif des sessions jam', '#96CEB4'),
('studio_artist', 'Artiste Studio', 'Studio Recording Artist', 'A enregistré des morceaux en studio', '#FFEAA7'),
('event_organizer', 'Organisateur d''Événements', 'Event Organizer', 'A aidé à organiser des événements de l''association', '#DDA0DD');