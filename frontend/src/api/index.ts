const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export type ApiResponse<T> = {
  data: T;
  message: string;
};

export function api() {

  return {
    request: async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
      const fullUrl = `${API_BASE_URL}${url}`;

      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição API');
      }

      return response.json();
    }
  };
}
