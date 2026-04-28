import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBwanTmTUJnPPXEFn3MRA5UweH9xmZ9m4o";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch(e) {
    console.error(e);
  }
}

run();
