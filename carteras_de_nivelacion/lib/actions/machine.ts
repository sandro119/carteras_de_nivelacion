'use server';

import prisma from '../prisma';

// Crear una máquina
export async function createMachine(projectId: any, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) throw new Error('El nombre de la máquina es requerido');


  const newMachine = await prisma.machineRemittance.create({
    data: { name, projectId },
  });

  return newMachine;
}

// Obtener todas las máquinas
export async function getMachines(projectId: any) {
  const machines = await prisma.machineRemittance.findMany(
    { 
        where: { projectId: projectId },
    }
  );
  return machines;
}

// Eliminar una máquina
export async function deleteMachine(machineId: string) {
  if (!machineId) throw new Error('El ID de la máquina es requerido');

  await prisma.machineRemittance.delete({ where: { id: machineId } });
  return { success: true };
}
