const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Cookie"] = `token=${token}`;
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Auth
export const api = {
  auth: {
    register: (body: { username: string; email: string; password: string }) =>
      request<{ message: string; user: any; token: string }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<{ message: string; user: any; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request<{ user: any }>("/api/auth/me"),
  },
  stores: {
    create: (body: any) =>
      request<{ message: string; store: any; storeUrl: string }>("/api/stores", { method: "POST", body: JSON.stringify(body) }),
    getAll: () => request<{ count: number; stores: any[] }>("/api/stores"),
    getOne: (id: string) => request<{ store: any }>(`/api/stores/${id}`),
    update: (id: string, body: any) =>
      request<{ message: string; store: any }>(`/api/stores/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ message: string }>(`/api/stores/${id}`, { method: "DELETE" }),
  },
  products: {
    create: (body: any) =>
      request<{ message: string; product: any }>("/api/products", { method: "POST", body: JSON.stringify(body) }),
    getByStore: (storeId: string) =>
      request<{ count: number; products: any[] }>(`/api/products/${storeId}`),
    getOne: (productId: string) =>
      request<{ product: any }>(`/api/products/single/${productId}`),
    update: (productId: string, body: any) =>
      request<{ product: any }>(`/api/products/${productId}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (productId: string) =>
      request<{ message: string }>(`/api/products/${productId}`, { method: "DELETE" }),
    toggleVisibility: (productId: string) =>
      request<{ message: string; isVisible: boolean }>(`/api/products/${productId}/toggle-visibility`, { method: "PATCH" }),
    toggleStock: (productId: string) =>
      request<{ message: string; inStock: boolean }>(`/api/products/${productId}/toggle-stock`, { method: "PATCH" }),
  },
  catalog: {
    get: (slug: string) =>
      request<{ store: any; products: any[]; totalProducts: number }>(`/api/catalog/${slug}`),
    getProduct: (slug: string, productId: string) =>
      request<{ store: any; product: any }>(`/api/catalog/${slug}/${productId}`),
    order: (slug: string, body: any) =>
      request<{ message: string; whatsappUrl: string; orderSummary: any }>(`/api/catalog/${slug}/order`, { method: "POST", body: JSON.stringify(body) }),
  },
  upload: {
    single: (file: File, folder: string) => {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("folder", folder);
      return request<{ message: string; url: string; fileId: string }>("/api/upload/single", { method: "POST", body: fd });
    },
    multiple: (files: File[], folder: string) => {
      const fd = new FormData();
      files.forEach(f => fd.append("images", f));
      fd.append("folder", folder);
      return request<{ images: any[]; count: number }>("/api/upload/multiple", { method: "POST", body: fd });
    },
    delete: (fileId: string) =>
      request<{ message: string }>(`/api/upload/${fileId}`, { method: "DELETE" }),
  },
};
