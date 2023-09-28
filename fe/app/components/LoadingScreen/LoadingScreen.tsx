import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingScreen() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <ProgressSpinner
        style={{ maxWidth: "60px" }}
        fill="var(--surface-ground)"
        pt={{
          spinner: { style: { animationDuration: "0.6s" } },
          circle: {
            style: {
              stroke: "var(--primary-color)",
              strokeWidth: 3,
              animation: "none",
            },
          },
        }}
      />
    </div>
  );
}
