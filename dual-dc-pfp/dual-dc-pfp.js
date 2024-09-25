//var PxBrush = require('px-brush');


const cMask = document.getElementById("circle_mask").getContext("2d");
let focusDark = true; // draw on dark mode (white ink)
let brushSize = 4; // TODO: let slider change this
//const brushDark = new PxBrush(l0); // brush FOR dark mode, so it's white
cMask.imageSmoothingEnabled= false;
//https://codepen.io/zsolt555/pen/rpPXOB
//////////////////////////////////////////////////////////////////////////////
const layerDark = document.getElementById("layer0")
const layerDarkCtx = layerDark.getContext("2d");

const layerLight = document.getElementById("layer1");
const layerLightCtx = layerLight.getContext("2d");

layerDarkCtx.strokeStyle = "#FF0000";
layerDarkCtx.lineJoin = "round";
layerDarkCtx.lineCap = "round";
layerDarkCtx.lineWidth = brushSize;

layerLightCtx.strokeStyle = "#00FF00";
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
layerDark.addEventListener("mouseup",ditherClear);//TODO
////
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
///////////////////////////////////////////////////////////////////////////////////
function clearLayer(layer,layerCtx) {
  layerCtx.clearRect(0,0,layer.width,layer.height);
}
function drawCircleMask() {
    if($("#show_circle_mask").is(":checked")) {
        cMask.fillStyle = "rgba(0, 0, 0, .3)";
        cMask.fillRect(0,0,513,513)

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
  brushSize = $("#pen_size_select").val();
  //$("#pen_size_output").text($("#pen_size_select").val());
}
function ditherClear(layerCtx,isOdd=false) {
  //isOdd determines if it deletes odd number of pixels or not
  layerData = layerCtx.createImageData(512,512);
  console.log("TODO dither");
  //TODO

}
function saveImage() {

  //window.open(url, '_blank').focus();
}
////////////////////defaults unchecked boxes, TODO implement cookies?///////////////
$(":checkbox").prop('checked', false);