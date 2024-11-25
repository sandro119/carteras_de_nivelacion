'use server'

import { console } from 'inspector'
import prisma from '../prisma'

// Obtener todos los registros con un projectId específico
export async function getRecordsByProjectId(projectId: string) {
  if (!projectId) throw new Error('El projectId es requerido')

  const records = await prisma.portfolioProject.findMany({
    where: { projectId },
  })

  return records
}

// Eliminar todos los registros con un projectId específico
export async function deleteRecordsByProjectId(projectId: string) {
  if (!projectId) throw new Error('El projectId es requerido')

  const deletedRecords = await prisma.portfolioProject.deleteMany({
    where: { projectId },
  })

  return { success: true, count: deletedRecords.count }
}

// Agregar múltiples registros con un projectId específico
export async function addRecordsByProjectId(
  projectId: string,
  records: Array<{
    description: string
    abscisa: number
    biCotaNegra: number
    ejeCotaNegra: number
    bdCotaNegra: number
    biCotaSubrasante: number
    ejeCotaSubrasante: number
    bdCotaSubrasante: number
    acIzquierda: number
    acDerecha: number
  }>
) {
  console.log('projectId', projectId)
  console.log('records', records)
  if (!projectId) throw new Error('El projectId es requerido')
  if (!records || records.length === 0)
    throw new Error('Los registros son requeridos')

  const newRecords = await prisma.portfolioProject.createMany({
    data: records.map(record => ({
      ...record,
      projectId,
    })),
  })

  return { success: true, count: newRecords.count }
}