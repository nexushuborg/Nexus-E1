import express from 'express';
const app = express();
const router = express.Router()
import * as cheerio from "cheerio";
import gfgProfile from "../middlewares/gfgProfileData.js";
import questionData from "../middlewares/gfgQuestionData.js"
import codeSoln from "../middlewares/gfgCodeSoln.js"


router.get('/users/:userId', gfgProfile);
router.get('/problem/:url', questionData);
router.post('/', codeSoln);

export default router;