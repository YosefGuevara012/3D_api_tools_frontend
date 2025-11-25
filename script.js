const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.background = "#e9e9e9";
});

dropzone.addEventListener("dragleave", () => {
    dropzone.style.background = "#fafafa";
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.background = "#fafafa";

    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);
});
