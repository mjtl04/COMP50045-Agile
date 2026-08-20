import NavBar from "~/components/navbar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return < >
    <NavBar></NavBar>
    <h1>home component</h1>
  </>;
}
