import { Container, Navbar, Nav } from "react-bootstrap";

// Header: navbar con i link a sinistra
function Header() {
  return (
    <header>
      {/* Navbar grigio scuro: data-bs-theme="dark" rende brand e link chiari/leggibili; link a sinistra (me-auto) */}
      <Navbar expand="lg" data-bs-theme="dark" className="py-0">
        {/* bg-dark sul Container (non sul Navbar): lo sfondo scuro copre solo l'area centrata, non tutto lo schermo */}
        {/* px-5: stesso spazio laterale del contenuto, per tenere brand/link allineati alle card */}
        <Container className="bg-dark py-2 px-5">
          <Navbar.Brand href="#">EpiBooks</Navbar.Brand>
          {/* Toggle: menu a tendina su schermi piccoli */}
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Shop</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
              <Nav.Link href="#">Browse</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
