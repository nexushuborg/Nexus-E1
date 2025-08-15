import express from 'express';
const router = express.Router()
import profileData from '../middlewares/lcProfileData.js'
 import recentSubmit from '../middlewares/lcRecentSubmit.js'
 import selectProblem from '../middlewares/lcSelectProblem.js'
import  {protect}  from '../middlewares/auth.middlewares.js';


router.get('/users/:userId', protect, profileData );
router.get('/recentSubmit/:userId', protect, recentSubmit );
router.get('/problem/:problemTitle', protect, selectProblem );
router.post('/', async (req, res) => {
  const body = JSON.parse(req.body);
  console.log(body.code);
  res.json({
    title: body.title,
    code: body.code  
  })

});

export default router;