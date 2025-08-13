import { chromium } from 'playwright';
import * as cheerio from "cheerio";
import list from "../controllers/gfgProblemList.js";

const gfgProfile = async (req, res) => {

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.geeksforgeeks.org/user/${req.params.userId}/`);

  const html = await page.content();

  const $ = cheerio.load(html);

  const userName = $.extract({
    username: ".profilePicSection_head_userHandle__oOfFy",
  });

  const streakdiv = $(".circularProgressBar_head_mid__IKjUN").extract({
    streakStat: ["div"],
  });

  const Stats = $.extract({
    problemstats: [
      {
        selector: ".scoreCard_head__nxXR8",
        value: {
          Title: {
            selector: ".scoreCard_head_left--text__KZ2S1",
          },
          score: {
            selector: ".scoreCard_head_left--score__oSi_x",
          },
        },
      },
    ],
  });

  
    const problemtag = $.extract({
    tags: [
      {
        selector: ".problemNavbar_head_nav__a4K6P",
        value: {
          tagname: ".problemNavbar_head_nav--text__UaGCx",
        },
      },
    ],
  });

  const problemlist = $.extract({
    problemSections: [
      {
        selector: ".problemList_head__FfRAd",
        value: {
          problems: [
            {
              selector:
                "ul.problemList_head_list__guE6e li.problemList_head_list_item__RlO_s",
              value: {
                title: {
                  selector: "a.problemList_head_list_item_link__dhmtd",
                },
                link: {
                  selector: "a.problemList_head_list_item_link__dhmtd",
                  value: "href",
                },
              },
            },
          ],
        },
      },
    ],
  });

  const newList = list(problemtag, problemlist);

  await browser.close();
  return res.json({
    userName: userName.username,
    Stats: Stats.problemstats,
    streak: streakdiv.streakStat[1],
    tags: newList.tagged,
    solved: newList.transformedList,
  });
}


export default gfgProfile;