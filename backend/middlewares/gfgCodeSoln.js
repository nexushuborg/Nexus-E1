const codeSoln = async (req, res) => {
    const body = JSON.parse(req.body);
    console.log(body.code);
    res.json({
        title: body.title,
        code: body.code,
    });
}

export default codeSoln;