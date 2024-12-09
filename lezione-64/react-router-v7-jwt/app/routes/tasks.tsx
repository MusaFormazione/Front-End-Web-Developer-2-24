import axios from "axios";
import type { Route } from "./+types/tasks";
import { Suspense } from "react";
import { Await, useFetcher } from "react-router";
import Task from "~/components/Task";
import { type Task as TaskType } from "~/types/Task.type";
import { getUserToken } from "~/utilities/authorization";
import React from "react";

export async function clientLoader() {
  let response = axios.get("http://localhost:4000/api/tasks");
  let token = getUserToken();
  return { tasks: response, token };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const { tasks, token } = loaderData;
  let isLogged = token ? true : false;

  return (
    <div className="mt-8 max-w-screen-lg mx-auto">
      <h1>Tasks</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Await resolve={tasks}>
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

export async function clientAction({ request }: Route.ClientActionArgs) {
  const data = await request.formData();
  let taskId = data.get("id");
  const userToken = getUserToken();

  // const actionType = data.get("actionType");
  // if (actionType === "delete") {
  try {
    await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting task");
  }
  // }
  // if (actionType === "toggle") {
  //   try {
  //     await axios.patch(
  //       `http://localhost:4000/api/tasks/toggle/${taskId}`,
  //       null,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       }
  //     );
  //     // return redirect("/tasks");
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Error adding task");
  //   }
  // }
}
