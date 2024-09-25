const cMask = document.getElementById("circle_mask").getContext("2d");
const WIDTH = HEIGHT = 512;
let focusDark = true; // draw on dark mode (white ink)
let brushSize = 4; // TODO: let slider change this
//const brushDark = new PxBrush(l0); // brush FOR dark mode, so it's white
cMask.imageSmoothingEnabled= false;

//drawing//////////////////////////////////////////////////////////////
const layerDark = document.getElementById("layer0")
const layerDarkCtx = layerDark.getContext("2d");

const layerLight = document.getElementById("layer1");
const layerLightCtx = layerLight.getContext("2d");

layerDarkCtx.strokeStyle = "#FFFFFF";
layerDarkCtx.lineJoin = "round";
layerDarkCtx.lineCap = "round";
layerDarkCtx.lineWidth = brushSize;

layerLightCtx.strokeStyle = "#2F3136";
layerLightCtx.lineJoin = "round";
layerLightCtx.lineCap = "round";
layerLightCtx.lineWidth = brushSize;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e,layerCtx) {
  if (!isDrawing) { return; }
  layerCtx.beginPath();
  layerCtx.moveTo(lastX,lastY);
  layerCtx.lineTo(e.offsetX,e.offsetY);
  layerCtx.stroke();
  //console.log(layerCtx);
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

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
})

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
})

//dither///////////////////////////////////////////////////////////////////////
//why is it all zeros
function ditherClear() {
  let layerDarkData = layerDarkCtx.getImageData(0,0,WIDTH,HEIGHT);
  let layerLightData = layerLightCtx.getImageData(0,0,WIDTH,HEIGHT);
  
  for(let y=0;y<HEIGHT;y++) {
    for(let x=0;x<WIDTH;x++)
      {
        let data = layerDarkData.data;
        //console.log(data[i],data[i+1],data[i+2],data[i+3]);
        if((x+y)%2 == 0)
        {
          let i = 4*(x+WIDTH*y)
          /*data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;*/
          data[i+3] = 0;
        }
        data = layerLightData.data;
        if((x+y)%2 == 1)
          {
            i = 4*(x+WIDTH*y)
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
  layerCtx.clearRect(0,0,WIDTH,HEIGHT);
}
function drawCircleMask() {
    if($("#show_circle_mask").is(":checked")) {
        cMask.fillStyle = "rgba(0, 0, 0, .3)";
        cMask.fillRect(0,0,WIDTH,HEIGHT)

        cMask.beginPath();
        cMask.arc(255,255,255,0,Math.PI*2); 
        cMask.clip();

        cMask.clearRect(0,0,513,513);

    }
    else {
        cMask.clearRect(0,0,513,513);
    }
    
}
function switchMode() {
  const bg = $("#background");
  if ($('#is_light').is(":checked")){
    console.log("change from dark to light bg");
    bg.removeClass("dark").addClass("light");
    focusDark=true;
    //layerLight.style.display="block";
    //layerDark.style.display="none";
    layerLight.style.zIndex="2";
    layerDark.style.zIndex="1";
  }
  else {
    console.log("change from light to dark bg");
    bg.removeClass("light").addClass("dark");
    //layerLight.style.display="none";
    //layerDark.style.display="block";
    layerLight.style.zIndex="1";
    layerDark.style.zIndex="2";
  }
  
}
function changeBrushSize() {
  brushSize = $("#brush_size").val();
  console.log("change brush size to", brushSize);
  layerDarkCtx.lineWidth = brushSize;
  layerLightCtx.lineWidth = brushSize;
}
function saveImage() {

  //window.open(url, '_blank').focus();
}
////////////////////defaults unchecked boxes, TODO implement cookies?///////////////
$(":checkbox").prop('checked', false);
$("#brush_size").val("4");