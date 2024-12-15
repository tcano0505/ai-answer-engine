import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function getGroqResponse(chatMessages: ChatMessage[]) {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are an academic expert, you always cite your sources and base your response only on the context on the information you are given.",
    },
    ...chatMessages,
  ];

  console.log("messages", messages);
  console.log("Starting groq api request");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
  });

  console.log("Groq api request received", response);

  return response.choices[0].message.content;
}
