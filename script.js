// ==============================
//  CONTROL DE SECCIONES (SIDEBAR)
// ==============================

// Todas las secciones dentro de <main>
const sections = document.querySelectorAll("main > section");

// Todos los ítems del menú que tienen data-content
const menuItems = document.querySelectorAll(".menu li[data-content]");

// Muestra solo la sección con el id dado y oculta las demás
function showSection(id) {
  sections.forEach(sec => {
    if (sec.id === id) {
      sec.classList.remove("hidden");
    } else {
      sec.classList.add("hidden");
    }
  });
}

// Al cargar la página, mostrar la sección "home"
showSection("home");

// Manejar clicks en el menú lateral
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const key = item.dataset.content;
    if (!key) return;

    // Mostrar solo la sección correspondiente
    showSection(key);

    // (Opcional) marcar el botón activo en el sidebar
    menuItems.forEach(li => {
      li.classList.toggle("active", li === item);
    });
  });
});


// ==============================
//  DRAG & DROP PARA EXCEL
// ==============================

// Selecciona todas las zonas de drop
const dropzones = document.querySelectorAll(".dropzone");

dropzones.forEach(zone => {
  // Busca el input file dentro de esa zona (por clase o por tipo)
  const fileInput = zone.querySelector(".fileInput") || zone.querySelector('input[type="file"]');
  const fileInfo = zone.querySelector(".fileInfo");

  // Auxiliar function to show the files in the front

  function showFileInfo(files){
    if (!fileInfo || !file) return;
    const sizeInKB = (files[0].size / 1024).toFixed(2);
    fileInfo.textContent = `Selected file: ${files[0].name} (${sizeInKB} KB)`;
  }

  // Si el usuario hace clic en el recuadro, abrimos el selector de archivo
  zone.addEventListener("click", () => {
    if (fileInput) {
      fileInput.click();
    }
  });

  // Arrastrar encima del recuadro
  zone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Necesario para permitir drop
    zone.style.background = "#8d1212ff";
  });

  // Cuando el archivo sale de la zona sin soltarse
  zone.addEventListener("dragleave", () => {
    zone.style.background = "#c73838ff";
  });

  // Cuando se suelta el archivo encima
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.style.background = "#b30707ff";

    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);

    // Si quieres que el input también “tenga” esos archivos:
    if (fileInput) {
      fileInput.files = files;
    }

    // Aquí podrías llamar a otra función para procesar el Excel
    // por ejemplo: handleExcel(files[0]);
  });

  // Si el usuario NO arrastra, sino que selecciona desde el explorador
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const files = fileInput.files;
      console.log("Selected files:", files);
      // handleExcel(files[0]);
    });
  }
});


// ==============================
//  CONNECTION WITH FASTAPI
// ==============================

async function sendFileToBackend(url, file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error("Error with the server response");
    }

    const data = await response.json();
    console.log("Backend Reply", data);
    alert(`✅ Backend replied: ${data.message || "OK"}`);
  } catch (err) {
    console.error(err);
    alert("❌ An error occurred while calling the backend.");
  }
}

// ==============================
//  UNIT CREATION BUTTON
// ==============================

const unitCreationSection = document.getElementById("unit-creation");
const createUnitButton = unitCreationSection.querySelector(".btn");
const unitFileInput = unitCreationSection.querySelector('.fileInput');

createUnitButton.addEventListener("click", async() => {
  const file = unitFileInput.files[0];
  if (!file) {
    alert("Please select an Excel file first.");
    return;
  }

  await sendFileToBackend("http://127.0.0.1:8000", file);

});


// ==============================
//  UPDATE ATTRIBUTES BUTTON
// ==============================

const updateAttributesSection = document.getElementById("update-attributes");
const updateAttributesButton = updateAttributesSection.querySelector(".btn");
const attributesFileInput = updateAttributesSection.querySelector('.fileInput');

updateAttributesButton.addEventListener("click", async() => {
  const file = attributesFileInput.files[0];
  if (!file) {
    alert("Please select an Excel file first.");
    return;
  }

  await sendFileToBackend("http://127.0.0.1:8000/import-units", file);
});