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
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, title, rating_count, description, author_name, author_id, (author_id=auth.uid()) AS is_mine"
          )
          .gt("rating_count", 0)
          .order("rating_count", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        setProjects(data);
        setLoading(false);
        
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Versión para PC */}
      {!isMobile && (
        <>
          <h2 className="text-5xl font-bold mb-6 text-center pr-20">⇀ 1% ↼</h2>
          <ul className="space-y-6 md:w-4/5 mx-auto">
            {projects.map((project, index) => (
              <div key={project.id} className="flex items-center">
                {index < 3 && (
                  <span className="text-5xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                )}
                <HallProjectCard project={project} />
              </div>
            ))}
          </ul>
        </>
      )}

      {/* Versión para móvil */}
      {isMobile && (
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          <h2 className="text-3xl font-bold mb-4 text-center">⇀ 1% ↼</h2>
          <ul className="space-y-4 relative">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="relative flex items-center pl-10"
              >
                {index < 3 && (
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-3xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                )}
                <HallProjectCard project={project} />
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
