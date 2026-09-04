const printableModels = {
  "full-deck": "assets/models/full-deck.glb",
  "powerbank-mount": "assets/models/powerbank-mount.glb",
  "ringstand-open": "assets/models/ringstand-open.glb",
  "hexclips-plus1": "assets/models/hexclips-plus1.glb",
};

const activateModelViewers = () => {
  document.querySelectorAll("model-viewer[data-model-key]").forEach((viewer) => {
    const key = viewer.dataset.modelKey;
    const inlineModel = window.HUNTER_MODEL_DATA?.[key];
    const source = location.protocol === "file:"
      ? `data:model/gltf-binary;base64,${inlineModel || ""}`
      : printableModels[key];

    if (!source || source.endsWith(",")) {
      viewer.closest(".model-stage")?.classList.add("model-unavailable");
      return;
    }

    viewer.setAttribute("src", source);
    viewer.addEventListener("load", () => {
      viewer.closest(".model-stage")?.classList.add("model-loaded");
    }, { once: true });
    viewer.addEventListener("error", () => {
      viewer.closest(".model-stage")?.classList.add("model-unavailable");
    }, { once: true });
  });
};

if (location.protocol === "file:") {
  const dataScript = document.createElement("script");
  dataScript.src = "assets/model-data.js";
  dataScript.addEventListener("load", activateModelViewers, { once: true });
  dataScript.addEventListener("error", activateModelViewers, { once: true });
  document.head.append(dataScript);
} else {
  activateModelViewers();
}
