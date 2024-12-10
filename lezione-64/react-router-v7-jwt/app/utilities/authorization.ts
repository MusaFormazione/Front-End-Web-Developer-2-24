import { redirect } from "react-router";

// funzione che controlla se il token dell'utente è valido (non scaduto)
export function getUserTokenValidity() {
  // recupero la data di scadenza del token da localStorage
  const userTokenEpirationDate: number =
    Number(localStorage.getItem("expirationMillis")) || 0;
  // recupero la data attuale
  let now = new Date().getTime();
  // controllo che la data attuale non sia superiore a quella di validità del token
  const userTokenValidity = userTokenEpirationDate - now;
  // ritorno il tempo rimanente di validità del token
  return userTokenValidity;
}

// funzione che recupera il token da localStorage, oppure ritorna null
export function getUserToken() {
  // recupero il token dell'utente da localStorage
  let userToken = localStorage.getItem("userToken");
  // se non esiste il token, ritorno null
  if (!userToken) {
    return null;
  }

  // Recupero le informazioni sulla scadenza del token
  let userTokenValidity = getUserTokenValidity();
  // Se ho superato la scadenza, ritorno un avviso. Mi servirà per effettuare un logout automatico
  if (userTokenValidity < 0) {
    return "tokenExpired";
  }
  // se il token è valido, lo ritorno
  return userToken;
}
