"use server";

import { cookies } from "next/headers";
import { handleError } from "@/utils/helper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteFetch } from "@/utils/fetch";

// async function createProduct(state, formData) {
//   const primary_image = formData.get("primary_image");
//   const name = formData.get("name");
//   const category_id = formData.get("category_id");
//   const price = formData.get("price");
//   const quantity = formData.get("quantity");

//   // if (primary_image.size == 0) {
//   //   return {
//   //     status: "error",
//   //     message: "تصویر اصلی الزامی است",
//   //   };
//   // }

//   // if (name === "") {
//   //   return {
//   //     status: "error",
//   //     message: "نام الزامی است",
//   //   };
//   // }

//   // if (category_id === null) {
//   //   return {
//   //     status: "error",
//   //     message: "دسته بندی الزامی است",
//   //   };
//   // }

//   // if (price === "") {
//   //   return {
//   //     status: "error",
//   //     message: "قیمت الزامی است",
//   //   };
//   // }

//   // if (quantity === "") {
//   //   return {
//   //     status: "error",
//   //     message: "تعداد الزامی است",
//   //   };
//   // }
// console.log(formData);

//   const token = cookies().get("token");
//   const res = await fetch(`${process.env.API_URL}/products`, {
//     cache: "no-store",
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${token.value}`,
//     },
//     body: formData,
//   });

//   const data = await res.json();
// console.log(data);

//   if (data.status === "success") {
//     revalidatePath("/products");

//     return {
//       status: data.status,
//       message: "محصول مورد نظر ایجاد شد",
//     };
//   } else {
//     return {
//       status: data.status,
//       message: handleError(data.message),
//     };
//   }
// }


async function createProduct(state, formData) {
  console.log("RECEIVED FROM FORM:", formData.get("brand"), formData.get("badge"));
  // 1. Create a fresh payload for the NestJS API
  const apiFormData = new FormData();

  // 2. Map HTML names -> NestJS DTO keys
  apiFormData.append("title", formData.get("name"));
  apiFormData.append("description", formData.get("description") || "");
  apiFormData.append("productImage", formData.get("primary_image"));


  // The hidden input sends this as a stringified JSON object!
  // 🌟 Check if you added these lines in actions/products.js!
  const brand = formData.get("brand");
  if (brand && brand.trim() !== "") {
    apiFormData.append("brand", brand);
  }

  const badge = formData.get("badge");
  if (badge && badge.trim() !== "") {
    apiFormData.append("badge", badge);
  }

  const attributes = formData.get("attributes");
  if (attributes && attributes !== "{}" && attributes.trim() !== "") {
    apiFormData.append("attributes", attributes);
  }

  // 3. Handle Numbers safely (skip empty strings to avoid validation bugs)
  const price = formData.get("price");
  if (price && price.trim() !== "") {
    apiFormData.append("price", price);
  }

  const quantity = formData.get("quantity"); // HTML "quantity" -> NestJS "stock"
  if (quantity && quantity.trim() !== "") {
    apiFormData.append("stock", quantity);
  }

  const categoryId = formData.get("category_id"); // HTML "category_id" -> NestJS "categoryId"
  if (categoryId && categoryId.trim() !== "") {
    apiFormData.append("categoryId", categoryId);
  }

  // 4. Map Status selection ("1" or "0") to NestJS Boolean String ("true" or "false")
  const status = formData.get("status");
  apiFormData.append("isActive", status === "1" ? "true" : "false");

  // 5. Calculate Discount Percentage dynamically from sale_price
  const originalPrice = parseFloat(price) || 0;
  const salePrice = parseFloat(formData.get("sale_price")) || 0;
  
  let discountPercentage = 0;
  if (salePrice > 0 && salePrice < originalPrice) {
    discountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
  }
  apiFormData.append("discount", discountPercentage.toFixed(2));

  // 6. Format Persian-converted Gregorian dates to ISO timestamps for PostgreSQL
  const dateFrom = formData.get("date_on_sale_from");
  const dateTo = formData.get("date_on_sale_to");

  if (dateFrom && dateFrom.trim() !== "") {
    apiFormData.append("discountStartDate", new Date(dateFrom.replace(" ", "T")).toISOString());
  }
  if (dateTo && dateTo.trim() !== "") {
    apiFormData.append("discountEndDate", new Date(dateTo.replace(" ", "T")).toISOString());
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return {
        status: "error",
        message: "نشست شما منقضی شده است، لطفا دوباره وارد شوید",
      };
    }

    // 7. Send the cleanly mapped payload to the backend
    const res = await fetch(`${process.env.API_URL}/products`, {
      cache: "no-store",
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: apiFormData, // 🌟 Sends the translated form data
    });

    const data = await res.json();

    if (res.ok) {
      revalidatePath("/products");
      return {
        status: "success",
        message: "محصول مورد نظر با موفقیت ایجاد شد",
      };
    } else {
      // Combines array validation strings into a scannable message
      const parsedError = Array.isArray(data.message) 
        ? data.message.join(" | ") 
        : data.message;

      return {
        status: "error",
        message: parsedError || "خطایی در ایجاد محصول رخ داد",
      };
    }
  } catch (error) {
    console.error("Server Action Network Error:", error);
    return {
      status: "error",
      message: "ارتباط با سرور برقرار نشد، لطفا دوباره تلاش کنید",
    };
  }
}
async function deleteProduct(state, formData) {
  const id = formData.get("id");

  if (id === "" || id === null) {
    return {
      status: "error",
      message: "شناسه محصول الزامی است",
    };
  }

  const data = await deleteFetch(`/products/${id}`);

  if (data.status === "success") {
    revalidatePath("/products");
    redirect("/products");
  } else {
    return {
      status: data.status,
      message: handleError(data.message),
    };
  }
}

async function editProduct(state, formData) {
  const id = formData.get("id");
  const primary_image = formData.get("primary_image");
  const images = formData.get("images[]");
  const name = formData.get("name");
  const category_id = formData.get("category_id");
  const price = formData.get("price");
  const quantity = formData.get("quantity");

  if (primary_image.size == 0) {
    formData.delete("primary_image");
  }

  if (images.size == 0) {
    formData.delete("images[]");
  }

  if (id === "" || id === null) {
    return {
      status: "error",
      message: "شناسه محصول الزامی است",
    };
  }

  if (name === "") {
    return {
      status: "error",
      message: "نام الزامی است",
    };
  }

  if (category_id === null) {
    return {
      status: "error",
      message: "دسته بندی الزامی است",
    };
  }

  if (price === "") {
    return {
      status: "error",
      message: "قیمت الزامی است",
    };
  }

  if (quantity === "") {
    return {
      status: "error",
      message: "تعداد الزامی است",
    };
  }

  const token = cookies().get("token");
  const res = await fetch(`${process.env.API_URL}/products/${id}`, {
    cache: "no-store",
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (data.status === "success") {
    revalidatePath("/products");

    return {
      status: data.status,
      message: "محصول مورد نظر ویرایش شد",
    };
  } else {
    return {
      status: data.status,
      message: handleError(data.message),
    };
  }
}

export { createProduct, deleteProduct, editProduct };
