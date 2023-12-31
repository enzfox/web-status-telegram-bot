import { ElementType, FC } from "react";
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
}

const NavItem: FC<NavItemProps> = ({ href, pathName, Icon, label }) => {
  return (
    <Link
      to={href}
      className={`menu-item text-white mx-2 ${
        pathName === href ? "active" : ""
      }`}
    >
      <Icon className="shadow-2xl drop-shadow-2xl rounded-full" />

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
          Icon={BsCollectionFill}
          label="Dash"
        />

        <NavItem
          href="/websites"
          pathName={pathName}
          Icon={FaGlobe}
          label="Websites"
        />

        <NavItem
          href="/config"
          pathName={pathName}
          Icon={BsGearFill}
          label="Config"
        />
      </nav>
    </>
  );
}
