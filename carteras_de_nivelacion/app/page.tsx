import { Button } from "@/components/ui/button"


const projects = [
    { id: 1, name: 'Proyecto 1' },
    { id: 2, name: 'Proyecto 2' },
    { id: 3, name: 'Proyecto 3' },
    ]

export default function Proyectos() {
  return (
    <main className="w-2/3 py-6 mx-auto font-mono flex flex-col items-center h-screen justify-center">
        <h1 className="font-bold text-4xl mb-4">Cartera de nivelación</h1>
        <a href="/proyectos" className="px-4 py-2 bg-blue-500 text-white rounded">Comenzar Ahora</a>
    </main>
  )
}