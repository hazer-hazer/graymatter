-- CreateTable
CREATE TABLE "App" (
    "id" SERIAL NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPlugins" (
    "id" SERIAL NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "appId" INTEGER NOT NULL,
    "pluginId" INTEGER NOT NULL,

    CONSTRAINT "AppPlugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApps" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "appId" INTEGER NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserApps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plugin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "defaultConfig" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Plugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOperations" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "operation" TEXT NOT NULL,

    CONSTRAINT "UserOperations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "treeName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" BIGSERIAL NOT NULL,
    "src" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "superCategoryId" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "forms" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" BIGSERIAL NOT NULL,
    "treeName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "inventoryId" INTEGER NOT NULL,
    "folderId" BIGINT,
    "categoryId" INTEGER,
    "itemLocationId" INTEGER,
    "itemLocationNotes" VARCHAR(1023),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyLink" VARCHAR(255),
    "reasonablePrice" REAL,
    "amountUnitId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemImage" (
    "itemId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,

    CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("itemId","imageId")
);

-- CreateTable
CREATE TABLE "ItemVariant" (
    "id" BIGSERIAL NOT NULL,
    "treeName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "itemId" BIGINT NOT NULL,
    "reasonablePrice" REAL,

    CONSTRAINT "ItemVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemVariantImage" (
    "itemVariantId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,

    CONSTRAINT "ItemVariantImage_pkey" PRIMARY KEY ("itemVariantId","imageId")
);

-- CreateTable
CREATE TABLE "ItemLocation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),

    CONSTRAINT "ItemLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmountUnit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(10),
    "powerPrefixes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "AmountUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemUsage" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "ItemUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemReturned" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "ItemReturned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" BIGSERIAL NOT NULL,
    "treeName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "parentId" BIGINT,
    "inventoryId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrivalItems" (
    "arrivalId" BIGINT NOT NULL,
    "itemId" BIGINT NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "priceUsd" REAL,
    "price" REAL,

    CONSTRAINT "ArrivalItems_pkey" PRIMARY KEY ("arrivalId","itemId")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_treeName_userId_key" ON "Inventory"("treeName", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_forms_key" ON "Tag"("forms");

-- CreateIndex
CREATE UNIQUE INDEX "Item_folderId_treeName_key" ON "Item"("folderId", "treeName");

-- CreateIndex
CREATE UNIQUE INDEX "ItemVariant_itemId_treeName_key" ON "ItemVariant"("itemId", "treeName");

-- CreateIndex
CREATE UNIQUE INDEX "AmountUnit_name_key" ON "AmountUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_parentId_treeName_key" ON "Folder"("parentId", "treeName");

-- AddForeignKey
ALTER TABLE "AppPlugins" ADD CONSTRAINT "AppPlugins_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppPlugins" ADD CONSTRAINT "AppPlugins_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "Plugin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApps" ADD CONSTRAINT "UserApps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApps" ADD CONSTRAINT "UserApps_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOperations" ADD CONSTRAINT "UserOperations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_superCategoryId_fkey" FOREIGN KEY ("superCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemLocationId_fkey" FOREIGN KEY ("itemLocationId") REFERENCES "ItemLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_amountUnitId_fkey" FOREIGN KEY ("amountUnitId") REFERENCES "AmountUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariant" ADD CONSTRAINT "ItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariantImage" ADD CONSTRAINT "ItemVariantImage_itemVariantId_fkey" FOREIGN KEY ("itemVariantId") REFERENCES "ItemVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariantImage" ADD CONSTRAINT "ItemVariantImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemUsage" ADD CONSTRAINT "ItemUsage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReturned" ADD CONSTRAINT "ItemReturned_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalItems" ADD CONSTRAINT "ArrivalItems_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalItems" ADD CONSTRAINT "ArrivalItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
