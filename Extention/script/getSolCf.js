//debug
console.log("Script injecting...");

if (!document.querySelector("._title_cl6lg_23")) {
  console.log(ace.edit("submit-ide-v2").getValue());
  const solnCode = ace.edit("submit-ide-v2").getValue();
  const ps = document.querySelector("#problem-statement").innerText;
  const solnLang = document.querySelector("#language-select").innerText;
  const title = document.querySelectorAll("#problem-statement h3")[0].innerText;
  const diff = document.querySelector("._difficultyRatings__box_oqprl_154").textContent.match(/\d+/)[0];
  const tags = window.location.href.match('/course\/([^\/]+)/')[1];
  const psWithTags = tags + '\n\n' + ps;
  const difficultyRating = parseInt(diff);

  let difficulty;

  if (difficultyRating <= 1000) {
    console.log("Beginner");
    difficulty = "Beginner";
  } else if (difficultyRating <= 1400) {
    console.log("Beginner/Intermediate");
    difficulty = "Beginner/Intermediate";
  } else if (difficultyRating <= 1800) {
    console.log("Intermediate");
    difficulty = "Intermediate";
  } else if (difficultyRating > 1800) {
    console.log("Advanced");
    difficulty = "Advanced";
  }

  const resData = {
    Problem_Title: title,
    Problem_Statement: psWithTags,
    Problem_Difficulty: difficulty,
    Solution_Code: solnCode,
    Solution_Language: solnLang,
  };

  const payload = {
    id: "CfSoln",
    resData: resData,
  };
  const event = new CustomEvent("DataSend", {
    detail: payload,
  });

  //debug
  console.log("Sending message cf");

  window.dispatchEvent(event);
}
