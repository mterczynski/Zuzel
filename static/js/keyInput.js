var pressedKeys = {};
document.onkeydown = function(e)
{
    var key = e.key
    if(key === " ")
    {
        key = "Spacebar";
    }
    else if(key.length == 1)
    {
        key = key.toUpperCase();
    }
    if(e.target.nodeName === "INPUT")
    {
        setTimeout(function(){e.target.value = key;},1);
        console.log(key)
        setTimeout(function(){console.log(key)},3)
    }
    pressedKeys[key] = true;
}
document.onkeyup = function(e)
{
    var key = e.key
    if(key === " ")
    {
        key = "Spacebar";
    }
    else if(key.length == 1)
    {
        key = key.toUpperCase();
    }
    pressedKeys[key] = false;
}