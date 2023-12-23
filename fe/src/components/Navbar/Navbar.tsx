import { CSSProperties, ElementType, FC } from "react";
import SpeedDialComponent from "../Navbar/SpeedDialComponent";
import { Link, useLocation } from "react-router-dom";
import { FaGlobe } from "react-icons/fa6";
import { BsCollectionFill, BsGearFill } from "react-icons/bs";

import "./Navbar.scss";

interface NavItemProps {
  href: string;
  pathName: string;
  Icon: ElementType;
  label: string;
  style: CSSProperties;
}

const NavItem: FC<NavItemProps> = ({ href, pathName, Icon, label, style }) => {
  return (
    <Link
      to={href}
      className={`menu-item text-white mx-2 ${
        pathName === href ? "active" : ""
      }`}
    >
      <Icon className="shadow-2xl drop-shadow-2xl rounded-full" style={style} />

      <p>{label}</p>
    </Link>
  );
};

export default function Navbar() {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <>
      <SpeedDialComponent />

      <nav className="fadeindown animation-duration-500">
        <NavItem
          href="/"
          pathName={pathName}
          Icon={FaGlobe}
          label="Dash"
          style={{ backgroundColor: "#FF6B6B" }}
        />

        <NavItem
          href="/websites"
          pathName={pathName}
          Icon={BsCollectionFill}
          label="Websites"
          style={{ backgroundColor: "#2A335C" }}
        />

        <NavItem
          href="/config"
          pathName={pathName}
          Icon={BsGearFill}
          label="Config"
          style={{ backgroundColor: "#757FFF" }}
        />
      </nav>
    </>
  );
}
