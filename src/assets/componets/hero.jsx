import { Container } from "react-bootstrap";

// Hero: banner di benvenuto sotto la navbar
function Hero() {
  return (
    // Stessa larghezza della nav: Container NON fluid + px-5. Attaccata alla nav (no margine sopra/rounded); bg-secondary-subtle = grigio un po' più scuro; mb-3 = stacco dalle card
    <Container className="bg-secondary-subtle text-center py-5 mb-1 px-5">
      <h1>Welcome to EpiBooks!</h1>
      <p className="text-muted mb-0">We list books</p>
    </Container>
  );
}

export default Hero;
