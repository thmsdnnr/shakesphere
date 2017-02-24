  const s = require('syllable');
  const speak = require('speakeasy-nlp');

  module.exports = HaikYou;

  function HaikYou(text) {
    this.text=text;
  };

  HaikYou.prototype.processWords = function(text) {
    let words=text.replace(/\n/g,' ').split(" ").filter((word)=>!word.match(/[^A-Za-z]/g));
    return words.map(word=>word.trim().toLowerCase());
  }

  HaikYou.prototype.isHaikuComplete = (h) => (((s(h.lineOne.join(" "))===5)&&(s(h.lineTwo.join(" "))===7))&&(s(h.lineThree.join(" "))===5));

  HaikYou.prototype.upperCaseLine = (line)=>line.slice(0,1).toUpperCase()+line.slice(1);
  HaikYou.prototype.lowerCaseLine = (line)=>line.slice(0,1).toLowerCase()+line.slice(1);

  HaikYou.prototype.assembleFinishedHaiku = function(h) {
    if (typeof(h)==='string') { return false; } //not a haiku object (so a haiku could not be formed)
    return Object.keys(h).map(line=>h[line].join(" "));
  }

  HaikYou.prototype.addWordToLine = function(word, h) {
    let keyToEdit, maxLen, currentLineSyllables;
    if (s(h.lineOne.join(" "))<5) { keyToEdit='lineOne'; }
    else if (s(h.lineTwo.join(" "))<7) { keyToEdit='lineTwo'; }
    else { keyToEdit='lineThree'; }
    (keyToEdit==='lineOne'||keyToEdit==='lineThree') ? maxLen=5 : maxLen=7;
    currentLineSyllables=s(h[keyToEdit].join(" "));
    if ((currentLineSyllables+s(word))<=maxLen) { h[keyToEdit].push(word); }
    return h;
  }

  HaikYou.prototype.buildHaiku = function(wordList, offset=0) {
    let h={ lineOne: [], lineTwo: [], lineThree: [] };
    for (var i=offset;i<wordList.length;i++) {
      h=this.addWordToLine(wordList[i], h);
      if (this.isHaikuComplete(h)) { return h; }
    }
    return (this.isHaikuComplete(h)) ? h : `A haiku could not be formed starting from offset ${offset} with the supplied text.`;
  }

  HaikYou.prototype.scoreLines = function(lines) { //naive score so haiku with more actions owners and subjects is higher
    let score=0;
    lines.forEach((line)=>{
      let c=speak.classify(line.trim());
      if (c.action!==null&&(c.action!==c.subject)) {score++;}
      if (c.owner!==undefined) {score++;}
      if (c.subject!==undefined) {score++;}
    });
    return score;
  }

  HaikYou.prototype.pruneHaikuList = function(haikuList, shears, scoreMin=0, scoreMax=100) {
    //removes haikus with a line that ends with a word in shears.
    let pruned=haikuList.filter((haiku)=>{
    let score=this.scoreLines(haiku);
    if ((score<scoreMin)||(score>scoreMax)) { return false; }

    let first=haiku[0].trim().split(" ");
    let middle=haiku[1].trim().split(" ");
    let last=haiku[2].trim().split(" ");

    if (shears.indexOf(last[last.length-1])===-1) {
      if (shears.indexOf(middle[middle.length-1])===-1) {
        if (shears.indexOf(first[first.length-1])===-1) {
          return true;
        }
      }
      return true;
    }
    else { return false; }
  });
  return pruned;
}

  getFivers = (haikuList) => haikuList.map((l)=>[l[0],l[2]])[0];
  getSevens = (haikuList) => haikuList.map(haiku=>haiku[1]);

  function replaceDuplicatesWithPartOfSpeech(line, pOS) {
    let split=line.split(" ");
    for (var i=0;i<split.length;i++) {
      if (split.indexOf(i)!==split.lastIndexOf(i)) {
        let replacement='';
        while (s(split[i])!==s(replacement)) {
          replacement=sentencer.make(`${pOS}`);
        }
        split[i]=replacement;
      }
    }
    return line;
  }

  HaikYou.prototype.generateHaikuList=function(wordList) {
    let keepGoing=true;
    let interval=0;
    let h;
    let haikuList=[];
    while (keepGoing) {
      h=this.assembleFinishedHaiku(this.buildHaiku(wordList,interval));
      (h) ? haikuList.push(h) : keepGoing=false;
      interval+=1;
    }
    return haikuList;
  }

  HaikYou.prototype.displayHaikus=function(haikus) {
    haikus.forEach((haiku)=>{
      haiku[0]=this.upperCaseLine(haiku[0]);
      haiku[2]=haiku[2]+".";
    });
    return haikus;
  }
