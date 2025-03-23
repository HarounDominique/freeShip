import { Suspense } from "react";
import MyProjectsDashboardView from "@/app/dashboard/projects/my-projects/MyProjectsDashboardView";
import OtherProjectsDashboardView from "@/app/dashboard/projects/other/OtherProjectsDashboardView";
import HallDashboardView from "@/app/dashboard/projects/hall/HallDashboardView";
import Spinner from "../../components/ui/spinner";

export function DashboardTabsContent({
  activeTab,
  userId,
}: {
  activeTab: string;
  userId: string;
}) {
  return (
    <>
      {/* Este contenido será visible en pantallas móviles */}
      <div className="md:hidden theme-card p-4 rounded-lg shadow-md">
        <Suspense fallback={<Spinner />}>
          {activeTab === "misProyectos" ? (
            <MyProjectsDashboardView userId={userId} />
          ) : activeTab === "comunidad" ? (
            <OtherProjectsDashboardView userId={userId} />
          ) : (
            <HallDashboardView userId={userId} />
          )}
        </Suspense>
      </div>

      {/* Este contenido será visible solo en pantallas de PC */}
      <div className="hidden md:block flex-grow">
        <Suspense fallback={<Spinner />}>
          {activeTab === "misProyectos" ? (
            <div className="flex-grow h-full w-full theme-card p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
              <MyProjectsDashboardView userId={userId} />
            </div>
          ) : activeTab === "comunidad" ? (
            <div className="flex-grow h-full w-full theme-card p-4 rounded-lg shadow-md flex flex-col overflow-hidden">
              <OtherProjectsDashboardView userId={userId} />
            </div>
          ) : (
            <HallDashboardView userId={userId} />
          )}
        </Suspense>
      </div>
    </>
  );
}
