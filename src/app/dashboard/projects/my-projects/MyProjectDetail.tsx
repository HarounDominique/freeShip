import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectActions from "@/app/dashboard/projects/other/ProjectActions";
import Navbar from "@/app/(site)/Navbar";
import ProjectApplicationsList from "@/app/dashboard/projects/my-projects/ProjectApplicationsList";

export default async function MyProjectDetail({
  projectId,
}: {
  projectId: string;
}) {
  const supabase = createClient();

  // Obtener el proyecto
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    return <p className="text-red-500">Project not found</p>;
  }

  // Obtener el nombre de usuario del autor desde la tabla profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", project.author_id)
    .single();

  let authorName = "Desconocido";
  if (!profileError && profile && profile.username) {
    authorName = profile.username;
  }

  // Obtener el número de aplicaciones al proyecto
  const { data: applications, error: applicationsError } = await supabase
    .from("project_applications")
    .select("id")
    .eq("project_id", projectId);

  const hasApplications = applications && applications.length > 0;

  const handleSignOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="w-full bg-white shadow-md">
        <Navbar handleSignOut={handleSignOut} />
      </div>

      {/* Contenido que ocupa el 100% del espacio restante */}
      <div className="flex flex-row gap-12 flex-grow overflow-hidden p-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>

          <p className="mt-2">
            Propuesto por <strong>{authorName}</strong>{" "}
          </p>

          {project.type && (
            <p className="mt-2">
              <strong>Categoría:</strong> {project.type}
            </p>
          )}
          {project.tech_stack && (
            <p className="mt-2">
              <strong>Stack tecnológico:</strong>{" "}
              {project.tech_stack.join(", ")}
            </p>
          )}

          {project.github_repository && (
            <p className="mt-2">
              <strong>Repositorio de GitHub:</strong>{" "}
              <a
                href={project.github_repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5865f2] underline"
              >
                {project.github_repository}
              </a>
            </p>
          )}

          {/* Botones de Editar y Eliminar */}
          <ProjectActions projectId={projectId} />

          {/* Mostrar la lista de solicitudes solo si hay aplicaciones */}
          {hasApplications && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">
                Solicitudes de aplicación
              </h3>
              <ProjectApplicationsList projectId={project.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
