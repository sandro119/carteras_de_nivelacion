-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_portfolioProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "abscisa" REAL NOT NULL,
    "biCotaNegra" REAL NOT NULL,
    "ejeCotaNegra" REAL NOT NULL,
    "bdCotaNegra" REAL NOT NULL,
    "biCotaSubrasante" REAL NOT NULL,
    "ejeCotaSubrasante" REAL NOT NULL,
    "bdCotaSubrasante" REAL NOT NULL,
    "acIzquierda" REAL NOT NULL,
    "acDerecha" REAL NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "portfolioProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_portfolioProject" ("abscisa", "acDerecha", "acIzquierda", "bdCotaNegra", "bdCotaSubrasante", "biCotaNegra", "biCotaSubrasante", "description", "ejeCotaNegra", "ejeCotaSubrasante", "id", "projectId") SELECT "abscisa", "acDerecha", "acIzquierda", "bdCotaNegra", "bdCotaSubrasante", "biCotaNegra", "biCotaSubrasante", "description", "ejeCotaNegra", "ejeCotaSubrasante", "id", "projectId" FROM "portfolioProject";
DROP TABLE "portfolioProject";
ALTER TABLE "new_portfolioProject" RENAME TO "portfolioProject";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
