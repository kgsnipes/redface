/*
author: kaushik ganguly
email; kgsnipes@gmail.com

*/

//this is a utility to have Object.create() work on browsers that do not support
if(typeof Object.create !=='function'){
	Object.create=function(obj){
		function F(){};
		f.prototype=obj;
		return new F();
	};
}


(function( $ ,window, document,undefined){

var kgg={

	init:function(options,elem)
	{
		self=this;
		self.obj=self;
		self.$elem=$(elem);

		//setting the styles and appending canvas to the div tag
		self.$elem.css({'padding':'10px'});
		self.options=$.extend({},$.fn.kggraph.options,options);

		self.clear();

		self.$canvas=document.createElement("canvas");

		self.$elem.width(self.options.width);
		self.$elem.height(self.options.height);

		$(self.$canvas).appendTo(self.$elem);

		$(self.$canvas).css({'border':'1px solid #e1e8f8','margin-top':'10px','margin-bottom':'10px','border-radius':'5px'});
		self.$elem.css({'border':'3px dashed #eee','margin':'10px','overflow':'auto','border-radius':'5px'});
		
		$(self.$canvas).attr('width',self.options.width);
		$(self.$canvas).attr('height',self.options.height);
		
		if(self.options.type=='pie chart')
		{

			
			self.drawPieChart(self.options.data);
		}
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='number' && self.options.dataTypes[1]=='number' && !self.options.hasTrends)
		{

			
			self.drawPointChart(self.options.data);
		}
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='number' && self.options.dataTypes[1]=='number' && self.options.hasTrends)
		{

			
			self.drawPointChartWithTrends(self.options.data);
		} 
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='string' && self.options.dataTypes[1]=='number' && !self.options.hasTrends)
		{

			
			self.drawPointChartWithTextData(self.options.data,'x');
		}
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='number' && self.options.dataTypes[1]=='string' && !self.options.hasTrends)
		{

			
			self.drawPointChartWithTextData(self.options.data,'y');
		}
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='number' && self.options.dataTypes[1]=='string' && self.options.hasTrends)
		{

			
			self.drawPointChartWithTrendsOfText(self.options.data,'y');
		}
		else if(self.options.type=='point chart' && self.options.dataTypes[0]=='string' && self.options.dataTypes[1]=='number' && self.options.hasTrends)
		{

			
			self.drawPointChartWithTrendsOfText(self.options.data,'x');
		} 


	   

	},
	clearCanvas:function()
	{
		self=this;

		

		//console.log("hello");
		$(self.$canvas).css({'border':'1px solid green'});
		self.$canvas.getContext('2d').clearRect(0, 0, self.options.width, self.options.height);

	},
	clear:function()
	{
		self=this;
		self.$elem.empty();

	},
	randomColor:function(){


		return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);


		/*var r = function () { return Math.floor(Math.random()*256) };
    return "rgba(" + r() + "," + r() + "," + r() + ",1.0)";
*/


	 


	},
	colorShades:function(constantPart,len)
	{
		var retVal=new Array();
		//var rgba_arr=self.replace(self.replace(self.replace(rgba,"rgba",""),"(",""),")","").split(",");
		var increment=16;
		var opacity=1.0;
		var level=64;
		 var temp='rgba(0,0,0,1.0)';
		for(i=0;i<len;i++)
		{
			
			if(level<=256)
			{
				var rgba_arr=self.replace(self.replace(self.replace(temp,"rgba",""),"(",""),")","").split(",");
				if(constantPart==1)
				{
					temp="rgba("+(parseFloat(rgba_arr[0])+level)+",0,0,1.0)";
					//temp="rgba("+parseFloat(rgba_arr[0])+","+parseFloat(rgba_arr[1])+","+parseFloat(rgba_arr[2])+","+opacity.toFixed(1)+")";
				}
				else if(constantPart==2)
				{
					temp="rgba(0,"+(parseFloat(rgba_arr[1])+level)+",0,1.0)";	
				//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
				}
				else if(constantPart==3)
				{
					temp="rgba(0,0,"+(parseFloat(rgba_arr[2])+level)+",1.0)";
				//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
				}
				level+=32;
			}
			else
			{

				var rgba_arr=self.replace(self.replace(self.replace(temp,"rgba",""),"(",""),")","").split(",");
			if(constantPart==1)
			{
				temp="rgba("+parseFloat(rgba_arr[0])+","+(parseFloat(rgba_arr[1])+increment)+","+(parseFloat(rgba_arr[2])+increment)+",1.0)";
				//temp="rgba("+parseFloat(rgba_arr[0])+","+parseFloat(rgba_arr[1])+","+parseFloat(rgba_arr[2])+","+opacity.toFixed(1)+")";
			}
			else if(constantPart==2)
			{
				temp="rgba("+parseFloat(rgba_arr[0]+increment)+","+(parseFloat(rgba_arr[1]))+","+(parseFloat(rgba_arr[2])+increment)+",1.0)";	
			//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
			}
			else if(constantPart==3)
			{
				temp="rgba("+parseFloat(rgba_arr[0]+increment)+","+(parseFloat(rgba_arr[1])+increment)+","+(parseFloat(rgba_arr[2]))+",1.0)";
			//	temp="rgba("+parseFloat(rgba_arr[0])+",0.0,0.0,"+opacity+")";
			}

			//opacity-=0.20;
			increment+=32;
			}

			retVal.push(temp);
		}
		
		//console.log(retVal);
		
		return retVal;
	},
	trim:function(s){

		var l=0; var r=s.length -1;
		while(l < s.length && s[l] == ' ')
		{	l++; }
		while(r > l && s[r] == ' ')
		{	r-=1;	}
		return s.substring(l, r+1);
	},
	replace:function(str,replace_this,replace_with){
	while(str.indexOf(replace_this) > -1){
	str = str.replace(replace_this,replace_with);
	}
	return str;
	},
	sum:function(vals)
	{
		var s=0.0;
		$.each(vals,function()
		{
			s+=this;

		});

		return s;

	},
	max:function(vals)
	{
		var v=vals[0];
		for(i=0;i<vals.length;i++)
		{	
			if(vals[i]>v)
			{
				v=vals[i];
			}
		}
		return v;	
	},
	min:function(vals)
	{
		var v=vals[0];
		for(i=0;i<vals.length;i++)
		{	
			if(vals[i]<v)
			{
				v=vals[i];
			}
		}
		return v;	

	},
	vfd:function(val)//value for drawing
	{
		return Math.floor(val);
		//return val;
	},
	percent:function(val,percent,isvfd)
	{
		var v=0;
		if(val>0)
		{
			v=val*(percent/100.0);
		}

		if(isvfd)
		{
			v=self.vfd(v);
		}
		return v;
	},
	percentage:function(sum,val,isvfd){
		var v=0;
		if(sum>0 && sum>=val)
		{
			if(val==0)
			{
				return 0;
			}
			else
			{
				v=(val*100)/sum;
				if(isvfd)
				{
					v=self.vfd(v);
				}
				return v;
			}

		}
		else
		{
			return 0;
		}
	},
	XYForCanvas:function(percentage)
	{
		self=this;
		var X=0;
		var Y=0;
		if(self.options.width>0 && self.options.height>0)
		{
			X=self.vfd(self.options.width*(percentage/100.0));
			Y=self.vfd(self.options.height*(percentage/100.0));
		}
		

		return {'x':X,'y':Y};
	},
	containsElement:function (arr, ele) {
                var found = false, index = 0;
                while(!found && index < arr.length)
                if(arr[index] == ele)
                found = true;
                else
                index++;
                return found;
            },
    getColors:function(length)
    {
    	var arr=new Array();
    	for(i=0;i<length;i++)
    	{

    			var color='';
    			do
    			{
    				color=self.randomColor();
    				if(color=="#ffffff")
    				{
    					continue;
    				}
    			}while(self.containsElement(arr,color));

    			arr.push(color);
    	}

    	return arr;

    },
    componentToHex:function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	},

	rgbToHex:function (r, g, b) {
	    return "#" + self.componentToHex(r) + self.componentToHex(g) + self.componentToHex(b);
	},
	drawPieChart:function(data) {

		//console.log("drawing it");

		if(self.options.width>self.options.height)
		{
			self.options.width=self.options.height;

			self.$elem.width(self.options.width);
			self.$elem.height(self.options.height);

		$(self.$canvas).attr('width',self.options.width);
		$(self.$canvas).attr('height',self.options.height);
  			
		}
		
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');
		var midPoint=self.XYForCanvas(50);
		var onePercentDegree=self.percent(360,1,false);
		
		var valArr=new Array();
		var dataCopy=new Array();
		for(i=0;i<data.length;i++)
		{
			valArr.push(data[i][1]);
			dataCopy.push(data[i]);
		}
	
		var sum=self.sum(valArr);
		//console.log(sum);
		var piBy180 = 3.14 / 180;

		var startDegree=0;
		var endDegree=0;

		var colors;

		if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			//colors=self.getColors(valArr.length);
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,valArr.length);
			}
			else
			{
				colors=self.getColors(valArr.length);
			}
			
		}
		

		
		
				for (i = 0; i < valArr.length; i++) {

				if(valArr[i]>0)
				{
					
							endDegree = startDegree + self.percentage(sum,valArr[i],false)* onePercentDegree;
			       		 ctx.strokeStyle = colors[i];
			       		 ctx.lineWidth = 5;
						var radius = self.vfd(self.percent(self.options.width,90,true)*0.5);
			 			while (radius >= 0) {
							ctx.beginPath();
				            ctx.arc(midPoint.x, midPoint.y, radius, startDegree * piBy180, endDegree * piBy180, false);
				            ctx.stroke();
				            ctx.closePath();
				            radius -= 1;
				        	
				        }
						startDegree = endDegree;
				}
				 

			}


		
		self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMoveForPieChart(evt,self,colors,dataCopy);}, false);
		
		if(self.options.drawLegend)
			self.drawLegendForPieChart(colors);
		
    
	},
	drawLegendForPieChart:function(colors)
	{
		self=this;
		
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		var htmlStr="<table>";
		var data=self.options.data;
		htmlStr+="<tr>";
		
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+self.options.columnTitles[0];
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+self.options.columnTitles[1];
			htmlStr+="</td>";

		}
		/*else
		{
			htmlStr+="<td>(X - axis)";
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)";
			htmlStr+="</td>";
		}*/
			

		

		htmlStr+="</tr>";

		for(i=0;i<data.length;i++)
		{
			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;<a class=\"graph_section_"+i+"\">"+data[i][0];
			htmlStr+="</a></td>";
			htmlStr+="<td>("+data[i][1]+")";
			htmlStr+="</td>";
			htmlStr+="</tr>";

		}



		htmlStr+="</table>";

		$(htmlStr).appendTo(self.$elem);
		
		//self.$elem.children("table").css({'margin':'0 auto'});
		self.$elem.children("table").css({'margin':'10px','border':'1px solid #eee','border-radius':'5px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+self.$elem.children("table").height()+(self.$elem.children("label").height()*2));

	},
	drawPointChartWithTextData:function(data,axes)
	{
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');
		var fontSizePixel=self.options.fontSize;
		ctx.font=fontSizePixel+"px Arial";
		var fontSizePixelWidth=ctx.measureText("H").width;
		var fontSizePixelHeight=fontSizePixel;
		var xaxistotallabelinglength=0;
		var xaxisslantflag=false;
		var xvals=new Array();
		var yvals=new Array();
		var toFixedPoint=2;
		var xIsText=true;

		if(axes=='y')
		{
			xIsText=false;
		}

		for(i=0;i<data.length;i++)
		{
			xvals.push(data[i][0]);
			yvals.push(data[i][1]);
			
		}

		var xmax=0;
		var ymax=0;
		if(xIsText)
		{
			ymax=self.max(yvals);
			
		}
		else
		{
			xmax=self.max(xvals);
		}
		
		if(xIsText)
		{
			if(ymax>0 && ymax<1)
			{
				v=ymax.toString();
				toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
			}

		}
		else
		{
			if(xmax>0 && xmax<1)
			{
				v=xmax.toString();
				toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
			}
		}
		

		
	//	console.log("toFixedPoint"+toFixedPoint);
	if(xIsText)
	{
		//xmax=xmax+self.percent(xmax,10,false);
		ymax=ymax+self.percent(ymax,10,false);
	}
	else
	{
		xmax=xmax+self.percent(xmax,10,false);
		//ymax=ymax+self.percent(ymax,10,false);
	}
		

		var yaxisLabelMaxLength=0;
		var xaxisLabelMaxLength=0;
	if(xIsText)
	{
		xaxisLabelMaxLength=xvals[0].length*fontSizePixelWidth;
		for(i=0;i<xvals.length;i++)
		{
			if(xaxisLabelMaxLength<(xvals[i].length*fontSizePixelWidth))
			{
				xaxisLabelMaxLength=xvals[i].length*fontSizePixelWidth;
			}
		}

		if(xaxisLabelMaxLength/fontSizePixelWidth<4)
		{
			xaxisLabelMaxLength=5*fontSizePixelWidth;
		}
		yaxisLabelMaxLength=ymax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
		
	}
	else
	{

		yaxisLabelMaxLength=yvals[0].length*fontSizePixelWidth;
		for(i=0;i<yvals.length;i++)
		{
			if(yaxisLabelMaxLength<(yvals[i].length*fontSizePixelWidth))
			{
				yaxisLabelMaxLength=yvals[i].length*fontSizePixelWidth;
			}
		}
		
		
		 xaxisLabelMaxLength=xmax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
	}

		

		var calculatedXorigin=self.vfd(yaxisLabelMaxLength+(fontSizePixelWidth*2));
		var calculatedYorigin=self.vfd(self.options.height-xaxisLabelMaxLength);

		
	    var xxr=0;
	    if(xIsText)
	    {

		    for(i=0;i<xvals.length;i++)
			{
				
					xaxistotallabelinglength+=self.vfd(ctx.measureText(xvals[i]).width);
				
			}
			//xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
	    }
	    else
	    {
	    	for(xxr=self.percent(xmax,10,false);xxr<=xmax;xxr+=self.percent(xmax,10,false))
			{
				
				xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
			   
			   
			}
			xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
	    
	    }
	    

	   /* if(xaxistotallabelinglength>xlength-())
	    {
	    	console.log("here");
	    	 calculatedXorigin=self.vfd(yaxisLabelMaxLength+(fontSizePixelWidth*2));
		 calculatedYorigin=self.vfd(self.options.height-xaxisLabelMaxLength);
	    		
	    }
	    else
	    {

		 calculatedXorigin=self.vfd(yaxisLabelMaxLength+(fontSizePixelWidth*2));
		 calculatedYorigin=self.vfd(self.options.height-fontSizePixel*4);
	    }*/
			

		

		var margin=10;


		//var xorigin=self.vfd(self.options.width*0.20);
	    //var yorigin=self.vfd(self.options.height*0.80);
		
	    var xorigin=self.vfd(calculatedXorigin);
	    var yorigin=self.vfd(calculatedYorigin);
	    //console.log("xorigin :"+xorigin+" yorigin"+yorigin);

	    
	   

	    var ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    var xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));
	    //console.log("ylength :"+ylength);

	    console.log("xaxisLabelMaxLength"+xaxisLabelMaxLength+"xlength"+xlength);

	   


	    console.log("xaxistotallabelinglength"+xaxistotallabelinglength+"xlength"+xlength);


	    if(xaxistotallabelinglength>(xlength-self.percent(xlength,self.percentage(xlength,xlength/xvals.length),false)))
	    {
	    	
			 calculatedYorigin=self.vfd(self.options.height-(xaxisLabelMaxLength*1.5));

		     xorigin=self.vfd(calculatedXorigin);
		     yorigin=self.vfd(calculatedYorigin);

		      ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    	 xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));

	    	 xaxisslantflag=true;

	    }


	    var xaxisLabelxpos=0;
	    var xaxisLabelypos=0;

	    var yaxisLabelxpos=0;
	    var yaxisLabelypos=0;

		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			var xlen=self.vfd(self.options.columnTitles[0].length*fontSizePixelWidth);
			var ylen=self.vfd(self.options.columnTitles[1].length*fontSizePixelWidth);

			if(xlen<xlength)
			{
				xaxisLabelxpos=self.vfd(xorigin+(xlength*0.50));
				xaxisLabelxpos=xaxisLabelxpos-parseInt(xlen*0.50);

			}
			else if(xlen>=xlength)
			{
				var strLen=parseInt(xlength/fontSizePixelWidth);
				//console.log(strLen);
				self.options.columnTitles[0]=self.options.columnTitles[0].substring(0,strLen)+"...";
				//console.log(self.options.columnTitles[0]);
				xaxisLabelxpos=xorigin;


			}

			if(ylen<ylength)
			{
				yaxisLabelypos=self.vfd(yorigin-(ylength*0.50));
				yaxisLabelypos=yaxisLabelypos+parseInt(ylen*0.50);
			}
			else if(ylen>=ylength)
			{
				var strLen=parseInt(ylength/fontSizePixelWidth);
				self.options.columnTitles[1]=self.options.columnTitles[1].substring(0,strLen)+"...";
				yaxisLabelypos=yorigin;
			}

			xaxisLabelypos=self.options.height-fontSizePixelWidth;
			yaxisLabelxpos=fontSizePixelWidth*2;


		}






		// drawing the axes
		ctx.strokeStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin+xlength, yorigin);
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin, yorigin-ylength);
	    ctx.stroke();
	    ctx.closePath();
	    // drawing the axes

	    //paint origin
	    ctx.fillStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.fillText('0', xorigin - fontSizePixelWidth, yorigin+fontSizePixelHeight);
	    ctx.stroke();
	    ctx.closePath();


	    if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,data.length);
			}
			else
			{
				colors=self.getColors(data.length);
			}
			
		}

		//draw grids if requested
		if(self.options.useGrids)			
		{
			if(xIsText)
			{
				var xpercentageGap=self.percentage(xlength,xlength/xvals.length);
				var labelx=xorigin+self.percent(xlength,xpercentageGap,false);
				var labely=yorigin-self.percent(ylength,10,false);
				var count=0;
				var i=0;
				for(i=labelx;i<=(xorigin+xlength);i+=self.percent(xlength,xpercentageGap,false))
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(i, yorigin);
				    ctx.lineTo(i, yorigin-ylength);
				    ctx.stroke();
				    ctx.closePath();
				   // labelx+=self.percent(xlength,10,false);
				    count++;
				}

				if(count<(xvals.length))
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(i, yorigin);
				    ctx.lineTo(i, yorigin-ylength);
				    ctx.stroke();
				    ctx.closePath();
				}

				count=0;
				i=0;
				for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(xorigin, labely);
				    ctx.lineTo(xorigin+xlength, labely);
				    ctx.stroke();
				    ctx.closePath();
				    labely-=self.percent(ylength,10,false);
				    count++;
				}

				if(count<10)
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(xorigin, labely);
				    ctx.lineTo(xorigin+xlength, labely);
				    ctx.stroke();
				    ctx.closePath();
				}
			}
			else
			{
				var ypercentageGap=self.percentage(ylength,ylength/yvals.length);
				var labelx=xorigin+self.percent(xlength,10,false);
				var labely=yorigin-self.percent(ylength,ypercentageGap,false);
				var count=0;
				var i=0;
				for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(labelx, yorigin);
				    ctx.lineTo(labelx, yorigin-ylength);
				    ctx.stroke();
				    ctx.closePath();
				    labelx+=self.percent(xlength,10,false);
				    count++;
				}

				if(count<10)
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(labelx, yorigin);
				    ctx.lineTo(labelx, yorigin-ylength);
				    ctx.stroke();
				    ctx.closePath();
				}

				count=0;
				
				for(i=labely;i>=(yorigin-ylength);i-=self.percent(ylength,ypercentageGap,false))
				{
					//console.log(count);
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(xorigin, i);
				    ctx.lineTo(xorigin+xlength, i);
				    ctx.stroke();
				    ctx.closePath();
				    //labely-=self.percent(ylength,10,false);
				    count++;
				   // console.log(count);
				}

				if(count<yvals.length)
				{
					ctx.strokeStyle = '#eeeeee';
				    ctx.beginPath();
				    ctx.moveTo(xorigin, yorigin-ylength);
				    ctx.lineTo(xorigin+xlength, yorigin-ylength);
				    ctx.stroke();
				    ctx.closePath();
				}
			}
			
		}



		//label the axes
		if(xIsText)
		{
			var xpercentageGap=self.percentage(xlength,xlength/xvals.length);
			var labelx=xorigin+self.percent(xlength,xpercentageGap,false);
			var labely=yorigin-self.percent(ylength,10,false);
			var count=0;
			var i=0;
				for(i=labelx;i<=(xorigin+xlength);i+=self.percent(xlength,xpercentageGap,false))
				{
					ctx.fillStyle = '#396bd5';

					if(xaxisslantflag)
					{
						ctx.save();
					    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
						ctx.rotate(-Math.PI/4);
					    ctx.fillText(xvals[count], 0, 0);
					    ctx.restore();
					}
					else
					{
						ctx.beginPath();
				    	ctx.fillText(xvals[count], i, yorigin+15);
				   	 	ctx.stroke();
				    	ctx.closePath();
					}
					
				    ctx.beginPath();
				    ctx.fillRect(i-2, yorigin-2,4,4);
				    ctx.stroke();
				    ctx.closePath();
				   // console.log("labelx "+labelx+" xlength"+xlength );

				    //labelx+=self.percent(xlength,10,false);
				    count++;
				}
				
				if(count<(xvals.length))
				{
					// console.log("labelx "+labelx+" xlength"+xlength );
					ctx.fillStyle = '#396bd5';

					if(xaxisslantflag)
					{
						ctx.save();
					    ctx.translate(i-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
						ctx.rotate(-Math.PI/4);
					    ctx.fillText(xvals[xvals.length-1], 0, 0);
					    ctx.restore();
					}
					else
					{
						ctx.beginPath();
					    ctx.fillText(xvals[xvals.length-1], i, yorigin+15);
					    ctx.stroke();
					    ctx.closePath();
					}
					
				    ctx.beginPath();
				    ctx.fillRect(i, yorigin-2,4,4);
				    ctx.stroke();
				    ctx.closePath();
				}
			
			
			count=0;
			var yaxisSpacing=new Array();
			for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
			{
				ctx.fillStyle = '#396bd5';
				ctx.beginPath();
			    ctx.fillText(i.toFixed(toFixedPoint).toString(), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
			    yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
			    ctx.stroke();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.fillRect(xorigin-2, labely-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			    labely-=self.percent(ylength,10,false);
			    ++count;
			}

			if(count<10)
			{
				ctx.fillStyle = '#396bd5';
				ctx.beginPath();
			    ctx.fillText(ymax.toFixed(toFixedPoint).toString(), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
			     yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
			    ctx.stroke();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.fillRect(xorigin-2, labely-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			}


		}
		else
		{
			var ypercentageGap=self.percentage(ylength,ylength/yvals.length);
			var labelx=xorigin+self.percent(xlength,10,false);
			var labely=yorigin-self.percent(ylength,ypercentageGap,false);
			var count=0;
			
				for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
				{
					ctx.fillStyle = '#396bd5';

					if(xaxisslantflag)
					{
						ctx.save();
					    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
						ctx.rotate(-Math.PI/4);
					    ctx.fillText(i.toFixed(toFixedPoint).toString(), 0, 0);
					    ctx.restore();
					}
					else
					{
						ctx.beginPath();
				    	ctx.fillText(i.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
				   	 	ctx.stroke();
				    	ctx.closePath();
					}
					
				    ctx.beginPath();
				    ctx.fillRect(labelx-2, yorigin-2,4,4);
				    ctx.stroke();
				    ctx.closePath();
				   // console.log("labelx "+labelx+" xlength"+xlength );

				    labelx+=self.percent(xlength,10,false);
				    count++;
				}
				
				if(count<10)
				{
					// console.log("labelx "+labelx+" xlength"+xlength );
					ctx.fillStyle = '#396bd5';

					if(xaxisslantflag)
					{
						ctx.save();
					    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
						ctx.rotate(-Math.PI/4);
					    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), 0, 0);
					    ctx.restore();
					}
					else
					{
						ctx.beginPath();
					    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
					    ctx.stroke();
					    ctx.closePath();
					}
					
				    ctx.beginPath();
				    ctx.fillRect(labelx, yorigin-2,4,4);
				    ctx.stroke();
				    ctx.closePath();
				}
			
			
			count=0;
			var yaxisSpacing=new Array();
			for(i=labely;i>=(yorigin-ylength);i-=self.percent(ylength,ypercentageGap,false))
			{
				//console.log(count);
				ctx.fillStyle = '#396bd5';
				ctx.beginPath();
			    ctx.fillText(yvals[count], xorigin-(yvals[count].length*fontSizePixelWidth), i+5);
			    yaxisSpacing.push(xorigin-(xorigin-(yvals[count].length*fontSizePixelWidth)));
			    ctx.stroke();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.fillRect(xorigin-2, i-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			    //labely-=self.percent(ylength,10,false);
			    count++;
			}

			if(count<yvals.length)
			{
				ctx.fillStyle = '#396bd5';
				ctx.beginPath();
			    ctx.fillText(yvals[yvals.length-1], xorigin-(yvals[yvals.length-1].length*fontSizePixelWidth), yorigin-ylength+5);
			     yaxisSpacing.push(xorigin-(xorigin-(yvals[yvals.length-1].length*fontSizePixelWidth)));
			    ctx.stroke();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.fillRect(xorigin-2, yorigin-ylength-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			}


		}
		

		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			//x axis
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(self.options.columnTitles[0], xaxisLabelxpos, xaxisLabelypos);
		    ctx.stroke();
		    ctx.closePath();


		   
		    //y axis
		    ctx.save();
		    ctx.translate(yaxisLabelxpos, yaxisLabelypos);
			ctx.rotate(-Math.PI/2);
		    ctx.fillText(self.options.columnTitles[1], 0, 0);
		    ctx.restore();
		}
		
		
		var plotxy=new Array();
		var plotxyN=new Array();
		
		if(self.options.connectPointsWithOrigin)
		{
			plotxy.push(xorigin+","+yorigin);
		}
		//plot points
		if(xIsText)
		{
			var xpercentageGap=self.percentage(xlength,xlength/xvals.length);

			for (i = 0; i < data.length; i++) {
		        ctx.fillStyle = colors[i];

		        //var xvalPercentage=self.percentage(xmax,xvals[i],false);
		        var yvalPercentage=self.percentage(ymax,yvals[i],false);
		        
		        var xper=self.percent(xlength,xpercentageGap,true)*(i+1);
		        var yper=self.percent(ylength,yvalPercentage,true);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotxy.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();
        
   		 }
		}
		else
		{
			var ypercentageGap=self.percentage(ylength,ylength/yvals.length);
			for (i = 0; i < data.length; i++) {
		        ctx.fillStyle = colors[i];

		        var xvalPercentage=self.percentage(xmax,xvals[i],false);
		       //var yvalPercentage=self.percentage(ymax,yvals[i],false);
		        
		        var xper=self.percent(xlength,xvalPercentage,true);
		        var yper=self.percent(ylength,ypercentageGap,true)*(i+1);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotxy.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();
        
   		 }

		}
	     


   		 
   		 //connect the points

   		 if(self.options.connectPoints)
		{
			var connectColor=self.getColors(1)[0];
			if(plotxy.length==1)
			{

			}
			else if(plotxy.length==2)
			{
				var coor=plotxy[0].split(",");
				var coor1=plotxy[1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			else if(plotxy.length>=3)
			{
				for (i = 0; i <(plotxy.length-1); i++) {
				//console.log(plotxy[i]+" "+plotxy[i+1]);
				var coor=plotxy[i].split(",");
				var coor1=plotxy[i+1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			    
				}

				var coor=plotxy[plotxy.length-2].split(",");
				var coor1=plotxy[plotxy.length-1].split(",");
				ctx.strokeStyle =connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			
		}


		//self.options.plotPoints=plotxy;

		
		//console.log("these are plot points "+JSON.stringify(self.options.plotPoints));
   		 self.drawLegendForPointChart(colors);

   		 //self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMove(evt,plotxyN,self,xvals,yvals);}, false);
   		 
	},
	drawPointChart:function(data)
	{
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');
		var fontSizePixel=self.options.fontSize;
		ctx.font=fontSizePixel+"px Arial";
		var fontSizePixelWidth=ctx.measureText("H").width;
		var fontSizePixelHeight=fontSizePixel;
		var xaxistotallabelinglength=0;
		var xaxisslantflag=false;
		var xvals=new Array();
		var yvals=new Array();
		var toFixedPoint=2;
		
		for(i=0;i<data.length;i++)
		{
			xvals.push(data[i][0]);
			yvals.push(data[i][1]);
			
		}

		//xaxistotallabelinglength+=self.vfd(xaxistotallabelinglength+(fontSizePixelWidth*data[i][0].toFixed(2).toString().length));

		var xmax=self.max(xvals);
		
		var ymax=self.max(yvals);
		
		if(xmax>0 && xmax<1)
		{
			v=xmax.toString();
			toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
		}

		if(ymax>0 && ymax<1)
		{
			v=ymax.toString();
			toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
		}

	//	console.log("toFixedPoint"+toFixedPoint);
		xmax=xmax+self.percent(xmax,10,false);
		ymax=ymax+self.percent(ymax,10,false);


		var yaxisLabelMaxLength=ymax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
		var xaxisLabelMaxLength=xmax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
		//console.log("yaxisLabelMaxLength :"+yaxisLabelMaxLength);
		//console.log("xaxisLabelMaxLength :"+xaxisLabelMaxLength);



		var calculatedXorigin=self.vfd(yaxisLabelMaxLength+(fontSizePixelWidth*2));
		var calculatedYorigin=self.vfd(self.options.height-xaxisLabelMaxLength);

		var margin=10;


		//var xorigin=self.vfd(self.options.width*0.20);
	    //var yorigin=self.vfd(self.options.height*0.80);

	    var xorigin=self.vfd(calculatedXorigin);
	    var yorigin=self.vfd(calculatedYorigin);

	    
	   

	    var ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    var xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));
	    //console.log("ylength :"+ylength);

	   
	    var xxr=0;
	    for(xxr=self.percent(xmax,10,false);xxr<=xmax;xxr+=self.percent(xmax,10,false))
			{
				
				xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
			   
			   
			}
			xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
			


	    if(xaxistotallabelinglength>xlength)
	    {
	    	
			 calculatedYorigin=self.vfd(self.options.height-(xaxisLabelMaxLength*1.5));

		     xorigin=self.vfd(calculatedXorigin);
		     yorigin=self.vfd(calculatedYorigin);

		      ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    	 xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));

	    	 xaxisslantflag=true;

	    }


	    var xaxisLabelxpos=0;
	    var xaxisLabelypos=0;

	    var yaxisLabelxpos=0;
	    var yaxisLabelypos=0;

		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			var xlen=self.vfd(self.options.columnTitles[0].length*fontSizePixelWidth);
			var ylen=self.vfd(self.options.columnTitles[1].length*fontSizePixelWidth);

			if(xlen<xlength)
			{
				xaxisLabelxpos=self.vfd(xorigin+(xlength*0.50));
				xaxisLabelxpos=xaxisLabelxpos-parseInt(xlen*0.50);

			}
			else if(xlen>=xlength)
			{
				var strLen=parseInt(xlength/fontSizePixelWidth);
				//console.log(strLen);
				self.options.columnTitles[0]=self.options.columnTitles[0].substring(0,strLen)+"...";
				//console.log(self.options.columnTitles[0]);
				xaxisLabelxpos=xorigin;


			}

			if(ylen<ylength)
			{
				yaxisLabelypos=self.vfd(yorigin-(ylength*0.50));
				yaxisLabelypos=yaxisLabelypos+parseInt(ylen*0.50);
			}
			else if(ylen>=ylength)
			{
				var strLen=parseInt(ylength/fontSizePixelWidth);
				self.options.columnTitles[1]=self.options.columnTitles[1].substring(0,strLen)+"...";
				yaxisLabelypos=yorigin;
			}

			xaxisLabelypos=self.options.height-fontSizePixelWidth;
			yaxisLabelxpos=fontSizePixelWidth*2;


		}






		// drawing the axes
		ctx.strokeStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin+xlength, yorigin);
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin, yorigin-ylength);
	    ctx.stroke();
	    ctx.closePath();
	    // drawing the axes

	    //paint origin
	    ctx.fillStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.fillText('0', xorigin - fontSizePixelWidth, yorigin+fontSizePixelHeight);
	    ctx.stroke();
	    ctx.closePath();


	    if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,data.length);
			}
			else
			{
				colors=self.getColors(data.length);
			}
			
		}

		//draw grids if requested
		if(self.options.useGrids)
		{
			var labelx=xorigin+self.percent(xlength,10,false);
			var labely=yorigin-self.percent(ylength,10,false);
			var count=0;
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, yorigin-ylength);
			    ctx.stroke();
			    ctx.closePath();
			    labelx+=self.percent(xlength,10,false);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, yorigin-ylength);
			    ctx.stroke();
			    ctx.closePath();
			}

			count=0;

			for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(xorigin+xlength, labely);
			    ctx.stroke();
			    ctx.closePath();
			    labely-=self.percent(ylength,10,false);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(xorigin+xlength, labely);
			    ctx.stroke();
			    ctx.closePath();
			}
		}



		//label the axes
		var labelx=xorigin+self.percent(xlength,10,false);
		var labely=yorigin-self.percent(ylength,10,false);
		var count=0;
		
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.fillStyle = '#396bd5';

				if(xaxisslantflag)
				{
					ctx.save();
				    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
					ctx.rotate(-Math.PI/4);
				    ctx.fillText(i.toFixed(toFixedPoint).toString(), 0, 0);
				    ctx.restore();
				}
				else
				{
					ctx.beginPath();
			    	ctx.fillText(i.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
			   	 	ctx.stroke();
			    	ctx.closePath();
				}
				
			    ctx.beginPath();
			    ctx.fillRect(labelx-2, yorigin-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			   // console.log("labelx "+labelx+" xlength"+xlength );

			    labelx+=self.percent(xlength,10,false);
			    count++;
			}
			
			if(count<10)
			{
				// console.log("labelx "+labelx+" xlength"+xlength );
				ctx.fillStyle = '#396bd5';

				if(xaxisslantflag)
				{
					ctx.save();
				    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
					ctx.rotate(-Math.PI/4);
				    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), 0, 0);
				    ctx.restore();
				}
				else
				{
					ctx.beginPath();
				    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
				    ctx.stroke();
				    ctx.closePath();
				}
				
			    ctx.beginPath();
			    ctx.fillRect(labelx, yorigin-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			}
		
		
		count=0;
		var yaxisSpacing=new Array();
		for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(toFixedPoint).toString(), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
		    yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labely-=self.percent(ylength,10,false);
		    ++count;
		}

		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(ymax.toFixed(toFixedPoint).toString(), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
		     yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}


		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			//x axis
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(self.options.columnTitles[0], xaxisLabelxpos, xaxisLabelypos);
		    ctx.stroke();
		    ctx.closePath();


		   
		    //y axis
		    ctx.save();
		    ctx.translate(yaxisLabelxpos, yaxisLabelypos);
			ctx.rotate(-Math.PI/2);
		    ctx.fillText(self.options.columnTitles[1], 0, 0);
		    ctx.restore();
		}
		
		
		var plotxy=new Array();
		var plotxyN=new Array();
		
		if(self.options.connectPointsWithOrigin)
		{
			plotxy.push(xorigin+","+yorigin);
		}
		//plot points
	     for (i = 0; i < data.length; i++) {
		        ctx.fillStyle = colors[i];

		        var xvalPercentage=self.percentage(xmax,xvals[i],false);
		        var yvalPercentage=self.percentage(ymax,yvals[i],false);
		        
		        var xper=self.percent(xlength,xvalPercentage,true);
		        var yper=self.percent(ylength,yvalPercentage,true);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotxy.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();
        
   		 }


   		 
   		 //connect the points

   		 if(self.options.connectPoints)
		{
			var connectColor=self.getColors(1)[0];
			if(plotxy.length==1)
			{

			}
			else if(plotxy.length==2)
			{
				var coor=plotxy[0].split(",");
				var coor1=plotxy[1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			else if(plotxy.length>=3)
			{
				for (i = 0; i <(plotxy.length-1); i++) {
				//console.log(plotxy[i]+" "+plotxy[i+1]);
				var coor=plotxy[i].split(",");
				var coor1=plotxy[i+1].split(",");
				ctx.strokeStyle = connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			    
				}

				var coor=plotxy[plotxy.length-2].split(",");
				var coor1=plotxy[plotxy.length-1].split(",");
				ctx.strokeStyle =connectColor;
			    ctx.beginPath();
			    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
			    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
			    ctx.stroke();
			    ctx.closePath();
			}
			
		}


		//self.options.plotPoints=plotxy;

		
		//console.log("these are plot points "+JSON.stringify(self.options.plotPoints));
   		 self.drawLegendForPointChart(colors);

   		 self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMove(evt,plotxyN,self,xvals,yvals);}, false);
   		 
   		 

	},
	canvasMouseDown:function(evt,points)
	{

		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
        console.log("these are plot points "+JSON.stringify(points));
	},
	canvasMouseMove:function(evt,points,obj,xvals,yvals)
	{
		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
       
      
       var index=self.containsPos(points,[mousePos.x ,mousePos.y]);
        if(index>-1)
        {
        	//console.log(index);
        	if(!obj.options.tooltip)
        	{
        		obj.options.tooltip=document.createElement("label");
        		$(obj.options.tooltip).appendTo(obj.$elem);
        		$(obj.options.tooltip).css({'position': 'fixed','font-size':self.options.fontSize+'px','padding':'5px','color':'#396bd5','background-color':'#ffffff','border':'3px solid #396bd5','border-radius':'5px'});
        	}
        	$(obj.options.tooltip).text(" "+xvals[index]+" , "+yvals[index]+" ");
        	$(obj.options.tooltip).show();
        	$(obj.options.tooltip).css({'top': evt.clientY+'px','left': (evt.clientX+10)+'px'});
        }
        else
        {
        	if(obj.options.tooltip)
        	{
        		$(obj.options.tooltip).hide();
        	}
        }


	},
	canvasMouseMoveForPieChart:function(evt,obj,colors,data)
	{
		 var mousePos = self.getMousePos(evt.target, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
       
       var c = evt.target.getContext('2d').getImageData(mousePos.x, mousePos.y, 1, 1).data;
       //console.log(c);
       //var colorStr="rgba("+c[0].toString()+c[1].toString()+c[2].toString()+")";
       var index=self.containsVal(colors,self.rgbToHex(c[0],c[1],c[2]));
       if(index>-1)
        {
        	//console.log(index);
        	if(!obj.options.tooltip)
        	{
        		obj.options.tooltip=document.createElement("label");
        		$(obj.options.tooltip).appendTo(obj.$elem);
        		$(obj.options.tooltip).css({'position': 'fixed','font-size':self.options.fontSize+'px','padding':'5px','color':'#396bd5','background-color':'#ffffff','border':'3px solid #396bd5','border-radius':'5px'});
        	}
        	$(obj.options.tooltip).text(" "+data[index][0]+" - "+data[index][1]+" ");
        	$(obj.options.tooltip).show();
        	$(obj.options.tooltip).css({'top': evt.clientY+'px','left': evt.clientX+'px'});
        }
        else
        {
        	if(obj.options.tooltip)
        	{
        		$(obj.options.tooltip).hide();
        	}
        }

	},
	containsVal:function(arr,val)
	{
		var retVal=-1;
		
		for(i=0;i<arr.length;i++)
		{
			if(arr[i]==val)
			{

				retVal=i;
				break;
			}
		}

		return retVal;	
	},
	containsPos:function(arr,pos)
	{
		var retVal=-1;
		
		for(i=0;i<arr.length;i++)
		{
			if(((arr[i][0]==pos[0] && arr[i][1]==pos[1])) || ((pos[0]>=arr[i][0] && pos[0]<=arr[i][0]+10) && (pos[1]>=arr[i][1] && pos[1]<=arr[i][1]+10)) )
			{

				retVal=i;
				break;
			}
		}

		return retVal;	
	},
	getMousePos:function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      },
	drawLegendForPointChart:function(colors)
	{
		self=this;
		//self.$elem.css({'border':'1px solid #ccc','margin':'10px','overflow':'auto'});
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		var htmlStr="<table>";
		var data=self.options.data;

		htmlStr+="<tr>";
		htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
		htmlStr+="</td>";
		

		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			htmlStr+="<td>(X - axis)</br>"+self.options.columnTitles[0];
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)</br>"+self.options.columnTitles[1];
			htmlStr+="</td>";

		}
		else
		{
			htmlStr+="<td>(X - axis)";
			htmlStr+="</td>";
			htmlStr+="<td>(Y - axis)";
			htmlStr+="</td>";
		}
			

		htmlStr+="</tr>";


		for(i=0;i<data.length;i++)
		{
			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[i]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][0]+"";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][1]+"";
			htmlStr+="</td>";
			htmlStr+="</tr>";

		}



		htmlStr+="</table>";

		$(htmlStr).appendTo(self.$elem);
		
		//self.$elem.children("table").css({'margin':'0 auto'});

		self.$elem.children("table").css({'margin':'10px','border':'1px solid #eee','border-radius':'5px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+self.$elem.children("table").height()+(self.$elem.children("label").height()*2));

	},
	drawPointChartWithTrends:function(data)
	{
		var canvas=self.$canvas;
		var ctx = canvas.getContext('2d');
		var fontSizePixel=self.options.fontSize;
		ctx.font=fontSizePixel+"px Arial";
		var fontSizePixelWidth=ctx.measureText("H").width;
		var fontSizePixelHeight=fontSizePixel;
		var xaxistotallabelinglength=0;
		var xaxisslantflag=false;
		var toFixedPoint=2;

		var xvals=new Array();
		var yvals=new Array();

		for(i=0;i<data.length;i++)
		{
			for(j=0;j<data[i].length;j++)
			{
				xvals.push(data[i][j][0]);
				yvals.push(data[i][j][1]);
			}
			
		}


		

		var xmax=self.max(xvals);
		
		var ymax=self.max(yvals);
		
		if(xmax>0 && xmax<1)
		{
			v=xmax.toString();
			toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
		}

		if(ymax>0 && ymax<1)
		{
			v=ymax.toString();
			toFixedPoint=v.substring(v.indexOf(".")+1,v.length).length+1;
		}

		//console.log("toFixedPoint"+toFixedPoint);
		xmax=xmax+self.percent(xmax,10,false);
		ymax=ymax+self.percent(ymax,10,false);

		var yaxisLabelMaxLength=ymax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
		var xaxisLabelMaxLength=xmax.toFixed(toFixedPoint).toString().length*fontSizePixelWidth;
		//console.log("yaxisLabelMaxLength :"+yaxisLabelMaxLength);
		//console.log("xaxisLabelMaxLength :"+xaxisLabelMaxLength);



		var calculatedXorigin=self.vfd(yaxisLabelMaxLength+(fontSizePixelWidth*2));
		var calculatedYorigin=self.vfd(self.options.height-xaxisLabelMaxLength);

		var margin=10;


		//var xorigin=self.vfd(self.options.width*0.20);
	    //var yorigin=self.vfd(self.options.height*0.80);

	    var xorigin=self.vfd(calculatedXorigin);
	    var yorigin=self.vfd(calculatedYorigin);

	    
	   

	    var ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    var xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));
	    //console.log("ylength :"+ylength);

	   
	    var xxr=0;
	    for(xxr=self.percent(xmax,10,false);xxr<=xmax;xxr+=self.percent(xmax,10,false))
			{
				
				xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
			   
			   
			}
			xaxistotallabelinglength+=self.vfd(ctx.measureText(xxr.toFixed(toFixedPoint).toString()).width);
			


	    if(xaxistotallabelinglength>xlength)
	    {
	    	
			 calculatedYorigin=self.vfd(self.options.height-(xaxisLabelMaxLength*1.5));

		     xorigin=self.vfd(calculatedXorigin);
		     yorigin=self.vfd(calculatedYorigin);

		      ylength=self.vfd(self.options.height-(margin+self.vfd(self.options.height-yorigin)));
	    	 xlength=self.vfd(self.options.width-(xorigin+margin+xaxisLabelMaxLength));

	    	 xaxisslantflag=true;

	    }


	    var xaxisLabelxpos=0;
	    var xaxisLabelypos=0;

	    var yaxisLabelxpos=0;
	    var yaxisLabelypos=0;

		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			var xlen=self.vfd(self.options.columnTitles[0].length*fontSizePixelWidth);
			var ylen=self.vfd(self.options.columnTitles[1].length*fontSizePixelWidth);

			if(xlen<xlength)
			{
				xaxisLabelxpos=self.vfd(xorigin+(xlength*0.50));
				xaxisLabelxpos=xaxisLabelxpos-parseInt(xlen*0.50);

			}
			else if(xlen>=xlength)
			{
				var strLen=parseInt(xlength/fontSizePixelWidth);
				//console.log(strLen);
				self.options.columnTitles[0]=self.options.columnTitles[0].substring(0,strLen)+"...";
				//console.log(self.options.columnTitles[0]);
				xaxisLabelxpos=xorigin;


			}

			if(ylen<ylength)
			{
				yaxisLabelypos=self.vfd(yorigin-(ylength*0.50));
				yaxisLabelypos=yaxisLabelypos+parseInt(ylen*0.50);
			}
			else if(ylen>=ylength)
			{
				var strLen=parseInt(ylength/fontSizePixelWidth);
				self.options.columnTitles[1]=self.options.columnTitles[1].substring(0,strLen)+"...";
				yaxisLabelypos=yorigin;
			}

			xaxisLabelypos=self.options.height-fontSizePixelWidth;
			yaxisLabelxpos=fontSizePixelWidth*2;


		}






		// drawing the axes
		ctx.strokeStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin+xlength, yorigin);
	    ctx.moveTo(xorigin, yorigin);
	    ctx.lineTo(xorigin, yorigin-ylength);
	    ctx.stroke();
	    ctx.closePath();
	    // drawing the axes

	    //paint origin
	    ctx.fillStyle = '#396bd5';
	    ctx.beginPath();
	    ctx.fillText('0', xorigin - fontSizePixelWidth, yorigin+fontSizePixelHeight);
	    ctx.stroke();
	    ctx.closePath();


	    if(self.options.colors && self.options.colors.length>0)
		{
			colors=self.options.colors;
		}
		else
		{
			//colors=self.getColors(valArr.length);
			if(self.options.useRGBAColorScheme)
			{
				colors=self.colorShades(3,xvals.length);
			}
			else
			{
				colors=self.getColors(xvals.length);
			}
			
		}

		//draw grids if requested
		if(self.options.useGrids)
		{
			var labelx=xorigin+self.percent(xlength,10,false);
			var labely=yorigin-self.percent(ylength,10,false);
			var count=0;
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, yorigin-ylength);
			    ctx.stroke();
			    ctx.closePath();
			    labelx+=self.percent(xlength,10,false);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(labelx, yorigin);
			    ctx.lineTo(labelx, yorigin-ylength);
			    ctx.stroke();
			    ctx.closePath();
			}

			count=0;

			for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(xorigin+xlength, labely);
			    ctx.stroke();
			    ctx.closePath();
			    labely-=self.percent(ylength,10,false);
			    count++;
			}

			if(count<10)
			{
				ctx.strokeStyle = '#eeeeee';
			    ctx.beginPath();
			    ctx.moveTo(xorigin, labely);
			    ctx.lineTo(xorigin+xlength, labely);
			    ctx.stroke();
			    ctx.closePath();
			}
		}



		//label the axes
		var labelx=xorigin+self.percent(xlength,10,false);
		var labely=yorigin-self.percent(ylength,10,false);
		var count=0;
		
			for(i=self.percent(xmax,10,false);i<=xmax;i+=self.percent(xmax,10,false))
			{
				ctx.fillStyle = '#396bd5';

				if(xaxisslantflag)
				{
					ctx.save();
				    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
					ctx.rotate(-Math.PI/4);
				    ctx.fillText(i.toFixed(toFixedPoint).toString(), 0, 0);
				    ctx.restore();
				}
				else
				{
					ctx.beginPath();
			    	ctx.fillText(i.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
			   	 	ctx.stroke();
			    	ctx.closePath();
				}
				
			    ctx.beginPath();
			    ctx.fillRect(labelx-2, yorigin-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			   // console.log("labelx "+labelx+" xlength"+xlength );

			    labelx+=self.percent(xlength,10,false);
			    count++;
			}
			
			if(count<10)
			{
				// console.log("labelx "+labelx+" xlength"+xlength );
				ctx.fillStyle = '#396bd5';

				if(xaxisslantflag)
				{
					ctx.save();
				    ctx.translate(labelx-(xaxisLabelMaxLength*0.5), yorigin+15+(xaxisLabelMaxLength*0.5));
					ctx.rotate(-Math.PI/4);
				    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), 0, 0);
				    ctx.restore();
				}
				else
				{
					ctx.beginPath();
				    ctx.fillText(xmax.toFixed(toFixedPoint).toString(), labelx, yorigin+15);
				    ctx.stroke();
				    ctx.closePath();
				}
				
			    ctx.beginPath();
			    ctx.fillRect(labelx, yorigin-2,4,4);
			    ctx.stroke();
			    ctx.closePath();
			}
		
		
		count=0;
		var yaxisSpacing=new Array();
		for(i=self.percent(ymax,10,false);i<=ymax;i+=self.percent(ymax,10,false))
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(i.toFixed(toFixedPoint).toString(toFixedPoint), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
		    yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		    labely-=self.percent(ylength,10,false);
		    ++count;
		}

		if(count<10)
		{
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(ymax.toFixed(toFixedPoint).toString(), xorigin-(i.toFixed(toFixedPoint).toString().length*6), labely+5);
		     yaxisSpacing.push(xorigin-(i.toFixed(toFixedPoint).toString().length*6));
		    ctx.stroke();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.fillRect(xorigin-2, labely-2,4,4);
		    ctx.stroke();
		    ctx.closePath();
		}


		//labelling the axes with axes names
		if(self.options.columnTitles && self.options.columnTitles.length==2)
		{
			//x axis
			ctx.fillStyle = '#396bd5';
			ctx.beginPath();
		    ctx.fillText(self.options.columnTitles[0], xaxisLabelxpos, xaxisLabelypos);
		    ctx.stroke();
		    ctx.closePath();


		   
		    //y axis
		    ctx.save();
		    ctx.translate(yaxisLabelxpos, yaxisLabelypos);
			ctx.rotate(-Math.PI/2);
		    ctx.fillText(self.options.columnTitles[1], 0, 0);
		    ctx.restore();
		}
		

		
		var plotxy=new Array();
		var plotxyN=new Array();
		
		
		//plot points
	     for (i = 0; i < data.length; i++) {

	     	var plotthis=new Array();
	     	if(self.options.connectPointsWithOrigin)
			{
				plotthis.push(xorigin+","+yorigin);


			}
	     	for (j = 0; j < data[i].length; j++) {

	     		ctx.fillStyle = colors[(i*2)+j];

		        var xvalPercentage=self.percentage(xmax,data[i][j][0],false);
		        var yvalPercentage=self.percentage(ymax,data[i][j][1],false);
		        
		        var xper=self.percent(xlength,xvalPercentage,true);
		        var yper=self.percent(ylength,yvalPercentage,true);

		        var x=xorigin+xper ;
		        var y=yorigin-yper;
		        ctx.beginPath();
		        ctx.fillRect(x, y, 10, 10);
		        //console.log(x+","+y)

		        plotthis.push(x+","+y);
		        plotxyN.push([x,y]);
		        ctx.closePath();


	     	}

	     	
		        
        	plotxy.push(plotthis);
   		 }


   		 var trendColors=new Array();
   		 for (k = 0; k<plotxy.length; k++)
		 {
		 	//console.log(plotxy[k]);

		 	if(self.options.connectPoints)
			{
				var connectColor=self.getColors(1)[0];
				trendColors.push(connectColor);
				if(plotxy[k].length==1)
				{

				}
				else if(plotxy[k].length==2)
				{
					var coor=plotxy[k][0].split(",");
					var coor1=plotxy[k][1].split(",");
					ctx.strokeStyle = connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				}
				else if(plotxy[k].length>=3)
				{
					for (j = 0; j <(plotxy[k].length-1); j++) {
					//console.log(plotxy[i]+" "+plotxy[i+1]);
					var coor=plotxy[k][j].split(",");
					var coor1=plotxy[k][j+1].split(",");
					ctx.strokeStyle = connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				    
					}

					var coor=plotxy[k][plotxy[k].length-2].split(",");
					var coor1=plotxy[k][plotxy[k].length-1].split(",");
					ctx.strokeStyle =connectColor;
				    ctx.beginPath();
				    ctx.moveTo(parseInt(coor[0]), parseInt(coor[1]));
				    ctx.lineTo(parseInt(coor1[0]), parseInt(coor1[1]));
				    ctx.stroke();
				    ctx.closePath();
				}
			
			}

		 }
   		
   		 


   		 self.drawLegendForPointChartWithTrends(colors,trendColors);

   		  self.$canvas.addEventListener('mousemove', function(evt){self.canvasMouseMove(evt,plotxyN,self,xvals,yvals);}, false);




	},
	drawLegendForPointChartWithTrends:function(colors,trendColors)
	{
		self=this;
		//self.$elem.css({'border':'1px solid #ccc','margin':'10px','overflow':'auto'});
		$("<label>"+self.options.title+"</label>").insertBefore(self.$elem.children("canvas")[0]);

		
		var data=self.options.data;


		



		for(i=0;i<data.length;i++)
		{
			var htmlStr="<table>";

			if(self.options.trendTitles && self.options.trendTitles.length>0 && self.options.trendTitles[i])
			{
				htmlStr+="<tr>";
				htmlStr+="<td colspan=\"2\"><label style=\"color:"+trendColors[i]+"\">"+self.options.trendTitles[i];
				htmlStr+="</label></td>";
				htmlStr+="</tr>";
			}
				

				htmlStr+="<tr>";
				htmlStr+="<td>&nbsp;&nbsp;&nbsp;";
				htmlStr+="</td>";
				

				if(self.options.columnTitles && self.options.columnTitles.length==2)
				{
					htmlStr+="<td>(X - axis)</br>"+self.options.columnTitles[0];
					htmlStr+="</td>";
					htmlStr+="<td>(Y - axis)</br>"+self.options.columnTitles[1];
					htmlStr+="</td>";

				}
				else
				{
					htmlStr+="<td>(X - axis)";
					htmlStr+="</td>";
					htmlStr+="<td>(Y - axis)";
					htmlStr+="</td>";
				}
					

				htmlStr+="</tr>";


			for(j=0;j<data[i].length;j++)
			{
				

			htmlStr+="<tr>";
			htmlStr+="<td style=\"background-color:"+colors[(i*2)+j]+"\">&nbsp;&nbsp;&nbsp;";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][j][0]+"";
			htmlStr+="</td>";
			htmlStr+="<td>&nbsp;&nbsp;"+data[i][j][1]+"";
			htmlStr+="</td>";
			htmlStr+="</tr>";

				
			}
			htmlStr+="</table>";
			$(htmlStr).appendTo(self.$elem);
		}

		q=0;
		for(p=0;p<self.$elem.children("table").length;p++)
		{
			q+=$(self.$elem.children("table")[p]).height();
		}
		

		
		
		//self.$elem.children("table").css({'margin':'0 auto'});
		self.$elem.children("table").css({'margin':'10px','border':'1px solid #eee','border-radius':'5px'});
		self.$elem.children("label").css({'margin':'10px'});
		self.$elem.width();
		self.$elem.height(self.$elem.height()+q+10+(self.$elem.children("label").height()*2));

	}

};

$.fn.kggraph = function( options ) {
    
    return this.each(function(){

    	var graph=Object.create(kgg);
    	
    	
    	graph.init(options,this);
    });
  
 };

$.fn.kggraph.options={
	width:100,
	height:100,
	type:'pie chart',
	title:'sample  chart',
	data:[],
	dataTypes:['number','number'],
	columnTitles:[],
	trendTitles:[],
	colors:[],
	useRGBAColorScheme:true,
	useGrids:false,
	connectPoints:false,
	connectPointsWithOrigin:false,
	hasTrends:false,
	plotPoints:[],
	tooltip:null,
	fontSize:10,
	drawLegend:false
};





})( jQuery ,window,document);



