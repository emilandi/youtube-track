var video;
var pos =  new Array();
var nombres = new Array();
var titleArray = new Array();
var nextJump;

var clase = 'yt-simple-endpoint style-scope yt-formatted-string';
var selector = 'a.yt-simple-endpoint.style-scope.yt-formatted-string';

window.addEventListener('load',init);

$(document).ready(function(){
	
	setTimeout(function() {	
		console.log('load init');
		var h1 = document.querySelector('h1');
		var desc = document.querySelector('#description');	
		
		video = document.querySelector('video');		
				
		if(video){
		
			video.addEventListener('canplay',init);
			video.addEventListener('loadstart',init);			
			video.addEventListener('playing',init);				

			video.addEventListener('mouseenter',function(){
				var nro = trackActual(video.currentTime);
				var title = nombreActual(nro);
				if(title){
					showMsj(title);
				}				
			})		
			
			video.addEventListener('timeupdate',function(){			
				var nro = video.currentTime;
				
				if(nro < 2){
					console.log(nro);
					init();
				}

				var actual = trackActual(nro);								
				var salto = parseFloat(pos[actual+1]);
				console.log('track:' + actual,nro,salto);
				
				//var salto = dameSalto(nro,'next');
				
				
				if(nro > salto){
					console.log('Cambiando track')	;
					var playIcon = '\u25B6 ';			
					var cName =  nombreActual(actual);
					if(cName){
						console.log(cName);
						var title = playIcon + cName;
						var pbar =  document.querySelector('a#h1Title');
						if(pbar){
							pbar.innerText=title;
							pbar.style.display='inline-block';
							var queryURL =  'https://www.youtube.com/results?search_query=';
							var urlTag = cName;
							var href = queryURL + urlTag;
							h1Title.href = href;
						}
					}else{
						$('#h1Title').fadeOut(300);
					}		
				
				}

								
			})		
		
			console.log(h1,video,desc);	
		}
		
		init();	
	
	}, 3000);

	console.clear();		
	console.log('ready!');

	$("video").on("play", function (e) {		
		init();
	});

});

function init(){					
	console.log('init');
	pos=[];
	nombres=[];		
	
	var tags = getPos();	
	if(tags){		
		getNames();	
	}
	
	createDiv();
	
	console.clear();	
	console.log(titleArray,tags);		
}

function createElement(tipo,id,clase,text) {
	
	var obj = document.createElement(tipo);	
	
	if(id){
		obj.id=id;
	}
	
	if(clase){
		obj.classList.add(clase);		
	}

	obj.innerText=text;
	
	return obj;	
}

function nextJump(nro) {
	
}

function createDiv () {	
	
	var desc =  document.getElementById('description');
		
	if(desc){
		
		//getPos(); //get tags
		
		//crear div + buttons								
		var objClass = desc.getElementsByClassName(clase);
		var objSelector = desc.querySelectorAll(selector);	
				  
		var h1 = 'h1.title.style-scope.ytd-video-primary-info-renderer';					
		var root = document.querySelector(h1);				  
		var elem = document.getElementById('track');
		
		if(!elem){			
			
			var div = createElement('div','track','','');
			var btnAdelante = createElement('a','next','ytClass','>>');	
			var btnAtras = createElement('a','back','ytClass','<<');
			
			var h1Title = createElement('a','h1Title','','');			
			h1Title.target ="_blank";
			h1Title.title="Search this track";
			
			div.appendChild(btnAtras);							
			div.appendChild(btnAdelante);
			div.appendChild(h1Title);
			
			if(root){
				root.appendChild(div);					
			}
	
			btnAtras.addEventListener('click',fnAtras);
			btnAdelante.addEventListener('click',fnAdelante);
		
			btnAtras.addEventListener('mouseover',function(e){													
				var title='';
				var actual = trackActual(video.currentTime);					
				if(actual>1){												
					var nro = parseFloat(actual-1);						
					var info = nombreActual(nro);
				}else{
					var info = nombreActual(1);
				}	

				this.setAttribute('title',info);
				
				console.clear();
				console.log(video.currentTime + ' -  Current track: ' + actual);				
			})
			
			btnAdelante.addEventListener('mouseover',function(e){									
				var title = '';					
				var actual = trackActual(video.currentTime);
				if(actual < pos.length){					
					var nro = parseFloat(actual+1);
					var info = nombreActual(nro);
					if(!info){					
						var info='';
					}
				}					
				this.setAttribute('title',info);										
				
				console.clear();
				console.log(video.currentTime + ' -  Current track: ' + actual);					

			})			
		
			createInfoTool(); //crear barra de informacion		
		}						
		
	}else{
		console.log('No Hay descripcion');
	}		
	
	$('#track').fadeIn(600);

	
	var len = pos.length;
	
	if(len > 0){					
		$('.ytClass').removeClass("ytDisable");		
	}else{			
		$('.ytClass').addClass("ytDisable");		
	}

	$('.ytClass').fadeIn(300);	
}


function createInfoTool() {
	var root = document.querySelector('.html5-video-container');
	
	if(root){
		var div = document.getElementById('infobar')
		if(!div){
			div = createElement('div','infobar','','');
			root.appendChild(div);
		}
	}
}

function showMsj(msj) {
	var elem = document.getElementById('infobar');
	if(elem){
		elem.textContent=msj;
		$('#infobar').fadeIn(600);			
		setTimeout(function(){
			$('#infobar').fadeOut(300);			
		}, 4000);		
	}
}

//checkea si el video tiene tags en la descripcion
function checkPos(){	
	return pos.length;
}

function getNames() {
	
	titleArray=[];
	
	var tags = document.querySelector('#scriptTag');
	
	if(tags){

		var elem = JSON.parse(tags.innerHTML);
		var desc = elem.description;
		var text = desc.split('\n');		
		var regFix = /^\d{2}|\(\)|[-*+.:|]/g      //reg fix char
		var reg = /([0-9]?[0-9]:[0-9][0-9])/g;  //reg time format
		
		text.forEach(element => {
			var objTime = element.match(reg);
			if(objTime){
				var textObj = element.replace(reg, "");
				var title  = textObj.replace(regFix,"").trim();
				titleArray.push(title);
				//console.log(objTime,element,title);
			}
		});
		
		console.log(titleArray);		
	}
}


function getPos(){
	pos=[];	//array posiciones	
	var desc = document.querySelector('div#description')	

	if(desc){
		console.log(desc);
		var elem = desc.querySelectorAll(selector);				
		if(elem.length > 0){			
			for (i = 0; i <= elem.length - 1; i++) {	
				var obj = elem[i];
				var nro = convert(obj); //obtener nro de la url
				fillPos(nro); 			//llenar array con datos	
			};						
		}		
	}
	console.log(pos);
	return pos;	
}

function fillPos(value){	
	if(!isNaN(value)){
		pos.push(value);
	}	
}

function fnAtras(){
	var ntrack = 1;
	var time = video.currentTime;		
	var nro = dameSalto(time,'back');
	var actual=trackActual(time);
	console.log('Click Atras - ','Track: ' + actual + ' - ' + time +   ' Proximo: ' + nro);

	//si el seek esta antes del primer track que vuelva a 00:00
	if(time < pos[0]){
		nro=0;	
	}else{
		//si esta en el primer track que vuelva a empezar
		if(time > pos[0]  && time < pos[1] ){
			nro=pos[0];
		}
	}	
	
	if(actual>1){
		ntrack = actual - 1;
	}
	
	var title = getNames(ntrack);	
	
	showMsj(title);
	
	playVideo(nro);	
}

function fnAdelante(){	

	 var time = video.currentTime;	
	 var nro = dameSalto(time,'next');				
	 var actual = trackActual(time);	
	 var next = parseFloat(actual+1);
	 var title = nombreActual(next);

	 showMsj(title);
	 playVideo(nro);	
	 
	 console.log('Click Adelante - ','Track: '+ actual + ' Tiempo: ' + time +   ' -  Proximo: '  +  nro);	

}

function getMax() {
	return Math.max(...pos);
}

function getMin() {
	return Math.min(...pos);
}

function trackActual(nro) {			
	var elem = pos;
	var len = pos.length;	
	for (i = 0; i <= elem.length - 1; i++) {	
		var obj = elem[i];
		if(nro >= elem[len-1]){
			return len;
		}else{
			if(nro >= elem[i] && nro < elem[i+1] ){
				return i + 1;
			}
		}		
	};	
}

function nombreActual(nro) {	
	var titleStr = titleArray[nro -1];
	if(titleStr){
		return titleStr.toUpperCase();
	}
}

function playVideo(nro){
	
	if(isNaN(nro)){	
		console.log('Fin de la lista');
	}
	else{
		video.currentTime=nro;
		video.play();
	}
}

function dameSalto(actual,action){	
	
	var elem = pos;	
	if(action=='next'){
		for (i = 0; i <= elem.length - 1; i++) {				
			var nro = elem[i];						
			if(actual < nro ) {			
				var target = nro;
				console.log('Siguiente: ' + target);				
				return target;
			}
		};
	}	
	
	if(action=='back')	{		
		for (var i = elem.length -1; i > 0 ; i--) {						
			var nro = elem[i];				
			if(actual > nro ) {							
				var target = elem[i-1];
				console.log('Anterior: ' + target);							
				return target;
			}	
		}			
	}
	
}

function convert(elem){	
	var url = elem.href;
	var pos = url.search("&t=");
	var nro = url.substring(pos + 3).replace('s','');
	return 	nro;
}

// verifica si el valor tiene formato time HH:MM:SS
function fnTime(value) {	
	var timeFormat = /^([0-9]{2})\:([0-9]{2})$/;	
	if(value.match(timeFormat)){		
		return true
	}else{		
		return false;
	}
}

function fixStr(value) {			
	
	var cadenaTime=/([0-9][0-9])?([0-9]?[0-3])?:([0-5][0-9])/g;	
	var cadenaStr = /^(\d)+|(\d+-)|([=?*+#$%\-:↵")(])/g	
	
	var newvalue = value.replace(cadenaStr,"").trim();	
	var str = newvalue.replace(cadenaTime,"").trim();
	
	if(str.length > 150){
		str='***';
	}
	
	console.log(str);	
	return str;
}