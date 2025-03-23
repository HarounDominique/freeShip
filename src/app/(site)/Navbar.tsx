"use client";

import Link from "next/link";
import { X, User, Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "../../app/context/ThemeContext";

interface NavbarProps {
  handleSignOut: () => void;
}

export default function Navbar({ handleSignOut }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cierra el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, []);

  return (
    <nav
      className={`w-full transition-colors duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-5">
            <svg
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-[50px] h-[50px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#acd916"
                  d="M30.47 104.24h13.39v13.39H30.47z"
                ></path>
                <path
                  fill="#acd916"
                  d="M84.04 104.24h13.39v13.39H84.04z"
                ></path>
                <path fill="#acd916" d="M30.48 10.51h13.39V23.9H30.48z"></path>
                <path fill="#acd916" d="M84.04 10.51h13.39V23.9H84.04z"></path>
                <path
                  fill="#acd916"
                  d="M97.46 64.08V37.3H84.04V23.9H70.65v13.4H57.26V23.9H43.87v13.4H30.48v26.78H17.09v13.39h13.39v13.4h13.39v13.38h13.39V90.87h13.39v13.38h13.39V90.87h13.42v-13.4h13.37V64.08H97.46zm-40.21 0H43.86V50.69h13.39v13.39zm26.78 0H70.64V50.69h13.39v13.39z"
                ></path>
                <path fill="#acd916" d="M110.82 37.29h13.4v26.8h-13.4z"></path>
                <path fill="#acd916" d="M3.7 37.28h13.4v26.8H3.7z"></path>
              </g>
            </svg>
            <span className="text-lg font-semibold">bugoverflow</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Botón de cambio de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Cambiar a modo ${
              theme === "light" ? "oscuro" : "claro"
            }`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Dropdown del usuario */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition"
            >
              <User className="h-5 w-5" />
              <span>{username}</span>
            </button>

            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  theme === "light"
                    ? "bg-white text-black"
                    : "bg-gray-800 text-white"
                } p-2`}
              >
                <Link
                  href="/my_profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
