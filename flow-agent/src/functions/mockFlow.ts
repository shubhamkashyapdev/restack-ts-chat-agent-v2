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
              "Start the conversation professionally. Ask about the client's budget range for this project and analyze if it matches our service tier. Determine if the budget is: high (>$50k), medium ($20k-$50k), or low (<$20k). Be consultative in your approach.",
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
              "For high budget clients (>$50k): 1) Acknowledge their investment level, 2) Briefly mention our enterprise-level services, 3) Ask about their timeline expectations (urgent: <1 month, standard: 1-3 months, flexible: >3 months).",
            flowOutputConditions: [
              "urgent-timeline",
              "standard-timeline",
              "flexible-timeline",
            ],
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
              "For medium budget clients ($20k-$50k): 1) Acknowledge their investment level, 2) Briefly mention our professional service tier, 3) Ask about their timeline expectations (urgent: <1 month, standard: 1-3 months, flexible: >3 months).",
            flowOutputConditions: [
              "urgent-timeline",
              "standard-timeline",
              "flexible-timeline",
            ],
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
              "For low budget clients (<$20k): 1) Acknowledge their investment level, 2) Briefly mention our starter packages, 3) Ask about their timeline expectations (urgent: <1 month, standard: 1-3 months, flexible: >3 months).",
            flowOutputConditions: [
              "urgent-timeline",
              "standard-timeline",
              "flexible-timeline",
            ],
            status: "initial",
          },
          position: { x: 200, y: 200 },
        },
        {
          id: "timeline-assessment",
          type: "workflow",
          data: {
            eventType: "timeline-assessment",
            workflowType: milestone.name,
            flowPrompt:
              "Based on their timeline, ask about their specific project requirements and main objectives. Focus on understanding their core needs. Then classify their primary need (technical-implementation, business-automation, data-analytics, custom-development).",
            flowOutputConditions: [
              "technical-implementation",
              "business-automation",
              "data-analytics",
              "custom-development",
            ],
            status: "processing",
          },
          position: { x: 0, y: 400 },
        },
        {
          id: "requirements-gathering",
          type: "workflow",
          data: {
            eventType: "requirements-gathering",
            workflowType: milestone.name,
            flowPrompt:
              "Based on their primary need, ask about their industry and specific use case. Then determine their industry category (enterprise, small-business, startup, government).",
            flowOutputConditions: [
              "enterprise-client",
              "small-business-client",
              "startup-client",
              "government-client",
            ],
            status: "processing",
          },
          position: { x: 0, y: 600 },
        },
        {
          id: "decision-process",
          type: "workflow",
          data: {
            eventType: "decision-process",
            workflowType: milestone.name,
            flowPrompt:
              "Understand their decision-making process: 1) Ask who else is involved in the decision, 2) What their evaluation criteria are, 3) When they plan to make a decision. Classify their decision timeline (immediate, within-month, extended-evaluation).",
            flowOutputConditions: [
              "immediate-decision",
              "within-month-decision",
              "extended-evaluation",
            ],
            status: "processing",
          },
          position: { x: 0, y: 800 },
        },
        {
          id: "schedule-followup",
          type: "workflow",
          data: {
            eventType: "schedule-followup",
            workflowType: milestone.name,
            flowPrompt:
              "Based on all gathered information, propose next steps: 1) Suggest a follow-up meeting, 2) Mention sending a tailored proposal, 3) Ask about their preferred communication method. Then determine if they want to (schedule-meeting, receive-proposal, continue-discussion).",
            flowOutputConditions: [
              "schedule-meeting",
              "receive-proposal",
              "continue-discussion",
            ],
            status: "processing",
          },
          position: { x: 0, y: 1000 },
        },
        {
          id: endFlow.name,
          type: "default",
          data: {
            eventType: endFlow.name,
            workflowType: endFlow.name,
          },
          position: { x: 0, y: 1200 },
        },
      ],
      edges: [
        // Budget assessment to budget-specific nodes
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
        // High budget timeline edges
        {
          id: "edge-high-urgent",
          source: "high-budget",
          target: "timeline-assessment",
          sourceHandle: "urgent-timeline",
        },
        {
          id: "edge-high-standard",
          source: "high-budget",
          target: "timeline-assessment",
          sourceHandle: "standard-timeline",
        },
        {
          id: "edge-high-flexible",
          source: "high-budget",
          target: "timeline-assessment",
          sourceHandle: "flexible-timeline",
        },
        // Medium budget timeline edges
        {
          id: "edge-medium-urgent",
          source: "medium-budget",
          target: "timeline-assessment",
          sourceHandle: "urgent-timeline",
        },
        {
          id: "edge-medium-standard",
          source: "medium-budget",
          target: "timeline-assessment",
          sourceHandle: "standard-timeline",
        },
        {
          id: "edge-medium-flexible",
          source: "medium-budget",
          target: "timeline-assessment",
          sourceHandle: "flexible-timeline",
        },
        // Low budget timeline edges
        {
          id: "edge-low-urgent",
          source: "low-budget",
          target: "timeline-assessment",
          sourceHandle: "urgent-timeline",
        },
        {
          id: "edge-low-standard",
          source: "low-budget",
          target: "timeline-assessment",
          sourceHandle: "standard-timeline",
        },
        {
          id: "edge-low-flexible",
          source: "low-budget",
          target: "timeline-assessment",
          sourceHandle: "flexible-timeline",
        },
        // Timeline to requirements edges
        {
          id: "edge-timeline-technical",
          source: "timeline-assessment",
          target: "requirements-gathering",
          sourceHandle: "technical-implementation",
        },
        {
          id: "edge-timeline-business",
          source: "timeline-assessment",
          target: "requirements-gathering",
          sourceHandle: "business-automation",
        },
        {
          id: "edge-timeline-data",
          source: "timeline-assessment",
          target: "requirements-gathering",
          sourceHandle: "data-analytics",
        },
        {
          id: "edge-timeline-custom",
          source: "timeline-assessment",
          target: "requirements-gathering",
          sourceHandle: "custom-development",
        },
        // Requirements to decision process edges
        {
          id: "edge-requirements-enterprise",
          source: "requirements-gathering",
          target: "decision-process",
          sourceHandle: "enterprise-client",
        },
        {
          id: "edge-requirements-small",
          source: "requirements-gathering",
          target: "decision-process",
          sourceHandle: "small-business-client",
        },
        {
          id: "edge-requirements-startup",
          source: "requirements-gathering",
          target: "decision-process",
          sourceHandle: "startup-client",
        },
        {
          id: "edge-requirements-government",
          source: "requirements-gathering",
          target: "decision-process",
          sourceHandle: "government-client",
        },
        // Decision process to follow-up edges
        {
          id: "edge-decision-immediate",
          source: "decision-process",
          target: "schedule-followup",
          sourceHandle: "immediate-decision",
        },
        {
          id: "edge-decision-month",
          source: "decision-process",
          target: "schedule-followup",
          sourceHandle: "within-month-decision",
        },
        {
          id: "edge-decision-extended",
          source: "decision-process",
          target: "schedule-followup",
          sourceHandle: "extended-evaluation",
        },
        // Follow-up to end edges
        {
          id: "edge-followup-meeting",
          source: "schedule-followup",
          target: endFlow.name,
          sourceHandle: "schedule-meeting",
        },
        {
          id: "edge-followup-proposal",
          source: "schedule-followup",
          target: endFlow.name,
          sourceHandle: "receive-proposal",
        },
        {
          id: "edge-followup-continue",
          source: "schedule-followup",
          target: endFlow.name,
          sourceHandle: "continue-discussion",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
  } catch (error) {
    throw FunctionFailure.nonRetryable(`Error mockFlow: ${error}`);
  }
};
