import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Stars from "./stars";
import { averageRating } from "../utils/reviews";

// "1 recensione" / "N recensioni" (evita di mostrare il plurale con 1 elemento).
function labelRecensioni(n) {
  if (n === 1) return "1 recensione";
  return `${n} recensioni`;
}

// Lista delle recensioni già presenti per il libro.
function ReviewList({ reviews, onDelete }) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted">Ancora nessuna recensione. Scrivi la prima!</p>
    );
  }

  return (
    <ul className="list-unstyled mb-0">
      {reviews.map((r) => (
        <li key={r._id} className="border-bottom pb-2 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{r.author}</strong>
            <Stars value={r.rate} />
          </div>
          <div className="text-muted small mb-1">
            {new Date(r.createdAt).toLocaleDateString("it-IT")}
          </div>
          {/* Testo inserito dall'utente: React lo tratta come testo, niente HTML → niente XSS */}
          <p className="mb-1">{r.comment}</p>

          {/* Elimina la recensione tramite il suo _id */}
          <Button
            variant="link"
            size="sm"
            className="text-danger p-0 text-decoration-none"
            onClick={() => onDelete(r._id)}
          >
            Elimina
          </Button>
        </li>
      ))}
    </ul>
  );
}

// Form per aggiungere una recensione. Chiama onAdd con la nuova recensione.
function ReviewForm({ onAdd }) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errore, setErrore] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Voto e commento sono obbligatori.
    if (rating === 0) {
      setErrore("Seleziona un voto da 1 a 5 stelle.");
      return;
    }
    if (comment.trim() === "") {
      setErrore("Scrivi un commento.");
      return;
    }

    // _id e createdAt li genera il server; qui inviamo solo i dati del form.
    // Nome vuoto → "Anonimo".
    try {
      await onAdd({
        author: author.trim() || "Anonimo",
        rate: rating,
        comment: comment.trim(),
      });
    } catch {
      // La POST è fallita: teniamo i dati nel form così l'utente può riprovare.
      setErrore("Invio non riuscito, riprova.");
      return;
    }

    // Conferma all'utente che la recensione è stata inviata.
    window.alert("Recensione inviata!");

    // Reset del form solo dopo l'invio andato a buon fine.
    setAuthor("");
    setRating(0);
    setComment("");
    setErrore("");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h6>Aggiungi una recensione</h6>

      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Nome (opzionale)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Anonimo"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="mb-1 d-block">Voto</Form.Label>
        <Stars value={rating} onSelect={setRating} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="mb-1">Commento</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Cosa ne pensi del libro?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>

      {/* Messaggio di errore mostrato solo se presente */}
      {errore && <p className="text-danger small">{errore}</p>}

      <Button type="submit" variant="primary">
        Invia recensione
      </Button>
    </Form>
  );
}

// Modale: dettaglio libro + voto medio + recensioni + form.
function ReviewModal({ book, show, onHide, reviews, loading, onAdd, onDelete }) {
  const media = averageRating(reviews);

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{book.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Durante la fetch mostriamo l'attesa invece del riepilogo/lista */}
        {loading && <p className="text-muted">Caricamento recensioni…</p>}

        {!loading && (
          <>
            {/* Riepilogo voto medio: la media è arrotondata per mostrare le stelle piene */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <Stars value={Math.round(media)} />
              <span className="text-muted small">
                {media.toFixed(1)} · {labelRecensioni(reviews.length)}
              </span>
            </div>

            <ReviewList reviews={reviews} onDelete={onDelete} />
          </>
        )}

        <hr />

        <ReviewForm onAdd={onAdd} />
      </Modal.Body>
    </Modal>
  );
}

export default ReviewModal;
