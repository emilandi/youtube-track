var ytInit;
(function() {

	ytInit=window.ytInitialData;
	if(ytInit){			
		console.log(ytInit);			
		setTimeout(function fnSetNames() {					
			localStorage.setItem('ytInit',JSON.stringify(ytInit));
		}, 2000);		
	}

})();


//var obj = ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.chapteredPlayerBarRenderer.chapters;		