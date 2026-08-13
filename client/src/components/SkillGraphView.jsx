import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const buildNodes = (graphNodes, rootSkillId) => {
  const groupedByDepth = {};

  graphNodes.forEach((node) => {
    if (!groupedByDepth[node.depth]) {
      groupedByDepth[node.depth] = [];
    }

    groupedByDepth[node.depth].push(node);
  });

  const nodes = [];

  Object.entries(groupedByDepth).forEach(([depth, depthNodes]) => {
    const numericDepth = Number(depth);

    const totalWidth = (depthNodes.length - 1) * 240;

    depthNodes.forEach((node, index) => {
      const x = index * 240 - totalWidth / 2;

      const y = numericDepth * 170;

      const isRoot = node.id === rootSkillId;

      nodes.push({
        id: node.id,

        position: {
          x,
          y,
        },

        data: {
          label: node.name,
        },

        style: {
          width: 190,
          padding: 14,

          border: isRoot ? "2px solid #1677ff" : "1px solid #d9d9d9",

          borderRadius: 10,

          background: isRoot ? "#e6f4ff" : "#ffffff",

          fontWeight: isRoot ? 600 : 500,

          textAlign: "center",

          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      });
    });
  });

  return nodes;
};

const buildEdges = (graphEdges) => {
  return graphEdges.map((edge, index) => ({
    id: `edge-${index}`,

    source: edge.source,
    target: edge.target,

    type: "smoothstep",

    label: "requires",

    markerEnd: {
      type: "arrowclosed",
    },
  }));
};

function SkillGraphView({ graph }) {
  const nodes = buildNodes(graph.nodes, graph.rootSkillId);

  const edges = buildEdges(graph.edges);

  return (
    <div className="skill-graph-canvas">
      <ReactFlow nodes={nodes} edges={edges} fitView nodesConnectable={false}>
        <Background />

        <Controls />

        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default SkillGraphView;
