/* thumbs manager */
(function(window){
	
	var FWDThumbsManager = function(data, parent){
		
		var self = this;
		var prototype = FWDThumbsManager.prototype;
		
		this.curPlayListData_ar = null;
		this.thumbs_ar = null;
		this.rowsHeights_ar = null;
	
		this.scrollBarTrackN_img = data.scrollBarTrackN_img;
		this.scrollBarHandlerCenterBkN_img = data.scrollBarHandlerCenterBkN_img;
		this.scrollBarHandlerCenterBkS_img = data.scrollBarHandlerCenterBkS_img;
		this.scrollBarHandlerLeftN_img = data.scrollBarHandlerLeftN_img;
		this.scrollBarHandlerLeftS_img = data.scrollBarHandlerLeftS_img;
		this.scrollBarHandlerRightN_img = data.scrollBarHandlerRightN_img;
		this.scrollBarHandlerRightS_img = data.scrollBarHandlerRightS_img;
		this.scrollBarHandlerCenterIconN_img = data.scrollBarHandlerCenterIconN_img;
		this.scrollBarHandlerCenterIconS_img = data.scrollBarHandlerCenterIconS_img;
		
		this.thumbsHolder_do = null;
		this.dumy_sdo = null;
		this.mainScrollBar_do = null;
		this.scrollBar_do = null;
		this.scrollTrack_sdo = null;
		this.scrollBarHandler_do = null;
		this.scrollBarHandlerN_do = null;
		this.scrollBarHandlerS_do = null;
		this.scrollBarDisabled_sdo = null;
		this.scrollBarDumy_sdo = null;
		this.handlerCenterBkN_sdo = null;
		this.handlerCenterBkS_sdo = null;
		this.handlerLeftN_sdo = null;
		this.handlerLeftS_sdo = null;
		this.handlerCenterIconN_sdo = null;
		this.handlerCenterIconS_sdo = null;
		this.handlerRightN_sdo = null;
		this.handlerRightS_sdo = null;
		this.nextThumbSetBtn_do = null;
		this.nextThumbSetBtnNormal_do = null;
		this.nextThumbSetBtnSelected_do = null;
		
		this.handGrabPath_str =  data.handGrabPath_str;
		this.handMovePath_str =  data.handMovePath_str;
		this.scrollBarType_str = data.scrollBarType_str;
		this.scrollBarPosition_str = data.scrollBarPosition_str;
		this.disabledScrollbarColor_str = data.scrollbarDisabledColor_str;
		
		this.totalThumbnails = 0;
		this.totalRows;
		this.totalHeight;
		this.totalWidth = 0;
		this.maxW = 0;
		this.stageWidth = -1;
		this.stageHeight = -1;
		this.viewportWidth = -1;
		this.viewportHeight = -1;
		this.thumbOffsetY = 0;
		this.thumbnailsFinalX = 0;
		this.thumbnailBaseWidth = data.thumbnailBaseWidth;
		this.thumbnailBaseHeight = data.thumbnailBaseHeight;
		this.nextSetButtonWidth = data.showMoreThumbsButtonN_img.width;
		this.horizontalMargins = 0;
		this.vx = 0;
		this.vx2 = 0;
		this.friction = .9;
		this.leftHeight;
		this.thumbWidth;
		this.thumbHeight;
		this.thumbsHSpace = data.horizontalSpaceBetweenThumbnails;
		this.thumbsVSpace = data.verticalSpaceBetweenThumbnails;
		this.countLoadedThumbs = 0;
		this.borderSize = data.thumbnailBorderSize;
		this.loadMoreThumbsButtonOffest = data.loadMoreThumbsButtonOffest;
		this.numberOfThumbsToShowPerSet = data.numberOfThumbsToShowPerSet;
		this.xPositionOnPress = 0;
		this.lastPressedX = 0;
		this.lastPressedY = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.scrollBarHandlerWidth = 0;
		this.scrollBarOffset = data.scrollBarOffset;
		this.scrollBarHeight = self.scrollBarHandlerLeftN_img.height;
		this.thumbsHolderCurX = 0;
		this.scrollBarHandlerX = 0;
		this.scrollBarHandlerWidth = 0;
		this.playListId = data.startAtCategory;
		
		this.startToLoadThumbsId_to;
		this.loadWithDelayId_to;
		this.resizeAndPositionThumbsId_to;
		this.disableThumbClickDelayId_to;
		this.stopToScrollTimeOutId_to;
		this.allThumbsAreTweenedId_to;
		this.ieOldMoveTestId_int;
		this.updateMobileScrollBarId_af;
		
		this.disableButtons = false;
		this.nextButtonSetVisible = false;
		this.addMargins_bl = data.addMargins_bl;
		this.disableThumbClick_bl = false;
		this.setOnceDumySizeOnMove_bl = true;
		this.isDragging_bl = false;
		this.isScrolling_bl = false;
		this.ieOldMoveTest_bl = false;
		this.isScrollBarActive_bl = false;
		this.isMobileScrollBarRunning_bl = false;
		this.isInitialized_bl = false;
		this.allowToSwitchCat_bl = true;
		this.addMouseWheelSupport_bl = data.addMouseWheelSupport_bl;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
		
		//###############################################//
		/* init */
		//###############################################//
		this.init = function(){
			
			self.setResizableSizeAfterParent();
			
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_DRAG ){
				self.setupDragScrollbar();
				if(self.addMouseWheelSupport_bl) self.addDragMouseWheelSupport();
			}else if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				self.setupScrollBar();
				if(self.addMouseWheelSupport_bl) self.addScrollBarMouseWheelSupport();
			}
			
			self.thumbsHolder_do = new FWDDisplayObject("div", "absolute", "visible");
			if(self.scrollBarPosition_str == "top" && self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				self.thumbsHolder_do.setY(self.scrollBarHeight + self.scrollBarOffset);
			}
			self.addChild(self.thumbsHolder_do);
			
			if((!self.isMobile_bl && self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_DRAG)
				|| (self.hasPointerEvent_bl && self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_DRAG)){
				self.screen.style.cursor = 'url(' + self.handGrabPath_str + '), default';
				self.dumy_sdo = new FWDSimpleDisplayObject("div");
				if(FWDUtils.isIE){
					self.dumy_sdo.setBkColor("#FF0000");
					self.dumy_sdo.setAlpha(.001);
				}
				self.dumy_sdo.screen.style.cursor = 'url(' + self.handMovePath_str + '), default';
				self.addChild(self.dumy_sdo);
			}
			
			if(self.addMargins_bl){
				self.horizontalMargins = self.thumbsHSpace;
			}else{
				self.horizontalMargins = 0;
			}
	
			if (self.numberOfThumbsToShowPerSet) self.setupNextSetButton();	
			
			self.hideScrollBar(false);
			self.showCurrentCat(-1);
		};
		
		//###############################################//
		/* resize handler */
		//###############################################//
		this.resizeHandler = function(){
			if (self.viewportWidth == parent.stageWidth && self.viewportHeight == parent.stageHeight) return;
			
			self.viewportWidth = parent.stageWidth;
			self.viewportHeight = parent.stageHeight;
			
			self.stageWidth = self.viewportWidth;
			
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				self.stageHeight = self.viewportHeight - self.scrollBarHeight - self.scrollBarOffset;	
				if(self.addMargins_bl) self.stageHeight -= (self.thumbsVSpace * 2);
				self.positionMainScrollBar();
			}else{
				self.stageHeight = self.viewportHeight;
				if(self.addMargins_bl) self.stageHeight -= (self.thumbsVSpace * 2);
				self.deactivateDragScrollBar();
			}
			
			if (self.countLoadedThumbs > 0){
				clearTimeout(self.resizeAndPositionThumbsId_to);
				self.resizeAndPositionThumbsId_to = setTimeout(function(){
					self.positionAndResizeStuff();
					self.centerThumbs(true);
					self.positionThumbsFinal();
					if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
						self.checkScrolBarHandlerSizeAndPosition();
						self.setScrollBarSize(false);
						self.updateScrollBar(false);
					}
					}, 200);	
			}
		};
		
		//##############################################//
		/* Switch cat */
		//##############################################//
		this.showCurrentCat = function(playListId){
			
			if(self.playListId != playListId && playListId >=0){
				self.allowToSwitchCat_bl = false;
				self.hideCurrentCat();
				self.playListId = playListId;
				return
			};
			
			self.curPlayListData_ar = data.playList_ar[self.playListId];
			self.thumbs_ar = [];
			self.totalThumbnails = self.curPlayListData_ar.length;
			self.countLoadedThumbs = 0;
			self.setupThumbs();
			
			self.startToLoadThumbsId_to = setTimeout(function(){
				if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
					if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
						self.checkScrolBarHandlerSizeAndPosition();
						self.setScrollBarSize(false);
					}
				}
				self.loadThumbImage();
				}, 100);
		};
		
		//################################################//
		/* hide current cat */
		//################################################//
		this.hideCurrentCat = function(){
			var thumb;
			var dl = .5;
			self.totalWidth = 1;
			
			clearTimeout(self.startToLoadThumbsId_to);
			clearTimeout(self.loadWithDelayId_to);
			clearTimeout(self.resizeAndPositionThumbsId_to);
			clearTimeout(self.disableThumbClickDelayId_to);
			clearTimeout(self.stopToScrollTimeOutId_to);
			clearTimeout(self.allThumbsAreTweenedId_to);
			clearInterval(self.updateMobileScrollBarId_int);
			
			if (self.image){
				self.image.onload = null;
				self.image.onerror = null;
			}
			
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				self.checkScrolBarHandlerSizeAndPosition();
				self.setScrollBarSize(false);
				self.updateScrollBar(false);
			}
			
			for (i=0; i<self.countLoadedThumbs; i++){
				thumb = self.thumbs_ar[i];
				if ((thumb.finalX + self.thumbnailsFinalX > -thumb.finalW) && (thumb.finalX + self.thumbnailsFinalX  < self.stageWidth)){
					thumb.hide(dl);
					dl += .02;
				}
			}
			
			self.hideNextSetButton();
			self.allThumbsAreTweenedId_to = setTimeout(self.allThumbsAreTweened, (1 + dl) * 1000);
		};
		
		this.destroyCurrentCat = function(){
			var thumb;
			for (var i=0; i<self.totalThumbnails; i++){
				thumb = self.thumbs_ar[i];
				self.thumbsHolder_do.removeChild(thumb);
				thumb.destroy();
			}
		};
		
		this.allThumbsAreTweened = function(){
			self.allowToSwitchCat_bl = true;
			self.isMobileScrollBarRunning_bl = false;
			self.destroyCurrentCat();
			self.showCurrentCat();
			self.dispatchEvent(FWDThumbsManager.HIDE_THUMBS_COMPLETE);
		};
		
		
		//###############################################//
		/* setup thumbs */
		//###############################################//
		this.setupThumbs = function(){
			var thumb;
			var hasButtonMode = self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR;
			var curDataItem;
			
			for (var i=0; i<self.totalThumbnails; i++){
				curDataItem = self.curPlayListData_ar[i];
				FWDThumb.setPrototype();
				thumb = new FWDThumb(i, 
						data, 
						self, 
						curDataItem.thumbIconPath, 
						curDataItem.thumbText,
						curDataItem.thumbnailBkColor,
						curDataItem.thumbnailOverlayColor,
						curDataItem.borderNormalColor,
						curDataItem.borderSelectedColor,
						hasButtonMode);
				thumb.addListener(FWDThumb.CLICK, self.onThumbClick);
				
				self.thumbs_ar.push(thumb);
				self.thumbsHolder_do.addChild(thumb);
			}
		};
		
		this.onThumbClick = function(e){
			if(self.disableThumbClick_bl) return;
			self.deactivateDragScrollBar();
			self.getCorrectId(e.id);
		};
		
		//###############################################//
		/* get the correct id */
		//###############################################//
		this.getCorrectId = function(pId){
			
			var regularId = pId;
			var tempId = pId;
			
			var type = self.curPlayListData_ar[regularId].mediaType;
			
			if(type == "link"){
				for(var i=0; i<self.totalThumbnails; i++){
					if(i < pId  && self.curPlayListData_ar[i].mediaType == "media"){
						regularId -= 1;
					}
				};
			}else if(type == "media" || type == "iframe"){
				for(var i=0; i<self.totalThumbnails; i++){
					if(i < pId  && self.curPlayListData_ar[i].mediaType == "link"){
						regularId -= 1;
					}
				};
			}
			
			if(type == "link"){
				window.open(self.curPlayListData_ar[pId].secondObj.url, self.curPlayListData_ar[pId].secondObj.target);
			}else{
				self.dispatchEvent(FWDThumbsManager.CLICK, {id:regularId});
			}
		};
		
		//###############################################//
		/* load thumbnails */
		//###############################################//
		this.loadThumbImage = function(){
			var imagePath = self.curPlayListData_ar[self.countLoadedThumbs].thumbPath;

			self.image = new Image();
			self.image.onerror = self.onImageLoadErrorHandler;
			self.image.onload = self.onImageLoadHandler;
			self.image.src = imagePath;
		};

		this.onImageLoadErrorHandler = function(e){
			if (!self || !data || !self.curPlayListData_ar[self.countLoadedThumbs]) return;
				
			var message = "Thumb can't be loaded, probably the path is incorrect <font color='#FFFFFF'>"
					+ self.curPlayListData_ar[self.countLoadedThumbs].thumbPath + "</font>";

			self.dispatchEvent(FWDThumbsManager.LOAD_ERROR, {text : message});
		};

		this.onImageLoadHandler = function(e){
			
			var thumb = self.thumbs_ar[self.countLoadedThumbs];

			thumb.originalWidth = self.image.width;
			thumb.originalHeight = self.image.height;
			
			thumb.finalW = self.image.width + self.borderSize * 2;
			thumb.finalH = self.image.height + self.borderSize * 2;

			thumb.addImage(self.image, self.curPlayListData_ar[self.countLoadedThumbs].thumbPath);
			
			if(self.countLoadedThumbs == 0){
				self.thumbnailsFinalX = Math.round((self.stageWidth - self.thumbnailBaseWidth)/2);
				self.thumbsHolder_do.setX(self.thumbnailsFinalX);
				self.showScrollBar(true);
			}

			self.countLoadedThumbs++;
			
			if (self.countLoadedThumbs < self.totalThumbnails){
				if (self.numberOfThumbsToShowPerSet && (self.countLoadedThumbs % self.numberOfThumbsToShowPerSet == 0)){
					self.showNextSetButton();
				}else{
					self.loadWithDelayId_to = setTimeout(self.loadThumbImage, 100);
				}
			}else{
				if (self.nextButtonSetVisible){
					self.nextButtonSetVisible = false;
					self.hideNextSetButton();	
				}
			}
			
			self.positionAndResizeStuff();
			
			self.centerThumbs(true);
			self.positionThumbsFinal();
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				self.checkScrolBarHandlerSizeAndPosition();
				if (self.countLoadedThumbs == 1){
					self.setScrollBarSize(false);
				}else{
					self.setScrollBarSize(true);
				}
				
				self.updateScrollBar(true);
			}
		};
	
		//###############################################//
		/* set data for position thumbs 1*/
		//###############################################//
		this.positionAndResizeThumbs1 = function(){
			
			var i, j, k;
			var minH;
			var minHVal;
			var hSize;
			var hSize;
			var found;
			var fPlace;
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var addToThumbHeight_bl;
			
			for (i=0; i<self.countLoadedThumbs; i++){
				
				addToThumbHeight_bl = false;
				
				thumb = self.thumbs_ar[i];
				
				if (thumb.used) continue;
				
				if  (thumb.originalHeight == self.thumbnailBaseHeight) {
					
					minHVal = 1000;
					
					wSize = Math.floor(thumb.originalWidth / self.thumbnailBaseWidth);
					hSize = Math.floor(thumb.originalHeight / self.thumbnailBaseHeight);
					
					for (j=0; j<self.totalRows; j++){
						if (self.rowsHeights_ar[j] < minHVal){
							minHVal = self.rowsHeights_ar[j];
						}
					}
					
					for (j=0; j<self.totalRows; j++){
						if (self.rowsHeights_ar[j] == minHVal){
							minH = j;
							if(j == self.totalRows - 1) addToThumbHeight_bl = true;
							break;
						}
					}
					
					thumb.used = true;
					
					tempFinalY = minH * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbOffsetY;
					tempFinalX = self.rowsHeights_ar[minH] * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) + self.horizontalMargins;
					
					tempFinalW = (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) * wSize - self.thumbsHSpace;
					
					if(addToThumbHeight_bl){
						tempFinalH = self.thumbHeight + self.borderSize * 2 +  self.leftHeight;
					}else{
						tempFinalH = self.thumbHeight + self.borderSize * 2;
					}
					
					
					thumb.tempFinalX = thumb.finalX;
					thumb.tempFinalY = thumb.finalY;
					
					thumb.finalX = tempFinalX;
					thumb.finalY = tempFinalY;
						
					thumb.finalW = tempFinalW;
					thumb.finalH = tempFinalH;
					
					self.rowsHeights_ar[minH] += wSize;
				}else{
				
					minHVal = 1000;
					
					found = false;
					
					wSize = Math.floor(thumb.originalWidth / self.thumbnailBaseWidth);
					hSize = Math.floor(thumb.originalHeight / self.thumbnailBaseHeight);
					
					for (j=0; j<self.totalRows - (hSize-1); j++){
						
						fPlace = true;
						
						for (k=0; k<hSize; k++){
							if (self.rowsHeights_ar[j] != self.rowsHeights_ar[j+k])
								fPlace = false;
						}
						
						if (fPlace && (self.rowsHeights_ar[j] < minHVal)){
							minHVal = self.rowsHeights_ar[j];
							minH = j;
							if(j == self.totalRows - hSize) addToThumbHeight_bl = true;
							found = true;
						}
					}
					
					if (found){
						
						hSize = Math.floor(thumb.originalHeight / self.thumbnailBaseHeight);
						
						thumb.used = true;
					
						tempFinalY = minH * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbOffsetY;
						tempFinalX = self.rowsHeights_ar[minH] * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) + self.horizontalMargins;
						
						tempFinalW = (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) * wSize - self.thumbsHSpace;
						
						if(addToThumbHeight_bl){
							tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace + self.leftHeight;
						}else{
							tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
						}
						
						thumb.tempFinalX = thumb.finalX;
						thumb.tempFinalY = thumb.finalY;
						
						thumb.finalX = tempFinalX;
						thumb.finalY = tempFinalY;
							
						thumb.finalW = tempFinalW;
						thumb.finalH = tempFinalH;
							
						for (k=0; k<hSize; k++){
							self.rowsHeights_ar[minH + k] += wSize;
						}
					}
				}
			}
		};
		
		//###############################################//
		/* set data for position thumbs 2 */
		//###############################################//
		this.positionAndResizeThumbs2 = function(){
		
			var i, j, k;
			var minH;
			var minHVal;
			var found;
			var fPlace;
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var wSize;
			var hSize;
			var addToThumbHeight_bl;
			
			self.maxW = 0;
			
			for (i=0; i<self.totalRows; i++){
				if (self.rowsHeights_ar[i] > self.maxW)
					self.maxW = self.rowsHeights_ar[i];
			}
			
			for (i=0; i<self.countLoadedThumbs; i++){
				
				addToThumbHeight_bl = false;
				
				thumb = self.thumbs_ar[i];
				
				if (thumb.used)
					continue;
				
				wSize = Math.floor(thumb.originalWidth / self.thumbnailBaseWidth);	
				hSize = Math.floor(thumb.originalHeight / self.thumbnailBaseHeight);
				
				if(self.totalRows == hSize) addToThumbHeight_bl = true;
					
				thumb.used = true;
					
				tempFinalX = self.maxW * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) + self.horizontalMargins;
				tempFinalY = self.thumbOffsetY;
				
				
				tempFinalW = (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) * wSize - self.thumbsHSpace;
				
				if(addToThumbHeight_bl){
					tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace + self.leftHeight;
				}else{
					tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
				}
				
				thumb.tempFinalX = thumb.finalX;
				thumb.tempFinalY = thumb.finalY;
				
				thumb.finalX = tempFinalX;
				thumb.finalY = tempFinalY;
					
				thumb.finalW = tempFinalW;
				thumb.finalH = tempFinalH;
					
				self.maxW += wSize;
				
				for (k=0; k<hSize; k++){
					self.rowsHeights_ar[k] = self.hSize;
				}
			}
		};
		
		//###############################################//
		/* Position thumbs final */
		//###############################################//
		this.positionThumbsFinal = function(){
			if(!self.allowToSwitchCat_bl) return;
			var thumb;
			for (i=0; i<self.countLoadedThumbs; i++){
				thumb = self.thumbs_ar[i];
				if ((thumb.finalX != thumb.tempFinalX) || (thumb.finalY != thumb.finalY) || (thumb.finalW != thumb.w) || (thumb.finalH != thumb.h)){
					thumb.resizeThumb();
				}
			}
		};
		
		//###############################################//
		/* position and resize thumbs */
		//###############################################//
		this.positionAndResizeStuff = function(){	
			if(!self.allowToSwitchCat_bl) return;
			self.totalRows = Math.ceil((self.stageHeight - self.thumbsVSpace) / (self.thumbnailBaseHeight + self.thumbsVSpace + self.borderSize * 2));
			
			if (self.totalRows < 2)
				self.totalRows = 2;
			
			if(self.addMargins_bl){
				self.thumbHeight = Math.floor((self.stageHeight - self.totalRows * (self.thumbsVSpace + self.borderSize * 2) + self.thumbsVSpace) / self.totalRows);
			}else{
				self.thumbHeight = Math.floor((self.stageHeight - self.totalRows * (self.thumbsVSpace + self.borderSize * 2) + self.thumbsVSpace) / self.totalRows);
			}
		
			self.thumbWidth = Math.floor(self.thumbHeight * (self.thumbnailBaseWidth/self.thumbnailBaseHeight));
			
			self.totalHeight = self.totalRows * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) - self.thumbsVSpace;
			self.leftHeight = self.stageHeight - self.totalHeight;
		
			if(self.addMargins_bl){
				self.thumbOffsetY = self.thumbsVSpace;
			}else{
				self.thumbOffsetY = 0;
			}
			
			self.rowsHeights_ar = [];
			
			for (i=0; i<self.totalRows; i++){
				self.rowsHeights_ar[i] = 0;
			}
			
			for (i=0; i<self.countLoadedThumbs; i++){
				thumb = self.thumbs_ar[i];
				thumb.used = false;
			}

			// first positioning iteration
			self.positionAndResizeThumbs1();
			
			// second positioning iteration - for any remaining thumbs that didn't fit the first time
			self.positionAndResizeThumbs1();
			
			// last positioning iteration - for the last remaining high-width thumbs
			self.positionAndResizeThumbs2();
			
			if(self.addMargins_bl){
				self.totalWidth = self.maxW * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) + self.thumbsHSpace;
			}else{
				self.totalWidth = self.maxW * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) - self.thumbsHSpace;
			}
			
			if (self.nextButtonSetVisible && self.addMargins_bl){
				self.showNextSetButton();
				self.totalWidth += self.nextSetButtonWidth + 12;
			}else if (self.nextButtonSetVisible && !self.addMargins_bl){
				self.showNextSetButton();
				self.totalWidth += self.nextSetButtonWidth + 12 + self.thumbsHSpace;
			}else if(!self.addMargins_bl){
				self.totalWidth = self.maxW * (self.thumbWidth + self.thumbsHSpace + self.borderSize * 2) - self.thumbsHSpace;
			}
			
			self.positionNextSetButton();
		};

		
		//###############################################//
		/* setup show more thumbnails button */
		//###############################################//
		this.setupNextSetButton = function(){
			
			self.nextThumbSetBtn_do = new FWDDisplayObject("div");
			
			self.nextThumbSetBtnNormal_do = new FWDDisplayObject("img");
			self.nextThumbSetBtnNormal_do.setScreen(data.showMoreThumbsButtonN_img);
			
			self.nextThumbSetBtnSelected_do = new FWDDisplayObject("img");
			self.nextThumbSetBtnSelected_do.setScreen(data.showMoreThumbsButtonS_img);
			
			self.nextThumbSetBtnSelected_do.setAlpha(0);
			
			self.nextThumbSetBtn_do.setWidth(self.nextThumbSetBtnNormal_do.getWidth());
			self.nextThumbSetBtn_do.setHeight(self.nextThumbSetBtnNormal_do.getHeight());
			
			if(!FWDUtils.isIEAndLessThen9) self.nextThumbSetBtn_do.setAlpha(0);
			
			self.nextThumbSetBtn_do.setButtonMode(true);
			self.nextThumbSetBtn_do.setVisible(false);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.nextThumbSetBtn_do.screen.addEventListener("MSPointerOver", self.onNextBtnOverHandler);
					self.nextThumbSetBtn_do.screen.addEventListener("MSPointerOut", self.onNextBtnOutHandler);
					self.nextThumbSetBtn_do.screen.addEventListener("MSPointerUp", self.onNextBtnClickHandler);
				}
				self.nextThumbSetBtn_do.screen.addEventListener("touchend", self.onNextBtnClickHandler);
			}else if(self.nextThumbSetBtn_do.screen.addEventListener){
				self.nextThumbSetBtn_do.screen.addEventListener("mouseover", self.onNextBtnOverHandler);
				self.nextThumbSetBtn_do.screen.addEventListener("mouseout", self.onNextBtnOutHandler);
				self.nextThumbSetBtn_do.screen.addEventListener("click", self.onNextBtnClickHandler);
			}else if(self.nextThumbSetBtn_do.screen.attachEvent){
				self.nextThumbSetBtn_do.screen.attachEvent("onmouseover", self.onNextBtnOverHandler);
				self.nextThumbSetBtn_do.screen.attachEvent("onmouseout", self.onNextBtnOutHandler);
				self.nextThumbSetBtn_do.screen.attachEvent("onclick", self.onNextBtnClickHandler);
			}
			self.thumbsHolder_do.addChild(self.nextThumbSetBtn_do);
			self.nextThumbSetBtn_do.addChild(self.nextThumbSetBtnNormal_do);
			self.nextThumbSetBtn_do.addChild(self.nextThumbSetBtnSelected_do);
		};
		
		this.onNextBtnOverHandler = function(){
			TweenMax.to(self.nextThumbSetBtnSelected_do, .8, {alpha:1});
			TweenMax.to(self.nextThumbSetBtnNormal_do, .8, {alpha:0});
		};
		
		this.onNextBtnOutHandler = function(){
			TweenMax.to(self.nextThumbSetBtnSelected_do, .8, {alpha:0});
			TweenMax.to(self.nextThumbSetBtnNormal_do, .8, {alpha:1});
		};
		
		this.onNextBtnClickHandler = function(){
			if(!self.nextButtonSetVisible) return;
			self.deactivateDragScrollBar();
			self.hideNextSetButton();
			self.loadWithDelayId_to = setTimeout(self.loadThumbImage, 100);
		};
		
		this.showNextSetButton = function(){
			
			if(self.nextButtonSetVisible) return;
			
			self.nextButtonSetVisible = true;
			
			if(FWDUtils.isIEAndLessThen9){
				self.nextThumbSetBtnNormal_do.setY(0);
				self.nextThumbSetBtnSelected_do.setY(0);
			}else{
				TweenMax.killTweensOf(self.nextThumbSetBtn_do);
				TweenMax.to(self.nextThumbSetBtn_do, .4, {alpha:1});
			}
		
			self.onNextBtnOutHandler();
			self.thumbsHolder_do.addChild(self.nextThumbSetBtn_do);
			self.nextThumbSetBtn_do.setVisible(true);
			
		};
		
		this.positionNextSetButton = function(){
			self.nextThumbSetBtn_do.setX(Math.floor(self.totalWidth - self.nextThumbSetBtn_do.getWidth() - 6 - self.thumbsHSpace/2));
			self.nextThumbSetBtn_do.setY(Math.floor((self.stageHeight - self.nextThumbSetBtn_do.getHeight())/2));
		};
		
		this.hideNextSetButton = function(){
			if(!self.nextButtonSetVisible) return;
			
			if(FWDUtils.isIEAndLessThen9){
				self.nextThumbSetBtnNormal_do.setY(-500);
				self.nextThumbSetBtnSelected_do.setY(-500);
			}else{
				TweenMax.killTweensOf(self.nextThumbSetBtn_do);
				TweenMax.to(self.nextThumbSetBtn_do, .4, {alpha:0});
			}
		
			self.nextButtonSetVisible = false;
		};
		
		this.hideNextSetButtonComplete = function(){
			self.nextThumbSetBtn_do.setY(-500);
		};
		
		//##########################################//
		/* setup mobile scrollbar */
		//##########################################//
		this.setupDragScrollbar = function(){	
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.mobileScrBarStartHandler);
				}else{
					self.screen.addEventListener("touchstart", self.mobileScrBarStartTest);
				}
			}else{
				if(self.screen.addEventListener){
					self.screen.addEventListener("mousedown", self.mobileScrBarStartHandler);
				}else if(self.screen.attachEvent){
					self.screen.attachEvent("onmousedown", self.mobileScrBarStartHandler);
				}
			}
		};
		
		this.disableMoveOnFullScreen = function(e){
			window.addEventListener("touchmove", self.onDisableMove);
		};
		
		this.removeDisableMoveOnFullScreen = function(e){
			window.removeEventListener("touchmove", self.onDisableMove);
		};
		
		this.onDisableMove = function(e){
			e.preventDefault();
		};
		
		this.mobileScrBarStartTest = function(e){
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);		
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;	
			window.addEventListener("touchmove", self.mobileScrBarMoveTest);
		};
		
		this.mobileScrBarMoveTest = function(e){
			if (e.touches.length != 1) return;
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			self.mouseX = viewportMouseCoordinates.screenX;;
			self.mouseY = viewportMouseCoordinates.screenY;
			
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180/Math.PI;
			self.disableThumbClick_bl = true;
			
			if ((posAngle > 120) || (posAngle < 60) || parent.isFullScreen_bl){
				e.preventDefault();
				self.mobileScrBarStartHandler(e);
				window.removeEventListener("touchmove", self.mobileScrBarMoveTest);
			}else{
				self.disableThumbClick_bl = true;
				window.addEventListener("touchend", self.mobileScrBarEndTest);
			}
		};
		
		this.mobileScrBarEndTest = function(e){
			window.removeEventListener("touchmove", self.mobileScrBarMoveTest);
			window.removeEventListener("touchend", self.mobileScrBarEndTest);
			self.disableThumbClick_bl = false;
		};
		
		this.mobileScrBarStartHandler = function(e){
			
			if(self.stageWidth > self.totalWidth) return;
			if(e.preventDefault) e.preventDefault();
			
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);		
			
			if(self.stageWidth < self.totalWidth){
				self.isDragging_bl = true;
				self.lastPressedX = viewportMouseCoordinates.screenX;	
				self.setOnceDumySizeOnMove_bl = true;
				self.vx = 0;
				self.thumbnailsFinalX = self.thumbsHolder_do.getX();
				clearTimeout(self.disableThumbClickDelayId_to);
				self.activateDragScrollBar();
			};
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("MSPointerUp", self.mobileScrBarEndHandler, false);
					window.addEventListener("MSPointerMove", self.mobileScrBarMoveHandler);
				}else{
					window.addEventListener("touchend", self.mobileScrBarEndHandler);
					window.addEventListener("touchmove", self.mobileScrBarMoveHandler);
				}
			}else{
				if(window.addEventListener){
					window.addEventListener("mouseup", self.mobileScrBarEndHandler);
					window.addEventListener("mousemove", self.mobileScrBarMoveHandler);
				}else if(document.attachEvent){
					document.attachEvent("onmouseup", self.mobileScrBarEndHandler);
					document.attachEvent("onmousemove", self.mobileScrBarMoveHandler);
				}
			}
		};
		
		this.mobileScrBarMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			if(self.stageWidth > self.totalWidth) return;
			
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
	
			if(viewportMouseCoordinates.screenX == self.lastPressedX) return;
			var toAdd = viewportMouseCoordinates.screenX - self.lastPressedX;
			
			self.disableThumbClick_bl = true;
			
			if((self.setOnceDumySizeOnMove_bl && !self.isMobile_bl)
				|| (self.setOnceDumySizeOnMove_bl && self.hasPointerEvent_bl)){
				self.dumy_sdo.setWidth(self.stageWidth);
				self.dumy_sdo.setHeight(self.stageHeight);
				self.setOnceDumySizeOnMove_bl = false;
			}
			
			self.thumbnailsFinalX += toAdd;
			self.thumbnailsFinalX = Math.round(self.thumbnailsFinalX);
			
			if(!self.ieOldMoveTest_bl && FWDUtils.isIE){
				clearInterval(self.ieOldMoveTestId_int);
				self.ieOldMoveTestId_int = setInterval(self.updateThumbnailsPosition, 16);
				self.ieOldMoveTest_bl = true;
			}else if(!FWDUtils.isIE){
				self.thumbsHolder_do.setX(self.thumbnailsFinalX);
			}
			
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.vx = toAdd  * 2;
		};
		
		this.updateThumbnailsPosition = function(){
			self.thumbsHolder_do.setX(self.thumbnailsFinalX);
		};
		
		this.mobileScrBarEndHandler = function(e){
			clearInterval(self.ieOldMoveTestId_int);
			self.ieOldMoveTest_bl = false;
			self.isDragging_bl = false;
			self.disableThumbClickDelayId_to = setTimeout(function(){self.disableThumbClick_bl = false;}, 100);
			
			if(!self.isMobile_bl || self.hasPointerEvent_bl){
				self.dumy_sdo.setWidth(0);
				self.dumy_sdo.setHeight(0);
			}
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("MSPointerUp", self.mobileScrBarEndHandler);
					window.removeEventListener("MSPointerMove", self.mobileScrBarMoveHandler);
				}else{
					window.removeEventListener("touchend", self.mobileScrBarEndHandler);
					window.removeEventListener("touchmove", self.mobileScrBarMoveHandler);
				}
			}else{
				
				if(window.removeEventListener){
					window.removeEventListener("mouseup", self.mobileScrBarEndHandler);
					window.removeEventListener("mousemove", self.mobileScrBarMoveHandler);
				}else if(document.detachEvent){
					document.detachEvent("onmouseup", self.mobileScrBarEndHandler);
					document.detachEvent("onmousemove", self.mobileScrBarMoveHandler);
				}
			}
		};
			
		this.updateMobileScrollBar = function(){
			//self.updateMobileScrollBarId_int = requestAnimationFrame(self.updateMobileScrollBar);
			if(!self.isDragging_bl){
				if(self.stageWidth <= self.totalWidth){
					self.vx *= self.friction;
					self.thumbnailsFinalX += self.vx;	
					
					if(self.thumbnailsFinalX > 0){
						self.vx2 = (0 - self.thumbnailsFinalX) * .3;
						self.vx *= self.friction;
						self.thumbnailsFinalX += self.vx2;
					}else if(self.thumbnailsFinalX < self.stageWidth - self.totalWidth){
						self.vx2 = (self.stageWidth - self.totalWidth - self.thumbnailsFinalX) * .3;
						self.vx *= self.friction;
						self.thumbnailsFinalX += self.vx2;
					}
				}
				if(Math.abs(self.vx) < 0.01)  self.deactivateDragScrollBar();
				self.thumbsHolder_do.setX(Math.round(self.thumbnailsFinalX));
			}
			
			if(self.stageWidth > self.totalWidth) self.deactivateDragScrollBar();
			
		};
		
		this.activateDragScrollBar = function(){
			if(self.stageWidth >= self.totalWidth || self.isMobileScrollBarRunning_bl) return;
			self.isMobileScrollBarRunning_bl = true;
			TweenMax.killTweensOf(self.thumbsHolder_do);
			clearInterval(self.updateMobileScrollBarId_int);
			self.updateMobileScrollBarId_int = setInterval(self.updateMobileScrollBar, 16);
		};
		
		this.deactivateDragScrollBar = function(){
			self.isMobileScrollBarRunning_bl = false;
			self.vx = self.vx2 = 0;
			clearInterval(self.updateMobileScrollBarId_int);
			if(window.removeEventListener) window.removeEventListener("touchmove", self.mobileScrBarMoveTest);
		};
		
		//###############################################//
		/* Add mouse wheel support */
		//##############################################//
		this.addDragMouseWheelSupport = function(){
			if(self.screen.addEventListener){
				self.screen.addEventListener ("mousewheel", self.mouseWheelDragHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelDragHandler);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent ("onmousewheel", self.mouseWheelDragHandler);	
			}
		};
		
		this.mouseWheelDragHandler = function(e){
			
			var dir;
			if(self.totalWidth <= self.stageWidth || self.isDragging_bl) return;
			
			var dir = e.detail || e.wheelDelta;
			if(e.wheelDelta) dir *= -1;
				
			if(dir > 0){
				self.vx -= 10;
			}else if(dir < 0){
				self.vx += 10;
			}
			
			if(!self.isMobileScrollBarRunning_bl) self.activateDragScrollBar();
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
		
		//########################################//
		/* Center thumbs... */
		//########################################//
		this.centerThumbs = function(animate){
			if(self.isMobileScrollBarRunning_bl || self.isDragging_bl) return;
		
			if(self.stageWidth > self.totalWidth){
				self.thumbnailsFinalX = Math.round((self.stageWidth - self.totalWidth)/2);
			}else{
				if(self.thumbnailsFinalX > 0){
					self.thumbnailsFinalX = 0;
				}else if(self.thumbnailsFinalX < self.stageWidth - self.totalWidth){
					self.thumbnailsFinalX = self.stageWidth - self.totalWidth;
				}
			}
			
			TweenMax.killTweensOf(self.thumbsHolder_do);
			if(animate){
				TweenMax.to(self.thumbsHolder_do, .3, {x:self.thumbnailsFinalX});
			}else{
				self.thumbsHolder_do.setX(self.thumbnailsFinalX);
			}
		};
		
		//###############################################//
		/* Setup scrollbar */
		//###############################################//
		this.setupScrollBar = function(){
			self.mainScrollBar_do = new FWDDisplayObject("div");
			self.mainScrollBar_do.setOverflow("visible");
			
			self.scrollBar_do = new FWDDisplayObject("div");
			self.scrollBar_do.setOverflow("visible");
			self.scrollTrack_sdo = new FWDSimpleDisplayObject("img");
			self.scrollTrack_sdo.setScreen(self.scrollBarTrackN_img);
			
			self.scrollBarHandler_do = new FWDDisplayObject("div");
			self.scrollBarHandler_do.setOverflow("visible");
			self.scrollBarHandler_do.setHeight(self.scrollBarHeight);
		
			self.scrollBarHandlerN_do = new FWDDisplayObject("div");
			self.scrollBarHandlerN_do.setOverflow("visible");
			self.scrollBarHandlerN_do.setHeight(self.scrollBarHeight);
			self.handlerLeftN_sdo = new FWDSimpleDisplayObject("img");
			self.handlerLeftN_sdo.setScreen(self.scrollBarHandlerLeftN_img);
			self.scrollBarHandlerN_do.addChild(self.handlerLeftN_sdo);
			self.handlerCenterBkN_sdo = new FWDSimpleDisplayObject("img");
			self.handlerCenterBkN_sdo.setScreen(self.scrollBarHandlerCenterBkN_img);
			self.scrollBarHandlerN_do.addChild(self.handlerCenterBkN_sdo);
			self.handlerCenterIconN_sdo = new FWDSimpleDisplayObject("img");
			self.handlerCenterIconN_sdo.setScreen(self.scrollBarHandlerCenterIconN_img);
			self.scrollBarHandlerN_do.addChild(self.handlerCenterIconN_sdo);
			self.handlerRightN_sdo = new FWDSimpleDisplayObject("img");
			self.handlerRightN_sdo.setScreen(self.scrollBarHandlerRightN_img);
			self.scrollBarHandlerN_do.addChild(self.handlerRightN_sdo);
			
			self.scrollBarHandlerS_do = new FWDDisplayObject("div");
			self.scrollBarHandlerS_do.setOverflow("visible");
			self.scrollBarHandlerS_do.setHeight(self.scrollBarHeight);
			self.handlerLeftS_sdo = new FWDSimpleDisplayObject("img");
			self.handlerLeftS_sdo.setScreen(self.scrollBarHandlerLeftS_img);
			self.scrollBarHandlerS_do.addChild(self.handlerLeftS_sdo);
			self.handlerCenterBkS_sdo = new FWDSimpleDisplayObject("img");
			self.handlerCenterBkS_sdo.setScreen(self.scrollBarHandlerCenterBkS_img);
			self.scrollBarHandlerS_do.addChild(self.handlerCenterBkS_sdo);
			self.handlerCenterIconS_sdo = new FWDSimpleDisplayObject("img");
			self.handlerCenterIconS_sdo.setScreen(self.scrollBarHandlerCenterIconS_img);
			self.scrollBarHandlerS_do.addChild(self.handlerCenterIconS_sdo);
			self.handlerRightS_sdo = new FWDSimpleDisplayObject("img");
			self.handlerRightS_sdo.setScreen(self.scrollBarHandlerRightS_img);
			self.scrollBarHandlerS_do.addChild(self.handlerRightS_sdo);
			self.scrollBarHandlerS_do.setAlpha(0);
			
			self.scrollBarDisabled_sdo = new FWDSimpleDisplayObject("div");
			self.scrollBarDisabled_sdo.setBkColor(self.disabledScrollbarColor_str);
			self.scrollBarDisabled_sdo.setAlpha(.7);
			self.scrollBarDisabled_sdo.setHeight(self.scrollBarHeight);
			
			self.scrollBarDumy_sdo = new FWDSimpleDisplayObject("div");
			if(FWDUtils.isIE) self.scrollBarDumy_sdo.getStyle().background = "url('dumy')";
			self.scrollBarDumy_sdo.setButtonMode(true);
			self.scrollBarDumy_sdo.setHeight(self.scrollBarHeight);
				
			self.scrollBarHandler_do.addChild(self.scrollBarHandlerN_do);
			self.scrollBarHandler_do.addChild(self.scrollBarHandlerS_do);
			self.scrollBarHandler_do.addChild(self.scrollBarDumy_sdo);
			self.scrollBar_do.addChild(self.scrollTrack_sdo);
			self.scrollBar_do.addChild(self.scrollBarHandler_do);
			self.scrollBar_do.addChild(self.scrollBarDisabled_sdo);
			self.mainScrollBar_do.addChild(self.scrollBar_do);
			self.addChild(self.mainScrollBar_do);
			
			if(self.scrollBarDumy_sdo.screen.addEventListener){	
				self.scrollBarDumy_sdo.screen.addEventListener("mouseover", self.scrollHandlerOnMouseOver);
				self.scrollBarDumy_sdo.screen.addEventListener("mouseout", self.scrollHandlerOnMouseOut);
				self.scrollBarDumy_sdo.screen.addEventListener("mousedown", self.scrollHandlerOnMouseDown);
			}else if(self.screen.attachEvent){
				self.scrollBarDumy_sdo.screen.attachEvent("onmouseover", self.scrollHandlerOnMouseOver);
				self.scrollBarDumy_sdo.screen.attachEvent("onmouseout", self.scrollHandlerOnMouseOut);
				self.scrollBarDumy_sdo.screen.attachEvent("onmousedown", self.scrollHandlerOnMouseDown);
			}
		};
		
		this.scrollHandlerOnMouseOver = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				TweenMax.to(self.scrollBarHandlerS_do, .8, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.scrollHandlerOnMouseOut = function(e){
			if(self.isDragging_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				TweenMax.to(self.scrollBarHandlerS_do, .8, {alpha:0, ease:Expo.easeOut});
			}
		};
		
		this.scrollHandlerOnMouseDown = function(e){
			if(!self.isScrollBarActive_bl) return;
			if(e.preventDefault) e.preventDefault();
			
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
			self.isDragging_bl = true;
			
			TweenMax.killTweensOf(self.scrollBarHandler_do);
			self.scrollBarHandlerX = self.scrollBarHandler_do.getX();
			self.xPositionOnPress = self.scrollBarHandlerX;
			self.lastPressedX = viewportMouseCoordinates.screenX;
			
			
			if(window.addEventListener){
				window.addEventListener("mousemove", self.scrollBarHandlerMoveHandler);
				window.addEventListener("mouseup", self.scrollBarHandlerEndHandler);	
			}else if(document.attachEvent){
				document.attachEvent("onmousemove", self.scrollBarHandlerMoveHandler);
				document.attachEvent("onmouseup", self.scrollBarHandlerEndHandler);
			}
		};
		
		this.scrollBarHandlerMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			
			self.scrollBarHandlerX = Math.round(self.xPositionOnPress + viewportMouseCoordinates.screenX - self.lastPressedX);
			
			if(self.scrollBarHandlerX < 0) {
				self.scrollBarHandlerX = 0;
			}else if (self.scrollBarHandlerX > self.stageWidth - self.scrollBarHandlerWidth) {
				self.scrollBarHandlerX  =  self.stageWidth - self.scrollBarHandlerWidth;	
			}
			
			self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
			self.updateScrollBar();
		};
		
		this.scrollBarHandlerEndHandler = function(e){
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
			
			self.isDragging_bl = false;
			
			if(!FWDUtils.hitTest(self.scrollBarDumy_sdo.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
				TweenMax.to(self.scrollBarHandlerS_do, .8, {alpha:0, ease:Expo.easeOut});
			}
			
			if(window.removeEventListener){
				window.removeEventListener("mousemove", self.scrollBarHandlerMoveHandler);
				window.removeEventListener("mouseup", self.scrollBarHandlerEndHandler);	
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", self.scrollBarHandlerMoveHandler);
				document.detachEvent("onmouseup", self.scrollBarHandlerEndHandler);
			}
		};
		
		//##############################################//
		/* Position and resize scrollbar */
		//##############################################//	
		this.positionMainScrollBar = function(){
			if(self.addMargins_bl){
				if(self.scrollBarPosition_str == "top"){
					self.mainScrollBar_do.setY(0);
				}else{
					self.mainScrollBar_do.setY(self.stageHeight + self.scrollBarOffset + (self.thumbsVSpace * 2));
				}
				
			}else{
				if(self.scrollBarPosition_str == "top"){
					self.mainScrollBar_do.setY(0);
				}else{
					self.mainScrollBar_do.setY(self.stageHeight + self.scrollBarOffset);
				}
			}
		};
		
		this.showScrollBar = function(animate){
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_DRAG) return;
			if(animate){
				TweenMax.to(self.scrollBar_do, .8, {y:0, ease:Expo.easeInOut});
			}else{
				TweenMax.killTweensOf(self.scrollBar_do);
				self.scrollBar_do.setY(0);
			}
		};
		
		this.hideScrollBar = function(animate){
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_DRAG) return;
			if(animate){
				if(self.scrollBarPosition_str == "top"){
					TweenMax.to(self.scrollBar_do, .8, {y:-self.scrollBarHeight, ease:Expo.easeInOut});
				}else{
					TweenMax.to(self.scrollBar_do, .8, {y:self.scrollBarHeight, ease:Expo.easeInOut});
				}
			}else{
				TweenMax.killTweensOf(self.scrollBar_do);
				if(self.scrollBarPosition_str == "top"){
					self.scrollBar_do.setY(-self.scrollBarHeight);
				}else{
					self.scrollBar_do.setY(self.scrollBarHeight);
				}
			}
		};
		
		this.checkScrolBarHandlerSizeAndPosition = function(){
			self.scrollBarHandlerWidth = Math.min(self.stageWidth, parseInt(self.stageWidth * (self.stageWidth/self.totalWidth)));
			if(isNaN(self.scrollBarHandlerWidth)) return;
			if(self.scrollBarHandlerWidth < 100) self.scrollBarHandlerWidth = 100;
			
			if(self.totalWidth > self.stageWidth){
				//self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
				self.scrollBarDisabled_sdo.setY(-2000);
				self.isScrollBarActive_bl = true;
			}else{
				self.scrollBarHandlerX = 0;
				self.scrollBarHandlerWidth = self.stageWidth;
				self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
				self.scrollBarDisabled_sdo.setY(0);
				self.isScrollBarActive_bl = false;	
			}
		
			if(self.scrollBarHandlerX < 0) {
				self.scrollBarHandlerX = 0;
				self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
			}else if (self.scrollBarHandlerX > self.stageWidth - self.scrollBarHandlerWidth) {
				self.scrollBarHandlerX  =  self.stageWidth - self.scrollBarHandlerWidth;	
				self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
			}
		};
		
		//##############################################//
		/* Set Scrollbar size */
		//##############################################//	
		this.setScrollBarSize = function(animate){
			
			if(isNaN(self.scrollBarHandlerWidth) || isNaN(self.scrollBarHeight)) return;
			self.scrollTrack_sdo.setWidth(self.stageWidth);
			self.scrollTrack_sdo.setHeight(self.scrollBarHeight);
			self.scrollBarDumy_sdo.setWidth(self.scrollBarHandlerWidth);
			self.scrollBarHandler_do.setWidth(self.scrollBarHandlerWidth);
			self.scrollBarDisabled_sdo.setWidth(self.scrollBarHandlerWidth);
			
			TweenMax.killTweensOf(self.handlerCenterBkN_sdo);
			TweenMax.killTweensOf(self.handlerCenterBkS_sdo);
			TweenMax.killTweensOf(self.handlerCenterIconN_sdo);
			TweenMax.killTweensOf(self.handlerCenterIconS_sdo);
			TweenMax.killTweensOf(self.handlerRightN_sdo);
			TweenMax.killTweensOf(self.handlerRightS_sdo);
			
			if(animate){
				TweenMax.to(self.handlerCenterBkN_sdo, .6, {w:self.scrollBarHandlerWidth - (self.handlerLeftN_sdo.w * 2) + 2, ease:Quart.easeOut});
				TweenMax.to(self.handlerCenterBkS_sdo, .6, {w:self.scrollBarHandlerWidth - (self.handlerLeftN_sdo.w * 2) + 2, ease:Quart.easeOut});
				TweenMax.to(self.handlerCenterIconN_sdo, .6, {x:parseInt((self.scrollBarHandlerWidth - self.handlerCenterIconN_sdo.w)/2), ease:Quart.easeOut});
				TweenMax.to(self.handlerCenterIconS_sdo, .6, {x:parseInt((self.scrollBarHandlerWidth - self.handlerCenterIconN_sdo.w)/2), ease:Quart.easeOut});
				TweenMax.to(self.handlerRightN_sdo, .6, {x:self.scrollBarHandlerWidth - self.handlerLeftN_sdo.w, ease:Quart.easeOut});
				TweenMax.to(self.handlerRightS_sdo, .6, {x:self.scrollBarHandlerWidth - self.handlerLeftN_sdo.w, ease:Quart.easeOut});
			}else{
				self.handlerCenterBkN_sdo.setWidth(self.scrollBarHandlerWidth - (self.handlerLeftN_sdo.w * 2) + 2);
				self.handlerCenterBkS_sdo.setWidth(self.scrollBarHandlerWidth - (self.handlerLeftN_sdo.w * 2) + 2);
				self.handlerCenterIconN_sdo.setX(parseInt((self.scrollBarHandlerWidth - self.handlerCenterIconN_sdo.w)/2));
				self.handlerCenterIconS_sdo.setX(parseInt((self.scrollBarHandlerWidth - self.handlerCenterIconN_sdo.w)/2));
				self.handlerRightN_sdo.setX(self.scrollBarHandlerWidth - self.handlerLeftN_sdo.w);
				self.handlerRightS_sdo.setX(self.scrollBarHandlerWidth - self.handlerLeftN_sdo.w);
				self.handlerCenterBkN_sdo.setX(self.handlerLeftN_sdo.w);
				self.handlerCenterBkS_sdo.setX(self.handlerLeftN_sdo.w);
				
			}
		};
		
		//##############################################//
		/* Update scrollbar */
		//##############################################//	
		this.updateScrollBar = function(animateHandler){
			
			var handlerPercent;
			var contentPercent;
			
			if(self.isDragging_bl){
				handlerPercent = (self.scrollBarHandlerX/(self.stageWidth - self.scrollBarHandlerWidth));
				if(handlerPercent == "Infinity") thumbsTargetYPercent = 0;
				if(handlerPercent >= 1) thumbsTargetYPercent = 1;
				self.thumbnailsFinalX = Math.round(-handlerPercent * (self.totalWidth - self.stageWidth));
				TweenMax.killTweensOf(self.thumbsHolder_do);
				TweenMax.to(self.thumbsHolder_do, .5, {x:self.thumbnailsFinalX, ease:Quart.easeOut});
			}else if(self.isScrolling_bl){
				handlerPercent = (self.scrollBarHandlerX/(self.stageWidth - self.scrollBarHandlerWidth));
				if(handlerPercent == "Infinity") thumbsTargetYPercent = 0;
				if(handlerPercent >= 1) thumbsTargetYPercent = 1;
				self.thumbnailsFinalX = Math.round(-handlerPercent * (self.totalWidth - self.stageWidth));
				TweenMax.killTweensOf(self.thumbsHolder_do);
				TweenMax.to(self.thumbsHolder_do, .5, {x:self.thumbnailsFinalX, ease:Quart.easeOut});
				TweenMax.killTweensOf(self.scrollBarHandler_do);
				if(animateHandler){
					TweenMax.to(self.scrollBarHandler_do, .6, {x:self.scrollBarHandlerX, ease:Quart.easeOut});
				}else{
					self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
				}
			}else{
				contentPercent = Math.abs(self.thumbnailsFinalX)/(self.totalWidth - self.stageWidth);
				
				if(contentPercent > 1){
					contentPercent = 1;
				}else if(contentPercent < 0){
					contentPercent = 0;
				}
			
				if(isNaN(contentPercent)) percent = 0;
				self.scrollBarHandlerX =  Math.round(contentPercent * (self.stageWidth  - self.scrollBarHandlerWidth));
				
				TweenMax.killTweensOf(self.scrollBarHandler_do);
				if(animateHandler){
					TweenMax.to(self.scrollBarHandler_do, .6, {x:self.scrollBarHandlerX, ease:Quart.easeOut});
				}else{
					self.scrollBarHandler_do.setX(self.scrollBarHandlerX);
				}
			}
		};
	
		//###############################################//
		/* Add mouse wheel support */
		//##############################################//
		self.addScrollBarMouseWheelSupport = function(){
			if(self.screen.addEventListener){
				self.screen.addEventListener ("mousewheel", self.mouseWheelHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent ("onmousewheel", self.mouseWheelHandler);	
			}
		};
		
		self.mouseWheelHandler = function(e){
			var dir;
			if(self.totalWidth <= self.stageWidth || self.isDragging_bl) return;
			
			if(self.scrollBarType_str == FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR){
				var dir = e.detail || e.wheelDelta;	
				if(e.wheelDelta) dir *= -1;
				
				if(dir > 0){
					self.scrollBarHandlerX += Math.round(120  * (self.stageWidth/self.totalWidth));
				}else if(dir < 0){
					self.scrollBarHandlerX -= Math.round(120 * (self.stageWidth/self.totalWidth));
				}
				
				if(self.scrollBarHandlerX < 0) {
					self.scrollBarHandlerX = 0;
				}else if (self.scrollBarHandlerX > self.stageWidth - self.scrollBarHandlerWidth) {
					self.scrollBarHandlerX  =  self.stageWidth - self.scrollBarHandlerWidth;	
				}
				
				self.startToScrollTimeOut();
				self.updateScrollBar(true);
			}
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
		
		//############################################//
		/* Start to scroll timeout... */
		//############################################//
		this.startToScrollTimeOut = function(){
			self.isScrolling_bl = true;
			clearTimeout(self.stopToScrollTimeOutId_to);
			self.stopToScrollTimeOutId_to = setTimeout(self.scrollCompleteHandler, 300);
		};
		
		self.scrollCompleteHandler = function(){
			self.isScrolling_bl = false;
		};
	
		
		//###############################################//
		/* clear timeouts and remove main events */
		//###############################################//
		this.clearTimeoutsAndRemoveAllMainEvents = function(){
			clearTimeout(self.startToLoadThumbsId_to);
			clearTimeout(self.loadWithDelayId_to);
			clearTimeout(self.resizeAndPositionThumbsId_to);		
			clearTimeout(self.disableThumbClickDelayId_to);
			clearTimeout(self.stopToScrollTimeOutId_to);
			clearTimeout(self.allThumbsAreTweenedId_to);
			clearInterval(self.ieOldMoveTestId_int);
			clearInterval(self.updateMobileScrollBarId_int);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.nextThumbSetBtn_do.screen.removeEventListener("MSPointerOver", self.onNextBtnOverHandler);
					self.nextThumbSetBtn_do.screen.removeEventListener("MSPointerOut", self.onNextBtnOutHandler);
					self.nextThumbSetBtn_do.screen.removeEventListener("MSPointerUp", self.onNextBtnClickHandler);
					self.screen.removeEventListener("MSPointerDown", self.mobileScrBarStartHandler);
					window.removeEventListener("MSPointerUp", self.mobileScrBarEndHandler, false);
					window.removeEventListener("MSPointerMove", self.mobileScrBarMoveHandler);
				}
				self.nextThumbSetBtn_do.screen.removeEventListener("touchend", self.onNextBtnClickHandler);
				self.screen.removeEventListener("touchstart", self.mobileScrBarStartTest);
				window.removeEventListener("touchmove", self.mobileScrBarMoveTest);
				window.removeEventListener("touchend", self.mobileScrBarEndTest);
				window.removeEventListener("touchend", self.mobileScrBarEndHandler);
				window.removeEventListener("touchmove", self.mobileScrBarMoveHandler);
				window.removeEventListener("touchmove", self.onDisableMove);
			}else if(document.removeEventListener){
				self.nextThumbSetBtn_do.screen.removeEventListener("mouseover", self.onNextBtnOverHandler);
				self.nextThumbSetBtn_do.screen.removeEventListener("mouseout", self.onNextBtnOutHandler);
				self.nextThumbSetBtn_do.screen.removeEventListener("click", self.onNextBtnClickHandler);
				self.screen.removeEventListener("mousedown", self.mobileScrBarStartHandler);
				window.removeEventListener("mouseup", self.mobileScrBarEndHandler);
				window.removeEventListener("mousemove", self.mobileScrBarMoveHandler);
				self.screen.removeEventListener ("mousewheel", self.mouseWheelDragHandler);
				self.screen.removeEventListener('DOMMouseScroll', self.mouseWheelDragHandler);
				if(self.scrollBarDumy_sdo){
					self.scrollBarDumy_sdo.screen.removeEventListener("mouseover", self.scrollHandlerOnMouseOver);
					self.scrollBarDumy_sdo.screen.removeEventListener("mouseout", self.scrollHandlerOnMouseOut);
					self.scrollBarDumy_sdo.screen.removeEventListener("mousedown", self.scrollHandlerOnMouseDown);
				}
				window.removeEventListener("mousemove", self.scrollBarHandlerMoveHandler);
				window.removeEventListener("mouseup", self.scrollBarHandlerEndHandler);	
				self.screen.removeEventListener ("mousewheel", self.mouseWheelHandler);
				self.screen.removeEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}else if(self.nextThumbSetBtn_do.screen.detachEvent){
				self.nextThumbSetBtn_do.screen.detachEvent("onmouseover", self.onNextBtnOverHandler);
				self.nextThumbSetBtn_do.screen.detachEvent("onmouseout", self.onNextBtnOutHandler);
				self.nextThumbSetBtn_do.screen.detachEvent("onclick", self.onNextBtnClickHandler);
				self.screen.detachEvent("onmousedown", self.mobileScrBarStartHandler);
				document.detachEvent("onmouseup", self.mobileScrBarEndHandler);
				document.detachEvent("onmousemove", self.mobileScrBarMoveHandler);
				self.screen.detachEvent ("onmousewheel", self.mouseWheelDragHandler);
				if(self.scrollBarDumy_sdo){
					self.scrollBarDumy_sdo.screen.detachEvent("onmouseover", self.scrollHandlerOnMouseOver);
					self.scrollBarDumy_sdo.screen.detachEvent("onmouseout", self.scrollHandlerOnMouseOut);
					self.scrollBarDumy_sdo.screen.detachEvent("onmousedown", self.scrollHandlerOnMouseDown);
				}
				document.detachEvent("onmousemove", self.scrollBarHandlerMoveHandler);
				document.detachEvent("onmouseup", self.scrollBarHandlerEndHandler);
				self.screen.detachEvent ("onmousewheel", self.mouseWheelHandler);	
			}
		};
		
		//###############################################//
		/* destroy */
		//###############################################//
		this.destroy = function(){
			
			self.clearTimeoutsAndRemoveAllMainEvents();
			
			if (self.image){
				self.image.onload = null;
				self.image.onerror = null;
				self.image.src = null;
			}
			
			/* destroy thumbs */
			for (var i=0; i<self.totalThumbnails; i++) self.thumbs_ar[i].destroy();
			
			TweenMax.killTweensOf(self.thumbsHolder_do);
			self.thumbsHolder_do.destroy();
			
			if(self.dumy_sdo) self.dumy_sdo.destroy();
			
			if(self.mainScrollBar_do){
				TweenMax.killTweensOf(self.mainScrollBar_do);
				TweenMax.killTweensOf(self.scrollBar_do);
				TweenMax.killTweensOf(self.scrollBarHandler_do);
				TweenMax.killTweensOf(self.handlerCenterBkN_sdo);
				TweenMax.killTweensOf(self.handlerCenterBkS_sdo);
				TweenMax.killTweensOf(self.handlerCenterIconN_sdo);
				TweenMax.killTweensOf(self.handlerCenterIconS_sdo);
				TweenMax.killTweensOf(self.scrollBarHandlerS_do);
				TweenMax.killTweensOf(self.handlerRightN_sdo);
				TweenMax.killTweensOf(self.handlerRightS_sdo);
				
				self.scrollBarHandler_do.destroy();
				self.scrollBarHandlerN_do.destroy();
				self.scrollBarHandlerS_do.destroy();
				self.scrollBarDisabled_sdo.destroy();
				self.scrollBarDumy_sdo.destroy();
				self.handlerCenterBkN_sdo.destroy();
				self.handlerCenterBkS_sdo.destroy();
				self.handlerLeftN_sdo.destroy();
				self.handlerLeftS_sdo.destroy();
				self.handlerCenterIconN_sdo.destroy();
				self.handlerCenterIconS_sdo.destroy();
				self.handlerRightN_sdo.destroy();
				self.handlerRightS_sdo.destroy();
			}
			
			if (self.numberOfThumbsToShowPerSet){
				TweenMax.killTweensOf(self.nextThumbSetBtn_do);
				TweenMax.killTweensOf(self.nextThumbSetBtnNormal_do);
				TweenMax.killTweensOf(self.nextThumbSetBtnSelected_do);
				
				self.nextThumbSetBtn_do.destroy();
				self.nextThumbSetBtnNormal_do.destroy();
				self.nextThumbSetBtnSelected_do.destroy();
			}
			
			self.curPlayListData_ar = null;
			self.thumbs_ar = null;
			self.rowsHeights_ar = null;
			
			self.image = null;
			self.thumbsHolder_do = null;
			self.dumy_sdo = null;
			self.mainScrollBar_do = null;
			self.scrollBar_do = null;
			self.scrollTrack_sdo = null;
			self.scrollBarHandler_do = null;
			self.scrollBarHandlerN_do = null;
			self.scrollBarHandlerS_do = null;
			self.scrollBarDisabled_sdo = null;
			self.scrollBarDumy_sdo = null;
			self.handlerCenterBkN_sdo = null;
			self.handlerCenterBkS_sdo = null;
			self.handlerLeftN_sdo = null;
			self.handlerLeftS_sdo = null;
			self.handlerCenterIconN_sdo = null;
			self.handlerCenterIconS_sdo = null;
			self.handlerRightN_sdo = null;
			self.handlerRightS_sdo = null;
			self.nextThumbSetBtn_do = null;
			self.nextThumbSetBtnNormal_do = null;
			self.nextThumbSetBtnSelected_do = null;
			
			self.scrollBarTrackN_img = null;
			self.scrollBarHandlerCenterBkN_img = null;
			self.scrollBarHandlerCenterBkS_img = null;
			self.scrollBarHandlerLeftN_img = null;
			self.scrollBarHandlerLeftS_img = null;
			self.scrollBarHandlerRightN_img = null;
			self.scrollBarHandlerRightS_img = null;
			self.scrollBarHandlerCenterIconN_img = null;
			self.scrollBarHandlerCenterIconS_img = null;
			
			data = null;
			parent = null;

			self.setInnerHTML("");
			self = null;
			prototype.destroy();
			prototype = null;
			FWDThumbsManager.prototype = null;
		};
		
		this.init();
	};

	/* set prototype */
	FWDThumbsManager.setPrototype = function(){
		FWDThumbsManager.prototype = new FWDDisplayObject("div", "absolute", "visible");
	};
	
	FWDThumbsManager.HIDE_THUMBS_COMPLETE = "onHideThumbsComplete";
	FWDThumbsManager.SCROLL_TYPE_DRAG = "drag";
	FWDThumbsManager.SCROLL_TYPE_SCROLL_BAR = "scrollbar";
	FWDThumbsManager.LOAD_ERROR = "onLoadError";
	FWDThumbsManager.CLICK = "onClick";

	window.FWDThumbsManager = FWDThumbsManager;

}(window));