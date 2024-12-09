import axios from "axios";
import { Form, redirect, useNavigation } from "react-router";
import { getUserToken } from "~/utilities/authorization";

export async function clientLoader() {
  let token = getUserToken();
  if (!token) {
    return redirect("/login");
  }
  return;
}

export default function AddTask() {
  const navigation = useNavigation();

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
        <button className="bg-green-300 px-4 py-2" disabled={isSubmitting}>
          {isSubmitting ? "Adding task..." : "Add task"}
        </button>
      </Form>
    </div>
  );
}

export async function clientAction({ request }: { request: Request }) {
  const data = await request.formData();
  let taskData = { name: data.get("name") };
  const userToken = getUserToken();

  try {
    await axios.post("http://localhost:4000/api/tasks", taskData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return redirect("/tasks");
  } catch (error) {
    console.error(error);
    throw new Error("Error adding task");
  }
}
