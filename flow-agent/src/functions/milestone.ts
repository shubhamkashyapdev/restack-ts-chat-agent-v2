import { FunctionFailure, log } from "@restackio/ai/function";
import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";
import { openaiClient } from "../utils/client";

export type MilestoneInput = {
  message: string;
  context?: {
    systemPrompt?: string;
    outputConditions?: string[];
    previousMessages?: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  };
};

export type MilestoneOutput = {
  response: string;
  classification?: string;
  confidence?: number;
  metadata: {
    status: "success" | "error";
    timestamp: string;
    messageTokens: number;
    totalTokens: number;
    matchedCondition?: string;
  };
};

export const milestone = async ({
  message,
  context,
}: MilestoneInput): Promise<MilestoneOutput> => {
  try {
    console.log({ message, context });
    const openai = openaiClient({});
    log.info("milestone input:", { input: { message, context } });

    if (!context?.systemPrompt) {
      throw new Error("System prompt is required");
    }

    // generate a response
    const simulatedResponse = `I understand your message: "${message}". How can I help you further?`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: context.systemPrompt },
        { role: "user", content: `message: ${message}` },
      ],
    });
    const responseMessage = res.choices[0].message.content;

    const msg = responseMessage || simulatedResponse;
    // @todo: identify the next step

    const classification = context.outputConditions?.[0] || undefined;

    const output: MilestoneOutput = {
      response: msg,
      classification,
      confidence: 1.0,
      metadata: {
        status: "success",
        timestamp: new Date().toISOString(),
        messageTokens: message.length,
        totalTokens: msg.length + message.length,
        matchedCondition: classification,
      },
    };

    log.info("milestone output:", output);
    return output;
  } catch (error) {
    throw FunctionFailure.nonRetryable(`Error in milestone chat: ${error}`);
  }
};
