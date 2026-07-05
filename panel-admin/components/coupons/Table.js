import { getFetch } from "@/utils/fetch"
import Link from "next/link";
import Paginate from "../Paginate";

export default async function Table({ params }) {
    const data = await getFetch(`/coupons?${params}`);

    return (
        <>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>کد</th>
                            <th>درصد</th>
                            <th>تاریخ انقضا</th>
                            <th>تاریخ ایجاد</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.percentage}</td>
                                <td>{coupon.expired_at}</td>
                                <td>{coupon.created_at}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link href={`/coupons/${coupon.id}`} className="btn btn-sm btn-outline-dark me-2"> نمایش </Link>
                                        <Link href={`/coupons/edit/${coupon.id}`} className="btn btn-sm btn-dark"> ویرایش </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Paginate links={data.meta.links} />
        </>
    )
}