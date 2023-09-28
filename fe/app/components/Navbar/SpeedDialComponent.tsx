import { MenuItem } from "primereact/menuitem";
import { SpeedDial } from "primereact/speeddial";
import useThemeMode from "@/app/hooks/useThemeMode";
import { auth } from "@/app/utils/Firebase";
import { useRouter } from "next/navigation";

export default function SpeedDialComponent() {
  const router = useRouter();

  const { changeThemeMode, isDarkMode } = useThemeMode();

  const isDarkOn = isDarkMode();

  const items: MenuItem[] = [
    {
      label: isDarkOn ? "Light Mode" : "Dark Mode",
      icon: "pi" + (isDarkOn ? " pi-sun" : " pi-moon"),
      command: () => {
        changeThemeMode();
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        auth.signOut().then(() => {
          router.push("/login");
        });
      },
    },
  ];

  return (
    <SpeedDial
      model={items}
      direction="down"
      transitionDelay={120}
      className="top-5 left-5"
      showIcon="pi pi-ellipsis-v"
      hideIcon="pi pi-times"
      buttonClassName="p-button-outlined text-indigo-600 dark:text-violet-300"
    />
  );
}
