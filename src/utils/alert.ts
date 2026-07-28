export function showAlert(message: string, type: "error" | "success" = "error") {
  const existingAlert = document.getElementById("custom-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.id = "custom-alert";
  alert.style.position = "fixed";
  alert.style.top = "20px";
  alert.style.right = "20px";
  alert.style.zIndex = "1000";
  alert.style.maxWidth = "320px";
  alert.style.padding = "20px 22px";
  alert.style.borderRadius = "12px";
  alert.style.background = type === "error" ? "rgba(172, 63, 63, 0.95)" : "rgba(22, 163, 74, 0.95)";
  alert.style.color = "#fff";
  alert.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25)";
  alert.style.fontFamily = "sans-serif";
  alert.style.fontSize = "15px";
  alert.innerHTML = `<strong>${type === "error" ? "" : "Success"}</strong> ${message}`;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 2000);
}