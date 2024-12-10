import axios from "axios";
import type { Route } from "./+types/tasks";
import { Suspense } from "react";
import { Await, useFetcher } from "react-router";
import Task from "~/components/Task";
import { type Task as TaskType } from "~/types/Task.type";
import { getUserToken } from "~/utilities/authorization";
import React from "react";

// con questo loader possiamo ottenere i dati necessari per renderizzare il componente
export async function clientLoader() {
  // non abbiamo messo await davanti a axios.get perché non ci serve aspettare che la richiesta venga completata: in questo modo possiamo iniziare il rendering della pagina e poi aggiornare i dati quando la richiesta è completata
  let response = axios.get("http://localhost:4000/api/tasks");
  // otteniamo il token dell'utente
  let token = getUserToken();
  // passiamo i dati al componente in un oggetto con le chiavi tasks e token
  return { tasks: response, token };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  // loaderData contiene i dati che abbiamo definito nel loader
  const { tasks, token } = loaderData;
  // se c'è un token, l'utente è loggato
  let isLogged = token ? true : false;
  return (
    <div className="mt-8 max-w-screen-lg mx-auto">
      <h1>Tasks</h1>
      {/* react.suspense è un componente che ci permette di mostrare un fallback mentre aspettiamo che i dati vengano caricati */}
      <React.Suspense fallback={<div>Loading...</div>}>
        {/*Await è un componente che ci permette di gestire lo stato di caricamento dei dati: quando i dati sono pronti, possiamo renderizzare il componente all'interno di Await */}
        <Await resolve={tasks}>
          {/*la risposta della promise (res) è passata come argomento alla funzione figlia di Await: quando i dati sono pronti, possiamo accedervi tramite res.data e renderizzare il componente Task con i dati ottenuti */}
          {(res) => (
            <>
              {res.data.tasks.map((task: TaskType) => (
                <Task key={task._id} task={task} isLogged={isLogged} />
              ))}
            </>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}

// l'azione viene eseguita quando l'utente invia il form
// il form è presente nel componente Task e viene inviato quando l'utente clicca sul pulsante "Delete"
export async function clientAction({ request }: Route.ClientActionArgs) {
  // otteniamo i dati del form
  const data = await request.formData();
  // otteniamo l'id del task dal form leggendo l'input con name="id"
  let taskId = data.get("id");
  // otteniamo il token dell'utente
  const userToken = getUserToken();
  // effettuiamo una richiesta DELETE al server per cancellare il task
  try {
    await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
      // aggiungiamo il token dell'utente all'header della richiesta
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting task");
  }
}
