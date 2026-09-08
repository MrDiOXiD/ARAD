"use client";

import { deleteProduct } from "@/actions/products";
import SubmitButton from "../SubmitButton";
import { useActionState } from "react";

export default function DeleteProduct({ id }) {
  const [state, formAction] = useActionState(deleteProduct, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton title="حذف" style="btn btn-dark mt-3" />
    </form>
  );
}
