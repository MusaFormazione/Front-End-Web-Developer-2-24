import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

// questi sono i metadati della pagina, cioè le informazioni che vengono inserite nell'head del documento
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <h1>Hello</h1>;
}
