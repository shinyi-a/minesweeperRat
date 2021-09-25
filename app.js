let gameboard = [];
let numBombs = 20; //number of bombs

//creates the gameboard
let minefield = (grids) => {
    //randomise bombs and void tiles. attach as a class to each grid.
    const bombtiles = Array.from({length: numBombs}, () => 'bomb'); //makes an array of 'bombtile', which are grids with bombs
    const voidtiles = Array.from({length: grids-numBombs}, () => 'void'); //makes an array of 'voidtile', which are grids without bombs
    const alltiles = [...bombtiles, ...voidtiles]; //makes a new array by combining bomb and void tiles
    
    //function to randomise array elememts, Fisher-Yates algorithm
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }
    const randomtiles = shuffleArray(alltiles); //randomise the elements in the array

    //generate x number of grids on the gameboard
    for (let i=0;i<grids;i++) {
        const container = document.querySelector('.container');
        const newtile = document.createElement('div');
        newtile.id = `tile-${i}`; 
        newtile.classList.add(`${randomtiles[i]}`); 
        container.appendChild(newtile);
        gameboard.push(newtile);
    }
}

//add flag
let addMouse = () => {
    $('.tile').html('🐀');
}

//remove flag
let lessMouse = () => {
    $('.tile').html('');
}

document.addEventListener('DOMContentLoaded', () => {  
    minefield(100);

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