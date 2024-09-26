let filename="dualPfp"
const COL_DARK = "#313338";
const COL_LIGHT = "#FFFFFF";

const layerDark = document.getElementById("layer0")
const layerDarkCtx = layerDark.getContext("2d");

const layerLight = document.getElementById("layer1");
const layerLightCtx = layerLight.getContext("2d");

const layerUi = document.getElementById("ui");
const layerUiCtx = layerUi.getContext("2d");
//todo: show brush/eraser size on screen when chanign

const cMask = document.getElementById("circle_mask").getContext("2d");
const LENGTH = 512;
let focusDark = true; // draw on dark mode (white ink)
let brushSize = 4; 
let eraserSize = 16;
//const brushDark = new PxBrush(l0); // brush FOR dark mode, so it's white
cMask.imageSmoothingEnabled= false;

//init size///////////////////
$("#background").width(LENGTH);
$("#background").height(LENGTH);
layerUi.width = layerUi.height = layerDark.width = layerDark.height = layerLight.width = layerLight.height = LENGTH;
cMask.canvas.width=cMask.canvas.height = LENGTH;
//drawing//////////////////////////////////////////////////////////////
layerDarkCtx.strokeStyle = COL_LIGHT;
layerDarkCtx.lineJoin = "round";
layerDarkCtx.lineCap = "round";
layerDarkCtx.lineWidth = brushSize;
layerDarkCtx.globalCompositeOperation = 'source-over';

layerLightCtx.strokeStyle = COL_DARK;
layerLightCtx.lineJoin = "round";
layerLightCtx.lineCap = "round";
layerLightCtx.lineWidth = brushSize;
layerLightCtx.globalCompositeOperation = 'source-over';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e,layerCtx) {
  if (!isDrawing) { return; }
  if ($("#isEraser").is(":checked")) {
    //Todo add eraser size, also a better way to change brush size 
    //Eraser settings
    layerDarkCtx.lineWidth = eraserSize;
    layerLightCtx.lineWidth = eraserSize;
    layerCtx.strokeStyle = "rgba(0,0,0,1)" 
    layerCtx.globalCompositeOperation = 'destination-out'//Uh idk it kinda worked lol
    layerLightCtx.globalCompositeOperation = 'destination-out'
  }
  else {
    //Brush settings
    layerDarkCtx.lineWidth = brushSize;
    layerLightCtx.lineWidth = brushSize;
    layerDarkCtx.strokeStyle = "#FFFFFF";
    layerLightCtx.strokeStyle = "#2F3136";
    layerDarkCtx.globalCompositeOperation = 'source-over';
    layerLightCtx.globalCompositeOperation = 'source-over';
  }
  layerCtx.beginPath();
  layerCtx.moveTo(lastX,lastY);
  layerCtx.lineTo(e.offsetX,e.offsetY);
  layerCtx.stroke();
  //console.log(layerCtx);
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

layerDark.addEventListener("click",(e)=>{
  isDrawing=true;
  draw(e,layerDarkCtx);
  isDrawing=false;
  ditherClear();
});
layerDark.addEventListener("mousedown", (e) => {
  isDrawing=true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  //console.log(lastX, lastY);
})
layerDark.addEventListener("mousemove", (e)=> {draw(e,layerDarkCtx);});
layerDark.addEventListener("mouseup",() => {
  isDrawing=false;
})
layerDark.addEventListener("mouseleave",() => {
  isDrawing=false;
  ditherClear();
})

layerLight.addEventListener("click",(e)=>{
  isDrawing=true;
  draw(e,layerLightCtx);
  isDrawing=false;
  ditherClear();
});
layerLight.addEventListener("mousedown", (e) => {
  isDrawing=true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  //console.log(lastX, lastY);
})
layerLight.addEventListener("mousemove", (e)=> {draw(e,layerLightCtx)});
layerLight.addEventListener("mouseup",() => {
  isDrawing=false;
})
layerLight.addEventListener("mouseleave",() => {
  isDrawing=false;
  ditherClear();
})

//dither///////////////////////////////////////////////////////////////////////
function ditherClear() {
  let layerDarkData = layerDarkCtx.getImageData(0,0,LENGTH,LENGTH);
  let layerLightData = layerLightCtx.getImageData(0,0,LENGTH,LENGTH);
  
  for(let y=0;y<LENGTH;y++) {
    for(let x=0;x<LENGTH;x++)
      {
        let data = layerDarkData.data;
        //console.log(data[i],data[i+1],data[i+2],data[i+3]);
        if((x+y)%2 == 0)
        {
          let i = 4*(x+LENGTH*y)
          /*data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;*/
          data[i+3] = 0;
        }
        data = layerLightData.data;
        if((x+y)%2 == 1)
          {
            i = 4*(x+LENGTH*y)
            /*data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;*/
            data[i+3] = 0;
          }
      }
  }
  layerDarkCtx.putImageData(layerDarkData,0,0);
  layerLightCtx.putImageData(layerLightData,0,0);
  console.log("dither clear");
}

layerDark.addEventListener("mouseup",ditherClear);
layerLight.addEventListener("mouseup",ditherClear);

//buttons/////////////////////////////////////////////////////////////////////
function clearLayer(layer,layerCtx) {
  layerCtx.clearRect(0,0,LENGTH,LENGTH);
}
function drawCircleMask() {
    if($("#show_circle_mask").is(":checked")) {
      console.log("show mask");
      cMask.fillStyle = "rgba(0, 0, 0, .3)";
      cMask.fillRect(0,0,LENGTH,LENGTH)

      cMask.beginPath();
      cMask.arc(255,255,255,0,Math.PI*2); 
      cMask.clip();

      cMask.clearRect(0,0,LENGTH,LENGTH);

    }
    else {
      console.log("hide mask");
      cMask.clearRect(0,0,LENGTH,LENGTH);
    }
    
}
function switchMode() {
  const bg = $("#background");
  if ($('#is_light').is(":checked")){
    console.log("change from dark to light bg");
    bg.css("background-color",COL_LIGHT);
    //bg.removeClass("dark").addClass("light");
    focusDark=true;
    //layerLight.style.display="block";
    //layerDark.style.display="none";
    layerLight.style.zIndex="2";
    layerDark.style.zIndex="1";
  }
  else {
    console.log("change from light to dark bg");
    bg.css("background-color",COL_DARK);
    //bg.removeClass("light").addClass("dark");
    //layerLight.style.display="none";
    //layerDark.style.display="block";
    layerLight.style.zIndex="1";
    layerDark.style.zIndex="2";
  }
  
}
function changeBrushSize() {
  brushSize = $("#brush_size").val();
  console.log("change brush size to", brushSize);
}
function changeEraserSize() {
  //Yes i have to write this twice for clarity
  eraserSize = $("#eraser_size").val();
  console.log(eraserSize);
}
function nameFile() {
  filename = $("#filename").val();
}
function saveImage() {
  // use UI layer as a placeholder :p
  //layerUiCtx.globalCompositeOperation = "destination-atop";
  // todo: save image with both layers
  let darkBitmap = createImageBitmap(layerDarkCtx);
  let lightBitmap = createImageBitmap(layerLightCtx);

  //idk how to use drawimage anymoer
  /*layerUiCtx.drawImage(darkBitmap,0,0);
  layerUiCtx.drawImage(lightBitmap,0,0);*/

  layerUiCtx.putImageData(layerDarkCtx.getImageData(0,0,LENGTH,LENGTH),0,0);

  let canvasUrl = layerUi.toDataURL("image/png");
  const urlA = document.createElement('a');
  urlA.href = canvasUrl;
  urlA.download = filename;
  //urlA.click();
  window.open(urlA, '_blank').focus();
  urlA.remove();
  layerUiCtx.clearRect(0,0,LENGTH,LENGTH);
}
////////////////////defaults unchecked boxes, TODO implement cookies?///////////////
$(".dark").css("background-color",COL_DARK);
$(".light").css("background-color",COL_LIGHT);

$(":checkbox").prop('checked', false);
$("#brush_size").val(brushSize.toString());
$("#eraser_size").val(eraserSize.toString());
$("#filename").val(filename);