import express from 'express';
const app = express();
const router = express.Router()
import * as cheerio from "cheerio";
import gfgProfile from "../middlewares/gfgProfileData.js";
import questionData from "../middlewares/gfgQuestionData.js"
import codeSoln from "../middlewares/gfgCodeSoln.js"
import protect from '../middlewares/auth.middlewares.js';


router.get('/users/:userId',protect, gfgProfile);
router.get('/problem/:url',protect, questionData);
router.post('/',protect, codeSoln);

export default router;