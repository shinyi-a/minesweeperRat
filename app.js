document.addEventListener('DOMContentLoaded', () => {  
  let gameboard = [];
  let totalbombs = Math.floor(100/8); //total number of bombs in the gameboard
  let rats = 0; //number of rats used in the gameboard
  let gameover = false;
  //timer
  let hr = 0;
  let min = 0;
  let sec = 0;
  let timerStatus = false;
  let t;

  //////////////////////////////////////////////
  //creates the gameboard
  //////////////////////////////////////////////
  let minefield = grids => {
      let ratsleft = document.querySelector('.rat');
      ratsleft.innerHTML=`rats left: ${totalbombs}`;
      //randomise bombs and void tiles. attach as a class to each grid.
      const bombtiles = Array.from({length: totalbombs}, () => 'bomb'); //makes an array of 'bomb', which are grids with bombs
      const voidtiles = Array.from({length: grids-totalbombs}, () => 'void'); //makes an array of 'void', which are grids without bombs
      const alltiles = [...bombtiles, ...voidtiles]; //makes a new array by combining bomb and void tiles
      
      //function to randomise array elememts, Fisher-Yates algorithm
      const shuffleArray = array => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
          return array; //returns new randomised array
        }// end shuffleArray
      const randomtiles = shuffleArray(alltiles); //randomises the bombs and void elements in a new array
  
      //generate x number of grids on the gameboard
      for (let i=0;i<grids;i++) {
          const container = document.querySelector('.container');
          const newtile = document.createElement('div'); //makes a tile
          newtile.id = i; //assigns unique id to each tile
          newtile.classList.add(`${randomtiles[i]}`); //assigns either bomb or void class to the tile
          container.appendChild(newtile);
          gameboard.push(newtile);
  
          //left mouse click event
          newtile.addEventListener('click', function() {
          leftclick(newtile);
          let starttimerleft = document.getElementsByClassName('clicked');
            if (starttimerleft.length === 1) {
              if (gameover===false) {
                startTimer();
              }
            };//end if
          })
  
          //right mouse click event
          newtile.addEventListener('contextmenu', e => {
            e.preventDefault();
            addMouse(newtile);
          });
  
      }//end for
  
      //adding number of surrounding bombs to each tile on the gameboard
      for (let i=0;i<gameboard.length;i++) {
          let bombsaround = 0;
          const leftborder = (i%10 === 0); //this is for a 10x10 gameboard
          const rightborder = (i%10 === 9); //this is for a 10x10 gameboard
      
          //add numbers if tile contains void class
          if (gameboard[i].classList.contains('void')) {
              //checks if the tile directly above contains a bomb class.
              //[x bomb x]
              //[x click x]
              if (i>10 && gameboard[i-10].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on top right corner contains a bomb class.
              //[x x bomb]
              //[x click x]
              if (i>9 && !rightborder && gameboard[i+1-10].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on the right contains a bomb class.
              //[x click bomb]
              if (i<98 && !rightborder && gameboard[i+1].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on the bottom right corner contains a bomb class.
              //[x click x]
              //[x x bomb]
              if (i<88 && !rightborder && gameboard[i+1+10].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile directly below contains a bomb class.
              //[x click x]
              //[x bomb x]
              if (i<89 && gameboard[i+10].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on the bottom left corner contains a bomb class.
              //[x click x]
              //[bomb x x]
              if (i<90 && !leftborder && gameboard[i-1+10].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on the left contains a bomb class.
              //[bomb click x]
              if (i>0 && !leftborder && gameboard[i-1].classList.contains('bomb')) {
                  bombsaround++;
              }
              //checks if the tile on top left corner contains a bomb class.
              //[bomb x x]
              //[x click x]
              if (i>11 && !leftborder && gameboard[i-1-10].classList.contains('bomb')) {
                  bombsaround++;
              }
              gameboard[i].setAttribute('totalbombsaround', bombsaround);
          }//end if gameboard is void class
      }//end for
  }//end of minefield function
  
  minefield(100);//creates gameboard of 100 grids
  
  //////////////////////////////////////////////
  //left click on tile action
  //////////////////////////////////////////////
  let leftclick = clickedgrid => {
      let clickedID = clickedgrid.id;
      clickedID = parseInt(clickedID);
      //exit function if the game is over
      if (gameover) {
        stopTimer();
        return;
      }
  
      //prevent left click if grid is either clicked or contains a rat
      if (clickedgrid.classList.contains('clicked') || clickedgrid.classList.contains('rat')) {
        return;
      }
  
      //checks left clicked tile contains bomb
      if (clickedgrid.classList.contains('bomb')) {
          gameover = true;
          gameboard.forEach(bombgrid => {
              if (bombgrid.classList.contains('bomb')) {
                  bombgrid.classList.add('exploded');
                  bombgrid.innerHTML = '💣';
                  stopTimer();
                  const explodeaudio = document.getElementById('explodeaudio');
                  explodeaudio.play();
                  document.getElementById("gameoverMsg").style.display = 'block';
                      setTimeout(() => {
                      document.getElementById("gameoverMsg").innerHTML = 'You lost! ☠️';
                      document.getElementById("tryagainbtn").style.display = 'block';
                      const losesound = document.getElementById('losesound');
                      losesound.play();
                    }, 1000);
              }
          })
          //if no bomb class
      } else {
          let numbombs = clickedgrid.getAttribute('totalbombsaround');
          if (numbombs !=0) {
              clickedgrid.classList.add('clicked');
              const cleartile = document.getElementById('cleartile');
              cleartile.play();
              clickedgrid.innerHTML = numbombs;
              checkforwin();
              return;
          }
          surroundtile(clickedID);
      }//end else
      clickedgrid.classList.add('clicked');
      const cleartile = document.getElementById('cleartile');
      cleartile.play();
      checkforwin();
  }//end of leftclick function
  
  //////////////////////////////////////////////
  //check for surrounding tiles
  //////////////////////////////////////////////
  let surroundtile = clickedID => {
      const leftborder = (clickedID%10 === 0); //this is for a 10x10 gameboard
      const rightborder = (clickedID%10 === 9); //this is for a 10x10 gameboard
  
      setTimeout(() => {
        if (clickedID>0 && !leftborder) {
          const nextID = gameboard[clickedID-1].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID>9 && !rightborder) {
          const nextID = gameboard[clickedID+1-10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID>10) {
          const nextID = gameboard[clickedID-10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID>11 && !leftborder) {
          const nextID = gameboard[clickedID-1-10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID<98 && !rightborder) {
          const nextID = gameboard[clickedID+1].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID<90 && !leftborder) {
          const nextID = gameboard[clickedID-1+10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID<88 && !rightborder) {
          const nextID = gameboard[clickedID+1+10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
        if (clickedID<89) {
          const nextID = gameboard[clickedID+10].id;
          const nexttile = document.getElementById(nextID);
          leftclick(nexttile);
        }
      }, 0)
    }//end surroundtile function
  
  //////////////////////////////////////////////
  //right click on tile action
  //////////////////////////////////////////////
  let addMouse = clickedgrid => {
    //prevent clicks if the game is over
    if (gameover) {
      return;
    }
    if (!clickedgrid.classList.contains('clicked')) {
      if (!clickedgrid.classList.contains('rat')) {
        clickedgrid.classList.add('rat');
        clickedgrid.innerHTML='🐀';
        const ratsqueak = document.getElementById('ratsqueak');
        ratsqueak.play();
        rats++;
        let ratsleft = document.querySelector('.rat');
        ratsleft.innerHTML=`rats left: ${totalbombs-rats}`;
      } else {
        clickedgrid.classList.remove('rat');
        clickedgrid.innerHTML='';
        ratsqueak.play();
        rats--;
        let ratsleft = document.querySelector('.rat');
        ratsleft.innerHTML=`rats left: ${totalbombs-rats}`;
      }
    }
  }//end of addmouse function
  
  //try again button
  let tryagain = document.getElementById("tryagainbtn");
  tryagain.addEventListener('click', function() {
    window.location.reload();
    })
  
  //check for win here
  let checkforwin = () => {
    let allvoidclicked = document.getElementsByClassName('void clicked');
      if (allvoidclicked.length===100-totalbombs) {
        document.getElementById("gameoverMsg").style.display = 'block';
        stopTimer();
        setTimeout(() => {
        document.getElementById("gameoverMsg").innerHTML = 'You win! 🎉';
        document.getElementById("tryagainbtn").style.display = 'block';
        const winsound = document.getElementById('winsound');
        winsound.play();
      }, 500);
    return;
    }
  }

//////////////////////////////////////////////
//timer
//////////////////////////////////////////////
function startTimer() {
  if (timerStatus === false) {
    timerStatus = true;//toggle timer (turn on)
    timerCycle();
  }
}

function stopTimer() {
  clearTimeout(t);
  timerStatus = false;//toggle timer (turn off)
  //compare with high score
  document.getElementById("highscore").innerHTML = "high score: " + hr + ':' + min + ':' + sec;
}

function timerCycle() {
  sec = parseInt(sec);
  min = parseInt(min);
  hr = parseInt(hr);

  sec = sec + 1; //increase sec 

  //every 60 sec -> 1min
  if (sec === 60) {
    min = min + 1;
    sec = 0;
  }
  //every 60 min -> 1hr
  if (min === 60) {
    hr = hr + 1;
    min = 0;
    sec = 0;
  }

  //formatting (padding with 0s in front of numbers less than 10 for sec,min,hr variable)
  if (sec < 10) {
    sec = '0' + sec;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hr < 10) {
    hr = '0' + hr;
  }

  //update timer text on html
  document.getElementById("timer").innerHTML =  hr + ':' + min + ':' + sec;
  //refresh timer every 1s
  t = setTimeout(timerCycle, 1000);
}//end timer cycle
  
//////////////////////////////////////////////
//highscore storage
//////////////////////////////////////////////
// function checkhighscore() {
//   const localhighscore = JSON.parse(window.localStorage.getItem('highscore'));
//   if (localhighscore<ss) {
  
//   }
//   localStorage.setItem('highscore', 'score');
// }//end checkhighscore

  
//   const score = {
//     hr: hr,
//     min: min,
//     sec: sec
//   }
  
//   //store values
//   window.localStorage.setItem('highscore', JSON.stringify(score))
  
  
  
  
  
  
  
      
  
  
  //background music
  const audio = document.getElementById('bgmusic');
  const audiobtn = document.getElementById('audiobtn');
  audiobtn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
      audiobtn.innerHTML='Music 🎵';
    } else {
      audio.pause();
      audiobtn.innerHTML='Music 🔇';
    }
    })
   
  
  
  
  
  
  
  
  
  
  
  });//end