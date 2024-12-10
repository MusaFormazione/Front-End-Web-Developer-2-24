import axios from "axios";
import { Form, redirect, useNavigation } from "react-router";
import { getUserToken } from "~/utilities/authorization";

// https://reactrouter.com/start/framework/data-loading
// il loader è una funzione che viene eseguita prima di renderizzare il componente
export async function clientLoader() {
  // otteniamo il token dell'utente
  let token = getUserToken();
  // se l'utente non ha un token, lo reindirizziamo alla pagina di login
  if (!token) {
    return redirect("/login");
  }
  return;
}

export default function AddTask() {
  // useNavigation ci permette di ottenere informazioni sulla navigazione
  const navigation = useNavigation();
  // se lo stato di navigazione non è "idle", vuol dire che c'è una richiesta in corso
  const isSubmitting = navigation.state !== "idle";

  return (
    <div>
      <h1>Add Task</h1>
      <Form method="post">
        <input
          type="text"
          name="name"
          className="p-2 border-2 border-gray-300"
        />
        {/* se c'è una rihchiesta in corso, metto il pulsante in stato disabled e mostro un testo diverso (OTTIMA UX!) */}
        <button className="bg-green-300 px-4 py-2" disabled={isSubmitting}>
          {isSubmitting ? "Adding task..." : "Add task"}
        </button>
      </Form>
    </div>
  );
}

// https://reactrouter.com/start/framework/actions
// l'azione viene eseguita quando l'utente invia il form
export async function clientAction({ request }: { request: Request }) {
  // otteniamo i dati del form
  const data = await request.formData();
  // creiamo un oggetto con i dati del form, in questo caso leggiamo l'input "name"
  let taskData = { name: data.get("name") };
  // otteniamo il token dell'utente
  const userToken = getUserToken();

  try {
    // inviamo una richiesta POST al server per aggiungere un task
    await axios.post("http://localhost:4000/api/tasks", taskData, {
      // aggiungiamo il token dell'utente all'header della richiesta
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    // reindirizziamo l'utente alla pagina dei task
    return redirect("/tasks");
  } catch (error) {
    console.error(error);
    throw new Error("Error adding task");
  }
}
