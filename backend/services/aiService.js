import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // analyzing code and returning the analysis
  async analyzeCode(code, language, problemTitle = '', maxRetries = 5) {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    let attempts = 0;
    let lastError = null;
    
    while (attempts < maxRetries) {
      try {
        attempts++;
        
        const prompt = `Analyze this ${language} code and explain the execution flow step-by-step.
        
        Code to analyze:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide a detailed summary that explains:
        1. What data structures are used (arrays, hashmaps, etc.)
        2. Step-by-step execution flow (how the algorithm works line by line)
        3. Key operations and logic decisions
        
        Example good summary: "Uses a HashMap to store numbers as keys and indices as values. First, iterates through the array checking if (target - current_number) exists in the HashMap. If found, returns the stored index and current index. If not found, stores current number and index in HashMap and continues."
        
        Return your response in this exact JSON format:
        {
          "title": "${problemTitle ? problemTitle : 'Algorithmic Solution'}",
          "summary": "Detailed step-by-step explanation of data structures used and execution flow (3-4 sentences)",
          "timeComplexity": "O(n) with brief explanation",
          "spaceComplexity": "O(n) with brief explanation"
        }
        
        Return ONLY valid JSON, no markdown formatting, no additional text.`;
        const result = await this.model.generateContent(prompt);
        let response = result.response.text();
        
        // Strip markdown code blocks if present
        response = response.replace(/```json\s*|```\s*$/g, '').trim();
        
        
        // Parse and validate JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error(' AI Response parsing failed:', parseError.message);
          console.error('Raw AI Response:', response);
          // Fallback if AI doesn't return valid JSON
          parsedResponse = this.generateFallbackAnalysis(code, language, problemTitle);
        }
        
        // Check if result is valid and not null/empty
        if (parsedResponse && parsedResponse.title && parsedResponse.summary && 
            parsedResponse.title.trim() !== '' && parsedResponse.summary.trim() !== '') {
          return parsedResponse;
        }
        
        
        // Wait before retry (exponential backoff)
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempts} failed:`, error.message);
        
        // error messages
        if (error.message.includes('API key not valid')) {
          throw new Error('Invalid Gemini API key. Please check your API key in Google AI Studio.');
        } else if (error.message.includes('quota')) {
          throw new Error('Gemini API quota exceeded. Please check your usage limits.');
        } else if (error.message.includes('permission')) {
          throw new Error('Gemini API permission denied. Please check your API key permissions.');
        }
        
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
    
    // All retries failed
    throw new Error('AI model busy - please try again later. AI service failed after 5 attempts.');
  }

  generateFallbackAnalysis(code, language, problemTitle = '') 
  {
    const lines = code.split('\n').filter(line => line.trim());
    const hasLoops = /for\s*\(|while\s*\(|forEach/.test(code);
    const hasNestedLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length > 1;
    
    // Try to detect common patterns
    const hasArrays = /\[|Array|List/.test(code);
    const hasHashMap = /HashMap|Map|dict|{}/.test(code);
    const hasRecursion = /return.*\(/.test(code) && code.includes(problemTitle.split(' ')[0]);
    
    let approach = 'iterative approach';
    if (hasRecursion) approach = 'recursive approach';
    else if (hasHashMap) approach = 'hash-based lookup';
    else if (hasArrays && hasLoops) approach = 'array traversal';
    
    return {
      title: problemTitle || `${language} Solution`,
      summary: `[FALLBACK] Implements ${approach} using ${hasHashMap ? 'hash maps' : hasArrays ? 'arrays' : 'basic data structures'}. ${hasNestedLoops ? 'Uses nested loops for comparison operations.' : hasLoops ? 'Single pass iteration through data.' : 'Direct computation without loops.'}`,
      timeComplexity: hasNestedLoops ? 'O(n²)' : hasLoops ? 'O(n)' : 'O(1)',
      spaceComplexity: hasHashMap ? 'O(n)' : 'O(1)'
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