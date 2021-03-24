document.addEventListener("DOMContentLoaded", () => {
    const info = document.getElementsByClassName("info")[0];

    document.addEventListener("click", () => {
        info.style.backgroundColor = "red";
    });
});