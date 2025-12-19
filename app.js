(() => {
  "use strict";

  const input = document.getElementById("inputText");
  const output = document.getElementById("outputText");
  const status = document.getElementById("status");

  const renderBtn = document.getElementById("renderBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");

  let fontReady = false;

  // Font readiness check (no assumptions)
  document.fonts.ready
    .then(() => {
      if (document.fonts.check("16px SansForgetica")) {
        fontReady = true;
        status.textContent = "Sans Forgetica loaded successfully.";
      } else {
        status.textContent =
          "Sans Forgetica not available. Using fallback font.";
      }
    })
    .catch(() => {
      status.textContent = "Font loading failed. Fallback in use.";
    });

  function safeRender() {
    const text = input.value;

    if (!text) {
      status.textContent = "No input text provided.";
      output.textContent = "";
      return;
    }

    // Hard cap to avoid browser crashes
    if (text.length > 500_000) {
      status.textContent =
        "Input too large. Please reduce text size.";
      return;
    }

    output.textContent = text;
    status.textContent = fontReady
      ? "Rendered using Sans Forgetica."
      : "Rendered using fallback font.";
  }

  renderBtn.addEventListener("click", safeRender);

  clearBtn.addEventListener("click", () => {
    input.value = "";
    output.textContent = "";
    status.textContent = "Cleared.";
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      status.textContent = "Copied to clipboard.";
    } catch {
      status.textContent =
        "Clipboard access denied. Select and copy manually.";
    }
  });

  // Recover safely from tab restore / background resume
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && output.textContent) {
      status.textContent = "Session restored.";
    }
  });
})();
