-- CreateTable
CREATE TABLE "portfolioProject" (
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
    CONSTRAINT "portfolioProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
