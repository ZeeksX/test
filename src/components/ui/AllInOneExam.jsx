/* eslint-disable react/prop-types */
import { Card, CardDescription } from "./Card";

export default function AllInOne({ title, description, cards }) {
  return (
    <section className="w-full p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cards.map((card, i) => (
          <Card key={i}>
            <div className="flex items-start gap-4 p-5">
              <img src={card.image} alt={card.title} className="w-12 h-12" />
              <div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
