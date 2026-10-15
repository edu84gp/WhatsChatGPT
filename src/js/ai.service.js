import { Ollama } from "ollama";
import { env } from "process";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: { Authorization: "Bearer " + env.OLLAMA_API_KEY },
});
console.log(env.OLLAMA_API_KEY);

export async function consultarIA(texto) {
  try {
    const response = await ollama.chat({
      model: "gpt-oss:120b",
      messages: [
        {
          role: "user",
          content: `Tu respuesta debe ir al grano, sin florituras ni rodeos, debe ser lo más corta posible, respondiendo únicamente a lo que se dice en el texto: "${texto}" nunca debe pasar de 200 palabras. Si es una pregunta de programación, ponte en el rol de profesor de tontos y da tips con algo de código. `,
        },
      ],
      stream: false,
    });

    return response.message.content;
  } catch (e) {
    console.error("Error al consultar la IA:", e);
    return "Lo siento, ha ocurrido un error al conectar con la IA.";
  }
}
