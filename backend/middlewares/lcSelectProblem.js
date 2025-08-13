import query from "../controllers/lcSelectProblem.js";

const selectProb = async (req, res) => {
    const title = req.params.problemTitle;
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          titleSlug: title, 
        },
      }),
    });
    const data = await response.json()
    res.json(data)
}

export default selectProb;