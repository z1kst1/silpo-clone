-- Ця міграція описує зміни, які вже фактично застосовані до бази даних
-- (ProductImage, Recipe, нові поля Product), але файл міграції не потрапив у git.
-- Створено заднім числом для узгодження історії міграцій без втрати даних.

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "isPromo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "oldPrice" DOUBLE PRECISION,
ADD COLUMN "subcategory" TEXT;

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
