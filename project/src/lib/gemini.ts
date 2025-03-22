import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAg0XFM2XfU5ByxBF7R1XG6KFfeCWy1-T0'); // Replace with actual API key

export const getAIResponse = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};

export const getQuizQuestions = async (
  courseName: string,
  difficulty: string,
  numQuestions: number = 5
) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Generate a multiple-choice quiz for the course "${courseName}" 
      at ${difficulty} level with ${numQuestions} questions.
      
      Format each question as follows:
      Question: [question text]
      Options:
      A) [option text]
      B) [option text]
      C) [option text]
      D) [option text]
      Correct Answer: [A/B/C/D]
      Explanation: [explanation text]

      Ensure the response is structured and clear.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the text response into structured quiz questions
    const questions = parseQuizResponse(text);
    return questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

function parseQuizResponse(text: string) {
  const questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [];

  // Split the text into question blocks
  const questionBlocks = text.split(/Question:/).filter(block => block.trim());

  for (const block of questionBlocks) {
    try {
      // Extract question text
      const questionMatch = block.match(/(.+?)(?=Options:|$)/s);
      const questionText = questionMatch ? questionMatch[1].trim() : '';

      // Extract options
      const options: string[] = [];
      const optionsText = block.match(/Options:([\s\S]*?)(?=Correct Answer:|$)/);
      if (optionsText) {
        const optionLines = optionsText[1].match(/[A-D]\)(.*?)(?=(?:[A-D]\)|Correct Answer:|$))/gs);
        if (optionLines) {
          options.push(...optionLines.map(line => line.replace(/^[A-D]\)/, '').trim()));
        }
      }

      // Extract correct answer
      const correctAnswerMatch = block.match(/Correct Answer:\s*([A-D])/);
      const correctAnswer = correctAnswerMatch ? 
        options[correctAnswerMatch[1].charCodeAt(0) - 65] : // Convert A-D to array index
        '';

      // Extract explanation
      const explanationMatch = block.match(/Explanation:\s*([\s\S]*?)(?=(?:Question:|$))/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';

      if (questionText && options.length === 4 && correctAnswer && explanation) {
        questions.push({
          question: questionText,
          options,
          correctAnswer,
          explanation
        });
      }
    } catch (error) {
      console.error('Error parsing question block:', error);
      continue; // Skip this question if parsing fails
    }
  }

  if (questions.length === 0) {
    throw new Error('Failed to parse quiz questions from response');
  }

  return questions;
}