import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";

export type MilestoneWorkflowInput = {
  eventData: string;
  flow: {
    prompt: string;
    outputConditions: string[];
  };
};

export type MilestoneWorkflowOutput = {
  response: string[];
  rawResponse: any;
};

export async function milestone(
  input: MilestoneWorkflowInput
): Promise<MilestoneWorkflowOutput> {
  try {
    console.log("Starting milestone workflow with input:", input);

    // Call the milestone function directly
    const milestoneResult = await step<typeof functions>({
      taskQueue: "workflow",
    }).milestone({
      message: input.eventData,
      context: {
        systemPrompt: input.flow.prompt,
        outputConditions: input.flow.outputConditions,
        previousMessages: [],
      },
    });

    console.log("Milestone result:", milestoneResult);

    // Return in the format expected by the flow agent
    return {
      response: [milestoneResult.classification || ""], // Use classification for flow control
      rawResponse: {
        ...milestoneResult,
        conversationHistory: [
          {
            role: "user",
            content: input.eventData,
          },
          {
            role: "assistant",
            content: milestoneResult.response,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error in milestone workflow:", error);
    throw new Error(`Error in milestone workflow: ${error}`);
  }
}
