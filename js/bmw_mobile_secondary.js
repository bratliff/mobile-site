// JavaScript Document

var menu_dragging = false;



$(document).ready(function() {

var windowSwitch = false;

window.addEventListener("orientationchange", function() {
  
 if (windowSwitch == true) { 
  $("#rotate").hide();
  // Announce the new orientation number
  
  switch(window.orientation) {
	case 90:
	case -90:
	hideModal();
	$('#overview').hide();
		$('#mobile_gallery').show();
		$("#header").hide();
		$("#logo").hide();
	break;
	case 0:
	case 180:
	$('#overview').show();
	$('#mobile_gallery').hide();
	$("#header").show();
	$("#logo").show();
	
	break;  
  }
 }
}, false);
	
function hideModal() {
	console.log("hide modal");
	$('.modal').hide();
	$('.page').hide();
	$('#nav_lines').hide();
	compare_active = false;
}

function show_back(back_menu) {
		if (!back_menu) {
			$("#btn_menu").show();
			$("#back_btn").hide();
			 } else {
				$("#btn_menu").hide();
				$("#back_btn").show();
			};
		
	};

function updateTitle(title) {
		$('#header h1').fadeOut(0, function() {
			$(this).html(title).fadeIn(0);
		});
	};

	var device_width = $(window).width();
	var device_height = $(window).height();

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
        } else clearInterval(carousel_timer);;
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
			if ((slider_delta_left > 0) && (slider_delta_left > (device_width/3)) && (content_position_left < 0)) {				
				$(this)
		        	.animate(
						{ left: content_position_left+device_width },
						{ duration: swipe_duration/2
						});
				current_carousel_page--;
				current_comparison_point = current_carousel_page-1;
				if(compare_active == true){
					console.log("compare active");
					reportPosition(current_carousel_page);
				}
				//
			    
			// If dragged to the left further than halfway
			} else if ((slider_delta_left < 0) && (slider_delta_left < ((device_width/3)*-1)) && ((content_width+content_position_left) > device_width)) {
				$(this)
		        	.animate(
						{ left: content_position_left-device_width },
						{ duration: swipe_duration/2}
						);
				current_carousel_page++;
				current_comparison_point = current_carousel_page-1;
				if(compare_active == true){
					console.log("compare active");
					reportPosition(current_carousel_page);
				}
				
			// Else bounce back to start position
			} else {
				$(this)
		        	.animate(
						{ left: content_position_left },
						{ duration: swipe_duration/2}
						);
			};
			$(this).prev('.carousel_pager').find('li img').attr('src','images/carousel_bullet.png').eq(current_carousel_page-1).attr('src','images/carousel_bullet_active.png');
		}
	});

/*****************  Drag News Tray  ******************************/

 var dragTray = new function () {  
 		  
 		var news_tray_momentum = 500;
        var minDrift = 0; // minimum drift after a drag move
        
        var dXa =[0];
        var dYa =[0];
        var dTa =[0];
        var number_tray_items = 0;
        var tray_width =  0;
        
        this.start = function (elemId, Xa, Ya, Ta)  {
			console.log(Xa);
            dXa[elemId] = Xa;
            dYa[elemId] = Ya;
            dTa[elemId] = Ta;
            /*number_tray_items = $(elemId).find('li').length;
            var tray_item_width = $(elemId).('li').height();
            $(elemId).css('width', tray_item_width * number_tray_items);
            tray_width =  $(elemId).find('li').width() * number_tray_items;*/
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
    		
			var distX = 0;
            //var distX =  Math.abs(Xa - Xb);
             var distY =  Math.abs(Ya - Yb);
            //var distY =  0; // Confine movement to X axis
    
            var dVelX = minDrift+(Math.round(distX*dSpeed*news_tray_momentum / (distX+distY)));
            var dVelY = minDrift+(Math.round(distY*dSpeed*news_tray_momentum / (distX+distY)));
    
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
			
            var news_tray_magnetism = device_width/2;

             if (dVelY>0) {menu_dragging = true} else {menu_dragging = false};
    
                if ( Ya > Yb ){  // we are moving down, dragging up
                    console.log('up');
                    console.log(device_height-news_height);
                    Yc = (locY - dVelY);
                    var newLocY = Yc + 'px';
                    /*if (Yc < device_height-news_height) { // containment
                        console.log('too far;')
                        newLocY = (device_height-news_height)
                    };*/
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


/* *********************************** Overview *********************************** */
	$('.btn_explore').click(function() {
		$('#nav_lines').fadeOut(500);
		$('#overview').fadeIn(500);
		updateTitle('Overview');
		updateURL('overview');
	});

	$('#overview').find('.gallery_btn').click(function() {
		hideModal();
		$('#mobile_gallery').show();
		initCarousel('#mobile_gallery .carousel_wrapper');
        startCarousel('#mobile_gallery .carousel_wrapper');
		$("#rotate").show();
		$("#header").hide();
		$("#logo").hide();
		windowSwitch = true;
	});
	
	
	$("#model_overview").width(device_width);
	$("#overview_bar").click(function() {
			retract_overview();
		});
		
	function retract_overview() {
		if (!overview_open) {
			$("#model_overview").animate({ bottom: 0 }, 300);
			overview_open = true;
			}
			else {
			$("#model_overview").animate({ bottom: -330 }, 300);
			overview_open = false;
			}
	}
		
	$('ul#model_overview_nav li').click(function() {
		hideModal();
		retract_overview();
		var overview_selection = $('ul#model_overview_nav li').index(this);
	  	switch(overview_selection) {
			case 0:
			$('#learn').show();
			updateTitle('Learn');
			updateURL('learn');
			break;
			case 1:
			$('#build_your_own').show();
			updateTitle('Build Your Own');
			break;
			case 2:
			$('#test').show();
			updateTitle('Test Drive');
			updateURL('test');
			break;
			case 3:
			$('#compare').show();
			updateTitle('Compare');
			break;
			case 4:
			$('#offers').show();
			updateTitle('Special Offers');
			break;
			case 5:
			$('#owners').show();
			updateTitle('Owners');
			break;	
		}	
		});
		
	
		
/* *********************************** Mobile Gallery *********************************** */

	$("#close_btn").click(function() {
			$('#overview').show();
			$('#mobile_gallery').hide();
			$("#header").show();
			$("#logo").show();
			windowSwitch = false;
		});
		
		$("#share_btn").click(function() {
			$("#share_menu").toggle();
		});
		
		$("#share_menu ul li").click(function() {
			windowSwitch = false;
			$("#share_menu").hide();
			switch($(this).index()) {
				case 0:
				break;	
				case 1:
				break;
				case 2:
				break;
				case 3:
				break;
				case 4:
				break;
				case 5:
				break;
			}
		});
		
		
/* *********************************** Learn *********************************** */
	$('#model_overview_nav #btn_learn').click(function() {
		$('.modal').fadeOut(500);
		$('#nav_lines').fadeOut(500);
		$('#learn').fadeIn(500);
		updateTitle('Learn');
		updateURL('learn');
	});

/* *********************************** Build Your Own *********************************** */
	$('#model_overview_nav #btn_build').click(function() {
		$('.modal').fadeOut(500);
		$('#nav_lines').fadeOut(500);
		$('#build_your_own').fadeIn(500);
		updateTitle('Build Your Own');
		updateURL('build');
	});

	/*$('#build_your_own .content').touchwipe({
		min_move_x: swipe_distance_x,
		min_move_y: swipe_distance_y,
		preventDefaultEvents: true,
	
		wipeLeft: function() {
			if (current_build_your_own<4) {
				$('#build_your_own_carousel_page'+current_build_your_own).fadeOut(500);
				current_build_your_own++;
				$('#build_your_own_carousel_page'+current_build_your_own).fadeIn(500);
			};
		},
		
		wipeRight: function() {
			if (current_build_your_own>1) {
				$('#build_your_own_carousel_page'+current_build_your_own).fadeOut(500);
				current_build_your_own--;
				$('#build_your_own_carousel_page'+current_build_your_own).fadeIn(500);
			};
		}
	});*/

/* *********************************** Test Drive *********************************** */
	$('#model_overview_nav #btn_test').click(function() {
		
		$('.modal').fadeOut(500);
		$('#nav_lines').fadeOut(500);
		$('#test').fadeIn(500);
		updateTitle('Test Drive');
		updateURL('test');
	});
	
	// $('.button').click(function() {
		// getLocation();
		// switch($(this).attr("id")) {
			// case "test_btn":
				// hideModal();
				// $('#test_drive').show();
				// updateTitle('Test Drive');
				// updateURL('test');
			// break;
		// }
	// });
	
	$(".contact_radio").click(function() {
	     	$("#contact_info").val($(this).val());
	});
	
	


/* *********************************** Locate a dealer *********************************** */




$("#map_canvas").height(device_height + 30).width(device_width + 30);

$("#zipcode_field").width(device_width);
$("#zipcode_inner").width(device_width - 40);
       

 $('.go span').click(function(e)
    {	
		e.preventDefault();
        SearchByActiveMode();
		//loadPMA($('#searchByAddress').val(),25)

    });

$('#searchByAddress').keypress(function(e)
	
    {
	    if (e.which == 13)
        {
			e.preventDefault();
            SearchByActiveMode();
        }
    });
	
	

/* *********************************** Dealer Info *********************************** */	   
	
$(".dealer_buttons div:eq(0)").click(function() {
	console.log("get directions");
})	
	   
$(".dealer_buttons div:eq(1)").click(function() {
	
})

$(".dealer_buttons div:eq(2)").click(function() {
	hideModal();
	$('#test').show();
	updateTitle('Test Drive');
	updateURL('test');
});



/* *********************************** Special Offers *********************************** */


$("#menu_offers").width(device_width);

var offer_height = $("#menu_offers").height();
offers_offset = (offer_height-device_height)*-1;

$("#offer_container").draggable({
			axis: 'y',
			scroll: false,
			containment: [0, -1000, 0, 0],
			/* containment: '.content',
			start: function(event, ui) {
			},
			drag: function(event, ui) {
			},
			/*stop: function(event, ui) {

			    var menu_top = $(this).css('top');
			    alert('menu_top: '+menu_top + ', menu_offset: ' + menu_offset);
			    if (menu_top < menu_offset) {
			        alert('too much');
                    $(this).animate(
                            { bottom: 0 },
                            { duration: swipe_duration, easing: swipe_easing_smooth 
                        });
			    };

			}*/
		});



$("ul#menu_offers li").click(function() {
	$(this).next("ul").toggle();

});

$("ul#menu_offers ul li").click(function() {
	getLocation();
	hideModal();
	$('#offers').hide();
	$('#offer_results').show();
	updateTitle('Current Offers');
	updateURL('current_offers');
	show_back(true);
	
});


/* *********************************** Offer Results *********************************** */


$("#paychoice li").width(device_width/2 - 2);
$("#zipcode_dealers").width(device_width - 40);
$("#offer_list").width(device_width);
$("#offer_list ul").width(device_width - 40);

$("#paychoice li").click(function() {
	$(this).css({'background-color' : 'white', 'color' : '#009'});
	$(this).siblings().css({'background-color' : '#CCC', 'color' : '#666'});
	
	switch($(this).index()) {
	   case	0:
	   	$("#offer_list li").html($("#offer_list li").html().replace("Finance", 'Lease')); 
	   break;
	   case	1:
	   	$("#offer_list li").html($("#offer_list li").html().replace("Lease", 'Finance'));
	   break;
	}
});

$("#offer_list ul li").click(function() {
	loadSO();
	$('#current_offers').hide();
	$('#offer_page').show();
	updateTitle('Offer Page');
	updateURL('offer_page');
	$("#back_btn").addClass("offer_back");
	show_back(true);
});

/* *********************************** container *********************************** */

/* setting width and position of the comparison bars */

$("#comparison_chart").width(device_width);
$("#comparison_chart").height(device_height/2);

$(".column div").width((device_width/3) + 2);
$(".column div").height(device_height/2);
$(".column").height(device_height/2);

$(".column .bar_footer").height(30);
$(".bar_text").height(device_height/2);
$(".column").width(device_width/3);

/* setting position and heights for the car selection bar*/
$(".back").height(device_height/2);

$(".column").each(function() { 
	var liCount = $(this).find("li").length;
	$(this).find("li").height((device_height/2)/liCount - 5);
});

/*var position_two = $("#column2").width();
var position_three = $("#column3").width() * 2;

$("#column2").css({"left":position_two + "px"});
$("#column3").css({"left":position_three + "px"});*/

var imageCount = $("#compare").find($(".carousel_page")).index() + 1;

//click functionatlity for comparison bars //
//var show_rivals = false;

function flipCard(targetCol) {
	
	if($(targetCol).parents(".card").hasClass("flipped")) {
		$(targetCol).delay(500).toggle();
		$(targetCol).siblings('.bar').toggle(400);	
	}
	else {
		$(targetCol).toggle(100);
		$(targetCol).siblings('.bar').delay(300).toggle(400);
	}
	
	$(targetCol).parents('.card').toggleClass('flipped');
	$(targetCol).siblings('.bar_footer').toggle();
	
};


$('.competitors').find('.bar_header').bind('click', function() {
	flipCard(this);
	var thisCol = $(this).parents(".column");
	var thisCard = $(this).parents(".column").find(".card");
	var otherFlipped =  $(this).parents(".column").siblings().find(".flipped").find(".bar_header");
	flipCard($(otherFlipped));
	 
	if($(this).parents(".column").hasClass("competitors")){ 
			var carArray = ["Audi","Acura","Lexus","Mercedes-Benz","Infiniti"]; 
			var backside = $(this).parents("figure").siblings("figure").find("li");
			
			var oppositeHeader = $(thisCol).siblings(".competitors").find(".bar_header h1").html();
			
			carArray.splice($.inArray(oppositeHeader, carArray), 1);
			// console.log(carArray);
			
			 for (i = 0; i < 4; i++)
				  {
					var currentLI = $(this).parents("figure").siblings("figure").find("li").get(i);
					
					currentLI.innerHTML = carArray[i];
				  }
	};
});


$('.carousel_wrapper').click(function() {
   if ($(".card").hasClass("flipped")) {
		flipCard($(".flipped").find(".bar_header"))   
   }
});

$('ul#centerlist').draggable(
		{ axis: 'y'}
);

/* function to set bar heights after selected list item*/
$(".back ul li").click(function() {
	
	var otherHeader = $(this).parents("figure").siblings("figure").find('.bar_header');
	flipCard(otherHeader);
	var newTitle = $(this).html();
	
	$(this).parents(".column").delay(1000).find(".bar_header").html("<h1>" + newTitle + "</h1><br />" + "A4 Sedan");
	var moveTarget = $(this).parent().parent().siblings();
	var currentCol = $(this).parents(".column").index() + 1;
	var selected = $(this).index() + 1;

	switch(newTitle) {
	    case "Audi":
            if (currentCol==1) { compare_competitor1=1} else {compare_competitor2=1};
			updateCompareBarCompetitor(currentCol,1);
			updateBarRankings();
		break;	
		case "Acura":
            if (currentCol==1) { compare_competitor1=4} else {compare_competitor2=4};
			updateCompareBarCompetitor(currentCol,4);
			updateBarRankings();
		break;
		case "Lexus":
            if (currentCol==1) { compare_competitor1=3} else {compare_competitor2=3};
			updateCompareBarCompetitor(currentCol,3);
			updateBarRankings();
		break;
		case "Mercedes-Benz":
            if (currentCol==1) { compare_competitor1=0} else {compare_competitor2=0};
			updateCompareBarCompetitor(currentCol,0);
			updateBarRankings();
		break;
		case "Infiniti":
            if (currentCol==1) { compare_competitor1=2} else {compare_competitor2=2};
			updateCompareBarCompetitor(currentCol,2);
			updateBarRankings();
		break;
	};
});


$("#compare_container").width(device_width * 3);

$("#newsfeed").find(".carousel_page h2").width(device_width - 40);
$("#news_container").width(device_width);

$('ul#newslist').on('click', 'li', function(event){
	if (menu_dragging) {
		    menu_dragging = false;
		    return;
    };
			
	hideModal();
	show_back(true);
	$('#news_page').fadeIn(500);
	updateTitle('Newsfeed Article');
	loadNewsArticle($(this).data('article'));
});

var listItemHeight = $('ul#newslist li').height();
var news_height = $('ul#newslist li').length * listItemHeight;
//var triggerPos = $('ul#newslist').position().top + listHeight;


	$('#news_container').draggable({ 			
			axis: 'y',
			scroll: false,
			//containment: [0, -210, 0, 0],
			start: function(e, ui) {
				
				//dragTray.start(this.id, e.clientX, e.clientY, e.timeStamp);
				//var start_menu = $(this).css('top');
			},
			drag: function(event, ui) {
			},
			stop: function(e, ui) {
				
				//dragTray.end(this.id, e.clientX, e.clientY, e.timeStamp);
			  	
			/*triggerPos = $('ul#newslist').position().top + listHeight;
				
				 if (triggerPos < 0) {
					addNews();
				}
				    
			 	/*if (news_menu_top < menu_offset) {
			        //alert('too much');
                    $(this).animate(
                            { bottom: "+=50" },
                            { duration: swipe_duration, easing: swipe_easing_smooth 
                        });
			    };*/

			}
		});	


function addNews() {
		// add to list of news stories
		
		for (i=0; i < 5; i++) {
			var newListItem = document.createElement('li');
			var newDiv = document.createElement('div');
			$('ul#newslist').append(newListItem);
			$(newListItem).html("<div></div><strong>Lorem ipsum dolor sit amet</strong><br />Suspendisse ultrices, dui et molestie...");
			//$(newListItem).append(newDiv);
			listHeight = $('ul#newslist li').length * listItemHeight;
		}
}


/* *********************************** Owners Page *********************************** */

$('#owner_menu li').click(function() {
	hideModal();
	var current_selection = $('#owner_menu li').index(this);
	if (current_selection == 0) {
		$('#manuals').fadeIn(500);
		updateTitle('Manuals &amp; Videos');
		updateURL('manuals');
	} else if (current_selection == 1) {
		show_back(true);
		$('#accessories').fadeIn(500);
		updateTitle('Accessories');
		updateURL('accessories');
	} else if (current_selection == 2) {
		show_back(true);
		$('#roadside').fadeIn(500);
		updateTitle('Roadside Assistance');
		updateURL('assistance');
	};
});
/* *********************************** Manuals and Videos *********************************** */

$("#manual_menu").width(device_width-33);



/* *********************************** Owner Videos *********************************** */

$(".video_image").width(device_width-30);


/* *********************************** Enthusiasts *********************************** */

$('#enthusiast_menu li').click(function() {
	hideModal();
	switch ($('#enthusiast_menu li').index(this)) {
	case 0:
		windowSwitch = true;
		updateTitle('2012 335i');
		updateURL('2012 335i');
	break;
	case 1:
		$('#videos').fadeIn(500);
		updateTitle('Coupe');
		updateURL('coupe');
	break;
	case 2:
		
		updateTitle('128i');
		updateURL('128i');
	break;
	}
});


$('#videos').find("a").click(function() {
		$(this).parent().parent().next().slideDown();
		return false;
	});
	
$('.more_info span a').click(function() {
	$(this).parent().parent().slideUp();
	$('#applications').find("a").show();
	$('.more_info').find("a").show();
	return false;
});

/* *********************************** Applications *********************************** */

$('.read_more a').click(function() {
		$(this).parent().parent().next().next().slideDown();
		$(this).hide();
		return false;
	});
	
$('.download_app img').click(function() {
	
	   alert("download");
	});
	

/* *********************************** Form functions *********************************** */
		swapValue = [];
		$(".form_field").each(function(i){
			swapValue[i] = $(this).val();
			$(this).focus(function(){
				if ($(this).val() == swapValue[i]) {
					$(this).val("");
				}
				$(this).addClass("focus");
			}).blur(function(){
				if ($.trim($(this).val()) == "") {
					$(this).val(swapValue[i]);
					$(this).removeClass("focus");
				}
			});
		});		
});

