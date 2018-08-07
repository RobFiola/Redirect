var data=[];
var obj={};
var keyword;
var asin;
var key;
var root;
openJSON("src/js/redirects.json",);
$(document).ready(function() {
    setTimeout( function(){return;},1000);
    data=sortData(myJSON);
    setKeyword();
    console.log(obj);
    refreshTable();
    showGraph();
    //listeners();
    $('[data-toggle="tooltip"]').tooltip();
    
    $('.nav-link').click(function( event ){
            event.preventDefault();});
    
});

//get info from url
function setKeyword(i=0){
    
    asin=parseInt(getParameterByName('asin'));
    
    root=parseInt(getParameterByName('root'));
    key=parseInt(getParameterByName('keyword'));
    console.log(asin,root,key);
    keyword=data[asin].root[root].keywords[key];
    obj=data[asin];
    obj.root=data[asin].root[root];
//    obj.keywords=data[asin].root[root].keywords[i];
}

//function get data
function refreshTable(){
    document.getElementById('name').textContent=obj.root.path;
    document.getElementById('asin').innerHTML=obj.asin;
    document.getElementById('root').innerHTML=obj.root.name;
    document.getElementById('url').innerHTML=obj.url;
    //loop users
    
        

    
    obj.root.users.forEach(function(user){
        var li=document.createElement('li');
        
        li.innerHTML=user;
//        console.log(li);
        document.getElementById('users').append(li);
    });
    document.getElementById('country').innerHTML=obj.root.country;
    
}
function showGraph(){
    
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}