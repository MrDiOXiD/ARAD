import DeleteCategory from "@/components/categories/Delete";
import { getFetch } from "@/utils/fetch"

export default async function CategoryPage({ params }) {
    const category = await getFetch(`/categories/${params.id}`);

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h4 className="fw-bold">دسته بندی : {category.name}</h4>
            </div>

            <div className="row gy-4">
                <div className="col-md-3">
                    <label className="form-label">نام</label>
                    <input type="text" className="form-control" disabled placeholder={category.name} />
                </div>
                <div className="col-md-3">
                    <label className="form-label">توضیحات</label>
                    <input type="text" className="form-control" disabled placeholder={category.description} />
                </div>
            </div>

            <DeleteCategory id={category.id} />
        </>
    )
}