$(document).ready(function(){
    var bit_w = parseInt($(".bits").css("width"));//In px
    var int_length = 4;
    var cur_length = 4;//change changeLength function: add the upper bits so that lower bit values can be 
    //preserved
    var dec_value = 0;
    var bits = [0,0,0,0]; // for calculating things
    var bits2 = [0,0,0,0];// electric boogaloo
    
    //addsound effects onlick?

    //for independent bit, changes text only
    function switchBit(event) 
    
    {
        if ($(this).text() == 0) 
        {
            $(this).text(1);
            $(this).attr("class", "bits one bit-changer");
        }
        else
        {
            $(this).text(0);
            $(this).attr("class", "bits zero bit-changer");
        }
    }

    //for setters, changes the array
    function setAllBits(event)
    {
        let b = event.data.b;//int
        let bit = 0;//str
        bits = [];

        if (b == 1)
        {
            bit = "one";
        }
        else
        {
            bit = "zero"
        }
        for (let i=0; i<int_length; i++)
        {
            $(".bits").html(b);
            $(".bits").attr("class", `bits ${bit} bit-changer`);
            bits.push(b);
        }
    }

    //for length menu, does not affect array
    function changeLength(event)
    {
        let l = event.data.l;
        int_length = l;

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
        if ((50 + 2) * int_length >= $(window).width())
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

        cur_length = l;
        
        //console.log($(".bits").css("width"));
        console.log("length changed to", int_length);
        
    }

    //for operators, calculates for array
    //Shouldnt it be the other way around?
    function updateValue(event)
    {
        dec_value = 0;
        bits = [];

        $("#bit-container").find(".bits").each(function(i) {
            bits.push(parseInt($(this).text()));
        });
        console.log("updated: ", bits);

        //Calculate finally
        for (let p=0, n=bits.length; p<n; p++) // power
        {
            dec_value += 2**(n-1 - p) * bits[p];
        }

        $("#dec-display").text((`Decimal value: ${dec_value}`));
    }
    
    //for the negate button, changes the array
    function negateBits(event)
    {
        bits = [];
        for (let i=0; i<int_length; i++)
        {
            if ($(`#bit${i}`).text() == 0)
            {
                $(`#bit${i}`).text(1);
                $(`#bit${i}`).attr("class", "bits one bit-changer");
                bits.push(1);
            }
            else{
                $(`#bit${i}`).text(0);
                $(`#bit${i}`).attr("class", "bits zero bit-changer");
                bits.push(0);
            }


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
    // listeners
    for (let i=4; i<=32; i+=4)
    {
        // apparently this is the way to pass arguments to the listener
        $(document).on("click", `#${i}bit`, {l:i}, changeLength);

    }

    $(document).on("click", ".bits", switchBit);// THE better listener adder
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


