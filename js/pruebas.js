document.addEventListener("DOMContentLoaded", () => {
    const info = document.getElementsByClassName("info")[0];

    document.addEventListener("click", e => {
        console.log(`Ancho: ${e.pageX}`);
        console.log(`Alto: ${e.pageY}`);
        if (e.pageY < innerHeight * 0.3 || e.pageY > innerHeight * 0.7) 
            info.style.backgroundColor = e.pageY < innerHeight * 0.3 ? "red" : "blue";
        else
            info.style.backgroundColor = e.pageX < innerWidth * 0.5 ? "green" : "yellow";
    });
});