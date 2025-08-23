

//debug
console.log('Script injecting...');


  if (!document.querySelector('._title_cl6lg_23')) {
    console.log(ace.edit('submit-ide-v2').getValue())
    const solnCode = ace.edit('submit-ide-v2').getValue();
    const ps = document.querySelector('#problem-statement').innerText;
    const solnLang = document.querySelector('#language-select').innerText;
    const title = document.querySelectorAll('#problem-statement h3')[0].innerText;
    
    const resData = {
      Problem_Title: title,
      Problem_Statement: ps,
      Problem_Difficulty: diff,
      Solution_Code: solnCode,
      Solution_Language: solnLang
    }

    const payload = {
    id: "CfSoln",
    resData : resData
    }
const event = new CustomEvent('DataSend', {
     detail: payload
    })

    
  //debug
    console.log('Sending message cf');

window.dispatchEvent(event)
  
  
  }

  