import OpenAI from "openai";

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Missing OpenAI API Key. Please set OPENAI_API_KEY in your .env"
  );
}

export async function POST(request: Request) {
  try {
    console.log("🚀 ~ POST ~ request:", request);
    const formData = await request.formData();
    console.log("🚀 ~ POST ~ formData:", formData);
    const file = formData.get("file") as File;
    console.log("🚀 ~ POST ~ file:", file);

    const openai = new OpenAI({ apiKey: API_KEY });

    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });
    return Response.json({ text: response.text });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
