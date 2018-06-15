var href = window.location.href;
var product=getQueryVariable('product');

var asin=getQueryVariable('asin');
var country=getQueryVariable('country');


var link = "https://www.amazon.com";
alert('redirect to :'+link);
//window.open(link,"_self");

function getQueryVariable(variable)
{
    
var query=window.location.search.substring(1);
    var vars=query.split('&');
    for (var i=0;i<vars.length;i++){
        var pair=vars[i].split('=');
        if(pair[0]==variable){return pair[1];}
    }
    return(false);
}