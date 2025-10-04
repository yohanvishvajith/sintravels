-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `flag` VARCHAR(191) NULL,
    `salaryMin` INTEGER NOT NULL,
    `salaryMax` INTEGER NOT NULL,
    `vacancies` INTEGER NOT NULL DEFAULT 1,
    `ageMin` INTEGER NOT NULL,
    `ageMax` INTEGER NOT NULL,
    `holidays` VARCHAR(191) NOT NULL DEFAULT 'sunday',
    `currency` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,
    `visaCategory` VARCHAR(191) NULL,
    `contractPeriod` VARCHAR(191) NULL,
    `benefitsAddc` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `requirements` JSON NOT NULL,
    `applicantsCount` INTEGER NOT NULL DEFAULT 0,
    `closingDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_benifits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` VARCHAR(191) NOT NULL,
    `benefitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applicant` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `resumePath` VARCHAR(191) NULL,
    `coverNote` VARCHAR(191) NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Applicant_userId_jobId_key`(`userId`, `jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `benifits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Industry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Industry_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_benifits` ADD CONSTRAINT `job_benifits_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_benifits` ADD CONSTRAINT `job_benifits_benefitId_fkey` FOREIGN KEY (`benefitId`) REFERENCES `benifits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
