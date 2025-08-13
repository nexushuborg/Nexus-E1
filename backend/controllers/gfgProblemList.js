
const list = (problemtag, problemlist)=>{
    const tagged = problemtag.tags.map(({ tagname }) => {
        const [name, number] = tagname.split(/[ ()]+/).filter(Boolean);
        return { name, number: Number(number) };
    });


    const transformedList = problemlist.problemSections.map((item) => {
        const len = item.problems.length;

        const tag = tagged.find((t) => t.number === len);

        if (tag) {
        return { [tag.name]: item.problems };
        }
        return item;
    });

    return {transformedList, tagged};
}

export default list