import aiService from '../services/aiService.js';

class AIController {
  // Code Analysis
  async analyzeCode(req, res) {
    try {
      const { code, language = 'javascript', title = '' } = req.body;
      
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

  // GitSync AI notes generation
  async generateNotesForGitSync(req, res) {
    try {
      const { code, language, problemTitle, repositoryUrl, filePath } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Code and language are required for AI notes generation'
        });
      }

      // Checking code length
      const lineCount = code.split('\n').length;
      if (lineCount > 10000) {
        return res.status(400).json({ 
          success: false,
          error: 'Code exceeds maximum limit of 10,000 lines' 
        });
      }

      console.log(`Generating AI notes for GitSync - Repo: ${repositoryUrl}, File: ${filePath}`);
      
      // Using retry logic
      const result = await aiService.analyzeCodeWithRetry(code, language, problemTitle);
      
      if (result.success) {
        // Same response format plus GitSync metadata
        res.json({
          success: true,
          data: {
            aiNotes: result.data,
            metadata: {
              repositoryUrl,
              filePath,
              language,
              problemTitle,
              generatedAt: new Date().toISOString(),
              attempts: result.attempts,
              lineCount
            }
          }
        });
      } else {
        res.status(503).json({
          success: false,
          error: result.error,
          message: result.message,
          attempts: result.attempts
        });
      }
      
    } catch (error) {
      console.error('Error in GitSync AI notes generation:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate AI notes for GitSync',
        details: error.message 
      });
    }
  }
}

export default new AIController();