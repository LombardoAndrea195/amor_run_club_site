import { createRoot } from "react-dom/client";
import "@fontsource/anton";
import "@fontsource-variable/familjen-grotesk";
import "lenis/dist/lenis.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
