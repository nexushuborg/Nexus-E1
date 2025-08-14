import aiService from '../services/aiService.js';
import Submission from '../models/Submission.js';

class AIController {
  //Code visualisation
    async visualizeCode(req, res) {
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

      const visualization = await aiService.analyzeCodeForVisualization(code, language);
      
      res.json({
        success: true,
        data: visualization,
        metadata: {
          processedAt: new Date().toISOString(),
          lineCount,
          language
        }
      });
    } catch (error) {
      console.error('Error in code visualization:', error);
      res.status(500).json({ 
        error: 'Failed to generate code visualization',
        details: error.message 
      });
    }
  }
  // Analyze code from submission
  async analyzeSubmission(req, res) {
    try {
      const { submissionId } = req.params;
      const { forceRegenerate = false } = req.body;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      // Check if analysis already exists and not forcing regeneration
      if (submission.aiAnalysis && !forceRegenerate) {
        return res.json({
          success: true,
          data: {
            analysis: submission.aiAnalysis,
            cached: true
          }
        });
      }

      if (!submission.code) {
        return res.status(400).json({
          success: false,
          error: 'No code found in submission'
        });
      }

      const analysis = await aiService.analyzeCode(
        submission.code,
        submission.language,
        submission.title
      );

      // Save analysis to submission
      submission.aiAnalysis = analysis;
      submission.aiAnalysisDate = new Date();
      await submission.save();

      res.json({
        success: true,
        data: {
          analysis,
          cached: false
        }
      });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Generate visualization for submission
  async generateVisualization(req, res) {
    try {
      const { submissionId } = req.params;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      if (!submission.code) {
        return res.status(400).json({
          success: false,
          error: 'No code found in submission'
        });
      }

      const visualization = await aiService.generateVisualization(
        submission.code,
        submission.language,
        submission.title
      );

      res.json({
        success: true,
        data: {
          visualization,
          metadata: {
            submissionId,
            language: submission.language,
            title: submission.title,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Visualization error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Generate study notes
  async generateStudyNotes(req, res) {
    try {
      const { submissionId } = req.params;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      const studyNotes = await aiService.generateStudyNotes(
        submission.code,
        submission.language,
        submission.title,
        submission.difficulty
      );

      res.json({
        success: true,
        data: {
          studyNotes,
          submissionId
        }
      });
    } catch (error) {
      console.error('Study notes error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get similar problems
  async getSimilarProblems(req, res) {
    try {
      const { submissionId } = req.params;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      const suggestions = await aiService.generateSimilarProblems(
        submission.code,
        submission.language,
        submission.title,
        submission.difficulty
      );

      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error('Similar problems error:', error);
      res.status(500).json({
        success: false,
        error: error.message
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
        data: {
          analysis,
          metadata: {
            language,
            title,
            timestamp: new Date().toISOString()
          }
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