

(function(){
  const { ipcRenderer } = require('electron'),
        $textContainer = document.getElementById("reader-text"),
        $nextTextContainer = document.getElementById("reader-nextText"),
        $previousTextContainer = document.getElementById("reader-prevText"),
        $speedInput = document.getElementById("speedRange"),
        $buttonStart = document.getElementById("actionStart"),
        $buttonStop = document.getElementById("actionStop"),
        $buttonBack = document.getElementById("actionBack"),
        $buttonForward = document.getElementById("actionForward"),
        $buttonLoadFile = document.getElementById("actionLoad"),
        $loadFileInput = document.getElementById("loadFile"),
        $pageInfoDiv = document.getElementById("pageInfo"),
        $pageNumberMaxSpan = document.getElementById("pageNumberMax"),
        $pageNumberInput = document.getElementById("pageNumber"),
        $infoReaderSpan = document.getElementById("infoReader");

  let   playing = false,
        words = null,
        currentIndex = 0;

  let speed = $speedInput.value

  $speedInput.addEventListener('change', function () {
    speed = this.value;
    changeWord(words,currentIndex);
  })

  function onPause(){
    $buttonStart.setAttribute("data-status","resume");
    $buttonStart.textContent="Resume";
    playing=false;
    $pageInfoDiv.style.display="";
    $infoReaderSpan.style.display="";
  }

  function launchBulletReader(){
    const wait=3;
    let index=0;
    $textContainer.innerText = "Starting in "+(wait-index)+" seconds";
    const starting = setInterval(() => {
      index++;
      if(index===3){
        playing=true;
        clearInterval(starting);
        bulletRead(words);
      } else {
        $textContainer.innerText = "Starting in "+(wait-index)+" seconds";
      }
    },1000);
  }

  function onStart(){
    $buttonStart.setAttribute("data-status","pause");
    $buttonStart.textContent="Pause";
    currentIndex=0;

    $buttonStop.style.display="";
    $buttonForward.style.display="";
    $buttonBack.style.display="";
    $pageInfoDiv.style.display="none";
    $infoReaderSpan.style.display="none";

    launchBulletReader();
  }

  function onResume(){
    $buttonStart.setAttribute("data-status","pause");
    $buttonStart.textContent="Pause";
    $pageInfoDiv.style.display="none";
    $infoReaderSpan.style.display="none";

    launchBulletReader();
  }

  function startHandler(){
    if(words!== null){
      const status = $buttonStart.getAttribute("data-status");
      switch(status){
        case "start":
          onStart();
          break;
        case "pause":
          onPause();
          break;
        case "resume":
          onResume();
          break;
        default:
          console.log(status);
          break;
      }
    }
  }

  $buttonStart.addEventListener('click', startHandler);

  $loadFileInput.addEventListener("change",function () {
    words = null;
    ipcRenderer.send('loadFile', this.files[0].path)
  });

  $buttonLoadFile.addEventListener('click', function () {
    $loadFileInput.click();
  });

  $buttonStop.addEventListener('click', function () {
    $buttonStart.setAttribute("data-status","start");
    $buttonStart.textContent="Start";
    playing=false;
    currentIndex=0;
    this.style.display="none";
  });

  function onBackward(){
    if(words!== null){
      onPause();
      if(currentIndex-1>=0){
        changeWord(words,--currentIndex);
      }
    }
  }

  $buttonBack.addEventListener('click', function () {
    onBackward();
  });

  function onForward(){
    if(words!== null){
      onPause();
      if(currentIndex+1<words.length){
        changeWord(words,++currentIndex);
      }
    }
  }

  $buttonForward.addEventListener('click', function () {
    onForward();
  });

  window.addEventListener("wheel", (event) => {
    $speedInput.value-=parseInt(event.wheelDelta/10);
    speed = $speedInput.value;
    changeWord(words,currentIndex);
  });

  document.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;
    switch(keyCode){
      case 32: //space
        startHandler();
        break;
      case 37: //left
        onBackward();
        break;
      case 39: //right
        onForward();
        break;
    }
  });

  $pageNumberInput.addEventListener("change", function () {
    changeWord(words,parseInt(this.value)-1);
  });

  ipcRenderer.on('getFile', (event, arg) => {
    words = arg;
    $buttonStart.style.display="";

    $pageNumberInput.setAttribute("min",1);
    $pageNumberInput.setAttribute("max",words.length);

    changeWord(words,0);
  })

  function bulletRead(words){
    if(playing){
      if(currentIndex>=words.length){
        $buttonStop.click();
        return;
      }
      changeWord(words,currentIndex);
      setTimeout(()=>{
        currentIndex++;
        return bulletRead(words)
      }, speed)
    }
  }

  function calculateTimeLeft(words,index){
    const milliseconds = speed*(words.length-index),
        seconds = parseInt(milliseconds / 1000),
        minutes = parseInt(seconds / 60),
        hours = parseInt(minutes / 60);
    let response = "";
    if(hours>0){
      response+=hours+" hours "
    }
    if(minutes>0){
      response+="and "+(minutes%60)+" minutes ";
    }
    if(seconds>0){
      response=response.replace(" and",",");
      response+="and "+(seconds%60)+" seconds "
    }
    if(milliseconds>0){
      response=response.replace(" and",",");
      response+="and "+(milliseconds%1000)+" milliseconds ";
    }
    return response;
  }

  function checkIndex(index,array){
    return index>=0 && index<words.length;
  }

  function changeWord(words,index){
    if(words!==null && checkIndex(index,words)){
      if(checkIndex(index-1,words)){
        $previousTextContainer.innerText = words[index-1];
      }
      $textContainer.innerText = words[index];
      if(checkIndex(index+1,words)){
        $nextTextContainer.innerText = words[index+1];
      }
      $pageNumberInput.value = index+1;
      $pageNumberMaxSpan.innerText = words.length;
      $infoReaderSpan.innerText = "At this speed rate it should take you "+calculateTimeLeft(words,index)+"to read the whole document";
    }
  }

})()
