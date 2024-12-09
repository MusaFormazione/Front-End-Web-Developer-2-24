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
      {isLogged && (
        <fetcher.Form method="post">
          <input type="hidden" name="id" value={task._id} />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state !== "idle" ? "Submitting..." : "Delete"}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
