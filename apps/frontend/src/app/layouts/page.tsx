"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Layout, layoutAPI } from "@/lib/api";

export default function LayoutsPage() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      setLoading(true);
      const data = await layoutAPI.getAll();
      setLayouts(data);
      setError("");
    } catch (err) {
      setError("Failed to load layouts. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLayout = async (id: string) => {
    if (!confirm("Are you sure you want to delete this layout?")) return;

    try {
      await layoutAPI.delete(id);
      setLayouts(layouts.filter((l) => l.id !== id));
    } catch (err) {
      alert("Failed to delete layout");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Layouts</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your custom layouts
            </p>
          </div>
          <Link
            href="/layouts/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus size={20} />
            New Layout
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading layouts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadLayouts}
              className="text-red-600 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Layouts Grid */}
        {!loading && !error && (
          <>
            {layouts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">📐</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No layouts yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first layout
                </p>
                <Link
                  href="/layouts/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Create Your First Layout
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
                  >
                    {/* Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm text-gray-600">
                          {layout.items.length} components
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {layout.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Updated {new Date(layout.updatedAt).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/layouts/${layout.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <Link
                          href={`/layouts/${layout.id}/preview`}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                        >
                          <Eye size={16} />
                        </Link>
                        {layout.id !== "default" && (
                          <button
                            onClick={() => deleteLayout(layout.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

