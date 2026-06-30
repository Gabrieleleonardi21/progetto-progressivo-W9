import { Container, Row, Col } from "react-bootstrap";
import Header from "./assets/componets/header";
import BookCard from "./assets/componets/card";
import Footer from "./assets/componets/footer";
import libri from "./assets/data/fantasy.json"; // 150 libri fantasy

function App() {
  return (
    // Colonna alta quanto la viewport: spinge il footer a fondo pagina anche con poco contenuto
    <div className="d-flex flex-column min-vh-100">
      <Header />

      {/* Container NON fluid: la griglia arriva ai bordi del container, stessa larghezza di nav e hero (che riempiono tutto il loro Container) */}
      <Container as="main" className="flex-grow-1">
        <Row className="g-4">
          {libri.map((libro) => (
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
