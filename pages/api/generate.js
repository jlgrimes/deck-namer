import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Pokemon",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 1,
      // max_tokens: 1000
    });
    res.status(200).json({ result: completion.data.choices.reduce((acc, curr) => `${acc} ${curr.text.replace('Deck', '')}`, '') });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Give a name with a pun for a Pokemon Card Deck based off given the deck's Pokemon names.

  Cards: Zoroark, Lycanroc
  Name: Paw Patrol
  Cards: Tapu Bulu, Vikavolt
  Name: Bulu Gang
  Cards: Espeon, Garbodor
  Name: Espewing Garbage
  Cards: Palkia, Inteleon
  Name: Mind the Spatial Gap
  Cards: Regigigas, Regirock, Regice, Registeel
  Name: Regi-Guardians of the Galaxy
  Cards: Stonjourner
  Name: Rolling Stones
  Cards: ${capitalizedAnimal}
  Name: 
  `;
}
