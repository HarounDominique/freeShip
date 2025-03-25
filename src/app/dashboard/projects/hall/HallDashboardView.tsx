"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/spinner";
import HallProjectCard from "@/app/dashboard/projects/hall/HallProjectCard";

export default function HallDashboardView({
  userId,
}: {
  userId: string;
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Usuario no autenticado");
        }

        const { data, error } = await supabase
          .from("projects")
          .select("id, title, rating_count, description, author_name, author_id")
          .gte("rating_count", 1)
          .order("rating_count", { ascending: false })
          .limit(10);

        if (error) throw error;

        // Agregar `is_mine` manualmente
        const myProjects = data.map(project => ({
          ...project,
          is_mine: project.author_id === user.id
        }));

        setProjects(myProjects);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);


  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col items-center">
      {/* Versión para PC */}
      {!isMobile && (
        <>
          <h2 className="text-5xl font-bold mb-6 text-center">⇀ 1% ↼</h2>
          <div className="w-full max-w-3xl overflow-y-auto max-h-[80vh]">
            <ul className="space-y-6">
              {projects.map((project, index) => (
                <div key={project.id} className="flex justify-center">
                  <HallProjectCard project={project} rank={index} />
                </div>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Versión para móvil */}
      {isMobile && (
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          <h2 className="text-3xl font-bold mb-4 text-center">⇀ 1% ↼</h2>
          <div className="w-full max-w-md mx-auto overflow-y-auto max-h-[70vh]">
            <ul className="space-y-4">
              {projects.map((project, index) => (
                <div key={project.id} className="flex justify-center">
                  <HallProjectCard project={project} rank={index} />
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
