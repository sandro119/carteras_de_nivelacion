'use client';

import React, { useState, useEffect } from "react";
import { createMachineDetail, getMachineDetails, deleteMachineDetail } from "../../../../../lib/actions/machineDetail";
import { useParams } from "next/navigation";
import { Table, TableHead, TableRow, TableHeader, 
  TableBody, TableCell } from "@/components/ui/table"; 

// Componente para crear una remisión de máquina
function MachineDetailForm({ onMachineDetailCreated }: { onMachineDetailCreated: () => void }) {
  const { id_remision } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createMachineDetail(id_remision, formData);
      alert("¡Remisión de máquina creada exitosamente!");
      onMachineDetailCreated();
    } catch (error) {
      console.error("Error al crear la remisión de máquina:", error);
      alert("Hubo un problema al crear la remisión de máquina.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Agregar Nueva Remisión de Máquina</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="startHour" className="block">
            Hora de inicio
          </label>
          <input
            type="number"
            id="startHour"
            name="startHour"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="endHour" className="block">
            Hora de fin
          </label>
          <input
            type="number"
            id="endHour"
            name="endHour"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Crear
        </button>
      </form>
    </div>
  );
}
function restarHoras(start: string, end: string) {
  // Convertir las horas en formato HH:MM a objetos Date
  const startDate: any = new Date(`1970-01-01T${start}:00`);
  const endDate: any = new Date(`1970-01-01T${end}:00`);
  
  // Calcular la diferencia en milisegundos
  const diferencia = endDate - startDate;

  // Convertir la diferencia de milisegundos a minutos
  const minutosDiferencia = diferencia / (1000 * 60); // milisegundos a minutos
  
  return minutosDiferencia;
}
// Componente para la lista de remisiones de máquinas
function MachineDetailList({
  machineDetails,
  onDeleteMachineDetail,
}: {
  machineDetails: { id: number; date: string; startHour: string; endHour: string }[];
  onDeleteMachineDetail: (id: number) => void;
}) {
  console.log(machineDetails);

  return (
    <div>
      <h2 className="font-bold text-lg">Listado de Remisiones de Máquina</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora de inicio</TableHead>
            <TableHead>Hora de fin</TableHead>
            <TableHead>Hora Dis</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {machineDetails.map((machineDetail) => (
            <TableRow key={machineDetail.id} >
              <TableCell>{machineDetail.date}</TableCell>
              <TableCell>{machineDetail.startHour}</TableCell>
              <TableCell>{machineDetail.endHour}</TableCell>
              <TableCell>{parseInt( machineDetail.startHour)- parseInt(machineDetail.endHour)}</TableCell>
              <TableCell>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDeleteMachineDetail(machineDetail.id)}
                >
                  Eliminar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Componente principal
export default function RemisionesDeMaquina() {
  const [machineDetails, setMachineDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id_remision, id_proyecto } = useParams();

  // Cargar remisiones de máquinas
  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const data: any = await getMachineDetails(id_remision);
        setMachineDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener las remisiones de máquina:", error);
        alert("No se pudo cargar la lista de remisiones de máquina.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineDetails();
  }, [isLoading]);

  const handleMachineDetailCreated = () => {
    setIsLoading(true);
  };

  const handleDeleteMachineDetail = async (id: any) => {
    try {
      await deleteMachineDetail(id);
      alert("¡Remisión de máquina eliminada exitosamente!");
      setIsLoading(true);
    } catch (error) {
      console.error("Error al eliminar la remisión de máquina:", error);
      alert("No se pudo eliminar la remisión de máquina.");
    }
  };

  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
      
      <div className="flex justify-between items-center">
        <div>
      <h1 className="font-bold text-2xl">Remisiones de Máquina</h1>
      <p className="text-gray-500">Listado de remisiones de máquina</p>
        </div>
        <a href={'/proyectos/'+id_proyecto+'/remision-maquinaria'} className=" text-gray-600 hover:text-gray-900 rounded">Volver</a>
      </div>

      <section className="mt-6 space-y-6">
        <MachineDetailForm onMachineDetailCreated={handleMachineDetailCreated} />
        {!isLoading && <MachineDetailList machineDetails={machineDetails} onDeleteMachineDetail={handleDeleteMachineDetail} />}
      </section>
    </main>
  );
}
