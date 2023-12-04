import usePageTitle from "../../hooks/usePageTitle";
import "./PageTitle.scss";

export function PageTitle({ title }: { title: string }) {
  usePageTitle(title);

  return (
    <>
      <h1 className="text-4xl font-bold pb-5 text-center">{title}</h1>
    </>
  );
}
