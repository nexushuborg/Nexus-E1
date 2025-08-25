import aiService from '../services/aiService.js';

class AIController {
  // Code Analysis
  async analyzeCode(req, res) {
    try {
      const { code, language, title  } = req.body;
      
      if (!code) {
        return res.status(400).json({ 
          success: false,
          error: 'Code is required' 
        });
      }

      // Add line count validation
      const lineCount = code.split('\n').length;
      if (lineCount > 10000) {
        return res.status(400).json({ 
          success: false,
          error: 'Code exceeds maximum limit of 10,000 lines' 
        });
      }

      const analysis = await aiService.analyzeCode(code, language, title);
      
      res.json({
        success: true,
        data: analysis,
        metadata: {
          processedAt: new Date().toISOString(),
          lineCount,
          language,
          title: title || undefined
        }
      });
    } catch (error) {
      console.error('Error in code analysis:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate code analysis',
        details: error.message 
      });
    }
  }
  
  // Health check
  async healthCheck(req, res) {
    try {
      const status = await aiService.healthCheck();
      
      res.json({
        success: true,
        status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new AIController();