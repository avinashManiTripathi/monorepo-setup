"use client";

import { useState, useCallback } from "react";
import GridLayout, { Layout as GridLayoutType } from "react-grid-layout";
import { Save, Download, Plus, Trash2, Eye, Code, FileCode } from "lucide-react";
import { COMPONENT_REGISTRY, AVAILABLE_COMPONENTS } from "./layout-components/LayoutComponents";
import { LayoutItem, layoutAPI, codegenAPI, GeneratedCode } from "@/lib/api";
import "react-grid-layout/css/styles.css";

interface LayoutBuilderProps {
  appId: string;
  initialLayout?: LayoutItem[];
  layoutId?: string;
  layoutName?: string;
}

export default function LayoutBuilder({
  appId,
  initialLayout = [],
  layoutId,
  layoutName: initialName = "My Layout",
}: LayoutBuilderProps) {
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);
  const [layoutName, setLayoutName] = useState(initialName);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  // Convert LayoutItem to GridLayout format
  const gridLayout: GridLayoutType[] = layout.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  }));

  const handleLayoutChange = useCallback((newGridLayout: GridLayoutType[]) => {
    if (isPreviewMode) return; // Don't update layout in preview mode

    setLayout((prevLayout) =>
      prevLayout.map((item) => {
        const gridItem = newGridLayout.find((g) => g.i === item.i);
        if (gridItem) {
          return {
            ...item,
            x: gridItem.x,
            y: gridItem.y,
            w: gridItem.w,
            h: gridItem.h,
          };
        }
        return item;
      })
    );
  }, [isPreviewMode]);

  const addComponent = (componentType: string) => {
    const newId = `${componentType.toLowerCase()}-${Date.now()}`;
    const newItem: LayoutItem = {
      i: newId,
      x: 0,
      y: Infinity, // Places at the bottom
      w: 4,
      h: 3,
      component: componentType,
    };
    setLayout([...layout, newItem]);
    setMessage(`Added ${componentType} component`);
    setTimeout(() => setMessage(""), 2000);
  };

  const removeComponent = (id: string) => {
    setLayout(layout.filter((item) => item.i !== id));
    setMessage("Component removed");
    setTimeout(() => setMessage(""), 2000);
  };

  const saveLayout = async () => {
    try {
      if (layoutId) {
        await layoutAPI.update(layoutId, layoutName, appId, layout);
        setMessage("Layout updated successfully! ✅");
      } else {
        const newLayout = await layoutAPI.create(layoutName, appId, layout);
        setMessage(`Layout "${newLayout.name}" created! ✅`);
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save layout ❌");
      console.error(error);
    }
  };

  const exportLayout = () => {
    const dataStr = JSON.stringify({ name: layoutName, items: layout }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `layout-${layoutName.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Layout exported! 📥");
    setTimeout(() => setMessage(""), 2000);
  };

  const clearLayout = () => {
    if (confirm("Are you sure you want to clear the entire layout?")) {
      setLayout([]);
      setMessage("Layout cleared");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const generateCode = async () => {
    if (layout.length === 0) {
      setMessage("Add some components first! ⚠️");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      setGenerating(true);
      setMessage("Generating code... ⚙️");
      
      const layoutData = {
        id: layoutId || `temp-${Date.now()}`,
        name: layoutName,
        appId: appId,
        items: layout,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const generated = await codegenAPI.generate(layoutData);
      setGeneratedCode(generated);
      setShowGeneratedCode(true);
      setMessage("Code generated successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to generate code ❌");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadGeneratedFiles = () => {
    if (!generatedCode) return;

    // Download component file
    const componentBlob = new Blob([generatedCode.component.content], { type: "text/plain" });
    const componentUrl = URL.createObjectURL(componentBlob);
    const componentLink = document.createElement("a");
    componentLink.href = componentUrl;
    componentLink.download = generatedCode.component.filename;
    componentLink.click();
    URL.revokeObjectURL(componentUrl);

    // Download test file
    setTimeout(() => {
      const testBlob = new Blob([generatedCode.test.content], { type: "text/plain" });
      const testUrl = URL.createObjectURL(testBlob);
      const testLink = document.createElement("a");
      testLink.href = testUrl;
      testLink.download = generatedCode.test.filename;
      testLink.click();
      URL.revokeObjectURL(testUrl);
    }, 100);

    setMessage("Files downloaded! 📥");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Layout Builder</h1>
          <input
            type="text"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Layout name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              isPreviewMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Eye size={18} />
            {isPreviewMode ? "Edit Mode" : "Preview"}
          </button>

          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            <Code size={18} />
            JSON
          </button>

          <button
            onClick={generateCode}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileCode size={18} />
            {generating ? "Generating..." : "Generate Code"}
          </button>

          <button
            onClick={exportLayout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <Download size={18} />
            Export
          </button>

          <button
            onClick={saveLayout}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            <Save size={18} />
            Save
          </button>

          <button
            onClick={clearLayout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className="bg-blue-500 text-white px-6 py-2 text-center text-sm">
          {message}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Component Palette */}
        {!isPreviewMode && (
          <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto border-r">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Components
            </h2>
            <div className="space-y-2">
              {AVAILABLE_COMPONENTS.map((comp) => (
                <button
                  key={comp.type}
                  onClick={() => addComponent(comp.type)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition group"
                >
                  <span className="text-2xl">{comp.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {comp.type}
                    </p>
                  </div>
                  <Plus size={16} className="text-gray-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Layout Info
              </h3>
              <p className="text-xs text-gray-500">
                Components: {layout.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag & drop to arrange
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Resize handles on corners
              </p>
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {showGeneratedCode && generatedCode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Generated Code</h2>
                  <p className="text-gray-600">Component: {generatedCode.metadata.componentName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadGeneratedFiles}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Download Files
                  </button>
                  <button
                    onClick={() => setShowGeneratedCode(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>

              {/* Component File */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
                  <span className="font-semibold">{generatedCode.component.filename}</span>
                  <span className="text-sm opacity-75">React Component</span>
                </div>
                <div className="bg-gray-900 text-green-400 p-6 overflow-auto max-h-96">
                  <pre className="text-sm font-mono">{generatedCode.component.content}</pre>
                </div>
              </div>

              {/* Test File */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-purple-600 text-white px-4 py-2 flex items-center justify-between">
                  <span className="font-semibold">{generatedCode.test.filename}</span>
                  <span className="text-sm opacity-75">Test File</span>
                </div>
                <div className="bg-gray-900 text-green-400 p-6 overflow-auto max-h-96">
                  <pre className="text-sm font-mono">{generatedCode.test.content}</pre>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Generation Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Layout ID:</span>
                    <span className="ml-2 font-mono text-gray-900">{generatedCode.metadata.layoutId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">App ID:</span>
                    <span className="ml-2 font-mono text-gray-900">{generatedCode.metadata.appId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Components:</span>
                    <span className="ml-2 font-mono text-gray-900">{generatedCode.metadata.itemCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Generated:</span>
                    <span className="ml-2 font-mono text-gray-900">
                      {new Date(generatedCode.metadata.generatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : showJson ? (
            <div className="bg-gray-900 text-green-400 rounded-lg p-6 h-full overflow-auto">
              <pre className="text-sm font-mono">
                {JSON.stringify({ name: layoutName, items: layout }, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-full">
              {layout.length === 0 ? (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📐</div>
                    <p className="text-lg">No components yet</p>
                    <p className="text-sm mt-2">
                      Add components from the sidebar to get started
                    </p>
                  </div>
                </div>
              ) : (
                <GridLayout
                  className="layout"
                  layout={gridLayout}
                  onLayoutChange={handleLayoutChange}
                  cols={12}
                  rowHeight={30}
                  width={1200}
                  isDraggable={!isPreviewMode}
                  isResizable={!isPreviewMode}
                  compactType="vertical"
                  preventCollision={false}
                >
                  {layout.map((item) => {
                    const Component = COMPONENT_REGISTRY[item.component];
                    return (
                      <div
                        key={item.i}
                        className="relative group"
                        style={{
                          background: isPreviewMode ? "transparent" : "#f9fafb",
                          border: isPreviewMode ? "none" : "2px dashed #d1d5db",
                          borderRadius: "8px",
                        }}
                      >
                        {!isPreviewMode && (
                          <button
                            onClick={() => removeComponent(item.i)}
                            className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div className="h-full w-full p-2">
                          {Component ? (
                            <Component id={item.i} />
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                              Unknown component: {item.component}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </GridLayout>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

