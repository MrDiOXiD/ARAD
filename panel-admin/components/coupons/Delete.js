"use client"

import { deleteCoupon } from "@/actions/coupons";
import SubmitButton from "../SubmitButton";
import { useFormState } from 'react-dom';

export default function DeleteCoupon({ id }) {
    const [state, formAction] = useFormState(deleteCoupon, {});

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton title="حذف" style="btn btn-dark mt-3" />
        </form>
    )
}