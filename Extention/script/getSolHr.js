//debug
console.log('Script Injecting....');


if (document.querySelector('.compiler-message__value').innerText === 'Success') {
    const code = monaco.editor.getModels()[0].getValue()
    //debug
    console.log('Script injected, code output', code);    

    const payload = {
        id : 'HrSoln',
        resData: code,
    }

    const event = new CustomEvent('DataSend', {
        detail: payload,
    })

    window.dispatchEvent(event);
   
    //debug
    console.log('Sending message Hr');


}


