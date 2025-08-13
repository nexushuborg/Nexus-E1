import { chromium } from "playwright";
import * as cheerio from "cheerio";

const questionData = async (req, res) => {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(
    `https://www.geeksforgeeks.org/problems/${req.params.url}/0`
  );

  const html = await page.content();

  const $ = cheerio.load(html);

  const taglist = $.extract({
    list: [
      {
        selector: ".problems_accordion_tags__JJ2DX ",
        value: {
          title: {
            selector:
              "div.problems_active_tag_title__cgl9e div.problems_tag_container__kWANg",
          },
          tags: [
            {
              selector: "div.content div.labels a.problems_tag_label__A4Ism",
            },
          ],
        },
      },
    ],
  });

  const description = $.extract({
    title: [
      {
        selector: ".problems_header_description__t_8PB span",
      },
    ],
  });

  const problemTitle = $('.problems_header_content__title__L2cB2 ').text()

  const result = {};
  description.title.forEach((item) => {
    const [key, ...rest] = item.split(": ");
    result[key.trim()] = rest.join(": ").trim();
  });

  await browser.close();

  return res.json({title: problemTitle, stats: result, taglist });
};

export default questionData;
