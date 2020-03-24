var rate;
var afip;
var aduana;
var total;
var title;
var sumaUSD;
var sumaARS;

$(document).ready(function() {            
	console.clear();
	console.log('Ready!');	
	
	var host=getHost();	
	if(host=="www.ebay.com" || host=="www.amazon.com" ){
		getRate('USD');		
	}	

});

function init(resp){
	console.log(resp);
	
	ship=0;
	price=0;

	var obj = JSON.parse(resp);			
	rate = obj.rates.ARS;
	
	console.log(rate);
	
	var host = location.hostname;	
	if(host=="www.ebay.com"){
		fnEbay();
	};
	if(host=="www.amazon.com"){
		fnAmzn();
	};
}

function getHost(){
	return location.hostname;
}


function getRate(obj) {
	console.log('Consultando cotizacion...');

	if (obj=='USD'){	
		var url = 'https://api.exchangerate-api.com/v4/latest/USD';
	}else{
		var url = 'https://api.exchangerate-api.com/v4/latest/EUR';
	}

	var xhr = new XMLHttpRequest();		
	xhr.open("GET", url,true);	
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == XMLHttpRequest.DONE) {	     	
	     var obj = xhr;			
			var resp=obj.response;    		    		    		
    		init(resp); 
	    }
	}	
	
	xhr.onerror = function () {	 
		console.log("** An error occurred during the transaction");
	};
	
	xhr.send();	
	
}

function fnEbay(){
	
	//publicacion individual
	var obj = document.getElementById('prcIsum');	
	
	if(obj){		
		var price = fixNum(obj.attributes["content"].value);					
		
		//ship
		var elem = document.getElementById('fshippingCost');
		if(elem){			
			var num = elem.firstElementChild.innerText;									
			ship = fixStr(num);				
		}
		
		var total = calcular(price,ship,rate);
		var texto = 'ARS ' + fixNum(total);

		//createElem('span','idcalcula','calcula',obj,texto);
		
		var elem = document.createElement('span');				
			elem.id='idcalcula';
			elem.classList.add('calcula');
			elem.innerText=texto;
			elem.setAttribute('data-ship',parseFloat(ship));
			elem.setAttribute('data-price',parseFloat(price));
			obj.appendChild(elem);

			elem.addEventListener("mouseover", function(e){	
				var x=e.pageX + 70; //left
				var y=e.pageY - 195; //top
				var price = this.attributes["data-price"].value;
				var ship = this.attributes["data-ship"].value;
				fnDetalleList(price,ship);
				fnShowBubble(x,y);
			} , false);
			
			elem.addEventListener("mouseleave", function(){
				fnHideBubble();
			});				
	}	

	
	//listado b
	var el = document.getElementsByClassName('b-info__price clearfix');
	if(el){
		for (var i = 0; i < el.length -1; i++) {
			var ship = 0;
			var price = fixStr(el[i].firstElementChild.innerText);
			var total = calcular(fixStr(price),fixStr(ship),rate);
			var texto = 'ARS ' + parseFloat(total).toFixed(2);
			
			//create btn total
			var elem = document.createElement('span');				
			elem.classList.add('ebaylist');
			elem.innerText=texto;
			elem.setAttribute('data-ship',parseFloat(ship));
			elem.setAttribute('data-price',parseFloat(price));
			el[i].appendChild(elem);			
		
			//click
			elem.addEventListener('mouseover', function (e){
				
				var x=e.pageX + 95; //left
				var y=e.pageY - 195; //top	
				
				//actualiza valores
				var price = this.attributes["data-price"].value;
				var ship = this.attributes["data-ship"].value;					
				
				//llenar info bubble 
				fnDetalleList(price,ship,e);
				
				//mostrar
				fnShowBubble(x,y);
			});
			
			elem.addEventListener("mouseleave", function(){
				fnHideBubble();
			});		

		}
	}
	
	// es una pagina listado
	var el = document.getElementsByClassName('s-item__info clearfix');
	
	if (el){
		
		for (var i = 0; i < el.length -1; i++) {			
			
			//title			
			var title = el[i].getElementsByClassName('s-item__title')[0].innerText;
			
			//price
			var price = fixStr(el[i].getElementsByClassName('s-item__price')[0].innerText);			
			
			//ship
			var ship = fixStr(el[i].getElementsByClassName('s-item__shipping s-item__logisticsCost')[0].innerText);		

			var total = calcular(fixStr(price),fixStr(ship),rate);							
			
			//create btn total
			var elem = document.createElement('span');				
			//elem.classList.add('ebaylist');
			elem.innerText='ARS ' + parseFloat(total).toFixed(2);
			elem.setAttribute('data-ship',parseFloat(ship));
			elem.setAttribute('data-price',parseFloat(price));
			el[i].appendChild(elem);			
		
			//click
			elem.addEventListener('mouseover', function (e){
				
				var x=e.pageX + 95; //left
				var y=e.pageY - 195; //top		
				
				//actualiza valores
				var price = this.attributes["data-price"].value;
				var ship = this.attributes["data-ship"].value;					
				
				//llenar info 
				fnDetalleList(price,ship,e);
				
				//mostrar
				fnShowBubble(x,y);
			});
			
			elem.addEventListener("mouseleave", function(){
				fnHideBubble();
			});			
			
			
			//al hacer click encualquier parte del documento oculta el bubble
			document.addEventListener('click',function(event){								
				if(event.target.className!='ebaylist'){
					var obj = document.getElementById('idbubble');
					if(obj){obj.style.display='none';}
				}
			});							
		}		
	}

	//home site
	var obj = document.getElementsByClassName('hl-item__displayPrice secondary-text');
	if(obj){
		
		var ship = 0;		
		
		for (var i = 0; i < obj.length; i++) {
			var price = obj[i].innerText;
			var pricenew = fixStr(price);
			
			price = parseFloat(pricenew);
			console.log('Precio: ' + price + ' rate: ' + rate);		

			var total = calcular(price,ship,rate);
			var totalnew = 'ARS ' + fixNum(total);
		
			if(total){
				//createElem('span','','ebayhome',obj[i],totalnew);				
				var elem = document.createElement('span');	
				
				elem.classList.add('ebayhome');
				elem.innerText='ARS ' + parseFloat(total).toFixed(2);
				elem.setAttribute('data-ship',parseFloat(ship));
				elem.setAttribute('data-price',parseFloat(price));
				obj[i].appendChild(elem);	
				
				elem.addEventListener("mouseover", function(e){	
					var x=e.pageX + 70; //left
					var y=e.pageY - 195; //top
					var price = this.attributes["data-price"].value;
					var ship = this.attributes["data-ship"].value;
					fnDetalleList(price,ship);
					fnShowBubble(x,y);
				} , false);
				
				elem.addEventListener("mouseleave", function(){
					fnHideBubble();	
				});		
			}			
		};	
		
		//elem.addEventListener("mouseover", fnShowBubble, false);

	};

}

function fnHideBubble(){
	var obj = document.getElementById('idbubble');
	if(obj){obj.style.display='none';}
}


function fnAmzn(){
	
}

function fnDetalleList(price,ship){	
	
	var priceUSD=fixNum(price);
	var shipUSD=fixNum(ship);
	
	var root = document.body;
	var obj = document.getElementById('idbubble');
	
	calcular(price,ship,rate);	
	
	if(obj==null){
		
		//bubble div
		createElem('div','idbubble','calcula',root,'');		
			
		//items		
		var items = document.getElementById('idbubble');
			
			createElem('text','txtprecio','label',items,'Importe:');
			createElem('text','idprecio','txt',items,fnFix(priceARS));
			
			createElem('text','txtenvio','label',items,'Envio:' );
			createElem('text','idenvio','txt',items, fnFix(shipARS));
			
			createElem('text','txtafip','label',items,'AFIP:' );
			createElem('text','afip','txt',items, fnFix(afip));
			
			createElem('text','txtaduana','label',items,'Aduana:');
			createElem('text','aduana','txt',items, aduana);
			
			createElem('text','txttotal','label',items,'Total ARS: ' );
			createElem('text','total','txt',items, fnFix(total));
			
			items.style.display='none';
	}
	
	//fill values
	document.getElementById('idprecio').innerText=fnFix(priceARS);
	document.getElementById('idenvio').innerText=fnFix(shipARS);
	document.getElementById('afip').innerText=fnFix(afip);
	document.getElementById('aduana').innerText=aduana;
	document.getElementById('total').innerText=fnFix(total);	

	console.clear();
	console.log('Title: ' + title);
	console.log('Precio USD: ' + priceUSD);
	console.log('Envio USD: ' + shipUSD);
	console.log('---------------------------');	
	console.log('Total USD: ' + sumaUSD);
	
	console.log('');	
	
	console.log('PrecioARS: ' + priceARS);
	console.log('Envio ARS: ' + shipARS);
	console.log('Aduana: ' + aduana);
	console.log('AFIP: ' + afip);
	console.log('---------------------------');	
	console.log('TOTAL: ' + total);	
};

function calcular(price,ship,rate){
	
	var priceUSD=fixNum(price);
	var shipUSD=fixNum(ship);	
	
	sumaUSD = fixNum(priceUSD + shipUSD);	
	sumaARS = fixNum(sumaUSD * rate);
	
	shipARS  = fixNum(shipUSD * rate);
	priceARS = fixNum(priceUSD * rate) ;
	
	afip = fixNum(sumaARS) * 0.30;
	aduana = fnAduana(price,rate);
	
	if(priceARS==undefined){
		priceARS=0;
	}
	
	if(shipARS==undefined){
		shipARS=0;
	}
	
	total = parseFloat(priceARS) + parseFloat(shipARS) + parseFloat(afip) + parseFloat(aduana);	
	
	return parseFloat(total);		
}

function createElem(tipo,id,clase,root,texto){		
	var el = document.createElement(tipo);	
	el.id=id;
	el.innerText=texto;
	el.classList.add(clase);	
	root.appendChild(el);
}

//toogle bubble cuadro con detalles 
function fnShowBubble(x,y){
	
	console.log('Creando bubble..' + x,y);	
	
	var left = x + 'px';
	var top  = y + 'px';
	
	var bubble = document.getElementById("idbubble");
	if(bubble){
		bubble.style.top=top;
		bubble.style.left=left;		
		if(bubble.style.display=='none' || bubble.style.display==null){
			bubble.style.display='block';					
		}else{
			bubble.style.display='none';
		}
	}
}

function fnAduana(price,rate){
	
	var aduana = 0;
	if (price > 50){
		aduana = parseFloat((price -50) * rate) * 0.5;
	}	
	return parseFloat(aduana).toFixed(2);
}

function fnFix(value){
	return value.toFixed(2);
}

function fixStr(value){
	
	//solo para precio y envio	
	var cadena = /([$|£|€|U|S|D|A|R|E|shipping|+])/g;
	var newvalue = value.toString().replace(',','.');
	var fixStr = newvalue.replace(cadena,'');	
	
	return parseFloat(fixStr);//retorna string limpio de signos
}

function fixNum(value){	
	
	var priceNum=parseFloat(value).toFixed(2);
	if(priceNum==undefined || isNaN(priceNum) || priceNum==null ){
		priceNum=0;
	}	
	return parseFloat(priceNum);
}



/* 	//total general
	createElem('text','idcalcula','calcula','prcIsum','ARS: ' + fnFix(total));
	
	//bubble div
	createElem('div','idbubble','calcula','prcIsum','');
		
		createElem('text','txtprecio','label','idbubble','Importe:');
		createElem('text','idprecio','bubble','idbubble',fnFix(priceARS));
		
		createElem('text','txtenvio','label','idbubble','Envio:' );
		createElem('text','idenvio','bubble','idbubble', fnFix(shipARS));
		
		createElem('text','txtafip','label','idbubble','AFIP:' );
		createElem('text','afip','bubble','idbubble', fnFix(afip));
		
		createElem('text','txtaduana','label','idbubble','Aduana:');
		createElem('text','aduana','bubble','idbubble', aduana);
		
		createElem('text','txttotal','label','idbubble','Total ARS: ' );
		createElem('text','total','bubble','idbubble', fnFix(total));	
*/





/*var div = document.createElement('div');
div.id="bubble";
div.classList.add("calcula");

document.getElementById('prcIsum').appendChild(div);

var el = document.createElement("text");
el.id="detalle";
el.innerText=sumaARS,aduana,afip + ' =' + total;
div.appendChild(el);

console.log(sumaUSD);
	
var el = document.createElement("div");
el.id="idcalcula";	

var obj = document.getElementById('prcIsum');
obj.appendChild(el);	

var el = document.createElement("text");	
el.innerText= 'ARS: ' + parseFloat(retotal).toFixed(2);
el.classList.add("calcula");

*/


//prcIsum_bidPrice //id bid remate
//fshippingCost id ship
//https://www.ebay.com/itm/2-Compaq-TFT-5010-Rack-Mount-15-LCD-Monitors-w-Power-Supplies/324102848837?hash=item4b76090145:g:GXQAAOSwVG9dChfQ

//mm-saleDscPrc   //id ofertas 
//shSummary       //is ship
//https://www.ebay.com/itm/15-6-13-3-11-6-Full-HD-IPS-Monitor-1920x1080-Gaming-Screen-Smart-Case-HDMI/293332862488?_trkparms=aid%3D1110002%26algo%3DSPLICE.SOI%26ao%3D1%26asc%3D225086%26meid%3D56b3a2965c6f4fe08e800206c027e8a0%26pid%3D100008%26rk%3D1%26rkt%3D7%26sd%3D293054458763%26itm%3D293332862488%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DPromotedSellersOtherItemsV2%26brand%3DUnbranded&_trksid=p2047675.c100008.m2219

//display-price   //class new
//logistics-cost  //class ship
//https://www.ebay.com/p/8034815559?iid=312824053495&rt=nc