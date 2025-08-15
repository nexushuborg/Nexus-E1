import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeCodeForVisualization(code, language) {
    try {
      const prompt = `
Analyze this ${language} code and return a JSON response with the following structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "function/class/variable name",
      "type": "function|class|variable|condition|loop",
      "code": "relevant code snippet",
      "explanation": "what this does",
      "position": { "x": 0, "y": 0 }
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "relationship type",
      "type": "calls|uses|inherits|flows_to"
    }
  ],
  "metadata": {
    "language": "${language}",
    "complexity": "low|medium|high",
    "mainFlow": "description of main execution flow",
    "keyComponents": ["list of important components"],
    "suggestions": ["optimization suggestions"]
  }
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse and validate JSON
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        return this.generateFallbackVisualization(code, language);
      }
    } catch (error) {
      console.error('Error in code visualization analysis:', error);
      throw new Error('Failed to analyze code for visualization');
    }
  }

  generateFallbackVisualization(code, language) {
    // Simple fallback parser for basic visualization
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    // Basic pattern matching for functions, classes, etc.
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Function detection (basic patterns)
      if (trimmed.match(/^(function|def|class|const|let|var)\s+\w+/)) {
        nodes.push({
          id: `node_${nodeId++}`,
          label: trimmed.substring(0, 50),
          type: trimmed.startsWith('class') ? 'class' : 'function',
          code: trimmed,
          explanation: `Code element at line ${index + 1}`,
          position: { x: Math.random() * 400, y: index * 50 }
        });
      }
    });

    return {
      nodes,
      edges,
      metadata: {
        language,
        complexity: 'medium',
        mainFlow: 'Basic code structure analysis',
        keyComponents: nodes.map(n => n.label),
        suggestions: ['Consider adding more comments', 'Review code structure']
      }
    };
  }

  // Code Analysis with Gemini
  async analyzeCode(code, language, problemTitle = '') {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
    }

    const prompt = `Analyze this ${language} code solution${problemTitle ? ` for "${problemTitle}"` : ''}:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive analysis including:
1. **Algorithm Approach**: What algorithm/technique is used?
2. **Time Complexity**: Big O notation and explanation
3. **Space Complexity**: Memory usage analysis
4. **Code Quality**: Readability, best practices, potential improvements
5. **Edge Cases**: What edge cases are handled or missed?
6. **Alternative Solutions**: Suggest other approaches if applicable
7. **Learning Points**: Key concepts demonstrated in this solution

Format your response in clear sections with markdown formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to analyze code with AI: ' + error.message);
    }
  }

  // Generate Code Visualization Data
  async generateVisualization(code, language, problemTitle = '') {
    if (!this.model) {
      return this.createFallbackVisualization(code, language);
    }

    const prompt = `Create a JSON structure for visualizing this ${language} code as an interactive diagram:

\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON with this exact structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "Function/Variable Name",
      "type": "function|variable|class|loop|condition",
      "description": "Brief description",
      "complexity": "O(1)|O(n)|O(log n)|O(n²)|etc"
    }
  ],
  "edges": [
    {
      "from": "node_id",
      "to": "node_id",
      "relationship": "calls|uses|returns|loops|branches",
      "label": "relationship description"
    }
  ],
  "metadata": {
    "algorithmType": "Dynamic Programming|Greedy|Divide & Conquer|etc",
    "complexity": "low|medium|high",
    "mainComponents": ["component1", "component2"],
    "dataStructures": ["array", "hashmap", "tree", "etc"]
  }
}

Analyze the code flow, function calls, variable usage, and logical structure.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.createFallbackVisualization(code, language);
    } catch (error) {
      console.error('Visualization generation error:', error);
      return this.createFallbackVisualization(code, language);
    }
  }

  // Generate Study Notes
  async generateStudyNotes(code, language, problemTitle, difficulty) {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    const prompt = `Create comprehensive study notes for this ${difficulty} level ${language} problem: "${problemTitle}"

Code Solution:
\`\`\`${language}
${code}
\`\`\`

Generate study notes in this format:

## 📚 Problem Summary
[Brief problem description and what it teaches]

## 🎯 Key Concepts
- [Concept 1: explanation]
- [Concept 2: explanation]
- [Concept 3: explanation]

## 🔍 Algorithm Breakdown
1. [Step 1: what happens]
2. [Step 2: what happens]
3. [Step 3: what happens]

## 💡 Important Insights
- [Insight 1]
- [Insight 2]
- [Insight 3]

## 🔄 Similar Problems
- [Related problem type 1]
- [Related problem type 2]

## 📝 Practice Tips
- [Tip 1]
- [Tip 2]

Format with clear markdown sections.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Study notes generation error:', error);
      throw new Error('Failed to generate study notes: ' + error.message);
    }
  }

  // Generate Problem Suggestions
  async generateSimilarProblems(code, language, problemTitle, difficulty) {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    const prompt = `Based on this ${difficulty} ${language} solution for "${problemTitle}":

\`\`\`${language}
${code}
\`\`\`

Suggest 5-7 similar problems that use the same concepts/algorithms. Return as JSON:

{
  "suggestions": [
    {
      "title": "Problem Name",
      "difficulty": "Easy|Medium|Hard",
      "concepts": ["concept1", "concept2"],
      "reason": "Why this problem is similar",
      "platform": "LeetCode|HackerRank|CodeForces"
    }
  ],
  "learningPath": {
    "current": "Current skill level assessment",
    "next": "What to practice next",
    "concepts": ["concepts to master"]
  }
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        suggestions: [],
        learningPath: {
          current: "Analysis not available",
          next: "Continue practicing",
          concepts: []
        }
      };
    } catch (error) {
      console.error('Similar problems generation error:', error);
      throw error;
    }
  }

  // Code visualization for frontend
  async analyzeCodeForVisualization(code, language) {
    if (!this.model) {
      return this.generateFallbackVisualization(code, language);
    }

    const prompt = `Analyze this ${language} code and return a JSON response with the following structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "function/class/variable name",
      "type": "function|class|variable|condition|loop",
      "code": "relevant code snippet",
      "explanation": "what this does",
      "position": { "x": 0, "y": 0 }
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "relationship type",
      "type": "calls|uses|inherits|flows_to"
    }
  ],
  "metadata": {
    "language": "${language}",
    "complexity": "low|medium|high",
    "mainFlow": "description of main execution flow",
    "keyComponents": ["list of important components"],
    "suggestions": ["optimization suggestions"]
  }
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        return this.generateFallbackVisualization(code, language);
      }
    } catch (error) {
      console.error('Error in code visualization analysis:', error);
      return this.generateFallbackVisualization(code, language);
    }
  }

  // Fallback visualization
  generateFallbackVisualization(code, language) {
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.match(/^(function|def|class|const|let|var)\s+\w+/)) {
        nodes.push({
          id: `node_${nodeId++}`,
          label: trimmed.substring(0, 50),
          type: trimmed.startsWith('class') ? 'class' : 'function',
          code: trimmed,
          explanation: `Code element at line ${index + 1}`,
          position: { x: Math.random() * 400, y: index * 50 }
        });
      }
    });

    return {
      nodes,
      edges,
      metadata: {
        language,
        complexity: 'medium',
        mainFlow: 'Basic code structure analysis',
        keyComponents: nodes.map(n => n.label),
        suggestions: ['Consider adding more comments', 'Review code structure']
      }
    };
  }

  // Fallback visualization for when AI fails
  createFallbackVisualization(code, language) {
    const lines = code.split('\n').filter(line => line.trim());
    const functions = lines.filter(line => 
      line.includes('function') || line.includes('def ') || line.includes('class ') ||
      line.includes('for ') || line.includes('while ') || line.includes('if ')
    );

    return {
      nodes: functions.map((func, index) => ({
        id: `node_${index}`,
        label: func.trim().substring(0, 30),
        type: func.includes('class') ? 'class' : 
              func.includes('function') || func.includes('def') ? 'function' :
              func.includes('for') || func.includes('while') ? 'loop' : 'condition',
        description: 'Auto-detected component',
        complexity: 'Unknown'
      })),
      edges: [],
      metadata: {
        algorithmType: 'Unknown',
        complexity: lines.length > 50 ? 'high' : lines.length > 20 ? 'medium' : 'low',
        mainComponents: functions.slice(0, 3).map(f => f.trim().split(' ')[1] || 'Unknown'),
        dataStructures: []
      }
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