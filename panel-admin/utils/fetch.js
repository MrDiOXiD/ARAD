import { cookies } from "next/headers";
import { json } from "node:stream/consumers";


const getFetch = async (url) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Authorization token is required for this request.");
  }

  const res = await fetch(`${process.env.API_URL}${url}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Secure fetch failed: ${res.status}`);
  }

  return await res.json();
};



const postFetch = async (url, body) => {
  const token = cookies().get("token");
  const res = await fetch(`${process.env.API_URL}${url}`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};

const postFetchUnauth = async (url, body) => {
  const res = await fetch(`${process.env.API_URL}${url}`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log(body);


  return await res.json();
};

const deleteFetch = async (url) => {
  const token = cookies().get("token");
  const res = await fetch(`${process.env.API_URL}${url}`, {
    cache: "no-store",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    },
  });

  return await res.json();
};

const putFetch = async (url, body) => {
  const token = cookies().get("token");
  const res = await fetch(`${process.env.API_URL}${url}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};

export { getFetch, postFetch, postFetchUnauth, deleteFetch, putFetch };
