/**
 * @author jmckim
 */

var logger ={
	log:function(s){
		if (console){
			console.log(s);
		}
	}
}
var mathutil = {
	translateRange : function(nIn, min1, max1, min2, max2) {
		return (((max2 - min2) / (max1 - min1)) * (nIn - min1)) + min2;
	},
	clamp : function(nIn, nMin, nMax) {
		var n = nIn;
		if(nMax > nMin) {
			n = (nIn > nMax) ? nMax : nIn;
			n = (nIn < nMin) ? nMin : n;
			return n;
		} else {
			return n;
		}
	}
}

/* *********************************** Carousel *********************************** */
    function initCarousel(this_carousel) {
        current_carousel_page = 1;
        $(this_carousel).prev('.carousel_pager').find('li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
        $(this_carousel).css('left',0);

	    $('.carousel_wrapper').mousedown(function() {
	        stopCarousel();
	    });
	
	    $('.carousel_wrapper').draggable({
	        scroll: false,
			axis: 'x',
			start: function(event, ui) {
				content_position_left = $(this).position().left;
				content_width = $(this).width();
				// clearInterval(carousel_timer);
			},
			drag: function(event, ui) {
			},
			stop: function(event, ui) {
				slider_delta_left =  $(this).position().left-content_position_left;
				// console.log('current_carousel_page: '+current_carousel_page+'\ncontent_width: '+content_width+'\ncontent_position_left: '+content_position_left+'\ndevice_width: '+device_width+'\nslider_delta_left: '+slider_delta_left)
				// If dragged to the right further than halfway
				if ((slider_delta_left > 0) && (slider_delta_left > (device_width/4)) && (content_position_left < 0)) {				
					$(this)
			        	.animate(
							{ left: content_position_left+device_width },
							{ duration: swipe_duration/2
					});
					current_carousel_page--;
				// If dragged to the left further than halfway
				} else if ((slider_delta_left < 0) && (slider_delta_left < ((device_width/4)*-1)) && ((content_width+content_position_left) > device_width)) {
					$(this)
			        	.animate(
							{ left: content_position_left-device_width },
							{ duration: swipe_duration/2
					});
					current_carousel_page++;
				// Else bounce back to start position
				} else {
					$(this)
			        	.animate(
							{ left: content_position_left },
							{ duration: swipe_duration/2
			            });
				};
				$(this).prev('.carousel_pager').find('li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
			}
		});

    };

    function startCarousel(this_carousel) {
        carousel_timer = setInterval(function() {
            content_position_left = $(this_carousel).position().left;
            content_width = $(this_carousel).width();
            doCarousel(this_carousel);
        }, carousel_duration);
    };

    function doCarousel(this_carousel) {
        if ((content_width+content_position_left)-device_width >= device_width) {
            $(this_carousel)
                .animate(
                    { left: content_position_left-device_width },
                    { duration: swipe_duration
            });
            current_carousel_page++;
            $(this_carousel).prev('.carousel_pager').find('li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
        } else stopCarousel();
    };

    function stopCarousel() {
        clearInterval(carousel_timer);
    };



/* *********************************** Bodystyle Selector *********************************** */

var bodystyle_selector = {
	series:'',
	bodystyle:'',
	bodystyleId:'',
	namodelcode:'',
	originid:'',
	contentHeight:0,
	btnHeight:300,
	dragBuffer:150,
	currentContentNode:{},
	ydelta:0,
	lasty:0,
	releaseTimer:-1,
	dragLimit:0,
	init:function(){
		
		$('.bodystyle_select_series').click(function(){
			$('#bodystyle_navcontainer').show();
			bodystyle_selector.showBodyStylesBySeries($(this).attr('data-seriesid'));
		});
		
		$('#bodystyle_selector .tray_backbutton').click(function(){
			bodystyle_selector.bodystyle = '';
			bodystyle_selector.closeSelector();
		});
		$('.bodystyle_selector_thumb').click(function(){
			
			if ($('#bodystyle_content_container').attr('dragging')!='true'){
			bodystyle_selector.bodystyle = $(this).attr('data-bodystyle');
			bodystyle_selector.bodystyleId = $(this).attr('data-bodystyleId');
			bodystyle_selector.namodelcode = $(this).attr('data-namodelcode');
			
			NaModelCode = bodystyle_selector.namodelcode;
			
			switch (bodystyle_selector.originid){
				case 'vehicles':
					//logger.log('showing vehicle');
					$('.modal').hide();
					$('.page').hide();
					$('#nav_lines').hide();
					$('#overview').show();
					bodystyle_selector.closeSelector();
					model_selector.closeSelector();
					loadModelOverview(bodystyle_selector.bodystyleId);
	                initCarousel('#overview .carousel_wrapper');
	                startCarousel('#overview .carousel_wrapper');					updateTitle(bodystyle_selector.series + ' ' + bodystyle_selector.bodystyle + 's');
				break;
				case 'build':
					//logger.log('showing build');
					loadModels(bodystyle_selector.bodystyleId);
					model_selector.init();
				break;
				case 'compare':
					//logger.log('showing compare');
					loadModels(bodystyle_selector.bodystyleId);
					model_selector.init();
					compare_active = true;
				break;
			}
			} else {
				//logger.log("bailing because we're dragging.");
			}
		})
		
		//$('.selector_thumb').css('background-size',window.device_width+'px '+);
	},
	
	showBodyStylesBySeries:function(seriesId,origin){
		this.series = seriesId;
		//this.originid = origin;
		$('#bodystyle_content_container').html('');
		this.currentContentNode = $(".bodystyles[data-series='" + seriesId + "']").clone(true);
		this.currentContentNode.css('display','block');
		$(".bodystyles[data-series!='" + seriesId + "']").css('display','none');
		
		$('#bodystyle_content_container').append(this.currentContentNode);
		
		$('#bodystyle_navcontainer >h1').html(seriesId);
		//insert it into a div and pop the modal....
		
		
		this.openSelector();
	},
	openSelector:function(){
		$('#bodystyle_content_container').css('top',44);
		$('#bodystyle_selector').css('display','block');
		$('#bodystyle_selector').animate({top:0},500,function(){});
		bodystyle_selector.contentHeight = this.currentContentNode.children().length*bodystyle_selector.btnHeight;
		
		bodystyle_selector.dragLimit = 44-(bodystyle_selector.contentHeight+window.device_height);
		$('#bodystyle_content_container').draggable({
            axis: 'y',
            scroll: false,
            // containment: [tray_width*-1, 0, 0, 0],
            // start and stop. We add in the momentum functions here.
            start: function(e, ui) {
                //dragMenu.start(this.id, e.clientX, e.clientY, e.timeStamp);
                $('#bodystyle_content_container').stop();
                $('#bodystyle_content_container').attr('dragging','true');
                
            },
            drag: function(e, ui) {
            	//logger.log('-'+$('#bodystyle_content_container').css('top')+"|||"+selector.dragLimit);
            	var newy=parseInt($('#bodystyle_content_container').css('top'));
            	bodystyle_selector.ydelta = Math.abs(newy-bodystyle_selector.lasty);
            	bodystyle_selector.lasty = newy;

            	
            	if (newy<bodystyle_selector.dragLimit-bodystyle_selector.dragBuffer){
            		//$('#bodystyle_content_container').trigger('mouseup');

            	}
            	if (newy>44+bodystyle_selector.dragBuffer){
            		//$('#bodystyle_content_container').trigger('mouseup');
            		
            	}
            },
            stop: function(e, ui) {
                //dragMenu.end(this.id, e.clientX, e.clientY, e.timeStamp);
                 //$('#content_container').attr('dragging','false');
                 
                 //calculate new y...., animate to based on last delta (as momentum).
                 //will be 44+ some divisor of 300...
                var newy=parseInt($('#bodystyle_content_container').css('top'));
				var targety=1000;
				if (newy<bodystyle_selector.dragLimit){
					
					bodystyle_selector.easeToDragTarget(bodystyle_selector.dragLimit);
					return;
				}
				clearTimeout(bodystyle_selector.releaseTimer);
				bodystyle_selector.releaseTimer =  setTimeout('bodystyle_selector.releasedragging();',100);
				if (newy>(44)){
					
					bodystyle_selector.easeToDragTarget(44);
					return;
				}
				
				var buttonRemainder= newy%bodystyle_selector.btnHeight;
				var closestmult  = Math.floor(newy/bodystyle_selector.btnHeight)+1;
				
				
				if (bodystyle_selector.ydelta<8){
					//if pretty slow, pick nearest to snap up or down.
					closestmult = (Math.abs(buttonRemainder)>(bodystyle_selector.btnHeight/2)) ? closestmult-1 : closestmult;
				} else {
					//if even a little fast, go to the next logical one in current direction.
					closestmult = (newy<bodystyle_selector.lasty) ? closestmult-1 : closestmult;
				}
				
				//don't hide the last car when moving up.
				closestmult = (Math.abs((closestmult*bodystyle_selector.btnHeight))==bodystyle_selector.contentHeight) ? closestmult+1 : closestmult;
		
				//logger.log('selector.contentHeight'+selector.contentHeight+"|||"+$('.bodystyles').children().length);
				
				bodystyle_selector.easeToDragTarget((closestmult*bodystyle_selector.btnHeight)+44);
            } 
         });
		//not sure how to add the handlers for scrolling.
		
		
	},
	releasedragging:function(){
		clearTimeout(bodystyle_selector.releaseTimer);
		bodystyle_selector.releaseTimer = -1;
		$('#bodystyle_content_container').attr('dragging','false');
	},
	easeToDragTarget:function(targety){
		//animation time will be an inverse of the last delta,translated to 500-1500 ms.
		//$('#content_container').attr('dragging','false');
		var time = mathutil.translateRange(bodystyle_selector.ydelta,1,25,800,250);
		//time = 250;
		$('#bodystyle_content_container').stop().animate({top:targety},time,function(){
			$('#bodystyle_content_container').attr('dragging','false');
		})
	},
	closeSelector:function(){
		$('#bodystyle_selector').animate({top:window.device_height},500,function(){
			$('#bodystyle_selector').css('display','none');
		});
	},
	clear:function(){
		this.currentContentNode.css('display','none');
		$('#bodystyle_content_container').css('top',44);
	}

}


/* *********************************** Model Selector *********************************** */

var model_selector = {
	bodystyle:'',
	model:'',
	namodelcode:'',
	originid:'',
	contentHeight:0,
	btnHeight:300,
	dragBuffer:150,
	currentContentNode:{},
	ydelta:0,
	lasty:0,
	releaseTimer:-1,
	dragLimit:0,
	init:function(){

		$('#model_navcontainer').show();
		model_selector.showModels($(this).attr('data-bodystyle'));
		
		$('#model_selector .tray_backbutton').click(function(){
			model_selector.model = '';
			model_selector.closeSelector();
		});
		$('.model_selector_choice').click(function(){
			
			if ($('#model_content_container').attr('dragging')!='true'){
			model_selector.model = $(this).attr('data-model');
			model_selector.namodelcode = $(this).attr('data-namodelcode');
			NaModelCode = $(this).attr('data-namodelcode');
			
			//do whatever is supposed to happen...
			//logger.log('model selected!'+selector.originid+" | "+selector.series+"  |  "+selector.namodelcode);

			NaModelCode = model_selector.namodelcode;
			
			switch (bodystyle_selector.originid){
				case 'build':
					//logger.log('showing build');
					$('.modal').hide();
					$('.page').hide();
					$('#nav_lines').hide();
					$('#build_your_own').show();
					bodystyle_selector.closeSelector();
					model_selector.closeSelector();
					loadBuild_initialConfig();
					$('#byo_touchpad').show();
					updateTitle('Build Your Own');
				break;
				case 'compare':
					//logger.log('showing compare');
					$('.modal').hide();
					$('.page').hide();
					$('#nav_lines').hide();
					bodystyle_selector.closeSelector();
					model_selector.closeSelector();
					loadCompare();
					$('#compare').fadeIn(500);
					initCarousel('#compare .carousel_wrapper');
					updateTitle('Compare');
					updateURL('compare');
					compare_active = true;
				break;
			}
			} else {
				//logger.log("bailing because we're dragging.");
			}
		})
		
		//$('.selector_thumb').css('background-size',window.device_width+'px '+);
	},
	
	showModels:function(bodystyleId){
		this.bodystyle = bodystyleId;
		//this.originid = origin;
		this.currentContentNode = $(".models[data-bodystyle='" + bodystyleId + "']").clone(true);
		this.currentContentNode.css('display','block');
		$(".models[data-series!='" + bodystyleId + "']").css('display','none');
		
		$('#model_content_container').append(this.currentContentNode);
		
		$('#model_navcontainer >h1').html(bodystyleId);
		//insert it into a div and pop the modal....
		this.openSelector();
	},
	openSelector:function(){
		$('#model_content_container').css('top',44);
		$('#model_selector').css('display','block');
		$('#model_selector').animate({top:0},500,function(){});
		model_selector.contentHeight = this.currentContentNode.children().length*model_selector.btnHeight;
		
		model_selector.dragLimit = 44-(model_selector.contentHeight+window.device_height);
		$('#model_content_container').draggable({
            axis: 'y',
            scroll: false,
            // containment: [tray_width*-1, 0, 0, 0],
            // start and stop. We add in the momentum functions here.
            start: function(e, ui) {
                //dragMenu.start(this.id, e.clientX, e.clientY, e.timeStamp);
                $('#model_content_container').stop();
                $('#model_content_container').attr('dragging','true');
                
            },
            drag: function(e, ui) {
            	//logger.log('-'+$('#content_container').css('top')+"|||"+selector.dragLimit);
            	var newy=parseInt($('#model_content_container').css('top'));
            	model_selector.ydelta = Math.abs(newy-model_selector.lasty);
            	model_selector.lasty = newy;
            	if (newy<model_selector.dragLimit-model_selector.dragBuffer){
            		//$('#content_container').trigger('mouseup');
            	}
            	if (newy>44+model_selector.dragBuffer){
            		//$('#content_container').trigger('mouseup');
            	}
            },
            stop: function(e, ui) {
                //dragMenu.end(this.id, e.clientX, e.clientY, e.timeStamp);
                 //$('#content_container').attr('dragging','false');
                 
                 //calculate new y...., animate to based on last delta (as momentum).
                 //will be 44+ some divisor of 300...
                var newy=parseInt($('#model_content_container').css('top'));
				var targety=1000;
				if (newy<model_selector.dragLimit){
					
					model_selector.easeToDragTarget(model_selector.dragLimit);
					return;
				}
				clearTimeout(model_selector.releaseTimer);
				model_selector.releaseTimer =  setTimeout('model_selector.releasedragging();',100);
				if (newy>(44)){
					
					model_selector.easeToDragTarget(44);
					return;
				}
				
				var buttonRemainder= newy%model_selector.btnHeight;
				var closestmult  = Math.floor(newy/model_selector.btnHeight)+1;
				
				
				if (model_selector.ydelta<8){
					//if pretty slow, pick nearest to snap up or down.
					closestmult = (Math.abs(buttonRemainder)>(model_selector.btnHeight/2)) ? closestmult-1 : closestmult;
				} else {
					//if even a little fast, go to the next logical one in current direction.
					closestmult = (newy<model_selector.lasty) ? closestmult-1 : closestmult;
				}
				
				//don't hide the last car when moving up.
				closestmult = (Math.abs((closestmult*model_selector.btnHeight))==model_selector.contentHeight) ? closestmult+1 : closestmult;
		
				//logger.log('selector.contentHeight'+selector.contentHeight+"|||"+$('.bodystyles').children().length);
				
				model_selector.easeToDragTarget((closestmult*model_selector.btnHeight)+44);
            } 
         });
		//not sure how to add the handlers for scrolling.
	},
	releasedragging:function(){
		clearTimeout(model_selector.releaseTimer);
		model_selector.releaseTimer = -1;
		$('#model_content_container').attr('dragging','false');
	},
	easeToDragTarget:function(targety){
		//animation time will be an inverse of the last delta,translated to 500-1500 ms.
		//$('#content_container').attr('dragging','false');
		var time = mathutil.translateRange(model_selector.ydelta,1,25,800,250);
		//time = 250;
		$('#model_content_container').stop().animate({top:targety},time,function(){
			$('#model_content_container').attr('dragging','false');
		})
	},
	closeSelector:function(){
		$('#model_selector').animate({top:window.device_height},500,function(){
			$('#model_selector').css('display','none');
		});
	},
	clear:function(){
		this.currentContentNode.css('display','none');
		$('#model_content_container').css('top',44);
	}

}


