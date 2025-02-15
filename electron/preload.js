window.addEventListener("DOMContentLoaded", () => {
    console.log("Preload script ejecutado");

    // Cambiar el color del body segun el tema (claro/oscuro)
    const body = document.querySelector("body");
    // Si no hay tema guardado, se establece el tema oscuro por defecto
    const tema = localStorage.getItem("tema") || "oscuro";
    // guardar el tema en localStorage
    localStorage.setItem("tema", tema);

    body.classList.add("transition-all", "duration-300");
});