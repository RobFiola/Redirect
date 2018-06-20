var myJSON=null;
var xmlhttp=null;
var data=[{
        "root": "",
        "asin": "",
        "link": "",
        "keyword": "",
        "users": []
        }];
//var input;

/*Grab all data from json file and display in table*/
openJSON();



//update html redirect files (php)
//str_replace("I want to replace this", "with this");
//create new html redirect file when new item created

/*on document ready*/
$(function() {
    listeners();
});

/*add listeners to all editable items*/
function listeners(){
    var table=document.getElementById('tables');
    var currentRow=table.firstElementChild.firstElementChild;
    
    
    while(currentRow){
        var currentCell=currentRow.firstElementChild;
        
        while(currentCell){
            currentCell.firstChild.addEventListener("change", function(e){
                var field=e.srcElement.dataset.field;
                var text=e.srcElement.value;
                var id=e.srcElement.parentElement.parentElement.id;
                switch (field){
                    case 'root':
                        data[id].root=text;
                        break;
                    case 'asin':
                        data[id].asin=text;
                        break;
                    case 'keyword':
                        data[id].keyword=text;
                        break;
                    case 'link':
                        data[id].link=text;
                        break;
                }
                
            });
                currentCell=currentCell.nextElementSibling;
            
        }
        
        currentRow=currentRow.nextElementSibling;
    }
}

/*read JSON file and save to data*/
function openJSON(){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myJSON = JSON.parse(this.responseText);
            
            input=myJSON;
//            console.log(input);
            
            sortData(input);
            showData();
        }
    };
    xmlhttp.open("GET", "src/redirects.json", true);
    xmlhttp.send();
    
    return true;
}

/*save to JSON file*/
//update html redirect files
function save(){
    alert('save');
    console.log(data);
    var json = JSON.stringify(data);
    var fs = require('fs');
    fs.writeFile('myjsonfile.json', json, 'utf8', callback);
    // step 2: convert data structure to JSON
    //$.post("src/json.php", {json : JSON.stringify(data)});
}

/*push content to array*/
function sortData(input)
{    
    data = [];
    for (var key in input) {
      if (input.hasOwnProperty(key)) {
          data.push(input[key]);
      }

    }
    console.log(data);
  return data;
}

/*display data in table*/
function showData()
{
    tableRow=document.getElementById('0');
    for(var i=0;i<data.length;i++){
        newRow(i, data[i]);
    
    }
    
}

/*create new item and display on table*/
function addItem()
{
    var item;
//    console.log(i);
//    alert('add item '+i);
    item={
        "":{
            "root": "",
            "asin": "",
            "link": "",
            "keyword": "",
            "users":[]
        }
    };
    data.push(item);
    newRow(data.length, data[data.length-1]);
    console.log(data);
}

/*duplicate a new Row*/
function newRow(i, obj){
    var original=document.getElementById('0');
        //console.log(original);
    var item;
        if(i==0)
            item=original;
        else
            item=original.cloneNode(true);
//console.log(item);
        item.id=i;
        var sibling=item.firstElementChild;
        sibling.innerHTML=parseInt(i)+1;
        sibling=sibling.nextElementSibling.nextElementSibling;
        //sibling.id='root'+i;
        sibling.firstElementChild.value=obj.root;
        sibling=sibling.nextElementSibling;
        //sibling.id='label'+i;
        sibling.firstElementChild.value=obj.asin;
        sibling=sibling.nextElementSibling;
        //sibling.id='keyword'+i;
        sibling.firstElementChild.value=obj.keyword;
        sibling=sibling.nextElementSibling;
        //sibling.id='super'+i;
        sibling.firstElementChild.value=obj.link;
        sibling=sibling.nextElementSibling;
        //sibling.id='delete'+i;
    original.parentElement.appendChild(item);
}
/**/
function nameElements (item, i){
        item.id=i;
        var sibling=item.firstElementChild;
        sibling.innerHTML=parseInt(i)+1;
       /* sibling=sibling.nextElementSibling.nextElementSibling;
        sibling.id='root'+i;
        sibling=sibling.nextElementSibling;
        sibling.id='label'+i;
        sibling=sibling.nextElementSibling;
        sibling.id='keyword'+i;
        sibling=sibling.nextElementSibling;
        sibling.id='super'+i;
        sibling=sibling.nextElementSibling;
        sibling.id='delete'+i;*/
}

/*remove item from table and data*/
function deleteItem(item)
{
    var i=parseInt(item.id);
    //add functionality to delete item
//    console.log(item);
    alert('are you sure you would like to delete item #'+(i+1));
    document.getElementById("tables").deleteRow(i-1);
    data.splice(i,1);
//    console.log(data);
    var element
    if(i!=0){        element=document.getElementById('0');}
    else {element=document.getElementById('1');}
//    console.log(element);
    if(element){
        var x=0;
        while(element && element.hasChildNodes){
        nameElements(element,x); 
            
        element=element.nextElementSibling;
            x++;
        }
    }
}

//open new page to see root file
//editable file?
function download(){
    window.open('src/redirects.json',"_self");
}

//show more details about item
function more(i){
   alert("Show more details about item "+i); 
}

/*send email*/
/*var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});*/