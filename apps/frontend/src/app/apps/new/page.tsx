"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { appAPI } from "@/lib/api";

const AVAILABLE_ICONS = ["📱", "🛒", "📊", "📝", "💼", "🎨", "🚀", "⚡", "🎯", "🔥"];
const AVAILABLE_COLORS = [
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
];

export default function NewAppPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📱");
  const [color, setColor] = useState("blue");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("App name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const result = await appAPI.create(name, description, icon, color);
      setCreatedAppId(result.id);
      setSuccess(true);
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/apps");
      }, 3000);
    } catch (err) {
      setError("Failed to create app. The app might already exist.");
      console.error(err);
      setSaving(false);
    }
  };

  // Success Modal
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              App Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your new Next.js app has been scaffolded in the apps folder
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">📁 Created Files:</h3>
            <code className="text-sm text-blue-800 block mb-4">
              apps/{createdAppId}/
            </code>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>✓ package.json</li>
              <li>✓ tsconfig.json</li>
              <li>✓ next.config.mjs</li>
              <li>✓ src/app/layout.tsx</li>
              <li>✓ src/app/page.tsx</li>
              <li>✓ src/app/globals.css</li>
              <li>✓ README.md</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">🚀 Next Steps:</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                $ cd apps/{createdAppId}
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                $ pnpm install
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                $ pnpm dev
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Redirecting to apps page in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/apps"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Apps
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New App</h1>
          <p className="text-gray-600 mb-8">
            Define your application and start building layouts for it
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* App Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                App Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., My Dashboard"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe what this app is for..."
                rows={3}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {AVAILABLE_ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`text-3xl p-3 rounded-lg border-2 transition hover:scale-110 ${
                      icon === i
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="grid grid-cols-6 gap-3">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                      color === c.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${c.class}`}></div>
                    <span className="text-xs font-medium text-gray-700">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Save size={20} />
                {saving ? "Creating..." : "Create App"}
              </button>
              <Link
                href="/apps"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

