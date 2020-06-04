var video;
var pos =  new Array();
var nombres = new Array();
var clase = 'yt-simple-endpoint style-scope yt-formatted-string';
var selector = 'a.yt-simple-endpoint.style-scope.yt-formatted-string';
var disableColor = 'grey';
var enableColor = 'red';

$(window).load(init);
$(document).ready(init);

function init(){	
	pos=[];
	nombres=[];	
	
	setTimeout(function() {		
		createDiv();
		fnVideo();
		getPos();
		checkPos();
	}, 2000);
	
	console.clear();
	console.log('ready!');

	//inject script file
	var s = document.createElement('script');
	// TODO: add "script.js" to web_accessible_resources in manifest.json
	s.src = chrome.runtime.getURL('js/inject.js');
	s.onload = function() {
    	this.remove();
	};
	(document.head || document.documentElement).appendChild(s);

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {		  
		if (request.action){
			console.log(request);
		}			
	});

}

function fnVideo () {	
	var clase='video-stream html5-main-video';			

	video = document.getElementsByClassName(clase)[0];
	video = document.querySelector('video');	

	if(video){
		
		video.addEventListener("play", getPos);	//crear boton;				
		video.addEventListener('canplay', (event) => {
			console.log('CanPlay Video can start, but not sure it will play through.');			
			 setTimeout(function() {
			 	getPos();
			 	checkPos();			 	
			 }, 2000);
		});

		video.addEventListener('	', (event) => {			
			console.log('Video found the playback position it was looking for.');			
			checkPos();				
		})
	return video;
	};
}


function createDiv () {
	//console.log('Creando Div..');
	var host=getHost();
	//if(host=="www.youtube.com"){			
		var desc =  document.getElementById('description');
		if(desc){
			//console.clear();

			var objClass = desc.getElementsByClassName(clase);
			var objSelector = desc.querySelectorAll(selector);
			
			//console.log('Cantidad: ' + objClass.length);
			//console.log('Cantidad: ' + objSelector.length);

			var H1 = 'h1.title.style-scope.ytd-video-primary-info-renderer';

			var root = document.querySelector(H1);			
			var elem = document.getElementById('track');
			
			if(!elem){
				//console.log('Creando Div');
				var div = document.createElement('div');
				div.id='track';
				div.style.display='none';
				root.appendChild(div);			
		
				var btnAtras = createBtn('a','back','ytClass','<<');		
				var btnAdelante = createBtn('a','next','ytClass','>>');	
		
				btnAtras.addEventListener('click',fnAtras);
				btnAdelante.addEventListener('click',fnAdelante);
			
				btnAtras.addEventListener('mouseover',function(e){										
					getPos();
					//getNombresNew();					
					var title='';
					var actual = trackActual(video.currentTime);					
					if(actual>1){						
						//var title = nombres[actual-1];
						var track = parseFloat(actual-1);						
						var info = 'Track N° ' + track ;
					}else{
						var info = 'Track N° 1';
					}	

					this.setAttribute('title',info);
					
					console.clear();
					console.log(video.currentTime + ' -  Current track: ' + actual);					
				})
				
				btnAdelante.addEventListener('mouseover',function(e){					
					getPos();
					//getNombresNew();
					var title = '';					
					var actual = trackActual(video.currentTime);
					if(actual < pos.length){
						//var title = nombres[actual+1];
						var track = parseFloat(actual+1);
						var info = 'Track N° ' + track ;						
					}					
					this.setAttribute('title',info);
										
					
					console.clear();
					console.log(video.currentTime + ' -  Current track: ' + actual);					

				})			
			}	
					
			
		}else{
			console.log('No Hay descripcion');
		}		
		
		fnShow('track','block');
	
		//}	
}

function checkPos(){	
	
	var len = pos.length;	
	if(len==0){			
		setColor('back',disableColor);
		setColor('next',disableColor);
	}else{	
		setColor('back',enableColor);
		setColor('next',enableColor);	
	
		if(video.currentTime >= pos[1]){		
			setColor('back',enableColor);		
		}

		if(video.currentTime < pos[len -1]){
			setColor('next',enableColor);
		}else{
			setColor('next',disableColor);		
		}	
	}

	return pos.length;
}

function setColor(id,value) {
	var elem = document.querySelector('a.ytClass#' + id);
	//var elem = document.getElementById(id);
	if(elem){
		elem.style.backgroundColor=value;
	}
}

function getPos(){
	pos=[];	//array posiciones	
	var desc = document.querySelector('div#description')	
	if(desc){
		var elem = desc.querySelectorAll(selector);				
		if(elem.length > 0){			
			for (i = 0; i <= elem.length - 1; i++) {	
				var obj = elem[i];
				var nro = convert(obj); //obtener nro de la url
				fillPos(nro); 			//llenar array con datos	
			};						
		}		
	}	
	return pos;	
}

function fillPos(value){	
	if(!isNaN(value)){
		pos.push(value);
	}	
}

function fnShow(value){	

	//sino tiene tracks ocultar DIV
	if(value=='none'){		
		$("#track").fadeIn(600, function () {					
			$("#back").show().fadeOut(600);
			$("#next").show().fadeOut(600);			
		});	
	}else{
		$("#track").fadeIn(600, function () {					
			$("#back").show().fadeIn(600);
			$("#next").show().fadeIn(600);			
		});	
	}		
}

function fnAtras(){
	
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
	
	playVideo(nro);	
}

function fnAdelante(){			

	 var time = video.currentTime;	
	 var nro = dameSalto(time,'next');				
	 var actual = trackActual(time);	
	 console.log('Click Adelante - ','Track: '+ actual + ' Tiempo: ' + time +   ' -  Proximo: '  +  nro);			
	
	 playVideo(nro);	
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
	//console.clear();	
	
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

function createBtn(tipo,id,clase,texto) {	
	
	var div = document.getElementById('track');		
	
	if (div){		
		var btn = document.createElement(tipo);	
		btn.classList.add(clase);
		btn.id=id;
		btn.innerText=texto;
		div.appendChild(btn);
	}else{
		console.log('No existe DIV');
	}	
	return btn;	
}

function getTime () {
	return video.currentTime;
}

function getHost(){
	return location.hostname;
}

function getNombres() {	
	nombres=[];
	var elem = document.querySelectorAll('#description > yt-formatted-string > span');
	
	elem.forEach(e => {		
		var fixNombres = fixStr(e.textContent);		
		nombres.push(fixNombres);
	});		
	console.log(nombres);
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

function getNombresNew() {	
	nombres=[];	

	var prop = 'chapters';	
	var obj = localStorage.getItem('ytInit');
	if(obj){
		if(obj.indexOf(prop)>0){
			var objNew = JSON.parse(obj);
			console.log('existe');		
			console.log(objNew);

			var obj = objNew.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.chapteredPlayerBarRenderer.chapters;		
			if(obj){
				obj.forEach(e => {
					var newName = e.chapterRenderer.title.simpleText;
					nombres.push(newName);
					console.log(newName);
				});
			}else{
				console.log('No se han encontrado nombres from youtube');
				getNombres();
			}

		}else{
			console.log('no existe');
			getNombres();
		}	
	}else{
		console.log('no hay datos guardados');
		getNombres();
	}

}


function lnk(value) {	
	//verifica si la url es de salto ej. watch?v=KBvfVKOv8WE&list=2&t=676s
	return value.match(/\&t=/);
}