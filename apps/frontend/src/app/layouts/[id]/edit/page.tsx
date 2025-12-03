"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LayoutBuilder from "@/components/LayoutBuilder";
import { Layout, layoutAPI } from "@/lib/api";

export default function EditLayoutPage() {
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
          <p className="text-gray-600 mt-4">Loading layout...</p>
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
          <a
            href="/layouts"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Layouts
          </a>
        </div>
      </div>
    );
  }

  return (
    <LayoutBuilder
      initialLayout={layout.items}
      layoutId={layout.id}
      layoutName={layout.name}
    />
  );
}

