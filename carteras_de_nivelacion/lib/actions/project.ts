'use server'

import prisma from '../prisma' 

// Crear un proyecto
export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) throw new Error('El nombre del proyecto es requerido')

  const newProject = await prisma.project.create({
    data: { name,
      TotVolDer: 0,
      TotVolIzq: 0
    },
  })

  return newProject
}

// actualicar TotVolDer y TotVolIzq de un proyecto
export async function updateProjectTotal(projectId: string, TotVolDer: number, TotVolIzq: number) {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { TotVolDer, TotVolIzq },
  })

  return updatedProject
}

// Obtener TotVolDer y TotVolIzq de un proyecto
export async function getProjectTotal(projectId: any) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { TotVolDer: true, TotVolIzq: true },
  })
  return project
}

// Obtener todos los proyectos
export async function getProjects() {
  const projects = await prisma.project.findMany()
  return projects
}

// Actualizar un proyecto
export async function updateProject(projectId: string, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) throw new Error('El nombre del proyecto es requerido')

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  })

  return updatedProject
}

// Eliminar un proyecto
export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } })
  return { success: true }
}
