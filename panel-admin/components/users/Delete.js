"use client";

import { deleteUser } from "@/actions/users";
import SubmitButton from "../SubmitButton";
import { useActionState } from "react";

export default function DeleteUser({ id }) {
  const [state, formAction] = useActionState(deleteUser, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton title="حذف" style="btn btn-dark mt-3" />
    </form>
  );
}
