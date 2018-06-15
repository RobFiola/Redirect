var href = window.location.href;
var pieces = href.split('?');
var product='';
var asin='';
var country='';

for (var i=1;i<pieces.length;i++)
{
    var variable=pieces[i].split('=');
    if (variable[0]=='product') {
        product = variable[1];
    }
    elseif (variable[0]=='asin'){
        asin=variable[1]
    }
    elseif (variable[0]=='country'){
        country=variable[1];
    }
    console.log('product: '+product+'/n'
               +'asin: '+ asin +'/n'
               +'country: '+country);
}
var link = "https://www.amazon.com";
alert('redirect to :'+link);
//window.open(link,"_self");