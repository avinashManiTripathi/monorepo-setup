"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { Layout, App, layoutAPI, appAPI } from "@/lib/api";

export default function AppLayoutsPage() {
  const params = useParams();
  const appId = params?.appId as string;
  
  const [app, setApp] = useState<App | null>(null);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (appId) {
      loadAppAndLayouts();
    }
  }, [appId]);

  const loadAppAndLayouts = async () => {
    try {
      setLoading(true);
      const [appData, layoutsData] = await Promise.all([
        appAPI.getById(appId),
        layoutAPI.getAll(appId),
      ]);
      setApp(appData);
      setLayouts(layoutsData);
      setError("");
    } catch (err) {
      setError("Failed to load app or layouts.");
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

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      pink: "from-pink-500 to-pink-600",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "App not found"}</p>
          <Link
            href="/apps"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/apps"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Apps
          </Link>
          
          <div className={`bg-gradient-to-r ${getColorClasses(app.color)} rounded-lg p-6 text-white shadow-lg mb-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{app.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold">{app.name}</h1>
                  <p className="text-white/90 mt-1">{app.description}</p>
                </div>
              </div>
              <Link
                href={`/apps/${appId}/layouts/new`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition shadow-md font-semibold"
              >
                <Plus size={20} />
                New Layout
              </Link>
            </div>
          </div>
        </div>

        {/* Layouts Grid */}
        {layouts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📐</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No layouts yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first layout for {app.name}
            </p>
            <Link
              href={`/apps/${appId}/layouts/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Create Layout
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
                <div className={`bg-gradient-to-br ${getColorClasses(app.color)} p-6 h-48 flex items-center justify-center opacity-20`}>
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
                      href={`/apps/${appId}/layouts/${layout.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <Link
                      href={`/apps/${appId}/layouts/${layout.id}/preview`}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                    >
                      <Eye size={16} />
                    </Link>
                    {!layout.id.endsWith("-default") && (
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
      </div>
    </div>
  );
}

