import { Card } from "primereact/card";
import "./InfoCard.css";
import Image, { StaticImageData } from "next/image";

interface InfoCardProps {
  card: {
    title: string;
    subTitle: string;
    content: string;
    image: StaticImageData;
    cardBackground: string;
  };
}

export default function InfoCard({ card }: InfoCardProps) {
  const header = (
    <Image
      alt={card.title}
      src={card.image}
      height={500}
      width={500}
      priority
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
