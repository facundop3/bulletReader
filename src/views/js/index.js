(function(){
  const { ipcRenderer } = require('electron'),
        $textContainer = document.getElementById("reader-text"),
        $speedInput = document.getElementById("speedRange"),
        $buttonStart = document.getElementById("actionStart"),
        $buttonStop = document.getElementById("actionStop"),
        $buttonLoadFile = document.getElementById("actionLoad"),
        $loadFileInput = document.getElementById("loadFile");
  let   playing = false,
        words = null;

  let speed = $speedInput.value

  $speedInput.addEventListener('change', function () {
    speed = this.value
  })

  $buttonStart.addEventListener('click', function () {
    const status = this.getAttribute("data-status");
    switch(status){
      case "start":
        this.setAttribute("data-status","pause");
        this.textContent="Pause";
        playing=true;
        $buttonStop.style.display="";
        bulletRead(words);
        break;
      case "pause":
        this.setAttribute("data-status","resume");
        this.textContent="Resume";
        playing=false;
        break;
      case "resume":
        this.setAttribute("data-status","pause");
        this.textContent="Pause";
        playing=true;
        bulletRead(words);
        break;
      default:
        console.log(status);
        break;
    }
  });

  $loadFileInput.addEventListener("change",function () {
    console.log(this.files[0].path);
    ipcRenderer.send('loadFile', this.files[0].path)
  });

  $buttonLoadFile.addEventListener('click', function () {
    $loadFileInput.click();
  });

  $buttonStop.addEventListener('click', function () {
    $buttonStart.setAttribute("data-status","start");
    $buttonStart.textContent="Start";
    playing=false;
    words=null;
    this.style.display="none";
  });

  window.addEventListener("wheel", (event) => {
    $speedInput.value-=parseInt(event.wheelDelta/10);
    speed = $speedInput.value;
  });
  ipcRenderer.on('getFile', (event, arg) => {
    words = nextWord(arg);
    $buttonStart.style.display="";
  })


  function* nextWord(wordsList){
    yield* wordsList
  }
  function bulletRead(words){
    if(playing){
      const {done, value} = words.next()
      if(done) return
      $textContainer.innerText = value
      setTimeout(()=>{
        return bulletRead(words)
      }, speed)
    }
  }

})()
