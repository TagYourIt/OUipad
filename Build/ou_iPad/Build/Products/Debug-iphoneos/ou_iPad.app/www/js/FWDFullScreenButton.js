/* Full screen button */
(function (window){
	
	var FWDFullScreenButton = function(
			parent,
			normalImageNormalState, 
			normalImageSelectedState,
			fullImageNormalState,
			fullImageSelectedState,
			displayType,
			position,
			horizontalMargins,
			verticalMargins
		){
		
		var self  = this;
		var prototype = FWDFullScreenButton.prototype;
		
		this.mainHolder_do = null;
		this.normalButton_do = null;
		this.fullButton_do = null;
		this.normalImageNormalState_sdo = null;
		this.normalImageSelectedState_do = null;
		this.fullImageNormalState_sdo = null;
		this.fullImageSelectedState_sdo = null;
		
		this.dysplayType_str = displayType;
		this.position_str = position;
		
		this.horizontalMargins = horizontalMargins;	
		this.verticalMargins = verticalMargins;
		this.buttonWidth = normalImageNormalState.width;
		this.buttonHeight = normalImageNormalState.height;

		this.isFullScreen_bl = false;
		this.isOutOfTheWay = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
		
		/* init */
		this.init = function(){
			this.setWidth(this.buttonWidth);
			this.setHeight(this.buttonHeight);
			this.setupButtons();
			this.setButtonsState();
			this.hide(false);
		};
		
		//######################################//
		/* position */
		//######################################//
		this.position = function(){
			if(self.position_str == "topleft"){
				self.finalX = self.horizontalMargins;
				self.finalY = self.verticalMargins;
			}else if(self.position_str == "topright"){
				self.finalX = parent.stageWidth - self.buttonWidth - self.horizontalMargins;
				self.finalY = self.verticalMargins;
			}else if(self.position_str == "bottomleft"){
				self.finalX = self.horizontalMargins;
				self.finalY = parent.stageHeight - self.buttonHeight - self.verticalMargins;
			}else if(self.position_str == "bottomright"){
				self.finalX = parent.stageWidth - self.buttonWidth - self.horizontalMargins;
				self.finalY = parent.stageHeight - self.buttonHeight - self.verticalMargins;
			}
			
			self.setX(self.finalX);
			self.setY(self.finalY);	
		};
	
		//##########################################//
		/* setup buttons */
		//##########################################//
		this.setupButtons = function(){
			
			this.mainHolder_do = new FWDDisplayObject("div");
			this.mainHolder_do.setWidth(this.buttonWidth);
			this.mainHolder_do.setHeight(this.buttonHeight);
			this.mainHolder_do.setButtonMode(true);
			this.addChild(this.mainHolder_do);
			
			this.normalImageNormalState_sdo = new FWDSimpleDisplayObject("img");
			this.normalImageNormalState_sdo.setScreen(normalImageNormalState);
			this.normalImageSelectedState_do = new FWDSimpleDisplayObject("img");
			this.normalImageSelectedState_do.setScreen(normalImageSelectedState);
			
			this.fullImageNormalState_sdo = new FWDSimpleDisplayObject("img");
			this.fullImageNormalState_sdo.setScreen(fullImageNormalState);
			this.fullImageSelectedState_sdo = new FWDSimpleDisplayObject("img");
			this.fullImageSelectedState_sdo.setScreen(fullImageSelectedState);
			
			this.normalButton_do = new FWDDisplayObject("div");
			this.normalButton_do.setWidth(this.buttonWidth);
			this.normalButton_do.setHeight(this.buttonHeight);
			this.normalImageSelectedState_do.setAlpha(0);
			this.normalButton_do.addChild(this.normalImageNormalState_sdo);
			this.normalButton_do.addChild(this.normalImageSelectedState_do);
			this.mainHolder_do.addChild(this.normalButton_do);
			
			this.fullButton_do = new FWDDisplayObject("div");
			this.fullButton_do.setWidth(this.buttonWidth);
			this.fullButton_do.setHeight(this.buttonHeight);
			this.fullImageSelectedState_sdo.setAlpha(0);
			this.fullButton_do.addChild(this.fullImageNormalState_sdo);
			this.fullButton_do.addChild(this.fullImageSelectedState_sdo);
			this.mainHolder_do.addChild(this.fullButton_do);

			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerDown", self.onMouseDown);
				}else{
					self.screen.addEventListener("touchstart", self.onMouseDown);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mousedown", self.onMouseDown);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseDown);
			}
		};
		
		this.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				TweenMax.to(self.normalImageSelectedState_do, .6, {alpha:1, ease:Expo.easeOut});
				TweenMax.to(self.fullImageSelectedState_sdo, .6, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				TweenMax.to(self.normalImageSelectedState_do, .6, {alpha:0});
				TweenMax.to(self.fullImageSelectedState_sdo, .6, {alpha:0, ease:Expo.easeOut});
			}
		};
		
		this.onMouseDown = function(e){
			if(self.isFullScreen_bl){
				self.dispatchEvent(FWDFullScreenButton.GO_NORMAL_SCREEN);
				self.isFullScreen_bl = false;
			}else{
				self.dispatchEvent(FWDFullScreenButton.GO_FULL_SCREEN);
				self.isFullScreen_bl = true;
			}
			setTimeout(function(){
				if(self == null) return;
				TweenMax.killTweensOf(self.normalImageSelectedState_do);
				TweenMax.killTweensOf(self.fullImageSelectedState_sdo);
				self.normalImageSelectedState_do.setAlpha(0);
				self.fullImageSelectedState_sdo.setAlpha(0);
			}, 100)
			
			self.setButtonsState();
		};
		
		this.buttonOnTouchStart = function(e){
			if(self.isFullScreen_bl){
				self.dispatchEvent(FWDFullScreenButton.GO_NORMAL_SCREEN);
				self.isFullScreen_bl = false;
			}else{
				self.dispatchEvent(FWDFullScreenButton.GO_FULL_SCREEN);
				self.isFullScreen_bl = true;
			}
			self.setButtonsState();
		};
		
		/* set buttons initial state */
		this.setButtonsState = function(){
			if(self.isFullScreen_bl){
				self.fullButton_do.setVisible(false);
				self.normalButton_do.setVisible(true);
			}else{
				self.fullButton_do.setVisible(true);
				self.normalButton_do.setVisible(false);
			}
			TweenMax.to(self.normalImageSelectedState_do, .6, {alpha:0});
			TweenMax.to(self.fullImageSelectedState_sdo, .6, {alpha:0, ease:Expo.easeOut});
		};
		

		//#######################################//
		/* hide / show */
		//######################################//
		this.show = function(animate){
			TweenMax.killTweensOf(this.mainHolder_do);
			if(animate){
				TweenMax.to(this.mainHolder_do, .8, {y:0, delay:.3, ease:Expo.easeInOut});
			}else{
				this.mainHolder_do.y = 0;
			}
		};
		
		this.hide = function(){
			if(self.position_str == "topleft"){
				self.mainHolder_do.setY(-self.buttonHeight);
			}else if(self.position_str == "topright"){
				self.mainHolder_do.setY(-self.buttonHeight);
			}else if(self.position_str == "bottomleft"){
				self.mainHolder_do.setY(self.buttonHeight);
			}else if(self.position_str == "bottomright"){
				self.mainHolder_do.setY(self.buttonHeight);
			}
		};		
		
		//#######################################//
		/*destroy*/
		//#######################################//
		this.destroy = function(){
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerDown", self.onMouseDown);
				}else{
					self.screen.removeEventListener("touchstart", self.onMouseDown);
				}
			}else if(self.screen.removeEventListener){	
				self.screen.removeEventListener("mouseover", self.onMouseOver);
				self.screen.removeEventListener("mouseout", self.onMouseOut);
				self.screen.removeEventListener("mousedown", self.onMouseDown);
			}else if(self.screen.detachEvent){
				self.screen.detachEvent("onmouseover", self.onMouseOver);
				self.screen.detachEvent("onmouseout", self.onMouseOut);
				self.screen.detachEvent("onmousedown", self.onMouseDown);
			}
			
			TweenMax.killTweensOf(this.mainHolder_do);
			TweenMax.killTweensOf(this.fullImageSelectedState_sdo);
			TweenMax.killTweensOf(this.normalImageSelectedState_do);
			
			self.mainHolder_do.destroy();
			self.normalButton_do.destroy();
			self.fullButton_do.destroy();
			self.normalImageNormalState_sdo.destroy();
			self.normalImageSelectedState_do.destroy();
			self.fullImageNormalState_sdo.destroy();
			self.fullImageSelectedState_sdo.destroy();
			
			self.mainHolder_do = null;
			self.normalButton_do = null;
			self.fullButton_do = null;
			self.normalImageNormalState_sdo = null;
			self.normalImageSelectedState_do = null;
			self.fullImageNormalState_sdo = null;
			self.fullImageSelectedState_sdo = null;
			
			parent = null;
			normalImageNormalState = null; 
			normalImageSelectedState = null;
			fullImageNormalState = null;
			fullImageSelectedState = null;
			
			self.setInnerHTML("");
			prototype.destroy();	
			self = null;
			prototype = null;
			FWDFullScreenButton.prototype = null;
		};
		
		this.init();
	};
	
	/* set prototype */
	FWDFullScreenButton.setPrototype = function(){
		FWDFullScreenButton.prototype = new FWDDisplayObject("div", "absolute");
    };
    
    FWDFullScreenButton.GO_FULL_SCREEN = "goFullScreen";
    FWDFullScreenButton.GO_NORMAL_SCREEN = "goNormalScreen";
    
    FWDFullScreenButton.prototype = null;
	window.FWDFullScreenButton = FWDFullScreenButton;
	
}(window));