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

    var bin1 = 0// int.toString(2);
    var bitsA = [0,0,0,0]; // for calculating things
    var bitsB = [0,0,0,0];// electric boogaloo
    var isSigned = $('#sign-box').is(":checked");
    
    // addsound effects onlick?

    // listeners

    // for independent bits
    // add this listener to a for loop across all #bitN
    function switchBit(event) 
    {
        let i = event.data.i;
        bitsA[i] = 1 - bitsA[i];
    }

    //for resetters
    function setAllBits(event)
    {
        let b = event.data.b;// integer
        for (let i=0, n=bitsA.length; i<n; i++)
        {
            bitsA[i] = b;
        }
    }

    //for length menu, changes array and display
    function changeLength(event)
    {
        let l = event.data.l;// target length
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
        for (let i=0; i<l/4; i++)
        {
            for (let j=0; j<4; j++)
            {
                $("#bit-container-a").append(`<div class="bits zero bit-changer" id="bit-a${i*4+j}">0</div>`);
                
            }
            // seperator
            if (!(i == l/4-1))
            {
                $("#bit-container-a").append("<pre>  </pre>");
            }
            
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

        //cur_length = l;
        
        //console.log($(".bits").css("width"));
        console.log("length changed to", int_length);
        
    }
    
    //for the negate button
    function negateBits(event)
    {
        for (let i=0, n=bitsA.length; i<n; i++)
        {
            bitsA[i] = 1 - bitsA[i];
        }

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
    {
        let amt = event.data.a;
        ;
    }
    //for operators, updates the display according to array and the decimal value
    //stores numbers into localstorage
    function updateValue(event)
    {
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
        
        //debug
        $("#dec-display").text(`Decimal value: ${dec_valueA}`);
        console.log("bit1: ", bitsA);

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
    $(document).on("click", ".bit-changer", updateValue);// place this at the bottom

    

});


//"j."
//     ~apandah