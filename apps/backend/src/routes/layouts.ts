import { Router, Request, Response } from "express";

const router = Router();

// In-memory storage (in production, use a database)
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: string;
  props?: Record<string, any>;
}

interface Layout {
  id: string;
  name: string;
  appId: string;
  items: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
const layouts: Map<string, Layout> = new Map();

// Seed with one default layout
const defaultLayout: Layout = {
  id: "default-layout",
  name: "Welcome Layout",
  appId: "my-first-app",
  items: [
    { i: "header", x: 0, y: 0, w: 12, h: 2, component: "Header" },
    { i: "sidebar", x: 0, y: 2, w: 3, h: 8, component: "Sidebar" },
    { i: "content", x: 3, y: 2, w: 9, h: 8, component: "Content" },
    { i: "footer", x: 0, y: 10, w: 12, h: 2, component: "Footer" },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

layouts.set(defaultLayout.id, defaultLayout);

// GET all layouts (optionally filtered by appId)
router.get("/", (req: Request, res: Response) => {
  const { appId } = req.query;
  let allLayouts = Array.from(layouts.values());
  
  // Filter by appId if provided
  if (appId && typeof appId === "string") {
    allLayouts = allLayouts.filter((layout) => layout.appId === appId);
  }
  
  res.json({ layouts: allLayouts });
});

// GET a specific layout by ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const layout = layouts.get(id);

  if (!layout) {
    return res.status(404).json({ error: "Layout not found" });
  }

  res.json({ layout });
});

// POST create a new layout
router.post("/", (req: Request, res: Response) => {
  const { name, appId, items } = req.body;

  if (!name || !items || !appId) {
    return res.status(400).json({ error: "Name, appId, and items are required" });
  }

  const newLayout: Layout = {
    id: `layout-${Date.now()}`,
    name,
    appId,
    items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  layouts.set(newLayout.id, newLayout);

  res.status(201).json({
    message: "Layout created successfully",
    layout: newLayout,
  });
});

// PUT update an existing layout
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, appId, items } = req.body;

  const existingLayout = layouts.get(id);

  if (!existingLayout) {
    return res.status(404).json({ error: "Layout not found" });
  }

  const updatedLayout: Layout = {
    ...existingLayout,
    name: name || existingLayout.name,
    appId: appId || existingLayout.appId,
    items: items || existingLayout.items,
    updatedAt: new Date().toISOString(),
  };

  layouts.set(id, updatedLayout);

  res.json({
    message: "Layout updated successfully",
    layout: updatedLayout,
  });
});

// DELETE a layout
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent deletion of default layout
  if (id === "default-layout") {
    return res.status(400).json({ error: "Cannot delete the default layout" });
  }

  const deleted = layouts.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: "Layout not found" });
  }

  res.json({ message: "Layout deleted successfully" });
});

export default router;

