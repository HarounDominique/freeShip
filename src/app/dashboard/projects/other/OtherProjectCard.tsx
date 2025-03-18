import Link from "next/link";
import { FaStar } from "react-icons/fa";

const CATEGORY_LABELS: Record<string, string> = {
  "WEB/DESKTOP": "Desarrollo web o escritorio",
  MOBILE: "Desarrollo móvil",
  EMBEDDED: "Código embebido",
  VIDEOGAME: "Videojuego",
  "BD/IA/ML": "Big Data | Inteligencia Artificial | Machine Learning",
  CYBERSECURITY: "Ciberseguridad",
  "SCRIPTING/SCRAPING": "Scripting",
};

export default function OtherProjectCard({ project }: { project: any }) {
  return (
    <li
      className="relative w-full sm:w-4/5 mx-auto border p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-[1.01]"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <Link
        href={`/dashboard/projects/other/${project.id}`}
        className="block space-y-3"
      >
        {/* Fila 1: Título y Autor en línea */}
        <div className="flex items-center gap-x-3 mb-2">
          <h3 className="other-project-title">{project.title}</h3>
          <strong
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            propuesto por {project.author_name || "Desconocido"}
          </strong>
        </div>

        {/* Fila 2: Grid con 2 columnas */}
        <div className="grid grid-cols-4 gap-4">
          {/* Columna 1: Categoría y Stack Tecnológico */}
          <div
            className="col-span-1 flex flex-col text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.type && (
              <p className="mb-1">
                <strong style={{ color: "var(--text-primary)" }}>
                  Categoría:
                </strong>{" "}
                {CATEGORY_LABELS[project.type] || "Otra"}
              </p>
            )}
            {project.tech_stack && (
              <p>
                <strong style={{ color: "var(--text-primary)" }}>Stack:</strong>{" "}
                {project.tech_stack.join(", ")}
              </p>
            )}
          </div>

          {/* Columna 2: Descripción del Proyecto */}
          <div
            className="col-span-3 text-sm leading-relaxed line-clamp-2"
            style={{ color: "var(--text-primary)" }}
          >
            {project.description}
          </div>
        </div>

        {/* Sección de estrellas estáticas para mostrar la puntuación media */}
        {project.rating_avg > 0 && (
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={20}
              className={
                star <= Math.round(project.rating_avg || 0)
                  ? "text-[#acd916]"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        )}

      </Link>
    </li>
  );
}
