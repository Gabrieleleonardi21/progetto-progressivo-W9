import { Card } from "react-bootstrap";

// Card di un singolo libro: riceve il libro via prop e mostra copertina, titolo e prezzo
function BookCard({ book }) {
  return (
    <Card className="h-100">
      {/* aspect-ratio 2/3 = rettangolo verticale (formato copertina); cover riempie e ritaglia l'eccesso */}
      <Card.Img
        variant="top"
        src={book.img}
        alt={book.title}
        className="object-fit-cover"
        style={{ aspectRatio: "2 / 3" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{book.title}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
