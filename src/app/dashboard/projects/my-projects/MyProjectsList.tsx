import { createClient } from "@/lib/supabase/server";
import MyProjectCard from "./MyProjectCard";

export default async function MyProjectsList({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, project_applications(count)")
    .eq("author_id", userId)
    .eq("project_applications.status", "PENDING");

  if (error) {
    return <p className="text-red-500">Error loading projects</p>;
  }

  return (
    <div className="h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
      {projects && projects.length > 0 ? (
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <MyProjectCard
              key={project.id}
              project={project}
              pendingApplications={project.project_applications[0]?.count || 0}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          No projects yet. Create one!
        </p>
      )}
    </div>
  );
}
