-- CreateTable
CREATE TABLE "machineRemittanceDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "startHour" DATETIME NOT NULL,
    "endHour" DATETIME NOT NULL,
    "machineRemittanceId" TEXT NOT NULL,
    CONSTRAINT "machineRemittanceDetail_machineRemittanceId_fkey" FOREIGN KEY ("machineRemittanceId") REFERENCES "machineRemittance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
