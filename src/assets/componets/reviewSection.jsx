import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
// Import diretto della singola icona: evita il "barrel" con ~2000 icone che
// Vite 8 non riesce a pre-ottimizzare in dev (import { Trash } from "..." dava errore).
import Trash from "react-bootstrap-icons/dist/icons/trash";
import Stars from "./stars";
import {
  getReviews,
  addReview,
  deleteReview,
  averageRating,
} from "../utils/reviews";

// "1 recensione" / "N recensioni" (evita il plurale con 1 elemento).
function labelRecensioni(n) {
  if (n === 1) return "1 recensione";
  return `${n} recensioni`;
}

// Lista delle recensioni + bottone "Elimina".
function ReviewList({ reviews, onDelete }) {
  if (reviews.length === 0) {
    return (
      <p className="text-body-secondary">
        Ancora nessuna recensione. Scrivi la prima!
      </p>
    );
  }

  return (
    // Lista scrollabile: ogni recensione è una mini-card separata.
    <ul className="list-unstyled review-list mb-3">
      {reviews.map((r) => (
        <li key={r._id} className="bg-body-tertiary rounded p-3 mb-2">
          {/* Intestazione: autore (troncato se lungo) + data a sinistra, voto a destra.
              min-w-0 permette il troncamento e impedisce che l'email schiacci le stelle. */}
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div className="min-w-0">
              <strong className="d-block text-truncate">{r.author}</strong>
              <span className="text-body-secondary small">
                {new Date(r.createdAt).toLocaleDateString("it-IT")}
              </span>
            </div>
            <Stars value={r.rate} />
          </div>

          {/* Testo dell'utente: React lo tratta come testo, niente HTML → niente XSS.
              text-break manda a capo parole/emoji lunghe senza sfondare la card. */}
          <p className="mb-2 text-break">{r.comment}</p>

          {/* Elimina la recensione tramite il suo _id. Bottone solo-icona:
              aria-label/title spiegano l'azione (accessibilità + tooltip). */}
          <div className="text-end">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(r._id)}
              aria-label="Elimina recensione"
              title="Elimina recensione"
            >
              <Trash />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Form per aggiungere una recensione. Chiama onAdd con i dati inseriti.
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

// Sezione recensioni SEMPRE visibile (sostituisce la vecchia modale).
// Riceve da App il libro selezionato (stato "elevato") e mostra le sue recensioni.
function ReviewSection({ book }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Equivalente con gli hooks di componentDidUpdate: quando cambia il libro
  // selezionato (nuovo asin), ricarica dinamicamente le sue recensioni dall'API.
  // L'array [book] è la "dipendenza": l'effetto rigira solo quando book cambia.
  useEffect(() => {
    // Nessun libro selezionato: non c'è niente da caricare.
    if (!book) return;

    // Guard anti-race-condition: se cambio libro mentre la fetch è in volo,
    // il cleanup mette attivo=false e la risposta "vecchia" viene ignorata.
    let attivo = true;

    async function carica() {
      setLoading(true);
      try {
        // Usa l'id del libro selezionato (book.asin) per recuperare le recensioni.
        const dati = await getReviews(book.asin);
        if (attivo) setReviews(dati);
      } catch (err) {
        console.error("Caricamento recensioni:", err);
      } finally {
        if (attivo) setLoading(false);
      }
    }

    carica();

    // Cleanup: gira prima del prossimo effetto (o allo smontaggio).
    return () => {
      attivo = false;
    };
  }, [book]);

  // Salva la nuova recensione usando l'id del libro selezionato.
  async function handleAdd(nuova) {
    const creata = await addReview(book.asin, nuova);
    setReviews((precedenti) => [...precedenti, creata]);
  }

  // Elimina una recensione (con conferma) e aggiorna la lista se la DELETE riesce.
  async function handleDelete(id) {
    if (!window.confirm("Eliminare questa recensione?")) return;

    try {
      await deleteReview(id);
      setReviews((precedenti) => precedenti.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Eliminazione recensione:", err);
    }
  }

  // Nessun libro scelto: la sezione resta comunque visibile, con un invito.
  if (!book) {
    return (
      <div className="border rounded shadow-sm p-4 text-center">
        <p className="text-body-secondary mb-0">
          Seleziona un libro per vederne le recensioni.
        </p>
      </div>
    );
  }

  const media = averageRating(reviews);

  return (
    <div className="border rounded shadow-sm p-3">
      {/* Titolo del libro selezionato */}
      <h5 className="mb-3">{book.title}</h5>

      {/* Durante la fetch mostriamo l'attesa invece del riepilogo/lista */}
      {loading && <p className="text-body-secondary">Caricamento recensioni…</p>}

      {!loading && (
        <>
          {/* Riepilogo voto medio: media arrotondata per le stelle piene */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <Stars value={Math.round(media)} />
            <span className="text-body-secondary small">
              {media.toFixed(1)} · {labelRecensioni(reviews.length)}
            </span>
          </div>

          <ReviewList reviews={reviews} onDelete={handleDelete} />
        </>
      )}

      <hr />

      <ReviewForm onAdd={handleAdd} />
    </div>
  );
}

export default ReviewSection;
