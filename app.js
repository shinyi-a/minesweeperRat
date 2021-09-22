$(()=>{  
    minefield(99);

    $('.tile').mousedown(function(event){
        if(event.which == 3)
        {
              alert("right mouse click");
              addMouse();
        }
        if(event.which == 1)
        {
              alert("left mouse click");
        }
    });
})





//add game board
let minefield = (num) => {
    for (let i=0;i<num;i++) {
        const $tile=$('<div>').addClass('tile').attr('id', `tile-${i}`);
        $('.container').append($tile);
    }
}

//add flag
let addMouse = () => {
    $('.tile').html('🐀');
}
