-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_machineRemittanceDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "startHour" TEXT NOT NULL,
    "endHour" TEXT NOT NULL,
    "machineRemittanceId" TEXT NOT NULL,
    CONSTRAINT "machineRemittanceDetail_machineRemittanceId_fkey" FOREIGN KEY ("machineRemittanceId") REFERENCES "machineRemittance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_machineRemittanceDetail" ("date", "endHour", "id", "machineRemittanceId", "startHour") SELECT "date", "endHour", "id", "machineRemittanceId", "startHour" FROM "machineRemittanceDetail";
DROP TABLE "machineRemittanceDetail";
ALTER TABLE "new_machineRemittanceDetail" RENAME TO "machineRemittanceDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
