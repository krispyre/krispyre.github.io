$(document).ready(function(){
    //alert(window.localStorage.getItem("num1"));
    // how to use this

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    // foun dthemob ile use r
    {
        window.location.replace("stinky.html");
    }

    var bit_w = parseInt($(".bits").css("width"));//In px
    var int_length = 4; // preserved
    
    var dec_valueA = 0;
    var dec_valueB = 0;
    var dec_valueC = 0;

    var bitsA = [0,0,0,0]; // for calculating things
    var bitsB = [0,0,0,0];// electric boogaloo
    var isSigned = $('#sign-box').is(":checked");
    var isChooseA = true;// true for top num, false for lower num

    var stack = [];
    var step = 0;

    // FUNCTIONS

    // for independent bits
    // add this listener to a for loop across all #bitN
    function switchBit(event) 
    {
        let i = event.data.i;
        bitsA[i] = 1 - bitsA[i];
        console.log("switched bit", i);
    }

    //for resetters
    function setAllBits(event)
    {
        let b = event.data.b;// integer
        for (let i=0, n=bitsA.length; i<n; i++)
        {
            bitsA[i] = b;
        }
        console.log("set all bits to", b);
    }

    //for length menu, changes array and display
    function changeLength(event)
    {
        let l = 0;
        console.log(typeof event);
        if (typeof event == "number")
        {
            l = event;
        }
        else
        {
            l = event.data.l;// target length
        }
        
        int_length = l;// for displaying purposes only

        //changes the length of the array, keeps lower bits
        if (bitsA.length < l) 
        {
            for (let i=0, n=l-bitsA.length; i<n; i++)
            {
                bitsA.unshift(0);
            }
        }
        else if (bitsA.length > l) 
        {
            for (let i=0, n=bitsA.length-l; i<n; i++)
            {
                bitsA.shift();
            }
        }

        $("#bit-container-a").empty();

        let groups = "";
        for (let i=0; i<l/4; i++)
        {
            groups = `<span class="bit-groups" id="bit-ag${i}">\n`;
            for (let j=0; j<4; j++)
            {
                groups += `<button class="bits zero bit-changer" id="bit-a${i*4+j}">0</button>\n`;
            }
            groups += "</span>\n";
            $("#bit-container-a").append(groups);
            //$(`#bit-ag${i}`).before(l-i*4);
            
            
        }

        // if the total width of the bits (and the space) is too large, shrink them
        /*if ((50 + 2) * l >= $(window).width())
        {
            console.log("Too big!");
            bit_w = 20;
            $("#bit-container-a").css("gap", "2px");
        }
        else
        {
            bit_w = 50;
        }
        $(".bits").css("width", `${bit_w}px`);
        $(".bits").css("font-size",`${bit_w*2}px`);
        bit_w = 50; // brh*/
        
        console.log("length changed to", int_length);
        
    }
    
    //for the negate button
    function negateBits(event)
    {
        for (let i=0, n=bitsA.length; i<n; i++)
        {
            bitsA[i] = 1 - bitsA[i];
        }
        console.log("negated bits");
    }

    function shiftBits(event)
    {
        let isLeft = event.data.left;// true for left, false for right

        //let keys = [(event.which == 37), (event.which == 39)];
        if (isLeft)
        {
            bitsA.shift(1);
            bitsA.push(0);
        }
        else
        {
            bitsA.unshift(0);
            bitsA.pop();
        }

        console.log("shifted:", bitsA);

    }

    function crement(event)
    // add or subtract the number by 1
    // +: turn any 1 into 0 until  found a 0 
    // -: or turn any 0 into 1 until found a 1
    {
        let amt = event.data.a;
        if (amt == 1)
        {
            for (let n=bitsA.length, i=n-1; i>=0; i--)
            {
                if (bitsA[i] == 0)
                {
                    bitsA[i] = 1;
                    return
                }
                else
                {
                    bitsA[i] = 0;
                }

            }
            console.log("incremented");
        }
        else if (amt == -1)
        {
            for (let n=bitsA.length, i=n-1; i>=0; i--)
            {
                if (bitsA[i] == 1)
                {
                    bitsA[i] = 0;
                    return
                }
                else
                {
                    bitsA[i] = 1;
                }
            }
            console.log("decremented");
        }
        
    }

    // undo only idk how to do redo
    function undo(event)
    {
        step--;
        switch (stack.pop()[0])
        {
            case 0:// top is changed
                bitsA = stack[stack.length-1][1];
                break;
            case 1:// bottom is changed
                bitsA = stack[stack.length-1][1];
                break;
            case 2:// length
                changeLength(stack[stack.length-1][1]);
                break;
            case 3:// sign
                $("#sign-box").prop("checked", !$("#sign-box").prop("checked"));
                
        }
        console.log("undone");
        
        
    }
    //for operators, updates the display according to array and the decimal value
    //stores numbers into localstorage
    function updateValue(event)
    {
        step++;
        dec_valueA = 0;
        dec_valueB = 0;
        
        //calculate for decimal
        //clean this up [!]
        if (isSigned && bitsA[0] == 1)
        {   
            for (let i=0, n=bitsA.length; i<n; i++)
            {
                dec_valueA += 2**(n-1-i) * (1-bitsA[i]);
            }
            dec_valueA++;
            dec_valueA *= (-1) ** bitsA[0];
        }
        else
        {
            for (let i=0, n=bitsA.length; i<n; i++) 
            {
                dec_valueA += (2**(n-1 - i)) * bitsA[i]
            }
        }

        console.log("array updated");
        /* stack manipulation yey
        if (top is changed)
        {
            stack.append([0, bitsA]);
        }
        else if(bottom is changed){
            stack.append([1, bitsB]);
        }
        else if (length is changed)
        {
            stack.append([2, int_length]);
        }
        else if (sign is changed)
        {
            stack.append([3, 1 or -1]);
        }*/
        
            // multiples by -1 if first bit is 1

        //update display
        for (let i=0, n=bitsA.length; i<n; i++) 
        {
            $(`#bit-a${i}`).text(bitsA[i]);

            if (bitsA[i] == 1)
            {
                $(`#bit-a${i}`).attr("class", "bits one bit-changer");
            }
            else
            {
                $(`#bit-a${i}`).attr("class", "bits zero bit-changer");
            }
        }

        if (isSigned)
        {
            $("#bit-a0").addClass("sign");
        }
        else
        {
            $("#bit-a0").removeClass("sign");
        }
        
        
        $("#dec-display").text(`Decimal value: ${dec_valueA}`);
        console.log("display updated");
        //debug
        console.log("bitsA: ", bitsA);
        console.log(" ");

        window.localStorage.setItem("num1", dec_valueA);
        window.localStorage.setItem("num2", dec_valueB);

    }

    // restore "cookies" (not really)
    if (isSigned)
    {
        updateValue();
    }
    // listeners
    // THE better listener adder
    for (let i=4; i<=32; i+=4)
    {
        // apparently this is the way to pass arguments to the listener
        $(document).on("click", `#${i}bit`, {l:i}, changeLength);

    }

    for (let j=0, n=32; j<n; j++) // bruteforce it bruh
    {
        $(document).on("click", `#bit-a${j}`, {i:j}, switchBit);
        $(document).on("click", `#bit-bs${j}`, {i:j}, switchBit);
    }


    //$(document).on("keydown", shiftBits)
    $(document).on("click", "#sign-box", function() {
        isSigned = $('#sign-box').is(":checked");
        console.log("sign toggled!");
    })
    $(document).on("click", "#bitshift-left", {left: true}, shiftBits);
    $(document).on("click", "#bitshift-right", {left: false}, shiftBits);
    $(document).on("click", "#bit-negate", negateBits);
    $(document).on("click", "#set-on", {b:1}, setAllBits);
    $(document).on("click", "#set-off", {b:0}, setAllBits);
    $(document).on("click", "#increment", {a:1}, crement);
    $(document).on("click", "#decrement", {a:-1}, crement);
    $(document).on("click", "#undo", undo);
    $(document).on("click", ".bit-changer", updateValue);// place this at the bottom

    

});
