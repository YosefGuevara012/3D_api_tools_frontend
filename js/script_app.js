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

//  Selects all dropzones
const dropzones = document.querySelectorAll(".dropzone");

dropzones.forEach(zone => {
  // Search for the file input inside that zone (by class or by type)
  const fileInput = zone.querySelector(".fileInput") || zone.querySelector('input[type="file"]');
  const fileInfo = zone.querySelector(".fileInfo");

  // Auxiliar function to show the files in the front

  function showFileInfo(files){
    if (!fileInfo || !files) return;
    const sizeInKB = (files[0].size / 1024).toFixed(2);
    fileInfo.textContent = `Selected file: ${files[0].name} (${sizeInKB} KB)`;
  }

  // If the user clicks the dropzone, open the file selector
  zone.addEventListener("click", () => {
    if (fileInput) {
      fileInput.click();
    }
  });

  // Drag & Drop over the dropzone
  zone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Necesario para permitir drop
    zone.style.background = "#ce4747ff";
  });

  // Cuando el archivo sale de la zona sin soltarse
  zone.addEventListener("dragleave", () => {
    zone.style.background = "#4840bbff";
  });

  // Cuando se suelta el archivo encima
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.style.background = "#1bb307ff";

    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);

    // Si quieres que el input también “tenga” esos archivos:
    if (fileInput) {
      fileInput.files = files;
    }

    showFileInfo(files);
  });

  // Si el usuario NO arrastra, sino que selecciona desde el explorador
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const files = fileInput.files;
      console.log("Selected files:", files);
      showFileInfo(files);
    });
  }
});


// ==============================
//  TEST BACKEND CONNECTION
// ==============================

const testBtn = document.getElementById("test-backend-btn");
const testResult = document.getElementById("test-backend-result");

if (testBtn) {
  testBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ping");
      const data = await res.json();
      console.log("Ping replies:", data);
      testResult.textContent = `Backend says: ${data.message}`;
    } catch (err) {
      console.error(err);
      testResult.textContent = "Error to connect to the backend😢";
    }
  });
}

// ==============================
//  3DTRACKING LOGIN
// ==============================

const loginBtn = document.getElementById("login-3dtracking-btn");
const loginResult = document.getElementById("login-3dtracking-result");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // 1️⃣ Validar que el usuario haya escrito algo
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      loginResult.textContent = "Please enter both username and password.";
      return;
    }

    loginResult.textContent = "Logging in...";

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error:", errorData);
        loginResult.textContent =
          "Login failed. Please check your credentials.";
        return;
      }

      const data = await response.json();
      console.log("Login response:", data);

      // Aquí puedes guardar user_id y session_id si los necesitas después
      // loginResult.textContent = `✅ Login successful. UserId: ${data.user_id}`;
      loginResult.textContent = `✅ Login successful.`;
    } catch (err) {
      console.error(err);
      loginResult.textContent =
        "❌ Error connecting to backend. Is the server running?";
    }
  });
}

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

  await sendFileToBackend("http://127.0.0.1:8000/tracker_list", file);

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