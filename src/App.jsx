import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./assets/componets/header";
import Hero from "./assets/componets/hero";
import SearchBar from "./assets/componets/searchbar";
import BookCard from "./assets/componets/card";
import ReviewSection from "./assets/componets/reviewSection";
import Footer from "./assets/componets/footer";
import libri from "./assets/data/fantasy.json"; // 150 libri fantasy

function App() {
  // Testo digitato nella barra di ricerca (state sollevato: serve qui per filtrare i libri)
  const [query, setQuery] = useState("");

  // Stato "elevato" in App: il libro selezionato è condiviso tra la griglia
  // (che lo evidenzia) e la sezione recensioni (che ne mostra i commenti).
  const [selectedBook, setSelectedBook] = useState(null);

  // Tiene solo i libri il cui titolo contiene il testo cercato (case-insensitive)
  const libriFiltrati = libri.filter((libro) =>
    libro.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    // Colonna alta quanto la viewport: spinge il footer a fondo pagina anche con poco contenuto
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Hero />

      {/* Barra di ricerca sotto la hero: passa il valore e l'aggiornamento dello stato */}
      <SearchBar query={query} onSearch={setQuery} />

      <Container as="main" className="flex-grow-1">
        <Row className="g-4">
          {/* Colonna sinistra: griglia dei libri */}
          <Col lg={8}>
            {/* Nessun risultato: messaggio al posto della griglia vuota */}
            {libriFiltrati.length === 0 && (
              <p className="text-center text-muted py-5">Nessun libro trovato</p>
            )}
            <Row className="g-4">
              {libriFiltrati.map((libro) => (
                // key = asin: identificatore univoco di ogni libro
                <Col key={libro.asin} xs={12} sm={6} lg={4}>
                  {/* onSelect eleva la scelta ad App; selected evidenzia la card scelta */}
                  <BookCard
                    book={libro}
                    selected={selectedBook?.asin === libro.asin}
                    onSelect={() => setSelectedBook(libro)}
                  />
                </Col>
              ))}
            </Row>
          </Col>

          {/* Colonna destra: recensioni SEMPRE visibili del libro selezionato.
              position-sticky la tiene a vista mentre si scorrono i libri. */}
          <Col lg={4}>
            <div className="position-sticky" style={{ top: "1rem" }}>
              <ReviewSection book={selectedBook} />
            </div>
          </Col>
        </Row>
      </Container>

      <Footer></Footer>
    </div>
  );
}
export default App;
