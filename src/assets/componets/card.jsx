import { Card } from "react-bootstrap";
import Stars from "./stars";

// Card di un singolo libro: SOLO presentazione.
// Voto medio (media), numero recensioni (count), stato di caricamento (loaded)
// e apertura modale (onOpen) arrivano via prop dal contenitore BookWithReviews.
function BookCard({ book, media, count, loaded, onOpen }) {
  return (
    // role="button": Bootstrap mostra il cursore a mano e rende chiaro che è cliccabile
    <Card className="h-100" role="button" onClick={onOpen}>
      {/* book-cover = altezza fissa uguale per tutte le card; cover riempie la scatola ritagliando l'eccesso */}
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

        {/* mt-auto tiene il blocco in fondo alla card.
            Con il caricamento lazy i dati non ci sono finché non si apre la modale:
            prima mostriamo un invito, poi voto medio + numero recensioni. */}
        <div className="mt-auto d-flex align-items-center gap-2">
          {!loaded && <small className="text-muted">Vedi recensioni</small>}
          {loaded && <Stars value={Math.round(media)} />}
          {loaded && <small className="text-muted">({count})</small>}
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
