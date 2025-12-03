import { Router, Request, Response } from "express";
import { generateFiles, GeneratedFiles } from "../services/codeGenerator";

const router = Router();

interface Layout {
  id: string;
  name: string;
  appId: string;
  items: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    component: string;
    props?: Record<string, any>;
  }>;
}

// POST generate code from layout
router.post("/generate", (req: Request, res: Response) => {
  try {
    const layout: Layout = req.body;

    if (!layout || !layout.name || !layout.items || !layout.appId) {
      return res.status(400).json({ 
        error: "Invalid layout data. Required: name, appId, items" 
      });
    }

    const generatedFiles: GeneratedFiles = generateFiles(layout);

    res.json({
      message: "Code generated successfully",
      files: generatedFiles,
    });
  } catch (error) {
    console.error("Code generation error:", error);
    res.status(500).json({
      error: "Failed to generate code",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST generate code for specific layout ID (if you have layout storage)
router.post("/generate/:layoutId", (req: Request, res: Response) => {
  const { layoutId } = req.params;
  const layout: Layout = req.body;

  if (!layout) {
    return res.status(400).json({ error: "Layout data required" });
  }

  try {
    const generatedFiles: GeneratedFiles = generateFiles(layout);

    res.json({
      message: `Code generated for layout: ${layoutId}`,
      files: generatedFiles,
    });
  } catch (error) {
    console.error("Code generation error:", error);
    res.status(500).json({
      error: "Failed to generate code",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

