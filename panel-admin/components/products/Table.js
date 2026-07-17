import { getFetch } from "@/utils/fetch";
import Link from "next/link";
import Paginate from "../Paginate";
import Image from "next/image";
import { getBlurDataURL, numberFormat } from "@/utils/helper";

export default async function Table({ params }) {
  const data = await getFetch(`/products?${params}`);
  console.log(data);

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>نام</th>
              <th>دسته بندی</th>
              <th>قیمت</th>
              <th>تعداد</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={product.productImage}
                    alt={product.title}
                    width={50}
                    height={50}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" // 1x1 grey pixel
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.categoryId}</td>
                <td>{numberFormat(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.isActive}</td>
                <td>
                  <div className="d-flex">
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-sm btn-outline-dark me-2"
                    >
                      {" "}
                      نمایش{" "}
                    </Link>
                    <Link href={`/products/edit/${product.id}`} className="btn btn-sm btn-dark">
                      {" "}
                      ویرایش{" "}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <Paginate links={data?.meta.links} /> */}
    </>
  );
}
