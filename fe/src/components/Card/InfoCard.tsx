import { Card } from "primereact/card";
import "./InfoCard.scss";
import { CSSProperties } from "react";

interface InfoCardProps {
  card: {
    title: string;
    subTitle: string;
    content: string;
    image: string;
    cardBackground: string;
    style: CSSProperties;
  };
}

export default function InfoCard({ card }: InfoCardProps) {
  const header = (
    <img
      alt={card.title}
      src={card.image}
      height={300}
      width={300}
      className="h-[300px]"
    />
  );

  return (
    <>
      <div className="card shadow-xl hover:shadow-2xl h-[100%]">
        <Card
          title={card.title}
          subTitle={card.subTitle}
          header={header}
          className={card.cardBackground + " h-[100%]"}
          style={card.style}
        >
          <p
            className="m-0 text-center"
            dangerouslySetInnerHTML={{ __html: card.content }}
          />
        </Card>
      </div>
    </>
  );
}
