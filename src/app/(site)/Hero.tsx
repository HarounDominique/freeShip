import "../../index.css";
import { ChevronDownIcon } from "lucide-react";

const HeroSection = ({ loginSectionRef }) => {
  const scrollToLogin = () => {
    if (loginSectionRef?.current) {
      loginSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <svg
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="w-[200px] h-[200px] animate-leveitate"
        preserveAspectRatio="xMidYMid meet"
      >
        <g id="SVGRepo_iconCarrier">
          <path fill="#acd916" d="M30.47 104.24h13.39v13.39H30.47z"></path>
          <path fill="#acd916" d="M84.04 104.24h13.39v13.39H84.04z"></path>
          <path fill="#acd916" d="M30.48 10.51h13.39V23.9H30.48z"></path>
          <path fill="#acd916" d="M84.04 10.51h13.39V23.9H84.04z"></path>
          <radialGradient
            id="IconifyId17ecdb2904d178eab5528"
            cx="64.344"
            cy="9.403"
            r="83.056"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".508" stopColor="#acd916"></stop>
            <stop offset=".684" stopColor="#acd916"></stop>
            <stop offset=".878" stopColor="#acd916"></stop>
            <stop offset=".981" stopColor="#acd916"></stop>
          </radialGradient>
          <path
            d="M97.46 64.08V37.3H84.04V23.9H70.65v13.4H57.26V23.9H43.87v13.4H30.48v26.78H17.09v13.39h13.39v13.4h13.39v13.38h13.39V90.87h13.39v13.38h13.39V90.87h13.42v-13.4h13.37V64.08H97.46zm-40.21 0H43.86V50.69h13.39v13.39zm26.78 0H70.64V50.69h13.39v13.39z"
            fill="url(#IconifyId17ecdb2904d178eab5528)"
          ></path>
          <radialGradient
            id="IconifyId17ecdb2904d178eab5529"
            cx="63.118"
            cy="24.114"
            r="65.281"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".508" stopColor="#acd916"></stop>
            <stop offset=".684" stopColor="#acd916"></stop>
            <stop offset=".878" stopColor="#acd916"></stop>
            <stop offset=".981" stopColor="#acd916"></stop>
          </radialGradient>
          <path
            fill="url(#IconifyId17ecdb2904d178eab5529)"
            d="M110.82 37.29h13.4v26.8h-13.4z"
          ></path>
          <radialGradient
            id="IconifyId17ecdb2904d178eab5530"
            cx="62.811"
            cy="13.081"
            r="75.09"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".508" stopColor="#acd916"></stop>
            <stop offset=".684" stopColor="#acd916"></stop>
            <stop offset=".878" stopColor="#acd916"></stop>
            <stop offset=".981" stopColor="#acd916"></stop>
          </radialGradient>
          <path
            fill="url(#IconifyId17ecdb2904d178eab5530)"
            d="M3.7 37.28h13.4v26.8H3.7z"
          ></path>
        </g>
      </svg>

      {/* Título */}
      <h1 className="text-5xl font-semibold mt-4" style={{ color: "var(--text-primary)" }}>
        <span className="text-4xl !text-[#acd916]">BUG</span><span className="font-normal">overflow</span>
      </h1>

      {/* Flecha para hacer scroll */}
      <button
        onClick={scrollToLogin}
        className="absolute top-[75%] animate-bounce transition-opacity duration-1000"
        style={{ backgroundColor: "transparent" }}
      >
        <ChevronDownIcon className="w-12 h-12 text-[var(--accent-color)]" />
      </button>
    </div>
  );
};

export default HeroSection;
