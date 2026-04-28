import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCR5hCBwwmhukhHJTUnC5CyhdOf2O6kpNg';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `Return JSON object {"title":"A"}`;
        const result = await model.generateContent(prompt);
        console.log("SUCCESS! Response text:", result.response.text());
    } catch(e: any) {
        console.error("ERROR CAUGHT:", e.message || e);
    }
}
test();
