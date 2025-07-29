"use client";

import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export function StateFlowCube() {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  // Generate nodes based on active operation
  const getNodes = (active: string | null): Node[] => [
    {
      id: "state",
      position: { x: 320, y: 0 },
      data: { label: "State Store" },
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "2px solid #5a67d8",
        borderRadius: "8px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    {
      id: "create",
      position: { x: 20, y: 100 },
      data: { label: "CREATE" },
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        color: "white",
        border: active === "create" ? "3px solid #667eea" : "2px solid #e91e63",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "500",
        boxShadow:
          active === "create" ? "0 0 30px rgba(102, 126, 234, 0.8)" : "none",
      },
    },
    {
      id: "read",
      position: { x: 120, y: 160 },
      data: { label: "READ" },
      style: {
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        color: "white",
        border: active === "read" ? "3px solid #667eea" : "2px solid #2196f3",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "500",
        boxShadow:
          active === "read" ? "0 0 30px rgba(102, 126, 234, 0.8)" : "none",
      },
    },
    {
      id: "update",
      position: { x: 220, y: 220 },
      data: { label: "UPDATE" },
      style: {
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        color: "white",
        border: active === "update" ? "3px solid #667eea" : "2px solid #ff9800",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "500",
        boxShadow:
          active === "update" ? "0 0 30px rgba(102, 126, 234, 0.8)" : "none",
      },
    },
    {
      id: "delete",
      position: { x: 320, y: 280 },
      data: { label: "DELETE" },
      style: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        color: "white",
        border: active === "delete" ? "3px solid #667eea" : "2px solid #f44336",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: "500",
        boxShadow:
          active === "delete" ? "0 0 30px rgba(102, 126, 234, 0.8)" : "none",
      },
    },
  ];

  // Generate edges based on active operation
  const getEdges = (active: string | null): Edge[] => [
    {
      id: "e-state-create",
      source: "state",
      target: "create",
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: "arrowclosed",
        color: "#667eea",
      },
      style: {
        stroke: "#667eea",
        strokeWidth: active === "create" ? 4 : 2,
        strokeDasharray: "5 5",
      },
    },
    {
      id: "e-state-read",
      source: "state",
      target: "read",
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: "arrowclosed",
        color: "#667eea",
      },
      style: {
        stroke: "#667eea",
        strokeWidth: active === "read" ? 4 : 2,
        strokeDasharray: "5 5",
      },
    },
    {
      id: "e-state-update",
      source: "state",
      target: "update",
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: "arrowclosed",
        color: "#667eea",
      },
      style: {
        stroke: "#667eea",
        strokeWidth: active === "update" ? 4 : 2,
        strokeDasharray: "5 5",
      },
    },
    {
      id: "e-state-delete",
      source: "state",
      target: "delete",
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: "arrowclosed",
        color: "#667eea",
      },
      style: {
        stroke: "#667eea",
        strokeWidth: active === "delete" ? 4 : 2,
        strokeDasharray: "5 5",
      },
    },
  ];

  // Simulate state operations
  useEffect(() => {
    const operations = ["create", "read", "update", "delete"];
    let index = 0;

    const interval = setInterval(() => {
      setActiveOperation(operations[index]);
      setRenderKey((prev) => prev + 1); // Force re-render
      index = (index + 1) % operations.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[350px] w-full rounded-xl overflow-hidden border border-border bg-background/50 backdrop-blur-sm">
      <ReactFlow
        key={renderKey} // Force complete re-render
        nodes={getNodes(activeOperation)}
        edges={getEdges(activeOperation)}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        preventScrolling={false}
        minZoom={0.8}
        maxZoom={1}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          className="!bg-transparent opacity-30 dark:opacity-20"
          color="currentColor"
        />
        <Panel
          position="top-left"
          className="!bg-background/80 !backdrop-blur-sm rounded-lg p-3 m-4 shadow-lg border border-border"
        >
          <div className="text-sm font-medium">
            Active Operation:{" "}
            <span className="text-primary font-bold">
              {activeOperation?.toUpperCase() || "IDLE"}
            </span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
