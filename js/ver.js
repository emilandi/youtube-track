var video;
var pos =  new Array();
var nombres = new Array();
var clase = 'yt-simple-endpoint style-scope yt-formatted-string';
var selector = 'a.yt-simple-endpoint.style-scope.yt-formatted-string';
var disableColor = 'grey';
var enableColor = '#bb1c2c';

$(window).load(init);
$(document).ready(init);

function init(){	
	pos=[];
	nombres=[];	
	
	setTimeout(function() {		
		createDiv();
		fnVideo();	
	}, 2000);
	
	console.clear();
	console.log('ready!');	

	var h1 = document.querySelector('h1');
	var video = document.querySelector('video');
	var desc = document.querySelector('#description');

	document.addEventListener('mousemove',createDiv);
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
	console.log('Creando Div');
	var desc =  document.getElementById('description');
		
	if(desc){
		
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
			div.appendChild(btnAtras);							
			div.appendChild(btnAdelante);

			root.appendChild(div);					
	
			btnAtras.addEventListener('click',fnAtras);
			btnAdelante.addEventListener('click',fnAdelante);
		
			btnAtras.addEventListener('mouseover',function(e){										
				getPos();					
				var title='';
				var actual = trackActual(video.currentTime);					
				if(actual>1){												
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
				var title = '';					
				var actual = trackActual(video.currentTime);
				if(actual < pos.length){					
					var track = parseFloat(actual+1);
					var info = 'Track N° ' + track ;						
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
	$('track').fadeIn(600);
	// fnShow('track','block');
		
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
		elem.style.display='block';

		setTimeout(function(){
			$('#infobar').fadeOut(300);			
		}, 4000);
		
	}
}

function checkPos(){	
	
	var len = pos.length;	
	if(len==0){			
		setColor('back',disableColor);
		setColor('next',disableColor);
		//$('.ytClass').fadeOut(300);
	}else{	
		$('.ytClass').fadeIn(300);
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


function setClass(value) {
	document.querySelector(value).setClass(value);
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
	 var title = getNames(next);

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
	console.clear();	
	
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

function getNames(nro) {
	
	var titleArray = [];
	var tags = document.querySelector('#scriptTag').innerHTML;
	var elem = JSON.parse(tags);
	var desc = elem.description;
	var text = desc.split('\n');
	var regFix = /^\d{2}|[-*+|]/g;		   //reg fix char
	var reg = /([0-9]?[0-9]:[0-9][0-9])/g;  //reg time format
	
	text.forEach(element => {
		var objTime = element.match(reg);
		if(objTime){
			var textObj = element.replace(reg, "");
			var title  = textObj.replace(regFix,"").trim();
			titleArray.push(title);
			console.log(objTime,element,title);
		}
	});
	
	console.log(titleArray);
	
	var titleStr = titleArray[nro -1];
	if(titleStr){
		return titleStr.toUpperCase();
	}
}



// verifica si el valor tiene formato time HH:MM:SS
function fnTime(value) {
	//	/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/		
	var timeFormat = /^([0-9]{2})\:([0-9]{2})$/;	
	if(value.match(timeFormat)){
		// console.log('is time format ' + value );
		return true
	}else{
		// console.log('not is time format ' + value);		
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