/* thumb */
(function(window){
	
	var FWDThumb = function(
			id, 
			data, 
			parent,
			thumbIconPath,
			thumbText,
			bgColor,
			overlayColor,
			thumbnailBorderNormalColor,
			thumbnailBorderSelectedColor,
			hasButtonMode){
		
		var self = this;
		var prototype = FWDThumb.prototype;

		this.icon_img = null;
		this.main_do = null;
		this.background_sdo = null;
		this.imageHolder_do = null;
		this.image_sdo = null;
		this.image = null;
		this.descriptionHolder_do = null;
		this.descriptionBg_do = null;
		this.descriptionText_do = null;
		this.description_do = null;
		this.over_sdo = null;
		
		this.animStartDir = null;
		this.thumbnailOverlayType_str = data.thumbnailOverlayType_str;
		this.thumbIconPath_str = thumbIconPath;
		this.thumbText_str = thumbText;
		this.borderNormalColor_str = thumbnailBorderNormalColor || data.thumbnailBorderNormalColor_str;
		this.borderSelectedColor_str = thumbnailBorderSelectedColor || data.thumbnailBorderSelectedColor_str;
		this.bgColor_str = bgColor || data.thumbnailBackgroundColor_str;
		this.overlayColor_str = overlayColor || data.thumbnailOverlayBackgroundColor_str;
		
		this.id = id;
		this.borderSize = data.thumbnailBorderSize;
		this.originalWidth;
		this.originalHeight;
		this.overlayOpacity = data.thumbnailOverlayOpacity;
		this.tempFinalX = -1;
		this.tempFinalY = -1;
		this.finalX = 0;
		this.finalY = 0;
		this.finalW = 0;
		this.finalH = 0;
		this.iconWidth = data.thumbIconWidth;
		this.iconHeight = data.thumbIconHeight;
		this.borderRadius = data.thumbnailBorderRadius; 
		this.imageCornerRadius = 6; 

		this.hideIconCompleteId_to;
		this.removeBackgroundDoId_to;
		this.positionTextWithDelayId_to;
		this.resizeThumbId_to;

		this.hasImage = false;
		this.used = false;
		this.firstTimeLoad = true;
		this.isSelected = false;
		this.isVisible = false;
		this.isHideTweening_bl = false;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
		this.allowBorderTween_bl = this.borderNormalColor_str != this.borderSelectedColor_str;
		this.hasButtonMode_bl = hasButtonMode;
		this.isMobile_bl = FWDUtils.isMobile;
		this.imageShowComplete_bl = false;

		/* init */
		this.init = function(){
			if(self.hasButtonMode_bl) self.setButtonMode(true);
			self.setupScreen();
		};
		
		/* setup screen */
		this.setupScreen = function(){
		
			self.main_do = new FWDDisplayObject("div");
			self.background_sdo = new FWDSimpleDisplayObject("div");
			self.imageHolder_do = new FWDDisplayObject("div");
			self.image_sdo = new FWDSimpleDisplayObject("img");
			self.over_sdo = new FWDSimpleDisplayObject("div");
			
			if((!self.isMobile_bl && self.thumbnailOverlayType_str == "text") || (self.hasPointerEvent_bl && self.thumbnailOverlayType_str == "text")){
				self.descriptionHolder_do = new FWDDisplayObject("div");
				self.description_do = new FWDDisplayObject("div");
				self.descriptionBg_do = new FWDDisplayObject("div");
				self.descriptionText_do = new FWDDisplayObject("div");
				
			}
			
			self.over_sdo.setResizableSizeAfterParent();
			if (FWDUtils.isIE){
				self.over_sdo.setBkColor("#000000");
				self.over_sdo.setAlpha(.001);
			}
	
			self.background_sdo.getStyle().border = "solid " + self.borderNormalColor_str + " " + self.borderSize + "px";
			self.background_sdo.setBkColor(self.bgColor_str);
			if(self.borderRadius != 0) self.background_sdo.getStyle().borderRadius = self.borderRadius + "px";
			self.main_do.addChild(self.background_sdo);
			self.addChild(self.main_do);
			self.addChild(self.over_sdo);
		};
		
		//########################################//
		/* setup description window */
		//########################################//
		this.setupIcon = function(){
			self.icon_img = new Image();
			self.icon_img.style.position = "absolute";
			self.icon_img.style.margin = "0px";
			self.icon_img.style.padding = "0px";
			self.icon_img.src = self.thumbIconPath_str;
			self.addChild(self.over_sdo);
		};
		
		this.showIcon = function(){
			
			clearTimeout(self.hideIconCompleteId_to);
			if(self.opacityType == "opacity"){
				self.icon_img.style.left = (parseInt((self.finalW - 80)/2)) + "px";
				self.icon_img.style.top = (parseInt((self.finalH - 80)/2)) + "px";
				self.icon_img.style.width = "80px";
				self.icon_img.style.height = "80px";
				self.icon_img.style.opacity = 0;
				
				TweenMax.killTweensOf(self.icon_img);
				TweenMax.to(self.icon_img, .5, {css:{opacity:1, 
					left:parseInt((self.finalW - self.iconWidth)/2), 
					top:parseInt((self.finalH - self.iconHeight)/2), 
					width:self.iconWidth, 
					height:self.iconHeight},
					ease:Expo.easeInOut});
			}else{
				self.icon_img.style.left = parseInt((self.finalW - self.iconWidth)/2) + "px";
				self.icon_img.style.top = parseInt((self.finalH - self.iconHeight)/2) + "px";
				self.icon_img.style.width = self.iconWidth + "px";
				self.icon_img.style.height = self.iconHeight + "px";
			}
			self.screen.appendChild(self.icon_img);
			self.addChild(self.over_sdo);
		};
		
		this.hideIcon = function(){
			if(self.opacityType == "opacity"){
				TweenMax.killTweensOf(self.icon_img);
				TweenMax.to(self.icon_img, .5, {css:{opacity:0}});
				self.hideIconCompleteId_to = setTimeout(self.hideIconComplete, 500);
			}else{
				self.hideIconComplete();
			}
		};
		
		this.hideIconComplete = function(){
			self.screen.removeChild(self.icon_img);
		};
		
		//########################################//
		/* setup description window */
		//########################################//
		this.setupDescription = function(){
			
			self.descriptionHolder_do.setX(self.borderSize);
			self.descriptionHolder_do.setY(self.borderSize);
			
			self.description_do.setWidth(self.finalW - self.borderSize * 2);
			self.description_do.setHeight(self.finalH - self.borderSize * 2);
			
			self.descriptionBg_do.setResizableSizeAfterParent();
			self.descriptionBg_do.setBkColor(self.overlayColor_str);
			self.descriptionBg_do.setAlpha(self.overlayOpacity);
			
			self.descriptionText_do.getStyle().width = "100%";
			self.descriptionText_do.getStyle().fontSmoothing = "antialiased";
			self.descriptionText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.descriptionText_do.getStyle().textRendering = "optimizeLegibility";
			
			if(self.borderRadius != 0) self.descriptionBg_do.getStyle().borderRadius = self.borderRadius + "px";
			
			self.addChild(self.descriptionHolder_do);
			self.descriptionHolder_do.addChild(self.description_do);
			self.descriptionText_do.setInnerHTML(self.thumbText_str);
			self.description_do.addChild(self.descriptionBg_do);
			self.description_do.addChild(self.descriptionText_do);
			//if(FWDUtils.isChrome){
				self.addChild(self.descriptionHolder_do);
				self.addChild(self.over_sdo);
			//}
		};
		
		this.positionText = function(){
			self.descriptionText_do.setY(Math.round((self.finalH - self.borderSize * 2 - self.descriptionText_do.getHeight())/2));
		};
		
		//###############################################//
		/* Remove background and image holder */
		//###############################################//
		this.removeUselesStuff = function(){
			
			self.imageShowComplete_bl = true;
			
			TweenMax.killTweensOf(self.imageHolder_do);
			TweenMax.killTweensOf(self.image_sdo);
			
			self.image_sdo.setX(self.borderSize);
			self.image_sdo.setY(self.borderSize);
			self.image_sdo.setWidth(self.finalW - self.borderSize * 2);
			self.image_sdo.setHeight(self.finalH - self.borderSize * 2);
			
			self.background_sdo.setBkColor(self.borderNormalColor_str);
			self.imageHolder_do.removeChild(self.image_sdo);
			self.main_do.removeChild(self.imageHolder_do);
			
			self.imageHolder_do.destroy();
			self.imageHolder_do = null;
			
			self.main_do.addChild(self.image_sdo);
		};
		
		//######################################//
		/* add image */
		//######################################//
		this.addImage = function(image){
			
			self.image_sdo.setScreen(image);
			if(self.borderRadius != 0) self.image_sdo.getStyle().borderRadius = self.borderRadius + "px";
			
			self.hasImage = true;
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.over_sdo.screen.addEventListener("MSPointerOver", self.onMouseOverHandler);
					self.over_sdo.screen.addEventListener("MSPointerOut", self.onMouseOutHandler);
					self.over_sdo.screen.addEventListener("MSPointerUp", self.onMouseClickHandler);
				}else{
					self.over_sdo.screen.addEventListener("touchend", self.onMouseClickHandler);
				}
				
			}else if(self.over_sdo.screen.addEventListener){
				self.over_sdo.screen.addEventListener("mouseover", self.onMouseOverHandler);
				self.over_sdo.screen.addEventListener("mouseout", self.onMouseOutHandler);
				self.over_sdo.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.attachEvent){
				self.over_sdo.screen.attachEvent("onmouseover", self.onMouseOverHandler);
				self.over_sdo.screen.attachEvent("onmouseout", self.onMouseOutHandler);
				self.over_sdo.screen.attachEvent("onclick", self.onMouseClickHandler);
			}
			
			if((!self.isMobile_bl && self.thumbnailOverlayType_str == "text") || (self.hasPointerEvent_bl && self.thumbnailOverlayType_str == "text")){
				self.setupDescription();
			}else if((!self.isMobile_bl && self.thumbnailOverlayType_str == "icons") || (self.hasPointerEvent_bl && self.thumbnailOverlayType_str == "icons")){
				self.setupIcon();
			}
			
			self.show();
		};
		
		this.onMouseOverHandler = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if (!self.isSelected){
					self.isSelected = true;
					if(self.allowBorderTween_bl) self.setSelectedState();
					if(self.descriptionHolder_do){
						self.getOverAnimPos(e);
						self.showDescription();
					}else if(self.icon_img){
						self.showIcon();
					}
				}
			}
		};

		this.onMouseOutHandler = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if (self.isSelected){
					self.isSelected = false;
					if(self.allowBorderTween_bl) self.setNormalState();
					if(self.descriptionHolder_do ){
						self.getOverAnimPos(e);
						self.hideDescription();
					}else if(self.icon_img){
						self.hideIcon();
					}
				}
			}
		};
	
		this.onMouseClickHandler = function(e){
			if(self.thumbnailOverlayType_str == "none") return;
			self.dispatchEvent(FWDThumb.CLICK, {id:self.id});
		};
		
		this.checkVisibility = function(){
			
			if (((self.finalX + parent.thumbnailsFinalX > -self.finalW) && (self.finalX + parent.thumbnailsFinalX  < parent.stageWidth))
					|| ((self.getX()  + parent.thumbnailsFinalX > -self.finalW) && (self.getX()  + parent.thumbnailsFinalX < parent.stageWidth)))
			{
				self.isVisible = true;
			}else{
				self.isVisible = false;
			}
		};
		
		this.resizeThumb = function(){	
			
			TweenMax.killTweensOf(self);
			
			self.checkVisibility();
			
			var imgW = self.finalW - self.borderSize * 2;
			var imgH = self.finalH - self.borderSize * 2;
			
			self.main_do.setWidth(self.finalW);
			self.main_do.setHeight(self.finalH);
			
			if(self.background_sdo){
				self.background_sdo.setWidth(imgW);
				self.background_sdo.setHeight(imgH);
			}
			
			if(self.description_do){
				self.description_do.setWidth(imgW);
				self.description_do.setHeight(imgH);
			}
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			
			if (!self.firstTimeLoad){				
				
				self.image_sdo.setWidth(imgW);
				self.image_sdo.setHeight(imgH);
				
				if (self.imageHolder_do){
					self.imageHolder_do.setX(self.borderSize);
					self.imageHolder_do.setY(self.borderSize);
					self.imageHolder_do.setWidth(imgW);
					self.imageHolder_do.setHeight(imgH);
					
					self.image_sdo.setX(0);
					self.image_sdo.setY(0);
				}else{
					self.image_sdo.setX(self.borderSize);
					self.image_sdo.setY(self.borderSize);
				}
				
				self.main_do.setAlpha(1);
				
				if (self.isVisible && !self.isMobile_bl){
					TweenMax.to(self, .8, {x:self.finalX, y:self.finalY, delay:.2, ease:Expo.easeInOut});
				}else{
					self.setX(self.finalX);
					self.setY(self.finalY);
				}
				
				if (!self.imageShowComplete_bl){
					clearTimeout(self.removeBackgroundDoId_to);
					self.removeUselesStuff();
				}
			}else{
				TweenMax.killTweensOf(self.image_sdo);
				TweenMax.killTweensOf(self.imageHolder_do);
			
				self.setX(self.finalX);
				self.setY(self.finalY);
				
				self.imageHolder_do.setX(parseInt(self.finalW/2));
				self.imageHolder_do.setY(parseInt(self.finalH/2));
				
				self.image_sdo.setX(-parseInt(self.image_sdo.getWidth()/2));
				self.image_sdo.setY(-parseInt(self.image_sdo.getHeight()/2));
				
				TweenMax.to(self.imageHolder_do, .8, {x:self.borderSize, y:self.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});
				TweenMax.to(self.image_sdo, .8, {x:0, y:0, w:imgW, h:imgH, ease:Expo.easeInOut});
				self.firstTimeLoad = false;
				
				self.imageHolder_do.addChild(self.image_sdo);
				self.main_do.addChild(self.imageHolder_do);
				
				self.removeBackgroundDoId_to = setTimeout(self.removeUselesStuff, 800);
			}
		};

		/* set normal/selected display states */
		this.setNormalState = function(){
			TweenMax.to(self.background_sdo.screen, .8, {css : {borderColor : self.borderNormalColor_str}, ease : Expo.easeOut});
		};

		this.setSelectedState = function(){
			TweenMax.to(self.background_sdo.screen, .8, {css : {borderColor : self.borderSelectedColor_str}, ease : Expo.easeOut});
		};
		
		this.getOverAnimPos = function(e){
			
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
			var globalX = self.getGlobalX();
			var globalY = self.getGlobalY();
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			var dx = screenX - (globalX + self.finalW/2);
			var dy = screenY - (globalY + self.finalH/2);
			
			var angle = Math.atan2(dy, dx) * 180/Math.PI;
			
			var thumbAngle = Math.atan2(self.finalH, self.finalW) * 180/Math.PI;
			
			if ((angle < thumbAngle) && (angle > -thumbAngle))
				self.animStartDir = FWDThumb.RIGHT;
				
			if ((angle > thumbAngle) && (angle < (180 - thumbAngle)))
				self.animStartDir = FWDThumb.BOTTOM;
				
			if ((angle < (-180 + thumbAngle)) || (angle > (180 - thumbAngle)))
				self.animStartDir = FWDThumb.LEFT;
				
			if ((angle > (-180 + thumbAngle)) && (angle < -thumbAngle))
				self.animStartDir = FWDThumb.TOP;
		};
		
		this.showDescription = function(){
			
			//if(!FWDUtils.isChrome){
				self.addChild(self.descriptionHolder_do);
				self.addChild(self.over_sdo);
			//}
			
			clearTimeout(self.positionTextWithDelayId_to);
			self.positionTextWithDelayId_to = setTimeout(self.positionText, 40);
			
			self.descriptionHolder_do.setWidth(self.finalW - (self.borderSize * 2));
			self.descriptionHolder_do.setHeight(self.finalH - (self.borderSize * 2));
			
			if (self.animStartDir ==  FWDThumb.TOP){
				self.description_do.setX(0);
				self.description_do.setY(-self.finalH + (self.borderSize * 2));
			}else if (self.animStartDir ==  FWDThumb.RIGHT){
				self.description_do.setX(self.finalW - (self.borderSize * 2));
				self.description_do.setY(0);
			}else if (self.animStartDir ==  FWDThumb.BOTTOM){
				self.description_do.setX(0);
				self.description_do.setY(self.finalH - (self.borderSize * 2));
			}else if (self.animStartDir ==  FWDThumb.LEFT){
				self.description_do.setX(-self.finalW + (self.borderSize * 2));
				self.description_do.setY(0);
			}
			
			TweenMax.killTweensOf(self.description_do);	
			TweenMax.to(self.description_do, .4, {x:0, y:0});
		};
		
		this.hideDescription = function(){
			var newX;
			var newY;
			
			if (self.animStartDir ==  FWDThumb.TOP){
				newX = 0;
				newY = -self.finalH + (self.borderSize * 2);
			}else if (self.animStartDir ==  FWDThumb.RIGHT){
				newX = self.finalW - (self.borderSize * 2);
				newY = 0;
			}else if (self.animStartDir ==  FWDThumb.BOTTOM){
				newX = 0;
				newY = self.finalH - (self.borderSize * 2);
			}else if (self.animStartDir ==  FWDThumb.LEFT){
				newX = -self.finalW + (self.borderSize * 2);
				newY = 0;
			}
			
			TweenMax.killTweensOf(self.description_do);	
			TweenMax.to(self.description_do, .4, {x:newX, y:newY, onComplete:self.hideDescriptionComplete});
		};
		
		this.hideDescriptionComplete = function(){
			//if(!FWDUtils.isChrome){
				self.removeChild(self.descriptionHolder_do);
			//}else{
			//	self.description_do.setX(-500);
			//}
			
		};		

		//########################################//
		/* show/hide thumb */
		//########################################//
		this.show = function(){
			self.main_do.setAlpha(0);
			TweenMax.to(self.main_do, .8, {alpha:1});
		};
		
		this.hide = function(dl){
			self.isHideTweening_bl = true;
			clearTimeout(self.hideIconCompleteId_to);
			clearTimeout(self.removeBackgroundDoId_to);
			clearTimeout(self.positionTextWithDelayId_to);
			clearTimeout(self.resizeThumbId_to);
			
			TweenMax.killTweensOf(self.main_do);
			TweenMax.to(self.main_do, .8, {alpha:0, delay:dl + .2, ease:Expo.easeOut, onComplete:self.hideTweenDone});
			
			if(!self.imageHolder_do){
				self.imageHolder_do = new FWDDisplayObject("div");
				self.imageHolder_do.setWidth(self.finalW - self.borderSize);
				self.imageHolder_do.setHeight(self.finalH - self.borderSize);
				self.imageHolder_do.addChild(self.image_sdo);
				self.main_do.addChild(self.imageHolder_do);
			}
			
			TweenMax.killTweensOf(self.imageHolder_do);
			TweenMax.to(self.imageHolder_do, .8, {x:parseInt(self.finalW/2), y:parseInt(self.finalH/2), w:0, h:0, delay:dl, ease:Expo.easeInOut});
			
			if(self.descriptionHolder_do ){
				if(self.descriptionHolder_do && self.isSelected){
					self.hideDescription();
				}else if(self.icon_img){
					self.hideIcon();
				}
			}
			
			if(self.image_sdo){
				TweenMax.killTweensOf(self.image_sdo);
				TweenMax.to(self.image_sdo, .8, {x:-parseInt(self.image_sdo.getWidth()/2), y:-parseInt(self.image_sdo.getHeight()/2), delay:dl, ease:Expo.easeInOut});
			}
		};
		
		this.hideTweenDone = function(){
			self.isHideTweening_bl = false;
		};
		
		//####################################//
		/* destroy */
		//####################################//
		this.destroy = function(){
			TweenMax.killTweensOf(self);
			
			clearTimeout(self.hideIconCompleteId_to);
			clearTimeout(self.removeBackgroundDoId_to);
			clearTimeout(self.positionTextWithDelayId_to);
			clearTimeout(self.resizeThumbId_to);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.over_sdo.screen.removeEventListener("MSPointerOver", self.onMouseOverHandler);
					self.over_sdo.screen.removeEventListener("MSPointerOut", self.onMouseOutHandler);
					self.over_sdo.screen.removeEventListener("MSPointerUp", self.onMouseClickHandler);
				}
				self.over_sdo.screen.removeEventListener("touchend", self.onMouseClickHandler);
			}else if(self.over_sdo.screen.removeEventListener){
				self.over_sdo.screen.removeEventListener("mouseover", self.onMouseOverHandler);
				self.over_sdo.screen.removeEventListener("mouseout", self.onMouseOutHandler);
				self.over_sdo.screen.removeEventListener("click", self.onMouseClickHandler);
			}else if(self.over_sdo.screen.detachEvent){
				self.over_sdo.screen.detachEvent("onmouseover", self.onMouseOverHandler);
				self.over_sdo.screen.detachEvent("onmouseout", self.onMouseOutHandler);
				self.over_sdo.screen.detachEvent("onclick", self.onMouseClickHandler);
			}
			
			if(self.image_sdo.screen){
				TweenMax.killTweensOf(self.image_sdo);
				self.image_sdo.screen.onload = null;
				self.image_sdo.screen.onerror = null;
				self.image_sdo.screen.src = null;
				self.image_sdo.destroy();
			}
			
			if(self.icon_img){
				TweenMax.killTweensOf(self.icon_img);
				self.icon_img.onload = null;
				self.icon_img.onerror = null;
				self.icon_img.src = null;
			}
			
			if(self.imageHolder_do){
				TweenMax.killTweensOf(self.imageHolder_do);
				self.imageHolder_do.destroy();
			}
			
			if(self.description_do){
				TweenMax.killTweensOf(self.description_do);
				self.descriptionHolder_do.destroy();
				self.description_do.destroy();
				self.descriptionBg_do.destroy();
				self.descriptionText_do.destroy();
			}
			
			self.over_sdo.destroy();
			
			TweenMax.killTweensOf(self.main_do);
			self.main_do.destroy();
			
			if(self.background_sdo) self.background_sdo.destroy();
			
			self.icon_img = null;
			self.main_do = null;
			self.border_do = null;
			self.background_sdo = null;
			self.imageHolder_do = null;
			self.image_sdo = null;
			self.image = null;
			self.descriptionHolder_do = null;
			self.descriptionBg_do = null;
			self.descriptionText_do = null;
			self.description_do = null;
			self.over_sdo = null;
			
			data = null;
			parent = null;
			self.setInnerHTML("");
			prototype.destroy();
			prototype = null;
			self = null;
			FWDThumb.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDThumb.setPrototype = function()
	{
		FWDThumb.prototype = new FWDDisplayObject("div");
	};
	
	FWDThumb.LEFT = "left";
	FWDThumb.RIGHT = "right";
	FWDThumb.TOP = "top";
	FWDThumb.BOTTOM = "bottom";
	FWDThumb.CLICK =  "onClick";

	FWDThumb.prototype = null;
	window.FWDThumb = FWDThumb;
}(window));