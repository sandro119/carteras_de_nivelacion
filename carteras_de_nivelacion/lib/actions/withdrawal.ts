'use server';

import prisma from '../prisma';

// Crear un detalle de remisión de máquina
export async function createWithdrawal(projectId: any, formData: FormData) {
  const remittanceNumber = formData.get('remittanceNumber') as string;
    const meters3 = formData.get('meters3') as string;
    const date = formData.get('date') as string;
    const observations = formData.get('observations') as string;
    if (!remittanceNumber) throw new Error('El número de remisión es requerido');
    if (!meters3) throw new Error('Los metros cúbicos son requeridos');
    if (!date) throw new Error('La fecha es requerida');

  const newMachineDetail = await prisma.withdrawalRemittance.create({
    data: {
        remittanceNumber,
        meters3,
        observations,
        date,
        projectId
    },
  });

  return newMachineDetail;
}

// Obtener todos los detalles de remisión de máquina
export async function getWithdrawals(projectId: any) {
  const machineDetails = await prisma.withdrawalRemittance.findMany({
    where: { projectId },
  });
  return machineDetails;
}

// Eliminar un detalle de remisión de máquina
export async function deleteWithdrawal(withdrawalId: string) {
  if (!withdrawalId) throw new Error('El ID de la remision de retiro es requerido');

  await prisma.withdrawalRemittance.delete({ where: { id: withdrawalId } });
  return { success: true };
}
