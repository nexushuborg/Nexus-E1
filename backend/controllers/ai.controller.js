import aiService from '../services/aiService.js';

class AIController {
  // Code Analysis (simplified - removed visualization)
  async analyzeCode(req, res) {
    try {
      const { code, language = 'javascript' } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      // Check code length (max 10k lines as per requirement)
      const lineCount = code.split('\n').length;
      if (lineCount > 10000) {
        return res.status(400).json({ 
          error: 'Code exceeds maximum limit of 10,000 lines' 
        });
      }

      const analysis = await aiService.analyzeCode(code, language);
      
      res.json({
        success: true,
        data: analysis,
        metadata: {
          processedAt: new Date().toISOString(),
          lineCount,
          language
        }
      });
    } catch (error) {
      console.error('Error in code analysis:', error);
      res.status(500).json({ 
        error: 'Failed to generate code analysis',
        details: error.message 
      });
    }
  }
  
  // Analyze custom code (not from submission)
  async analyzeCustomCode(req, res) {
    try {
      const { code, language, title = '' } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Code and language are required'
        });
      }

      const analysis = await aiService.analyzeCode(code, language, title);

      res.json({
        success: true,
        data: analysis,
        metadata: {
          language,
          title,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Custom analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
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