"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from 'react-dom';
import { toast } from "react-toastify";
import SubmitButton from "../SubmitButton";
import { editCategory } from "@/actions/categories";

export default function EditCategory({ category }) {
    const [state, formAction] = useFormState(editCategory, {});
    const router = useRouter();

    useEffect(() => {
        toast(state?.message, { type: `${state?.status}` });
        if (state?.status === 'success') {
            router.push("/categories")
        }
    }, [state])

    return (
        <form action={formAction} className="row gy-4">

            <div className="col-md-3">
                <label className="form-label">نام</label>
                <input name='name' defaultValue={category.name} type="text" className="form-control" />
            </div>

            <div className="col-md-3">
                <label className="form-label">توضیحات</label>
                <input name='description' defaultValue={category.description} type="text" className="form-control" />
            </div>

            <input type="hidden" name="id" defaultValue={category.id} />

            <div>
                <SubmitButton title="ویرایش دسته بندی" style="btn btn-outline-dark mt-3" />
            </div>
        </form>
    )
}