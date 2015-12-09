
/*
    Project:    BMW Mobile Redesign
    Agency:     KBS+ | Kirshenbaum Bond Senecal + Partners
    Developers: Tom Sunshine, Ben Ratliff
    Designer:   Chad O'Connell
    Producer:   Gabriela Cid
    
    Summary:    This page contains all routines integrating JSON data with the front-end HTML.
*/

var Config;

/* *********************************** Config ***************************************** */
Config = {
    beforeSend: function(xhr){
        var env = document.domain;
        if(env != "dev.m.bmwusa.com"){
            xhr.setRequestHeader('PROXY_URL', "http://dev.m.bmwusa.com");
            xhr.setRequestHeader('PROXY_AUTHORIZATION', "tsunshine:9uPaSW4s:ntlm");
            xhr.setRequestHeader('ACCESS_CONTROL_REQUEST_HEADERS',"Authorization, Origin, Accept, x-requested-with");
        }    },
    url: function(service){
        var env = document.domain;
        if(env == "apps.kbsp.com"||true){
            return "http://apps.kbsp.com:9292/"+service
        };        return "http://dev.m.bmwusa.com/"+service;
    }
}

/* *********************************** Homepage FMA *********************************** */
function loadFMA() {
    $.ajax({
        type: "GET",
        url: Config.url("Fmas/List/"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $("#home ul.carousel_pager").empty();
            $("#home .carousel_wrapper").empty();
            for (i=0; i<data.length; i++) {
                if (i==0) {
                    var carousel_paging = '<li class="carousel_page1"><img src="'+asset_path+'carousel_bullet_active.png" /></li>';
                } else {
                    var carousel_paging = '<li class="carousel_page'+(i+1)+'"><img src="'+asset_path+'carousel_bullet.png" /></li>';
                };
                var carousel_content = '<div class="carousel_page device-width device-height" style="background-image:url('+data[i].ImageUrl+')"><h2>'+data[i].Headline+'</h2><div class="button"><a href="'+data[i].CtaUrl+'">'+data[i].CtaText+'</a></div></div>';
                $("#home ul.carousel_pager").append(carousel_paging);
                $("#home .carousel_wrapper").append(carousel_content);
            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};


/* *********************************** Dealer Locator *********************************** */
function loadPMA(zipcode,distance) {

	var dealerID;
    $.ajax({
        type: "GET",
        url: Config.url("Dealers/ZipCode/?zipCode="+zipcode+"&distance="+distance),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            dealerID=data[0].DealerIdentifier;
			passDealer(dealerID)
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
    return dealerID;
	
};


/* *********************************** Special Offers Data *********************************** */
function loadSO() {
    $.ajax({
        type: "GET",
        url: Config.url("Offers/Search"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
			console.log(data);
            $("#offer_page .content h2").html(data.Offers[0].Name);
			$("#offer_page .content h3").html(data.Offers[0].Information);
			$("#offer_page .content p").html(data.Offers[0].Description);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
    	
};


/* *********************************** Newsfeed *********************************** */
function loadNews() {
    var content_element = 'ul#newslist';
    $.ajax({
        type: "GET",
        url: Config.url("News/Latest/?max=5&since=2013-01-01%2000:00:00&requireImage=false"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $(content_element).empty();
            for (i=0; i<data.length; i++) {
                if (data[i].ImageUrl==null) {
                    var news_item_content = '<li data-article="'+data[i].ArticleIdentifier+'"><strong>'+data[i].Title+'</strong><br />'+data[i].Excerpt+'</li>';
                } else {
                    var news_item_content = '<li data-article="'+data[i].ArticleIdentifier+'"><img src="'+data[i].ImageUrl+'" /><strong>'+data[i].Title+'</strong><br />'+data[i].Excerpt+'</li>';
                };
                $(content_element).append(news_item_content);
            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

function loadNewsArticle(article) {
    var content_element = '#news_page';
    $.ajax({
        type: "GET",
        url: Config.url("News/Article/"+article),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $(content_element).empty();
            if (data.ImageUrl==null) {
                var news_article_content = '<div class="content"><h1>'+data.Title+'</h1>'+data.Content+'</div>';
            } else {
                var news_article_content = '<img src="'+data.ImageUrl+'" id="news_image" class="device-width" /><div class="content"><h1>'+data.Title+'</h1>'+data.Content+'</div>';
            };
            $(content_element).append(news_article_content);
            updateURL('article');
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Owners Manuals and Videos *********************************** */
function loadOwnersLanding(NaModelCode) {
    var content_element = '#owner_videos .content';
    $(content_element).empty();

    $.ajax({
        type: "GET",
        url: Config.url("Owners/Manuals/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            var owner_content = '<ul>';
            for (i=0; i<data.length; i++) {
                owner_content = owner_content+'<li><h3>'+data[i].Title+'</h3><a class="download_btn" href="'+data[i].PdfUrl+'">Download Manual</a><li>';
            };
            owner_content=owner_content+'</ul>';
            $(content_element).append(owner_content);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });

    $.ajax({
        type: "GET",
        url: Config.url("Owners/Videos/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            var owner_content = '<ul>';
            for (i=0; i<data.length; i++) {
                owner_content = owner_content+'<li><h3>'+data[i].Title+'</h3><h4>'+data[i].Description+'</h4><a class="download_btn" href="'+data[i].VideoUrl+'">Play Movie</a><li>';
            };
            owner_content=owner_content+'</ul>';
            $(content_element).append(owner_content);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });

};

function manualMenu() {
    $('#manual_menu select#series_sort').change(function() { 
        loadOwners('style');
    });
    $('#manual_menu select#bodystyle_sort').change(function() { 
        loadOwners('model');
    });
    $('#manual_menu select#model_sort').change(function() { 
        loadOwners('year');
    });
    $('#manual_menu select#year_sort').change(function() { 
        loadOwners('complete');
    });
    $("#manuals").on("click", "div.button", function(event){
        loadOwnersLanding(NaModelCode);
        // show_back(true);
        $('#owner_videos').fadeIn(500);
        // updateTitle('Manuals &amp Videos');
        // updateURL('owners');
    });
};

function loadOwners(type) {
    var content_element = '#manual_menu';
    $.ajax({
        type: "GET",
        url: Config.url("Owners/Models/"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	$('#manual_menu select').width(device_width-69);
            if ((type=='series')||(type==undefined)) {
                $(content_element).empty();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="series" id="series_sort"><option selected="selected" disabled="disabled">Choose Series</option>';
                for (i=0; i<data.length; i++) {
                    model_content = model_content+'<option value="'+data[i].Name+'">Choose Series '+data[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#series_sort").customSelect();
                $('#manual_menu select#series_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
                
            } else if (type=='style') {
                $('#manual_menu select#bodystyle_sort').next('span').remove();
                $('#manual_menu select#bodystyle_sort').remove();
                $('#manual_menu select#model_sort').next('span').remove();
                $('#manual_menu select#model_sort').remove();
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="body" id="bodystyle_sort"><option selected="selected" disabled="disabled">Choose Body Style</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var bodyStyles = data[series_index].BodyStyles;
                for(i=0; i<bodyStyles.length; i++){
                    model_content=model_content+'<option value="'+bodyStyles[i].Name+'">'+bodyStyles[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#bodystyle_sort").customSelect();
                $('#manual_menu select#bodystyle_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='model') {
                $('#manual_menu select#model_sort').next('span').remove();
                $('#manual_menu select#model_sort').remove();
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="model" id="model_sort"><option selected="selected" disabled="disabled">Choose Model</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var models = data[series_index].BodyStyles[style_index].Models;
                for(i=0; i<models.length; i++){
                    model_content=model_content+'<option value="'+models[i].Name+'">'+models[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#model_sort").customSelect();
                $('#manual_menu select#model_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='year') {
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="model" id="year_sort"><option selected="selected" disabled="disabled">Choose Year</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var model_index = $("#manual_menu select#model_sort option:selected").index()-1;
                var years = data[series_index].BodyStyles[style_index].Models[model_index].Years;
                var year_array = Object.keys(years);
                for(i=0; i<year_array.length; i++){
                    model_content=model_content+'<option value="'+year_array[i]+'">'+year_array[i]+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#year_sort").customSelect();
                $('#manual_menu select#year_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='complete') {
            	$('#manuals div.button').animate({opacity: 1}, 250);
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var model_index = $("#manual_menu select#model_sort option:selected").index()-1;
                var year_index = $("#manual_menu select#year_sort option:selected").index()-1;
                var year_index_val = $("#manual_menu select#year_sort option:selected").val();
                var years = data[series_index].BodyStyles[style_index].Models[model_index].Years;
                NaModelCode = years[parseInt(year_index_val)];
            };
			$("#manual_menu .customStyleSelectBox").width(device_width-69);
			$("#manual_menu .customStyleSelectBoxInner").width(device_width-69);
            manualMenu();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Compare *********************************** */
var current_comparison_point = 0;
var compare_competitor1 = 0
var compare_competitor2 = 2;
var compare_data = {};
var compare_bar_values = [];
var compare_bar_rankings = [];
var animRate = 500;
var measureUnits = $("#comparison_chart div div").height() / 10;
//var measureUnits = $("#comparison_chart").height() / 10;

function formatDollar(num, dec) {
    var p = num.toFixed(2).split(".");
    if (dec) {
        return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    } else {
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    };        
};

function updateBarRankings() {
    var randomizer = Math.floor(Math.random()*3);
    compare_bar_rankings = [];
    data_sorted = compare_bar_values.slice(0).sort();
    for (var i = 0; i < compare_bar_values.length; i++) {
        compare_bar_rankings.push( data_sorted.indexOf(compare_bar_values[i])+6+randomizer);
    };
    animateBars(compare_bar_rankings[0],compare_bar_rankings[1],compare_bar_rankings[2]);
};

function updateCompareBarBMW() {
    var compare_content = '<h1>'+compare_data["BmwModel"]["Manufacturer"]+'</h1><br />'+compare_data["BmwModel"]["ModelName"];
    $('#compare #comparison_chart #column2 .bar_header').html(compare_content);

    var comparison_points = Object.keys(compare_data["BmwModel"]["ComparisonPoints"]);
    var value = compare_data["BmwModel"]["ComparisonPoints"][comparison_points[current_comparison_point]];
    compare_bar_values[1] = parseInt(value);
    if (current_comparison_point==0) {
        var value = '$<span>'+formatDollar(parseInt(value, false))+'</span>';
    } else if (current_comparison_point==1) {
        var value = '<span>'+value+'</span>hp';
    } else if (current_comparison_point==2) {
        var value = '<span>'+value+'</span>mpg';
    }; 
    var compare_content = '<h2>'+value+'</h2>';
    $('#compare #comparison_chart #column2 .bar_footer').html(compare_content);
};

function updateCompareBarCompetitor(column,competitor) {
    var compare_content = '<h1>'+compare_data["CompetitorModels"][competitor]["Manufacturer"]+'</h1><br />'+compare_data["CompetitorModels"][competitor]["ModelName"];
    $('#compare #comparison_chart #column'+column+' .bar_header').html(compare_content);

    var comparison_points = Object.keys(compare_data["CompetitorModels"][competitor]["ComparisonPoints"]);
    var value = compare_data["CompetitorModels"][competitor]["ComparisonPoints"][comparison_points[current_comparison_point]];
    compare_bar_values[column-1] = parseInt(value);
    if (current_comparison_point==0) {
        var value = '$<span>'+formatDollar(parseInt(value, false))+'</span>';
    } else if (current_comparison_point==1) {
        var value = '<span>'+value+'</span>hp';
    } else if (current_comparison_point==2) {
        var value = '<span>'+value+'</span>mpg';
    };
    var compare_content = '<h2>'+value+'</h2>';
    $('#compare #comparison_chart #column'+column+' .bar_footer').html(compare_content);
};

function updateCompareBars() {
    updateCompareBarCompetitor(1,compare_competitor1);
    updateCompareBarBMW();
    updateCompareBarCompetitor(3,compare_competitor2);
};

function animateBars(col1_height, col2_height, col3_height) {   
        var column1 = $("#column1");
        var column2 = $("#column2");
        var column3 = $("#column3");
        var colArray = [column1, column2, column3];
        var colHeight = [col1_height, col2_height, col3_height];
        //console.log(colHeight);
        for (i = 0; i < 3; i++) {
            colArray[i].find(".bar").animate({ 'height': (measureUnits * colHeight[i]) + "px"}, 100, function(){
			   headerPos = $(this).position().top;
            $(this).siblings(".bar_header").animate({ 'top': (headerPos) + "px"}, animRate);
			});
            
        };
};

function animateSinglebar(target, amount) {
    $(target).find(".bar").delay(400).animate({ 'height': (measureUnits * amount) + "px"}, animRate);
    var headerPos = 10 - amount;
    $(target).find(".bar_header").delay(500).animate({ 'top': (measureUnits * headerPos) + "px"}, animRate);
};

function reportPosition(currentPos) {   
    if($('#compare').css('display','block')) {
        updateCompareBars();
        updateBarRankings();
    };
};

function loadCompare() {
    $.ajax({
        type: "GET",
        url: Config.url("Models/Compare/"+NaModelCode),
        dataType: 'json',
        async: true,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            compare_data = data;
            updateCompareBars();
            updateBarRankings();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Homepage FMA *********************************** */
function loadFMA() {
    $.ajax({
        type: "GET",
        url: Config.url("Fmas/List/"),
        // url: 'Fmas_List.json',
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $("#home ul.carousel_pager").empty();
            $("#home .carousel_wrapper").empty();
            for (i=0; i<data.length; i++) {
                if (i==0) {
                    var carousel_paging = '<li class="carousel_page1"><img src="'+asset_path+'carousel_bullet_active.png" /></li>';
                } else {
                    var carousel_paging = '<li class="carousel_page'+(i+1)+'"><img src="'+asset_path+'carousel_bullet.png" /></li>';
                };
                var carousel_content = '<div class="carousel_page device-width device-height" style="background-image:url('+data[i].ImageUrl+')"><h2>'+data[i].Headline+'</h2><div class="button"><a href="'+data[i].CtaUrl+'">'+data[i].CtaText+'</a></div></div>';
                $("#home ul.carousel_pager").append(carousel_paging);
                $("#home .carousel_wrapper").append(carousel_content);
            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Homepage FMA *********************************** */
function loadModelOverview(bodystyleId) {
    var content_element = '#overview .content';
    $.ajax({
        type: "GET",
        url: Config.url("Models/ModelList/?seriesBodyStyleId="+bodystyleId),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	bodystyles_data = data;
            $(content_element).empty();

			var models_content = '<ul class="carousel_pager">';
		    for (i=0; i<bodystyles_data.length; i++) {
                if (i==0) {
                    models_content = models_content+'<li class="carousel_page1"><img src="'+asset_path+'carousel_bullet_active.png" /></li>';
                } else {
                    models_content = models_content+'<li class="carousel_page'+(i+1)+'"><img src="'+asset_path+'carousel_bullet.png" /></li>';
                };
			};                
			models_content = models_content+'</ul>';

			models_content = models_content+'<div class="carousel_wrapper device-height">';
		    for (j=0; j<bodystyles_data.length; j++) {
				console.log(bodystyle_selector.originid, bodystyles_data[j].Name);
                models_content = models_content+'<div class="carousel_page device-width device-height" style="background-image:url('+bodystyles_data[j].ImageUrl+')">';
                models_content = models_content+'<h4>Starting at '+formatDollar(bodystyles_data[j].Msrp,false)+'</h4>';
                models_content = models_content+'<h2>'+bodystyles_data[j].Name+'</h2>';
                models_content = models_content+'<div class="gallery_btn"></div>';
                models_content = models_content+'<div class="experience"></div>';
                models_content = models_content+'<div class="model_details device-width">';
                models_content = models_content+'<p><span>ENGINE:</span><br /><div class="engine_desc">'+bodystyles_data[j].EngineDescription+'</div></p>';
                models_content = models_content+'<p><span>'+bodystyles_data[j].FuelEconomy+'</span>(MPG '+bodystyles_data[j].FuelEconomyTag+')<span>'+bodystyles_data[j].Horsepower+'</span>(HP)<span>'+bodystyles_data[j].ZeroToSixtyTime+'</span>(0-60)</p>';
                models_content = models_content+'</div></div>';
			};                
			models_content = models_content+'</div>';

			$(content_element).html(models_content);

        },
        error: function (response){
            console.log('failure: '+response);
        }
    });

};

/* *********************************** Vehicle Selector: Models Modal *********************************** */
var bodystyles_data = {};

function loadModels(bodystyleId) {
    var content_element = '#model_content_container';
    $.ajax({
        type: "GET",
        url: Config.url("Models/ModelList/?seriesBodyStyleId="+bodystyleId),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	bodystyles_data = data;
            $(content_element).empty();

			var models_content = '<p>Select Model:</p><div id="model_content_list">';
			var someContent = false;
		    for (j=0; j<bodystyles_data.length; j++) {
				console.log(bodystyle_selector.originid, bodystyles_data[j].Name, bodystyles_data[j].CompareAllowed, bodystyles_data[j].ConfiguratorAllowed);
		    	if ((bodystyle_selector.originid=='compare' && bodystyles_data[j].CompareAllowed) || (bodystyle_selector.originid=='build' && bodystyles_data[j].ConfiguratorAllowed)) {
		    		someContent = true;
				    models_content = models_content+'<div class="model_selector_choice" data-namodelcode="'+bodystyles_data[j].NaModelCode+'" data-model="'+bodystyles_data[j].Name+'">';
				    models_content = models_content+bodystyles_data[j].Name+'</div>';
				};
			};                
			models_content = models_content+'</div>';

			$('#model_navcontainer h1').html(bodystyle_selector.series+' '+bodystyle_selector.bodystyle);

			if (!someContent) {
				$('#model_content_container').html('We\'re sorry, but you cannot '+bodystyle_selector.originid+' this '+bodystyles_data[0].BodyStyle.Name+'.');
				return;
			};

			$('#model_content_container').html(models_content);

        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Vehicle Selector: Bodystyles Modal *********************************** */

function loadVehicles() {
    var content_element = '#grid';
    $.ajax({
        type: "GET",
        url: Config.url("Models/NavigationSeriesBodyStyleList/?includeModels=true"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	vehicles_data = data;
            $(content_element).empty();
            for (i=0; i<vehicles_data.length; i++) {
                vehicles_content = '<div id="col-'+(i+1)+'" class="col" data-series="'+(i+1)+'">';
                vehicles_content = vehicles_content+'<div id="page-'+(i+1)+'-1" class="page device-width device-height" style="background-image:url('+vehicles_data[i]["HeroModelImageUrl"]+')">';
                vehicles_content = vehicles_content+'<div class="content"><h4>Starting at $'+formatDollar(vehicles_data[i]["SeriesBodyStyles"][0]["HeroModelStartingMsrp"],false)+'</h4>';
                vehicles_content = vehicles_content+'<h2>'+vehicles_data[i]["Name"]+' Series</h2>';
                vehicles_content = vehicles_content+'<div class="bodystyle_select_series button" data-seriesid="'+vehicles_data[i]["Name"]+' Series" ><a>Body Style</a></div></div></div>';
                vehicles_content = vehicles_content+'<div class="bodystyles" data-series="'+vehicles_data[i]["Name"]+' Series" style="display:none;">';
	            for (j=0; j<vehicles_data[i]["SeriesBodyStyles"].length; j++) {
	                vehicles_content = vehicles_content+'<div class="bodystyle_selector_thumb device-width" data-namodelcode="'+vehicles_data[i]["SeriesBodyStyles"][j]["Models"][0]["NaModelCode"]+'" data-bodystyle="'+vehicles_data[i]["SeriesBodyStyles"][j]["BodyStyleName"]+'" data-bodystyleId="'+vehicles_data[i]["SeriesBodyStyles"][j]["Identifier"]+'" style="background-image:url('+vehicles_data[i]["SeriesBodyStyles"][j]["HeroModelImageUrl"]+')">';
	                vehicles_content = vehicles_content+'<div class="content"><h2>'+vehicles_data[i]["SeriesBodyStyles"][j]["BodyStyleName"]+'</h2></div></div>';				};                				vehicles_content = vehicles_content+'</div>';				$(content_element).append(vehicles_content);            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });};

/* *********************************** Vehicle Selector: Series Navigation *********************************** */
var lines_data = {};

function loadLines() {
    var content_element = '#nav_lines ul';
    $.ajax({
        type: "GET",
        url: Config.url("Models/NavigationSeriesBodyStyleList/?includeModels=false"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	lines_data = data;
            $(content_element).empty();
            for (i=0; i<lines_data.length; i++) {
                var nav_lines_content = '<li>'+lines_data[i].Name+'</li>';
                $(content_element).append(nav_lines_content);
            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};


/* *********************************** Dealer Locator *********************************** */
function loadPMA(zipcode,distance) {
	var dealerID;
    $.ajax({
        type: "GET",
        url: Config.url("Dealers/ZipCode/?zipCode="+zipcode+"&distance="+distance),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            dealerID=data[0].DealerIdentifier;
			passDealer(dealerID)
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
    return dealerID;
};


/* *********************************** Special Offers Data *********************************** */
function loadSO() {
    $.ajax({
        type: "GET",
        url: Config.url("Offers/Search"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
			console.log(data);
            $("#offer_page .content h2").html(data.Offers[0].Name);
			$("#offer_page .content h3").html(data.Offers[0].Information);
			$("#offer_page .content p").html(data.Offers[0].Description);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
    	
};


/* *********************************** Newsfeed *********************************** */
function loadNews() {
    var content_element = 'ul#newslist';
    $.ajax({
        type: "GET",
        url: Config.url("News/Latest/?max=5&since=2013-01-01%2000:00:00&requireImage=false"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $(content_element).empty();
            for (i=0; i<data.length; i++) {
                if (data[i].ImageUrl==null) {
                    var news_item_content = '<li data-article="'+data[i].ArticleIdentifier+'"><strong>'+data[i].Title+'</strong><br />'+data[i].Excerpt+'</li>';
                } else {
                    var news_item_content = '<li data-article="'+data[i].ArticleIdentifier+'"><img src="'+data[i].ImageUrl+'" /><strong>'+data[i].Title+'</strong><br />'+data[i].Excerpt+'</li>';
                };
                $(content_element).append(news_item_content);
            };
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

function loadNewsArticle(article) {
    var content_element = '#news_page';
    $.ajax({
        type: "GET",
        url: Config.url("News/Article/"+article),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            $(content_element).empty();
            if (data.ImageUrl==null) {
                var news_article_content = '<div class="content"><h1>'+data.Title+'</h1>'+data.Content+'</div>';
            } else {
                var news_article_content = '<img src="'+data.ImageUrl+'" id="news_image" class="device-width" /><div class="content"><h1>'+data.Title+'</h1>'+data.Content+'</div>';
            };
            $(content_element).append(news_article_content);
            updateURL('article');
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Owners Manuals and Videos *********************************** */
function loadOwnersLanding(NaModelCode) {
    var content_element = '#owner_videos .content';
    $(content_element).empty();

    $.ajax({
        type: "GET",
        url: Config.url("Owners/Manuals/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            var owner_content = '<ul>';
            for (i=0; i<data.length; i++) {
                owner_content = owner_content+'<li><h3>'+data[i].Title+'</h3><a class="download_btn" href="'+data[i].PdfUrl+'">Download Manual</a><li>';
            };
            owner_content=owner_content+'</ul>';
            $(content_element).append(owner_content);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });

    $.ajax({
        type: "GET",
        url: Config.url("Owners/Videos/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            var owner_content = '<ul>';
            for (i=0; i<data.length; i++) {
                owner_content = owner_content+'<li><h3>'+data[i].Title+'</h3><h4>'+data[i].Description+'</h4><a class="download_btn" href="'+data[i].VideoUrl+'">Play Movie</a><li>';
            };
            owner_content=owner_content+'</ul>';
            $(content_element).append(owner_content);
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });

};

function manualMenu() {
    $('#manual_menu select#series_sort').change(function() { 
        loadOwners('style');
    });
    $('#manual_menu select#bodystyle_sort').change(function() { 
        loadOwners('model');
    });
    $('#manual_menu select#model_sort').change(function() { 
        loadOwners('year');
    });
    $('#manual_menu select#year_sort').change(function() { 
        loadOwners('complete');
    });
    $("#manuals").on("click", "div.button", function(event){
        loadOwnersLanding(NaModelCode);
        // show_back(true);
        $('#owner_videos').fadeIn(500);
        // updateTitle('Manuals &amp Videos');
        // updateURL('owners');
    });
};

function loadOwners(type) {
    var content_element = '#manual_menu';
    $.ajax({
        type: "GET",
        url: Config.url("Owners/Models/"),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
        	$('#manual_menu select').width(device_width-69);
            if ((type=='series')||(type==undefined)) {
                $(content_element).empty();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="series" id="series_sort"><option selected="selected" disabled="disabled">Choose Series</option>';
                for (i=0; i<data.length; i++) {
                    model_content = model_content+'<option value="'+data[i].Name+'">Choose Series '+data[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#series_sort").customSelect();
                $('#manual_menu select#series_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
                
            } else if (type=='style') {
                $('#manual_menu select#bodystyle_sort').next('span').remove();
                $('#manual_menu select#bodystyle_sort').remove();
                $('#manual_menu select#model_sort').next('span').remove();
                $('#manual_menu select#model_sort').remove();
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="body" id="bodystyle_sort"><option selected="selected" disabled="disabled">Choose Body Style</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var bodyStyles = data[series_index].BodyStyles;
                for(i=0; i<bodyStyles.length; i++){
                    model_content=model_content+'<option value="'+bodyStyles[i].Name+'">'+bodyStyles[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#bodystyle_sort").customSelect();
                $('#manual_menu select#bodystyle_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='model') {
                $('#manual_menu select#model_sort').next('span').remove();
                $('#manual_menu select#model_sort').remove();
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="model" id="model_sort"><option selected="selected" disabled="disabled">Choose Model</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var models = data[series_index].BodyStyles[style_index].Models;
                for(i=0; i<models.length; i++){
                    model_content=model_content+'<option value="'+models[i].Name+'">'+models[i].Name+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#model_sort").customSelect();
                $('#manual_menu select#model_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='year') {
                $('#manual_menu select#year_sort').next('span').remove();
                $('#manual_menu select#year_sort').remove();
                $('#manuals div.button').animate({opacity: 0}, 250);
                var model_content = '<select name="model" id="year_sort"><option selected="selected" disabled="disabled">Choose Year</option>';
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var model_index = $("#manual_menu select#model_sort option:selected").index()-1;
                var years = data[series_index].BodyStyles[style_index].Models[model_index].Years;
                var year_array = Object.keys(years);
                for(i=0; i<year_array.length; i++){
                    model_content=model_content+'<option value="'+year_array[i]+'">'+year_array[i]+'</option>';
                };
                model_content = model_content+'</select>';
                $(content_element).append(model_content);
                $("#manual_menu select#year_sort").customSelect();
                $('#manual_menu select#year_sort').next('span').css('opacity',0).animate({opacity: 1}, 250);
            } else if (type=='complete') {
            	$('#manuals div.button').animate({opacity: 1}, 250);
                var series_index = $("#manual_menu select#series_sort option:selected").index()-1;
                var style_index = $("#manual_menu select#bodystyle_sort option:selected").index()-1;
                var model_index = $("#manual_menu select#model_sort option:selected").index()-1;
                var year_index = $("#manual_menu select#year_sort option:selected").index()-1;
                var year_index_val = $("#manual_menu select#year_sort option:selected").val();
                var years = data[series_index].BodyStyles[style_index].Models[model_index].Years;
                NaModelCode = years[parseInt(year_index_val)];
            };
			$("#manual_menu .customStyleSelectBox").width(device_width-69);
			$("#manual_menu .customStyleSelectBoxInner").width(device_width-69);
            manualMenu();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Compare *********************************** */
var current_comparison_point = 0;
var compare_competitor1 = 0
var compare_competitor2 = 1;
var compare_data = {};
var compare_bar_values = [];
var compare_bar_rankings = [];
var animRate = 500;
var measureUnits = $("#comparison_chart div div").height() / 10;
//var measureUnits = $("#comparison_chart").height() / 10;

function formatDollar(num, dec) {
    var p = num.toFixed(2).split(".");
    if (dec) {
        return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    } else {
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    };        
};

function updateBarRankings() {
    var randomizer = Math.floor(Math.random()*3)
    compare_bar_rankings = [];
    data_sorted = compare_bar_values.slice(0).sort();
    for (var i = 0; i < compare_bar_values.length; i++) {
        compare_bar_rankings.push( data_sorted.indexOf(compare_bar_values[i])+6+randomizer);
    };
    animateBars(compare_bar_rankings[0],compare_bar_rankings[1],compare_bar_rankings[2]);
};

function updateCompareBarBMW() {
    var compare_content = '<h1>'+compare_data["BmwModel"]["Manufacturer"]+'</h1><br />'+compare_data["BmwModel"]["ModelName"];
    $('#compare #comparison_chart #column2 .bar_header').html(compare_content);

    var comparison_points = Object.keys(compare_data["BmwModel"]["ComparisonPoints"]);
    var value = compare_data["BmwModel"]["ComparisonPoints"][comparison_points[current_comparison_point]];
    compare_bar_values[1] = parseInt(value);
    if (current_comparison_point==0) {
        var value = '$<span>'+formatDollar(parseInt(value, false))+'</span>';
    } else if (current_comparison_point==1) {
        var value = '<span>'+value+'</span>hp';
    } else if (current_comparison_point==2) {
        var value = '<span>'+value+'</span>mpg';
    }; 
    var compare_content = '<h2>'+value+'</h2>';
    $('#compare #comparison_chart #column2 .bar_footer').html(compare_content);
};

function updateCompareBarCompetitor(column,competitor) {
    var compare_content = '<h1>'+compare_data["CompetitorModels"][competitor]["Manufacturer"]+'</h1><br />'+compare_data["CompetitorModels"][competitor]["ModelName"];
    $('#compare #comparison_chart #column'+column+' .bar_header').html(compare_content);

    var comparison_points = Object.keys(compare_data["CompetitorModels"][competitor]["ComparisonPoints"]);
    var value = compare_data["CompetitorModels"][competitor]["ComparisonPoints"][comparison_points[current_comparison_point]];
    compare_bar_values[column-1] = parseInt(value);
    if (current_comparison_point==0) {
        var value = '$<span>'+formatDollar(parseInt(value, false))+'</span>';
    } else if (current_comparison_point==1) {
        var value = '<span>'+value+'</span>hp';
    } else if (current_comparison_point==2) {
        var value = '<span>'+value+'</span>mpg';
    };
    var compare_content = '<h2>'+value+'</h2>';
    $('#compare #comparison_chart #column'+column+' .bar_footer').html(compare_content);
};

function updateCompareBars() {
    updateCompareBarCompetitor(1,compare_competitor1);
    updateCompareBarBMW();
    updateCompareBarCompetitor(3,compare_competitor2);
};

function animateBars(col1_height, col2_height, col3_height) {   
        var column1 = $("#column1");
        var column2 = $("#column2");
        var column3 = $("#column3");
        var colArray = [column1, column2, column3];
        var colHeight = [col1_height, col2_height, col3_height];
        //console.log(colHeight);
        for (i = 0; i < 3; i++) {
            colArray[i].find(".bar").animate({ 'height': (measureUnits * colHeight[i]) + "px"}, 100, function(){
			   headerPos = $(this).position().top;
            $(this).siblings(".bar_header").animate({ 'top': (headerPos) + "px"}, animRate);
			});
            
        };
};

function animateSinglebar(target, amount) {
    $(target).find(".bar").delay(400).animate({ 'height': (measureUnits * amount) + "px"}, animRate);
    var headerPos = 10 - amount;
    $(target).find(".bar_header").delay(500).animate({ 'top': (measureUnits * headerPos) + "px"}, animRate);
};

function reportPosition(currentPos) {   
    if($('#compare').css('display','block')) {
        updateCompareBars();
        updateBarRankings();
    };
};

function loadCompare() {
    $.ajax({
        type: "GET",
        url: Config.url("Models/Compare/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            compare_data = data;
            updateCompareBars();
            updateBarRankings();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};

/* *********************************** Build Your Own *********************************** */
var build_data = {};

var current_build = {
    "angle": "405",
    "paint_code": "P0A61",
    "wheel_code": "S02K5",
    "fabric_code": "FKAGE",
    "trim_code": "S0302",
    "accent_code": "S0521"
};

var byo_environments = new Array(
    "bg_01.jpg",
    "bg_02.jpg",
    "bg_03.jpg"
);

var byo_environment_index = 0;
var byo_pov = 'walkaround';

function updateMaterials() {
    var content_element = '#materials_tray';
	$(content_element).empty();
    for (i=0; i<build_data.Paints.length; i++) {
    	build_data.Paints[i].IsSelected ? material_active = ' active' : material_active = '';
    	i==0 ? category_marker = ' id="cat1"' : category_marker = '';
    	build_data.Paints[i].Warnings!==null ? warning = build_data.Paints[i].Warnings : warning = '';
    	build_data.Paints[i].Warnings!==null ? warning_icon = '<div class="icon_warning"></div>' : warning_icon = '';
		var materials_content = '<li class="paint'+material_active+'"'+category_marker+' data-code="'+build_data.Paints[i].Code+'" data-warning="'+warning+'">'+warning_icon+'<img src="'+build_data.Paints[i].ImageUrl+'" /><h3>'+build_data.Paints[i].Name+'</h3></li>';
        $(content_element).append(materials_content);
    };
    for (i=0; i<build_data.Wheels.length; i++) {
    	build_data.Wheels[i].IsSelected ? material_active = ' active' : material_active = '';
    	i==0 ? category_marker = ' id="cat2"' : category_marker = '';
    	build_data.Wheels[i].Warnings!==null ? warning = build_data.Wheels[i].Warnings : warning = '';
    	build_data.Wheels[i].Warnings!==null ? warning_icon = '<div class="icon_warning"></div>' : warning_icon = '';
		var materials_content = '<li class="wheel'+material_active+'"'+category_marker+' data-code="'+build_data.Wheels[i].Code+'" data-warning="'+warning+'">'+warning_icon+'<img src="'+build_data.Wheels[i].ImageUrl+'&RESP=PNG&TOLERANCE=6&ALIASED=1" /><h3>'+build_data.Wheels[i].Name+'</h3></li>';
        $(content_element).append(materials_content);
    };
    for (i=0; i<build_data.Upholsteries.length; i++) {
    	build_data.Upholsteries[i].IsSelected ? material_active = ' active' : material_active = '';
    	i==0 ? category_marker = ' id="cat3"' : category_marker = '';
    	build_data.Upholsteries[i].Warnings!==null ? warning = build_data.Upholsteries[i].Warnings : warning = '';
    	build_data.Upholsteries[i].Warnings!==null ? warning_icon = '<div class="icon_warning"></div>' : warning_icon = '';
		var materials_content = '<li class="fabric'+material_active+'"'+category_marker+' data-code="'+build_data.Upholsteries[i].Code+'" data-warning="'+warning+'">'+warning_icon+'<img src="'+build_data.Upholsteries[i].ImageUrl+'" /><h3>'+build_data.Upholsteries[i].Name+'</h3></li>';
        $(content_element).append(materials_content);
    };
    for (i=0; i<build_data.Trims.length; i++) {
    	build_data.Trims[i].IsSelected ? material_active = ' active' : material_active = '';
    	i==0 ? category_marker = ' id="cat4"' : category_marker = '';
    	build_data.Trims[i].Warnings!==null ? warning = build_data.Trims[i].Warnings : warning = '';
    	build_data.Trims[i].Warnings!==null ? warning_icon = '<div class="icon_warning"></div>' : warning_icon = '';
		var materials_content = '<li class="fabric'+material_active+'"'+category_marker+' data-code="'+build_data.Trims[i].Code+'" data-warning="'+warning+'">'+warning_icon+'<img src="'+build_data.Trims[i].ImageUrl+'" /><h3>'+build_data.Trims[i].Name+'</h3></li>';
        $(content_element).append(materials_content);
    };
    for (i=0; i<build_data.TrimAccents.length; i++) {
    	build_data.TrimAccents[i].IsSelected ? material_active = ' active' : material_active = '';
    	i==0 ? category_marker = ' id="cat5"' : category_marker = '';
    	build_data.TrimAccents[i].Warnings!==null ? warning = build_data.TrimAccents[i].Warnings : warning = '';
    	build_data.TrimAccents[i].Warnings!==null ? warning_icon = '<div class="icon_warning"></div>' : warning_icon = '';
		var materials_content = '<li class="fabric'+material_active+'"'+category_marker+' data-code="'+build_data.TrimAccents[i].Code+'" data-warning="'+warning+'">'+warning_icon+'<img src="'+build_data.TrimAccents[i].ImageUrl+'" /><h3>'+build_data.TrimAccents[i].Name+'</h3></li>';
        $(content_element).append(materials_content);
    };
};

function updateCar() {
    if (current_build.angle>360) { current_build.angle=current_build.angle-360; }
    if (current_build.angle<0) { current_build.angle=current_build.angle+360; }
    if (byo_pov=='walkaround') {
		// var image_src = 'http://208.39.96.118/cosy/cosy?pov='+byo_pov+'&angle='+current_build.angle+'&brand=WBBM&vehicle=123C&client=byo&BKGND=TRANSPARENT&RESP=PNG&paint='+current_build.paint_code+'&fabric='+current_build.fabric_code+'&sa='+current_build.wheel_code+','+current_build.trim_code+','+current_build.accent_code+'&width='+device_width;
		var image_src = build_data.ExteriorImageUrl+'&angle='+current_build.angle+'&BKGND=TRANSPARENT&RESP=PNG&width='+device_width;
		image_src = image_src.replace('frontside', 'walkaround');
		$('#stage img').bind('load', function() {
		    $('#stage img').attr('height','auto').css('bottom','40px');
		});
    } else {
		var image_src = build_data.InteriorImageUrl+'&angle='+current_build.angle+'&BKGND=TRANSPARENT&RESP=PNG&height='+byo_stage_height;
        // var image_src = 'http://208.39.96.118/cosy/cosy?pov='+byo_pov+'&angle='+current_build.angle+'&brand=WBBM&vehicle=123C&client=byo&BKGND=TRANSPARENT&RESP=PNG&paint='+current_build.paint_code+'&fabric='+current_build.fabric_code+'&sa='+current_build.wheel_code+','+current_build.trim_code+','+current_build.accent_code+'&height='+byo_stage_height;
        $('#stage img').bind('load', function() {
            $('#stage img').attr('height','100%').css('bottom',0);
        });
    };
    $('#stage img').attr('src',image_src);
};

function updateEnvironment() {
    if (byo_environment_index>byo_environments.length-1) { byo_environment_index=0; }
    if (byo_environment_index<0) { byo_environment_index=byo_environments.length-1; }
    if (byo_pov=='walkaround') {
        $('#build_your_own #stage').css('background-image','url('+asset_path+'byo_environments/'+byo_environments[byo_environment_index]+')');
	} else {
        $('#build_your_own #stage').css('background-image','url('+asset_path+'byo_environments/'+byo_environments[byo_environment_index]+')');
	    // $('#build_your_own #stage').css('background-image','none');
	};
};


function updateStage(direction) {
    // console.log(direction);
    if (direction=='left') {
        current_build.angle=current_build.angle+byo_rotation_amount;
        updateCar();
    } else if (direction=='right') {
        current_build.angle=current_build.angle-byo_rotation_amount;
        updateCar();
    } else if (direction=='up') {
    	byo_environment_index--;
    	updateEnvironment();
    } else if (direction=='down') {
    	byo_environment_index++;
    	updateEnvironment();
    } else {
    	updateCar();
    	updateEnvironment();
    };
};


function loadBuild_initialConfig() {
	$('#build_your_own ul#materials_tray').css('left',0);
	$('#warning').hide();

    $.ajax({
        type: "GET",
        url: Config.url("Build/InitialConfiguration/"+NaModelCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            build_data = data;
            updateStage();
            updateMaterials();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};


function loadBuild_addOption(optionCode) {
    $.ajax({
        type: "GET",
        url: Config.url("Build/AddOption/"+NaModelCode+"?option="+optionCode),
        dataType: 'json',
        async: false,
        data: {},
        beforeSend: Config.beforeSend,
        success: function (data){
            build_data = data;
            updateStage();
            updateMaterials();
        },
        error: function (response){
            console.log('failure: '+response);
        }
    });
};


