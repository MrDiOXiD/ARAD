import Loading from "@/components/Loading";
import Table from "@/components/products/Table";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProductsPage({ searchParams }) {
// 1. Await the promise to get the actual plain object
   const resolvedParams = await searchParams;

   // 2. Now you can safely pass it to URLSearchParams
   const params = new URLSearchParams(resolvedParams);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h4 className="fw-bold">محصولات</h4>
        <Link href="/products/create" className="btn btn-sm btn-outline-dark">
          ایجاد محصول
        </Link>
      </div>

      <Suspense key={params.toString()} fallback={<Loading />}>
        <Table params={params.toString()} />
      </Suspense>
    </>
  );
}
