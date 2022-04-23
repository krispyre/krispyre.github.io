// here i go green baeby
$(document).ready(function(){
    var bit_w = parseInt($(".bits").css("width"));//In px
    var int_length = 4;
    //preserved
    var dec_value = 0;
    var bits = [0,0,0,0]; // for calculating things
    var bits2 = [0,0,0,0];// electric boogaloo
    
    //addsound effects onlick?

    //for independent bits
    //add this listener to a for loop across all #bitN
    function switchBit(event) 
    {
        let i = event.data.i;
        bits[i] = 1 - bits[i];
    }

    //for resetters
    function setAllBits(event)
    {
        let b = event.data.b;// integer
        for (let i=0, n=bits.length; i<n; i++)
        {
            bits[i] = b;
        }
    }

    //for length menu, changed array and display
    function changeLength(event)
    {
        let l = event.data.l;// target length
        int_length = l;// for displaying purposes only

        //changes the length of the array, keeps lower bits
        if (bits.length < l) 
        {
            for (let i=0, n=l-bits.length; i<n; i++)
            {
                bits.unshift(0);
            }
        }
        else if (bits.length > l) 
        {
            for (let i=0, n=bits.length-l; i<n; i++)
            {
                bits.shift();
            }
        }

        $("#bit-container").empty();

        for (let i=0; i<l/4-1; i++)
        {
            for (let j=0; j<4; j++)
            {
                $("#bit-container").append(`<div class="bits zero bit-changer" id="bit${i*4+j}">0</div>`);
                
            }
            $("#bit-container").append("<pre>  </pre>");
        }
        // The final 4 bits
        for (let i=l-4; i<l; i++)
        {
            $("#bit-container").append(`<div class="bits zero bit-changer" id="bit${i}">0</div>`);
        }
          

        // if the total width of the bits (and the space) is too large, shrink them
        if ((50 + 2) * l >= $(window).width())
        {
            console.log("Too big!");
            bit_w = 20;
            $("#bit-container").css("gap", "2px");
        }
        else
        {
            bit_w = 50;
        }
        $(".bits").css("width", `${bit_w}px`);
        $(".bits").css("font-size",`${bit_w*2}px`);
        bit_w = 50; // brh

        //cur_length = l;
        
        //console.log($(".bits").css("width"));
        console.log("length changed to", int_length);
        
    }
    
    //for the negate button
    function negateBits(event)
    {
        for (let i=0, n=bits.length; i<n; i++)
        {
            bits[i] = 1 - bits[i];
        }

    }

    function shiftBits(event)
    {
        let isLeft = event.data.left;// true for left, false for right

        //let keys = [(event.which == 37), (event.which == 39)];
        if (isLeft)
        {
            bits.shift(1);
            bits.push(0);
        }
        else
        {
            bits.unshift(0);
            bits.pop();
        }

        console.log("shifted:", bits);

    }

    //for operators, updates the display according to array
    function updateValue(event)
    {
        dec_value = 0;
        for (let i=0, n=bits.length; i<n; i++) 
        {
            dec_value += (2**(n-1 - i)) * bits[i]

            $(`#bit${i}`).text(bits[i]);

            if (bits[i]) // is one
            {
                $(`#bit${i}`).attr("class", "bits one bit-changer");
            }
            else
            {
                $(`#bit${i}`).attr("class", "bits zero bit-changer");
            }
        }
        $("#dec-display").text(`Decimal value: ${dec_value}`);
        console.log("bit1: ", bits);
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
        $(document).on("click", `#bit${j}`, {i:j}, switchBit);
    }


    //$(document).on("keydown", shiftBits)
    $(document).on("click", "#bitshift-left", {left: true}, shiftBits);
    $(document).on("click", "#bitshift-right", {left: false}, shiftBits);
    $(document).on("click", "#bit-negate", negateBits);
    $(document).on("click", "#set-on", {b:1}, setAllBits);
    $(document).on("click", "#set-off", {b:0}, setAllBits);
    $(document).on("click", ".bit-changer", updateValue);// place this at the bottom idk y



    /*$(window).on("resize", function()
    {
        $(window).width() = $(window).width();
    });*/
    

});


