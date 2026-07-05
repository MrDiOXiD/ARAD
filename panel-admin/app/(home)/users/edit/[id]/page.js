import EditUser from "@/components/users/Edit";
import { getFetch } from "@/utils/fetch";

export default async function EditUserPage({ params }) {
    const user = await getFetch(`/users/${params.id}`);

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h4 className="fw-bold">ویرایش کاربر: {user.name}</h4>
            </div>

            <EditUser user={user} />
        </>
    )
}