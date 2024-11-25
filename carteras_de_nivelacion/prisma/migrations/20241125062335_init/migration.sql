-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_withdrawalRemittance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "remittanceNumber" TEXT NOT NULL,
    "meters3" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "withdrawalRemittance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_withdrawalRemittance" ("date", "id", "meters3", "observations", "projectId", "remittanceNumber") SELECT "date", "id", "meters3", "observations", "projectId", "remittanceNumber" FROM "withdrawalRemittance";
DROP TABLE "withdrawalRemittance";
ALTER TABLE "new_withdrawalRemittance" RENAME TO "withdrawalRemittance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
