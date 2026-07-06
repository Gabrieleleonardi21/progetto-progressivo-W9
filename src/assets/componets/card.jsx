import { Card } from "react-bootstrap";

// Card di un singolo libro: SOLO presentazione.
// Cliccandola avvisa App tramite onSelect (stato "elevato"); "selected"
// evidenzia il libro attualmente scelto, di cui la sezione mostra le recensioni.
function BookCard({ book, selected, onSelect }) {
  // Bordo evidenziato solo sulla card selezionata (niente ternario).
  let classi = "h-100";
  if (selected) classi += " border-primary border-2";

  return (
    // role="button": Bootstrap mostra il cursore a mano e rende chiaro che è cliccabile
    <Card className={classi} role="button" onClick={onSelect}>
      {/* book-cover = altezza fissa uguale per tutte le card; cover riempie la scatola ritagliando l'eccesso */}
      <Card.Img
        variant="top"
        src={book.img}
        alt={book.title}
        className="object-fit-cover book-cover"
      />
      <Card.Body>
        <Card.Title className="fs-6">{book.title}</Card.Title>
        <Card.Title className="fs-6">{book.price}</Card.Title>
        <Card.Title className="fs-6">{book.category}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
