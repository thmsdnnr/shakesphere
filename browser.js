window.onload=function(){
  let H = new HaikYou();
  let formDiv=document.getElementById('form');
  let btn=document.getElementById('submitBtn');
  let t=document.querySelector('textarea#t');
  btn.addEventListener('click', handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
    console.log(t.value);
    listHaikus(t.value);
  }

  function listHaikus(text) {
    let hDiv=document.getElementById('haiku');
    let articles=['a','and','the','it','not','or','but','so','in','i','to','is','of','on','an'];
    let wordList=H.processWords(text);
    let haikuList=H.pruneHaikuList(H.generateHaikuList(wordList), articles);
    hDiv.style.display='inline';
    haikuList.forEach((haiku)=>{
      hDiv.innerHTML+=`<p>${H.upperCaseLine(haiku[0])}<br />${haiku[1]}<br />${haiku[2]}.</p>`;
    });
    formDiv.innerHTML=`<a href="/">start again</a>`;
  }
}
