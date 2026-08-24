import { Link } from "react-router-dom";
import logo from "../assets/logo_brown_3d.png";

const links = [
  { label: "หน้าแรก", to: "/" },
  { label: "เกี่ยวกับเรา", to: "/about" },
  { label: "เมนูอาหาร", to: "/menus" },
  { label: "บทความ", to: "/articles" },
  { label: "ติดต่อ", to: "/contacts" },
  { label: "เข้าสู่ระบบ", to: "/login" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4
  bg-[#F1EAD7]/80 backdrop-blur-[16px] backdrop-saturate-[50%] 
  border border-white/30 rounded-[64px] 
  shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-1 sm:p-2 overflow-x-auto overflow-y-hidden hide-scrollbar"
      >

        <div className="flex justify-start ml-2">
          <Link to="/" aria-label="หน้าหลัก">
            <img src={logo} alt="Logo" className="h-10 w-auto md:h-14" />
          </Link>
        </div>

        <div className="hide-scrollbar flex min-w-0 items-center justify-start gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap px-2 md:gap-6 lg:justify-center">
          {links.slice(0, -1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-brown-800 transition-opacity hover:opacity-80 md:text-base"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex justify-end mr-1 bg-amber-950 px-4 py-3 rounded-4xl text-white">
          <Link
            to={links[links.length - 1]?.to || "/login"}
            className="whitespace-nowrap text-sm font-bold text-brown-800 transition-opacity hover:opacity-80 md:text-base"
          >
            {links[links.length - 1]?.label || "เข้าสู่ระบบ"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
