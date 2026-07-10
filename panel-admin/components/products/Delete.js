"use client";

import { deleteProduct } from "@/actions/products";
import SubmitButton from "../SubmitButton";
import { useFormState } from "react-dom";

export default function DeleteProduct({ id }) {
  const [state, formAction] = useFormState(deleteProduct, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton title="حذف" style="btn btn-dark mt-3" />
    </form>
  );
}
