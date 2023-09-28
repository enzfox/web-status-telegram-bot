import usePageTitle from "@/app/hooks/usePageTitle";
import "./PageTitle.css";

export function PageTitle({ title }: { title: string }) {
  usePageTitle(title);

  return (
    <>
      <h1 className="text-4xl font-bold pb-5 text-center">{title}</h1>
    </>
  );
}
