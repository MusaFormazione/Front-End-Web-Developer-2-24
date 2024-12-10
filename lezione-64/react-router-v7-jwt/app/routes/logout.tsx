import { redirect } from "react-router";

// l'azione viene eseguita quando l'utente effettua il logout
export async function clientAction() {
  console.log("Logging out");
  localStorage.removeItem("userToken");
  return redirect("/login");
}

// non serve renderizzare una pagina vera e propria per il logout: l'azione viene eseguita e poi reindirizziamo l'utente verso la pagina di login
