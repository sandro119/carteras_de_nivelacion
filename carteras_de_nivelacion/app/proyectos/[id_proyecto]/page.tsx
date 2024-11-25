'use client';
import { Check } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useParams } from "next/navigation";


export default function Proyecto() {
  const params = useParams();
  const { id_proyecto } = params;
  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
      <div className="flex justify-between items-center">
        <div>
        <h1 className="font-bold text-2xl">Proyecto</h1>
        <p className="text-gray-500">Selecciona una acción</p>
        </div>
        <a href="/proyectos" className=" text-gray-600 hover:text-gray-900 rounded">Volver</a>
      </div>
        <section className="mt-6 space-x-6 flex">
        <Card>
      <CardHeader>
        <CardTitle>
          Cartera de nivelación
        </CardTitle>
        <CardDescription>
          Proyecto de nivelación de cartera
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <a href={`/proyectos/${id_proyecto}/cartera-nivelacion`} className="w-full px-4 py-2 bg-blue-500 text-white rounded flex justify-center">
          <Check /> Ir
        </a>
      </CardFooter>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>
          Remisión de maquinaria
        </CardTitle>
        <CardDescription>
          Proyecto de remisión de maquinaria
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <a href={`/proyectos/${id_proyecto}/remision-maquinaria`} className="w-full px-4 py-2 bg-blue-500 text-white rounded flex justify-center">
          <Check /> Ir
        </a>
      </CardFooter>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>
          Remisión de retiro
        </CardTitle>
        <CardDescription>
          Proyecto de remisión de retiro
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <a  href={`/proyectos/${id_proyecto}/remision-retiro`} className="w-full px-4 py-2 bg-blue-500 text-white rounded flex justify-center">
          <Check /> Ir
        </a>
      </CardFooter>
    </Card>
    </section>
    </main>
  );
}