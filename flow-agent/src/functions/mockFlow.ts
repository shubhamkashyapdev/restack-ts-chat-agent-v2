import { FunctionFailure } from "@restackio/ai/function";
import { ReactFlowJsonObject } from "reactflow";
import { milestone, endFlow } from "../workflows";

export const mockFlow = async (): Promise<ReactFlowJsonObject> => {
  try {
    return {
      nodes: [
        {
          id: "budget-assessment",
          type: "workflow",
          data: {
            eventType: "budget-assessment",
            workflowType: milestone.name,
            flowPrompt:
              "Ask about the client's budget range for this project and analyze if it matches our service tier. Determine if the budget is: high (>$50k), medium ($20k-$50k), or low (<$20k)",
            flowOutputConditions: [
              "high-budget",
              "medium-budget",
              "low-budget",
            ],
            status: "initial",
          },
          position: { x: 0, y: 0 },
        },
        {
          id: "high-budget",
          type: "workflow",
          data: {
            eventType: "high-budget",
            workflowType: milestone.name,
            flowPrompt:
              "For high budget clients (>$50k), discuss our enterprise-level services and comprehensive solutions. Ask about their specific requirements and timeline.",
            flowOutputConditions: [endFlow.name],
            status: "initial",
          },
          position: { x: -200, y: 200 },
        },
        {
          id: "medium-budget",
          type: "workflow",
          data: {
            eventType: "medium-budget",
            workflowType: milestone.name,
            flowPrompt:
              "For medium budget clients ($20k-$50k), present our professional service tier and discuss scalable solutions. Understand their core needs and priorities.",
            flowOutputConditions: [endFlow.name],
            status: "initial",
          },
          position: { x: 0, y: 200 },
        },
        {
          id: "low-budget",
          type: "workflow",
          data: {
            eventType: "low-budget",
            workflowType: milestone.name,
            flowPrompt:
              "For low budget clients (<$20k), explain our starter packages and basic service offerings. Focus on essential features and potential upgrade paths.",
            flowOutputConditions: [endFlow.name],
            status: "initial",
          },
          position: { x: 200, y: 200 },
        },
        {
          id: endFlow.name,
          type: "default",
          data: {
            eventType: endFlow.name,
            workflowType: endFlow.name,
          },
          position: { x: 0, y: 400 },
        },
      ],
      edges: [
        {
          id: "edge-initial-high",
          source: "budget-assessment",
          target: "high-budget",
          sourceHandle: "high-budget",
        },
        {
          id: "edge-initial-medium",
          source: "budget-assessment",
          target: "medium-budget",
          sourceHandle: "medium-budget",
        },
        {
          id: "edge-initial-low",
          source: "budget-assessment",
          target: "low-budget",
          sourceHandle: "low-budget",
        },
        {
          id: "edge-high-end",
          source: "high-budget",
          target: endFlow.name,
        },
        {
          id: "edge-medium-end",
          source: "medium-budget",
          target: endFlow.name,
        },
        {
          id: "edge-low-end",
          source: "low-budget",
          target: endFlow.name,
        },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
  } catch (error) {
    throw FunctionFailure.nonRetryable(`Error mockFlow: ${error}`);
  }
};
