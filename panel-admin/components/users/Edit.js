"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from 'react-dom';
import { toast } from "react-toastify";
import SubmitButton from "../SubmitButton";
import { editUser } from "@/actions/users";

export default function EditUser({ user }) {
    const [state, formAction] = useFormState(editUser, {});
    const router = useRouter();

    useEffect(() => {
        toast(state?.message, { type: `${state?.status}` });
        if (state?.status === 'success') {
            router.push("/users")
        }
    }, [state])

    return (
        <form action={formAction} className="row gy-4">
            <div className="col-md-3">
                <label className="form-label">نام</label>
                <input name="name" defaultValue={user.name} type="text" className="form-control" />
            </div>
            <div className="col-md-3">
                <label className="form-label">ایمیل</label>
                <input name="email" defaultValue={user.email} type="text" className="form-control" />
            </div>
            <div className="col-md-3">
                <label className="form-label">شماره تماس</label>
                <input name="cellphone" defaultValue={user.cellphone} type="text" className="form-control" />
            </div>
            <div className="col-md-3">
                <label className="form-label">رمز عبور</label>
                <input name="password" type="text" className="form-control" />
            </div>
            <input type="hidden" name="id" defaultValue={user.id} />
            <div>
                <SubmitButton title="ویرایش کاربر" style="btn btn-outline-dark mt-3" />
            </div>
        </form>
    )
}