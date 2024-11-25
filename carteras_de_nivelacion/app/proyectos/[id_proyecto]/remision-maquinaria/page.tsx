"use client";

import React, { useState, useEffect } from "react";
import { createMachine, getMachines, deleteMachine } from "../../../../lib/actions/machine";
import { useParams } from "next/navigation";

// Componente para crear una máquina
function MachineForm({ onMachineCreated }: { onMachineCreated: () => void }) {
    const { id_proyecto } = useParams();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createMachine(id_proyecto, formData);
      alert("¡Máquina creada exitosamente!");
      onMachineCreated();
    } catch (error) {
      console.error("Error al crear la máquina:", error);
      alert("Hubo un problema al crear la máquina.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Agregar Nueva Máquina</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block">
            Nombre de la Máquina
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Nombre de la máquina"
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

// Componente para la lista de máquinas
function MachineList({
  machines,
  onDeleteMachine,
}: {
  machines: { id: number; name: string }[];
  onDeleteMachine: (id: number) => void;
}) {
    const { id_proyecto } = useParams();
  return (
    <div>
      <h2 className="font-bold text-lg">Listado de Máquinas</h2>
      <ul className="mt-4 space-y-2">
        {machines.map((machine) => (
          <li
            key={machine.id}
            className="flex items-center justify-between align-middle p-4 border border-gray-300 rounded"
          >
            <span>{machine.name}</span>
            <div className="space-x-2">
              <a
                className="px-2 py-1.5 bg-blue-500 text-white rounded"
                href={`/proyectos/${id_proyecto}/remision-maquinaria/${machine.id}`}
              >
                Editar
              </a>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => onDeleteMachine(machine.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Componente principal
export default function Maquinas() {
  const [machines, setMachines] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);  
  const { id_proyecto } = useParams();

  // Cargar máquinas
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data: any = await getMachines(id_proyecto);
        setMachines(data);
      } catch (error) {
        console.error("Error al obtener las máquinas:", error);
        alert("No se pudo cargar la lista de máquinas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, [isLoading]);

  const handleMachineCreated = () => {
    setIsLoading(true);
  };

  const handleDeleteMachine = async (id: any) => {
    try {
      await deleteMachine(id);
      alert("¡Máquina eliminada exitosamente!");
      setIsLoading(true);
    } catch (error) {
      console.error("Error al eliminar la máquina:", error);
      alert("No se pudo eliminar la máquina.");
    }
  };

  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
        
      <div className="flex justify-between items-center">
        <div>
        <h1 className="font-bold text-2xl">Maquinas</h1>
        <p className="text-gray-500">Listado de máquinas</p>
        </div>
        <a href={'/proyectos/' + id_proyecto 

        } className=" text-gray-600 hover:text-gray-900 rounded">Volver</a>
      </div>
      <section className="mt-6 space-y-6">
        <MachineForm onMachineCreated={handleMachineCreated} />
        {!isLoading && <MachineList machines={machines} onDeleteMachine={handleDeleteMachine} />}
      </section>
    </main>
  );
}
