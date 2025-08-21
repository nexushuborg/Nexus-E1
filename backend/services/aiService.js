import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Single unified AI Analysis function
  async analyzeCode(code, language, problemTitle = '') {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
    }

    const prompt = `Give me a brief conceptual summary of this ${language} code${problemTitle ? ` for "${problemTitle}"` : ''}, along with a single line title with time and space complexity.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return your response in this exact JSON format:
{
  "title": "Single line title describing what the code does",
  "summary": "Brief conceptual summary explaining the approach and logic (2-3 sentences)",
  "timeComplexity": "O(n) or appropriate Big O notation",
  "spaceComplexity": "O(1) or appropriate Big O notation"
}

Return ONLY valid JSON, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse and validate JSON
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        return this.generateFallbackAnalysis(code, language, problemTitle);
      }
    } catch (error) {
      console.error('Error in code analysis:', error);
      throw new Error('Failed to analyze code: ' + error.message);
    }
  }

  // Fallback analysis when AI fails
  generateFallbackAnalysis(code, language, problemTitle = '') {
    const lines = code.split('\n').filter(line => line.trim());
    const hasLoops = /for\s*\(|while\s*\(|forEach/.test(code);
    const hasNestedLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length > 1;
    
    return {
      title: problemTitle || `${language} code solution`,
      summary: `This code implements a solution using ${language}. It processes data through ${hasLoops ? 'iterative' : 'direct'} operations and appears to solve the given problem efficiently.`,
      timeComplexity: hasNestedLoops ? 'O(n²)' : hasLoops ? 'O(n)' : 'O(1)',
      spaceComplexity: 'O(1)'
    };
  }

  // Health check
  async healthCheck() {
    return {
      gemini: !!this.model,
      status: this.model ? 'ready' : 'not_configured',
      apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
    };
  }
}

export default new AIService();