import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "../+types/root";
import axios from "axios";

export default function Signup() {
  const navigation = useNavigation();
  const serverResponseData = useActionData();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div>
      <h1>Signup</h1>
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
        {serverResponseData && serverResponseData.error && (
          <h3 className="text-red-500 p-8">{serverResponseData.error}</h3>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-300 px-4 py-2"
        >
          {isSubmitting ? "Login in corso..." : "Signup"}
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
      "http://localhost:4000/api/signup",
      userData
    );
    localStorage.setItem("userToken", response.data.token);
    // Siccome il token ha validità di un'ora,
    // posso impostare la durata aggiungendo 60 minuti all'orario in cui viene effettuato questo login
    // In pratica: prendo la data attuale, la converto in millisecondi, aggiungo un'ora.
    let hourInMillis = 1000 * 60 * 60;
    let tokenExpirationMillis = new Date().getTime() + hourInMillis;
    localStorage.setItem("expirationMillis", tokenExpirationMillis.toString());

    return redirect("/tasks");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return error.response.data;
    }
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return error.response.data;
    }
    console.error(error);
    throw new Error("Signup failed!!!");
  }
}
