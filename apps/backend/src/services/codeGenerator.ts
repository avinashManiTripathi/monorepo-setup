// Code generation service for creating React components from layouts

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
}

// Generate component name from layout name
const generateComponentName = (layoutName: string): string => {
  return layoutName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
};

// Generate grid item styles
const generateGridItemStyle = (item: LayoutItem): string => {
  return `{
    gridColumn: "${item.x + 1} / span ${item.w}",
    gridRow: "${item.y + 1} / span ${item.h}",
  }`;
};

// Generate React component code
export const generateComponentCode = (layout: Layout): string => {
  const componentName = generateComponentName(layout.name);

  const imports = new Set<string>();
  layout.items.forEach((item) => {
    imports.add(item.component);
  });

  const importStatements = Array.from(imports)
    .map((comp) => `import { ${comp} } from "@/components/layout-components/LayoutComponents";`)
    .join("\n");

  const gridItems = layout.items
    .map(
      (item) => `
        <div
          key="${item.i}"
          style=${generateGridItemStyle(item)}
        >
          <${item.component} id="${item.i}" />
        </div>`
    )
    .join("");

  return `"use client";

${importStatements}

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "30px",
          gap: "8px",
          minHeight: "600px",
        }}
      >
        ${gridItems}
      </div>
    </div>
  );
}
`;
};

// Generate test file
export const generateTestCode = (layout: Layout): string => {
  const componentName = generateComponentName(layout.name);

  return `import { render, screen } from "@testing-library/react";
import ${componentName} from "./${componentName}";

describe("${componentName}", () => {
  it("should render without crashing", () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeInTheDocument();
  });

  it("should render with grid layout", () => {
    const { container } = render(<${componentName} />);
    const gridContainer = container.querySelector('[style*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  it("should render all layout components", () => {
    const { container } = render(<${componentName} />);
    ${layout.items
      .map(
        (item) => `
    // Check for ${item.component} component (id: ${item.i})
    const ${item.i.replace(/-/g, "_")} = container.querySelector('[id="${item.i}"]');
    expect(${item.i.replace(/-/g, "_")}).toBeInTheDocument();`
      )
      .join("")}
  });

  it("should have correct number of grid items", () => {
    const { container } = render(<${componentName} />);
    const gridItems = container.querySelectorAll('[style*="gridColumn"]');
    expect(gridItems).toHaveLength(${layout.items.length});
  });
});
`;
};

// Generate file structure information
export interface GeneratedFiles {
  component: {
    filename: string;
    content: string;
  };
  test: {
    filename: string;
    content: string;
  };
  metadata: {
    componentName: string;
    layoutId: string;
    layoutName: string;
    appId: string;
    itemCount: number;
    generatedAt: string;
  };
}

export const generateFiles = (layout: Layout): GeneratedFiles => {
  const componentName = generateComponentName(layout.name);

  return {
    component: {
      filename: `${componentName}.tsx`,
      content: generateComponentCode(layout),
    },
    test: {
      filename: `${componentName}.test.tsx`,
      content: generateTestCode(layout),
    },
    metadata: {
      componentName,
      layoutId: layout.id,
      layoutName: layout.name,
      appId: layout.appId,
      itemCount: layout.items.length,
      generatedAt: new Date().toISOString(),
    },
  };
};

