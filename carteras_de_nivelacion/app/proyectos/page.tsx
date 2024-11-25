"use client";

import React, { useState, useEffect } from "react";
import { createProject, getProjects, deleteProject } from "../../lib/actions/project";

// Componente para crear un proyecto
function ProjectForm({ onProjectCreated }: { onProjectCreated: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createProject(formData);
      alert("¡Proyecto creado exitosamente!");
      onProjectCreated();
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      alert("Hubo un problema al crear el proyecto.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Crear Proyecto</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block">
            Nombre del proyecto
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Nombre del proyecto"
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

// Componente para la lista de proyectos
function ProjectList({
  projects,
  onDeleteProject,
}: {
  projects: { id: number; name: string }[];
  onDeleteProject: (id: number) => void;
}) {
  return (
    <div>
      <h2 className="font-bold text-lg">Listado de proyectos</h2>
      <ul className="mt-4 space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between align-middle p-4 border border-gray-300 rounded"
          >
            <span>{project.name}</span>
            <div className="space-x-2">
              <a className="px-2 py-1.5 bg-blue-500 text-white rounded" href={`/proyectos/${project.id}`}>
                Editar
              </a>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => onDeleteProject(project.id)}
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
export default function Proyectos() {
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data: any = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        alert("No se pudo cargar la lista de proyectos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isLoading]);

  const handleProjectCreated = () => {
    setIsLoading(true);
  };

  const handleDeleteProject = async (id: any) => {
    try {
      await deleteProject(id);
      alert("¡Proyecto eliminado exitosamente!");
      setIsLoading(true);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      alert("No se pudo eliminar el proyecto.");
    }
  };

  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
      <h1 className="font-bold text-2xl">Proyectos</h1>
      <p className="text-gray-500">Listado de proyectos</p>
      <section className="mt-6 space-y-6">
        <ProjectForm onProjectCreated={handleProjectCreated} />
        {!isLoading && <ProjectList projects={projects} onDeleteProject={handleDeleteProject} />}
      </section>
    </main>
  );
}
