// Reusable layout components that users can add to their layouts

interface ComponentProps {
  id: string;
}

export const Header = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 flex items-center justify-between text-white shadow-lg">
      <h1 className="text-2xl font-bold">Header Component</h1>
      <span className="text-sm opacity-75">{id}</span>
    </div>
  );
};

export const Sidebar = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <ul className="space-y-2">
        <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">Dashboard</li>
        <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">Profile</li>
        <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">Settings</li>
        <li className="hover:bg-gray-600 p-2 rounded cursor-pointer">Logout</li>
      </ul>
      <span className="text-xs opacity-50 mt-4 block">{id}</span>
    </div>
  );
};

export const Content = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Area</h2>
      <p className="text-gray-600 mb-4">
        This is the main content area. You can add any content here.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Card 1</h3>
          <p className="text-sm text-blue-600">Sample content</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Card 2</h3>
          <p className="text-sm text-green-600">Sample content</p>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-4 block">{id}</span>
    </div>
  );
};

export const Footer = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 flex items-center justify-between text-white shadow-lg">
      <p className="text-sm">© 2025 Your Company. All rights reserved.</p>
      <span className="text-xs opacity-50">{id}</span>
    </div>
  );
};

export const Card = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white shadow-lg">
      <h3 className="text-lg font-bold mb-2">Card Component</h3>
      <p className="text-sm opacity-90">
        A customizable card that can display any content.
      </p>
      <span className="text-xs opacity-50 mt-2 block">{id}</span>
    </div>
  );
};

export const Chart = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-white rounded-lg p-4 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Chart Component</h3>
      <div className="flex items-end justify-around h-32 border-l border-b border-gray-300">
        <div className="w-12 bg-blue-500 rounded-t" style={{ height: "60%" }}></div>
        <div className="w-12 bg-green-500 rounded-t" style={{ height: "80%" }}></div>
        <div className="w-12 bg-yellow-500 rounded-t" style={{ height: "40%" }}></div>
        <div className="w-12 bg-red-500 rounded-t" style={{ height: "90%" }}></div>
      </div>
      <span className="text-xs text-gray-400 mt-2 block">{id}</span>
    </div>
  );
};

export const Image = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-pink-400 to-orange-400 rounded-lg p-4 flex items-center justify-center text-white shadow-lg">
      <div className="text-center">
        <div className="text-6xl mb-2">🖼️</div>
        <p className="text-sm">Image Component</p>
        <span className="text-xs opacity-50 mt-1 block">{id}</span>
      </div>
    </div>
  );
};

export const Text = ({ id }: ComponentProps) => {
  return (
    <div className="h-full w-full bg-white rounded-lg p-4 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Text Component</h3>
      <p className="text-gray-600 text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <span className="text-xs text-gray-400 mt-2 block">{id}</span>
    </div>
  );
};

// Component registry
export const COMPONENT_REGISTRY: Record<string, React.ComponentType<ComponentProps>> = {
  Header,
  Sidebar,
  Content,
  Footer,
  Card,
  Chart,
  Image,
  Text,
};

// Available components for the toolbar
export const AVAILABLE_COMPONENTS = [
  { type: "Header", icon: "📌", color: "bg-blue-500" },
  { type: "Sidebar", icon: "📋", color: "bg-gray-700" },
  { type: "Content", icon: "📄", color: "bg-white" },
  { type: "Footer", icon: "🔽", color: "bg-gray-800" },
  { type: "Card", icon: "🎴", color: "bg-purple-500" },
  { type: "Chart", icon: "📊", color: "bg-blue-400" },
  { type: "Image", icon: "🖼️", color: "bg-pink-400" },
  { type: "Text", icon: "📝", color: "bg-white" },
];

