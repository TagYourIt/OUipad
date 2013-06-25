/* Data */
(function(window){
	
	var FWDData = function(props){
		
		var self = this;
		var prototype = FWDData.prototype;
		
		this.image_img = null;
		this.mainPreloader_img = null;
		this.lightboxPreloader_img = null;
		this.slideShowPreloader_img = null;
		this.showMoreThumbsButtonN_img = null;
		this.showMoreThumbsButtonS_img = null;
		this.fullScreenNN_img = null; 
		this.fullScreenNS_img = null; 
		this.fullScreenFN_img = null; 
		this.fullScreenFS_img = null;
		this.comboboxUpArrowN_img = null;
		this.comboboxUpArrowS_img = null;
		this.scrollBarTrackN_img = null;
		this.scrollBarHandlerCenterBkN_img = null;
		this.scrollBarHandlerCenterBkS_img = null;
		this.scrollBarHandlerLeftN_img = null;
		this.scrollBarHandlerLeftS_img = null;
		this.scrollBarHandlerRightN_img = null;
		this.scrollBarHandlerRightS_img = null;
		this.scrollBarHandlerCenterIconN_img = null;
		this.scrollBarHandlerCenterIconS_img = null;
		this.lightboxCloseButtonN_img = null;
		this.lightboxCloseButtonS_img = null;
		this.lightboxNextButtonN_img = null;
		this.lightboxNextButtonS_img = null;
		this.lightboxPrevButtonN_img = null;
		this.lightboxPrevButtonS_img = null;
		this.lightboxPlayN_img = null;
		this.lightboxPlayS_img = null;
		this.lightboxPauseN_img = null;
		this.lightboxPauseS_img = null;
		this.lightboxMaximizeN_img = null;
		this.lightboxMaximizeS_img = null;
		this.lightboxMinimizeN_img = null;
		this.lightboxMinimizeS_img = null;
		this.lightboxInfoOpenN_img = null;
		this.lightboxInfoOpenS_img = null;
		this.lightboxInfoCloseN_img = null;
		this.lightboxInfoCloseS_img = null;
		
		this.props_obj = props;
		this.rootElement_el = null;
		this.graphicsPaths_ar = [];
		this.skin_ar = [];
		this.playList_ar = [];
		this.lightBox_ar = [];
		this.categories_ar = [];
		
		this.backgroundColor_str;
		this.thumbnailBackgroundColor_str;
		this.thumbnailBorderColor_str;
		this.thumbnailOverlayBackgroundColor_str;
		this.lightBoxInfoWindowBackgroundColor_str;
		this.lightBoxItemBorderColor_str;
		this.lightBoxItemBackgroundColor_str;
		this.thumbnailOverlayType_str;
		this.thumbnailOverlayColor_str;
		this.thumbnailBackgroundColor_str;
		this.thumbnailBorderNormalColor_str;
		this.thumbnailBorderSelectedColor_str;
		this.imageIconPath_str;
		this.imageIframePath_str;
		this.videoIconPath_str;
		this.linkIconPath_str;
		this.scrollBarPosition_str;
		this.scrollBarType_str;
		this.selectLabel_str;
		this.position_str;
		this.selectLabel_str;
		this.allCategoriesLabel_str;
		this.selctorBackgroundNormalColor_str;
		this.selctorBackgroundSelectedColor_str;
		this.selctorTextNormalColor_str;
		this.selctorTextSelectedColor_str;
		this.buttonBackgroundNormalColor_str;
		this.buttonBackgroundSelectedColor_str;
		this.buttonTextNormalColor_str;
		this.buttonTextSelectedColor_str;
		this.comboBoxShadowColor_str;
		this.fullScreenPosition_str;
		this.scrollbarDisabledColor_str;
		this.handMovePath_str;
		this.handGrabPath_str;
		
		this.startAtCategory;
		this.numberOfThumbsToShowPerSet;
		this.thumbnailBaseWidth;
		this.thumbnailBaseHeight;
		this.thumbnailBorderSize;
		this.horizontalSpaceBetweenThumbnails;
		this.verticalSpaceBetweenThumbnails;
		this.thumbnailOverlayOpacity;
		this.countLoadedGraphics = 0;
		this.thumbnailBorderSize;
		this.thumbnailBorderRadius;
		this.totalGraphics;
		this.lightBoxInfoWindowBackgroundOpacity;
		this.lightBoxBackgroundOpacity;
		this.lightBoxBorderSize;
		this.lightBoxBorderRadius;
		this.lightBoxSlideShowDelay;
		this.scrollBarOffset;
		this.comboBoxHorizontalMargins;
		this.comboBoxVerticalMargins;
		this.comboBoxCornerRadius;
		this.fullScreenHorizontalMargins;
		this.fullScreenVerticalMargins;
		this.thumbIconWidth;
		this.thumbIconHeight;
		
		this.parseDelayId_to;
		this.loadImageId_to;
		
		this.showFullScreenButton_bl;
		this.showLightBoxZoomButton_bl;
		this.showLightBoxInfoButton_bl;
		this.showLighBoxSlideShowButton_bl;
		this.slideShowAutoPlay_bl;
		this.addLightBoxKeyboardSupport_bl;
		this.showLighBoxNextAndPrevButtons_bl;
		this.showContextMenu_bl;
		this.showInfoWindowByDefault_bl;
		this.lightBoxVideoAutoPlay_bl = false;
		this.addMouseWheelSupport_bl;
		this.removePlayListFromDOM_bl = true;
		this.addMargins_bl = false;
		this.showContextMenu_bl = false;
		this.showAllCategories_bl = false;
		this.forceRoundBorderToIframe_bl = false;
		
		this.showComboBox_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		
		
		//###################################//
		/*init*/
		//###################################//
		this.init = function(){
			this.parseDelayId_to = setTimeout(self.parseProperties, 100);
		};

		this.parseProperties = function(){
			var errorMessage_str;
			var mediaKid;
			var test;
			
			//check for gridListDivId property.
			if(!self.props_obj.gridPlayListAndSkinId){
				errorMessage_str = "<font color='#FFFFFF'>gridPlayListAndSkinId</font> property which represents the grid playlist id is not defined in FWDGrid constructor function!";
				self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
				return;
			};
			
			//set the root element of the grid list.
			self.rootElement_el = FWDUtils.getChildById(self.props_obj.gridPlayListAndSkinId);
			if(!self.rootElement_el){
				errorMessage_str = "Make sure that the a div with the id - <font color='#FFFFFF'>" + self.props_obj.gridPlayListAndSkinId + "</font> exists, this represents the data playlist.";
				self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
				return;
			}
			
			self.rootElement_el.style.display = "none";
			
			//parse skin.
			var skinElement_el = FWDUtils.getChildFromNodeListFromAttribute(self.rootElement_el, "data-skin");
			if(!skinElement_el){
				errorMessage_str = "The (ul) tag with the attribute <font color='#FFFFFF'>data-skin</font> must be defined, this represents the skin data.";
				self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
				return;
			} 
			
			var playlist_ar = FWDUtils.getChildrenFromAttribute(self.rootElement_el, "data-cat");
			if(!playlist_ar){
				errorMessage_str = "Atleast one playlist ul tag with the attribute <font color='#FFFFFF'>data-cat</font> must be defined.";
				self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
				return;
			}
			
			//set main properties.
			self.numberOfThumbsToShowPerSet = self.props_obj.nrOfThumbsToShowOnSet || undefined;
			self.thumbnailBaseWidth = self.props_obj.thumbnailBaseWidth || 280;
			self.thumbnailBaseHeight = self.props_obj.thumbnailBaseHeight || 240;
			self.horizontalSpaceBetweenThumbnails = self.props_obj.horizontalSpaceBetweenThumbnails || 0;
			self.verticalSpaceBetweenThumbnails = self.props_obj.verticalSpaceBetweenThumbnails || 0;
			self.thumbnailOverlayColor_str = self.props_obj.thumbnailOverlayColor || "transparent";
			self.thumbnailBackgroundColor_str = self.props_obj.thumbnailBackgroundColor || "transparent";
			self.thumbnailBorderNormalColor_str = self.props_obj.thumbnailBorderNormalColor || "transparent";
			self.thumbnailBorderSelectedColor_str = self.props_obj.thumbnailBorderSelectedColor || "transparent";
			self.backgroundColor_str = self.props_obj.backgroundColor || "transparent";
			self.thumbnailBackgroundColor_str = self.props_obj.thumbnailBackgroundColor || "transparent";
			self.thumbnailBorderSize = self.props_obj.thumbnailBorderSize || 0;
			self.thumbnailBorderColor_str = self.props_obj.thumbnailBorderColor || "transparent";
			self.thumbnailOverlayBackgroundColor_str = self.props_obj.thumbnailOverlayColor || "transparent";
			self.thumbnailOverlayOpacity = self.props_obj.thumbnailOverlayOpacity || 1;
			self.lightBoxInfoWindowBackgroundColor_str =  self.props_obj.lightBoxInfoWindowBackgroundColor || "transparent";
			self.lightBoxBackgroundColor_str = self.props_obj.lighBoxBackgroundColor || "transparent";
			self.lightBoxInfoWindowBackgroundOpacity =  self.props_obj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxBackgroundOpacity = self.props_obj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxMainBackgroundOpacity = self.props_obj.lightBoxMainBackgroundOpacity || 1;
			self.lightBoxItemBorderColor_str = self.props_obj.lightBoxItemBorderColor || "transparent";
			self.lightBoxItemBackgroundColor_str = self.props_obj.lightBoxItemBackgroundColor || "transparent";
			self.lightBoxBorderSize = self.props_obj.lightBoxBorderSize || 0;
			self.lightBoxBorderRadius = self.props_obj.lightBoxBorderRadius || 0;
			self.thumbnailBorderRadius = self.props_obj.thumbnailBorderRadius || 0;
			self.lightBoxSlideShowDelay = self.props_obj.lightBoxSlideShowDelay * 1000 || 3000;
			self.scrollBarOffset = self.props_obj.scrollBarOffset || 0;
			
			self.thumbnailOverlayType_str = self.props_obj.thumbnailOverlayType;
			self.thumbnailOverlayType_str = self.thumbnailOverlayType_str == "icons" || self.thumbnailOverlayType_str == "text" || self.thumbnailOverlayType_str == "none";	
			if(!self.thumbnailOverlayType_str){
				self.scrollBarPosition_str = "none";
			}else{
				self.thumbnailOverlayType_str = FWDUtils.trim(self.props_obj.thumbnailOverlayType);
			}
			
			
			self.scrollBarPosition_str = self.props_obj.scrollBarPosition;
			self.scrollBarPosition_str = self.scrollBarPosition_str == "bottom" || self.scrollBarPosition_str == "top";	
			if(!self.scrollBarPosition_str){
				self.scrollBarPosition_str = "bottom";
			}else{
				self.scrollBarPosition_str = FWDUtils.trim(self.props_obj.scrollBarPosition);
			}
			
			self.scrollBarType_str = self.props_obj.scrollBarType;
			self.scrollBarType_str = self.scrollBarType_str == "drag" || self.scrollBarType_str == "scrollbar";	
			if(!self.scrollBarType_str || self.isMobile_bl){
				self.scrollBarType_str = "drag";
			}else{
				self.scrollBarType_str = FWDUtils.trim(self.props_obj.scrollBarType).toLowerCase();
			}
			
			self.position_str = self.props_obj.comboBoxPosition;
			self.position_str = self.position_str == "topleft" || self.position_str == "topright";	
			if(!self.position_str){
				self.position_str = "topleft";
			}else{
				self.position_str = FWDUtils.trim(self.props_obj.comboBoxPosition).toLowerCase();
			}
			
			self.fullScreenPosition_str = self.props_obj.fullScreenButtonPosition;
			self.fullScreenPosition_str = self.fullScreenPosition_str == "topleft" || self.fullScreenPosition_str == "topright" 
										  || self.fullScreenPosition_str == "bottomleft" || self.fullScreenPosition_str == "bottomright";	
			if(!self.fullScreenPosition_str){
				self.fullScreenPosition_str = "topleft";
			}else{
				self.fullScreenPosition_str = FWDUtils.trim(self.props_obj.fullScreenButtonPosition).toLowerCase();
			}
			
			self.scrollbarDisabledColor_str = self.props_obj.scrollbarDisabledColor || "#000000";
			self.allCategoriesLabel_str = self.props_obj.allCategoriesLabel || null;
			self.selectLabel_str  = self.props_obj.selectLabel || "not defined!";
			self.selctorBackgroundNormalColor_str = self.props_obj.selctorBackgroundNormalColor;
			self.selctorBackgroundSelectedColor_str = self.props_obj.selctorBackgroundSelectedColor;
			self.selctorTextNormalColor_str = self.props_obj.selctorTextNormalColor;
			self.selctorTextSelectedColor_str = self.props_obj.selctorTextSelectedColor;
			self.buttonBackgroundNormalColor_str = self.props_obj.buttonBackgroundNormalColor;
			self.buttonBackgroundSelectedColor_str = self.props_obj.buttonBackgroundSelectedColor;
			self.buttonTextNormalColor_str = self.props_obj.buttonTextNormalColor;
			self.buttonTextSelectedColor_str = self.props_obj.buttonTextSelectedColor;
			self.comboBoxShadowColor_str = self.props_obj.comboBoxShadowColor || "#000000";
			self.comboBoxHorizontalMargins = self.props_obj.comboBoxHorizontalMargins || 0;
			self.comboBoxVerticalMargins = self.props_obj.comboBoxVerticalMargins || 0;
			self.comboBoxCornerRadius = self.props_obj.comboBoxCornerRadius || 0;
			self.fullScreenHorizontalMargins = self.props_obj.fullScreenButtonHorizontalMargins || 0;
			self.fullScreenVerticalMargins = self.props_obj.fullScreenButtonVerticalMargins || 0;
			self.selectLabel_str = self.props_obj.selectLabel || "not defined!";
			
			self.addMargins_bl = self.props_obj.addMargins; 
			self.addMargins_bl = self.addMargins_bl == "yes" ? true : false;
			
			self.showContextMenu_bl = self.props_obj.showContextMenu; 
			self.showContextMenu_bl = self.showContextMenu_bl == "no" ? false : true;
			
			self.showAllCategories_bl = self.props_obj.showAllCategories; 
			self.showAllCategories_bl = self.showAllCategories_bl == "no" ? false : true;
			
			self.forceRoundBorderToIframe_bl = self.props_obj.forceRoundBorderToIframe; 
			self.forceRoundBorderToIframe_bl = self.forceRoundBorderToIframe_bl == "yes" ? true : false;
			
			self.showFullScreenButton_bl = self.props_obj.showFullScreenButton; 
			self.showFullScreenButton_bl = self.showFullScreenButton_bl == "no" ? false : true;
			
			self.addLightBoxKeyboardSupport_bl = self.props_obj.addLightBoxKeyboardSupport; 
			self.addLightBoxKeyboardSupport_bl = self.addLightBoxKeyboardSupport_bl == "no" ? false : true;
			
			self.showLighBoxNextAndPrevButtons_bl = self.props_obj.showLightBoxNextAndPrevButtons; 
			self.showLighBoxNextAndPrevButtons_bl = self.showLighBoxNextAndPrevButtons_bl == "no" ? false : true;
			
			self.showInfoWindowByDefault_bl = self.props_obj.showLightBoxInfoWindowByDefault; 
			self.showInfoWindowByDefault_bl = self.showInfoWindowByDefault_bl == "yes" ? true : false;
			
			self.lightBoxVideoAutoPlay_bl = self.props_obj.lightBoxVideoAutoPlay; 
			self.lightBoxVideoAutoPlay_bl = self.lightBoxVideoAutoPlay_bl == "yes" ? true : false;
			
			self.addMouseWheelSupport_bl = self.props_obj.addMouseWheelSupport; 
			self.addMouseWheelSupport_bl = self.addMouseWheelSupport_bl == "no" ? false : true;
			
			self.removePlayListFromDOM_bl = self.props_obj.removePlayListFromDOM;
			self.removePlayListFromDOM_bl = self.removePlayListFromDOM_bl == "no" ? false : true;
			
			self.showContextMenu_bl = self.props_obj.showContextMenu; 
			self.showContextMenu_bl = self.showContextMenu_bl == "no" ? false : true;
		
			self.showLightBoxZoomButton_bl = self.props_obj.showLightBoxZoomButton; 
			self.showLightBoxZoomButton_bl = self.showLightBoxZoomButton_bl == "no" ? false : true;
			
			self.showLightBoxInfoButton_bl = self.props_obj.showLightBoxInfoButton;
			self.showLightBoxInfoButton_bl = self.showLightBoxInfoButton_bl == "no" ? false : true;
			
			self.showLighBoxSlideShowButton_bl =  self.props_obj.showLighBoxSlideShowButton;
			self.showLighBoxSlideShowButton_bl =  self.showLighBoxSlideShowButton_bl == "no" ? false : true;
			
			self.slideShowAutoPlay_bl = self.props_obj.slideShowAutoPlay;
			self.slideShowAutoPlay_bl = self.slideShowAutoPlay_bl == "yes" ? true : false;
			
			//set skin data.
			var preloaderPath_str = self.checkForAttribute(skinElement_el, "data-preloader-path");
			if(!preloaderPath_str) return;
			
			var slideShowPreloaderPath_str = self.checkForAttribute(skinElement_el, "data-lightbox-slideshow-preloader-path");
			if(!slideShowPreloaderPath_str) return;
			
			var showMoreThumbsButtonNPath_str = self.checkForAttribute(skinElement_el, "data-show-more-thumbnails-button-normal-path");
			if(!showMoreThumbsButtonNPath_str) return;
		
			var showMoreThumbsButtonPathS_str = self.checkForAttribute(skinElement_el, "data-show-more-thumbnails-button-selectsed-path");
			if(!showMoreThumbsButtonPathS_str) return;
			
			self.imageIconPath_str = self.checkForAttribute(skinElement_el, "data-image-icon-path");
			if(!self.imageIconPath_str) return;
			
			self.imageIframePath_str = self.checkForAttribute(skinElement_el, "data-iframe-icon-path");
			if(!self.imageIframePath_str) return;
			
			self.videoIconPath_str = self.checkForAttribute(skinElement_el, "data-video-icon-path");
			if(!self.videoIconPath_str) return;
			
			self.linkIconPath_str = self.checkForAttribute(skinElement_el, "data-link-icon-path");
			if(!self.linkIconPath_str) return;
			
			self.handMovePath_str = self.checkForAttribute(skinElement_el, "data-hand-move-icon-path");
			if(!self.handMovePath_str) return;
			
			self.handGrabPath_str = self.checkForAttribute(skinElement_el, "data-hand-drag-icon-path");
			if(!self.handGrabPath_str) return;
		
		
			var fullScreenNNPath_str = self.checkForAttribute(skinElement_el, "data-fullscreen-button-normal-normal-path");
			if(!fullScreenNNPath_str) return;
			
			var fullScreenNSPath_str = self.checkForAttribute(skinElement_el, "data-fullscreen-button-normal-selected-path");
			if(!fullScreenNSPath_str) return;
			
			var fullScreenFNPath_str = self.checkForAttribute(skinElement_el, "data-fullscreen-button-full-normal-path");
			if(!fullScreenFNPath_str) return;
			
			var fullScreenFSPath_str = self.checkForAttribute(skinElement_el, "data-fullscreen-button-full-selected-path");
			if(!fullScreenFSPath_str) return;
			
			var comboboxDownIconN_str = self.checkForAttribute(skinElement_el, "data-combobox-down-arrow-icon-normal-path");
			if(!comboboxDownIconN_str) return;
			
			var comboboxDownIconS_str = self.checkForAttribute(skinElement_el, "data-combobox-down-arrow-icon-selected-path");
			if(!comboboxDownIconS_str) return;
			
			var scrollBarTrackN_str = self.checkForAttribute(skinElement_el, "data-scrollbar-track-background-normal-path");
			if(!scrollBarTrackN_str) return;
			
			var scrollBarHandlerCenterBkN_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-background-normal-path");
			if(!scrollBarHandlerCenterBkN_str) return;
			
			var scrollBarHandlerCenterBkS_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-background-selected-path");
			if(!scrollBarHandlerCenterBkS_str) return;
			
			var scrollBarHandlerLeftN_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-left-normal-path");
			if(!scrollBarHandlerLeftN_str) return;
			
			var scrollBarHandlerLeftS_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-left-selected-path");
			if(!scrollBarHandlerLeftS_str) return;
			
			var scrollBarHandlerRightN_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-right-normal-path");
			if(!scrollBarHandlerRightN_str) return;
			
			var scrollBarHandlerRightS_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-right-selected-path");
			if(!scrollBarHandlerRightS_str) return;
			
			var scrollBarHandlerCenterIconN_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-center-icon-normal-path");
			if(!scrollBarHandlerCenterIconN_str) return;
			
			var scrollBarHandlerCenterIconS_str = self.checkForAttribute(skinElement_el, "data-scrollbar-handler-center-icon-selected-path");
			if(!scrollBarHandlerCenterIconS_str) return;
				
			var lighboxCloseButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-close-button-normal-path");
			if(!lighboxCloseButtonN_str) return;
			
			var lighboxCloseButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-close-button-selected-path");
			if(!lighboxCloseButtonS_str) return;
			
			var lighboxNextButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-next-button-normal-path");
			if(!lighboxNextButtonN_str) return;
			
			var lighboxNextButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-next-button-selected-path");
			if(!lighboxNextButtonS_str) return;
			
			var lighboxPrevButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-prev-button-normal-path");
			if(!lighboxPrevButtonN_str) return;
			
			var lighboxPrevButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-prev-button-selected-path");
			if(!lighboxPrevButtonS_str) return;
			
			var lighboxPlayButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-play-button-normal-path");
			if(!lighboxPlayButtonN_str) return;
			
			var lighboxPlayButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-play-button-selected-path");
			if(!lighboxPlayButtonS_str) return;
			
			var lighboxPauseButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-pause-button-normal-path");
			if(!lighboxPauseButtonN_str) return;
			
			var lighboxPauseButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-pause-button-selected-path");
			if(!lighboxPauseButtonS_str) return;
			
			var lighboxMaximizeButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-maximize-button-normal-path");
			if(!lighboxMaximizeButtonN_str) return;
			
			var lighboxMaximizeButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-maximize-button-selected-path");
			if(!lighboxMaximizeButtonS_str) return;
			
			var lighboxMinimizeButtonN_str = self.checkForAttribute(skinElement_el, "data-lightbox-minimize-button-normal-path");
			if(!lighboxMinimizeButtonN_str) return;
			
			var lighboxMinimizeButtonS_str = self.checkForAttribute(skinElement_el, "data-lightbox-minimize-button-selected-path");
			if(!lighboxMinimizeButtonS_str) return;
			
			var lighboxInfoButtonOpenN_str = self.checkForAttribute(skinElement_el, "data-lightbox-info-button-open-normal-path");
			if(!lighboxInfoButtonOpenN_str) return;
			
			var lighboxInfoButtonOpenS_str = self.checkForAttribute(skinElement_el, "data-lightbox-info-button-open-selected-path");
			if(!lighboxInfoButtonOpenS_str) return;
			
			var lighboxInfoButtonCloseN_str = self.checkForAttribute(skinElement_el, "data-lightbox-info-button-close-normal-path");
			if(!lighboxInfoButtonCloseN_str) return;
			
			var lighboxInfoButtonCloseS_str = self.checkForAttribute(skinElement_el, "data-lightbox-info-button-close-selected-path");
			if(!lighboxInfoButtonCloseS_str) return;
			
			//load skin graphics.
			self.graphicsPaths_ar.push(preloaderPath_str);
			self.graphicsPaths_ar.push(preloaderPath_str);
			self.graphicsPaths_ar.push(showMoreThumbsButtonNPath_str);
			self.graphicsPaths_ar.push(showMoreThumbsButtonPathS_str);
			self.graphicsPaths_ar.push(fullScreenNNPath_str);
			self.graphicsPaths_ar.push(fullScreenNSPath_str);
			self.graphicsPaths_ar.push(fullScreenFNPath_str);
			self.graphicsPaths_ar.push(fullScreenFSPath_str);
			self.graphicsPaths_ar.push(comboboxDownIconN_str);
			self.graphicsPaths_ar.push(comboboxDownIconS_str);;
			self.graphicsPaths_ar.push(scrollBarTrackN_str);
			self.graphicsPaths_ar.push(scrollBarHandlerCenterBkN_str);
			self.graphicsPaths_ar.push(scrollBarHandlerCenterBkS_str);
			self.graphicsPaths_ar.push(scrollBarHandlerLeftN_str);
			self.graphicsPaths_ar.push(scrollBarHandlerLeftS_str);
			self.graphicsPaths_ar.push(scrollBarHandlerRightN_str);
			self.graphicsPaths_ar.push(scrollBarHandlerRightS_str);
			self.graphicsPaths_ar.push(scrollBarHandlerCenterIconN_str);
			self.graphicsPaths_ar.push(scrollBarHandlerCenterIconS_str);
			self.graphicsPaths_ar.push(lighboxCloseButtonN_str);
			self.graphicsPaths_ar.push(lighboxCloseButtonS_str);
			self.graphicsPaths_ar.push(lighboxNextButtonN_str);
			self.graphicsPaths_ar.push(lighboxNextButtonS_str);
			self.graphicsPaths_ar.push(lighboxPrevButtonN_str);
			self.graphicsPaths_ar.push(lighboxPrevButtonS_str);
			self.graphicsPaths_ar.push(lighboxPlayButtonN_str);
			self.graphicsPaths_ar.push(lighboxPlayButtonS_str);
			self.graphicsPaths_ar.push(lighboxPauseButtonN_str);
			self.graphicsPaths_ar.push(lighboxPauseButtonS_str);
			self.graphicsPaths_ar.push(lighboxMaximizeButtonN_str);
			self.graphicsPaths_ar.push(lighboxMaximizeButtonS_str);
			self.graphicsPaths_ar.push(lighboxMinimizeButtonN_str);
			self.graphicsPaths_ar.push(lighboxMinimizeButtonS_str);
			self.graphicsPaths_ar.push(lighboxInfoButtonOpenN_str);
			self.graphicsPaths_ar.push(lighboxInfoButtonOpenS_str);
			self.graphicsPaths_ar.push(lighboxInfoButtonCloseN_str);
			self.graphicsPaths_ar.push(lighboxInfoButtonCloseS_str);
			self.graphicsPaths_ar.push(slideShowPreloaderPath_str);
			self.graphicsPaths_ar.push(self.imageIframePath_str);
			self.graphicsPaths_ar.push(self.imageIconPath_str);
			self.graphicsPaths_ar.push(self.videoIconPath_str);
			self.graphicsPaths_ar.push(self.linkIconPath_str);
			
			//Parse playlists!
			var allCat_ar = [];
			var allMedia_ar = [];
			var links_ar;
			var media_ar;
			var data_ar;
			var childKids_ar;
			var curUl_el;
			var obj = {};
			var child;
			var totalPlayLists = playlist_ar.length;
			var playListChildren_ar;
			var totalChildren;
			var mediaKid;
			var attributeMissing;
			var hasError_bl;
			var positionError;
			var playListPositionError;
			var catLabel;
			var totalInChildren;
			
			for(var i=0; i<totalPlayLists; i++){
				
				curUl_el = playlist_ar[i];
				data_ar = [];
				media_ar = [];
				playListChildren_ar = FWDUtils.getChildren(curUl_el);
				totalChildren = playListChildren_ar.length;
				
				for(var j=0; j<totalChildren; j++){
					obj = {};
					child = playListChildren_ar[j];
					childKids_ar = FWDUtils.getChildren(child);
					
					hasError_bl;
					attributeMissing = "";
					playListPositionError = i + 1;
					positionError = j + 1;
					totalInChildren = childKids_ar.length;
					
					//check for data-type attribute.
					hasError_bl = true;
					for(var k=0; k<totalInChildren; k++){
						attributeMissing = "data-type";
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-type")){
							hasError_bl = false;
							obj.mediaType = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-type"));
							break;
						}
					}
					
					if(hasError_bl){
						errorMessage_str = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the playlist number - <font color='#FFFFFF'>" + playListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the data playlist ul element.";
						self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
						return;
					}
					
					//check for data-url attribute.
					hasError_bl = true;
					for(var k=0; k<totalInChildren; k++){
						attributeMissing = "data-url";
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-url")){
							hasError_bl = false;
							mediaKid = childKids_ar[k];
							break;
						}
					}
					
					if(hasError_bl){
						errorMessage_str = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the playlist number - <font color='#FFFFFF'>" + playListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the data playlist ul element.";
						self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
						return;
					}
					
					//check for data-thumbnail-path attribute.
					hasError_bl = true;
					for(var k=0; k<totalInChildren; k++){
						attributeMissing = "data-thumbnail-path";
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-path")){
							hasError_bl = false;
							obj.thumbPath = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-thumbnail-path"));
							break;
						}
					}
					
					if(hasError_bl){
						errorMessage_str = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the playlist number - <font color='#FFFFFF'>" + playListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the data playlist ul element.";
						self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
						return;
					}
					
					//check for data-thumbnail-text attribute.
					if(self.thumbnailOverlayType_str == "text"){
						hasError_bl = true;
						for(var k=0; k<totalInChildren; k++){
							attributeMissing = "data-thumbnail-text";
							if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-text")){
								hasError_bl = false;
								obj.thumbText = childKids_ar[k].innerHTML;
								break;
							}
						}
						
						if(hasError_bl){
							errorMessage_str = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the playlist number - <font color='#FFFFFF'>" + playListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the data playlist ul element.";
							self.dispatchEvent(FWDData.LOAD_ERROR, {text:errorMessage_str});
							return;
						}
					}
					
					//set rainbow skin values
					for(var k=0; k<totalInChildren; k++){
						obj.thumbnailBkColor = undefined;
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-background-color")){
							obj.thumbnailBkColor = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-thumbnail-background-color"));
							break;
						}
					}
					
					for(var k=0; k<totalInChildren; k++){
						obj.thumbnailOverlayColor = undefined;
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-overlay-color")){
							obj.thumbnailOverlayColor = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-thumbnail-overlay-color"));
							break;
						}
					}
					
					for(var k=0; k<totalInChildren; k++){
						obj.borderNormalColor = undefined;
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-border-normal-color")){
							obj.borderNormalColor = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-thumbnail-border-normal-color"));
							break;
						}
					}
					
					for(var k=0; k<totalInChildren; k++){
						obj.borderSelectedColor = undefined;
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-thumbnail-border-selected-color")){
							obj.borderSelectedColor = FWDUtils.trim(FWDUtils.getAttributeValue(childKids_ar[k], "data-thumbnail-border-selected-color"));
							break;
						}
					}
					
					//set arrays for lightbox.
					var secondObj = {};
					secondObj.dataType = FWDUtils.trim(FWDUtils.getAttributeValue(mediaKid, "data-type"));
					secondObj.url = FWDUtils.trim(FWDUtils.getAttributeValue(mediaKid, "data-url"));
					secondObj.target = FWDUtils.getAttributeValue(mediaKid, "data-target");
					secondObj.width = FWDUtils.getAttributeValue(mediaKid, "data-width");
					secondObj.height = FWDUtils.getAttributeValue(mediaKid, "data-height");	
					secondObj.info = FWDUtils.getAttributeValue(mediaKid, "data-info");
					if(!secondObj.target) secondObj.target = "_blank";
					
					//check for data-info attribute.
					for(var k=0; k<totalInChildren; k++){
						if(FWDUtils.hasAttribute(childKids_ar[k], "data-info")){
							secondObj.infoText = childKids_ar[k].innerHTML;
							break;
						}
					}
					
					obj.secondObj = secondObj;
					data_ar[j] = obj;
					allCat_ar.push(obj);
					
					if(obj.mediaType == "iframe"){
						obj.thumbIconPath = self.imageIframePath_str;
						media_ar.push(secondObj);
						allMedia_ar.push(secondObj);
					}else if(obj.mediaType == "media"){
						var isImage = secondObj.url.indexOf(".jpg") != -1 
						|| secondObj.url.indexOf(".png") != -1
						|| secondObj.url.indexOf(".jpeg") != -1;
					
						if(isImage){
							obj.thumbIconPath = self.imageIconPath_str;
						}else{
							obj.thumbIconPath = self.videoIconPath_str;
						}
						media_ar.push(secondObj);
						allMedia_ar.push(secondObj);
					}else{
						obj.thumbIconPath = self.linkIconPath_str;
					}
				}
				
				self.categories_ar[i] = FWDUtils.getAttributeValue(curUl_el, "data-cat") || "not defined!";
				
				self.lightBox_ar[i] = media_ar;
				self.playList_ar[i] = data_ar;
			}
			
			if(self.categories_ar.length > 1) self.showComboBox_bl = true;
			
			if(self.showAllCategories_bl && self.showComboBox_bl){
				self.categories_ar.unshift(self.allCategoriesLabel_str);
				self.playList_ar.unshift(allCat_ar);
				self.lightBox_ar.unshift(allMedia_ar);
			}
			
			self.totalGraphics = self.graphicsPaths_ar.length;
			
			//Set the id for the category
			self.startAtCategory = self.props_obj.startAtCategory || 1;
			if(isNaN(self.startAtCategory)) self.startAtCategory = 1;
			if(self.startAtCategory <= 0) self.startAtCategory = 1;
			if(self.startAtCategory > totalPlayLists) self.startAtCategory = totalPlayLists;
			self.startAtCategory -=1;
			
			//Remove playlist element.
			try{
				self.rootElement_el.parentNode.removeChild(self.rootElement_el);
			}catch(e){}
			
			//Start to load skin.
			self.loadGraphics();
		};
		
		/* check if element with and attribute exists or throw error */
		this.checkForAttribute = function(e, attr){
			var test = FWDUtils.getChildFromNodeListFromAttribute(e, attr);
			test = test ? FWDUtils.trim(FWDUtils.getAttributeValue(test, attr)) : undefined;
			if(!test){
				self.dispatchEvent(FWDData.LOAD_ERROR, {text:"Element  with attribute <font color='#FFFFFF'>" + attr + "</font> is not defined."});
				return;
			}
			return test;
		};
		
		/* load buttons graphics */
		this.loadGraphics = function(){
		
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
			
			var imagePath = self.graphicsPaths_ar[self.countLoadedGraphics];
			
			self.image_img = new Image();
			self.image_img.onload = self.onImageLoadHandler;
			self.image_img.onerror = self.onImageLoadErrorHandler;
			self.image_img.src = imagePath;
		};
		
		this.onImageLoadHandler = function(e){
			
			if(self.countLoadedGraphics == 0){
				self.mainPreloader_img = self.image_img;
				self.dispatchEvent(FWDData.PRELOADER_LOAD_DONE);
			}else if(self.countLoadedGraphics == 1){
				self.lightboxPreloader_img = self.image_img;
			}else if(self.countLoadedGraphics == 2){
				self.showMoreThumbsButtonN_img = self.image_img;
			}else if(self.countLoadedGraphics == 3){
				self.showMoreThumbsButtonS_img = self.image_img;
			}else if(self.countLoadedGraphics == 4){
				self.fullScreenNN_img = self.image_img;
			}else if(self.countLoadedGraphics == 5){
				self.fullScreenNS_img = self.image_img;
			}else if(self.countLoadedGraphics == 6){
				self.fullScreenFN_img = self.image_img;
			}else if(self.countLoadedGraphics == 7){
				self.fullScreenFS_img = self.image_img;
			}else if(self.countLoadedGraphics == 8){
				self.comboboxUpArrowN_img = self.image_img;
			}else if(self.countLoadedGraphics == 9){
				self.comboboxUpArrowS_img = self.image_img;
			}else if(self.countLoadedGraphics == 10){
				self.scrollBarTrackN_img = self.image_img;
			}else if(self.countLoadedGraphics == 11){
				self.scrollBarHandlerCenterBkN_img = self.image_img;
			}else if(self.countLoadedGraphics == 12){
				self.scrollBarHandlerCenterBkS_img = self.image_img;
			}else if(self.countLoadedGraphics == 13){
				self.scrollBarHandlerLeftN_img = self.image_img;
			}else if(self.countLoadedGraphics == 14){
				self.scrollBarHandlerLeftS_img = self.image_img;
			}else if(self.countLoadedGraphics == 15){
				self.scrollBarHandlerRightN_img = self.image_img;
			}else if(self.countLoadedGraphics == 16){
				self.scrollBarHandlerRightS_img = self.image_img;
			}else if(self.countLoadedGraphics == 17){
				self.scrollBarHandlerCenterIconN_img = self.image_img;
			}else if(self.countLoadedGraphics == 18){
				self.scrollBarHandlerCenterIconS_img = self.image_img;
			}else if(self.countLoadedGraphics == 19){
				self.lightboxCloseButtonN_img = self.image_img;
			}else if(self.countLoadedGraphics == 20){
				self.lightboxCloseButtonS_img = self.image_img;
			}else if(self.countLoadedGraphics == 21){
				self.lightboxNextButtonN_img = self.image_img;
			}else if(self.countLoadedGraphics == 22){
				self.lightboxNextButtonS_img = self.image_img;
			}else if(self.countLoadedGraphics == 23){
				self.lightboxPrevButtonN_img = self.image_img;
			}else if(self.countLoadedGraphics == 24){
				self.lightboxPrevButtonS_img = self.image_img;
			}else if(self.countLoadedGraphics == 25){
				self.lightboxPlayN_img = self.image_img;
			}else if(self.countLoadedGraphics == 26){
				self.lightboxPlayS_img = self.image_img;
			}else if(self.countLoadedGraphics == 27){
				self.lightboxPauseN_img = self.image_img;
			}else if(self.countLoadedGraphics == 28){
				self.lightboxPauseS_img = self.image_img;
			}else if(self.countLoadedGraphics == 29){
				self.lightboxMaximizeN_img = self.image_img;
			}else if(self.countLoadedGraphics == 30){
				self.lightboxMaximizeS_img = self.image_img;
			}else if(self.countLoadedGraphics == 31){
				self.lightboxMinimizeN_img = self.image_img;
			}else if(self.countLoadedGraphics == 32){
				self.lightboxMinimizeS_img = self.image_img;
			}else if(self.countLoadedGraphics == 33){
				self.lightboxInfoOpenN_img = self.image_img;
			}else if(self.countLoadedGraphics == 34){
				self.lightboxInfoOpenS_img = self.image_img;
			}else if(self.countLoadedGraphics == 35){
				self.lightboxInfoCloseN_img = self.image_img;
			}else if(self.countLoadedGraphics == 36){
				self.lightboxInfoCloseS_img = self.image_img;
			}else if(self.countLoadedGraphics == 37){
				self.slideShowPreloader_img = self.image_img;
			}else if(self.countLoadedGraphics == 38){
				self.thumbIconWidth = self.image_img.width;
				self.thumbIconHeight = self.image_img.width;
			}

			
			self.countLoadedGraphics++;
			if(self.countLoadedGraphics < self.totalGraphics){
				self.loadImageId_to = setTimeout(self.loadGraphics, 16);
			}else{
				self.dispatchEvent(FWDData.LOAD_DONE);
			}
		};
		
		this.onImageLoadErrorHandler = function(e){
			var message = "The skin graphics with the label <font color='#FFFFFF'>" + self.graphicsPaths_ar[self.countLoadedGraphics] + "</font> can't be loaded, make sure that the image exists and the path is correct!";
			console.log(e);
			var err = {text:message};
			self.dispatchEvent(FWDData.LOAD_ERROR, err);
		};
		
		/*destroy */
		this.destroy = function(){
			
			clearTimeout(this.parseDelayId_to);
			clearTimeout(this.loadImageId_to);
			
			if(this.image_img){
				this.image_img.onload = null;
				this.image_img.onerror = null;
				this.image_img.src = null;
			}
			
			if(this.mainPreloader_img) this.mainPreloader_img.src = null;
			if(this.lightboxPreloader_img) this.lightboxPreloader_img.src = null;
			if(this.slideShowPreloader_img) this.slideShowPreloader_img.src = null;
			if(this.showMoreThumbsButtonN_img) this.showMoreThumbsButtonN_img.src = null;
			if(this.showMoreThumbsButtonS_img) this.showMoreThumbsButtonS_img.src = null;
			if(this.fullScreenNN_img) this.fullScreenNN_img.src = null;
			if(this.fullScreenNS_img) this.fullScreenNS_img.src = null;
			if(this.fullScreenFN_img) this.fullScreenFN_img.src = null;
			if(this.fullScreenFS_img) this.fullScreenFS_img.src = null;
			if(this.comboboxUpArrowN_img) this.comboboxUpArrowN_img.src = null;
			if(this.comboboxUpArrowS_img) this.comboboxUpArrowS_img.src = null;
			if(this.scrollBarTrackN_img) this.scrollBarTrackN_img.src = null;
			if(this.scrollBarHandlerCenterBkN_img) this.scrollBarHandlerCenterBkN_img.src = null;
			if(this.scrollBarHandlerCenterBkS_img) this.scrollBarHandlerCenterBkS_img.src = null;
			if(this.scrollBarHandlerLeftN_img) this.scrollBarHandlerLeftN_img.src = null;
			if(this.scrollBarHandlerLeftS_img) this.scrollBarHandlerLeftS_img.src = null;
			if(this.scrollBarHandlerRightN_img) this.scrollBarHandlerRightN_img.src = null;
			if(this.scrollBarHandlerRightS_img) this.scrollBarHandlerRightS_img.src = null;
			if(this.scrollBarHandlerCenterIconN_img) this.scrollBarHandlerCenterIconN_img.src = null;
			if(this.scrollBarHandlerCenterIconS_img) this.scrollBarHandlerCenterIconS_img.src = null;
			if(this.lightboxCloseButtonN_img) this.lightboxCloseButtonN_img.src = null;
			if(this.lightboxCloseButtonS_img) this.lightboxCloseButtonS_img.src = null;
			if(this.lightboxNextButtonN_img) this.lightboxNextButtonN_img.src = null;
			if(this.lightboxNextButtonS_img) this.lightboxNextButtonS_img.src = null;
			if(this.lightboxPrevButtonN_img) this.lightboxPrevButtonN_img.src = null;
			if(this.lightboxPrevButtonS_img) this.lightboxPrevButtonS_img.src = null;
			if(this.lightboxPlayN_img) this.lightboxPlayN_img.src = null;
			if(this.lightboxPlayS_img) this.lightboxPlayS_img.src = null;
			if(this.lightboxPauseN_img) this.lightboxPauseN_img.src = null;
			if(this.lightboxPauseS_img) this.lightboxPauseS_img.src = null;
			if(this.lightboxMaximizeN_img) this.lightboxMaximizeN_img.src = null;
			if(this.lightboxMaximizeS_img) this.lightboxMaximizeS_img.src = null;
			if(this.lightboxMinimizeN_img) this.lightboxMinimizeN_img.src = null;
			if(this.lightboxMinimizeS_img) this.lightboxMinimizeS_img.src = null;
			if(this.lightboxInfoOpenN_img) this.lightboxInfoOpenN_img.src = null;
			if(this.lightboxInfoOpenS_img) this.lightboxInfoOpenS_img.src = null;
			if(this.lightboxInfoCloseN_img) this.lightboxInfoCloseN_img.src = null;
			if(this.lightboxInfoCloseS_img) this.lightboxInfoCloseS_img.src = null;
			
			
			
			this.mainPreloader_img = null;
			this.lightboxPreloader_img = null;
			this.slideShowPreloader_img = null;
			this.showMoreThumbsButtonN_img = null;
			this.showMoreThumbsButtonS_img = null;
			this.fullScreenNN_img = null; 
			this.fullScreenNS_img = null; 
			this.fullScreenFN_img = null; 
			this.fullScreenFS_img = null;
			this.comboboxUpArrowN_img = null;
			this.comboboxUpArrowS_img = null;
			this.scrollBarTrackN_img = null;
			this.scrollBarHandlerCenterBkN_img = null;
			this.scrollBarHandlerCenterBkS_img = null;
			this.scrollBarHandlerLeftN_img = null;
			this.scrollBarHandlerLeftS_img = null;
			this.scrollBarHandlerRightN_img = null;
			this.scrollBarHandlerRightS_img = null;
			this.scrollBarHandlerCenterIconN_img = null;
			this.scrollBarHandlerCenterIconS_img = null;
			this.lightboxCloseButtonN_img = null;
			this.lightboxCloseButtonS_img = null;
			this.lightboxNextButtonN_img = null;
			this.lightboxNextButtonS_img = null;
			this.lightboxPrevButtonN_img = null;
			this.lightboxPrevButtonS_img = null;
			this.lightboxPlayN_img = null;
			this.lightboxPlayS_img = null;
			this.lightboxPauseN_img = null;
			this.lightboxPauseS_img = null;
			this.lightboxMaximizeN_img = null;
			this.lightboxMaximizeS_img = null;
			this.lightboxMinimizeN_img = null;
			this.lightboxMinimizeS_img = null;
			this.lightboxInfoOpenN_img = null;
			this.lightboxInfoOpenS_img = null;
			this.lightboxInfoCloseN_img = null;
			this.lightboxInfoCloseS_img = null;
			
			this.props_obj = null;
			this.rootElement_el = null;
			this.graphicsPaths_ar = null;
			this.skin_ar = null;
			this.playList_ar = null;
			this.lightBox_ar = null;
			this.categories_ar = null;
			
			prototype.destroy();
			self = null;
			prototype = null;
			FWDData.prototype = null;
		};
		
		this.init();
	};
	
	/* set prototype */
	FWDData.setPrototype = function(){
		FWDData.prototype = new FWDEventDispatcher();
	};
	
	FWDData.prototype = null;
	FWDData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDData.LOAD_DONE = "onLoadDone";
	FWDData.LOAD_ERROR = "onLoadError";
	
	window.FWDData = FWDData;
}(window));