
var data=[];
var filename='redirects.json';

//Grab all data from json file and display in table
openJSON("src/js/"+filename);

//>>update html redirect files >>PATCH
//create new html redirect file when new item created >>AWS >>Lambda>>S3 Bucket file copy and edit >>PUT
//update data file >>PATCH

/*on document ready*/
$(document).ready(function() {
    //get content from file
    data=sortData(myJSON);//put content in array of objects
    tableData();//show data in table
    listeners();
    $('[data-toggle="tooltip"]').tooltip();
    
    $('.pd').click(function( event ){
            event.preventDefault();});
    $('.nav-link').click(function( event ){
            event.preventDefault();});
    $('.dropdown-item').click(function( event ){
            event.preventDefault();});
    $('#input-asin').on('change',function(event){
        
        var input=this.value;
        log(input);
        $('#input-root').val(input.substr(input.length-3,3));
    });
    $('.em').text('.opendoordeals.com');
});
/*add listeners to all editable items*/
function listeners(){
    document.getElementById('input-asin').addEventListener('keyup',function(event){
        event.preventDefault();
        if(event.keyCode===13){
            document.getElementById('accept').click();
        }
    });
    document.getElementById('input-root').addEventListener('keyup',function(event){
        event.preventDefault();
        if(event.keyCode===13){
            document.getElementById('accept').click();
        }
    });
    document.getElementById('input-file').addEventListener('keyup',function(event){
        event.preventDefault();
        if(event.keyCode===13){
            document.getElementById('open').click();
        }
    });
    document.getElementById('dialog-confirm').addEventListener('keyup',function(event){
        event.preventDefault();
        if(event.keyCode===13){
            document.getElementById('confirm').click();
        }
    });
    
    $('.navbar-nav>li>a').on('click',function(){
        $('.navbar-collapse').collapse('hide');
    });
    
}
function update(e){
    log('update:');
    log(e);
    var modal=document.getElementById('modal-root');
    var asin=modal.dataset.asin;
    var root=modal.dataset.root;
    //update data
    data[asin].asin=document.getElementById('modal-asin').value;
    
    data[asin].root[root].name=(document.getElementById('modal-sub').value);
    data[asin].root[root].country=(document.getElementById('modal-country').value);
    
    var keywords=document.getElementById('modal-keyword');
    var line=keywords.firstElementChild.firstElementChild;
    var numKeywords= parseInt(keywords.firstElementChild.lastElementChild.dataset.keyword)+1;
    var keywordsArray=data[asin].root[root].keywords;
    //make new array
    var newKeywords=[];
    
    for (var i=0;i<numKeywords;i++){
        var input= line.firstElementChild.nextElementSibling.firstElementChild.value;
        //if empty
        if(i==0 && input=="" && numKeywords==1)
            {
                newKeywords.push(new Keyword(""));
                data[asin].root[root].keywords[i].max_clicks= line.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.value;
            }
        else if(input!="")
        {
            newKeywords.push(new Keyword(input));
            newKeywords[newKeywords.length-1].max_clicks= line.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.value;
        }
       
        line=line.nextElementSibling;
    }
    data[asin].root[root].keywords=newKeywords;
    //>>keywords
    if(data[asin].root[root].keywords.length>0)
        data[asin].root[root].keywords[0].link=document.getElementById('modal-redirect').value;
    //data[asin].root[root].keywords[0].clicks=document.getElementById('modal-clicks').value;
     
     //>>link
    updateLink(asin,root,0);
    //>>users array
    var users=document.getElementById('modal-users').value.split(',');
    
    data[asin].root[root].users=users;
    //log(data);
    $('#modal1').modal('hide');
    tableData();
}
//generate super url from data
function updateLink(asin=0,root=0,keyword=0){
    //>>generateSuperURL
    var link=data[asin].url;
    log(data[asin].root[root]);
    var keywords=data[asin].root[root].keywords[keyword].name;
    
    link+="?keywords="+keywords;
    data[asin].root[root].keywords[keyword].link=link;
    //>>send link to server files
    return link;
}

//open file dialog
function fileDialog(){
    $('#open-file').modal('show');
}
function openFile(){
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      status("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('input-file');
    if (!input) {
      log("Couldn't find the fileinput element.");
        status("Couldn't find the fileinput element.");
    }
    else if (!input.files) {
      log("This browser doesn't seem to support the `files` property of file inputs.");
        status("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      log("Please select a file before clicking 'Load'");
        status("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      let lines = e.target.result;
      var newArr = JSON.parse(lines); 
        log(newArr);
    }
  
}

/*save to JSON file*/
//update html redirect files
function saveFile(file) {
    saveAs(new Blob(
                [JSON.stringify(data,null, 3)], 
                {type: 'application/json'}), 
            file);
    //upload file to S3 bucket
}

function save(){
    log('save');
    status("Not Functional" , 1);
    //log(JSON.stringify(data,null,2));
    saveFile(file);
    //var json = JSON.stringify(data);
    //var fs = new 
    //fs.writeFile('src/js/redirects.json', json, 'utf8', callback);
    // step 2: convert data structure to JSON
    //$.post("src/json.php", {json : JSON.stringify(data)});
    //status('Saved',2);
}
function saveRow(item){
    //***//
    hide(item.lastElementChild);
    show(item.lastElementChild.previousElementSibling)
}



/*display data in table*/
function tableData(){
    //index of row
    var row=-1;
    var table=document.getElementById('tables');
    
    var tempRow=duplicateRow(0).cloneNode(true);
    
    //clear table data
    table.firstElementChild.nextElementSibling.innerHTML="";
    table.firstElementChild.nextElementSibling.appendChild(tempRow);
     var tableRow=document.getElementById('0');
    
    //ASINS
    for(var i=0;i<data.length;i++){
        //console.log("i="+i);
        var asin=data[i];
        //SUBDOMAINS
        for(var j=0;j<asin.root.length;j++){
            //new line for each subdomain
           //log("root="+j+",asin="+i);
             
            //erase first row
            duplicateRow(++row);
            if(row==0){
                 var parent=document.getElementById('tables').firstElementChild.nextElementSibling;
                 //log(parent);//parent
                //log(parent.firstElementChild);//child
                 parent.removeChild(parent.firstElementChild);
             }   
           var parent= document.getElementById(row); 
            parent.dataset.asin=i;    
            parent.dataset.root=j;
            var sibling= parent.firstElementChild.nextElementSibling;
            //log(asin.root[j].keywords[0].link);
            
            sibling.firstElementChild.nextElementSibling.nextElementSibling.setAttribute('title',asin.root[j].keywords[0].link);
                sibling.firstElementChild.nextElementSibling.nextElementSibling.setAttribute('href',asin.root[j].keywords[0].link);
            sibling=sibling.nextElementSibling;
            //root
            sibling.firstElementChild.innerHTML=asin.root[j].name;
            sibling=sibling.nextElementSibling;
            //asin    
            sibling.firstElementChild.innerHTML=asin.asin;
                sibling=sibling.nextElementSibling;
            //keyword    
            sibling.firstElementChild.innerHTML=asin.root[j].keywords[0].name;
                
                //sibling.firstElementChild.innerHTML=asin.root[j].keywords[0].link;
            //link   
            
            
//            sibling.firstElementChild.innerHTML='View';
            
                
         
        }
        
    
    }
//     $('[data-toggle="tooltip"]').tooltip();

    
}
/* duplicate a new Row */
function duplicateRow(i){
    var original=document.getElementById('0');
    //log(original);
    var row=original.cloneNode(true);
        rowID(row, i);
    //blank values
        var sibling=row.firstElementChild; 
    
    sibling=sibling.nextElementSibling.nextElementSibling;
        sibling.firstElementChild.innerHTML="";
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.innerHTML="";
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.innerHTML="";/*
        sibling=sibling.nextElementSibling;
        sibling.firstElementChild.innerHTML="";*/
    
        
    original.parentElement.appendChild(row);
    return row;
    
}
//open modal to add new ASIN
function openNew(){
    $('#input-asin').val('');//clear asin value
     
    
    $('#input-root').val('');//clear root value
    asinDataList();//make option list
    //>>enter unique subdomain name
    $('#modal3').modal();//open modal
    $('#input-asin').focus();
}
//on modal close->call addItem(asin,root)
function inputAsin(){
    var asin=$('#input-asin').val();//grab asin value
    var root=$('#input-root').val();//grab root value
    //log("asin: "+asin);
    addItem(asin, root);
    
}
//check if subdomain name already exists
function subdomainExists(sub){
   
    for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].root.length;j++){
            if(sub==data[i].root[j].name)
                {return true;}
        }
    }
    return false;
}

/*create new item and display on table*/
function addItem(asin=null, root=""){
    if (asin !== null && asin != "") {//check input for asin
            var found=-1;//will hold index of asin found
            for (var i=0;i<data.length;i++){
                if(data[i].asin==asin)
                    {
                        found=i;
                    }
            }
            if(!subdomainExists(root)){//subdomain does not exist
                
                if(found==-1){//if not found - new asin
                    data.push(item=new ASIN(asin, root));
                }
                else{//add to asin
                        data[found].root.push(item=new Root(root));
                }
                var row=duplicateRow(data.length, data[data.length-1]);
                
                log('add Item');
            }
            else if(root=="" && found>=0){
                
                //no input for root and asin found
                data[found].root.push(item=new Root());//add blank root
            }
            else{
                status('Subdomain already exists. Enter Unique Subdomain name',1);
            }
            tableData();
            //document.getElementById(data.length);
            //log(data);
        }

       
        
    else{
        status('No Item Added',2);
        log('item not added','asin:'+asin,'root:'+root);
    }
}

/* create dropdown datalist for input-asin */
function asinDataList(){
    var dataList=document.getElementById('skulist');
    dataList.innerHTML="";
    for(var i=0;i<data.length;i++)
   { 
       var option = document.createElement('option');
        option.value = data[i].asin;
       dataList.appendChild(option);
   }
}


/* change id of table rows */
function rowID (item, i){
        item.id=i;
        var sibling=item.firstElementChild;
        sibling.innerHTML=parseInt(i)+1;
}

//open modal to confirm delete
function confirmDelete(id){
    if(data.length!=0){
    var dialog=$('#dialog-confirm');
    dialog.modal();
    var item=document.getElementById(id);
    var root=item.dataset.root;
    var asin=item.dataset.asin;
    dialog.data('asin', asin);
    dialog.data('root', root);
    
    var name=data[asin].asin;
    var sub=data[asin].root[root].name;
    
    
    $('#span-id').html('<p> product sku:'+name +'</p><p>'+
                      'subdomain:'+sub+'</p>');
      }
    else{
        status('There are no items to delete',1);
    }
}
function confirmDelete(asin,root){
    if(data.length!=0){
    var dialog=$('#dialog-confirm');
    dialog.modal();
    dialog.data('asin', asin);
    dialog.data('root', root);
    var name=data[asin].asin;
    var sub=data[asin].root[root].name;
    
    
    $('#span-id').html('<p> product sku:'+name +'</p><p>'+
                      'subdomain:'+sub+'</p>');
        }
    else{
        status('There are no items to delete',1);
    }
}
/* remove item from table and data */
function deleteItem(asin,root){
    
    //check more than only 1 row
        var numRows= document.getElementById('tables').firstElementChild.nextElementSibling.lastElementChild.id;
        if(numRows>0)
        {
            //if not the last root
            if(data[asin].root.length>1)
            {
                data[asin].root.splice(root,1);
            }//remove whole asin
            else
            {
                data.splice(asin,1);
            }
            
            var element=document.getElementById('0');
            if(element){
//                var x=0;
//                while(element && element.hasChildNodes){
//                    if(x==i)
//                        element=element.nextElementSibling;
//                    if(element){
//                        nameElements(element,x); 
//
//
//                element=element.nextElementSibling;}
//                    x++;
//                }
                status('Item Deleted',3);
                
                
            }   
            
        }
        else{
            duplicateRow('0');
            //var parent=;
            var child=document.getElementById('0').parentElement.firstElementChild;
            
            
            child.parentElement.removeChild(child);
            data.splice(0,1);
           
            status('Item Deleted',3);
        }

         tableData();
        //console.log(data);
    
    
}

//open new page to see root file
//editable file?
function viewSource(){
    log('View Source');
    window.open('json.html?file='+filename,"_blank");
}

//show more details about item
function more(i){
    if(data.length==0){openNew();}
    else{
   //alert("Show more details about item "+i);
    $('#modal1').modal('show');
    var obj=document.getElementById(i);
    var asin=obj.dataset.asin;
    var root=obj.dataset.root;
    var keyword=obj.dataset.keyword;
    modal(asin,root);
    }
}
function getKeywordClicks(asin, root, keyword){
    log(data[asin].root[root].keywords[keyword].clicks);
    var clicks=data[asin].root[root].keywords[keyword].getKeywordClicks();
    return clicks;
}
function getTotalClicks(asin, root){
    var clicks=data[asin].root[root].getTotalClicks(keyword);
    return clicks;
}

function modal(asin,root){
    
        //log('open modal-root', 'asin='+asin,'root='+root);
        var modal=document.getElementById('modal-root');
        //show(modal);
        modal.dataset.asin=asin;
        modal.dataset.root=root;
        document.getElementById('modal-asin').value=data[asin].asin;
        document.getElementById('modal-sub').value=    data[asin].root[root].name;
        document.getElementById('modal-country').value=data[asin].root[root].country;
        
        var base=document.getElementById('modal-keyword');
        //first row
        var row=base.firstElementChild.firstElementChild.cloneNode(true);

        base.firstElementChild.innerHTML="";
        base.firstElementChild.append(row);

        document.getElementById('modal-redirect').value= data[asin].url;

        //make list of users
        var usersArr= data[asin].root[root].users;
        var users="";
       for(var i=0;i<usersArr.length;i++)
           {

               users+=usersArr[i];
               if(i!=usersArr.length-1)
                   {users+=", ";}
           }
        document.getElementById('modal-users').value=users;

        for(var i=0;i<data[asin].root[root].keywords.length;i++)
        {
            row=newKeywordRow(data[asin].root[root].keywords[i].name,i);
             row.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.value=    getKeywordClicks(asin, root, i);//data[asin].root[root].keywords[i].clicks;
            row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.value= data[asin].root[root].keywords[i].max_clicks;
           if(i==0){
                base.firstElementChild.removeChild(base.firstElementChild.firstElementChild);
            } 

            base.firstElementChild.append(row);
        }
}


function closeModal(){
    log('close Modal');
    hide(document.getElementById('modal'));
}


//
function addKeyword(name=""){
    log('add Keyword: '+name);
    var element=document.getElementById('modal1');
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
    //log('new Keyword Row: '+i+'='+input);
    if(i!=-1){
        var base=document.getElementById('modal-keyword');
        var original= base.firstElementChild.lastElementChild;
        var row=original.cloneNode(true);
        row.dataset.keyword= i;
        //log(row);
        row.firstElementChild.nextElementSibling.firstElementChild.value=input;
        //log(row);
        return row;
    }
    
}
//x=keyword index
//only visual, must click update to change data
function removeKeywordRow(x=0){
    log('remove Keyword Row:'+x);
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
    log('remove Keyword: '+x);
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
    $('#modal2').modal();
    log('open asin modal: '+id);
    var base=document.getElementById('modal-roots');
    // log(base);
    var asin=document.getElementById(id).dataset.asin;
    var modal=document.getElementById('modal-asin');
    //show(modal);
    document.getElementById('asin-asin').innerHTML= data[asin].asin;
    modal.dataset.asin= asin;
    document.getElementById('modal-url').value=data[asin].url;
    document.getElementById('modal-url').nextElementSibling.dataset.url=data[asin].url;
    //clear previous data
    var parent=base.firstElementChild.firstElementChild;
    var row= parent.firstElementChild.cloneNode(true);
    //log(parent);
    //log(row);
    //log(base.firstElementChild);
    parent.innerHTML="";
    parent.append(row);
    //log(base);
    //add rows
    for(var i=0;i<data[asin].root.length;i++){
        var element=newRootRow(data[asin].root[i].name,i);
        //log(element);
        element.firstElementChild.nextElementSibling.innerHTML=data[asin].root[i].path;
       parent.append(element);
         if(i==0){
            parent.removeChild(parent.firstElementChild);
        } 
    }
}
function newRootRow(name="",i){
    //log('new Root Row: '+i+'='+name);
    var base= document.getElementById('modal-roots').firstElementChild.firstElementChild.lastElementChild.cloneNode(true);
    //ssssssssslog(base);
    base.dataset.root=i;
    base.firstElementChild.innerHTML=name;
    //log(base);
    return base;
}
function closeASIN(){
    log('close ASIN');
    $('#modal2').modal('hide');
}

//sort and group data by asin
function sortByASIN(){
    log('sort by asin');
    var current=0;
    for(var i=0;i<data.length-1;i++){//for every item on the list
       current=0;
        for(var j=1;j<data.length-i;j++){//go through the list up till the last added item
            //find lowest
            //log(data[current].asin,data[j].asin,data[current].asin<data[j].asin);
            if(data[current].asin<data[j].asin){
                
                //remove & add to bottom
                current=j;
            }
        }
        //data.push(data.splice(current,1));
       var temp=data[current];
        data.splice(current,1);
        data.push(temp); 
    }
}
//sort and group data by root
function sortByRoot(){
    log('sort by asin');
    var current=0;
    for(var i=0;i<data.length-1;i++){//for every item on the list
       current=0;
        for(var j=1;j<data.length-i;j++){//go through the list up till the last added item
            //find lowest
            //log(data[current].asin,data[j].asin,data[current].asin<data[j].asin);
            if(data[current].asin<data[j].asin){
                
                //remove & add to bottom
                current=j;
            }
        }
        //data.push(data.splice(current,1));
       var temp=data[current];
        data.splice(current,1);
        data.push(temp); 
    }
    log('sort by root');
    //append rows according to root names
}
function graph(id){
    var base=document.getElementById(id);
    var asin=base.dataset.asin;
    var root=base.dataset.root;
    var url='graph.html?'+
        'asin='+asin+
        '&root='+root+
        '&keyword='+0;
    window.location.assign(url);
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

function status(msg,code=0, time=1500){
    var status=document.getElementById("status");
    status.classList.remove('alert-light');
    status.classList.remove('alert-danger');
    status.classList.remove('alert-success');
    status.classList.remove('alert-warning');
    status.innerHTML=msg;
//    status.classList.remove("Hide");
    
    switch (code){
        case 0: status.classList.add('alert-light');break;
        case 1: status.classList.add('alert-danger');break;
        case 2: status.classList.add('alert-success');break;
        case 3: status.classList.add('alert-warning');break;
    };
    setTimeout(function(){
        switch (code){
        case 0: status.classList.remove('alert-light');break;
        case 1: status.classList.remove('alert-danger');break;
        case 2: status.classList.remove('alert-success');break;
        case 3: status.classList.remove('alert-warning');break;
    };
        status.innerHTML="";
    },time);
}