document.addEventListener("DOMContentLoaded", () => {
    const boardgame = document.getElementsByClassName("render_boardgame")[0];

    document.addEventListener("click", e => {
        /* console.log(`Ancho: ${e.pageX}`);
        console.log(`Alto: ${e.pageY}`); */
        if (e.pageY < innerHeight * 0.3 || e.pageY > innerHeight * 0.7) 
            boardgame.style.backgroundColor = e.pageY < innerHeight * 0.3 ? "red" : "blue";
        else
            boardgame.style.backgroundColor = e.pageX < innerWidth * 0.5 ? "green" : "yellow";
    });
});