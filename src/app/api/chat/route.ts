// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer
import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeURL, urlPattern } from "@/app/utils/scraper";

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();

    console.log("message received:", message);
    console.log("messages", messages);

    const url = message.match(urlPattern);

    let scrappedContent = " ";
    if (url) {
      console.log("Url Found", url);
      const scrapperResponse = await scrapeURL(url);
      console.log("Scrapped content", scrappedContent);
      if (scrapperResponse) {
        scrappedContent = scrapperResponse.content;
      }
    }

    const userQuery = message.replace(url ? url[0] : "", "").trim();

    const userPrompt = `
    Answer my question: "${userQuery}"

    Based on the following content:
    <content>
      ${scrappedContent}
    </content>
    `;

    const llmMessages = [
      ...messages,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
