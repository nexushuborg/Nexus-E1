import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Retry wrapper
  async analyzeCodeWithRetry(code, language, problemTitle = '', maxRetries = 5) {
    let attempts = 0;
    let lastError = null;
    
    while (attempts < maxRetries) {
      try {
        attempts++;
        console.log(`AI Analysis - Attempt ${attempts}/${maxRetries}`);
        
        const result = await this.analyzeCode(code, language, problemTitle);
        
        // Check if result is valid and not null/empty
        if (result && result.title && result.summary && 
            result.title.trim() !== '' && result.summary.trim() !== '') {
          return {
            success: true,
            data: result,
            attempts: attempts
          };
        }
        
        console.log(`Attempt ${attempts} returned null/empty result, retrying...`);
        
        // Wait before retry (exponential backoff)
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempts} failed:`, error.message);
        
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
    
    // All retries failed
    return {
      success: false,
      error: 'AI model busy - please try again later',
      message: 'AI service failed after 5 attempts. This could be due to: AI model being busy, API key issues, or temporary service unavailability.',
      attempts: maxRetries,
      lastError: lastError?.message
    };
  }

  async analyzeCode(code, language, problemTitle = '') {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
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
      
      // More specific error messages
      if (error.message.includes('API key not valid')) {
        throw new Error('Invalid Gemini API key. Please check your API key in Google AI Studio.');
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please check your usage limits.');
      } else if (error.message.includes('permission')) {
        throw new Error('Gemini API permission denied. Please check your API key permissions.');
      }
      
      throw new Error('Failed to analyze code: ' + error.message);
    }
  }

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

  async healthCheck() {
    return {
      gemini: !!this.model,
      status: this.model ? 'ready' : 'not_configured',
      apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
    };
  }
}

export default new AIService();