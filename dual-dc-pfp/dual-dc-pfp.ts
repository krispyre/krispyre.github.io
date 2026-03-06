let filename = "dualPfp";
const COL_DARK = "#313338";
const COL_LIGHT = "#FFFFFF";

const bg = document.getElementById("background");

const layerDark = document.getElementById("layer0") as HTMLCanvasElement;
const layerDarkCtx = layerDark.getContext("2d");

const layerLight = document.getElementById("layer1") as HTMLCanvasElement;
const layerLightCtx = layerLight.getContext("2d");

const layerUi = document.getElementById("ui") as HTMLCanvasElement;
const layerUiCtx = layerUi.getContext("2d");
//todo: show brush/eraser size on screen when chanign

const isEraserElement = document.getElementById("isEraser") as HTMLInputElement;
const showCircleMaskElement = document.getElementById(
  "showCircleMask",
) as HTMLInputElement;
const brushSizeElement = document.getElementById(
  "brushSize",
) as HTMLInputElement;
const eraserSizeElement = document.getElementById(
  "eraserSize",
) as HTMLInputElement;
const filenameFieldElement = document.getElementById(
  "filenameField",
) as HTMLInputElement;
const saveButtonElement = document.getElementById(
  "saveButton",
) as HTMLInputElement;

const cMask = document.getElementById("circle_mask") as HTMLCanvasElement;
const cMaskCtx = cMask.getContext("2d");
const LENGTH = 512;
let focusDark = true; // draw on dark mode (white ink)
let brushSize = 4;
let eraserSize = 16;

layerDarkCtx.imageSmoothingEnabled = false;
layerLightCtx.imageSmoothingEnabled = false;
cMaskCtx.imageSmoothingEnabled = false;

const brushSettings = document.getElementById("brushSettings");
const eraserSettings = document.getElementById("eraserSettings");
const lightSwitch = document.getElementById("isLight") as HTMLInputElement;
const eraserSwitch = document.getElementById("isEraser") as HTMLInputElement;
let isLight = false;
let isCMaskOn = false;
let isEraser = false;

const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");

//drawing//////////////////////////////////////////////////////////////
layerDarkCtx.strokeStyle = COL_LIGHT;
layerDarkCtx.lineJoin = "round";
layerDarkCtx.lineCap = "round";
layerDarkCtx.lineWidth = brushSize;
layerDarkCtx.globalCompositeOperation = "source-over";

layerLightCtx.strokeStyle = COL_DARK;
layerLightCtx.lineJoin = "round";
layerLightCtx.lineCap = "round";
layerLightCtx.lineWidth = brushSize;
layerLightCtx.globalCompositeOperation = "source-over";

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let canvasHistory = [];
function drawMouse(e: MouseEvent, layerCtx: CanvasRenderingContext2D) {
  if (!isDrawing) {
    return;
  }
  console.log(e.clientX, e.clientY, e.offsetX, e.offsetY);

  layerCtx.beginPath();
  layerCtx.moveTo(lastX, lastY);
  layerCtx.lineTo(e.offsetX, e.offsetY);

  layerCtx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}
function recordStep(e: MouseEvent, layerCtx: CanvasRenderingContext2D) {
  const action: CanvasAction = {
    type: "switch",
    currentLightMode: "light",
  };
  canvasHistory.push(action);

  console.log(canvasHistory);
}

function undo(e: MouseEvent, layerCtx: CanvasRenderingContext2D) {
  clearLayer(layerCtx);
  console.log(canvasHistory);
}

layerDark.addEventListener("click", (e) => {
  isDrawing = true;
  drawMouse(e, layerDarkCtx);
  isDrawing = false;
  ditherClear();
});
layerLight.addEventListener("click", (e) => {
  isDrawing = true;
  drawMouse(e, layerLightCtx);
  isDrawing = false;
  ditherClear();
});
layerDark.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  //console.log(lastX, lastY);
});
layerDark.addEventListener("mouseup", (e) => {
  isDrawing = false;
  recordStep(e, layerDarkCtx);
});
layerLight.addEventListener("mouseup", (e) => {
  isDrawing = false;
  recordStep(e, layerLightCtx);
});

layerDark.addEventListener("mousemove", (e) => {
  drawMouse(e, layerDarkCtx);
});
layerLight.addEventListener("mousemove", (e) => {
  drawMouse(e, layerLightCtx);
});

layerDark.addEventListener("mouseenter", (e) => {
  if (e.buttons == 1) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  } else {
    isDrawing = false;
  }
});
layerDark.addEventListener("mouseleave", (e) => {
  //todo set the mouse coords to snap to wall if left too fast
  isDrawing = false;
  //console.log(lastX-e.offsetX, lastY-e.offsetY)
});

layerLight.addEventListener("mouseleave", () => {
  isDrawing = false;
});
//dither///////////////////////////////////////////////////////////////////////
function ditherClear() {
  let layerDarkData = layerDarkCtx.getImageData(0, 0, LENGTH, LENGTH);
  let layerLightData = layerLightCtx.getImageData(0, 0, LENGTH, LENGTH);
  let i = 0;

  for (let y = 0; y < LENGTH; y++) {
    for (let x = 0; x < LENGTH; x++) {
      let data = layerDarkData.data;
      //console.log(data[i],data[i+1],data[i+2],data[i+3]);
      if ((x + y) % 2 == 0) {
        let i = 4 * (x + LENGTH * y);
        /*data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;*/
        data[i + 3] = 0;
      }
      data = layerLightData.data;
      if ((x + y) % 2 == 1) {
        i = 4 * (x + LENGTH * y);
        /*data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;*/
        data[i + 3] = 0;
      }
    }
  }
  layerDarkCtx.putImageData(layerDarkData, 0, 0);
  layerLightCtx.putImageData(layerLightData, 0, 0);
  console.log("dither clear");
}

layerDark.addEventListener("mouseup", ditherClear);
layerLight.addEventListener("mouseup", ditherClear);

//buttons/////////////////////////////////////////////////////////////////////

function setEraser(isErase: boolean) {
  if (isErase) {
    //Todo add eraser size, also a better way to change brush size
    //Eraser settings
    layerDarkCtx.lineWidth = eraserSize;
    layerLightCtx.lineWidth = eraserSize;
    layerDarkCtx.strokeStyle = "rgba(0,0,0,1)";
    layerLightCtx.strokeStyle = "rgba(0,0,0,1)";
    layerDarkCtx.globalCompositeOperation = "destination-out";
    layerLightCtx.globalCompositeOperation = "destination-out"; //Uh idk it kinda worked lol
    brushSettings.style.display = "none";
    eraserSettings.style.display = "block";
  } else {
    //Brush settings
    layerDarkCtx.lineWidth = brushSize;
    layerLightCtx.lineWidth = brushSize;
    layerDarkCtx.strokeStyle = COL_LIGHT;
    layerLightCtx.strokeStyle = COL_DARK;
    layerDarkCtx.globalCompositeOperation = "source-over";
    layerLightCtx.globalCompositeOperation = "source-over";
    brushSettings.style.display = "block";
    eraserSettings.style.display = "none";
  }
}

isEraserElement.addEventListener("click", () => {
  isEraser = isEraserElement.checked;
  setEraser(isEraser);
});

function clearLayer(layerCtx: CanvasRenderingContext2D) {
  layerCtx.clearRect(0, 0, LENGTH, LENGTH);
}
//show circle mask
function setCircleMask(isOn: boolean) {
  if (isOn) {
    console.log("show mask");
    cMaskCtx.fillStyle = "rgba(0, 0, 0, .3)";
    cMaskCtx.fillRect(0, 0, LENGTH, LENGTH);

    cMaskCtx.beginPath();
    cMaskCtx.arc(255, 255, 255, 0, Math.PI * 2);
    cMaskCtx.clip();

    cMaskCtx.clearRect(0, 0, LENGTH, LENGTH);
  } else {
    cMaskCtx.clearRect(0, 0, 999999, 9999);
    //todo doesnt work ^^^
    console.log("hide mask");
  }
}
showCircleMaskElement.addEventListener("click", () => {
  isCMaskOn = showCircleMaskElement.checked;
  setCircleMask(isCMaskOn);
});

//switch mode
function setLight(isOn: boolean) {
  if (isOn) {
    console.log("change from dark to light bg");
    bg.style.backgroundColor = COL_LIGHT;
    //bg.removeClass("dark").addClass("light");
    //layerLight.style.display="block";
    //layerDark.style.display="none";
    layerLight.style.zIndex = "2";
    layerDark.style.zIndex = "1";
  } else {
    console.log("change from light to dark bg");
    bg.style.backgroundColor = COL_DARK;
    //bg.removeClass("light").addClass("dark");
    //layerLight.style.display="none";
    //layerDark.style.display="block";
    layerLight.style.zIndex = "1";
    layerDark.style.zIndex = "2";
  }
}

lightSwitch.addEventListener("click", () => {
  isLight = lightSwitch.checked;
  setLight(isLight);
});

// history
undoBtn.addEventListener("click", (e) => {
  if (isLight) {
    undo(e, layerLightCtx);
  } else {
    undo(e, layerDarkCtx);
  }
});

//change size
brushSizeElement.addEventListener("change", () => {
  brushSize = parseInt(brushSizeElement.value);
  layerDarkCtx.lineWidth = brushSize;
  layerLightCtx.lineWidth = brushSize;
  console.log("change brush size to", brushSize);
});
eraserSizeElement.addEventListener("change", () => {
  //Yes i have to write this twice for clarity
  eraserSize = parseInt(eraserSizeElement.value);
  layerDarkCtx.lineWidth = eraserSize;
  layerLightCtx.lineWidth = eraserSize;
  console.log("change eraser size to", eraserSize);
});
filenameFieldElement.addEventListener("change", () => {
  filename = filenameFieldElement.value;
});
saveButtonElement.addEventListener("click", () => {
  // use UI layer as a placeholder :p
  //layerUiCtx.globalCompositeOperation = "destination-atop";
  // todo: save image with both layers
});
////////////////////defaults, TODO implement cookies?///////////////////////////////////////////
/*
$(":checkbox").prop("checked", false);
$("#brushSize").val(brushSize.toString());
$("#eraserSettings").hide();
$("#eraserSize").val(eraserSize.toString());
$("#filename").val(filename);
*/
bg.style.backgroundColor = COL_DARK;
document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
  (checkbox as HTMLInputElement).checked = false;
});

document.querySelectorAll("canvas").forEach((canvas) => {
  canvas.width = LENGTH;
  canvas.height = LENGTH;
});

console.log("wake me up inside");

setEraser(false);
