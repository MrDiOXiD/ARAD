"use client"

import { deleteUser } from "@/actions/users";
import SubmitButton from "../SubmitButton";
import { useFormState } from 'react-dom';

export default function DeleteUser({ id }) {
    const [state, formAction] = useFormState(deleteUser, {});

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton title="حذف" style="btn btn-dark mt-3" />
        </form>
    )
}