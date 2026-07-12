
export interface NormalizedError {
  message: string;
  stack:   string;   // guaranteed — never undefined
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack:   error.stack ?? `Error: ${error.message}`,  // fallback if V8 omits it
    };
  }
  const message = String(error);
  return {
    message,
    stack: `NonError thrown: ${message}`,
  };
}