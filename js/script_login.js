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

      // Saves session info in localStorage
      localStorage.setItem("session_id", data.session_id);
      localStorage.setItem("user_id", data.user_id);

      // redirect to main app
      window.location.href = "app.html";

      // Aquí puedes guardar user_id y session_id si los necesitas después
      loginResult.textContent = `✅ Login successful. UserId: ${data.user_id}`;
    } catch (err) {
      console.error(err);
      loginResult.textContent =
        "❌ Error connecting to backend. Is the server running?";
    }
  });
}