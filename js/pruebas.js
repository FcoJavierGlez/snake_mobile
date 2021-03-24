document.addEventListener("DOMContentLoaded", () => {
    const info = document.getElementsByClassName("info")[0];

    document.addEventListener("click", e => {
        /* console.log(`Ancho: ${e.pageX}`);
        console.log(`Alto: ${e.pageY}`); */
        if (e.pageY < outerHeight * 0.3 || e.pageY > outerHeight * 0.6) 
            info.style.backgroundColor = e.pageY < outerHeight * 0.3 ? "red" : "blue";
        else
            info.style.backgroundColor = e.pageX < outerWidth * 0.5 ? "green" : "yellow";
    });
});