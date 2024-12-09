import { redirect } from "react-router";

export function getUserTokenValidity() {
  const userTokenEpirationDate: number =
    Number(localStorage.getItem("expirationMillis")) || 0;
  let now = new Date().getTime();
  // controllo che la data attuale non sia superiore a quella di validità del token
  const userTokenValidity = userTokenEpirationDate - now;
  return userTokenValidity;
}

// funzione che recupera il token da localStorage, oppure ritorna null
export function getUserToken() {
  let userToken = localStorage.getItem("userToken");

  if (!userToken) {
    return null;
  }

  // Recupero le informazioni sulla scadenza del token
  let userTokenValidity = getUserTokenValidity();
  // Se ho superato la scadenza, ritorno un avviso. Mi servirà per effettuare un logout automatico
  if (userTokenValidity < 0) {
    return "tokenExpired";
  }

  return userToken;
}
