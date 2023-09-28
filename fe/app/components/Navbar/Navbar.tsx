"use client";

import { FC } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import computer from "public/assets/images/dash.webp";
import websites from "public/assets/images/list.webp";
import config from "public/assets/images/settings.webp";
import SpeedDialComponent from "@/app/components/Navbar/SpeedDialComponent";
import "./Navbar.css";

interface NavItemProps {
  href: string;
  pathName: string;
  imageSrc: StaticImageData;
  label: string;
}

const NavItem: FC<NavItemProps> = ({ href, pathName, imageSrc, label }) => {
  return (
    <Link
      href={href}
      passHref
      className={`menu-item text-white mx-2 ${
        pathName === href ? "active" : ""
      }`}
    >
      <Image
        src={imageSrc}
        alt=""
        width={100}
        height={100}
        priority
        className="shadow-2xl drop-shadow-2xl rounded-full"
      />

      <p>{label}</p>
    </Link>
  );
};

export default function Navbar() {
  const pathName = usePathname() || "";

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
