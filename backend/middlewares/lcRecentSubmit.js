import query from "../controllers/lcRecentAcSubmit.js";

const recentProb = async (req, res) => {
    const username = req.params.userId;
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          username: username, 
        },
      }),
    });
    const data = await response.json()
    res.json(data)
}

export default recentProb;