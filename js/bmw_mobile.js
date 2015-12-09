/*
	Project:	BMW Mobile Redesign
	Agency:		KBS+ | Kirshenbaum Bond Senecal + Partners
	Developers:	Tom Sunshine, Ben Ratliff
	Designer:	Chad O'Connell
	Producer:	Gabriela Cid
*/

/* *********************************** Initialize variables *********************************** */
jQuery.fx.off = false;
// var asset_path = 'http://content.bmwusa.com/microsite/[insert folder here]/';
var asset_path = 'images/';

var current_row = '1';
var current_col = '2';
var current_model = '2';
var changed_hash = false;
var number_cols = 9

var current_carousel_page = 1;
var carousel_timer;
var content_position_left = 0;
var content_position_top = 0;
var touch_startX = 0;
var touch_startY = 0;
var slider_delta_left = 0;
var slider_delta_top= 0;
var content_width = 0;

var menu_open = false;
var menu_dragging = false;
var tray_dragging = false;
var overview_open = false;
var back_menu = false;
var menu_open_gap = 100;
var menu_offset = 0;
var notch_offset = 0;

var swipe_direction = '';
var swipe_duration = 500;
var carousel_duration = 3000;
var swipe_easing_bounce = 'easeOutBounce';
// var swipe_easing_smooth = 'linear';
var swipe_sensitivity = 3;
var byo_swipe_sensitivity = 50;
var swipe_easing_smooth = 'easeOutExpo';
var swipe_distance_x = 40;
var swipe_distance_y = 20;

var byo_rotation_amount = 45;
var materials_tray_momentum = 500;
var materials_tray_easing = 'easeOutExpo';
var byo_menu_open = false;

var device_width = $(window).width();
var device_height = $(window).height();
var byo_stage_height = 0;
var NaModelCode = '133N';

var compare_active = false;

var basePageName = "us:standard:content:experience:[CHANGE THIS]";
var btnid = '';
var clickid = '';

function updateURL(hash) {
    changed_hash = true;
    location.hash = hash;
};

var mapTimer;

/* *********************************** Geolocation Function *********************************** */	
	function getLocation()
	  {

	  if (navigator.geolocation)
		{
		navigator.geolocation.getCurrentPosition(showPosition,showError);
		}
	  else{alert("Geolocation is not supported by this browser.");}
	  }
	function showPosition(position)
	  {  
	  console.log("Latitude: " + position.coords.latitude + 
	  "<br />Longitude: " + position.coords.longitude)
	  SelectPMAFromGeoLocation(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
	  
	  }
	function showError(error)
	  {
	  switch(error.code) 
		{
		case error.PERMISSION_DENIED:
		  //alert("User denied the request for Geolocation.")
		  break;
		case error.POSITION_UNAVAILABLE:
		  alert("Location information is unavailable.")
		  break;
		case error.TIMEOUT:
		  //alert("The request to get user location timed out.")
		  break;
		case error.UNKNOWN_ERROR:
		  alert("An unknown error occurred.")
		  break;
		}
	  }



$(document).ready(function() {
	
	/* *********************************** Browser detection *********************************** */
	
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
	var isAndroid = navigator.userAgent.toLowerCase().indexOf("android")>-1;
	var isBlackberry = navigator.userAgent.toLowerCase().indexOf('blackberry')>0;
	// alert('iPad: '+isiPad+'\niPhone: '+isiPhone+'\nAndroid: '+isAndroid+'\nBlackberry: '+isBlackberry)

	function removeURLbar() {
		// constructGrid();
		if (navigator.userAgent.toLowerCase().indexOf('blackberry')>0) {
			window.scrollTo(0,40)
		} else {
			window.scrollTo(0,1);
		};
	};

	function updateCurrentStatus(pageID) {
			var page = $(pageID).attr('id');
			current_col = page.substring(5,6);
			current_row = page.substring(7,8);
	};

	function updateTitle(title) {
		$('#header h1').fadeOut(0, function() {
			$(this).html(title).fadeIn(0);
		});
	};

	function moveNotch() {
		var nav_item_left = parseInt($('#nav_lines li').eq(current_col-1).position().left-487);
		switch(current_col) {
			case 1:
				notch_offset = 1;
				break;
			case 2:
				notch_offset = 0;
				break;
			case 3:
				notch_offset = 0;
				break;
			case 4:
				notch_offset = 0;
				break;
			case 5:
				notch_offset = 0;
				break;
			case 6:
				notch_offset = 1;
				break;
			case 7:
				notch_offset = 4;
				break;
			case 8:
				notch_offset = 3;
				break;
			case 9:
				notch_offset = 21;
				break;
		};
		// console.log(current_col, notch_offset);
		$('#nav_lines').stop().animate({'background-position': nav_item_left+notch_offset+'px bottom'});		
	};

	function updateLines() {
		$('#nav_lines li').removeClass('active');
		$('#nav_lines li').eq(current_col-1).addClass('active');
		moveNotch();
	};
	

	/* *********************************** Hash change *********************************** */
	$(window).hashchange(function(e) {
	    if (changed_hash) {
	        changed_hash = false;
	        return;
        };
        if (menu_open) {
            $('#nav_lines').css('left',0);
            menuOpen(false);
        };
		var hash = location.hash.slice(1);
		var hash2 = location.hash.slice(1,9);

		if (hash2=='vehicle-') {
			var hash3 = location.hash.slice(9);
			current_col = location.hash.split('-')[1];
			current_row = location.hash.split('-')[2];

			$('#nav_lines').fadeIn(500);
			var newLeft = (device_width*current_col)-device_width;
			var newTop = (device_height*current_row)-device_height;
			// console.log(newLeft);
			$('#grid .page').show();
			updateTitle('Vehicles');
			updateLines();
			if (newLeft<0) {
				$('.modal').hide();
				$('#grid')
		        	.animate(
						{ left: 0,
						  top: 0 },
						{ duration: swipe_duration, easing: swipe_easing_smooth 
					});
				current_col = 1;
			} else {
				$('.modal').hide();
				$('#grid')
		        	.animate(
						{ left: '-'+((device_width*current_col)-device_width)+'px' },
						{ duration: swipe_duration, easing: swipe_easing_smooth 
					});
				$('#grid #col-'+current_col)
		        	.animate(
						{ top: '-'+((device_height*current_row)-device_height)+'px' },
						{ duration: swipe_duration, easing: swipe_easing_smooth 
					});
			};
		} else {
			switch (hash) {
			case '':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				loadFMA();
				$('#home').show();
                initCarousel('#home .carousel_wrapper');
                startCarousel('#home .carousel_wrapper');
				updateTitle('Homepage');
				break;
			case 'home':
                $('.modal').hide();
                $('.page').hide();
                $('#nav_lines').hide();
                $('#home').show();
                loadFMA();
                initCarousel('#home .carousel_wrapper');
                startCarousel('#home .carousel_wrapper');
                updateTitle('Homepage');
				break;
			case 'vehicles':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').show();
				$('#grid .page').show();
				$('#grid')
		        	.css('left',0)
		        	.css('top',0);
				current_col = 2;
				current_row = 1;
				loadLines();
				loadVehicles();
				constructGrid();
				bodystyle_selector.init();
				$('#nav_lines').css('background-position', parseInt($('#nav_lines li').eq(current_col-1).position().left-487+'px bottom'));		
				updateTitle('Vehicles');
				break;
			case 'overview':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#overview').show();
                initCarousel('#overview .carousel_wrapper');
                startCarousel('#overview .carousel_wrapper');
				updateTitle('Overview');
				break;
			case 'build':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#build_your_own').show();
				loadBuild_initialConfig();
				$('#byo_touchpad').show();
				updateTitle('Build Your Own');
				break;
			case 'offers':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#offers').show();
				updateTitle('Special Offers');
				loadSO();
				break;
			case 'compare':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				loadCompare();
				$('#compare').show();
				updateTitle('Compare');
				compare_active = true;
				break;
			case 'dealer_locator':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#dealer_locator').show();
				updateTitle('Dealer Locator');
				break;
			case 'newsfeed':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#newsfeed').show();
			    loadNews();
				updateTitle('Newsfeed');
				break;
			case 'owners':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#owners').show();
			    loadOwners();
				updateTitle('Owners');
				break;
			case 'enthusiasts':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#enthusiasts').show();
				updateTitle('Enthusiasts');
				break;
			case 'applications':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#applications').show();
				updateTitle('Applications');
				break;
			case 'cpo':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#cpo').show();
				updateTitle('CPO');
				break;
			case 'finance':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#finance').show();
				updateTitle('BMW Financial Services');
				break;
			case 'join_us':
				$('.modal').hide();
				$('.page').hide();
				$('#nav_lines').hide();
				$('#join_us').show();
				updateTitle('Join Us');
				break;
			};
			updateLines();
		};
	});
	
	/* *********************************** Menu *********************************** */
	$('#menu li').click(function() {
		compare_active = false;
		if (menu_dragging) { menu_dragging = false; return; };
		menuOpen(false);
		var menu_selection = $('#menu li').index(this);
		$('#menu li').each(function(index) {
			$(this).removeClass('active');
		});
		$(this).addClass('active');
		if (menu_selection == 0) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			loadFMA();
			$('#home').fadeIn(500);
			initCarousel('#home .carousel_wrapper');
			startCarousel('#home .carousel_wrapper');
			updateTitle('Homepage');
			updateURL('home');
		} else if (menu_selection == 1) {
			bodystyle_selector.originid = 'vehicles';
			$('.modal').hide();
			$('.page').hide();
			$('#grid .page').fadeIn(500);
			$('#touchpad').show();
			loadLines();
			loadVehicles();
			constructGrid();
			bodystyle_selector.init();
			$('#grid')
	        	.animate(
					{ left: '-'+((device_width*current_col)-device_width),
					  top: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			current_row = 1;
            $('#nav_lines')
                .show()
                .css('background-position', parseInt($('#nav_lines li').eq(current_col-1).position().left-487)+'px bottom')
                .animate({'left': 0}, {duration: swipe_duration, easing: swipe_easing_smooth});
			updateTitle('Vehicles');
			updateURL('vehicles');
			updateLines();
		} else if (menu_selection == 2) {
			bodystyle_selector.originid = 'build';
			$('.modal').hide();
			$('.page').hide();
			$('#grid .page').fadeIn(500);
			$('#touchpad').show();
			loadLines();
			loadVehicles();
			constructGrid();
			bodystyle_selector.init();
			$('#grid')
	        	.animate(
					{ left: '-'+((device_width*current_col)-device_width),
					  top: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			current_row = 1;
            $('#nav_lines')
                .show()
                .css('background-position', parseInt($('#nav_lines li').eq(current_col-1).position().left-487)+'px bottom')
                .animate({'left': 0}, {duration: swipe_duration, easing: swipe_easing_smooth});
			updateTitle('Vehicles');
			updateURL('vehicles');
			updateLines();
		} else if (menu_selection == 3) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#offers').fadeIn(500);
            initCarousel('#offers .carousel_wrapper');
            startCarousel('#offers .carousel_wrapper');
			updateTitle('Special Offers');
			updateURL('offers');
			//loadSO();
		} else if (menu_selection == 4) {
			bodystyle_selector.originid = 'compare';
			$('.modal').hide();
			$('.page').hide();
			$('#grid .page').fadeIn(500);
			$('#touchpad').show();
			loadLines();
			loadVehicles();
			constructGrid();
			bodystyle_selector.init();
			$('#grid')
	        	.animate(
					{ left: '-'+((device_width*current_col)-device_width),
					  top: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			current_row = 1;
            $('#nav_lines')
                .show()
                .css('background-position', parseInt($('#nav_lines li').eq(current_col-1).position().left-487)+'px bottom')
                .animate({'left': 0}, {duration: swipe_duration, easing: swipe_easing_smooth});
			updateTitle('Vehicles');
			updateURL('vehicles');
			updateLines();
		} else if (menu_selection == 5) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#dealer_locator').fadeIn(500);
			updateTitle('Dealer Locator');
			updateURL('dealer_locator');
			var mapTimer=setTimeout(InitializeMap,500);
			getLocation();
		} else if (menu_selection == 6) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#newsfeed').fadeIn(500);
            initCarousel('#newsfeed .carousel_wrapper');
            startCarousel('#newsfeed .carousel_wrapper');
		    loadNews();
			updateTitle('Newsfeed');
			updateURL('newsfeed');
		} else if (menu_selection == 7) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#owners').fadeIn(500);
            initCarousel('#owners .carousel_wrapper');
            startCarousel('#owners .carousel_wrapper');
		    loadOwners();
			updateTitle('Owners');
			updateURL('owners');
		} else if (menu_selection == 8) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#enthusiasts').fadeIn(500);
            initCarousel('#enthusiasts .carousel_wrapper');
            startCarousel('#enthusiasts .carousel_wrapper');
			updateTitle('Enthusiasts');
			updateURL('enthusiasts');
		} else if (menu_selection == 9) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#applications').fadeIn(500);
			updateTitle('Applications');
			updateURL('applications');
		} else if (menu_selection == 10) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#cpo').fadeIn(500);
			updateTitle('CPO');
			updateURL('cpo');
		} else if (menu_selection == 11) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#finance').fadeIn(500);
			updateTitle('BMW Financial Services');
			updateURL('finance');
		} else if (menu_selection == 12) {
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#join_us').fadeIn(500);
			updateTitle('Join Us');
			updateURL('join_us');
		};
	});
	
	function hideModal() {
		$('.modal').hide();
		$('.page').hide();
		$('#nav_lines').hide();
		compare_active = false;
	}

	function menuOpen(state) {
	    removeURLbar();
		if (menu_open) {
		    // Slide menu closed
			$('#logo')
	        	.animate(
					{ left: device_width-70 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#header')
	        	.animate(
					{ left: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#nav_lines')
	        	.animate(
					{ left: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
            $('.page')
                .animate(
                    { left: '-='+(device_width-menu_open_gap) },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
            $('#comparison_chart')
                .animate(
                    { left: '-='+(device_width-menu_open_gap) },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
			$('#menu_bg')
	        	.animate(
					{ left: '-='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			$('#menu_whitespace').hide();
		} else {
            stopCarousel();
            // Slide menu open
			$('#logo')
	        	.animate(
					{ left: '+='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#header')
	        	.animate(
					{ left: '+='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#nav_lines')
	        	.animate(
					{ left: '+='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
            $('.page')
                .animate(
                    { left: '+='+(device_width-menu_open_gap) },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
            $('#comparison_chart')
                .animate(
                    { left: '+='+(device_width-menu_open_gap) },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
			$('#menu_bg')
                .css('top', 0)
				.css('width',device_width-menu_open_gap)
	        	.animate(
					{ left: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			$('#menu_whitespace').show();
		};
        menu_open = !menu_open;
	};

	$("#btn_menu").click(function(){
		$('#btn_menu img').attr('src','images/btn_menu_active.png');
		menuOpen(!menu_open);
        $('#btn_menu img').attr('src','images/btn_menu.png');
	});
	
	$("#back_btn").click(function(){
		window.history.back();
		if($(this).hasClass("offer_back")){
			$("#offer_page").hide();
			show_back(true);
			$(this).removeClass("offer_back");
		} else {
			show_back(false);
		}
	});

	$("#menu_whitespace").click(function() {
		menuOpen(!menu_open);
	});

	$('#menu_whitespace').touchwipe({
		min_move_x: swipe_distance_x,
		min_move_y: swipe_distance_y,
		preventDefaultEvents: true,
		wipeLeft: function() {
			menuOpen(!menu_open);
		}
	});
	
	function show_back(back_menu) {
		if (!back_menu) {
			$("#btn_menu").show();
			$("#back_btn").hide();
			 } else {
				$("#btn_menu").hide();
				$("#back_btn").show();
			};
	};

	function menuInit() {
        var menu_height = $('#menu').height();
        // alert((menu_height-device_height)*-1);
        // alert('menu_height: '+menu_height+'\ndevice_height: '+device_height);

        $('#menu').draggable({
            axis: 'y',
            scroll: false,
            // containment: [tray_width*-1, 0, 0, 0],
            // start and stop. We add in the momentum functions here.
            start: function(e, ui) {
                dragMenu.start(this.id, e.clientX, e.clientY, e.timeStamp);
            },
            drag: function(e, ui) {
            },
            stop: function(e, ui) {
                dragMenu.end(this.id, e.clientX, e.clientY, e.timeStamp);
            }  
         });
    
        var dragMenu = new function () {    
            var minDrift = 0; // minimum drift after a drag move
            
            var dXa =[0];
            var dYa =[0];
            var dTa =[0];
            var number_tray_items = 0;
            var tray_width =  0;
            
            this.start = function (elemId, Xa, Ya, Ta)  {
                dXa[elemId] = Xa;
                dYa[elemId] = Ya;
                dTa[elemId] = Ta;
              };
        
            this.end = function (elemId, Xb, Yb, Tb)  {        
                var Xa = dXa[elemId];
                var Ya = dYa[elemId];
                var Ta = dTa[elemId];
                var Xc = 0;
                var Yc = 0;
        
                var dDist = Math.sqrt(Math.pow(Xa-Xb, 2) + Math.pow(Ya-Yb, 2));
                var dTime = Tb - Ta;
                var dSpeed = dDist / dTime;
                dSpeed = Math.round(dSpeed*100)/100;
        
                var distX =  Math.abs(Xa - Xb);
                var distY =  Math.abs(Ya - Yb);
                var distX =  0; // Confine movement to Y axis
        
                var dVelX = minDrift+(Math.round(distX*dSpeed*materials_tray_momentum / (distX+distY)));
                var dVelY = minDrift+(Math.round(distY*dSpeed*materials_tray_momentum / (distX+distY)));
        
                var position = $('#'+elemId).position();
                // var locX = position.left;
                var locY = position.top;
                var locX, newLocX = 0; // Confine movement to Y axis
                
/*
                if ( Xa > Xb ) {  // we are moving right, dragging left
                    Xc = locX - dVelX;
                    var newLocX = Xc + 'px';
                    if (Xc < device_width-tray_width) { // containment
                        newLocX = (device_width-tray_width)
                    };
                } else {  // we are moving left, dragging right
                    Xc = locX + dVelX;
                    var newLocX = Xc + 'px';
                    if (Xc > 0) { // containment
                        newLocX = 0;
                    };
                };
                newLocX = newLocX.toString().replace(/^\s+|\s+$/g, '');
                newLocX = newLocX.replace('px','');
*/

                if (dVelY>0) {menu_dragging = true} else {menu_dragging = false};
    
                if ( Ya > Yb ){  // we are moving down, dragging up
                    console.log('up');
                    console.log(device_height-menu_height);
                    Yc = (locY - dVelY);
                    var newLocY = Yc + 'px';
                    if (Yc < device_height-menu_height) { // containment
                        console.log('too far;')
                        newLocY = (device_height-menu_height)
                    };
                } else {  // we are moving up, dragging down
                    console.log('down');
                    Yc = (locY + dVelY);
                    var newLocY = Yc + 'px';
                    if (Yc > 0) { // containment
                        newLocY = 0;
                    };
                };
                newLocY = newLocY.toString().replace(/^\s+|\s+$/g, '');
                newLocY = newLocY.replace('px','');
                
                $('#'+elemId).stop(false,false).animate({ left:newLocX, top:newLocY }, 700, materials_tray_easing );
        
            };
			
			
    
        };
    };



    /* *********************************** Roundel click *********************************** */
    $('#logo').click(function() {
            $('.modal').hide();
            $('.page').hide();
            $('#nav_lines').hide();
            $('#home').fadeIn(500);
            current_carousel_page = 1;
            $('.carousel_pager li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
            $('#home .carousel_wrapper').css('left',0);
            updateTitle('Homepage');
            updateURL('home');
    });


	/* *********************************** Lines navigation *********************************** */
	$('#nav_lines').on('click', 'li', function(){
		current_col = ($('#nav_lines li').index(this)+1);
		current_row = 1;
		$( "#grid" ).animate({
			left: '-'+((device_width*current_col)-device_width)
		}, swipe_duration*2, swipe_easing_smooth,
		function() {
			$('#grid .col').css('top',0);
		});

		updateLines();
		updateURL('vehicle-'+current_col+'-'+current_row);
	});

	$('#nav_lines li').touchwipe({
		preventDefaultEvents: true
	});

	/* *********************************** Vehicle grid *********************************** */
    $('#grid .explore').click(function() {
        $('.modal').hide();
        $('.page').hide();
        $('#nav_lines').hide();
        $('#overview').show();
        initCarousel('#overview .carousel_wrapper');
        startCarousel('#overview .carousel_wrapper');
        updateTitle('Overview');
		/*initCarousel('#overview .carousel_wrapper');
        startCarousel('#overview .carousel_wrapper');*/
    });

    $('#touchpad').draggable({
        scroll: false,
        addClasses: false,
        revert: true,
        revertDuration: 0,
        start: function(event, ui) {
            swipe_direction = '';
            content_position_left = $('#grid').position().left;
            content_position_top = $('#grid #col-'+current_col).position().top;
            content_width = (device_width*number_cols);
            content_height = $('#grid #col-'+current_col).height();
        },
        drag: function(event, ui) {
            var deltaX = Math.abs(ui.position.left);
            var deltaY = Math.abs(ui.position.top);
            // console.log(deltaX, deltaY);
            // console.log(ui.position.left,ui.position.top);
            // console.log(swipe_sensitivity,swipe_direction);
            // If dragging horizontally, lock swiping to only that direction 
            if ((deltaX>=swipe_sensitivity) && (swipe_direction!=='up-down')) {
                // console.log(content_position_left,ui.position.left);
                swipe_direction = 'left-right';
                // $('#grid').css({ x: ui.position.left });
                $('#grid').css('left',content_position_left+ui.position.left);
            // If dragging vertically, lock swiping to only that direction
            } else if ((deltaY>=swipe_sensitivity) && (swipe_direction!=='left-right')) {
                // console.log(content_position_top,ui.position.top);
                swipe_direction = 'up-down';
             // $('#grid #col-'+current_col).css({y: ui.position.top});
                $('#grid #col-'+current_col).css('top',content_position_top+ui.position.top);
               };
        },
        stop: function(event, ui) {
            slider_delta_left =  $('#grid').position().left-content_position_left;
            slider_delta_top =  $('#grid #col-'+current_col).position().top-content_position_top;
            // console.log(content_position_left,current_col,device_width);
            // If dragged to the right (moving left) further than halfway
            if ((slider_delta_left > 0) && (slider_delta_left > (device_width/3)) && (content_position_left < 0)) {
                current_col--;
                // $('#grid').transition({ x: 0 }, swipe_duration/2, 'out' );
                $('#grid').animate({
                    left: ((current_col*device_width)-device_width)*-1
                }, swipe_duration/2, swipe_easing_smooth,
                function() {
                    $('.col').css('top',0);
                });
                $('.content h3')
                    .css('left',400)
                    .animate({
                        left: 0
                    });
                $('.content h2')
                    .css('left',200)
                    .animate({
                        left: 0
                    });
                $('.content .button')
                    .css('left',400)
                    .animate({
                        left: 0
                    });
                current_row = 1;
            // If dragged to the left (moving right) further than halfway
            } else if ((slider_delta_left < 0) && (slider_delta_left < ((device_width/3)*-1)) && ((content_width+content_position_left-device_width) >= device_width)) {
                current_col++;
                // $('#grid').transition({ x: ui.position.left+device_width }, swipe_duration/2, 'out' );
                $('#grid').animate({
                    left: ((current_col*device_width)-device_width)*-1
                }, swipe_duration/2, swipe_easing_smooth,
                function() {
                    $('.col').css('top',0);
                });
                $('.content h3')
                    .css('left',-400)
                    .animate({
                        left: 0
                    });
                $('.content h2')
                    .css('left',-200)
                    .animate({
                        left: 0
                    });
                $('.content .button')
                    .css('left',-400)
                    .animate({
                        left: 0
                    });
                current_row = 1;
            // If dragged down (moving up) further than halfway
            } else if ((slider_delta_top > 0) && (slider_delta_top > (device_height/3)) && (content_position_top < 0)) {
                $('#grid #col-'+current_col)
                    .animate(
                        { top: content_position_top+device_height },
                        { duration: swipe_duration, easing: swipe_easing_smooth 
                    });
                current_row--;
            // If dragged up (moving down) further than halfway
            } else if ((slider_delta_top < 0) && (slider_delta_top < ((device_height/3)*-1)) && ((content_height+content_position_top-device_height) >= device_height)) {
                $('#grid #col-'+current_col)
                    .animate(
                        { top: content_position_top-device_height },
                        { duration: swipe_duration, easing: swipe_easing_smooth 
                    });
                current_row++;
            // Else bounce back to start position
            } else {
                // $('#grid').transition({ x: 0 }, swipe_duration/2, 'out' );
                $('#grid')
                    .animate(
                        { left: content_position_left },
                        { duration: swipe_duration/2, easing: swipe_easing_smooth 
                    });
                $('#grid #col-'+current_col)
                    .animate(
                        { top: content_position_top },
                        { duration: swipe_duration, easing: swipe_easing_smooth 
                    });
            };
            updateLines();
            updateURL('vehicle-'+current_col+'-'+current_row);
        }
    });

	$('.next_bodystyle').click(function() {
		$('#grid #col-'+current_col)
        	.animate(
				{ top: '-='+device_height },
				{ duration: swipe_duration, easing: swipe_easing_smooth 
            });
		current_row++;
		updateURL('vehicle-'+current_col+'-'+current_row);
	});


/* *********************************** Build Your Own *********************************** */
    $('#byo_share li').click(function() {
		BYO_menuOpen(false);
		var menu_selection = $('#byo_share li').index(this);
		$('#menu li').removeClass('active');
		$('#byo_share li').removeClass('active');
		$(this).addClass('active');
		if (menu_selection == 0) {
			// Explore Vehicle
	        $('.modal').hide();
	        $('.page').hide();
	        $('#nav_lines').hide();
	        $('#overview').show();
	        initCarousel('#overview .carousel_wrapper');
	        startCarousel('#overview .carousel_wrapper');
	        updateTitle('Overview');
		} else if (menu_selection == 1) {
			// See Special Offers
			$('.modal').hide();
			$('.page').hide();
			$('#nav_lines').hide();
			$('#offers').show();
			updateTitle('Special Offers');
			loadSO();
		} else if (menu_selection == 2) {
			// Get a Quote
		} else if (menu_selection == 3) {
			// Email Your Build 
			window.open('mailto:info@bmwusa.com?subject=BYO&body=http://www.bmwusa.com/Standard/Content/BYO/SharedBuild.aspx?ConfigurationId=3182250&t=640i Coupe');			
		} else if (menu_selection == 4) {
			// Share on Facebook
			var t = vehicles_data;
			window.open('http://www.facebook.com/sharer/sharer.php?u=http://www.bmwusa.com/Standard/Content/BYO/SharedBuild.aspx?ConfigurationId=3182250&t=640i Coupe');			
		} else if (menu_selection == 5) {
			// Share on Twitter
			window.open('https://twitter.com/intent/tweet?text=640i Coupe&url=http://www.bmwusa.com/Standard/Content/BYO/SharedBuild.aspx?ConfigurationId=3182250');			
		} else if (menu_selection == 6) {
			// Share on Google+
			window.open('https://plus.google.com/share?url=http://www.bmwusa.com/Standard/Content/BYO/SharedBuild.aspx?ConfigurationId=3182250');			
		};
    });

	function BYO_menuOpen(state) {
		if (byo_menu_open) {
		    // Slide menu closed
			$('#logo')
	        	.animate(
					{ left: device_width-70 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#header')
	        	.animate(
					{ left: 0 },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
            $('#build_your_own')
                .animate(
                    { left: 0 },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
			$('#byo_share')
	        	.animate(
					{ left: device_width },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			$('#byo_share_whitespace').hide();
		} else {
			$('#byo_share li').removeClass('active');
            // Slide menu open
			$('#logo')
	        	.animate(
					{ left: '-='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
			$('#header')
	        	.animate(
					{ left: '-='+(device_width-menu_open_gap) },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
	            });
            $('#build_your_own')
                .animate(
                    { left: '-='+(device_width-menu_open_gap) },
                    { duration: swipe_duration, easing: swipe_easing_smooth 
                });
			$('#byo_share')
                .css('top', 0)
				.css('width',device_width-menu_open_gap)
	        	.animate(
					{ left: menu_open_gap },
					{ duration: swipe_duration, easing: swipe_easing_smooth 
				});
			$('#byo_share_whitespace').show();
		};
        byo_menu_open = !byo_menu_open;
	};

	$("#byo_share_whitespace").click(function() {
		BYO_menuOpen(!byo_menu_open);
	});

	$('#byo_share_whitespace').touchwipe({
		min_move_x: swipe_distance_x,
		min_move_y: swipe_distance_y,
		preventDefaultEvents: true,
		wipeRight: function() {
			BYO_menuOpen(!byo_menu_open);
		}
	});

	
    $('#byo_touchpad').draggable({
        scroll: false,
        addClasses: false,
        revert: true,
        revertDuration: 0,
        start: function(event, ui) {
        	swipe_direction = '';
        },
        drag: function(event, ui) {
        },
        stop: function(event, ui) {
            var deltaX = Math.abs(ui.position.left);
            var deltaY = Math.abs(ui.position.top);
            // If dragging horizontally, lock swiping to only that direction
            if ((deltaX>=byo_swipe_sensitivity) && (swipe_direction!=='up-down')) {
                swipe_direction = 'left-right';
                if (ui.position.left<0) {
                    updateStage('left');
                } else {
                    updateStage('right');
                };
            // If dragging vertically, lock swiping to only that direction
            } else if ((deltaY>=byo_swipe_sensitivity) && (swipe_direction!=='left-right')) {
                swipe_direction = 'up-down';
                if (ui.position.top<0) {
                    updateStage('up');
                } else {
                    updateStage('down');
                };
            };
        }
    });

    $('#materials_nav li').click(function() {
    	if (warning_active) {
	    	$('#warning').fadeOut(250);
	    	warning_active = !warning_active;
    	};
        var cat_clicked = $(this).index()+1;
        if ($(this).hasClass('share')) {
            BYO_menuOpen(!byo_menu_open);
            return;  
        };
        var newLocX = ($('#cat'+cat_clicked).position().left)*-1
        $('#materials_tray').stop(false,false).animate({ left:newLocX }, 700, materials_tray_easing);
        $('#materials_nav ul li').removeClass('active');
        $(this).addClass('active');
        if (cat_clicked<3) {
            byo_pov = 'walkaround';
        } else {
            byo_pov = 'dashboard';
        };
        updateStage();        
    });

	var warning_active = false;
    $('#build_your_own').on('click', '.icon_warning', function(){
    	if (!warning_active) {
	    	var warning_content = '<h4>Please Note:</h4><p>'+$(this).parent().data('warning')+'</p>';
	    	$('#warning span').html(warning_content);
	    	var arrow_pos = $(this).offset();
	    	$('#warning_arrow').css('left',arrow_pos.left-13);
	    	$(this).parent().hasClass('active') ? $('#warning_arrow').hide() : $('#warning_arrow').show(); 
	    	$('#warning').fadeIn(250);
    	} else {
	    	$('#warning').fadeOut(250);
    	};
    	warning_active = !warning_active;
	});

    $('#warning').click(function(){
    	$('#warning').fadeOut(250);
    	warning_active = !warning_active;
	});


    $('#materials_tray').on('click', 'img', function(){
    	if (warning_active) {
	    	$('#warning').fadeOut(250);
	    	warning_active = !warning_active;
    	};
        if ((tray_dragging)||($(this).parent().hasClass('active'))) { tray_dragging = false; return; };
        var class_name = $(this).parent().attr('class');
        $('#materials_tray li.active.'+class_name).animate({ marginTop:0 }, 300, materials_tray_easing).removeClass('active'); // Move element down        
        if (class_name=='paint') { current_build.paint_code = $(this).parent().data('code'); }
        else if (class_name=='wheel') { current_build.wheel_code = $(this).parent().data('code'); }
        else if (class_name=='fabric') { current_build.fabric_code = $(this).parent().data('code'); }
        else if (class_name=='trim') { current_build.trim_code = $(this).parent().data('code'); }
        else if (class_name=='accent') { current_build.accent_code = $(this).parent().data('code'); };

		var code = $(this).parent().data('code');
		$(this).parent().animate(
			{
				marginTop:-50
			}, 300,
			function() {
				$(this).parent().addClass('active')
				loadBuild_addOption(code);
			});

    });

    $('#materials_tray').draggable({
        axis: 'x',
        scroll: false,
        // containment: [tray_width*-1, 0, 0, 0],
        // start and stop. We add in the momentum functions here.
        start: function(e, ui) {
            dragMaterialsTray.start(this.id, e.clientX, e.clientY, e.timeStamp);
        },
        drag: function(e, ui) {
        },
        stop: function(e, ui) {
            dragMaterialsTray.end(this.id, e.clientX, e.clientY, e.timeStamp);
        }  
     });

    var dragMaterialsTray = new function () {    
        var minDrift = 0; // minimum drift after a drag move
        
        var dXa =[0];
        var dYa =[0];
        var dTa =[0];
        var number_tray_items = 0;
        var tray_width =  0;
        
        this.start = function (elemId, Xa, Ya, Ta)  {
            dXa[elemId] = Xa;
            dYa[elemId] = Ya;
            dTa[elemId] = Ta;
            number_tray_items = $('#materials_tray li').length;
            var tray_item_width = $('#materials_tray li').width();
            tray_width =  (tray_item_width * number_tray_items) + (number_tray_items * 13);
            $('#materials_tray').css('width', tray_width);
            
          };
    
        this.end = function (elemId, Xb, Yb, Tb)  {        
            var Xa = dXa[elemId];
            var Ya = dYa[elemId];
            var Ta = dTa[elemId];
            var Xc = 0;
            var Yc = 0;
    
            var dDist = Math.sqrt(Math.pow(Xa-Xb, 2) + Math.pow(Ya-Yb, 2));
            var dTime = Tb - Ta;
            var dSpeed = dDist / dTime;
            dSpeed=Math.round(dSpeed*100)/100;
    
            var distX =  Math.abs(Xa - Xb);
            // var distY =  Math.abs(Ya - Yb);
            var distY =  0; // Confine movement to X axis
    
            var dVelX = minDrift+(Math.round(distX*dSpeed*materials_tray_momentum / (distX+distY)));
            var dVelY = minDrift+(Math.round(distY*dSpeed*materials_tray_momentum / (distX+distY)));

            if (dVelX>0) {tray_dragging = true} else {tray_dragging = false};
    
            var position = $('#'+elemId).position();
            var locX = position.left;
            // var locY = position.bottom;
            var locY = 0; // Confine movement to X axis
            
            if ( Xa > Xb ) {  // we are moving right, dragging left
                Xc = locX - dVelX;
                var newLocX = Xc + 'px';
                if (Xc < device_width-tray_width) { // containment
                    newLocX = (device_width-tray_width)
                };

            } else {  // we are moving left, dragging right
                Xc = locX + dVelX;
                var newLocX = Xc + 'px';
                if (Xc > 0) { // containment
                    newLocX = 0;
                };
            };

            var materials_tray_magnetism = device_width/2;

/*
            var pos_wheels = -2564; -2580
            var pos_fabric = -3868; -3870
            var pos_trim = -5803; -5590
            var pos_accent = -6448; -6450 +2
*/

            pos_wheels = ($('#cat2').position().left)*-1;
            pos_fabric = ($('#cat3').position().left)*-1;
            pos_trim = ($('#cat4').position().left)*-1;
            pos_accent = ($('#cat5').position().left)*-1;

            // Bounce tray position to nearest materials category
            if ((Xc > pos_wheels-materials_tray_magnetism) && (Xc < pos_wheels+materials_tray_magnetism)) {
                newLocX = pos_wheels;
            };
            if ((Xc > pos_fabric-materials_tray_magnetism) && (Xc < pos_fabric+materials_tray_magnetism)) {
                newLocX = pos_fabric;
            };
            if ((Xc > pos_trim-materials_tray_magnetism) && (Xc < pos_trim+materials_tray_magnetism)) {
                newLocX = pos_trim;
            };
            if ((Xc > pos_accent-materials_tray_magnetism) && (Xc < pos_accent+materials_tray_magnetism)) {
                newLocX = pos_accent;
            };

            newLocX = newLocX.toString().replace(/^\s+|\s+$/g, '');
            newLocX = newLocX.replace('px','');

            // Change highlighted choice in materials navigation
            $('#materials_nav ul li').removeClass('active');
            if (newLocX > pos_wheels) {
                $('#materials_nav ul li').eq(0).addClass('active');
                byo_pov = 'walkaround';
            } else if ((newLocX <= pos_wheels) && (newLocX > pos_fabric )) {
                $('#materials_nav ul li').eq(1).addClass('active');
                byo_pov = 'walkaround';
            } else if ((newLocX <= pos_fabric) && (newLocX > pos_trim )) {
                $('#materials_nav ul li').eq(2).addClass('active');
                byo_pov = 'dashboard';
            } else if ((newLocX <= pos_trim) && (newLocX > pos_accent )) {
                $('#materials_nav ul li').eq(3).addClass('active');
                byo_pov = 'dashboard';
            } else  {
                $('#materials_nav ul li').eq(4).addClass('active');
                byo_pov = 'dashboard';
            };

            if ( Ya > Yb ){  // we are moving up
                Yc = (locY - dVelY);
            } else {  // we are moving down
                Yc = (locY + dVelY);
            };
    
            var newLocY = Yc + 'px';
            
            $('#'+elemId).stop(false,false).animate({ left:newLocX, bottom:newLocY }, 700, materials_tray_easing);
            updateStage();
        };
    };


/* *********************************** Carousel *********************************** */
    function initCarousel(this_carousel) {
        current_carousel_page = 1;
        $(this_carousel).prev('.carousel_pager').find('li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
        $(this_carousel).css('left',0);
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





/* *********************************** Rotate device *********************************** */
	var previousOrientation = 0;
	var checkOrientation = function(){
	    if(window.orientation !== previousOrientation){
	        previousOrientation = window.orientation;
	        // orientation changed, do your magic here
	        // alert('Orientation change');
	        constructGrid();
	    }
	};

	window.addEventListener("resize", checkOrientation, false);
	if (!navigator.userAgent.match(/android/i)) {
	    window.addEventListener("orientationchange", checkOrientation, false);
	};
	// (optional) Android doesn't always fire orientationChange on 180 degree turns
	setInterval(checkOrientation, 2000);


	// Detect whether device supports orientationchange event, otherwise fall back to
	// the resize event.
/*
	var supportsOrientationChange = "onorientationchange" in window,
	    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	
	window.addEventListener(orientationEvent, function() {
	    // alert('Orientation change');
	    constructGrid();
	}, false);
*/

/*
	$(window).bind('orientationchange', function() {
		var o = window.orientation;
		// constructGrid();
		if ((o==0) || (o==180)) {
			// Portrait mode
			alert('Portrait mode');
		} else {
			// Landscape mode
			alert('Landscape mode');
		};
		return false;
	});
*/

	/* *********************************** Omniture page tracking *********************************** */
	/*
	* Note: colons signify hierachy within the pageName, so if tracking deeper virtual hiearchy, pass colon-delimited ids.
	*/
	function trackOmniPage(newPageName) {
		// var s=s_gi(s_account);
		// basePageName = (basePageName==undefined) ? s.pageName : basePageName;
		// s.pageName = basePageName+":"+newPageName;
		// s.t();
	}

	/* *********************************** Omniture event tracking *********************************** */
	/*
	* @param btnid : string representing the button or ui object
	* @param clickid : string representing the action (which may be available via multiple ui buttons)
	*
	* example: user clicks main top nav button 'sign up for updates', which brings up a newsletter signup form modal
	* trackSiteEvent('top_nav_sign_up_cta','sign_up_for_updates_open');
	* Note: "site_id" will be the same throughout, and should be defined by ID/Analytics.
	*
	*/
	function trackSiteEvent(btnid,clickid) {
		// var s=s_gi(s_account);
		// var site_id = "mobile";
		// s.prop43 =site_id;
		// s.tl(btnid,'o',site_id+'-'+clickid);
		// console.log(btnid+":"+clickid);
	}

	/* *********************************** Initialize pages *********************************** */
	function init() {
		menuInit();

		// device_height = window.innerHeight ? window.innerHeight : $(window).height();
		// $('img.device-height').css('height',device_width*1.6);
		device_width = $(window).width();
		device_height = $(window).height();
        var byo_stage_height = device_height-206;
		if (isiPhone) {
			device_height = device_height + 62;
		} else
		if (isAndroid) {
			device_height = device_height + 0;
		} else
		if (isBlackberry) {
			device_height = device_height + 40;
		};

         $('.device-width').css('width',device_width);
        // $('.device-height').css('height',device_height);
        $('.device-width').livequery(function(){ 
            $(this).css('width',device_width);
        }); 
        $('.device-height').livequery(function(){ 
            $(this).css('height',device_height);
        }); 

        $('.bodystyles').livequery(function(){
            $(this).css('min-height',device_height);
        }); 

		$('#logo')
			.css('left',device_width-70);
		$('#menu_bg')
			.css('left',device_width*-1)
			.css('height',device_height);
        $('#menu')
            .css('width',device_width-100)
		$('#menu_whitespace')
			.css('height',device_height-46);
		$('#overview .page').each(function(index) {
			var page = $(this).attr('id');
			var col = page.substring(6,7);
			$(this)
				.css('left',(device_width*col)-device_width+'px');
		});
        $('#touchpad')
            .css('height',device_height-146);
        $('#build_your_own #stage')
            .css('height',byo_stage_height);
        $('#build_your_own #byo_touchpad')
            .css('height',device_height-210);
		$('#build_your_own #warning')
			.css('width',device_width-60);
		$('#byo_share')
			.css('height',device_height)
			.css('left',device_width);
		$('#byo_share_whitespace')
			.css('height',device_height-46)
			.css('width',menu_open_gap);
		
		removeURLbar();
	};

	/* *********************************** Construct grid *********************************** */
	function constructGrid() {
		$('#grid .page').each(function(index) {
			var page = $(this).attr('id');
			var col = page.split('-')[1];
			// var row = page.split('-')[2];
			$(this)
				.css('left',(device_width*col)-device_width+'px');
				// .css('top',(device_height*row)-device_height+'px');

		});
		$('#grid .col').each(function(index) {
			var cols = $(this).children('.page').size();
			$(this)
				.css('height',(device_height*cols)+'px');
		});
		$('#grid')
			.css('left',(device_width*current_col)-device_width+'px')
			.css('top',(device_height*current_row)-device_height+'px');
		$('#bodystyle_selector').css('top',window.device_height).show();
		$('.bodystyle_selector_thumb').css('width','100%');
		$('#model_selector').css('top',window.device_height).show();
	};

    /* *********************************** Loading screen *********************************** */
    function loader(loaderState) {
        if (loaderState) {
            // $('#menu').css('visibility','hidden');
            var device_width = $(window).width();
            var device_height = $(window).height();
            var loader_code = '<div id="loader"></div>';
            $('body').append(loader_code);
            $('#loader').css('width',device_width).css('height',device_height);
        } else {
            $('#loader').fadeOut(750);
        };
    };
   
	/* *********************************** Begin the magic *********************************** */
    // loader(true);
	// $(window).load(function() {
	    // loader(false);
	// });

	window.scrollTo(0,1); // Remove URL bar
	init();

	loadFMA();
    initCarousel('#home .carousel_wrapper');
    startCarousel('#home .carousel_wrapper');

});