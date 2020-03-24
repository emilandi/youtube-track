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
	console.log(pos);
}

function fnVideo () {	
	var clase='video-stream html5-main-video';		
	video = document.getElementsByClassName(clase)[0];
	video = document.querySelector('video');	    	
	if(video){
		
		video.addEventListener("play", getPos);	//crear boton;		
		
		video.addEventListener('canplay', (event) => {
			console.log('CanPlay Video can start, but not sure it will play through.');
			console.log(document.getElementById('description'));

			setTimeout(function() {
				getPos();
				checkPos();			 	
			}, 2000);

		});

		video.addEventListener('seeked', (event) => {
			
			console.log('Video found the playback position it was looking for.');			
			var len = pos.length;			
			
			if(video.currentTime >= pos[1]){
				setColor('back',enableColor);
			}else{
				setColor('back',disableColor);
			}

			if(video.currentTime < pos[len -1]){
				setColor('next',enableColor);
			}else{
				setColor('next',disableColor);
			}	
		})
	return video;
	};
}


function createDiv () {
	console.log('Creando Div..');
	var host=getHost();
	if(host=="www.youtube.com"){			
		var desc =  document.getElementById('description');
		if(desc){
			console.clear();

			var objClass = desc.getElementsByClassName(clase);
			var objSelector = desc.querySelectorAll(selector);
			
			console.log('Cantidad: ' + objClass.length);
			console.log('Cantidad: ' + objSelector.length);
						
			var H1 = 'h1.title.style-scope.ytd-video-primary-info-renderer';
			var root = document.querySelector(H1);			
			var elem = document.getElementById('track');
			
			if(!elem){
				console.log('Creando Div');
				var div = document.createElement('div');
				div.id='track';
				div.style.display='block';
				root.appendChild(div);			
		
				var btnAtras = createBtn('a','back','ytClass','<<');		
				var btnAdelante = createBtn('a','next','ytClass','>>');	
		
				btnAtras.addEventListener('click',fnAtras);
				btnAdelante.addEventListener('click',fnAdelante);
			
				btnAtras.addEventListener('mouseover',function(e){										
					getPos();
					getNombres();					
					var title='';
					var actual = trackActual(video.currentTime);					
					if(actual>1){
						var title = 'Anterior Track ' + parseFloat(actual-1);					
					}					
					this.setAttribute('title',title);
					console.log(video.currentTime + ' -  Track: ' + actual );									
				})
				
				btnAdelante.addEventListener('mouseover',function(e){					
					getPos();
					getNombres();
					var title = '';					
					var actual = trackActual(video.currentTime);
					if(actual < pos.length){
						var title = 'Siguiente Track ' + parseFloat(actual+1);
					}					
					this.setAttribute('title',title);					
					console.log(video.currentTime + ' -  Track: ' + actual );					
				})			
			}	
		
		}else{
			console.log('No Hay descripcion');
		}		
		fnShow('track','block');
	}	
}

function checkPos(){	
	console.log(pos);
	if(pos.length==0){
		console.log('No se encontraron tracks');
		setColor('back',disableColor);
		setColor('next',disableColor);		
	}else{
		console.log('Se encontraron ' + pos.length + ' tracks');		
		setColor('back',enableColor);
		setColor('next',enableColor);
	}
	return pos.length;
}

function setColor(id,value) {
	var elem = document.getElementById(id);
	if(elem){
		elem.style.backgroundColor=value;
	}
}

function getPos(){
	pos=[];	//array posiciones
	var desc = document.getElementById('description');		
	if(desc){
		var elem = desc.querySelectorAll(selector);				
		if(elem.length > 0){			
			for (i = 0; i <= elem.length - 1; i++) {	
				var obj = elem[i];
				var nro = convert(obj); //obtener nro de la url
				fillPos(nro); 			//llenar array con datos	
			};			
			console.log(pos);
		}		
	}	
	return pos;	
}

function fillPos(value){	
	if(!isNaN(value)){
		pos.push(value);
	}	
}

function fnShow(id,value){	
	var elem = document.getElementById(id);
	if(elem){
		elem.style.display=value;
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


function getNombresNew() {
	var selectorName = 'yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer';
	var elem = document.querySelectorAll(selectorName);
	if (elem) {	
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


function lnk(value) {	
	//verifica si la url es de salto ej. watch?v=KBvfVKOv8WE&list=2&t=676s
	return value.match(/\&t=/);
}


/* 
function convert(input) {		
	var str = input;
	var times = str.split(":");
	times.reverse();
	var x = times.length, y = 0, z;
	for (var i = 0; i < x; i++) {
	    z = times[i] * Math.pow(60, i);
	    y += z;
	}	
	return(y);	
} 
*/