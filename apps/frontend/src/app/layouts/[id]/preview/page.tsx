"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Layout, layoutAPI } from "@/lib/api";
import { COMPONENT_REGISTRY } from "@/components/layout-components/LayoutComponents";

export default function PreviewLayoutPage() {
  const params = useParams();
  const id = params?.id as string;
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadLayout();
    }
  }, [id]);

  const loadLayout = async () => {
    try {
      setLoading(true);
      const data = await layoutAPI.getById(id);
      setLayout(data);
      setError("");
    } catch (err) {
      setError("Failed to load layout");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Layout not found"}</p>
          <Link
            href="/layouts"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Layouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/layouts"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{layout.name}</h1>
          <span className="text-sm text-gray-500">Preview Mode</span>
        </div>
        <Link
          href={`/layouts/${layout.id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Layout
        </Link>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gridAutoRows: "30px",
              gap: "8px",
              minHeight: "600px",
            }}
          >
            {layout.items.map((item) => {
              const Component = COMPONENT_REGISTRY[item.component];
              return (
                <div
                  key={item.i}
                  style={{
                    gridColumn: `${item.x + 1} / span ${item.w}`,
                    gridRow: `${item.y + 1} / span ${item.h}`,
                  }}
                >
                  {Component ? (
                    <Component id={item.i} />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-200 rounded">
                      Unknown component: {item.component}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

