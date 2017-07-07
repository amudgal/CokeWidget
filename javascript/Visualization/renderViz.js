/* Visualization Created by : Amit K Mudgal (Senior Principal Consultant) MicroStrategy Inc
 * Date : 7/3/2017
 * Version : 1.0
 * Client : Coca Cola
*/
var localscopeLastLvl = "";
var SrcJSON = "";
var selections =[];
var badgePath="../plugins/CokeWidget/style/images/badges";
$( document ).ready(function() {
	console.log('Properly rendered the renderViz.js ' + badgePath);
	
});

function ApplyBaseImage(data){
	//console.log(data);
	SrcJSON=createJSON(data);

}

function createJSON(data){
	var SelJSON="";
	var headers=[];var RowsData=[];
	var ID='';var Name='';var Parent='';var Level='';
	for(var i=0;data.cols.length;i++){
		if(typeof(data.cols[i])=='undefined'){
			break;
		}
		headers.push(data.cols[i]+'|'+i);
		//console.log(data.cols[i]);
		
	}
	try{
		for(var i=0;data.rows.length;i++){
			if(typeof(data.rows[i].c[0].v)=='undefined'){
				break;
			}
			RowsData.push(data.rows[i].c[0].v);
			//console.log(RowsData[i]);
			
		}		
	}catch(err){
		//console.log('Moving on..');
	}
    var gSON=[];
    try{
    	var selection=[]; var lvl='';
    	for(var i=0;RowsData.length;i++){
    		//console.log(RowsData[i]);
    		if(typeof(RowsData[i])=='undefined'){
    			break;
    		}
    		
    		//console.log(data.rows[i].c[0].v);
    		//console.log(data.rows[i].c[0].v.split('|')[0]);
    		for(var j=0;headers.length;j++){
    			try{
    	    		  if(headers[j].split('|')[0]=='ID'){
    	    			  ID=RowsData[i].split('|')[j];
    	    		  }
    	    		  if(headers[j].split('|')[0]=='Level'){
    	    			  Level=RowsData[i].split('|')[j];
    	    		  }
    	    		  if(headers[j].split('|')[0]=='Name'){
    	    			  Name=RowsData[i].split('|')[j];
    	    		  }
    	    		  if(headers[j].split('|')[0]=='Parent'){
    	    			  Parent=RowsData[i].split('|')[j];
    	    		  }    				
    			}catch(er){ break;}
     		}
    		
    		var sel = {
    			'id':ID,
    			'nm':Name,
    			'acl':'N',
    			'pl':Parent
    		};

    		if(lvl!=Level){
    			if(Level==1){
        			selection.push(sel);
        			var levelString = {
            				'lvl':Level,
            				'sel':selection
            			};
        			selection=[];
        			gSON.push(levelString);
    			}else{
    				var levelString = {
            				'lvl':lvl,
            				'sel':selection
            			};
                    if(selection.length > 0){
                    	gSON.push(levelString);	
                    }
        			selection=[];
    			}
    		
    			console.log(lvl + ' ' + Level)
    			console.log(ID);
    			lvl=Level;
    		}else{
    			console.log('Not Same::'+ID);
    			selection.push(sel);	
    		}
 		
    	}
    	console.log(lvl);
    	if(lvl==6){
			console.log('Finally put it all in');
			var levelString = {
    				'lvl':Level,
    				'sel':selection
    			};
			gSON.push(levelString);
		}
    	SelJSON=JSON.stringify(gSON);
    	
    }catch(e){
	   console.log(e);
    }
	return SelJSON;
}