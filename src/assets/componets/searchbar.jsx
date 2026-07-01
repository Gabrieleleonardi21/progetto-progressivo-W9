import { Container, Form, InputGroup } from "react-bootstrap";

// Non tiene lo stato: riceve il valore (query) e la funzione per aggiornarlo (onSearch) da App.
// Così lo stato vive dove servono i dati da filtrare (state sollevato).
function SearchBar({ query, onSearch }) {
  return (
    // Stessa larghezza della griglia dei libri (Container non fluid, senza px-5); mb-4 = stacco dalle card
    <Container className="mb-2 px-0">
      <InputGroup>
        {/* Icona a sinistra: emoji, nessuna dipendenza extra */}
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Cerca un libro per titolo..."
          aria-label="Cerca libri per titolo"
          value={query}
          // Ad ogni tasto passa il testo ad App, che rifiltra la lista
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
    </Container>
  );
}

export default SearchBar;
