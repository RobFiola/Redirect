function ASIN(asin, root="", keyword=""){
    this.asin= asin;
    this.url= "";
    this.root= [new Root(root,keyword)];
    this.createURL=function(asin, root, keyword){
        
       return "amazon.com?field-asin="+asin+"&field-keyword"+keyword; 
    };
    //returns t/f the click limit has been met
    this.addClick=function(root=0, keyword=0){
        return root[root].keywords[keyword].addClick();
    };
    this.getASINObject=function(asin){
        var obj;
        if(asin){
            obj=new ASIN(asin.asin);
            obj.url=asin.url;
            for(var i=0;i<asin.root.length;i++){
                obj.root.push(getRootObject(asin.root[i].name));
            }
        }
        else
            return new ASIN();
        return obj;
    }
}
function Root(name="",keyword=""){
    this.name=name;
    this.path="";
    this.setName= function(root){
        name=root;
        path=root+".opendoordeals.com";
    };
    this.keywords=[new Keyword(keyword)];
    this.users=[];
    //default US
    this.country="US";
    
    this.getTotalClicks=function(){
        //calculate
        var total=0;
        for(var i=0;i<keywords.length;i++){
            total+=keywords[keyword].getKeywordClicks();
        }
        return total;
    };
    //returns t/f the click limit has been met
    this.addClick=function(keyword=0){
        return keywords[keyword].addClick();
    };
    this.getRootObject=function(root){
        var obj;
        if(root){
            obj=new Root(root.name);
            obj.path=root.path;
            obj.country=root.country;
            obj.users=root.users;
            for(var i=0;i<root.keywords.length;i++){
                obj.keywords.push(getKeywordObject(root.keywords[i].name));
            }
        }
        else
            return new Root();
        return obj;
    }
}
function Keyword(name=""){
    this.name=name;
    this.link="";
    this.clicks=[];
    this.clicks.push(0);
    this.max_clicks=0;
    this.getKeywordClicks=function(){
        var total=0;
         for(var i=0;i<this.clicks.length;i++){
            total+=this.clicks[i];
        }
        return total;
    };
    //returns t/f the click limit has been met
    this.addClick=function(){
        ++this.clicks;
        return this.clicks>=max_clicks;
        //check for max clicks
    };
    this.getKeywordObject=function(keyword){
        var obj;
        if(keyword){
            obj=new Keyword(keyword.name);
            obj.link=keyword.link;
            obj.clicks=keyword.clicks;
            obj.max_clicks=keyword.max_clicks;
        }
        else
            return new Keyword();
        return obj;
    }
    
    /*this.toString(){
        var str="";
        str+="{\n 'name':"+this.name+',';
        str+="\n 'link':"+=this.link+=', ';
        str+="\n 'clicks':[";
        for(var i=0;i<this.clicks.length;i++){
            str+=""+this.clicks[i];
            if(i<this.clicks.length-1)
               str+=', '; 
        }
        str+="],";
        str+="\n 'max-clicks':"+this.max_clicks;
        str+="}
        return this.name;
    }*/
}