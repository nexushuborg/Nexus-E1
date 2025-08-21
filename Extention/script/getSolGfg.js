
//debug
console.log('Script injecting...');


// var isSuccessfull = document.querySelector(
//     ".problems_problem_solved_successfully__Zb4yG"
//   );
  if ( document.querySelector(
    ".problems_problem_solved_successfully__Zb4yG"
  )) {
    const ps = document.querySelector(".problems_left_section__content__N0OKr");
    const lang = document.querySelector(".problems_language_dropdown__DgjFb");
    const code = ace.edit("ace-editor").getValue();
    const resData = {
      Problem_Statement: ps.innerText,
      Solution_Language: lang.innerText,
      Solution_Code: code,
    };
  //   chrome.runtime.sendMessage({
  //   id: "GfgSoln",
  //   resData : resData
  // })

    const payload = {
      id: "GfgSoln",
    resData : resData
    }

    const event = new CustomEvent('DataSendGfg', {
      detail: payload,
    })

    window.dispatchEvent(event)
  //debug
  console.log('Sending message GFG');
  }


