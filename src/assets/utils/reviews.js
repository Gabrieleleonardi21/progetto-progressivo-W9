// Gestione recensioni tramite l'API Striveschool (comments).
//   GET  /comments/:elementId  -> recensioni di un libro
//   POST /comments/            -> aggiunge una recensione
// Una recensione dell'API = { _id, comment, rate (1-5), author, elementId, createdAt }.

const BASE = "https://striveschool-api.herokuapp.com/api/comments";

// Token letto da .env.local (VITE_STRIVE_TOKEN): resta fuori dal codice sorgente.
const TOKEN = import.meta.env.VITE_STRIVE_TOKEN;

// Header di autenticazione, riusato da tutte le chiamate (evita ripetizioni).
function authHeaders() {
  return { Authorization: `Bearer ${TOKEN}` };
}

// Recensioni di un singolo libro (elementId = asin). Ritorna un array.
export async function getReviews(asin) {
  const res = await fetch(`${BASE}/${asin}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`GET recensioni fallita (${res.status})`);
  return res.json();
}

// Aggiunge una recensione al libro e ritorna quella creata dal server
// (con _id e createdAt generati dall'API).
export async function addReview(asin, { comment, rate, author }) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    // elementId collega la recensione al libro.
    body: JSON.stringify({ comment, rate, author, elementId: asin }),
  });
  if (!res.ok) throw new Error(`POST recensione fallita (${res.status})`);
  return res.json();
}

// Elimina una recensione dato il suo _id (NON l'asin: qui serve l'id del commento).
export async function deleteReview(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE recensione fallita (${res.status})`);
}

// Media dei voti (0 se non ci sono recensioni).
// Number(): il voto arriva dall'API, così evitiamo somme errate se fosse una stringa.
export function averageRating(reviews) {
  if (reviews.length === 0) return 0;
  const somma = reviews.reduce((tot, r) => tot + Number(r.rate), 0);
  return somma / reviews.length;
}
