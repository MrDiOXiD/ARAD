import CreateProduct from "@/components/products/Create";
import { getFetch } from "@/utils/fetch";

export default async function CreateProductPage() {
  let categories = [];
 try {
    // 1. Attempt to fetch categories from your NestJS backend
    const data = await getFetch("/categories");
    
    // 2. Double-check that the returned data is actually an array
    if (Array.isArray(data)) {
      categories = data;
    }
  } catch (error) {
    // 3. If the backend fails (500, 401, etc.), log the error but don't crash!
    // console.error("Failed to load categories for the product form:", error.message);
    categories = []; // Fallback to an empty array so .map() doesn't fail
  }
  

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h4 className="fw-bold">ایجاد محصول</h4>
      </div>

      <CreateProduct categories={categories} />
    </>
  );
}
