

//debug
console.log('Script injecting...');


  if (!document.querySelector('._title_cl6lg_23')) {
    console.log(ace.edit('submit-ide-v2').getValue())
    const resData = ace.edit('submit-ide-v2').getValue();
    
    const payload = {
 id: "CfSoln",
    resData : resData
    }
const event = new CustomEvent('DataSendGfg', {
     detail: payload
    })

    
  //debug
    console.log('Sending message cf');

window.dispatchEvent(event)
  
  
  }

  