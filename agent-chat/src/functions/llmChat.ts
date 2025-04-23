import { FunctionFailure, log } from "@restackio/ai/function";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

import { openaiClient } from "../utils/client";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenAIChatInput = {
  systemContent?: string;
  model?: string;
  messages: Message[];
};

export const llmChat = async ({
  systemContent = "You are a helpful car sales assistant and your role is to collect information from the user that is required to buy a car. Follow these steps in defined order: 1. Ask for user's name. 2. Ask for user's email 3. Ask for their budget 4. Ask for their preferred brand. 5. Ask if they would like to receive a quote for the car. 6. if they would like to receive a quote, ask for their phone number. 7. if they would not like to receive a quote, thank them for their time and say goodbye. Follow these steps strictly and do not skip any steps. Do not answer anything else than what is asked in the steps. Do not ask for more information than what is asked in the steps. Always be polite and professional. Do not ask for more information than what is asked in the steps. Don't mention '1' or '2' or '3' in your response. Just answer what is asked in the steps.",
  model = "deepseek-chat",
  messages,
}: OpenAIChatInput): Promise<Message> => {
  try {
    const openai = openaiClient({});

    const chatParams: ChatCompletionCreateParamsNonStreaming = {
      messages: [
        ...(systemContent
          ? [{ role: "system" as const, content: systemContent }]
          : []),
        ...(messages ?? []),
      ],
      model,
    };

    log.debug("OpenAI chat completion params", {
      chatParams,
    });

    const completion = await openai.chat.completions.create(chatParams);

    const message = completion.choices[0].message;

    return {
      role: message.role,
      content: message.content ?? "",
    };
  } catch (error) {
    throw FunctionFailure.nonRetryable(`Error OpenAI chat: ${error}`);
  }
};
