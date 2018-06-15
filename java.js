//var href = window.location.href;
//console.log(href);
var xmlhttp=null;
var product=getQueryVariable('product');
console.log('product: '+product);
var asin=getQueryVariable('asin');
console.log('asin: '+asin);
var country=getQueryVariable('country');
console.log('country: '+country);
openJSON();

var link = "https://www.amazon.com";
alert('redirect to :'+link);
//window.open(link,"_self");

function getQueryVariable(variable)//country
{
    
var query=window.location.search.substring(1);
    var vars=query.split('&');
    for (var i=0;i<vars.length;i++){
        var pair=vars[i].split('=');
        if(pair[0]==variable){return pair[1];}
    }
    return false;
}

function openJSON(){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            document.getElementById('super').value=myObj.armband98d.super;
            
        }
    };
    xmlhttp.open("GET", "redirects.json", true);
    xmlhttp.send();
}