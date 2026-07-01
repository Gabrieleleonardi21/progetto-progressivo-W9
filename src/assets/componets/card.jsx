import { Card } from "react-bootstrap";

// Card di un singolo libro: riceve il libro via prop e mostra copertina, titolo e prezzo
function BookCard({ book }) {
  return (
    <Card className="h-100">
      {/* book-cover = altezza fissa uguale per tutte le card; cover riempie tutta la scatola ritagliando l'eccesso */}
      <Card.Img
        variant="top"
        src={book.img}
        alt={book.title}
        className="object-fit-cover book-cover"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{book.title}</Card.Title>
        <Card.Title className="fs-6">{book.price}</Card.Title>
        <Card.Title className="fs-6">{book.category}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
