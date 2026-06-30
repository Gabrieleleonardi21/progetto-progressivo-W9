import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS di Bootstrap: necessario perché le classi (bg-dark, mt-auto, ecc.) funzionino
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
