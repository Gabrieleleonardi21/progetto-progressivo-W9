import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./assets/componets/header";
import Hero from "./assets/componets/hero";
import SearchBar from "./assets/componets/searchbar";
import BookCard from "./assets/componets/card";
import Footer from "./assets/componets/footer";
import libri from "./assets/data/fantasy.json"; // 150 libri fantasy

function App() {
  // Testo digitato nella barra di ricerca (state sollevato: serve qui per filtrare i libri)
  const [query, setQuery] = useState("");

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

      {/* Container NON fluid: la griglia arriva ai bordi del container, stessa larghezza di nav e hero (che riempiono tutto il loro Container) */}
      <Container as="main" className="flex-grow-1">
        {/* Nessun risultato: mostra un messaggio al posto della griglia vuota */}
        {libriFiltrati.length === 0 && (
          <p className="text-center text-muted py-5">Nessun libro trovato</p>
        )}
        <Row className="g-4">
          {libriFiltrati.map((libro) => (
            // key = asin: identificatore univoco di ogni libro
            <Col key={libro.asin} xs={12} sm={6} md={4} lg={4}>
              <BookCard book={libro} />
            </Col>
          ))}
        </Row>
      </Container>

      <Footer></Footer>
    </div>
  );
}
export default App;
