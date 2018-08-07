var myJSON=null;
var xmlhttp=null;
var file=null;
/*read JSON file and save to data*/
function openJSON(file){
   // console.log(file);
    this.file=file;
    try{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myJSON = JSON.parse(this.responseText);
            
        }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();
    
    return true;
    }catch(Error){
        status('file invalid',1);
        return false;
    }
}
/*push content to Object array*/
function sortData(input){    
    var data = [];
    for (var key in input) {
      if (input.hasOwnProperty(key)) {
          var item=new ASIN(input[key].asin);
          item.url=input[key].url;
          var rootArray=[];
          for(var i=0;i<input[key].root.length;i++){
              rootArray.push(new Root(input[key].root[i].name));
              rootArray[i].path=input[key].root[i].path;
              rootArray[i].country=input[key].root[i].country;
              rootArray[i].url=input[key].root[i].url;
              rootArray[i].users=input[key].root[i].users;
              var keywordsArray=[];
              for(var j=0;j<input[key].root[i].keywords.length;j++){
                  keywordsArray.push(new Keyword(input[key].root[i].keywords[j].name));
                  keywordsArray[j].clicks=input[key].root[i].keywords[j].clicks;
                  keywordsArray[j].max_clicks=input[key].root[i].keywords[j].max_clicks;
                  keywordsArray[j].link=input[key].root[i].keywords[j].link;
              }
              rootArray[i].keywords=keywordsArray;
          }
          item.root=rootArray;
          
          data.push(item);
      }

    }
    //console.log(data);
  return data;
}
