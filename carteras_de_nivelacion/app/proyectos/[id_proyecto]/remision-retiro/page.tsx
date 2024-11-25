'use client';

import React, { useState, useEffect } from "react";
import { createWithdrawal, getWithdrawals, deleteWithdrawal } from "../../../../lib/actions/withdrawal";
import { getProjectTotal } from "../../../../lib/actions/project";
import { useParams } from "next/navigation";
import { Table, TableHead, TableRow, TableHeader, 
  TableBody, TableCell } from "@/components/ui/table"; 

// Componente para crear una remisión de retiro
function WithdrawalForm({ onWithdrawalCreated }: { onWithdrawalCreated: () => void }) {
  const { id_proyecto } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createWithdrawal(id_proyecto, formData);
      alert("¡Remisión de retiro creada exitosamente!");
      onWithdrawalCreated();
    } catch (error) {
      console.error("Error al crear la remisión de retiro:", error);
      alert("Hubo un problema al crear la remisión de retiro.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Agregar Nueva Remisión de Retiro</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date" className="block">
            Fecha de la remisión
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="remittanceNumber" className="block">
            Número de remisión
          </label>
          <input
            type="text"
            id="remittanceNumber"
            name="remittanceNumber"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Número de remisión"
            required
          />
        </div>
        <div>
          <label htmlFor="meters3" className="block">
            Metros cúbicos
          </label>
          <input
            type="number"
            id="meters3"
            name="meters3"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Metros cúbicos"
            required
          />
        </div>
        <div>
          <label htmlFor="observations" className="block">
            Observaciones
          </label>
          <textarea
            id="observations"
            name="observations"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Observaciones"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Crear
        </button>
      </form>
    </div>
  );
}


// Componente para la lista de remisiones de retiro
function WithdrawalList({
  withdrawals,
  onDeleteWithdrawal,
}: {
  withdrawals: { id: number; date: string; remittanceNumber: string; meters3: string; observations: string }[];
  onDeleteWithdrawal: (id: number) => void;
}) {

  return (
    <div>
      <h2 className="font-bold text-lg">Listado de Remisiones de Retiro</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Numero de remisión</TableHead>
            <TableHead>Metros Cúbicos</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id} >
              <TableCell>{withdrawal.date}</TableCell>
              <TableCell>{withdrawal.remittanceNumber}</TableCell>
              <TableCell>{withdrawal.meters3}</TableCell>
              <TableCell>{withdrawal.observations}</TableCell>
              <TableCell>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDeleteWithdrawal(withdrawal.id)}
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
export default function RemisionesDeRetiro() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id_proyecto } = useParams();
  const [totalMetres, setTotalMetres] = useState(0);
  const [total, setTotal] = useState({} as any);

  // Cargar remisiones de retiro
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const data: any = await getWithdrawals(id_proyecto);
        const total: any = await getProjectTotal(id_proyecto);
        setTotalMetres(data.reduce((acc: number, withdrawal: any) => acc + parseFloat(withdrawal.meters3), 0));
        setWithdrawals(data);
        setTotal(total);
      } catch (error) {
        console.error("Error al obtener las remisiones de retiro:", error);
        alert("No se pudo cargar la lista de remisiones de retiro.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, [isLoading]);

  const handleWithdrawalCreated = () => {
    setIsLoading(true);
  };

  const handleDeleteWithdrawal = async (id: any) => {
    try {
      await deleteWithdrawal(id);
      alert("¡Remisión de retiro eliminada exitosamente!");
      setIsLoading(true);
    } catch (error) {
      console.error("Error al eliminar la remisión de retiro:", error);
      alert("No se pudo eliminar la remisión de retiro.");
    }
  };

  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
      
      <div className="flex justify-between items-center">
        <div>
        <h1 className="font-bold text-2xl">Remisiones de Retiro</h1>
        <p className="text-gray-500">Listado de remisiones de retiro</p>
        </div>
        <a href={'/proyectos/' + id_proyecto} className=" text-gray-600 hover:text-gray-900 rounded">Volver</a>
      </div>
      <section className="mt-6 space-y-6">
        <WithdrawalForm onWithdrawalCreated={handleWithdrawalCreated} />
        <div className="items-end flex flex-col">
          <h2 className="font-bold text-lg">Total de metros cúbicos: {totalMetres}</h2>
          <p className="font-bold">Volumen Corte Total (m³): {(parseFloat(total.TotVolIzq) + parseFloat(total.TotVolDer)).toFixed(2)}</p>
          <p className="font-bold">Diferencia de Volumen Corte (m³):  {(parseFloat(total.TotVolIzq) + parseFloat(total.TotVolDer)-totalMetres).toFixed(2) }</p>
          </div>
        {!isLoading && <WithdrawalList withdrawals={withdrawals} onDeleteWithdrawal={handleDeleteWithdrawal} />}
      </section>
    </main>
  );
}
