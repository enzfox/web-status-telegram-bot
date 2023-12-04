import { FC } from "react";
import computer from "../../assets/images/dash.webp";
import websites from "../../assets/images/list.webp";
import config from "../../assets/images/settings.webp";
import SpeedDialComponent from "../Navbar/SpeedDialComponent";
import { Link, useLocation } from "react-router-dom";

import "./Navbar.scss";

interface NavItemProps {
  href: string;
  pathName: string;
  imageSrc: string;
  label: string;
}

const NavItem: FC<NavItemProps> = ({ href, pathName, imageSrc, label }) => {
  return (
    <Link
      to={href}
      className={`menu-item text-white mx-2 ${
        pathName === href ? "active" : ""
      }`}
    >
      <img
        src={imageSrc}
        alt=""
        width={100}
        height={100}
        className="shadow-2xl drop-shadow-2xl rounded-full"
      />

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
          imageSrc={computer}
          label="Dash"
        />
        <NavItem
          href="/websites"
          pathName={pathName}
          imageSrc={websites}
          label="Websites"
        />
        <NavItem
          href="/config"
          pathName={pathName}
          imageSrc={config}
          label="Config"
        />
      </nav>
    </>
  );
}
