(function(){

  const $textContainer = document.getElementById("reader-text"),
        $speedInput = document.getElementById("speedRange"),
        words = nextWord(text)
  
  let speed = $speedInput.value
  
  $speedInput.addEventListener('change', function () {
    speed = this.value
  })
  

  bulletRead(words)

  function* nextWord(wordsList){
    yield* wordsList
  }
  function bulletRead(words){
    const {done, value} = words.next()
    if(done) return
    $textContainer.innerText = value 
    setTimeout(()=>{
      return bulletRead(words)
    }, speed)
  }

})()