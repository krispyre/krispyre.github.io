var bit_length = 4;
var dec_value = 0;
//add custom animation onlick?

function switchBits() 
{
    if ($(this).html() == 0) 
    {
        $(this).html(1);
    }
    else
    {
        $(this).html(0);

    }
}

function updateValue()
{
    dec_value = 0;
    let p = bit_length-1; //power of each bit
    $("#bit-container").find(".bits").each(function() {
        dec_value += (2**p)*parseInt($(this).text());//wip
        p--;
    });
    console.log(`current decimal value: ${dec_value}`);
}
$(document).ready(function(){
    $(".bits").click(switchBits);
    $(".bits").click(updateValue);
    

});


