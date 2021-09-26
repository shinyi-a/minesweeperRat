document.addEventListener('DOMContentLoaded', () => {  
let gameboard = [];
let totalbombs = 20; //total number of bombs in the gameboard

//////////////////////////////////////////////
//creates the gameboard
//////////////////////////////////////////////
let minefield = grids => {
    //randomise bombs and void tiles. attach as a class to each grid.
    const bombtiles = Array.from({length: totalbombs}, () => 'bomb'); //makes an array of 'bombtile', which are grids with bombs
    const voidtiles = Array.from({length: grids-totalbombs}, () => 'void'); //makes an array of 'voidtile', which are grids without bombs
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
        newtile.addEventListener('click', function(e) {
        click(newtile);
    })
    }//end for

    //adding number of surrounding bombs to each tile on the gameboard
    for (let i=0;i<gameboard.length;i++) {
        let bombsaround = 0;
        const leftborder = (i%10 === 0); //this is for a 10x10 gameboard
        const rightborder = (i%10 === 9); //this is for a 10x10 gameboard
    
        //add numbers if tile contains void class
        if (gameboard[i].classList.contains('void')) {
            //checks if the tile on the left contains a bomb class.
            //[bomb click x]
            if (i>0 && !leftborder && gameboard[i-1].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile on top right corner contains a bomb class.
            //[x x bomb]
            //[x click x]
            if (i>9 && !rightborder && gameboard[i+1-10].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile directly above contains a bomb class.
            //[x bomb x]
            //[x click x]
            if (i>10 && gameboard[i-10].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile on top left corner contains a bomb class.
            //[bomb x x]
            //[x click x]
            if (i>11 && !leftborder && gameboard[i-1-10].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile on the right contains a bomb class.
            //[x click bomb]
            if (i<98 && !rightborder && gameboard[i+1].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile on the bottom left corner contains a bomb class.
            //[x click x]
            //[bomb x x]
            if (i<90 && !leftborder && gameboard[i-1+10].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile directly below contains a bomb class.
            //[x click x]
            //[x bomb x]
            if (i<89 && !rightborder && gameboard[i+10].classList.contains('bomb')) {
                bombsaround++;
            }
            //checks if the tile on the bottom right corner contains a bomb class.
            //[x click x]
            //[x x bomb]
            if (i<88 && !rightborder && gameboard[i+1+10].classList.contains('bomb')) {
                bombsaround++;
            }
            gameboard[i].setAttribute('totalbombsaround', bombsaround);
        }//end if gameboard is void class
    }//end for
}//end of minefield function

minefield(100);//creates gameboard of 100 grids

//////////////////////////////////////////////
//click on tile action
//////////////////////////////////////////////
let click = sq => {
    if (sq.classList.contains('bomb')) {
        alert('game over');
        sq.classList.add('exploded');
        sq.innerHTML = '💣';
    } else {
        let total = sq.getAttribute('totalbombsaround');
        if (total !=0) {
            sq.classList.add('clicked');
            sq.innerHTML = total;
            return;
        }
        sq.classList.add('clicked');
    }
}

//////////////////////////////////////////////
//check for surrounding tiles
//////////////////////////////////////////////
// let surround = (clickedID) => {
//     const leftborder = (clickedID%10 === 0); //this is for a 10x10 gameboard
//     const rightborder = (clickedID%10 === 9); //this is for a 10x10 gameboard

//     if (clickedID > 0 && !leftborder) {
//         const clickedID = gameboard[clickedID-1].id;


//     }












// }// end surround function








    //click on bomb
    // $('.tile').mousedown(function(event){
    //     // if(event.which == 3)
    //     // {
    //     //     // if (".tile:contains('🐀')") {
    //     //     //     alert("right mouse click");
    //     //     //     lessMouse();
    //     //     //  } else {
    //     //         alert("right mouse click");
    //     //         addMouse();
    //     //     //  };     
    //     // };
    //     if(event.which == 1)
    //     {
    //         if ($('.tile').hasClass('bomb')) {
    //             alert("game over");
    //         } else {
    //             let number = newtile.getAttribute('data');
    //             if (number !=0) {
    //                 newtile.classList.add('clicked');
    //                 newtile.innerHTML = number;
    //                 return
    //             }
    //             newtile.classList.add('clicked');
    //     }
    //     }//end of left click event
    // });//end of click event
















//add flag
let addMouse = () => {
    $('.bomb').html('🐀');
    $('.void').html('🐀');
}

//remove flag
let lessMouse = () => {
    $('.tile').html('');
}

//win-lose message






    

    // $('.tile').mousedown(function(event){
    //     if(event.which == 3)
    //     {
    //         // if (".tile:contains('🐀')") {
    //         //     alert("right mouse click");
    //         //     lessMouse();
    //         //  } else {
    //             alert("r1ight mouse click");
    //             addMouse();
    //         //  };     
    //     };
    //     if(event.which == 1)
    //     {
    //           alert("left mouse click");
    //     };
    // });
});