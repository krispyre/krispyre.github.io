
console.log("script loaded.");
let isTaskBarHidden = false;
let alignModeId = 0;
let alignModes = ["left","center","right"];
let flexAlignModes = ["flex-start"]

// question 3.1
document.getElementById("taskSwitch").addEventListener("click", () => {
    
    if (!isTaskBarHidden) {
        document.getElementById("taskButtons").style.display = "none";
        document.getElementById("taskSwitch").innerHTML = "Show";
    } else {
        document.getElementById("taskButtons").style.display = "block";
        document.getElementById("taskSwitch").innerHTML = "Hide";
    }
    isTaskBarHidden = !isTaskBarHidden;
    console.log("task bar toggled");
})
document.getElementById("alignBtn").addEventListener("click", ()=>{
    console.log("align button clicked");
    alignModeId++;
    alignModeId = alignModeId % 3;
    let elems = document.querySelectorAll("main");
    for (let i=0,n=elems.length;i<n;i++) {
       if (elems[i].tagName != "IMG") {
        elems[i].style.textAlign=alignModes[alignModeId];
       }
    }
})

// question 3.2
let isSplShown = false;
document.getElementById("spotlightBtn").addEventListener("click", () => {
    let spotlightList = document.getElementById("spotlightList");
    console.log("add spotlight?");
    let input = prompt("What's new?");
    
    if (input) {
        
        let newSpotlight = document.createElement("li");
        newSpotlight.innerHTML = input;
        spotlightList.insertBefore(newSpotlight, spotlightList.children[0]);
        console.log("added spotlight");
    }
})
// show/hide
/*
document.getElementById("splDrawer").addEventListener("click",() => {
    if (isSplShown) {
        document.getElementById("spotlights").style.bottom = "-34%";
    } else {
        document.getElementById("spotlights").style.bottom = "0%";
    }
    isSplShown = !isSplShown;
    
    console.log("toggle spotlight");
})*/

// question 3.3
document.getElementById("toastBtn").addEventListener("click", () => {
    
    let date = new Date();
    document.getElementsByClassName("toast-body")[0].innerHTML = `Current time: ${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()).padStart(2,'0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
    const toast = new bootstrap.Toast(document.getElementById("toast"));
    toast.show()
    console.log("show toast");
})

// for q 4,5,6
let cmList = [];

// add comment template
const addCm = (email, color, comment) =>{
    let newCmElem = document.createElement("div");
    newCmElem.className = `cm ${color} container`;
    newCmElem.innerHTML = `<div class="cmHeader ${color}">
                                <i class=" bi bi-person-circle float-start ${color}"></i> 
                                <h5 class=" ${color}">${email}</h5>
                            </div>
                            <div class="row">
                                <p class="cmBody ${color}">${comment}</p>
                            </div>`;
    document.getElementById("commentSection").appendChild(newCmElem);
}

// color picker
let colorId = -1;
let colors = ["red", "green", "yellow", "blue"];
document.getElementById("userColor").addEventListener("click",(e) => {
    e.preventDefault();
    colorId++;
    colorId %= colors.length;

    document.getElementById("invalidMsg").style.display = "none";
    document.getElementsByClassName("userColor")[0].classList.remove("invalid");

    document.getElementById("userColorIcon").className = `${colors[colorId]} bi bi-person-circle`;
    document.getElementById("userEmail").className = `${colors[colorId]}`;
    document.getElementById("userComment").className = `${colors[colorId]}`;

    document.getElementById("userEmail").focus();
})

// question 4+5 validate and submit comments
// color: [red,green,yellow,blue]
const submitCm = () =>{    
    // submit
    //console.log(`${colorId} ${document.getElementById("userEmail").value}`);
    let newCm = {
        "email": document.getElementById("userEmail").value,
        "color": "",
        "comment": document.getElementById("userComment").value
    }
    switch (colorId) {
        case 0:
            newCm.color = "red";
            break;
        case 1:
            newCm.color = "green";
            break;
        case 2:
            newCm.color = "yellow";
            break;
        case 3:
            newCm.color = "blue";
            break;
    }
    // add to website
    addCm(newCm.email, newCm.color, newCm.comment);
    // fetch to form
    cmList.push(newCm);
    //console.log(cmList);
    let newCmList = {"data": cmList};

    fetch("comments.json", {
        method: "PUT",
        body: `${JSON.stringify(newCmList)}`
    });
    console.log("added comment");
};
// Clear all button
const resetCm = () => {
    //looks
    document.getElementById("userColorIcon").className = "bi bi-person-circle ";
    document.getElementById("userEmail").className = "";
    document.getElementById("userComment").className = "";

    //data
    colorId = -1;
    document.querySelector("form").reset();
};

document.getElementById("resetBtn").onclick = resetCm;
// question 5, validate
document.getElementById("invalidMsg").style.display = "none";
const validateCm = () => {
    let validEmail = /^[\w]+@[\w]+\.[\w]+(\.[\w)]+)?/;
    console.log("validate input");
    if (colorId == -1) {
        document.getElementById("invalidMsg").innerHTML = "Pick a color."
        document.getElementsByClassName("userColor")[0].classList.add("invalid");
        console.error("no color chosen");
    } else if (!validEmail.test(document.getElementById("userEmail").value)) {
        document.getElementById("invalidMsg").innerHTML = "Invalid email."
        document.getElementsByClassName("userEmail")[0].classList.add("invalid");
        console.error("wrong email format");

    } else if (document.getElementById("userEmail").value == "" || document.getElementById("userComment").value == "") {
        document.getElementById("invalidMsg").innerHTML = "Empty comment."
        document.getElementsByClassName("userComment")[0].classList.add("invalid");
        console.error("incomplete comment");

    } else {
        return true;

    }
    document.getElementById("invalidMsg").style.display = "block";
    return false;
}

// remove invalid style onfocus
// efficiensi
document.getElementById("userEmail").addEventListener("focus", (e) => {
    document.getElementById("invalidMsg").style.display = "none";
    document.getElementsByClassName("userEmail")[0].classList.remove("invalid");
});
document.getElementById("userComment").addEventListener("focus", () => {
    document.getElementById("invalidMsg").style.display = "none";
    document.getElementsByClassName("userComment")[0].classList.remove("invalid");
});
// question 6
//load comments
const loadCm = () => {
    console.log("comments loading...");
    fetch("comments.json")
    .then(response => response.text())
    .then(data => {
        let temp = JSON.parse(data);

        for(let cm of temp.data) {
            cmList.push(cm);
            addCm(cm.email, cm.color, cm.comment);
        }
        console.log("comments loaded.");
    })
    .catch(er => {
        console.error(er);
        }
    );

};

window.onload = loadCm;
document.getElementById("submitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    if (validateCm()) {
        submitCm();
        resetCm();
    }
})

//Q3.1 what text's align button should be changed?

//todo: style sucks ass