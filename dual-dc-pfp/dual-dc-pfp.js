var filename = "dualPfp";
var COL_DARK = "#313338";
var COL_LIGHT = "#FFFFFF";
var bg = document.getElementById("background");
var layerDark = document.getElementById("layer0");
var layerDarkCtx = layerDark.getContext("2d");
var layerLight = document.getElementById("layer1");
var layerLightCtx = layerLight.getContext("2d");
var layerUi = document.getElementById("ui");
var layerUiCtx = layerUi.getContext("2d");
//todo: show brush/eraser size on screen when chanign
var isEraserElement = document.getElementById("isEraser");
var showCircleMaskElement = document.getElementById("showCircleMask");
var brushSizeElement = document.getElementById("brushSize");
var eraserSizeElement = document.getElementById("eraserSize");
var filenameFieldElement = document.getElementById("filenameField");
var saveButtonElement = document.getElementById("saveButton");
var cMask = document.getElementById("circle_mask");
var cMaskCtx = cMask.getContext("2d");
var LENGTH = 512;
var focusDark = true; // draw on dark mode (white ink)
var brushSize = 4;
var eraserSize = 16;
layerDarkCtx.imageSmoothingEnabled = false;
layerLightCtx.imageSmoothingEnabled = false;
cMaskCtx.imageSmoothingEnabled = false;
var brushSettings = document.getElementById("brushSettings");
var eraserSettings = document.getElementById("eraserSettings");
var lightSwitch = document.getElementById("isLight");
var eraserSwitch = document.getElementById("isEraser");
var isLight = false;
var isCMaskOn = false;
var isEraser = false;
var undoBtn = document.getElementById("undo");
var redoBtn = document.getElementById("redo");
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
var isDrawing = false;
var lastX = 0;
var lastY = 0;
var canvasHistory = [];
function drawMouse(e, layerCtx) {
    var _a;
    if (!isDrawing) {
        return;
    }
    console.log(e.clientX, e.clientY, e.offsetX, e.offsetY);
    layerCtx.beginPath();
    layerCtx.moveTo(lastX, lastY);
    layerCtx.lineTo(e.offsetX, e.offsetY);
    layerCtx.stroke();
    _a = [e.offsetX, e.offsetY], lastX = _a[0], lastY = _a[1];
}
function recordStep(e, layerCtx) {
    var action = {
        type: "switch",
        currentLightMode: "light",
    };
    canvasHistory.push(action);
    console.log(canvasHistory);
}
function undo(e, layerCtx) {
    clearLayer(layerCtx);
    console.log(canvasHistory);
}
layerDark.addEventListener("click", function (e) {
    isDrawing = true;
    drawMouse(e, layerDarkCtx);
    isDrawing = false;
    ditherClear();
});
layerLight.addEventListener("click", function (e) {
    isDrawing = true;
    drawMouse(e, layerLightCtx);
    isDrawing = false;
    ditherClear();
});
layerDark.addEventListener("mousedown", function (e) {
    var _a;
    isDrawing = true;
    _a = [e.offsetX, e.offsetY], lastX = _a[0], lastY = _a[1];
    //console.log(lastX, lastY);
});
layerDark.addEventListener("mouseup", function (e) {
    isDrawing = false;
    recordStep(e, layerDarkCtx);
});
layerLight.addEventListener("mouseup", function (e) {
    isDrawing = false;
    recordStep(e, layerLightCtx);
});
layerDark.addEventListener("mousemove", function (e) {
    drawMouse(e, layerDarkCtx);
});
layerLight.addEventListener("mousemove", function (e) {
    drawMouse(e, layerLightCtx);
});
layerDark.addEventListener("mouseenter", function (e) {
    var _a;
    if (e.buttons == 1) {
        isDrawing = true;
        _a = [e.offsetX, e.offsetY], lastX = _a[0], lastY = _a[1];
    }
    else {
        isDrawing = false;
    }
});
layerDark.addEventListener("mouseleave", function (e) {
    //todo set the mouse coords to snap to wall if left too fast
    isDrawing = false;
    //console.log(lastX-e.offsetX, lastY-e.offsetY)
});
layerLight.addEventListener("mouseleave", function () {
    isDrawing = false;
});
//dither///////////////////////////////////////////////////////////////////////
function ditherClear() {
    var layerDarkData = layerDarkCtx.getImageData(0, 0, LENGTH, LENGTH);
    var layerLightData = layerLightCtx.getImageData(0, 0, LENGTH, LENGTH);
    var i = 0;
    for (var y = 0; y < LENGTH; y++) {
        for (var x = 0; x < LENGTH; x++) {
            var data = layerDarkData.data;
            //console.log(data[i],data[i+1],data[i+2],data[i+3]);
            if ((x + y) % 2 == 0) {
                var i_1 = 4 * (x + LENGTH * y);
                /*data[i] = 255;
                  data[i+1] = 255;
                  data[i+2] = 255;*/
                data[i_1 + 3] = 0;
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
function setEraser(isErase) {
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
    }
    else {
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
isEraserElement.addEventListener("click", function () {
    isEraser = isEraserElement.checked;
    setEraser(isEraser);
});
function clearLayer(layerCtx) {
    layerCtx.clearRect(0, 0, LENGTH, LENGTH);
}
//show circle mask
function setCircleMask(isOn) {
    if (isOn) {
        console.log("show mask");
        cMaskCtx.fillStyle = "rgba(0, 0, 0, .3)";
        cMaskCtx.fillRect(0, 0, LENGTH, LENGTH);
        cMaskCtx.beginPath();
        cMaskCtx.arc(255, 255, 255, 0, Math.PI * 2);
        cMaskCtx.clip();
        cMaskCtx.clearRect(0, 0, LENGTH, LENGTH);
    }
    else {
        cMaskCtx.clearRect(0, 0, 999999, 9999);
        //todo doesnt work ^^^
        console.log("hide mask");
    }
}
showCircleMaskElement.addEventListener("click", function () {
    isCMaskOn = showCircleMaskElement.checked;
    setCircleMask(isCMaskOn);
});
//switch mode
function setLight(isOn) {
    if (isOn) {
        console.log("change from dark to light bg");
        bg.style.backgroundColor = COL_LIGHT;
        //bg.removeClass("dark").addClass("light");
        //layerLight.style.display="block";
        //layerDark.style.display="none";
        layerLight.style.zIndex = "2";
        layerDark.style.zIndex = "1";
    }
    else {
        console.log("change from light to dark bg");
        bg.style.backgroundColor = COL_DARK;
        //bg.removeClass("light").addClass("dark");
        //layerLight.style.display="none";
        //layerDark.style.display="block";
        layerLight.style.zIndex = "1";
        layerDark.style.zIndex = "2";
    }
}
lightSwitch.addEventListener("click", function () {
    isLight = lightSwitch.checked;
    setLight(isLight);
});
// history
undoBtn.addEventListener("click", function (e) {
    if (isLight) {
        undo(e, layerLightCtx);
    }
    else {
        undo(e, layerDarkCtx);
    }
});
//change size
brushSizeElement.addEventListener("change", function () {
    brushSize = parseInt(brushSizeElement.value);
    layerDarkCtx.lineWidth = brushSize;
    layerLightCtx.lineWidth = brushSize;
    console.log("change brush size to", brushSize);
});
eraserSizeElement.addEventListener("change", function () {
    //Yes i have to write this twice for clarity
    eraserSize = parseInt(eraserSizeElement.value);
    layerDarkCtx.lineWidth = eraserSize;
    layerLightCtx.lineWidth = eraserSize;
    console.log("change eraser size to", eraserSize);
});
filenameFieldElement.addEventListener("change", function () {
    filename = filenameFieldElement.value;
});
saveButtonElement.addEventListener("click", function () {
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
document.querySelectorAll("input[type=checkbox]").forEach(function (checkbox) {
    checkbox.checked = false;
});
document.querySelectorAll("canvas").forEach(function (canvas) {
    canvas.width = LENGTH;
    canvas.height = LENGTH;
});
console.log("wake me up inside");
setEraser(false);
