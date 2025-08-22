

//debug
console.log('Script injecting...');


  if (!document.querySelector('._title_cl6lg_23')) {
    console.log(ace.edit('submit-ide-v2').getValue())
    const solnCode = ace.edit('submit-ide-v2').getValue();
    const ps = document.querySelector('#problem-statement').innerText;
    const solnLang = document.querySelector('#language-select').innerText;
    const resData = {
      Problem_Statement: ps,
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

  