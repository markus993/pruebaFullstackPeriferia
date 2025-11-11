import axios from "axios";

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
  details?: unknown;
}

export const getErrorMessage = (error: unknown, fallback = "Ocurrió un error inesperado") => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
