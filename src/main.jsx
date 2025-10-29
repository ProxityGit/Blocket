//documento: main.jsx
//descripción: Punto de entrada principal de la aplicación Bloket.

import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<AppRouter />);
