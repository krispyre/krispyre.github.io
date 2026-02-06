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

const cMaskCtx = document.getElementById("circle_mask").getContext("2d");
const LENGTH = 512;
let focusDark = true; // draw on dark mode (white ink)
let brushSize = 4; 
let eraserSize = 16;

layerDarkCtx.imageSmoothingEnabled= false;
layerLightCtx.imageSmoothingEnabled= false;
cMaskCtx.imageSmoothingEnabled= false;

//init size///////////////////
$("#background").width(LENGTH);
$("#background").height(LENGTH);
layerUi.width = layerUi.height = layerDark.width = layerDark.height = layerLight.width = layerLight.height = LENGTH;
cMaskCtx.canvas.width=cMaskCtx.canvas.height = LENGTH;

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

function drawMouse(e,layerCtx) {
  if (!isDrawing) { return; }
  
  layerCtx.beginPath();
  layerCtx.moveTo(lastX,lastY);
  layerCtx.lineTo(e.offsetX,e.offsetY);
  layerCtx.stroke();
  //console.log(layerCtx);
  [lastX, lastY] = [e.offsetX, e.offsetY];
}
function drawTouch(e,layerCtx) {
  layerCtx.beginPath();
  layerCtx.moveTo(lastX,lastY);
  layerCtx.lineTo(e.touches[0].clientX,e.touches[0].clientY);
  layerCtx.stroke();
  //console.log(layerCtx);
  [lastX, lastY] = [e.touches[0].clientX, e.touches[0].clientY];
}

//imagine mixing plain js and jquery
layerDark.addEventListener("click",(e)=>{
  isDrawing=true;
  drawMouse(e,layerDarkCtx);
  isDrawing=false;
  ditherClear();
});
layerLight.addEventListener("click",(e)=>{
  isDrawing=true;
  drawMouse(e,layerLightCtx);
  isDrawing=false;
  ditherClear();
});
$(document).on("mousedown", ".layerDraw",(e) => {
  isDrawing=true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  //console.log(lastX, lastY);
})
$(document).on("mouseup",".layerDraw",() => {
  isDrawing=false;
})

layerDark.addEventListener("mousemove", (e)=> {
  drawMouse(e,layerDarkCtx);
});
layerLight.addEventListener("mousemove", (e)=> {
  console.log(e.buttons)
  drawMouse(e,layerLightCtx)
});

layerDark.addEventListener("mouseenter",(e)=>{
  if (e.buttons==1){
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  } else {
    isDrawing=false;
  }
  
})
layerDark.addEventListener("mouseleave",(e) => {
  //todo set the mouse coords to snap to wall if left too fast
  isDrawing=false;
  //console.log(lastX-e.offsetX, lastY-e.offsetY)
})

layerLight.addEventListener("mouseleave",() => {
  isDrawing=false;
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

$(document).on("mouseup",".layerDraw",ditherClear);

//buttons/////////////////////////////////////////////////////////////////////
//switch tool
$("#isEraser").on("click",()=> {
  if ($("#isEraser").is(":checked")) {
    //Todo add eraser size, also a better way to change brush size 
    //Eraser settings
    layerDarkCtx.lineWidth = eraserSize;
    layerLightCtx.lineWidth = eraserSize;
    layerDarkCtx.strokeStyle = "rgba(0,0,0,1)" ;
    layerLightCtx.strokeStyle = "rgba(0,0,0,1)" ;
    layerDarkCtx.globalCompositeOperation = "destination-out"
    layerLightCtx.globalCompositeOperation = "destination-out"//Uh idk it kinda worked lol
    $("#brushSettings").hide();
    $("#eraserSettings").show();
    
  }
  else {
    //Brush settings
    layerDarkCtx.lineWidth = brushSize;
    layerLightCtx.lineWidth = brushSize;
    layerDarkCtx.strokeStyle = "#FFFFFF";
    layerLightCtx.strokeStyle = "#2F3136";
    layerDarkCtx.globalCompositeOperation = "source-over";
    layerLightCtx.globalCompositeOperation = 'source-over';
    $("#brushSettings").show();
    $("#eraserSettings").hide();
  }
});

//idk how to turn this into jq
function clearLayer(layerCtx) {
  layerCtx.clearRect(0,0,LENGTH,LENGTH);
}
//show circle mask
$("#showCircleMask").on("click", ()=> {
    if($("#showCircleMask").is(":checked")) {
      console.log("show mask");
      cMaskCtx.fillStyle = "rgba(0, 0, 0, .3)";
      cMaskCtx.fillRect(0,0,LENGTH,LENGTH)

      cMaskCtx.beginPath();
      cMaskCtx.arc(255,255,255,0,Math.PI*2); 
      cMaskCtx.clip();

      cMaskCtx.clearRect(0,0,LENGTH,LENGTH);

    }
    else {
      cMaskCtx.clearRect(0,0,999999,9999)
      //todo doesnt work ^^^
      console.log("hide mask");
    }
});
//switch mode
$("#isLight").on("click", () => {
  const bg = $("#background");
  if ($('#isLight').is(":checked")){
    console.log("change from dark to light bg");
    bg.css("background-color",COL_LIGHT);
    //bg.removeClass("dark").addClass("light");
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
  
});

//change size
$("#brushSize").on("change", () => {
  brushSize = $("#brushSize").val();
  layerDarkCtx.lineWidth = brushSize;
  layerLightCtx.lineWidth = brushSize;
  console.log("change brush size to", brushSize);
});
$("#eraserSize").on("change", () => {
  //Yes i have to write this twice for clarity
  eraserSize = $("#eraser_size").val();
  layerDarkCtx.lineWidth = eraserSize;
  layerLightCtx.lineWidth = eraserSize;
  console.log("change eraser size to", eraserSize);
});
$("#filenameField").on("change", () =>{
  filename = $("#filename").val();
});
$("#saveButton").on("click", () => {
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
});
////////////////////defaults, TODO implement cookies?///////////////////////////////////////////
$(".dark").css("background-color",COL_DARK);
$(".light").css("background-color",COL_LIGHT);

$(":checkbox").prop('checked', false);
$("#brushSize").val(brushSize.toString());
$("#eraserSettings").hide();
$("#eraserSize").val(eraserSize.toString());
$("#filename").val(filename);