function x(){
    var a = 7;
    function c(){
        console.log(a);
    }
    return c;

}

var z = x();
z();