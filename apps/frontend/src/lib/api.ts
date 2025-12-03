// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: string;
  props?: Record<string, any>;
}

export interface Layout {
  id: string;
  name: string;
  appId: string;
  items: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const layoutAPI = {
  // Get all layouts (optionally filtered by appId)
  getAll: async (appId?: string): Promise<Layout[]> => {
    const url = appId 
      ? `${API_BASE_URL}/api/layouts?appId=${appId}`
      : `${API_BASE_URL}/api/layouts`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch layouts");
    const data = await response.json();
    return data.layouts;
  },

  // Get a specific layout
  getById: async (id: string): Promise<Layout> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch layout");
    const data = await response.json();
    return data.layout;
  },

  // Create a new layout
  create: async (name: string, appId: string, items: LayoutItem[]): Promise<Layout> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, appId, items }),
    });
    if (!response.ok) throw new Error("Failed to create layout");
    const data = await response.json();
    return data.layout;
  },

  // Update an existing layout
  update: async (id: string, name: string, appId: string, items: LayoutItem[]): Promise<Layout> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, appId, items }),
    });
    if (!response.ok) throw new Error("Failed to update layout");
    const data = await response.json();
    return data.layout;
  },

  // Delete a layout
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete layout");
  },
};

export const appAPI = {
  // Get all apps
  getAll: async (): Promise<App[]> => {
    const response = await fetch(`${API_BASE_URL}/api/apps`);
    if (!response.ok) throw new Error("Failed to fetch apps");
    const data = await response.json();
    return data.apps;
  },

  // Get a specific app
  getById: async (id: string): Promise<App> => {
    const response = await fetch(`${API_BASE_URL}/api/apps/${id}`);
    if (!response.ok) throw new Error("Failed to fetch app");
    const data = await response.json();
    return data.app;
  },

  // Create a new app
  create: async (name: string, description: string, icon: string, color: string): Promise<App> => {
    const response = await fetch(`${API_BASE_URL}/api/apps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon, color }),
    });
    if (!response.ok) throw new Error("Failed to create app");
    const data = await response.json();
    return data.app;
  },

  // Update an existing app
  update: async (id: string, name: string, description: string, icon: string, color: string): Promise<App> => {
    const response = await fetch(`${API_BASE_URL}/api/apps/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon, color }),
    });
    if (!response.ok) throw new Error("Failed to update app");
    const data = await response.json();
    return data.app;
  },

  // Delete an app
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/apps/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete app");
  },
};

export interface GeneratedFile {
  filename: string;
  content: string;
}

export interface GeneratedCode {
  component: GeneratedFile;
  test: GeneratedFile;
  metadata: {
    componentName: string;
    layoutId: string;
    layoutName: string;
    appId: string;
    itemCount: number;
    generatedAt: string;
  };
}

export const codegenAPI = {
  // Generate code from layout
  generate: async (layout: Layout): Promise<GeneratedCode> => {
    const response = await fetch(`${API_BASE_URL}/api/codegen/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layout),
    });
    if (!response.ok) throw new Error("Failed to generate code");
    const data = await response.json();
    return data.files;
  },
};

