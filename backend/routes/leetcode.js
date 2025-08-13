import express from 'express';
const router = express.Router()
import profileData from '../middlewares/lcProfileData.js'
 import recentSubmit from '../middlewares/lcRecentSubmit.js'
 import selectProblem from '../middlewares/lcSelectProblem.js'


router.get('/users/:userId',profileData );
router.get('/recentSubmit/:userId',recentSubmit );
router.get('/problem/:problemTitle',selectProblem );
router.post('/', async (req, res) => {
  const body = JSON.parse(req.body);
  console.log(body.code);
  res.json({
    title: body.title,
    code: body.code  
  })

});

export default router;