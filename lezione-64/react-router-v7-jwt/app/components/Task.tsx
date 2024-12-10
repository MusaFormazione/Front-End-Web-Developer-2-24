import { Form, useFetcher } from "react-router";
import { type Task as TaskType } from "~/types/Task.type";

export default function Task({
  task,
  isLogged,
}: {
  task: TaskType;
  isLogged: boolean;
}) {
  const fetcher = useFetcher();

  return (
    <div
      key={task._id}
      className="bg-slate-200 my-4 p-4 flex gap-8 items-center"
    >
      {task.name}
      {/* se l'utente è loggato, vuol dire che ha un token valido, quindi possiamo mostrare il pulsante per cancellare un task */}
      {isLogged && (
        // il componente Form di fetcher ci permette di inviare una richiesta e di gestire lo stato di caricamento https://reactrouter.com/how-to/fetchers
        <fetcher.Form method="post">
          {/* nell'input hidden passiamo l'id del task che vogliamo cancellare: quando l'utente clicca sul pulsante "Delete", il form viene inviato e il task viene cancellato; la proprietà hidden ci permette di passare dati al server senza che l'utente li veda           */}
          <input type="hidden" name="id" value={task._id} />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            // disabilitiamo il pulsante se lo stato di fetcher non è "idle" (cioè se è in corso una richiesta)
            disabled={fetcher.state !== "idle"}
          >
            {/* cambiamo il testo in base allo stato di fetcher: se stiamo inviando dei dati mostriamo il testo "submitting" */}
            {fetcher.state !== "idle" ? "Submitting..." : "Delete"}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
