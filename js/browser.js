window.onload=function(){
  let H = new HaikYou();
  let formDiv=document.getElementById('form');
  let btn=document.getElementById('submitBtn');
  let t=document.querySelector('textarea#t');
  btn.addEventListener('click', handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();
    listHaikus(t.value);
  }

  function listHaikus(text) {
    let hDiv=document.getElementById('haiku');
    hDiv.innerHTML+=`<p>Some random Markov reconstructions:</p><p>${H.windMaker(H.triforce(H.processWords(text)),40)}</p><p>`;
    hDiv.innerHTML+=H.windMaker(H.triforce(H.processWords(text)),40)+'</p><p>';
    hDiv.innerHTML+=H.windMaker(H.triforce(H.processWords(text)),40)+'</p><p>';
    hDiv.innerHTML+=H.windMaker(H.triforce(H.processWords(text)),40)+'</p><p>';
    hDiv.innerHTML+=H.windMaker(H.triforce(H.processWords(text)),40)+'</p>';
    let articles=['a','and','the','it','not','or','but','so','in','i','to','is','of','on','an'];
    let wordList=H.processWords(text);
    let haikuList=H.pruneHaikuList(H.generateHaikuList(wordList), articles);
    hDiv.style.display='inline';
    haikuList.forEach((haiku)=>{
      hDiv.innerHTML+=`<p>${H.upperCaseLine(haiku[0])}<br />${haiku[1]}<br />${haiku[2]}.</p>`;
    });
    formDiv.innerHTML=`<a href="./">start again</a>`;
  }
}
