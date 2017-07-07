/** Created by Amit Kumar Mudgal (MicroStrategy Senior Principal Consultant) 
 *  Date: 6/1/2017
 *  
 * **/
var localscopeLastLvl = "";
//var SrcJSON = "";
var badgePath="../plugins/CokeWidget/style/images/badges";
var selections =[];
 
$( document ).ready(function() {
    var lastClicked = {"lvl":"5"};
    console.log( "ready!");
    //TO-DO Call function to get the data from cookies.
    var response = jQuery.parseJSON( SrcJSON.replace('/"/g','').replace(/'/g,'"'));
    SrcJSON = response;
    console.log(SrcJSON);
    //console.log(response);
    //response=SrcJSON.replace('/"/g','').replace(/'/g,'"'); 
                 
                 for(var i = 0; i < response.length; i++){
                    // console.log(response[i].lvl);
                     for(var j = 0; j < response[i].sel.length; j++){
                    	 //console.log("*************"+response[i].sel[j].nm);
                    	 var imageName ="";
                    	 if(response[i].sel[j].acl=='Y'){  
                    		 imageName = response[i].sel[j].nm; 
                    	 }else{
                    		 if(!(response[i].sel[j].nm.indexOf("_GR") > 0))
                    		   imageName = response[i].sel[j].nm + "_GR";
                    	 }
                         $("<div idDiv=\""+response[i].sel[j].nm +"\" style=\"float: left!important;display: inline!important;\"><figure><img class=\"badgeImage\" id=\""+response[i].sel[j].nm +"\"" +
                         		 " lvl=\"" + response[i].lvl + "\"" + 
                         		 " idNo=\"" + response[i].sel[j].id + "\"" +
                         		 " style=\"max-width: 100%;height: auto;margin:auto;display:block;\""+
                        		 " src=\""+ badgePath +"/"+imageName+".png\"><figcaption style=\"font-weight: bold; font-size: 60%; text-align: center; padding-top: 5px;\">"+response[i].sel[j].nm+"</figcaption><figure></div>").appendTo("div#lvl"+response[i].lvl);
                         
                     }
                 }
          
    $(".badgeImage").click(function(){
    	    var imageClicked="";
	    	//if(!($(this).attr('lvl')>5)){  // REQ1: Last level ie 6 , should not be selectable. 
	        //------------Logic for Level 2-------------------
	        if($(this).attr('lvl')>=2 && $(this).attr('lvl')<=5){
	        	console.log("Logic for Level 2,3,4,5");
	        	//step 1 Check parent.
	        	if(!(checkParentIsChecked($(this).attr('idNo'),$(this).attr('lvl')))){
		        	// CH  step 2 If parent not checked then clear everything
		        	// CH  step 3 check child and reflect changes
	        		// condition if same image is clicked and not sibling.
	        		imageClicked=$(this).attr('src');
	        		console.log("imageClicked variable :: ---------------------------------"+imageClicked);
	        		UncheckAll();
	        	    	
	        	}	
	        }
	        //------------Logic for Level 6-------------------
	        
	        if(($(this).attr('lvl')==6)){
	        	console.log("Logic for Level 6");
	        	//step 1 Check parent.
	        	if(!(checkParentIsChecked($(this).attr('idNo'),$(this).attr('lvl')))){
		        	// CH  step 2 If parent not checked then clear everything
		        	// CH  step 3 check child and select Parent
	        		
	        		UncheckAll();
	        		
	        		SelectParent($(this).attr('idNo'));
	        	}
	        	
	        	// CH  step 2 If parent is checked reflect changes
	        }
    	
	        var image = $(this).attr('src').replace(badgePath+'/','');
	        var activeFlag ="";
	        if($(this).attr('src').indexOf("_GR") != -1){
	        	console.log("Not Grey image" + image);
	        	$(this).attr('src',badgePath+ '/'+ image.replace('_GR.png','.png'));
	            lastClicked.lvl=$(this).attr('lvl');
	            activeFlag="Y";
	        }else{
	        	if($(this).attr('src').indexOf("_GR") == -1){
	        		console.log("Grey image" + image);
		        	$(this).attr('src',badgePath+ '/'+ image.replace('.png','_GR.png'));
		        	activeFlag="N";	
	        	}
	        	
	        }
	       
	        if(!($(this).attr('lvl')>5)){
		        reflectChanges(treeTraverse(response,$(this).attr('lvl'),$(this).attr('idNo'),activeFlag));
		    	console.log("Clicked button "+ $(this).attr('id'));
		        console.log("Inner Tag "+ $(this).attr('src'));
		        console.log("Last level clicked::" + lastClicked.lvl)
		        localscopeLastLvl=lastClicked.lvl;
	        }
	        
        //} 
	        
	        ShowEverything();
    });
    var substringMatcher = function(strs) {
    	//console.log(q+"  "+cb)  ;
  	  return function findMatches(q, cb) {
  		
  	    var matches, substringRegex;

  	    // an array that will be populated with substring matches
  	    matches = [];

  	    // regex used to determine if a string contains the substring `q`
  	    substrRegex = new RegExp(q, 'i');

  	    // iterate through the pool of strings and for any string that
  	    // contains the substring `q`, add it to the `matches` array
  	    $.each(strs, function(i, str) {
  	      
  	      if (substrRegex.test(str)) {
  	        matches.push(str);
  	        console.log("content:"+str);
  	        
  	      }
  	    });
  	    FilterSelections(matches);
  	    //var myVal = $('.typeahead').typeahead('val');
  	   /* var myVal = $('input[id=in]').val();
  	    console.log(myVal);*/
  	    cb(matches);
  	  };
  	};

  	var badges = getAllBadges(); 
  	$('#the-basics .typeahead').typeahead({
  	  hint: true,
  	  highlight: true,
  	  minLength: 1
  	},
  	{
  	  name: 'badges',
  	  source: substringMatcher(badges)
  	});
    function getAllBadges(){
  	var arrBadges=[];
  	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			arrBadges.push(SrcJSON[i].sel[j].nm);
  		}
  	}
  	//console.log(arrBadges);
  	return arrBadges;
  }
    
    $('#in').keyup(function () { if(document.getElementById('in').value ==""){
    	ShowEverything();
    } });
    
});

var treeTraverse = function(SrcJSON,lvl_Clicked,itmClcked,activeFlag){
	//console.log("::::treeTraverse(Level Clicked):::"+lvl_Clicked);
	//console.log("::::treeTraverse(Item Clicked):::"+itmClcked);
	//console.log("::::treeTraverse (JSON):::"+SrcJSON[1].lvl);
	var JSONObjSel=[];
	var arrObj=[];
	//Push down logic
	for(var i = 0; i < SrcJSON[lvl_Clicked].sel.length; i++){
		if(SrcJSON[lvl_Clicked].sel[i].pl==itmClcked){
			//console.log(SrcJSON[lvl_Clicked].sel[i].id + " Activated ??" + activeFlag);
			item = {};
            item["id"] = SrcJSON[lvl_Clicked].sel[i].id; 			
		    item["flg"] = activeFlag;
		    arrObj.push([SrcJSON[lvl_Clicked].sel[i].id,activeFlag]);
		    JSONObjSel.push(item);
		}
	}
	if(lvl_Clicked<5){
		lvl_Clicked++;
		for(var i=0;i<JSONObjSel.length;i++ ){
			arrObj.push.apply(arrObj,treeTraverse(SrcJSON,lvl_Clicked,JSONObjSel[i].id,activeFlag));
		}
	}
	//console.log(arrObj);
	return arrObj;
}

function reflectChanges(ActionArrObj){
	for(var i = 0; i < ActionArrObj.length; i++){
		//console.log(ActionArrObj[i][0] + ","+ActionArrObj[i][1]);
		//console.log($('img[idNo='+ActionArrObj[i][0]+']').attr('src'));
		var image = $('img[idNo='+ActionArrObj[i][0]+']').attr('src').replace(badgePath+'/','');
		if(ActionArrObj[i][1]=="Y" && (image.indexOf("_GR") != -1)){  
			$('img[idNo='+ActionArrObj[i][0]+']').attr('src',badgePath+ '/'+ image.replace('_GR.png','.png'));
		}else{
			 if(image.indexOf("_GR") == -1){
				 $('img[idNo='+ActionArrObj[i][0]+']').attr('src',badgePath+ '/'+ image.replace('.png','_GR.png'));	 
			 }
		}
	}
}

function SaveVals(){
     
	console.log($('img[idNo]').length + "," +localscopeLastLvl);
	//document.cookie = "ctracker="+localscopeLastLvl+"; path=/";
	alert("Changes Applied");
	document.getElementById('nav-container').focus();
	formatAnswer(SrcJSON,1);
	/*$('#myModal').css({
        'display': 'none'
    });*/
	document.cookie = "selections="+selections+"; path=/";
}

function getCookieVal(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
      //  	console.log(c);
      //  	console.log(c.substring(name.length, c.length).replace('/"/g','').replace(/'/g,'"'));
        	var retStr = c.substring(name.length, c.length).replace('/"/g','').replace(/'/g,'"');
            return retStr.substring(1,retStr.length-1);
        }
    }
    return "";
}

var formatAnswer = function(SrcJSON,lvl){
	var JSONObjSel=[];
	var arrObj=[];
	var finalString ="";
	//Push down logic
	var strBuilder = "";
	var strBuilder6="";
	var strBuilder5="";
	var strBuilder4="";
	var strBuilder3="";
	var topChain="1";
	for(var i = 0; i < SrcJSON[lvl].sel.length; i++){
		if(!($('img[idNo='+SrcJSON[lvl].sel[i].id +']').attr('src').indexOf('_GR') > 0) ){
			
		//	console.log(SrcJSON[lvl].sel[i].id + ' ' + $('img[idNo='+SrcJSON[lvl].sel[i].id +']').attr('src'));
			//var strBuilderLvl2 = strBuilderLvl1 + "," + SrcJSON[lvl].sel[i].id;  // Level 2
			strBuilder = "100," + SrcJSON[lvl].sel[i].id;
			element=SrcJSON[lvl].sel[i].id;
			console.log("Level 2:"+element);
			if(doesChildExist(SrcJSON,lvl+1,element)){
				for(var j = 0; j < SrcJSON[lvl+1].sel.length; j++){ // Level 3
					console.log("Does "+SrcJSON[lvl+1].sel[j].id + " belong in list ?");
					if(!($('img[idNo='+SrcJSON[lvl+1].sel[j].id +']').attr('src').indexOf('_GR') > 0)&& childrenList(SrcJSON,lvl+1,element).indexOf(SrcJSON[lvl+1].sel[j].id) > 0){
			//		  console.log(doesChildExist(SrcJSON,lvl+1,element));
			//		  console.log("Level 3:::"+ SrcJSON[lvl+1].sel[j].id + ' ' + $('img[idNo='+SrcJSON[lvl+1].sel[j].id +']').attr('src'));
					  element=SrcJSON[lvl+1].sel[j].id;
					  strBuilder3 = strBuilder + "," + SrcJSON[lvl+1].sel[j].id;
					  console.log("Level 3: "+element);
					  if(doesChildExist(SrcJSON,lvl+2,element)){
						  for(var k = 0; k < SrcJSON[lvl+2].sel.length; k++){ // Level 4
							  console.log("Check for::"+SrcJSON[lvl+2].sel[k].id);		  
							  if(!($('img[idNo='+SrcJSON[lvl+2].sel[k].id +']').attr('src').indexOf('_GR') > 0)&& childrenList(SrcJSON,lvl+2,element).indexOf(SrcJSON[lvl+2].sel[k].id) > 0){
			//					  console.log("Level 4:::"+ SrcJSON[lvl+2].sel[k].id + ' ' + $('img[idNo='+SrcJSON[lvl+2].sel[k].id +']').attr('src'));
								  element=SrcJSON[lvl+2].sel[k].id;
								  strBuilder4 = strBuilder3 + "," + SrcJSON[lvl+2].sel[k].id;
								  console.log("Level 4: "+element);
								  if(doesChildExist(SrcJSON,lvl+3,element)){
									  for(var l = 0; l < SrcJSON[lvl+3].sel.length; l++){ // Level 5
										  console.log("Check for::"+SrcJSON[lvl+3].sel[l].id);
										  if(!($('img[idNo='+SrcJSON[lvl+3].sel[l].id +']').attr('src').indexOf('_GR') > 0)&& childrenList(SrcJSON,lvl+3,element).indexOf(SrcJSON[lvl+3].sel[l].id) > 0){
			//								  console.log("Level 5:::"+ SrcJSON[lvl+3].sel[l].id + ' ' + $('img[idNo='+SrcJSON[lvl+3].sel[l].id +']').attr('src'));
											  element=SrcJSON[lvl+3].sel[l].id;
											  strBuilder5 = strBuilder4 + "," + SrcJSON[lvl+3].sel[l].id;
											  console.log("Level 5: "+element);
											  if(doesChildExist(SrcJSON,lvl+4,element)){
												  for(var m = 0; m < SrcJSON[lvl+4].sel.length; m++){ // Level 4
													  console.log("Check for::"+SrcJSON[lvl+4].sel[m].id);
													  if(!($('img[idNo='+SrcJSON[lvl+4].sel[m].id +']').attr('src').indexOf('_GR') > 0)&& childrenList(SrcJSON,lvl+4,element).indexOf(SrcJSON[lvl+4].sel[m].id) > 0){
														  strBuilder6 = strBuilder5 + "," + SrcJSON[lvl+4].sel[m].id;
				//										  console.log("Level 6:::"+ SrcJSON[lvl+4].sel[m].id + ' ' + $('img[idNo='+SrcJSON[lvl+4].sel[m].id +']').attr('src'));
														  console.log("-------------------------------"+strBuilder6);
														  selections.push(strBuilder6);
														  finalString = finalString + strBuilder6 + "\n";
													  }	 
													  strBuilder6="";
													  console.log(strBuilder5);
												  }
											  }else{
												  console.log("-------------------------------"+strBuilder5);
												  selections.push(strBuilder5);
												  finalString = finalString + strBuilder5 + "\n";
											  }
										  }	
										  strBuilder5="";
										  console.log(strBuilder4);
										  element = SrcJSON[lvl+2].sel[k].id;
									  }
								  }else{
									  console.log("-------------------------------"+strBuilder4);
									  selections.push(strBuilder4);
									  finalString = finalString + strBuilder4 + "\n";
								  }
							  }
							  strBuilder4="";
							  console.log(strBuilder3);
							  element = SrcJSON[lvl+1].sel[j].id;
						  }
					  }else{
						  console.log("-------------------------------"+strBuilder3);
						  selections.push(strBuilder3);
						  finalString = finalString + strBuilder3 + "\n";
					  }

					}
					strBuilder3="";
					console.log(strBuilder);
					element=SrcJSON[lvl].sel[i].id;
				}	
			}else{
				// Level 2 Child doesnt exist
				console.log("-------------------------------"+strBuilder);
				selections.push(strBuilder);
				finalString = finalString + strBuilder + "\n";
			}
		}
		strBuilder="";
	}
	/*if(lvl<5){
		lvl++;
		for(var i=0;i<JSONObjSel.length;i++ ){
			arrObj.push.apply(arrObj,treeTraverse(SrcJSON,lvl_Clicked,JSONObjSel[i].id,activeFlag));
		}
	}*/
	console.log(finalString);
	return arrObj;
}

function createExclusionList(){
	console.log('Top Level::'+findTopLevel());
	delete_cookie('topLvl');
	document.cookie = "topLvl="+encodeURIComponent(findTopLevel())+"; path=/";
	var lvl=0;
	var arrExclusion=[];
	var topLevel="1";
	var chain="";
	do{
		for(var i = 0; i < SrcJSON[lvl].sel.length; i++){
			for(var j = 0; j < SrcJSON[lvl].sel.length; j++){
			   if($('img[idNo='+SrcJSON[lvl].sel[j].id +']').attr('src').indexOf('_GR') > 0){
				   if($.inArray(SrcJSON[lvl].sel[j].id, arrExclusion)== -1){
					   chain = chain + findParentChain(SrcJSON[lvl].sel[j].id,SrcJSON)+ 'M';
					   //console.log(chain);
					   arrExclusion.push(SrcJSON[lvl].sel[j].id);
				   }
				   
			   }else{
				   if(topLevel=="1"){
					   topLevel=lvl+1;
					   delete_cookie('ctracker');
					   document.cookie = "ctracker="+topLevel+"; path=/";
				   }
			   }	
			}
		}		
		lvl++;
	}while(lvl<6)
	console.log(chain);	
	delete_cookie('exclude');
	document.cookie = "exclude="+encodeURIComponent(chain)+"; path=/";	
    console.log(topLevel);
}
var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
function findParentChain(element,SrcJSON){
	var level =  Math.round(element/100);
	//console.log(level + " " + element);
	var chain="";
	for(var i=0;i < SrcJSON[level-1].sel.length; i++){
		//console.log('loop elem:: '+SrcJSON[level-1].sel[i].id);
		if(SrcJSON[level-1].sel[i].id==element){
			//console.log(element + ' Found- Loop started Parent is ::' + SrcJSON[level-1].sel[i].pl + ' Level ::' +level );
	        var parent=SrcJSON[level-1].sel[i].pl;
	        var elem = element;
	        var lvl = level;
			do{ 
				lvl--;
				for(var j=0;j< SrcJSON[lvl].sel.length;j++){
					if(SrcJSON[lvl].sel[j].pl=='000'){
						if(chain==''){
							chain='100';
						}else{
							chain='100.'+chain;	
						}
						break;	
					}
					if(elem==SrcJSON[lvl].sel[j].id){
						if(chain!=''){
							chain = SrcJSON[lvl].sel[j].id + '.' + chain ;	
						}else{
							chain = SrcJSON[lvl].sel[j].id;
						}
						elem=SrcJSON[lvl].sel[j].pl;
					}
						
				}
					//chain = chain + '.' + SrcJSON[level].sel[i].pl;
			}while(lvl>0)	
		}
	}
	//console.log(chain);
	return chain;
}

function doesChildExist(SrcJSON,level,element){
	
	for(var i = 0; i < SrcJSON[level].sel.length; i++){
	  if(SrcJSON[level].sel[i].pl==element){
		  return true;
	  }
	}
	return false;
}

function childrenList(SrcJSON,level,element){
	var list ="|";
	for(var i = 0; i < SrcJSON[level].sel.length; i++){
		  if(SrcJSON[level].sel[i].pl==element){
		    list = list + "," + SrcJSON[level].sel[i].id  ;
		  }
	}
	console.log("Child List::"+ list);
	return list;
}

function FilterSelections(selections){
	
		for(var i = 0; i < SrcJSON.length; i++){
	  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
	  			$('div[idDiv=\"'+SrcJSON[i].sel[j].nm +'\"]').attr('style','display:none');
		  	}
	  	}
		for(var i = 0; i< selections.length;i++){
			$('div[idDiv=\"'+selections[i] +'\"]').attr('style','\"float: left!important;display:inline!important;\"');
		}
}

function ShowEverything(){
	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			$('div[idDiv=\"'+SrcJSON[i].sel[j].nm +'\"]').attr('style','\"float: left!important;display:inline!important;\"');
	  	}
  	}
}



function UncheckAll(){
	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			$('div[idDiv=\"'+SrcJSON[i].sel[j].nm +'\"]').attr('style','\"float: left!important;display:inline!important;\"');
  			var image = $('img[idNo='+SrcJSON[i].sel[j].id +']').attr('src').replace(badgePath+'/','');
  			if(!(image.indexOf("_GR") > 0)){
  				$('img[idNo='+SrcJSON[i].sel[j].id+']').attr('src',badgePath+ '/'+ image.replace('.png','_GR.png'));
  			}
	  	}
  	}
}


function checkParentIsChecked(element,lvl){
	console.log('Error is after this'+ lvl + ' ' + element);
	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			if(SrcJSON[i].sel[j].id==element){
  				console.log('Image::'+$('img[idNo='+SrcJSON[i].sel[j].pl +']').attr('src'));
  				if(!($('img[idNo='+SrcJSON[i].sel[j].pl +']').attr('src').indexOf('_GR') > 0)){
  					return true;
  				}else{
  					return false;
  				}
  			}
  			
	  	}
  	}
	return false;
}

function SelectParent(element){
	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			if(SrcJSON[i].sel[j].id==element){
  				if(($('img[idNo='+SrcJSON[i].sel[j].pl +']').attr('src').indexOf('_GR') > 0)){
  					var image = $('img[idNo='+SrcJSON[i].sel[j].pl +']').attr('src').replace(badgePath+'/','');
  					$('img[idNo='+SrcJSON[i].sel[j].pl+']').attr('src',badgePath+ '/'+ image.replace('_GR.png','.png'));
  				}	
  			}
  		}
	}
}

          
function findTopLevel(){
	var lvl=0;
	var retString ="";
	for(var i = 0; i < SrcJSON.length; i++){
  		for(var j = 0; j < SrcJSON[i].sel.length; j++){
  			if(!($('img[idNo='+SrcJSON[i].sel[j].id +']').attr('src').indexOf('_GR') > 0)){
  				console.log(SrcJSON[i].sel[j].id);
  				retString=findParentChain(SrcJSON[i].sel[j].id,SrcJSON);
  				break;
   			}
	  	}
  		if(retString!=''){
				break;
		}
  	}
	return retString;
}