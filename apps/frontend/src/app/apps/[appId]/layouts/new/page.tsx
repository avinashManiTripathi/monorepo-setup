"use client";

import { useParams } from "next/navigation";
import LayoutBuilder from "@/components/LayoutBuilder";

export default function NewLayoutForAppPage() {
  const params = useParams();
  const appId = params?.appId as string;

  return <LayoutBuilder appId={appId} />;
}

