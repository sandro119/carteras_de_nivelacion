/*
  Warnings:

  - You are about to drop the column `name` on the `withdrawalRemittance` table. All the data in the column will be lost.
  - Added the required column `date` to the `withdrawalRemittance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meters3` to the `withdrawalRemittance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observations` to the `withdrawalRemittance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remittanceNumber` to the `withdrawalRemittance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_withdrawalRemittance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "remittanceNumber" TEXT NOT NULL,
    "meters3" REAL NOT NULL,
    "observations" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "withdrawalRemittance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_withdrawalRemittance" ("id", "projectId") SELECT "id", "projectId" FROM "withdrawalRemittance";
DROP TABLE "withdrawalRemittance";
ALTER TABLE "new_withdrawalRemittance" RENAME TO "withdrawalRemittance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
