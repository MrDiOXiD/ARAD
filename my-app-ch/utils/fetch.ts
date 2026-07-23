// utils/api.ts

// Fallback for Next.js client vs server environments
const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "" ||
  "http://localhost:3020";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Use Omit to remove the native 'body' requirement
interface FetchOptions extends Omit<RequestInit, "body"> {
  method?: HttpMethod;
  body?: Record<string, unknown> | FormData | string | unknown[];
  headers?: Record<string, string>;
  isFormData?: boolean;
}

/**
 * 🛡️ Security & Stability Upgrades (TypeScript Edition):
 * 1. Generics (<T>): Automatically infers response types in your UI.
 * 2. Strict Error Typing: Uses `unknown` in catch blocks to satisfy TS strict mode.
 * 3. FormData Support: Safely handles your ArvanCloud/NestJS image uploads.
 */
const secureFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    isFormData = false,
    cache = "no-store",
    ...rest
  } = options;

  const config: RequestInit = {
    method,
    cache,
    headers: {
      Accept: "application/json",
      ...headers,
    } as HeadersInit,
    // ⏱️ SECURITY: Timeout after 10 seconds to prevent hanging sockets
    signal: AbortSignal.timeout(10000),
    ...rest,
  };

  // 🖼️ FIX: Let the browser set the Content-Type boundary for FormData automatically
  if (!isFormData) {
    (config.headers as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    // 🛡️ SECURITY: Only parse JSON if the server actually sent JSON
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    // Define an expected fallback structure for server errors
    const data: any = isJson ? await res.json() : null;

    // 🚨 STRICT STATUS CHECK
    if (!res.ok) {
      if (res.status === 401) {
        // Trigger global logout/redirect event here
        console.error("🔒 Unauthorized access detected.");
      }

      const errorMessage: string =
        data?.message || `خطای ارتباط با سرور (${res.status})`;
      throw new Error(errorMessage);
    }

    // Return standardized data (Handle cases where backend wraps response in { data: ... })
    return (data?.data !== undefined ? data.data : data) as T;
  } catch (error: unknown) {
    // TypeScript requires 'unknown' type checking before accessing properties
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        throw new Error(
          "زمان درخواست به پایان رسید. لطفا اتصال اینترنت خود را بررسی کنید.",
        );
      }
      throw error; // Re-throw the parsed server error
    }

    // Fallback for non-Error throws
    throw new Error("یک خطای ناشناخته رخ داده است");
  }
};

// ---------------------------------------------------------
// EXPORTED WRAPPERS WITH GENERICS
// ---------------------------------------------------------

export const getFetch = <T>(
  url: string,
  headers?: Record<string, string>,
): Promise<T> => secureFetch<T>(url, { method: "GET", headers });

export const postFetch = <T>(
  url: string,
  body: Record<string, unknown> | FormData | any[],
  headers?: Record<string, string>,
  isFormData = false,
): Promise<T> =>
  secureFetch<T>(url, { method: "POST", body, headers, isFormData });

export const putFetch = <T>(
  url: string,
  body: Record<string, unknown> | FormData | any[],
  headers?: Record<string, string>,
  isFormData = false,
): Promise<T> =>
  secureFetch<T>(url, { method: "PUT", body, headers, isFormData });

export const deleteFetch = <T>(
  url: string,
  headers?: Record<string, string>,
): Promise<T> => secureFetch<T>(url, { method: "DELETE", headers });
