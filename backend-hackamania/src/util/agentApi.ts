import axios from 'axios';

// -- Message interface --
export interface Message {
  message: string;
  happiness: number;
  sadness: number;
  frustration: number;
  tiredness: number;
}

// -- Analyze a single message string --
export async function analyzeMessage(message: string): Promise<any> {
  try {
    const response = await axios.post('http://localhost:8000/analyze', { text: message });
    return response.data; // Return just the data, not the entire AxiosResponse
  } catch (error) {
    throw error;
  }
}

// -- Summarize an array of Message objects --
export async function summarizeMessages(messages: Message[]): Promise<any> {
  try {
    const response = await axios.post('http://localhost:8000/summarize', { messages });
    return response.data; // Consistency: return just the data
  } catch (error) {
    throw error;
  }
}