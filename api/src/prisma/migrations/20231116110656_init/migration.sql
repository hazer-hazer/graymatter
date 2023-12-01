/*
  Warnings:

  - You are about to drop the `AmountUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppPlugins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Arrival` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArrivalItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemReturned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemVariantImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plugin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserApps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOperations` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FolderKind" AS ENUM ('Root', 'Trash');

-- DropForeignKey
ALTER TABLE "AppPlugins" DROP CONSTRAINT "AppPlugins_appId_fkey";

-- DropForeignKey
ALTER TABLE "AppPlugins" DROP CONSTRAINT "AppPlugins_pluginId_fkey";

-- DropForeignKey
ALTER TABLE "ArrivalItems" DROP CONSTRAINT "ArrivalItems_arrivalId_fkey";

-- DropForeignKey
ALTER TABLE "ArrivalItems" DROP CONSTRAINT "ArrivalItems_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_superCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_amountUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_itemLocationId_fkey";

-- DropForeignKey
ALTER TABLE "ItemImage" DROP CONSTRAINT "ItemImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ItemImage" DROP CONSTRAINT "ItemImage_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemReturned" DROP CONSTRAINT "ItemReturned_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemUsage" DROP CONSTRAINT "ItemUsage_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVariant" DROP CONSTRAINT "ItemVariant_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVariantImage" DROP CONSTRAINT "ItemVariantImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVariantImage" DROP CONSTRAINT "ItemVariantImage_itemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "UserApps" DROP CONSTRAINT "UserApps_appId_fkey";

-- DropForeignKey
ALTER TABLE "UserApps" DROP CONSTRAINT "UserApps_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOperations" DROP CONSTRAINT "UserOperations_userId_fkey";

-- DropTable
DROP TABLE "AmountUnit";

-- DropTable
DROP TABLE "App";

-- DropTable
DROP TABLE "AppPlugins";

-- DropTable
DROP TABLE "Area";

-- DropTable
DROP TABLE "Arrival";

-- DropTable
DROP TABLE "ArrivalItems";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Folder";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "ItemImage";

-- DropTable
DROP TABLE "ItemLocation";

-- DropTable
DROP TABLE "ItemReturned";

-- DropTable
DROP TABLE "ItemUsage";

-- DropTable
DROP TABLE "ItemVariant";

-- DropTable
DROP TABLE "ItemVariantImage";

-- DropTable
DROP TABLE "Plugin";

-- DropTable
DROP TABLE "Sample";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserApps";

-- DropTable
DROP TABLE "UserOperations";

-- CreateTable
CREATE TABLE "apps" (
    "id" SERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_apps" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "appId" INTEGER NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_operations" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "operation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "userId" BIGINT NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" BIGSERIAL NOT NULL,
    "src" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "forms" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "inventoryId" INTEGER NOT NULL,
    "folderId" BIGINT,
    "itemLocationId" INTEGER,
    "itemLocationNotes" VARCHAR(1023),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyLink" VARCHAR(255),
    "reasonablePrice" REAL,
    "amountUnitId" INTEGER NOT NULL,
    "rawAmountValue" BIGINT NOT NULL DEFAULT 0,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_images" (
    "itemId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,

    CONSTRAINT "item_images_pkey" PRIMARY KEY ("itemId","imageId")
);

-- CreateTable
CREATE TABLE "item_variants" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "itemId" BIGINT NOT NULL,
    "reasonablePrice" REAL,

    CONSTRAINT "item_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_variant_images" (
    "itemVariantId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,

    CONSTRAINT "item_variant_images_pkey" PRIMARY KEY ("itemVariantId","imageId")
);

-- CreateTable
CREATE TABLE "item_locations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),

    CONSTRAINT "item_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amount_units" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "userId" BIGINT,

    CONSTRAINT "amount_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amount_unit_power_prefixes" (
    "power" INTEGER NOT NULL,
    "prefix" TEXT NOT NULL,
    "name" TEXT,
    "amountUnitId" INTEGER NOT NULL,

    CONSTRAINT "amount_unit_power_prefixes_pkey" PRIMARY KEY ("amountUnitId","power")
);

-- CreateTable
CREATE TABLE "item_usages" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "item_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_returns" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "item_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "kind" "FolderKind",
    "parentId" BIGINT,
    "inventoryId" INTEGER NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolderImages" (
    "folderId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,

    CONSTRAINT "FolderImages_pkey" PRIMARY KEY ("folderId","imageId")
);

-- CreateTable
CREATE TABLE "arrivals" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arrivals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrival_items" (
    "arrivalId" BIGINT NOT NULL,
    "itemId" BIGINT NOT NULL,
    "value" INTEGER NOT NULL,
    "priceUsd" REAL,
    "price" REAL,

    CONSTRAINT "arrival_items_pkey" PRIMARY KEY ("arrivalId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "apps_uri_key" ON "apps"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_userId_uri_key" ON "inventories"("userId", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "tags_forms_key" ON "tags"("forms");

-- CreateIndex
CREATE UNIQUE INDEX "items_folderId_uri_key" ON "items"("folderId", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "item_variants_itemId_uri_key" ON "item_variants"("itemId", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "amount_units_symbol_key" ON "amount_units"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "folders_parentId_uri_key" ON "folders"("parentId", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "folders_inventoryId_kind_key" ON "folders"("inventoryId", "kind");

-- AddForeignKey
ALTER TABLE "user_apps" ADD CONSTRAINT "user_apps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_apps" ADD CONSTRAINT "user_apps_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_operations" ADD CONSTRAINT "user_operations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_itemLocationId_fkey" FOREIGN KEY ("itemLocationId") REFERENCES "item_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_amountUnitId_fkey" FOREIGN KEY ("amountUnitId") REFERENCES "amount_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variant_images" ADD CONSTRAINT "item_variant_images_itemVariantId_fkey" FOREIGN KEY ("itemVariantId") REFERENCES "item_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variant_images" ADD CONSTRAINT "item_variant_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amount_units" ADD CONSTRAINT "amount_units_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amount_unit_power_prefixes" ADD CONSTRAINT "amount_unit_power_prefixes_amountUnitId_fkey" FOREIGN KEY ("amountUnitId") REFERENCES "amount_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_usages" ADD CONSTRAINT "item_usages_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_returns" ADD CONSTRAINT "item_returns_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderImages" ADD CONSTRAINT "FolderImages_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderImages" ADD CONSTRAINT "FolderImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrival_items" ADD CONSTRAINT "arrival_items_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "arrivals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrival_items" ADD CONSTRAINT "arrival_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
