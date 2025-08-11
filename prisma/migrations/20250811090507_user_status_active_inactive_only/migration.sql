/*
  Warnings:

  - The values [MEMBER,ADMIN,BANNED] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('INACTIVE', 'ACTIVE') NOT NULL DEFAULT 'INACTIVE';
