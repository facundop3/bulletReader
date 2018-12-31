

(function(){
  const { ipcRenderer } = require('electron'),
        $textContainer = document.getElementById("reader-text"),
        $speedInput = document.getElementById("speedRange"),
        $buttonStart = document.getElementById("actionStart"),
        $buttonStop = document.getElementById("actionStop"),
        $buttonBack = document.getElementById("actionBack"),
        $buttonForward = document.getElementById("actionForward"),
        $buttonLoadFile = document.getElementById("actionLoad"),
        $loadFileInput = document.getElementById("loadFile"),
        $pageNumberSpan = document.getElementById("pageNumber"),
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
    $pageNumberSpan.style.display="";
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
    $pageNumberSpan.style.display="none";
    $infoReaderSpan.style.display="none";

    launchBulletReader();
  }

  function onResume(){
    $buttonStart.setAttribute("data-status","pause");
    $buttonStart.textContent="Pause";
    $pageNumberSpan.style.display="none";
    $infoReaderSpan.style.display="none";

    launchBulletReader();
  }

  function startHandler(){
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

  $buttonBack.addEventListener('click', function () {
    onPause();
    if(currentIndex-1>=0){
      changeWord(words,--currentIndex);
    }
  });

  $buttonForward.addEventListener('click', function () {
    onPause();
    if(currentIndex+1<words.length){
      changeWord(words,++currentIndex);
    }
  });

  window.addEventListener("wheel", (event) => {
    $speedInput.value-=parseInt(event.wheelDelta/10);
    speed = $speedInput.value;
    changeWord(words,currentIndex);
  });

  document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    switch(keyName){
      case " ":
        startHandler();
        break;
    }
  });

  ipcRenderer.on('getFile', (event, arg) => {
    words = arg;
    $buttonStart.style.display="";
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

  function changeWord(words,index){
    if(words!==null && index>=0 && index<words.length){
      $textContainer.innerText = words[index];
      $pageNumberSpan.innerText = (index+1)+"/"+words.length;
      $infoReaderSpan.innerText = "At this speed rate it should take you "+calculateTimeLeft(words,index)+"to read the whole document";
    }
  }

})()
