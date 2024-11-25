'use server';

import prisma from '../prisma';

// Crear un detalle de remisión de máquina
export async function createMachineDetail(machineId: any, formData: FormData) {
  const startHour = formData.get('startHour') as string;
    const endHour = formData.get('endHour') as string;
    const date = formData.get('date') as string;
    if (!startHour) throw new Error('La hora de inicio es requerida');
    if (!endHour) throw new Error('La hora de fin es requerida');
    if (!date) throw new Error('La fecha es requerida');
    

  const newMachineDetail = await prisma.machineRemittanceDetail.create({
    data: {
        startHour,
        endHour,
        date,
        machineRemittanceId: machineId,
    },
  });

  return newMachineDetail;
}

// Obtener todos los detalles de remisión de máquina
export async function getMachineDetails(machineRemittanceId: any) {
  const machineDetails = await prisma.machineRemittanceDetail.findMany({
    where: { machineRemittanceId },
  });
  return machineDetails;
}

// Eliminar un detalle de remisión de máquina
export async function deleteMachineDetail(machineDetailId: string) {
  if (!machineDetailId) throw new Error('El ID del detalle de remisión de máquina es requerido');

  await prisma.machineRemittanceDetail.delete({ where: { id: machineDetailId } });
  return { success: true };
}
