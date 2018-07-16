
var document=window.document;
var myJSON=null;
var xmlhttp=null;

function ASIN(asin, root="", keyword=""){
    this.asin= asin;
    this.url= "";
    this.root= [new Root(root,keyword)];
    this.createURL=function(asin, root, keyword){
       return "amazon.com?asin="+asin+"&keyword"+keyword; 
    };
}
function Root(name="",keyword=""){
    this.name=name;
    this.path="";
    this.keywords=[new Keyword(keyword)];
    this.users=[];
    this.clicks=0;
    this.max_clicks=0;        
}
function Keyword(name=""){
    this.name=name;
    this.link="";
}
var data=[];
//Grab all data from json file and display in table
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
    
}
function update(e){
    var modal=document.getElementById('modal');
    var asin=modal.dataset.asin;
    var root=modal.dataset.root;
    //update data
    data[asin].asin=document.getElementById('modal-asin').value;
    
    data[asin].root[root].name=document.getElementById('modal-root').value;
    var keywords=document.getElementById('modal-keyword');
    var line=keywords.firstElementChild.firstElementChild;
    var numKeywords= parseInt(keywords.firstElementChild.lastElementChild.dataset.keyword)+1;
    var keywordsArray=data[asin].root[root].keywords;
    
    for (var i=0;i<numKeywords;i++){
        var input= line.lastElementChild.firstElementChild.value;
        //if empty
        
        {
        if(i>=keywordsArray.length)//new keyword
            {
                if(input!="")
                {data[asin].root[root].keywords.push(new Keyword(input));}
            }
        else//change name
            {
               if(input!="") {
                   data[asin].root[root].keywords[i].name=input;
               }
                else{
                    data[asin].root[root].keywords.splice(i,1);
                }
            }
        }
        line=line.nextElementSibling;
    }
    //>>keywords
    data[asin].root[root].keywords[0].link=document.getElementById('modal-redirect').value;
    data[asin].root[root].clicks=document.getElementById('modal-clicks').value;
     data[asin].root[root].keywords[0].max_clicks=document.getElementById('modal-max').value;
     
    //>>users array
    var users=document.getElementById('modal-users').value.split(',');
    
    data[asin].root[root].keywords[0].users=users;
    log(data);
    hide(document.getElementById('modal'));
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
    status("Data Saved Successfully" , 2);
    console.log(data);
    var json = JSON.stringify(data);
    var fs = require('fs');
    fs.writeFile('myjsonfile.json', json, 'utf8', callback);
    // step 2: convert data structure to JSON
    //$.post("src/json.php", {json : JSON.stringify(data)});
}
function saveRow(item){
    //***//
    hide(item.lastElementChild);
    show(item.lastElementChild.previousElementSibling)
}

/*push content to array*/
function sortData(input){    
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
function showData(){
    var row=0;//# of rows
    tableRow=document.getElementById('0');
    //ASINS
    for(var i=0;i<data.length;i++){
        //console.log("i="+i);
        var obj=data[i];
        //SUBDOMAINS
        for(var j=0;j<obj.root.length;j++){
            //new line for each subdomain
            //console.log("j="+j);
            
            
                newRow(row);

               var parent= document.getElementById(row); 
            parent.dataset.asin=i;    
            parent.dataset.root=j;
                var sibling= parent.firstElementChild.nextElementSibling.nextElementSibling;

                sibling.firstElementChild.innerHTML=obj.root[j].name;
                sibling=sibling.nextElementSibling;
                sibling.firstElementChild.innerHTML=obj.asin;
                sibling=sibling.nextElementSibling;
                sibling.firstElementChild.innerHTML=obj.root[j].keywords[0].name;
                sibling=sibling.nextElementSibling;
                sibling.firstElementChild.innerHTML=obj.root[j].keywords[0].link;
                
                row++;
            
        }
    
    }
    
/*
            var options = ["1", "2", "3", "4", "5"];
            $('#select').empty();
            $.each(options, function(i, p) {
                $('#select').append($('<option></option>').val(p).html(p));
            });
*/
    
}

/*create new item and display on table*/
function addItem(){
    var asin = prompt("Please enter your product ASIN");
    //console.log(asin);
    if (asin !== null && asin != "") {
        var item;
    //    console.log(i);
    //    alert('add item '+i);
        var found=-1;
        for (var i=0;i<data.length;i++){
            if(data[i].asin==asin)
                {
                    found=i;
                }
        }
        if(found==-1){
            data.push(item=new ASIN(asin));
            var row=newRow(data.length, data[data.length-1]);
                     }

        else{
            data[found].root.push(item=new Root());
            var row=newRow(data.length, data[data.length-1]);
        }

        //document.getElementById(data.length);
        console.log(data);
    }
}

/*duplicate a new Row*/
function newRow(i){
    var original=document.getElementById('0');
        //console.log(original);
    var row;
        if(i==0)
            row=original;
        else
            row=original.cloneNode(true);
//console.log(item);
        nameElements(row, i);
        var sibling=row.firstElementChild; sibling=sibling.nextElementSibling.nextElementSibling;
        sibling.firstElementChild.value="";
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.value="";
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.value="";
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.value="";
    
        
    original.parentElement.appendChild(row);
    return row;
    
}
/**/
function nameElements (item, i){
        item.id=i;
        var sibling=item.firstElementChild;
        sibling.innerHTML=parseInt(i)+1;
}

/*remove item from table and data*/
function deleteItem(item){
    var i=parseInt(item.id);
    var conf=confirm('are you sure you would like to delete item #'+(i+1));
    if(conf){
        var asin=item.dataset.asin;
        var root=item.dataset.root;
        //add functionality to delete item
    //    console.log(item);
        var numRows= document.getElementById('tables').lastElementChild.lastElementChild.id;
        if(numRows>0)
        {

            if(data[asin].root.length>1)
            {
                data[asin].root.splice(root,1);
            }
            else
            {
                data.splice(asin,1);
            }
    //       if(i!=0){        element=document.getElementById('0');}
    //   else {
    //        element=document.getElementById('1');}
            element=document.getElementById('0');
    //    console.log(element);
        if(element){
            var x=0;
            while(element && element.hasChildNodes){
                if(x==i)
                    element=element.nextElementSibling;
                if(element){
                    nameElements(element,x); 


            element=element.nextElementSibling;}
                x++;
            }
        }
            document.getElementById("tables").deleteRow(i+1);
        }
        else{
            status('Cannot Delete Last Item',1);
        }
    //    console.log(data);


        console.log(data);
    }
}

//open new page to see root file
//editable file?
function download(){
    window.open('src/redirects.json',"_self");
}

//show more details about item
function more(i){
   //alert("Show more details about item "+i);
    var obj=document.getElementById(i);
    var asin=obj.dataset.asin;
    var root=obj.dataset.root;
    var keyword=obj.dataset.keyword;
    modal(asin,root);
}

function modal(asin,root,keyword){
    var modal=document.getElementById('modal');
    show(modal);
    modal.dataset.asin=asin;
    modal.dataset.root=root;
    document.getElementById('modal-asin').value=        data[asin].asin;
    document.getElementById('modal-root').value=    data[asin].root[root].name;
    var base=document.getElementById('modal-keyword');
    //first row
    var row=base.firstElementChild.firstElementChild.cloneNode(true);
    
    base.firstElementChild.innerHTML="";
    base.firstElementChild.append(row);
    for(var i=0;i<data[asin].root[root].keywords.length;i++)
    {
        row=newKeywordRow(data[asin].root[root].keywords[i].name,i);
       if(i==0){
            base.firstElementChild.removeChild(base.firstElementChild.firstElementChild);
        } 
        
            base.firstElementChild.append(row);
        
            
    }
    document.getElementById('modal-redirect').value=    data[asin].url;
    
    document.getElementById('modal-clicks').value=    data[asin].root[root].clicks;
   
    document.getElementById('modal-max').value=    data[asin].root[root].max_clicks;
    //make list of users
    
    var usersArr= data[asin].root[root].users
    var users="";
   for(var i=0;i<usersArr.length;i++)
       {
           
           users+=usersArr[i];
           if(i!=usersArr.length-1)
               {users+=", ";}
       }
    document.getElementById('modal-users').value=users;
}


function closeModal(){
    hide(document.getElementById('modal'));
}


//
function addKeyword(name=""){
    var element=document.getElementById('modal');
    var asin=element.dataset.asin;
    var root=element.dataset.root;
//    var num=data[asin].root[root].keywords.length;
    var num = document.getElementById('modal-keyword').firstElementChild.lastElementChild.dataset.keyword;
    num=parseInt(num)+1;
    var keyword=new Keyword(name);
    document.getElementById('modal-keyword').firstElementChild.append( newKeywordRow(keyword.name,num));
}

//input=text , i=index
function newKeywordRow(input="",i=-1){
    if(i!=-1){
        var base=document.getElementById('modal-keyword');
        var original= base.firstElementChild.lastElementChild;
        var row=original.cloneNode(true);
        var index=row.dataset.keyword;
        row.dataset.keyword= i;
        
        row.lastElementChild.firstElementChild.value=input;
        //log(row);
        return row;
    }
    
}
//x=keyword index
//only visual, must click update to change data
function removeKeywordRow(x=0){
    var modal=document.getElementById('modal');
    var base=document.getElementById('modal-keyword');
    var row=base.firstElementChild.firstElementChild; 
   log(x); if(base.firstElementChild.lastElementChild.dataset.keyword!=0){
        for(var i=0;i<x;i++)
            {
                row=row.nextElementSibling;
            }
        base.firstElementChild.removeChild(row);
        renameModalKeywords();
    }
    else{
        status("Cannot Remove Last Keyword",1);
    }
}
//x=keyword index
//remove from data
function removeKeyword(x=0){
    var modal=document.getElementById('modal');
    var asin=modal.dataset.asin;
    var root=modal.dataset.root;
   var base=document.getElementById('modal-keyword'); 
    //if last remaining row = not allowed
    if(base.firstElementChild.lastElementChild.dataset.keyword!=0){
        //if within data range - delete keyword
        if(x<data[asin].root[root].keywords.length)
        {
            var row=base.firstElementChild.firstElementChild; 


            for(var i=0; i<=x; i++){
                if(row.dataset.keyword==x)
                    {
                        var asin=modal.dataset.asin;
                        var root=modal.dataset.root; data[asin].root[root].keywords.splice(i,1); base.firstElementChild.removeChild(row);
                        renameModalKeywords();
                        return row;
                    }
                else{
                    //skip
                    row=row.nextElementSibling;
                }
                    //log(row.dataset.keyword);
            }
        }   
       else{
          removeKeywordRow(x); 
       }
    }
    else{
        status("Cannot Remove Last Keyword",1);
    }
    
}
function updateKeyword(e){
    
    var input=e.value;
    var index= e.parentElement.parentElement.dataset.keyword;
    var modal=document.getElementById('modal')
    var asin=modal.dataset.asin;
    var root=modal.dataset.root;
    data[asin].root[root].keywords[index].name=input;
    
}
//change modal keywords list index values
function renameModalKeywords(){
    var modal=document.getElementById('modal');
    var keywords=document.getElementById('modal-keyword');
    var row=keywords.firstElementChild.firstElementChild;
    var i=0;
    while(row){
        row.dataset.keyword=i;
        row=row.nextElementSibling;
        i++;
    }
    
}

function asin(id){
    var base=document.getElementById('modal-roots');
     log(base);
    var asin=document.getElementById(id).dataset.asin;
    var modal=document.getElementById('asin');
    show(modal);
    document.getElementById('asin-asin').innerHTML= data[asin].asin;
    modal.dataset.asin= asin;
    //clear previous data
    var row= base.firstElementChild.firstElementChild.cloneNode(true);
    //log(row);
    //log(base.firstElementChild);
    base.innerHTML="";
    base.firstElementChild.append(row);
    //log(base);
    //add rows
    for(var i=0;i<data[asin].root.length;i++){
        base.firstElementChild.append(newRootRow(data[asin].root[i].name,i));
         if(i==0){
            base.firstElementChild.removeChild(base.firstElementChild.firstElementChild);
        } 
    }
}
function newRootRow(name="",i){
    
    var base= document.getElementById('modal-roots').firstElementChild.lastElementChild.cloneNode(true);
    log(base);
    base.dataset.root=i;
    base.innerHTML=name;
    //log(base);
    return base;
}
function closeASIN(){
    hide(document.getElementById('asin'));
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
//hide element with css class
function hide(e){
    e.classList.add("Hide");
}
//show element with css class
function show(e){
    e.classList.remove("Hide");
}
//console.log message (multiple arguments gives multiple lines)
function log(message){
    var msg=message;
    for (i = 1; i < arguments.length; i++) {
        msg+="\n"+arguments[i];
    }
    console.log(msg);
}
//popup with timeout (default 1000)
function message(msg, timeout=1000){
    var notification = new Notification("Message", {body: msg});
setTimeout(function() {notification.close()}, timeout);
}
function status(msg,code=0, time=1500){
    var status=document.getElementById("status");
    status.classList.remove('button4');
    status.classList.remove('button3');
    status.classList.remove('button1');
    
    status.innerHTML=msg;
    status.classList.remove("Hide");
    setTimeout(function(){status.classList.add("Hide");},time);
    switch (code){
        case 0: status.classList.add('button4');break;
        case 1: status.classList.add('button3');break;
        case 2: status.classList.add('button1');break;
    }
}