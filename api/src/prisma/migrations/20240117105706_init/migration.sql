-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('String', 'Enum');

-- CreateEnum
CREATE TYPE "FolderKind" AS ENUM ('Root', 'Trash');

-- CreateTable
CREATE TABLE "apps" (
    "id" SERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_apps" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "app_id" INTEGER NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "avatar_image_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency_id" SMALLINT NOT NULL DEFAULT 840,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_operations" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "operation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(127) NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "decimals" SMALLINT NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "avatar_image_id" BIGINT,
    "currency_id" SMALLINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories_stars" (
    "user_id" BIGINT NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventories_stars_pkey" PRIMARY KEY ("user_id","inventory_id")
);

-- CreateTable
CREATE TABLE "amount_units" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "user_id" BIGINT,
    "default" BOOLEAN,

    CONSTRAINT "amount_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amount_unit_power_prefixes" (
    "amount_unit_id" INTEGER NOT NULL,
    "power" SMALLINT NOT NULL,
    "prefix" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "amount_unit_power_prefixes_pkey" PRIMARY KEY ("amount_unit_id","power")
);

-- CreateTable
CREATE TABLE "images" (
    "id" BIGSERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

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
CREATE TABLE "attributes" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "AttributeType" NOT NULL,
    "allowed_values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "inventory_id" INTEGER NOT NULL,
    "folder_id" BIGINT NOT NULL,
    "item_location_id" INTEGER,
    "item_location_ notes" VARCHAR(1023),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "buy_link" VARCHAR(255),
    "price" BIGINT,
    "currency_id" SMALLINT NOT NULL DEFAULT 840,
    "amount_unit_id" INTEGER NOT NULL,
    "amount_value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_attrs" (
    "id" BIGSERIAL NOT NULL,
    "item_id" BIGINT NOT NULL,
    "attr_id" BIGINT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "item_attrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_images" (
    "item_id" BIGINT NOT NULL,
    "image_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_images_pkey" PRIMARY KEY ("item_id","image_id")
);

-- CreateTable
CREATE TABLE "item_variants" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar_image_id" BIGINT,
    "amount_value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "item_id" BIGINT NOT NULL,
    "price" BIGINT,

    CONSTRAINT "item_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_variant_attrs" (
    "item_variant_id" BIGINT NOT NULL,
    "item_attr_id" BIGINT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "item_variant_attrs_pkey" PRIMARY KEY ("item_variant_id","item_attr_id")
);

-- CreateTable
CREATE TABLE "item_locations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),

    CONSTRAINT "item_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_usages" (
    "id" BIGSERIAL NOT NULL,
    "item_id" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "item_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_returns" (
    "id" BIGSERIAL NOT NULL,
    "item_id" BIGINT NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "item_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" BIGSERIAL NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "kind" "FolderKind",
    "parentId" BIGINT,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folder_images" (
    "folder_id" BIGINT NOT NULL,
    "image_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folder_images_pkey" PRIMARY KEY ("folder_id","image_id")
);

-- CreateTable
CREATE TABLE "arrivals" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arrivals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrival_items" (
    "arrival_id" BIGINT NOT NULL,
    "item_id" BIGINT NOT NULL,
    "value" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,

    CONSTRAINT "arrival_items_pkey" PRIMARY KEY ("arrival_id","item_id")
);

-- CreateTable
CREATE TABLE "buy_lists" (
    "id" BIGSERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023),
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "watch" BOOLEAN NOT NULL,

    CONSTRAINT "buy_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buy_list_items" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(1023),
    "user_id" BIGINT NOT NULL,
    "buy_list_id" BIGINT NOT NULL,
    "item_id" BIGINT,
    "item_variant_id" BIGINT,
    "amount_value" DOUBLE PRECISION NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "buy_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apps_uri_key" ON "apps"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_uri_key" ON "users"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_user_id_uri_key" ON "inventories"("user_id", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "amount_units_default_key" ON "amount_units"("default");

-- CreateIndex
CREATE UNIQUE INDEX "amount_units_symbol_user_id_key" ON "amount_units"("symbol", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_forms_key" ON "tags"("forms");

-- CreateIndex
CREATE UNIQUE INDEX "items_folder_id_uri_key" ON "items"("folder_id", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "item_attrs_item_id_attr_id_key" ON "item_attrs"("item_id", "attr_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_variants_item_id_uri_key" ON "item_variants"("item_id", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "folders_parentId_uri_key" ON "folders"("parentId", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "folders_inventory_id_kind_key" ON "folders"("inventory_id", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "buy_lists_user_id_uri_key" ON "buy_lists"("user_id", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "buy_list_items_buy_list_id_item_id_item_variant_id_key" ON "buy_list_items"("buy_list_id", "item_id", "item_variant_id");

-- AddForeignKey
ALTER TABLE "user_apps" ADD CONSTRAINT "user_apps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_apps" ADD CONSTRAINT "user_apps_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_image_id_fkey" FOREIGN KEY ("avatar_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_operations" ADD CONSTRAINT "user_operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_avatar_image_id_fkey" FOREIGN KEY ("avatar_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories_stars" ADD CONSTRAINT "inventories_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories_stars" ADD CONSTRAINT "inventories_stars_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amount_units" ADD CONSTRAINT "amount_units_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amount_unit_power_prefixes" ADD CONSTRAINT "amount_unit_power_prefixes_amount_unit_id_fkey" FOREIGN KEY ("amount_unit_id") REFERENCES "amount_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_item_location_id_fkey" FOREIGN KEY ("item_location_id") REFERENCES "item_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_amount_unit_id_fkey" FOREIGN KEY ("amount_unit_id") REFERENCES "amount_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_attrs" ADD CONSTRAINT "item_attrs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_attrs" ADD CONSTRAINT "item_attrs_attr_id_fkey" FOREIGN KEY ("attr_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_avatar_image_id_fkey" FOREIGN KEY ("avatar_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variants" ADD CONSTRAINT "item_variants_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variant_attrs" ADD CONSTRAINT "item_variant_attrs_item_variant_id_fkey" FOREIGN KEY ("item_variant_id") REFERENCES "item_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_variant_attrs" ADD CONSTRAINT "item_variant_attrs_item_attr_id_fkey" FOREIGN KEY ("item_attr_id") REFERENCES "item_attrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_usages" ADD CONSTRAINT "item_usages_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_returns" ADD CONSTRAINT "item_returns_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder_images" ADD CONSTRAINT "folder_images_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder_images" ADD CONSTRAINT "folder_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrival_items" ADD CONSTRAINT "arrival_items_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "arrivals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrival_items" ADD CONSTRAINT "arrival_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_lists" ADD CONSTRAINT "buy_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_list_items" ADD CONSTRAINT "buy_list_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_list_items" ADD CONSTRAINT "buy_list_items_buy_list_id_fkey" FOREIGN KEY ("buy_list_id") REFERENCES "buy_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_list_items" ADD CONSTRAINT "buy_list_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_list_items" ADD CONSTRAINT "buy_list_items_item_variant_id_fkey" FOREIGN KEY ("item_variant_id") REFERENCES "item_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
