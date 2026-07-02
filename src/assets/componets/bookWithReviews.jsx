import { useState } from "react";
import BookCard from "./card";
import ReviewModal from "./reviewModal";
import {
  getReviews,
  addReview,
  deleteReview,
  averageRating,
} from "../utils/reviews";

// Contenitore di un libro: gestisce lo stato delle recensioni e della modale.
// Caricamento "lazy": le recensioni si scaricano solo alla prima apertura della
// modale, evitando una fetch per ognuno dei 150 libri all'avvio della pagina.
function BookWithReviews({ book }) {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  // Distingue "non ancora caricate" da "caricate ma zero recensioni".
  const [loaded, setLoaded] = useState(false);
  // Mostra un messaggio di attesa durante la fetch.
  const [loading, setLoading] = useState(false);

  // Apre la modale e carica le recensioni dall'API solo la prima volta.
  async function handleOpen() {
    setShowModal(true);
    if (loaded) return;

    setLoading(true);
    try {
      setReviews(await getReviews(book.asin));
      setLoaded(true);
    } catch (err) {
      console.error("Caricamento recensioni:", err);
    } finally {
      setLoading(false);
    }
  }

  // Invia la nuova recensione all'API e aggiunge quella creata allo stato.
  async function handleAdd(nuova) {
    const creata = await addReview(book.asin, nuova);
    setReviews((precedenti) => [...precedenti, creata]);
  }

  // Elimina la recensione dall'API e la rimuove dallo stato (solo se la DELETE riesce).
  async function handleDelete(id) {
    // Chiede conferma: la cancellazione è irreversibile.
    if (!window.confirm("Eliminare questa recensione?")) return;

    try {
      await deleteReview(id);
      setReviews((precedenti) => precedenti.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Eliminazione recensione:", err);
    }
  }

  return (
    <>
      <BookCard
        book={book}
        media={averageRating(reviews)}
        count={reviews.length}
        loaded={loaded}
        onOpen={handleOpen}
      />

      <ReviewModal
        book={book}
        show={showModal}
        onHide={() => setShowModal(false)}
        reviews={reviews}
        loading={loading}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </>
  );
}

export default BookWithReviews;
