//debug
console.log('Script Injecting....');


if (document.querySelector('.compiler-message__value').innerText === 'Success') {
    const code = monaco.editor.getModels()[0].getValue()
    //debug
    const ps = document.querySelector('.challenge-body-html').innerText
    const lang = document.querySelector('.css-ki0glp').innerText
    const title = document.querySelector('.page-label').innerText
    const diff = document.querySelectorAll('.difficulty-block')[1].querySelector('.pull-right').innerText
    console.log('Script injected, code output', code);    
    resData = {
      Problem_Title: title,
      Problem_Statement: ps,
      Problem_Difficulty: diff,
      Solution_Language: lang,
      Solution_Code: code,
    }

    const payload = {
        id : 'HrSoln',
        resData: resData,
    }

    const event = new CustomEvent('DataSend', {
        detail: payload,
    })

    window.dispatchEvent(event);
   
    //debug
    console.log('Sending message Hr');


}


