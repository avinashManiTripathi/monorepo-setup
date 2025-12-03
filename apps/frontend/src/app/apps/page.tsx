"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Layout } from "lucide-react";
import { App, appAPI, layoutAPI } from "@/lib/api";

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [layoutCounts, setLayoutCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await appAPI.getAll();
      setApps(data);
      
      // Load layout counts for each app
      const counts: Record<string, number> = {};
      for (const app of data) {
        const layouts = await layoutAPI.getAll(app.id);
        counts[app.id] = layouts.length;
      }
      setLayoutCounts(counts);
      
      setError("");
    } catch (err) {
      setError("Failed to load apps. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app? This will also delete all its layouts.")) return;

    try {
      await appAPI.delete(id);
      setApps(apps.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete app. You cannot delete default apps.");
      console.error(err);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
      green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
      red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
      yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
      pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Apps</h1>
            <p className="text-gray-600 mt-2">
              Manage your applications and their layouts
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Home
            </Link>
            <Link
              href="/apps/new"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <Plus size={20} />
              New App
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading apps...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadApps}
              className="text-red-600 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Apps Grid */}
        {!loading && !error && (
          <>
            {apps.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">📱</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No apps yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first app
                </p>
                <Link
                  href="/apps/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Create Your First App
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => {
                  const colorClasses = getColorClasses(app.color);
                  return (
                    <div
                      key={app.id}
                      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 ${colorClasses.border}`}
                    >
                      {/* Header */}
                      <div className={`${colorClasses.bg} p-6 border-b ${colorClasses.border}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-5xl">{app.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {app.name}
                              </h3>
                              <p className={`text-sm ${colorClasses.text} font-medium mt-1`}>
                                {layoutCounts[app.id] || 0} layouts
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {app.description || "No description"}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/apps/${app.id}/layouts`}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium"
                          >
                            <Layout size={16} />
                            Layouts
                          </Link>
                          <Link
                            href={`/apps/${app.id}/edit`}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                          >
                            <Edit size={16} />
                          </Link>
                          {app.id !== "my-first-app" && (
                            <button
                              onClick={() => deleteApp(app.id)}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

