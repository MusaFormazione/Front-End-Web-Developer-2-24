import { redirect } from "react-router";

export async function clientAction() {
  console.log("Logging out");
  localStorage.removeItem("userToken");
  return redirect("/login");
}
