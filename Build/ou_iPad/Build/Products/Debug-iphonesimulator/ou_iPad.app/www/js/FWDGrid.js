/* Gallery */
(function(window)
{
	var FWDGrid = function(props){
		var self = this;
		
		this.main_do = null;
		this.comboBox_do = null;
		this.fullScreenButton_do = null;
		this.preloader_do = null;
		this.customContextMenu_do = null;
		this.info_do = null;
		this.thumbsManager_do = null;
		this.disable_sdo = null;
		this.stageContainer = null;

		this.stageWidth = 0;
		this.stageHeight = 0;
		this.autoScale_bl = false;
		this.doNotExceedOriginalSize_bl = true;
		
		this.resizeHandlerId1_to;
		this.resizeHandlerId2_to;
		this.disableAllOnFullScreenChangeId_to;
		this.orientationChangeId_to;
		
		this.orintationChanceComplete_bl = true;
		this.isMobile_bl = FWDUtils.isMobile;
		this.isFullScreen_bl = false;
		this.mustHaveHolderDiv_bl = false;

		/* init */
		this.init = function(){
			
			TweenLite.ticker.useRAF(false);
			self.props_obj = props;
		
			if(!self.props_obj){
				alert("FWDGrid constructor properties object is not defined!");
				return;
			}
			
			if(!self.props_obj.displayType){
				alert("Display type is not specified!");
				return;
			}
		
			self.displayType = props.displayType.toLowerCase();
			
			if(!self.displayType) self.displayType = FWDGrid.FULL_SCREEN;

			if(self.displayType == FWDGrid.RESPONSIVE) self.mustHaveHolderDiv_bl = true;
			
			self.body = document.getElementsByTagName("body")[0];
	
			if(!self.displayType) self.displayType = FWDGrid.FULL_SCREEN;

			if(self.displayType == FWDGrid.RESPONSIVE || self.displayType == FWDGrid.FLUID_WIDTH) self.mustHaveHolderDiv_bl = true;
			
			self.body = document.getElementsByTagName("body")[0];
	
			if(!self.props_obj.divHolderId){		
				if(self.mustHaveHolderDiv_bl){
					alert("Property divHolderId is not defined in the FWDGrid constructor, self property represents the div id into which the grid is added as a child!");
					return;
				}
			}
			
			if(self.mustHaveHolderDiv_bl && !FWDUtils.getChildById(self.props_obj.divHolderId)){
				alert("FWDGrid holder div is not found, please make sure that the div exsists and the id is correct! " + self.props_obj.divHolderId);
				return;
			}
			
			if(self.mustHaveHolderDiv_bl && !self.props_obj.width){
				alert("The width is not defined, plese make sure that the width property is definded in the FWDGrid constructor! ");
				return;
			}
			
			if(self.mustHaveHolderDiv_bl && !self.props_obj.height){
				alert("The height is not defined, plese make sure that the height property is definded in the FWDGrid constructor! ");
				return;
			}
		
			if(self.displayType == FWDGrid.FULL_SCREEN){
				if(FWDUtils.isIEAndLessThen9){
					self.stageContainer = self.body;
				}else{
					self.stageContainer = document.documentElement;
				}
			}else{
				self.stageContainer = FWDUtils.getChildById(self.props_obj.divHolderId);
			}
			
			this.autoScale_bl = self.props_obj.autoScale;
			this.autoScale_bl = self.autoScale_bl == "yes" ? true : false;
			
			this.backgroundColor_str = self.props_obj.backgroundColor;
			this.originalWidth = self.props_obj.width;
			this.originalHeight = self.props_obj.height;
			
			this.setupMainDO();
			this.setupInfo();
			this.setupData();
			this.startResizeHandler();
		};

		// #############################################//
		/* setup main do */
		// #############################################//
		this.setupMainDO = function(){
			self.main_do = new FWDDisplayObject("div", "relative");
			self.main_do.getStyle().msTouchAction = "none";
			self.main_do.getStyle().webkitTapHighlightColor =  "rgba(0, 0, 0, 0)";  
			if(self.isMobile_bl) self.main_do.setBackfaceVisibility();
			self.main_do.setBkColor(self.backgroundColor_str);
			
			if(!FWDUtils.isMobile || (FWDUtils.isMobile && FWDUtils.hasPointerEvent)) self.main_do.setSelectable(false);
			
			//start full screen
			if(self.displayType == FWDGrid.FULL_SCREEN){	
				self.stageContainer.style.overflow = "hidden";
				self.main_do.getStyle().position = "absolute";
				document.documentElement.style.overflow = "hidden";
				self.stageContainer.appendChild(self.main_do.screen);
			}else if(self.displayType == FWDGrid.FLUID_WIDTH){	
				self.main_do.getStyle().position = "absolute";
				if(FWDUtils.isIE7){
					self.body.appendChild(this.main_do.screen);
				}else{
					document.documentElement.appendChild(self.main_do.screen);
				}
			}else{
				self.stageContainer.appendChild(self.main_do.screen);
			}	
		};

		// #############################################//
		/* setup info */
		// #############################################//
		this.setupInfo = function(){
			FWDInfo.setPrototype();
			self.info_do = new FWDInfo();
		};

		//#############################################//
		/* resize handler */
		//#############################################//
		self.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChance);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 50);
			if(self.displayType == FWDGrid.FLUID_WIDTH) self.resizeHandlerId1_to = setTimeout(function(){self.resizeHandler();}, 800);
		};
		
		self.onResizeHandler = function(e){
			if(self.isMobile_bl){
				clearTimeout(self.resizeHandlerId2_to);
				self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 200);
			}else{
				self.resizeHandler();
			}	
		};
		
		self.onScrollHandler = function(e){
			if(self.isFullScreen_bl 
				|| self.displayType == FWDGrid.FULL_SCREEN 
				|| self.displayType == FWDGrid.FLUID_WIDTH
			){
				self.scrollHandler();
			}
		};
		
		this.orientationChance = function(){
			if(self.displayType == FWDGrid.FLUID_WIDTH || self.displayType == FWDGrid.FULL_SCREEN){
				self.orintationChanceComplete_bl = false;
				
				clearTimeout(self.scrollEndId_to);
				clearTimeout(self.resizeHandlerId2_to);
				clearTimeout(self.orientationChangeId_to);
				
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChanceComplete_bl = true; 
					self.resizeHandler();
					}, 1000);
				
				self.main_do.setX(0);
				self.main_do.setWidth(0);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		self.scrollHandler = function(){
			if(!self.orintationChanceComplete_bl) return;
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
		
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDGrid.FULL_SCREEN){	
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(self.pageYOffset);
			}else if(self.displayType == FWDGrid.FLUID_WIDTH){	
				if(self.isMobile_bl){
					clearTimeout(self.scrollEndId_to);
					self.scrollEndId_to = setTimeout(self.resizeHandler, 200);		
				}else{
					self.main_do.setX(self.pageXOffset);
				}
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}
		};
		
		self.resizeHandler = function(overwrite){
			if(!self.orintationChanceComplete_bl) return;
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
			var viewportSize = FWDUtils.getViewportSize();
			var isReallyFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
			var scale;
			
			/*
			if(self.viewportWidth == viewportSize.w && self.viewportHeight == viewportSize.h 
				&& self.pageXOffset == scrollOffsets.x && self.pageYOffset == scrollOffsets.y
				&& !overwrite) return;
			*/
			
			self.viewportWidth = parseInt(viewportSize.w);
			self.viewportHeight = parseInt(viewportSize.h);
			self.pageXOffset = parseInt(scrollOffsets.x);
			self.pageYOffset = parseInt(scrollOffsets.y);
			
			if(self.isFullScreen_bl || self.displayType == FWDGrid.FULL_SCREEN){	
				self.main_do.setX(scrollOffsets.x);
				self.main_do.setY(scrollOffsets.y);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}else if(self.displayType == FWDGrid.FLUID_WIDTH){	
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				if(self.autoScale_bl){
					scale = Math.min(self.stageWidth/self.originalWidth, 1);
					self.stageHeight = parseInt(scale * self.originalHeight);
					self.stageContainer.style.height = self.stageHeight + "px";
				}else{
					self.stageHeight = self.originalHeight;
				}
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}else{
				if(self.autoScale_bl){
					self.stageContainer.style.width = "100%";
					if(self.stageContainer.offsetWidth > self.originalWidth){
						self.stageContainer.style.width = self.originalWidth + "px";
					}
					
					scale = self.stageContainer.offsetWidth/self.originalWidth;		
					self.stageWidth = parseInt(scale * self.originalWidth);
					self.stageHeight = parseInt(scale * self.originalHeight);
					self.stageContainer.style.height = self.stageHeight + "px";
				}else{
					self.stageContainer.style.width = "100%";
					if(self.stageContainer.offsetWidth > self.originalWidth){
						self.stageContainer.style.width = self.originalWidth + "px";
					}
					self.stageWidth = self.stageContainer.offsetWidth;
					self.stageHeight = self.originalHeight;
					self.stageContainer.style.height = self.originalHeight + "px";
				}
				
				self.main_do.setX(0);
				self.main_do.setY(0);
			}
			
			self.main_do.setWidth(self.stageWidth);
			self.main_do.setHeight(self.stageHeight);
		
			if(self.preloader_do) self.positionPreloader();
			if(self.thumbsManager_do){
				self.thumbsManager_do.resizeHandler();
				if(!self.thumbsManager_do.allowToSwitchCat_bl){
					self.disable_sdo.setWidth(self.stageWidth);
					self.disable_sdo.setHeight(self.stageHeight);
				}
			}
			if(self.comboBox_do) self.comboBox_do.position();
			if(self.fullScreenButton_do) self.fullScreenButton_do.position();
		};
		
		//##############################################//
		/* Setup disable container */
		//#############################################//
		this.setupDisableContainer = function(){
			self.disable_sdo = new FWDSimpleDisplayObject("div");
			if(FWDUtils.isIE){
				self.disable_sdo.setBkColor("#000000");
				self.disable_sdo.setAlpha(.00001);
			}
			self.main_do.addChild(self.disable_sdo);
		};
		
		this.disableAll = function(){
			self.disable_sdo.setWidth(self.stageWidth + 3000);
			self.disable_sdo.setHeight(self.stageHeight + 3000);
		};
		
		this.enableAll = function(){
			self.disable_sdo.setWidth(0);
			self.disable_sdo.setWidth(0);
		};

		// #############################################//
		/* setup context menu */
		// #############################################//
		this.setupContextMenu = function(){
			self.customContextMenu_do = new FWDContextMenu(self.main_do, self.data.showContextMenu_bl);
		};

		// #############################################//
		/* setup data */
		// #############################################//
		this.setupData = function(){
			FWDData.setPrototype();
			self.data = new FWDData(self.props_obj);
			self.data.addListener(FWDData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDData.LOAD_DONE, self.dataLoadComplete);
		};

		this.onPreloaderLoadDone = function(){
			self.setupPreloader();
			self.positionPreloader();
		};

		this.dataLoadError = function(e, text){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};

		this.dataLoadComplete = function(e){
			self.preloader_do.hide(true);
			self.setupThumbsManager();
			if(self.data.showComboBox_bl) self.setupComboBox();
			if(!(self.displayType == FWDGrid.FULL_SCREEN && !FWDUtils.hasFullScreen)) self.setupFullScreenButton();
			
			if(self.data.showFullScreenButton_bl) 
			self.setupLightBox();
			self.setupDisableContainer();
			if (!self.isMobile_bl) self.setupContextMenu();
			self.resizeHandler(true);
		};

		//#############################################//
		/* setup preloader */
		//#############################################//
		this.setupPreloader = function(){
			FWDPreloader.setPrototype();
			self.preloader_do = new FWDPreloader(self.data.mainPreloader_img, 30, 29, 31, 30);
			self.preloader_do.addListener(FWDPreloader.HIDE_COMPLETE, self.onPreloaderHideCompleteHandler);
			self.preloader_do.show(true);
			self.main_do.addChild(self.preloader_do);
		};
		
		this.positionPreloader = function(){
			if(self.preloader_do){
				self.preloader_do.setX(parseInt((self.stageWidth - self.preloader_do.getWidth())/2));
				self.preloader_do.setY(parseInt((self.stageHeight - self.preloader_do.getHeight())/2));
			}
		};
		
		this.onPreloaderHideCompleteHandler = function(){
			self.main_do.removeChild(self.preloader_do);
		};

		// ###########################################//
		/* setup thumbs manager */
		// ###########################################//
		this.setupThumbsManager = function(id){
			FWDThumbsManager.setPrototype();
			self.thumbsManager_do = new FWDThumbsManager(self.data, self);
			self.thumbsManager_do.addListener(FWDThumbsManager.LOAD_ERROR, self.onThumbsManagerLoadError);
			self.thumbsManager_do.addListener(FWDThumbsManager.CLICK, self.onThumbsManagerClick);
			self.thumbsManager_do.addListener(FWDThumbsManager.HIDE_THUMBS_COMPLETE, self.onThumbsManagerHideComplete);
			self.main_do.addChild(self.thumbsManager_do);
		};

		this.onThumbsManagerLoadError = function(e){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};
		
		this.onThumbsManagerClick = function(e){
			self.lighBoxDO.show(e.id);
		};
		
		this.onThumbsManagerHideComplete = function(){
			self.enableAll();
		};
	
		//#############################################//
		/* setup combobox */
		//############################################//
		this.setupComboBox = function(){
			FWDComboBox.setPrototype();
			self.comboBox_do = new FWDComboBox(self, {
					upArrowN_img:self.data.comboboxUpArrowN_img,
					upArrowS_img:self.data.comboboxUpArrowS_img,
					categories_ar:self.data.categories_ar,
					selectorLabel:self.data.selectLabel_str,
					position:self.data.position_str,
					startAtCategory:self.data.startAtCategory,
					comboBoxHorizontalMargins:self.data.comboBoxHorizontalMargins,
					comboBoxVerticalMargins:self.data.comboBoxVerticalMargins,
					comboBoxCornerRadius:self.data.comboBoxCornerRadius,
					selctorBackgroundNormalColor:self.data.selctorBackgroundNormalColor_str,
					selctorBackgroundSelectedColor:self.data.selctorBackgroundSelectedColor_str,
					selctorTextNormalColor:self.data.selctorTextNormalColor_str,
					selctorTextSelectedColor:self.data.selctorTextSelectedColor_str,
					buttonBackgroundNormalColor:self.data.buttonBackgroundNormalColor_str,
					buttonBackgroundSelectedColor:self.data.buttonBackgroundSelectedColor_str,
					buttonTextNormalColor:self.data.buttonTextNormalColor_str,
					buttonTextSelectedColor:self.data.buttonTextSelectedColor_str,
					shadowColor:self.data.comboBoxShadowColor_str
					});
			self.comboBox_do.addListener(FWDComboBox.BUTTON_PRESSED, self.onComboboxButtonPressedHandler);
			self.main_do.addChild(self.comboBox_do);
		};
		
		this.onComboboxButtonPressedHandler = function(e){
			if(self.thumbsManager_do.allowToSwitchCat_bl){
				self.disableAll();
				self.thumbsManager_do.showCurrentCat(e.id);
				self.lighBoxDO.updateData(self.data.lightBox_ar[e.id]);
			}
		};
		
		//#######################################//
		/* Disable or enable buttons */
		//#######################################//
		this.setButtonsStateBasedOnId = function(id){
			var button_do;
			self.curId = id;
			for(var i=0; i<self.totalButtons; i++){
				button_do = self.buttons_ar[i];
				if(i == self.curId){
					button_do.setSelectedState(true);
				}else{
					button_do.setNormalState(true);
				}
			}
		};
		
		//#############################################//
		/* setup lighbox */
		//#############################################//
		this.setupLightBox = function(){
			FWDLightBox.setPrototype();
			this.lighBoxDO = new FWDLightBox({
					//main data array
					data_ar:self.data.lightBox_ar[self.data.startAtCategory],
					//skin
					lightboxPreloader_img:this.data.lightboxPreloader_img,
					slideShowPreloader_img:this.data.slideShowPreloader_img,
					closeN_img:this.data.lightboxCloseButtonN_img,
					closeS_img:this.data.lightboxCloseButtonS_img,
					nextN_img:this.data.lightboxNextButtonN_img,
					nextS_img:this.data.lightboxNextButtonS_img,
					prevN_img:this.data.lightboxPrevButtonN_img,
					prevS_img:this.data.lightboxPrevButtonS_img,
					maximizeN_img:this.data.lightboxMaximizeN_img,
					maximizeS_img:this.data.lightboxMaximizeS_img,
					minimizeN_img:this.data.lightboxMinimizeN_img,
					minimizeS_img:this.data.lightboxMinimizeS_img,
					infoOpenN_img:this.data.lightboxInfoOpenN_img,
					infoOpenS_img:this.data.lightboxInfoOpenS_img,
					infoCloseN_img:this.data.lightboxInfoCloseN_img,
					infoCloseS_img:this.data.lightboxInfoCloseS_img,
					playN_img:this.data.lightboxPlayN_img,
					playS_img:this.data.lightboxPlayS_img,
					pauseN_img:this.data.lightboxPauseN_img,
					pauseS_img:this.data.lightboxPauseS_img,
					showContextMenu:this.data.showContextMenu_bl,
					//properties
					showContextMenu_bl:self.data.showContextMenu_bl,
					addKeyboardSupport_bl:self.data.addLightBoxKeyboardSupport_bl,
					showNextAndPrevButtons:self.data.showLighBoxNextAndPrevButtons_bl,
					showZoomButton:self.data.showLightBoxZoomButton_bl,
					showInfoButton:self.data.showLightBoxInfoButton_bl,
					showSlideshowButton:self.data.showLighBoxSlideShowButton_bl,
					slideShowAutoPlay:self.data.slideShowAutoPlay_bl,
					showInfoWindowByDefault:self.data.showInfoWindowByDefault_bl,
					lightBoxVideoAutoPlay:self.data.lightBoxVideoAutoPlay_bl,
					forceRoundBorderToIframe:self.data.forceRoundBorderToIframe_bl,
					infoWindowBackgroundColor:self.data.lightBoxInfoWindowBackgroundColor_str,
					infoWindowBackgroundOpacity:self.data.lightBoxInfoWindowBackgroundOpacity,
					backgroundColor_str:self.data.lightBoxBackgroundColor_str,
					backgroundOpacity:self.data.lightBoxMainBackgroundOpacity,
					itemBackgroundColor_str:self.data.lightBoxItemBackgroundColor_str,
					borderColor_str:self.data.lightBoxItemBorderColor_str,
					borderSize:self.data.lightBoxBorderSize,
					borderRadius:self.data.lightBoxBorderRadius,
					slideShowDelay:self.data.lightBoxSlideShowDelay
					});
			
			this.lighBoxDO.addListener(FWDLightBox.MINIMIZE_START, this.lightBoxMinimizeStartHandler);
			this.lighBoxDO.addListener(FWDLightBox.MAXIMIZE_COMPLETE, this.lightBoxMaximizeCompleteHandler);
			//self.lighBoxDO.show(1);
		};
		
		this.lightBoxMinimizeStartHandler = function(){
			if(!self.isMobile_bl || FWDUtils.isAndroid){
				if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
					self.main_do.setVisible(true);
				}else{
					document.documentElement.getElementsByTagName("body")[0].style.visibility = "visible";
				}
			}
		};
		
		this.lightBoxMaximizeCompleteHandler = function(){
			if(!self.isMobile_bl || FWDUtils.isAndroid){
				if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
					self.main_do.setVisible(false);
				}else{
					document.documentElement.getElementsByTagName("body")[0].style.visibility = "hidden";
				}
			}
		};
		
		//##########################################//
		/* setup fullscreen button */
		//##########################################//
		this.setupFullScreenButton = function(){
			FWDFullScreenButton.setPrototype();
			self.fullScreenButton_do = new FWDFullScreenButton(
					self,
					self.data.fullScreenNN_img, 
					self.data.fullScreenNS_img, 
					self.data.fullScreenFN_img, 
					self.data.fullScreenFS_img,
					self.displayType,
					self.data.fullScreenPosition_str,
					self.data.fullScreenHorizontalMargins,
					self.data.fullScreenVerticalMargins
					);
			self.main_do.addChild(self.fullScreenButton_do);
			self.fullScreenButton_do.addListener(FWDFullScreenButton.GO_FULL_SCREEN, self.goFullScreenListener);
			self.fullScreenButton_do.addListener(FWDFullScreenButton.GO_NORMAL_SCREEN, self.goNormalScreenListener);
			
			//self.positionFullScreenButton();
			self.fullScreenButton_do.show(true);
			if(document.addEventListener){
				document.addEventListener("fullscreenchange", self.onFullScreenChange);
				document.addEventListener("mozfullscreenchange", self.onFullScreenChange);
				document.addEventListener("webkitfullscreenchange", self.onFullScreenChange);
			}
		};
		
		this.goFullScreenListener = function(){
			self.goFullScreen();
		};
		
		this.goNormalScreenListener = function(){
			self.goNormalScreen();
		};
		
		this.onFullScreenChange = function(e){
			if(document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msieFullScreen){
				self.fullScreenButton_do.isFullScreen_bl = true;
				self.isFullScreen_bl = true;
			}else{
				self.fullScreenButton_do.isFullScreen_bl = false;
				self.goNormalScreen();
			}
			
			self.fullScreenButton_do.setButtonsState();
		};
		
		//#############################################//
		/* go fullscreen / normal screen */
		//#############################################//
		this.goFullScreen = function(){
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
			
			self.lastScrollX = scrollOffsets.x;
			self.lastScrollY = scrollOffsets.y;
			
			if (document.documentElement.requestFullScreen) {  
				document.documentElement.requestFullScreen();  
			}else if(document.documentElement.mozRequestFullScreen) {  
				document.documentElement.mozRequestFullScreen();  
			}else if(document.documentElement.webkitRequestFullScreen) {  
				document.documentElement.webkitRequestFullScreen();  
			}else if(document.documentElement.msieRequestFullScreen) {  
				document.documentElement.msieRequestFullScreen();  
			}
			
			self.main_do.getStyle().position = "absolute";
			self.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden";
			
			if(FWDUtils.isIE7){
				self.body.appendChild(self.main_do.screen);
			}else{
				//self.body.style.display = "none";
				document.documentElement.appendChild(self.main_do.screen);
			}
			
			if(self.isMobile_bl)  self.thumbsManager_do.disableMoveOnFullScreen();
			
			self.main_do.getStyle().zIndex = 100000001;
			
			self.isFullScreen_bl = true;
			self.resizeHandler();
			self.disableAll();
			clearTimeout(self.disableAllOnFullScreenChangeId_to);
			self.disableAllOnFullScreenChangeId_to = setTimeout(self.enableAll, 200);
		};
		
		this.goNormalScreen = function(){		
			if(!self.isFullScreen_bl) return;
			
			if (document.cancelFullScreen) {  
				document.cancelFullScreen();  
			}else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			}else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}else if (document.msieCancelFullScreen) {  
				document.msieCancelFullScreen();  
			}
			
			self.fullScreenButton_do.isFullScreen_bl = false;
			self.fullScreenButton_do.setButtonsState();
			self.isFullScreen_bl = false;
			if(self.isMobile_bl)  self.thumbsManager_do.removeDisableMoveOnFullScreen();
			self.addMainDoToTheOriginalParent();
			self.resizeHandler();
			self.disableAll();
			clearTimeout(self.disableAllOnFullScreenChangeId_to);
			self.disableAllOnFullScreenChangeId_to = setTimeout(self.enableAll, 200);
		};
		
		this.addMainDoToTheOriginalParent = function(){
			
			if(FWDUtils.isIE7 && self.displayType == FWDGrid.FULL_SCREEN){
				document.documentElement.style.overflow = "auto";
				self.body.style.overflow = "auto";
			}else if(self.displayType != FWDGrid.FULL_SCREEN){
				if(FWDUtils.isIE7){
					document.documentElement.style.overflow = "auto";
					self.body.style.overflow = "visible";
				}else{
					document.documentElement.style.overflow = "visible";
					self.body.style.overflow = "visible";
					//self.body.style.display = "inline";
				}
			}
			
			if(this.displayType == FWDGrid.FULL_SCREEN){
				if(FWDUtils.isIE7){
					self.body.appendChild(self.main_do.screen);
				}else{
					document.documentElement.appendChild(this.main_do.screen);
				}
			}else if(self.displayType == FWDGrid.FLUID_WIDTH){
				if(FWDUtils.isIE7){
					self.body.appendChild(self.main_do.screen);
				}else{
					document.documentElement.appendChild(self.main_do.screen);
				}
				self.resizeHandler(true);		
			}else{
				self.main_do.getStyle().position = "relative";
				self.stageContainer.appendChild(this.main_do.screen);
			}
			
			self.main_do.getStyle().zIndex = 0;
			self.resizeHandler(true);
			window.scrollTo(self.lastScrollX, self.lastScrollY);
		};
		
		//##############################################//
		/* destroy */
		//##############################################//
		this.destroy = function(){
			
			if(window.removeEventListener){
				document.removeEventListener("fullscreenchange", self.onFullScreenChange);
				document.removeEventListener("mozfullscreenchange", self.onFullScreenChange);
				document.removeEventListener("webkitfullscreenchange", self.onFullScreenChange);
				window.removeEventListener("resize", self.onResizeHandler);
				window.removeEventListener("scroll", self.onScrollHandler);
				window.removeEventListener("orientationchange", self.orientationChance);
			}else if(window.detachEvent){
				window.detachEvent("onresize", self.onResizeHandler);
				window.detachEvent("onscroll", self.onScrollHandler);
			}
			
			clearTimeout(self.resizeHandlerId1_to);
			clearTimeout(self.resizeHandlerId2_to);
			clearTimeout(self.disableAllOnFullScreenChangeId_to);

			if(self.data) self.data.destroy();
			if(self.customContextMenu_do) self.customContextMenu_do.destroy();
			if(self.info_do) self.info_do.destroy();
			if(self.preloader_do) self.preloader_do.destroy();
			if(self.fullScreenButton_do) self.fullScreenButton_do.destroy();
			if(self.comboBox_do) self.comboBox_do.destroy();
			if(self.thumbsManager_do) self.thumbsManager_do.destroy();
			if(self.lighBoxDO) self.lighBoxDO.destroy();
			
			
			if(self.displayType == FWDGrid.FULL_SCREEN || self.displayType == FWDGrid.FLUID_WIDTH){	
				if(FWDUtils.isIE7){
					self.body.removeChild(self.main_do.screen);
				}else{
					document.documentElement.removeChild(self.main_do.screen);
				}
			}else{
				self.stageContainer.removeChild(self.main_do.screen);
			}	
			
			if(self.main_do){
				self.main_do.screen.innerHTML = "";
				self.main_do.destroy();
			}
			
			self.main_do = null;
			self.comboBox_do = null;
			self.fullScreenButton_do = null;
			self.preloader_do = null;
			self.customContextMenu_do = null;
			self.info_do = null;
			self.thumbsManager_do = null;
			self.disable_sdo = null;
			self.stageContainer = null;
			self = null;
		};

		this.init();
	};
	
	FWDGrid.RESIZE = "resize";
	FWDGrid.FULL_SCREEN = "fullscreen";
	FWDGrid.LIGHTBOX = "lightbox";
	FWDGrid.RESPONSIVE = "responsive";
	FWDGrid.FLUID_WIDTH = "fluidwidth";

	window.FWDGrid = FWDGrid;

}(window));