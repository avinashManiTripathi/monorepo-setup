import { Router, Request, Response } from "express";
import { createNewApp, ScaffoldResult } from "../services/appScaffolder";

const router = Router();

// App interface
export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
const apps: Map<string, App> = new Map();

// Seed with one default app
const defaultApp: App = {
  id: "my-first-app",
  name: "My First App",
  description: "Your first application - start building layouts here",
  icon: "🚀",
  color: "blue",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Initialize with default app
apps.set(defaultApp.id, defaultApp);

// GET all apps
router.get("/", (req: Request, res: Response) => {
  const allApps = Array.from(apps.values());
  res.json({ apps: allApps });
});

// GET a specific app by ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const app = apps.get(id);

  if (!app) {
    return res.status(404).json({ error: "App not found" });
  }

  res.json({ app });
});

// POST create a new app
router.post("/", async (req: Request, res: Response) => {
  const { name, description, icon, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Generate app ID from name (lowercase, replace spaces with hyphens)
  const appId = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check if app already exists
  if (apps.has(appId)) {
    return res.status(400).json({ 
      error: "An app with this name already exists. Please choose a different name." 
    });
  }

  const newApp: App = {
    id: appId,
    name,
    description: description || "",
    icon: icon || "📱",
    color: color || "blue",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // Scaffold the actual app files
    const scaffoldResult: ScaffoldResult = await createNewApp(
      appId,
      name,
      description || ""
    );

    if (!scaffoldResult.success) {
      return res.status(500).json({
        error: "Failed to create app files",
        message: scaffoldResult.message,
      });
    }

    // Add to in-memory storage
    apps.set(newApp.id, newApp);

    res.status(201).json({
      message: "App created successfully",
      app: newApp,
      scaffold: {
        path: scaffoldResult.appPath,
        nextSteps: scaffoldResult.nextSteps,
      },
    });
  } catch (error) {
    console.error("Error creating app:", error);
    res.status(500).json({
      error: "Failed to create app",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT update an existing app
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, icon, color } = req.body;

  const existingApp = apps.get(id);

  if (!existingApp) {
    return res.status(404).json({ error: "App not found" });
  }

  const updatedApp: App = {
    ...existingApp,
    name: name || existingApp.name,
    description: description !== undefined ? description : existingApp.description,
    icon: icon || existingApp.icon,
    color: color || existingApp.color,
    updatedAt: new Date().toISOString(),
  };

  apps.set(id, updatedApp);

  res.json({
    message: "App updated successfully",
    app: updatedApp,
  });
});

// DELETE an app
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent deletion of default app
  if (id === "my-first-app") {
    return res.status(400).json({ error: "Cannot delete the default app" });
  }

  const deleted = apps.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: "App not found" });
  }

  res.json({ message: "App deleted successfully" });
});

export default router;

