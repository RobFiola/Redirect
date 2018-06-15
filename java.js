//var href = window.location.href;
//console.log(href);
var product=getQueryVariable('product');
console.log('product: '+product);
var asin=getQueryVariable('asin');
console.log('asin: '+product);
var country=getQueryVariable('country');
console.log('country: '+product);


var link = "https://www.amazon.com";
alert('redirect to :'+link);
//window.open(link,"_self");

function getQueryVariable(variable)//country
{
    
var query=window.location.search.substring(1);
    console.log(query);
    var vars=query.split('&');
    console.log('vars: '+vars);
    for (var i=0;i<vars.length;i++){
        var pair=vars[i].split('=');
        console.log(pair);
        if(pair[0]==variable){return pair[1];}
    }
    return false;
}
