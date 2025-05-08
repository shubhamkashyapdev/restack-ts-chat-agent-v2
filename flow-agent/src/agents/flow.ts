import {
  defineEvent,
  onEvent,
  condition,
  log,
  step,
  childExecute,
  uuid,
  AgentError,
  agentInfo,
  sleep,
} from "@restackio/ai/agent";
import { Workflow } from "@temporalio/workflow";
import * as flowFunctions from "@restackio/ai/flow";
import * as functions from "../functions";

export type EndEvent = {
  end: boolean;
};

export const endEvent = defineEvent("end");

export type FlowEvent = {
  name: string;
  input: any;
};

export const flowEvent = defineEvent<FlowEvent>("flowEvent");

export type AgentFlowInput = {
  flowJson: any;
};

export type AgentFlowOutput = {
  results: {
    id: string;
    status: "running" | "completed" | "error";
    input: any;
    rawResponse: any;
    response: any;
  }[];
};

/**
 * Gets a flow from the flowMap by its eventName (node id)
 * This allows multiple nodes to use the same workflowType while having different eventNames
 */
function getFlowByEventName(flowMap: any[], eventName: string) {
  return flowMap.find((flow) => flow.eventName === eventName);
}

/**
 * Determines the next event in the flow based on the current flow and child output
 */
function nextEvent({
  flow,
  childOutput,
}: {
  flow: {
    eventName: string;
    workflowType: string;
    flowPrompt: string;
    flowOutputConditions: string[];
    edgeConditions: { targetNodeId: string; condition: string }[];
  };
  childOutput: any;
}) {
  // If there's no response or it's the end flow, return null
  if (!childOutput?.response || flow.workflowType === "endFlow") {
    console.log("No response or end flow reached");
    return null;
  }

  console.log("Flow output conditions:", flow.flowOutputConditions);
  console.log("Child output response:", childOutput.response);
  console.log("Child output raw:", childOutput.rawResponse);
  console.log("Edge conditions:", flow.edgeConditions);

  // Get the classification from rawResponse
  const classification = childOutput.rawResponse?.classification;
  console.log("Classification:", classification);

  if (!classification || classification === "no-event") {
    console.log("No valid classification found or no-event received");
    return null;
  }

  // Find the matching edge based on the classification
  const matchingEdge = flow.edgeConditions.find(
    (edge) =>
      edge.condition === classification || edge.targetNodeId === classification
  );

  console.log("Matching edge:", matchingEdge);

  if (!matchingEdge) {
    console.log("No matching edge found");
    return null;
  }

  // Return the next event information
  return {
    eventName: matchingEdge.targetNodeId,
  };
}

export async function agentFlow({
  flowJson,
}: AgentFlowInput): Promise<AgentFlowOutput> {
  let endReceived = false;
  const eventResults: AgentFlowOutput["results"] = [];
  try {
    if (!flowJson) {
      // Mock React Flow JSON to debug with frontend
      flowJson = await step<typeof functions>({}).mockFlow();
    }

    const { flowMap } = await step<typeof flowFunctions>({}).dslInterpreter({
      reactflowJson: flowJson,
    });

    onEvent(flowEvent, async ({ name, input }: FlowEvent) => {
      log.info(`Received event: ${name}`);
      log.info(`Received event data: ${input}`);
      console.log({ name, input });
      const flow = getFlowByEventName(flowMap, name);

      if (!flow) {
        throw new AgentError(`No workflow found for event: ${name}`);
      }

      const childOutput = await childExecute({
        child: flow.workflowType as unknown as Workflow,
        childId: uuid(),
        input: {
          eventData: input,
          flow: {
            prompt: flow.flowPrompt,
            outputConditions: flow.flowOutputConditions,
          },
        },
        taskQueue: "workflow",
      });

      eventResults.push({
        id: name,
        status: "completed",
        input: input,
        rawResponse: childOutput.rawResponse,
        response: childOutput.response,
      });

      console.log(childOutput);

      const nextFlowEvent = nextEvent({ flow, childOutput });
      console.log({ nextFlowEvent });
      // if (nextFlowEvent) {
      //   await sleep(1000);
      //   step<typeof functions>({}).sendAgentEvent({
      //     eventName: "flowEvent",
      //     eventInput: {
      //       name: nextFlowEvent.eventName,
      //       input: childOutput.response,
      //     },
      //     agentId: agentInfo().workflowId,
      //     runId: agentInfo().runId,
      //   });
      // }

      return {
        ...childOutput,
        nextEvent: nextFlowEvent?.eventName,
      };
    });

    onEvent(endEvent, async () => {
      await sleep(2000);
      endReceived = true;
    });

    await condition(() => endReceived);

    log.info("end condition met");
    return {
      results: eventResults,
    };
  } catch (error) {
    throw new AgentError("Error in agentFlow", error as string);
  }
}
