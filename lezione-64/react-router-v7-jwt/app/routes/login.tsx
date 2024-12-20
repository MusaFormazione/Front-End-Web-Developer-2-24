import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/home";
import axios from "axios";

export default function Login() {
  const navigation = useNavigation();
  // useActionData ci permette di ottenere i dati dell'azione, ad esempio l'errore
  const serverResponseData = useActionData();
  // se lo stato di navigazione non è "idle", vuol dire che c'è una richiesta in corso
  const isSubmitting = navigation.state !== "idle";

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <label>
          Email:
          <input
            type="email"
            name="email"
            className="border-2 p-2 border-gray-300 border-solid"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            className="border-2 p-2 border-gray-300 border-solid"
          />
        </label>
        {/* in caso di errore, qui viene mostrato l'avviso */}
        {serverResponseData && serverResponseData.error && (
          <h3 className="text-red-500 p-8">{serverResponseData.error}</h3>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-300 px-4 py-2"
        >
          {isSubmitting ? "Login in corso..." : "Login"}
        </button>
      </Form>
    </div>
  );
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  let userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // console.log(userData);
  try {
    const response = await axios.post(
      "http://localhost:4000/api/login",
      userData
    );
    localStorage.setItem("userToken", response.data.token);
    // Siccome il token ha validità di un'ora,
    // posso impostare la durata aggiungendo 60 minuti all'orario in cui viene effettuato questo login
    // In pratica: prendo la data attuale, la converto in millisecondi, aggiungo un'ora.
    let hourInMillis = 1000 * 60 * 60;
    let tokenExpirationMillis = new Date().getTime() + hourInMillis;
    // Salvo il timestamp di scadenza del token in localStorage, così posso controllare se il token è scaduto
    localStorage.setItem("expirationMillis", tokenExpirationMillis.toString());

    return redirect("/tasks");
  } catch (error) {
    // se la richiesta fallisce, mostriamo l'errore all'utente
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // se la richiesta fallisce, mostriamo l'errore all'utente
      return error.response.data;
    }
    console.error(error);
    throw new Error("Login failed!!!");
  }
}
