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

    // First, generate a response to the user's message
    const responseCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: context.systemPrompt },
        { role: "user", content: `message: ${message}` },
      ],
    });
    const responseMessage = responseCompletion.choices[0].message.content || "";

    // Then, classify the response into one of the output conditions
    let classification = "no-event"; // Default fallback
    let confidence = 0;

    if (context.outputConditions && context.outputConditions.length > 0) {
      const classificationPrompt = `
Based on the following conversation:
User: ${message}
Assistant: ${responseMessage}

Classify this conversation into exactly ONE of the following categories:
${context.outputConditions.join(", ")}

If none of the categories fit perfectly, respond with "no-event".

Respond with ONLY the category name, nothing else.`;

      const classificationCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a classifier. Respond only with the exact category name from the options provided. If no category fits, respond with 'no-event'.",
          },
          { role: "user", content: classificationPrompt },
        ],
        temperature: 0, // Use zero temperature for consistent classification
      });

      const predictedClass =
        classificationCompletion.choices[0].message.content
          ?.trim()
          .toLowerCase() || "no-event";

      // Check if the predicted class is in our valid conditions
      if (
        context.outputConditions
          .map((c) => c.toLowerCase())
          .includes(predictedClass)
      ) {
        classification = predictedClass;
        confidence = 1.0;
      }
    }

    const output: MilestoneOutput = {
      response: responseMessage,
      classification,
      confidence,
      metadata: {
        status: "success",
        timestamp: new Date().toISOString(),
        messageTokens: message.length,
        totalTokens: responseMessage.length + message.length,
        matchedCondition: classification,
      },
    };

    log.info("milestone output:", output);
    return output;
  } catch (error) {
    throw FunctionFailure.nonRetryable(`Error in milestone chat: ${error}`);
  }
};
