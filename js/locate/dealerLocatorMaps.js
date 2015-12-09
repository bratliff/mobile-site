/// <reference path="~/JavaScript/Utilities/GeoLocation.js" />
/// <reference path="~/JavaScript/jQuery/plugins/jquery.tipTip.minified.js" />


// Constants
var SearchByAddress = '1';
var SearchByDealerName = '2';

var NVSService = 'N';
var CPOService = 'C';
var CBSService = 'S';
var CCRCService = 'E';
var MCertified = 'M';

//var MYBMW_URL = 'https://' + RESOURCE_SERVER_URL + '/mybmw';

// intialize globals
var infoBox = null;
var searchBy = SearchByAddress;
var filterBy = NVSService;

var dealerNameSearchArray = [];
var selectedDealerId = '';
var selectedPlace = null;
var dealerName = '';

var markerClusterer = null;
var map = null;
var mapInitialized = false;
var mapMinZoom = 4;
var mapInitialZoom = 4;
var mapClustererMaxZoom = 6;
var changed_hash = false;


var infoBox = null;
var isInfoBoxDisplayed = false;
var selectedMarker = null;
var addedDirectionMarker = null;
var addedDealerMarker = null;
var serviceInfoBox = null;
var markers = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer(
{
    suppressMarkers: true,
    suppressInfoWindows: true
});

var CalulateZIndex = function(latlng)
{
    var z = 1000 * (90 - latlng.lat());
    return parseInt(z);
};

var dealer = 'dealer';

var markerShadow = new google.maps.MarkerImage('http://cache.bmwusa.com/image_8a4f74cd-afc9-4e94-bfee-8a72a4a0d6f6.arox?v=1',
// The shadow image is larger in the horizontal dimension
// while the position and offset are the same as for the main image.
    //new google.maps.Size(65, 45),
	new google.maps.Size(300, 400),
    new google.maps.Point(24, 0),
    new google.maps.Point(0, 45));

function getQueryString()
{
    var result = {}, queryString = location.search.substring(1),
      re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString))
    {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}

function BoundsRelativePositionHelper(map)
{
    var self = this;
    var penultimateBoundsRelativePosition = null;
    var previousBoundsRelativePosition = null;
    var stickyMarker = null;
    var currentInfoBox = null;
    var isFromMouseWheel = false;
    var isForcedZoomToRefreshBounds = false;
    var GetBoundsRelativePositionOfMarker = function()
    {
        // This function should be called on the center_changed event to save the bounds relative position.
        // It also should be called during the selecting of the marker to set the initial position.
        if (stickyMarker == null)
        {
            return null;
        }

        // Unfortunately, the google maps internal zoom_changed handler will cause a center_changed
        //  event when it repositions for the zoom, and this happens before our zoom_changed handler,
        //  so the code here also saves the penultimate bounds relative position.
        penultimateBoundsRelativePosition = previousBoundsRelativePosition;

        var mapBounds = map.getBounds();
        if ((mapBounds == null) || (mapBounds == undefined))
        {
            return;
        }

        var ne = mapBounds.getNorthEast();
        var sw = mapBounds.getSouthWest();
        var markerPosition = stickyMarker.getPosition();

        // x and y represent the percentage of the width/height from the center that the marker is placed.
        previousBoundsRelativePosition = {
            x: ((markerPosition.lng() - ((ne.lng() + sw.lng()) / 2)) / (ne.lng() - sw.lng())),
            y: ((markerPosition.lat() - ((ne.lat() + sw.lat()) / 2)) / (sw.lat() - ne.lat()))
        };
        isFromMouseWheel = true;
        setTimeout(function()
        {
            isFromMouseWheel = false;
        }, 100);
    };
    var SetBoundsRelativePositionOfMarker = function()
    {
        // This function should be called on the zoom_changed event to set the bounds relative position to
        //  its position saved from the previous zoom.
        if (stickyMarker == null)
        {
            return;
        }

        if (currentInfoBox != null)
        {
            currentInfoBox.hide();
        }

        if (isForcedZoomToRefreshBounds == true)
        {
            return;
        }
        isForcedZoomToRefreshBounds = true;
        // Force full zoom processing to refresh bounds.
        map.setZoom(map.getZoom());
        isForcedZoomToRefreshBounds = false;

        var mapBounds = map.getBounds();
        if ((mapBounds == null) || (mapBounds == undefined))
        {
            return;
        }

        // We turn off the "sticky" marker feature when directions are displayed because google maps likes
        //  to center and zoom on the highlighted route.
        if (directionsDisplay.getMap() != undefined)
        {
            return;
        }

        var ne = mapBounds.getNorthEast();
        var sw = mapBounds.getSouthWest();
        var markerPosition = stickyMarker.getPosition();
        var boundsRelativePosition = null;
        if (isFromMouseWheel)
        {
            boundsRelativePosition = penultimateBoundsRelativePosition;
        }
        else
        {
            boundsRelativePosition = previousBoundsRelativePosition;
        }
        var newCenter = new google.maps.LatLng(markerPosition.lat() - (boundsRelativePosition.y * (sw.lat() - ne.lat())), markerPosition.lng() - (boundsRelativePosition.x * (ne.lng() - sw.lng())));
        var oldBoundsRelativePosition = boundsRelativePosition;
        map.setCenter(newCenter);


        // Our panTo call has just destroyed the previous saved position in its subsequent center_changed
        //  call, so we will restore it.
        penultimateBoundsRelativePosition = oldBoundsRelativePosition;
        previousBoundsRelativePosition = oldBoundsRelativePosition;
    };
    var ShowInfoBoxOnIdle = function()
    {
        if (currentInfoBox != null)
        {
            currentInfoBox.show();
        }
    };

    google.maps.event.addListener(map, 'center_changed', GetBoundsRelativePositionOfMarker);
    google.maps.event.addListener(map, 'zoom_changed', SetBoundsRelativePositionOfMarker);
    google.maps.event.addListener(map, 'idle', ShowInfoBoxOnIdle);

    self.SetStickyMarker = function(newStickyMarker, newInfoBox)
    {
        stickyMarker = newStickyMarker;
        currentInfoBox = newInfoBox;
        GetBoundsRelativePositionOfMarker(stickyMarker);
        penultimateBoundsRelativePosition = previousBoundsRelativePosition;
    };
    self.ClearStickyMarker = function()
    {
        stickyMarker = null;
        currentInfoBox = null;
    };
};

var globalBoundsRelativePositionHelper = null;

// the MyDealer object        
function MyDealer(dealerId, name, services, isMyBmw)
{
    var self = this;

    self.dealerId = dealerId;
    self.name = name;
    self.services = services;
    self.isMyBmw = isMyBmw;
}

// View Model of the Dealer Locator

var dealerLocatorViewModel = new DealerLocatorViewModel();



function DealerLocatorViewModel()
{
    var self = this;
    self.selectedDealerId = ko.observable('');
    self.startAddress = ko.observable('');
    self.endAddress = ko.observable('');
    self.distance = ko.observable('');
    self.duration = ko.observable('');
    self.steps = ko.observableArray();
    self.myDealers = ko.observableArray();
    self.showMyDealerAddedMessage = ko.observable(false);
    self.lastMyDealerAdded = ko.observable('');

    self.googleMapsUrl = ko.computed(function()
    {
        return 'http://maps.google.com?t=m&saddr=' + encodeURIComponent(self.startAddress()) + '&daddr=' + encodeURIComponent(self.endAddress());
    }),

    self.ClearDirections = function()
    {
        self.startAddress('');
        self.endAddress('');
        self.distance('');
        self.duration('');
        self.steps.removeAll();
    },

    self.RenderCompleted = function()
    {
        // refresh the scroll bars to insure they have the correct height
        UpdateScrollBar('directionsPanel');
        UpdateScrollBar('myDealersPanel');
    }

    self.AddMyPreferredDealer = function(dealerId, isMyBmw, showMessage)
    {
        if (dealerId == undefined)
        {
            dealerId = self.selectedDealerId();
        }

        if (isMyBmw == undefined)
        {
            isMyBmw = false;
        }

        if (showMessage == undefined)
        {
            showMessage = false;
        }

        // make sure the dealer is not already in the list
        for (var i in self.myDealers())
        {
            if (dealerId == self.myDealers()[i].dealerId)
            {
                return;
            }
        }
		
		self.dealer = FindDealer(dealerId);
        var dealer = FindDealer(dealerId);

        if (dealer != null)
        {
            var services = GetDealerServices(dealer);

            // if the dealer is a MyBMW dealer override the services.            
            if (dealer.Id == selectedSalesDealerId)
            {
                services = 'Your preferred sales center at ';
            }

            if (dealer.Id == selectedServiceDealerId)
            {
                services = 'Your preferred service center at ';
            }

            var dealerAdded = new MyDealer(dealerId, dealer.Name, services, isMyBmw);

            // add dealer to the myDealers array
            self.myDealers.push(dealerAdded);

            // update the cookie
            if (showMessage)
            {
                UpdateMyPreferredDealersCookie();
            }

            self.lastMyDealerAdded(dealer.Name + ' has been added to dealer list.');
            self.showMyDealerAddedMessage(showMessage);
        }
    }

    self.MyDealerSelected = function(myDealer)
    {
        // need to select the dealer on the map and popup the bubble
        SelectDealerMarker(myDealer.dealerId);
    }

    self.MyDealerRemoveByDealerId = function(dealerId)
    {
        for (var i in self.myDealers())
        {
            if (dealerId == self.myDealers()[i].dealerId)
            {
                self.MyDealerRemove(self.myDealers()[i]);
                return;
            }
        }
    }

    // remove the clicked dealer from the list and update the cookie
    self.MyDealerRemove = function(myDealer)
    {
        self.myDealers.remove(myDealer);
        UpdateMyPreferredDealersCookie();
        self.lastMyDealerAdded(myDealer.name + ' has been removed from dealer list.');
        self.showMyDealerAddedMessage(true);
    }
};

// custom knockout binding to show a message and then slide it up
ko.bindingHandlers.showAndSlideUpText =
{
    update: function(element, valueAccessor)
    {
        if (dealerLocatorViewModel.showMyDealerAddedMessage())
        {
            ko.bindingHandlers.text.update(element, valueAccessor);
            UpdateScrollBar('myDealersPanel');
            $(element).show();
            $(element).delay(1000).slideUp(1000, function()
            {
                dealerLocatorViewModel.showMyDealerAddedMessage(false);
                dealerLocatorViewModel.lastMyDealerAdded('');
            });
        }
        else
        {
            $(element).hide();
        }
    }
};

ko.bindingHandlers.visibleInline =
{
    update: function(element, valueAccessor)
    {
        var value = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        if (valueUnwrapped)
        {
            if ($.browser.msie && $.browser.version == 7)
            {
                $(element).css({ 'display': 'inline' });
            }
            else
            {
                $(element).css({ 'display': 'inline-block' });
            }
        }
        else
        {
            $(element).css({ 'display': 'none' });
        }
    }
};

function GetDealerServices(dealer)
{
    var services = '';

    if (dealer.NVS != null)
    {
        services += 'New Vehicle Sales';
    }

    if (dealer.CPO != null)
    {
        if (services.length > 0 && services.charAt(services.length - 1) != ',')
        {
            services += ', ';
        }

        services += 'Certified Pre-Owned';
    }

    if (dealer.CBS != null)
    {
        if (services.length > 0 && services.charAt(services.length - 1) != ',')
        {
            services += ', ';
        }

        services += 'BMW Service';
    }

    if (dealer.CCRC != null)
    {
        if (services.length > 0 && services.charAt(services.length - 1) != ',')
        {
            services += ', ';
        }

        services += 'Certified Collision Repair Center';
    }

    return services;
}

// find the dealer in the Dealers array
function FindDealer(dealerId)
{
    for (var i in Dealers)
    {
        if (Dealers[i].Id == dealerId)
        {
			return Dealers[i];
			foundDealer = Dealers[i];
			
        }
    }

    return null;
}

//find dealer by name

function FindDealerbyName(dealerName)
			{
				for (var i in Dealers)
				{
					if (Dealers[i].Name == dealerName)
					{
						return Dealers[i];
						foundDealer = Dealers[i];
						
					}
				}
			
				return null;
			}


// update the cookie based on the myDealers array in the view model
function UpdateMyPreferredDealersCookie()
{
    var myPreferredDealersCookie = '';

    for (var i in dealerLocatorViewModel.myDealers())
    {
        if (!dealerLocatorViewModel.myDealers()[i].isMyBmw)
        {
            if (myPreferredDealersCookie.length != 0)
            {
                myPreferredDealersCookie += ',';
            }

            myPreferredDealersCookie += dealerLocatorViewModel.myDealers()[i].dealerId;
        }
    }

    CreateCookie('MyPreferredDealers', myPreferredDealersCookie, 365);
}

//Build the myDealers array in the view model based on the cookie and the logged in users preferred dealers
function BuildMyDealersArray()
{
    if (selectedSalesDealerId != undefined && selectedSalesDealerId != '')
    {
        var salesDealer = FindDealer(selectedSalesDealerId);

        if (salesDealer != null)
        {
            dealerLocatorViewModel.AddMyPreferredDealer(salesDealer.Id, true);
        }
    }

    if (selectedServiceDealerId != undefined && selectedServiceDealerId != '')
    {
        var serviceDealer = FindDealer(selectedServiceDealerId);

        if (serviceDealer != null)
        {
            dealerLocatorViewModel.AddMyPreferredDealer(serviceDealer.Id, true);
        }
    }

    LoadMyDealersFromCookie();
}

// load the myDealers array in the view model from the cookie
function LoadMyDealersFromCookie()
{
    var myPreferredDealersCookie = ReadCookie('MyPreferredDealers');

    if (myPreferredDealersCookie != null && myPreferredDealersCookie != '')
    {
        var myPreferredDealers = myPreferredDealersCookie.split(',');

        for (var i in myPreferredDealers)
        {
            dealerLocatorViewModel.AddMyPreferredDealer(myPreferredDealers[i], false);
            dealerLocatorViewModel.showMyDealerAddedMessage(false);
        }
    }
}

// CreateCookie utility function
function CreateCookie(name, value, days)
{
    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else
    {
        var expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

// ReadCookie utility function
function ReadCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++)
    {
        var c = ca[i];

        while (c.charAt(0) == ' ')
        {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0)
        {
            return c.substring(nameEQ.length, c.length);
        }
    }

    return null;
}

// build an array of unique dealer names for name search
function BuildDealerNameSearchArray()
{
    dealerNameSearchArray = [];

    for (var i in Dealers)
    {
        var dealer = Dealers[i];

        if (filterBy == 'N' && dealer.NVS != null)
        {
            var dealername = { "name": dealer.NVS.Name, "value": dealer.Id, "label": dealer.NVS.Name + ', ' + dealer.NVS.City + ', ' + dealer.NVS.State };

            dealerNameSearchArray.push(dealername);
        }

        if (filterBy == 'M' && dealer.NVS != null && dealer.MCertified == true)
        {
            var dealername = { "name": dealer.NVS.Name, "value": dealer.Id, "label": dealer.NVS.Name + ', ' + dealer.NVS.City + ', ' + dealer.NVS.State };

            dealerNameSearchArray.push(dealername);
        }

        if (filterBy == 'C' && dealer.CPO != null)
        {
            var dealername = { "name": dealer.CPO.Name, "value": dealer.Id, "label": dealer.CPO.Name + ', ' + dealer.CPO.City + ', ' + dealer.CPO.State };
            var found = false;

            for (var index in dealerNameSearchArray)
            {
                if (dealerNameSearchArray[index].name == dealername.name)
                {
                    found = true;
                }
            }

            if (!found)
            {
                dealerNameSearchArray.push(dealername);
            }
        }

        if (filterBy == 'S' && dealer.CBS != null)
        {
            var dealername = { "name": dealer.CBS.Name, "value": dealer.Id, "label": dealer.CBS.Name + ', ' + dealer.CBS.City + ', ' + dealer.CBS.State };
            var found = false;

            for (var index in dealerNameSearchArray)
            {
                if (dealerNameSearchArray[index].name == dealername.name)
                {
                    found = true;
                }
            }

            if (!found)
            {
                dealerNameSearchArray.push(dealername);
            }
        }

        if (filterBy == 'E' && dealer.CCRC != null)
        {
            var dealername = { "name": dealer.CCRC.Name, "value": dealer.Id, "label": dealer.CCRC.Name + ', ' + dealer.CCRC.City + ', ' + dealer.CCRC.State };
            var found = false;

            for (var index in dealerNameSearchArray)
            {
                if (dealerNameSearchArray[index].name == dealername.name)
                {
                    found = true;
                }
            }

            if (!found)
            {
                dealerNameSearchArray.push(dealername);
            }
        }
    }
}

function FilterDealerNames(request)
{
    var filteredNames = $.grep(dealerNameSearchArray,
        function(item)
        {
            var searchText = request.term.toLowerCase();
            var match = item.name.toLowerCase().indexOf(searchText) != -1;

            // They may be searching with the full label displayed in the search text box.
            if (!match)
            {
                match = (item.label.toLowerCase() == searchText);
            }

            if (match)
            {
                return item.label;
            }
        });

    while (filteredNames.length > 10)
    {
        filteredNames.pop();
    }

    return filteredNames;
}

// setup the autocomplete control to use the dealerNameSearchArray
function BindSearchToDealerName()
{
    $("#searchByDealerNameText").autocomplete(
    {
        minLength: 3,
        autofocus: true,
        source: function(request, response)
        {
            response(FilterDealerNames(request));
        },
        select: function(event, ui)
        {
            CreateCookie("SearchKeyword", 'D_' + ui.item.label + '_' + ui.item.value);

            SelectDealer(ui.item.value);
            SelectDealerMarker(ui.item.value);
            $('#searchByDealerNameText').val(ui.item.label);
            return false;
        },
        focus: function(event, ui)
        {
            $('#searchByDealerNameText').val(ui.item.label);
            return false;
        },
        open: function(event, ui)
        {
            $('#directionsContainer').hide();
            $('#myDealersContainer').hide();
            return false;
        },
        close: function(event, ui)
        {
            $('#directionsContainer').show();
            $('#myDealersContainer').show();
            return false;
        }
    });
}

// set the selected dealer
function SelectDealer(dealerId)
{

	selectedDealerId = dealerId;
    dealerLocatorViewModel.selectedDealerId(dealerId);

    var dealer = FindDealer(dealerId);
	//console.log(dealer);
	
	
	
    /*$('#directionsDealerName').text(dealer.Name);
    $('#directionsDealerStreetAddress').text(dealer.NVS.Address);
    $('#directionsDealerCityStateZip').text(dealer.NVS.City + ', ' + dealer.NVS.State + ' ' + dealer.NVS.Zip);*/
}

function SelectPMAFromAddress(address)

{
    var postalCode = '';
    var geocoder = new google.maps.Geocoder();

    closeInfoBox(infoBox);

    geocoder.geocode({ 'address': address },
        function(results, status)
        {
            if (status == google.maps.GeocoderStatus.OK)
            {
                if (results[0].address_components != undefined)
                {
                    for (var i in results[0].address_components)
                    {
                        if (results[0].address_components[i].types[0] == "postal_code")
                        {
							postalCode = results[0].address_components[i].short_name;
                            CreateCookie('SearchKeyword', 'A_' + address + '_' + postalCode);
							console.log("Postal Code " + postalCode);
							loadPMA(postalCode, 25);
							//map.fitBounds(results[0].geometry.viewport);
                            
                            return;
                        } else if (results[0].address_components[i].types[0] == "locality") {
							
							SelectPMAFromGeoLocation(new google.maps.LatLng(results[0].geometry.location.Xa, results[0].geometry.location.Ya))
							
						}
						
                    }

                    // if a postalCode is not found, then try to zoom that map to the location
                    if (results[0] != null)
                    {
                        if (results[0].geometry.viewport)
                        {
                            map.fitBounds(results[0].geometry.viewport);
                        }
                        else
                        {
                            map.setCenter(results[0].geometry.location);
                            map.setZoom(10);
                        }
                    }
                }
            }
            else
            {
                //alert("Geocode was not successful for the following reason: " + status);
            }
        }
    );

    return;
}

function SelectPMAFromGeoLocation(latLng)
{
    var postalCode = '';
    var geocoder = new google.maps.Geocoder();
	
    geocoder.geocode({ 'location': latLng },
        function(results, status)
        {
            if (status == google.maps.GeocoderStatus.OK)
            {
                if (results[0].address_components != undefined)
                {
                    for (var i in results[0].address_components)
                    {
                        if (results[0].address_components[i].types[0] == "postal_code")
                        {
						    postalCode = results[0].address_components[i].short_name;
							console.log(postalCode);
							loadPMA(postalCode, 25);
                            //SelectPMAOrClosestDealer(postalCode);
                            return;
                        }
                    }

                    // if a postalCode is not found, then try to zoom that map to the location
                    if (results[0] != null)
                    {
                        //InitializeMap();

                        if (results[0].geometry.viewport)
                        {
                            map.fitBounds(results[0].geometry.viewport);
                        }
                        else
                        {
                            map.setCenter(results[0].geometry.location);
                            map.setZoom(10);
                        }

                        return;
                    }
                }
            }

            //InitializeMap();

            map.setCenter(latLng);
            map.setZoom(10);
        }
    );

    return;
}
// setup the address search to use the google autocomplete api
function BindSearchToAddress()
{
    var options =
    {
        types: ['geocode']
    };

    var input = document.getElementById('searchByAddressText');

    autocomplete = new google.maps.places.Autocomplete(input, options);
    //autocomplete.setBounds(map.getBounds());

    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
        selectedPlace = autocomplete.getPlace();

        if (selectedPlace != null)
        {
            closeInfoBox(infoBox);

            var postalCode = '';

            if (selectedPlace.address_components != undefined)
            {
                for (var i in selectedPlace.address_components)
                {
                    if (selectedPlace.address_components[i].types[0] == "postal_code")
                    {
                        postalCode = selectedPlace.address_components[i].short_name;
                        CreateCookie('SearchKeyword', 'A_' + $('#searchByAddressText').val() + '_' + postalCode);
                        SelectPMAOrClosestDealer(postalCode);
                        return;
                    }
                }

            }
            else
            {
                SelectPMAFromAddress($('#searchByAddressText').val());
                return;
            }

            // if a postalCode is not found, then try to zoom that map to the location
            if (selectedPlace != null)
            {
                //Handle previously selected dealer, by closing infobox and changing icon
                closeInfoBox(infoBox);

                if (selectedPlace.geometry.viewport)
                {
                    map.fitBounds(selectedPlace.geometry.viewport);
                }
                else
                {
                    map.setCenter(selectedPlace.geometry.location);
                    map.setZoom(10);
                }
            }
        }
    });
}

// Select the PMA for the postalCode or if no PMA exists then find the nearest dealer
function SelectPMAOrClosestDealer(postalCode)
{
    var url = '';

    $.ajax({
        url: url,
        dataType: 'json',
        data: '',
        success: function(data)
        {
			console.log(data);
			if (data.Dealers.length > 0)
            {
                //InitializeMap();
				console.log("Dealer ID: " + data.Dealers[0].DealerId);
                SelectDealerMarker(data.Dealers[0].DealerId);
            }
            else
            {
                SelectClosestDealer(postalCode);
            }
        },
        error: function()
        {
            //InitializeMap();
        }
    });
}

// Select the nearest dealer to the postalCode
function SelectClosestDealer(postalCode)
{
    var url = 'http://' + WEBSITE_URL + '/services/dealerlocatorservice.svc/dealers/PostalCode/' + postalCode + '/' + filterBy;

    $.ajax({
        url: url,
        dataType: 'json',
        data: '',
        success: function(data)
        {
			console.log(data);
			if (data.Dealers.length > 0)
            {
                //InitializeMap();
                SelectDealerMarker(data.Dealers[0].DealerId);
            }
        },
        error: function()
        {
          
			InitializeMap();
        }
    });
}

// show the directions dropdown box
function ShowDirections(dealerId)
{
    if (dealerId == undefined)
    {
        dealerId = dealerLocatorViewModel.selectedDealerId();
    }

    $('#directions').removeClass('LinkRightArrowBlue');
    $('#directions').addClass('LinkUpArrowBlue');
    $('#directionsDropdown').show();
    $('#directionsPanel').jScrollPane();
    $('#myDealersContainer').hide();
}

// hide the directions dropdown box
function HideDirections()
{
    $('#directionsDropdown').hide();
    $('#myDealersContainer').show();
}

// clear directions drop down and remove map overlays
function ClearDirections()
{
    dealerLocatorViewModel.ClearDirections();

    // remove the origin marker
    markerClusterer.removeMarker(addedDirectionMarker);

    // reset selected dealer icon to non labeled version
    selectedMarker.setIcon('http://cache.bmwusa.com/image_16c22e53-0ae1-449e-9f44-9f30430e19b1.arox?v=1');
    selectedMarker.setShadow(markerShadow);

    HideDirectionsEmailPanel();
    directionsDisplay.setMap();

    UpdateScrollBar('directionsPanel');
}

function ShowFromAddressError(message)
{
    $('#directionsFromAddressError').html(message);
    $('#directionsFromAddressErrorBlock').show();
}

function ClearFromAddressError()
{
    $('#directionsFromAddressError').html('');
    $('#directionsFromAddressErrorBlock').hide();
}

// retrieve the directions from the google directions api and set the corresponding data in the view model
function GetDirections()
{
    console.log("directions");
	ClearFromAddressError();
    ClearDirections();

    if ($('#directionsFromText').val().length == 0)
    {
        ShowFromAddressError('Please enter a valid address.');
    }

    directionsDisplay.setMap(map);

    var origin = $('#directionsFromText').val();
    var destination = $('#directionsDealerStreetAddress').text() + ', ' + $('#directionsDealerCityStateZip').text();

    var request =
    {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status)
    {
        if (status == google.maps.DirectionsStatus.OK)
        {
            if (response.routes.length > 0 && response.routes[0].legs.length > 0 && response.routes[0].legs[0].steps.length > 0)
            {
                var leg = response.routes[0].legs[0];

                dealerLocatorViewModel.startAddress(leg.start_address);
                dealerLocatorViewModel.endAddress(leg.end_address);
                dealerLocatorViewModel.distance(leg.distance.text);
                dealerLocatorViewModel.duration(leg.duration.text);

                dealerLocatorViewModel.steps(leg.steps);

                // change dealer destination icon to B labeled icon
                selectedMarker.setIcon('http://cache.bmwusa.com/image_578e3a9a-bed9-4d2f-a2bd-3ddb69cd9aed.arox?v=1');
                selectedMarker.setShadow('');

                // added origin marker with icon as A labeled icon
                var marker = new google.maps.Marker(
                {
                    position: leg.start_location,
                    draggable: false,
                    icon: 'http://cache.bmwusa.com/image_1f7e5a83-ef47-412c-9cb7-edc597f2f5a7.arox?v=1',
                    title: 'Origin',
                    zIndex: CalulateZIndex(leg.start_location)
                });

                addedDirectionMarker = marker;
                markerClusterer.addMarker(marker);

                // plot directions
                directionsDisplay.setDirections(response);
            }
        }
        else
        {
            ShowFromAddressError('We are unable to calculate directions.')
        }
    });
}

// validate an email address
function ValidateEmail(elementValue)
{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}

function ShowDirectionsEmailPanel()
{
    $('#directionsEmailPanel').show();
    $('#emailAddressMessage').hide();
    $('#emailAddressMessage').html('');
    $('#emailAddressText').val('');
    $('#emailAddressText').watermark('Enter email address');
    UpdateScrollBar('directionsPanel');
}

function HideDirectionsEmailPanel()
{
    $('#directionsEmailPanel').hide();
    $('#emailAddressMessage').hide();
    $('#emailAddressMessage').html('');
    $('#emailAddressText').val('');

    UpdateScrollBar('directionsPanel');
}

function InfoBoxEmailButtonClick()
{
    if ($('#infoBoxEmailPanel').is(':hidden'))
    {
        ShowInfoBoxEmailPanel();
    }
    else
    {
        HideInfoBoxEmailPanel();
    }
}

function ShowInfoBoxEmailPanel()
{
    $('#infoBoxEmailPanel').show();
    $('#infoBoxServicesPanel').hide();
    $('#infoBoxEmailAddressMessage').hide();
    $('#infoBoxEmailAddressMessage').html('');
    $('#infoBoxEmailAddressText').val('');
    $('#infoBoxEmailAddressText').watermark('Enter email address');
    $('#infoBoxEmailAddressText').focus();
}

function HideInfoBoxEmailPanel()
{
    $('#infoBoxEmailPanel').hide();
    $('#infoBoxServicesPanel').show();
    $('#infoBoxEmailAddressMessage').hide();
    $('#infoBoxEmailAddressMessage').html('');
    $('#infoBoxEmailAddressText').val('');
}

function InfoBoxSendEmailButtonClick()
{
    if (!ValidateEmail($('#infoBoxEmailAddressText').val()))
    {
        $('#infoBoxEmailAddressMessage').addClass('Alert');
        $('#infoBoxEmailAddressMessage').show();
        $('#infoBoxEmailAddressMessage').html('Please enter a valid email address.');
    }
    else
    {
        SendInformationEmail(dealerLocatorViewModel.selectedDealerId(), $('#infoBoxEmailAddressText').val());
        $('#infoBoxEmailAddressMessage').removeClass('Alert');
        $('#infoBoxEmailAddressMessage').show();
        $('#infoBoxEmailAddressMessage').html('Dealer Information is sent.');
    }
}

function UpdateScrollBar(panel)
{
    $('#' + panel).jScrollPane();
}

function DirectionsSendEmailButtonClick()
{
    if (!ValidateEmail($('#emailAddressText').val()))
    {
        $('#emailAddressMessage').addClass('Alert');
        $('#emailAddressMessage').show();
        $('#emailAddressMessage').html('Please enter a valid email address.');
    }
    else
    {
        SendDirectionsEmail(dealerLocatorViewModel.selectedDealerId(), dealerLocatorViewModel.startAddress(), $('#emailAddressText').val());
        $('#emailAddressMessage').removeClass('Alert');
        $('#emailAddressMessage').show();
        $('#emailAddressMessage').html('Directions have been sent.');
    }
}

function SendDirectionsEmail(dealerId, origin, emailAddress)
{
    var url = 'http://' + WEBSITE_URL + '/services/dealerlocatorservice.svc/dealer/SendEmail/DealerDirections/' + dealerId + '/' + origin + '/' + emailAddress;

    $.ajax({
        url: url,
        dataType: 'json',
        data: '',
        success: function(data) { }
    });
}

function SendInformationEmail(dealerId, emailAddress)
{
    var url = 'http://' + WEBSITE_URL + '/services/dealerlocatorservice.svc/dealer/SendEmail/DealerInformation/' + dealerId + '/' + emailAddress;

    $.ajax({
        url: url,
        dataType: 'json',
        data: '',
        success: function(data) { }
    });
}

/*** HTML 5 Geolocation ****/
function html5_GeoLocation_error(error)
{
   //InitializeMap();

    //track error code
    switch (error.code)
    {
        case error.PERMISSION_DENIED:
            //alert("user did not share geolocation data");
            return false;
            break;
        case error.POSITION_UNAVAILABLE:
            //alert("could not detect current position");
            return false;
            break;
        case error.TIMEOUT:
            //alert("retrieving position timed out");
            return false;
            break;
        default:
            //alert("unknown error");
            return false;
            break;
    }
}

function html5_GeoLocation_success(position)

{
    if (position.coords)
    {
        SelectPMAFromGeoLocation(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }

    return false;
}

function refreshMap()
{
    var oldSelectedDealerId = null;
    var oldMarkerLatLng = null;

    if (selectedMarker != null)
    {
        oldSelectedDealerId = selectedMarker.get('id');
        oldMarkerLatLng = selectedMarker.getPosition();
    }

    selectedMarker = null;

    if (markerClusterer)
    {
        markerClusterer.clearMarkers();
        markers = [];
    }

    var latLng = null;
    var isSelected;
    var isSelectedFound = false;

    for (var i = 0; i < Dealers.length; ++i)
    {
        var item = Dealers[i];
        isSelected = Boolean(item.Id == oldSelectedDealerId);

        if (item != null)
        {
            switch (filterBy)
            {
                case 'N':
                    {
                        if (item.NVS != null)
                        {
                            if (isSelected)
                            {
                                isSelectedFound = true;
                            }
                            latLng = new google.maps.LatLng(item.NVS.Lat, item.NVS.Lng);
                            addMarker(latLng, item, isSelected);
                        }
                        break;
                    }
                case 'C':
                    {
                        if (item.CPO != null)
                        {
                            if (isSelected)
                            {
                                isSelectedFound = true;
                            }
                            latLng = new google.maps.LatLng(item.CPO.Lat, item.CPO.Lng);
                            addMarker(latLng, item, isSelected);
                        }
                        break;
                    }
                case 'S':
                    {
                        if (item.CBS != null)
                        {
                            if (isSelected)
                            {
                                isSelectedFound = true;
                            }
                            latLng = new google.maps.LatLng(item.CBS.Lat, item.CBS.Lng);
                            addMarker(latLng, item, isSelected);
                        }
                        break;
                    }
                case 'E':
                    {
                        if (item.CCRC != null)
                        {
                            if (isSelected)
                            {
                                isSelectedFound = true;
                            }
                            latLng = new google.maps.LatLng(item.CCRC.Lat, item.CCRC.Lng);
                            addMarker(latLng, item, isSelected);
                        }
                        break;
                    }
                case 'M':
                    {
                        if (item.NVS != null && item.MCertified)
                        {
                            if (isSelected)
                            {
                                isSelectedFound = true;
                            }
                            latLng = new google.maps.LatLng(item.NVS.Lat, item.NVS.Lng);
                            addMarker(latLng, item, isSelected);
                        }
                        break;
                    }
            }
        }
    }

    if (!isSelectedFound)
    {
        closeInfoBox(infoBox);
    }
    else
    {
        var newMarkerLatLng = selectedMarker.getPosition();
        if ((newMarkerLatLng.lat() != oldMarkerLatLng.lat()) || (newMarkerLatLng.lng() != oldMarkerLatLng.lng()))
        {
            closeInfoBox(infoBox);
            MarkerClickHandler(selectedMarker);
        }
    }

    markerClusterer = new MarkerClusterer(map, markers, {
        maxZoom: mapClustererMaxZoom,
        gridSize: 60,
        minimumClusterSize: 2,
        styles: [{
            url: 'http://cache.bmwusa.com/image_b0706d86-2a95-4484-9ef2-6b9d62290fc6.arox?v=1',
            width: 39,
            height: 50,
            textSize: 16,
            anchor: [12, 0]
        }]
    });

    google.maps.event.addListener(markerClusterer, 'click', function(cluster)
    {
        closeInfoBox(infoBox);
    });
}

function InitializeMap()

{		
	//alert('initialize');
    // don't initialize the map if we already have
    if (mapInitialized)
    {
		console.log("already initialized");
        return;
    }

    mapInitialized = true;

    map = new google.maps.Map(document.getElementById('map_canvas'),
    {
        zoom: mapInitialZoom,
        minZoom: mapMinZoom,
        center: new google.maps.LatLng(33.91297036087542, -96.791015625), //Center on North America
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT }
    });

    // bounds of the USA/Alaska/Hawaii/Puerto Rico
    var allowedBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(6.79288314764445, -175.327343375),
        new google.maps.LatLng(66.98062180285176, -34.702343375)
    );
    var lastValidCenter = map.getCenter();

    google.maps.event.addListener(map, 'center_changed', function()
    {
        if (allowedBounds.contains(map.getCenter()))
        {
            // still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }

        // not valid anymore => return to last valid position
        map.panTo(lastValidCenter);
    });

    google.maps.event.addListener(map, 'zoom_changed', function()
    {
        switch (map.getZoom())
        {
            case 5:
                markerClusterer.setGridSize(40);
                break;
            case 6:
                markerClusterer.setGridSize(30);
                break;
            default:
                markerClusterer.setGridSize(50);
                break;
        }
    });

    $('#mapSpinner').hide();

    refreshMap();

    globalBoundsRelativePositionHelper = new BoundsRelativePositionHelper(map);
}

function addMarker(latLng, item, isSelected)
{
    
	var marker = new google.maps.Marker(
    {
        position: latLng,
        draggable: false,
        icon: (isSelected ? 'http://cache.bmwusa.com/image_16c22e53-0ae1-449e-9f44-9f30430e19b1.arox?v=1' : 'http://cache.bmwusa.com/image_bd866a3b-bdb1-46bf-a5fe-66db621b6c42.arox?v=1'),
        shadow: markerShadow,
        title: item.Name,
        zIndex: CalulateZIndex(latLng)
    });

    marker.set('id', item.Id);
	
	

    google.maps.event.addListener(marker, 'click', function()
    {
        MarkerClickHandler(this);
    });

    markers.push(marker);

    if (isSelected)
    {
        selectedMarker = marker;
    }
	
}

function addNewServiceMarker(latLng, dealerInfo, serviceType)
{
    // Close previous serviceInfoBox
    if (serviceInfoBox != null)
    {
        serviceInfoBox.close();
        serviceInfoBox = null;
    }

    // remove previously added service marker
    if (addedDealerMarker != null)
    {
        markerClusterer.removeMarker(addedDealerMarker);
        addedDealerMarker = null;
    }

    var marker = new google.maps.Marker(
    {
        position: latLng,
        draggable: false,
        icon: 'http://cache.bmwusa.com/image_16c22e53-0ae1-449e-9f44-9f30430e19b1.arox?v=1',
        shadow: markerShadow,
        title: dealerInfo.Name,
        zIndex: CalulateZIndex(latLng)
    });

    //var boxText = createBoxText(dealerInfo, serviceType);

    var myOptions =
        {
            content: boxText,
            alignBottom: true,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-29, -36),
            boxStyle: { width: '315px' },
            closeBoxMargin: '7px',
            infoBoxClearance: new google.maps.Size(40, 40),
            isHidden: false,
            pane: 'floatPane',
            enableEventPropagation: false
        };

    serviceInfoBox = new InfoBox(myOptions);
	
	
    google.maps.event.addListener(serviceInfoBox, 'closeclick', function()
    {
        isInfoBoxDisplayed = false;
        markerClusterer.removeMarker(marker);
    });
	
	

    google.maps.event.addListener(serviceInfoBox, 'domready', function()
    {
        // fix the location of the infoBox close button in ie7
        if ($.browser.msie && $.browser.version == 7)
        {
            $('.infoBox img[src*="close.gif"]').css({ 'top': '0px', 'right': '0px', 'position': 'absolute' });
        }
        //$(".ServiceImage").tipTip({ defaultPosition: "top", edgeOffset: 0 });
        //$("#dealerLocatorMCertText").tipTip({ defaultPosition: "top", edgeOffset: 3 });
    });


    addedDealerMarker = marker;
    markerClusterer.addMarker(marker);
    isInfoBoxDisplayed = true;
    openInfoBox(serviceInfoBox, marker);
}

function SelectDealerMarker(dealerId, serviceType)
{
    var selectedDealer = $.grep(markers, function(n, i)
    {
        return (n.get('id') == dealerId);
    });

	//console.log(selectedDealer[0]);
	//console.log("Select Dealer Title " + $(selectedDealer[0]).attr("title"));
	//console.log("Position " + selectedDealer[0].getLatLng());
	
	
	
	//
	
	MarkerClickHandler(selectedDealer[0], 10, serviceType);
	
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
	
function updateThisURL(hash) {
	
    changed_hash = true;
    location.hash = hash;
};



function getDealerPage(){
	 	
		
		show_back(true);
		$('.modal').hide();
		$('.page').hide();
		$('#nav_lines').hide();	
		$('#dealer_info').show();
		
		 
		updateTitle('Dealer Page');
		updateThisURL('dealer_page');
		 
	   }
	   
function populateDealerInfo(dealerName) {
	  
	  	
		/*show all divs*/
		$("#dealer_info .content div").show();
	  
	   var dealerObj = FindDealerbyName(dealerName);
		$('#dealer_info h1').html(dealerObj.NVS.Name);
		
		$("div.dealer_address div h3").show();
		$("div.dealer_hours div h3").show();
	
		
		
		/* hide section divs that don't have content */
		if (dealerObj.NVS === null) {
			$("#NVS").hide();	
		} if (dealerObj.CPO === null) {
			$("#CPO").hide();	
		} if (dealerObj.CCRC === null) {
			$("#CCRC").hide();
		} if (dealerObj.CBS === null){
			$("#CBS").hide();
		}
		
	
			function createPhoneLink(phone){
				var formattedPhone = "tel:+1" +  phone.replace("(","").replace(")","").replace(" ","").replace("-","");
				return formattedPhone
			};
			
			function formatDest(street, city, state) {
				var formatStreet = street.replace(/ /gi, '+')
				var destString = formatStreet + "," + city.replace(" ","+") + "," + state;
				return destString;	
			}
			
			
			if (dealerObj.NVS !== null) {
				$("#NVS").find('div.dealer_address div:eq(0)').html(dealerObj.NVS.Address);	
				$("#NVS").find('div.dealer_address div:eq(1)').html(dealerObj.NVS.City + ", " + dealerObj.NVS.State);
				$("#NVS").find('div.dealer_address div:eq(2)').html(dealerObj.NVS.Phone);
				$("#NVS").find('div.dealer_hours div').html(dealerObj.NVS.Hours);
				$("#NVS").find('div.dealer_buttons div:eq(1)').html("<a href='" + createPhoneLink(dealerObj.NVS.Phone) + "'>Call</a>");
				$("#NVS").find('div.dealer_buttons div:eq(0)').html("<a href='http://maps.apple.com/maps?daddr=" + formatDest(dealerObj.NVS.Address, dealerObj.NVS.City, dealerObj.NVS.State) + "'>Directions</a>");
			}
			
			if (dealerObj.CPO !== null) {
				$("#CPO").find('div.dealer_address div:eq(0)').html(dealerObj.CPO.Address);	
				$("#CPO").find('div.dealer_address div:eq(1)').html(dealerObj.CPO.City + ", " + dealerObj.CPO.State);
				$("#CPO").find('div.dealer_address div:eq(2)').html(dealerObj.CPO.Phone);
				$("#CPO").find('div.dealer_hours div').html(dealerObj.CPO.Hours);
				$("#CPO").find('div.dealer_buttons div:eq(1)').html("<a href='" + createPhoneLink(dealerObj.NVS.Phone) + "'>Call</a>");
				$("#CPO").find('div.dealer_buttons div:eq(0)').html("<a href='http://maps.apple.com/maps?daddr=" + formatDest(dealerObj.NVS.Address, dealerObj.NVS.City, dealerObj.NVS.State) + "'>Directions</a>");
				
			}
			
			if (dealerObj.CCRC !== null) {
				$("#CCRC").find('div.dealer_address div:eq(0)').html(dealerObj.CCRC.Address);	
				$("#CCRC").find('div.dealer_address div:eq(1)').html(dealerObj.CCRC.City + ", " + dealerObj.CCRC.State);
				$("#CCRC").find('div.dealer_address div:eq(2)').html(dealerObj.CCRC.Phone);
				$("#CCRC").find('div.dealer_hours div').html(dealerObj.CCRC.Hours);
				$("#CCRC").find('div.dealer_buttons div:eq(1)').html("<a href='" + createPhoneLink(dealerObj.CCRC.Phone) + "'>Call</a>");
				$("#CCRC").find('div.dealer_buttons div:eq(0)').html("<a href='http://maps.apple.com/maps?daddr=" + formatDest(dealerObj.CCRC.Address, dealerObj.CCRC.City, dealerObj.CCRC.State) + "'>Directions</a>");
			}
			
			if (dealerObj.CBS !== null) {
				$("#CBS").find('div.dealer_address div:eq(0)').html(dealerObj.CBS.Address);	
				$("#CBS").find('div.dealer_address div:eq(1)').html(dealerObj.CBS.City + ", " + dealerObj.CBS.State);
				$("#CBS").find('div.dealer_address div:eq(2)').html(dealerObj.CBS.Phone);
				$("#CBS").find('div.dealer_hours div').html(dealerObj.CBS.Hours);
				$("#CBS").find('div.dealer_buttons div:eq(1)').html("<a href='" + createPhoneLink(dealerObj.CBS.Phone) + "'>Call</a>");
				$("#CBS").find('div.dealer_buttons div:eq(0)').html("<a href='http://maps.apple.com/maps?daddr=" + formatDest(dealerObj.CBS.Address, dealerObj.CBS.City, dealerObj.CBS.State) + "'>Directions</a>");
			}
			
			$("div.dealer_address div:empty").prev("h3").hide();
			$("div.dealer_hours div:empty").prev("h3").hide();
	  }

function MarkerClickHandler(marker, zoomLevel, serviceType)
{
	
        
        var isNewDealerSelected = (marker.get('id') != selectedDealerId);
		//console.log("Marker is: " + marker.get('position'));
		
	map.panTo(marker.get('position'))
	
	if (zoomLevel != null)
    {
		map.setZoom(zoomLevel);
    }
	
	
    // Close previous serviceInfoBox
    if (serviceInfoBox != null)
    {
        serviceInfoBox.close();
        serviceInfoBox = null;
    }

    // remove previously added service marker
    if (addedDealerMarker != null)
    {
        markerClusterer.removeMarker(addedDealerMarker);
        addedDealerMarker = null;
    }

    // remove previously plotted directions
    if (directionsDisplay.getMap() != undefined && isNewDealerSelected)
    {
        ClearDirections();
    }

    //Handle previously selected dealer, by closing infobox and changing icon
    //closeInfoBox(infoBox);
	

    // set selectedMarker to newly select marker 
    selectedMarker = marker;
    
  

    var dealerId = selectedMarker.get('id');
    var selectedDealer = $.grep(Dealers, function(n, i)
    {
        return (n.Id == dealerId);
    });

	
	
    if (selectedDealer != null)
    {  
		SelectDealer(dealerId);

        var serviceChoice = serviceType != null ? serviceType : filterBy;
        var dealerInfo = getDealerInformation(selectedDealer[0], serviceChoice);
	

       if(infoBox) {
           
           closeOpenBox(infoBox);
          
           
       }	
	
        var boxText = '<br />' + marker.get("title") + '<br />' + '<span><a class="info_link" href="javascript:getDealerPage()"><div id="getDealer" style="background:#ccc; color:#fff; width: 300px; height:70px; position:absolute; top:0; left:0; opacity:0;"></div></a></span>'
	 $(".info_link").css({"width":"300", "height":"200"})   
		
        var myOptions =
        {
            enableEventPropagation: true,
			content: boxText,
            alignBottom: true,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-152, -135),
            boxStyle: { width: '275px' , height : '85px' , background : 'url("images/locator_bg.png")' , color: '#000' , padding : '5px 5px 0 20px' },
            closeBoxMargin: '7px',
            infoBoxClearance: new google.maps.Size(40, 40),
            isHidden: false,
            pane: 'floatPane',
            zIndex: 100000
            
        };

      
       infoBox = new InfoBox(myOptions);
       
	
	   var dealerName = marker.get("title");
	   populateDealerInfo(dealerName);
		
         console.log("infobox: " +  infoBox)  
	   

        google.maps.event.addListener(infoBox, 'closeclick', function()
        {
			closeInfoBox(infoBox);
			 isInfoBoxDisplayed = false;

        });
		
		
		google.maps.event.addListener(infoBox, 'click', function() {
                        infoClick(this);
            });


        google.maps.event.addListener(infoBox, 'domready', function()
        {
               $(infoBox).click(function(){alert('clicked!')}); 
			// fix the location of the infoBox close button in ie7
            if ($.browser.msie && $.browser.version == 7)
            {
                $('.infoBox img[src*="close.gif"]').css({ 'top': '0px', 'right': '0px', 'position': 'absolute' });
            }
            //$(".ServiceImage").tipTip({ defaultPosition: "top", edgeOffset: 0 });
            //$("#dealerLocatorMCertText").tipTip({ defaultPosition: "top", edgeOffset: 3 });
        });
    }

    if (selectedMarker != null && directionsDisplay.getMap() == undefined)
    {
        // set icon to selected icon (not done if directions are being shown)
        //selectedMarker.setIcon('http://cache.bmwusa.com/image_16c22e53-0ae1-449e-9f44-9f30430e19b1.arox?v=1');
    }

    
    openInfoBox(infoBox, selectedMarker);
}

function closeOpenBox(){
    closeInfoBox(infoBox);
}


function openInfoBox(infoBox, marker)
{
    isInfoBoxDisplayed = true;
    infoBox.open(map, marker);
	
    if (globalBoundsRelativePositionHelper != null)
    {
        globalBoundsRelativePositionHelper.SetStickyMarker(marker, infoBox);
    }
}

function closeInfoBox(infoBox)
{
    if (infoBox !== null)
    {
        if (globalBoundsRelativePositionHelper != null)
        {
            globalBoundsRelativePositionHelper.ClearStickyMarker();
        }
        infoBox.close();
		
        infoBox = null;
        isInfoBoxDisplayed = false;
        if (selectedMarker != null && directionsDisplay.getMap() == undefined)
        {
            //Reset to non-selected icon
            //selectedMarker.setIcon('http://cache.bmwusa.com/image_bd866a3b-bdb1-46bf-a5fe-66db621b6c42.arox?v=1');
        }
    }
}

function createBoxText(dealerInfo, serviceType)
{
    var boxText = document.createElement('div');

    var serviceText = dealerInfo.Services;

    // Move to CSS class name infoBox - or change property for new class name
    boxText.style.cssText = '';
    boxText.innerHTML = '<div style="border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; padding: 10px 10px 15px 10px;background: white;"><div id="dealerLocatorDealerName" style="margin-bottom:5px;"><h3 class="InlineBlock" style="margin-right: 10px">' + dealerInfo.Name + '</h3>'
                        + GetPreferredDealerBlock(dealerInfo.Id)
                        + '<div id="dealerLocatorServiceList" style="margin-bottom: 10px"><h4>' + serviceText + '</h4></div>'

                        + '<hr style="border: 0; color: #9E9E9E; background-color: #9E9E9E; height: 1px; width: 100%;" />'

                        + '<div id="infoBoxDetails">'
                        + GetDealerAddressBlock(dealerInfo)
                        + GetDealerHoursBlock(dealerInfo)
                        + GetDealerPhoneBlock(dealerInfo)
                        + '</div>'

                        + '<div id="infoBoxActions" class="Grey85Color">'

                        + GetDealerMCertifiedBlock(dealerInfo)

                        + '<div id="infoBoxEmail">'
                        + '<a id="infoBoxEmailButton" href="javascript:InfoBoxEmailButtonClick();">&nbsp;</a>'
                        + '</div>'

                        + '<div id="infoBoxPrint">'
                        + '  <a id="infoBoxPrintButton" target="_new" href="http://' + WEBSITE_URL + '/standard/content/dealer/printdealerinformation.aspx?dealerId=' + selectedDealerId + '">&nbsp;</a>'
                        + '</div>'

                        + '<div id="infoBoxContact">'
                        + '  <div id="infoBoxContactButton" target="_new" class="BmwButtonBlue"><a href="https://' + WEBSITE_URL + '/secured/content/forms/lead.aspx?leadtype=contactdealer&dealerid=' + selectedDealerId + '">CONTACT</a></div>'
                        + '</div>'
                        + '</div>'
                        + '<div class="clearBoth"></div>'

                        + '<hr style="border: 0; color: #9E9E9E; background-color: #9E9E9E; height: 1px; width: 100%; margin-top:10px;" />'

                        + '<div id="infoBoxEmailPanel" style="margin-top: 10px;">'
                        + '<div class="InlineBlock">'
                        + '<input id="infoBoxEmailAddressText" class="watermarkOn" type="email" value="Enter email address" />'
                        + '</div>'
                        + '<div class="InlineBlock">'
                        + '<div id="infoBoxSendEmail" class="BmwButtonBlue"><a id="infoBoxSendEmailButton" href="javascript:InfoBoxSendEmailButtonClick();">Send</a></div>'
                        + '</div>'
                        + '<div id="infoBoxEmailAddressMessage"></div>'
                        + '</div>'

                        + '<div id="infoBoxServicesPanel" style="margin-top: 10px;">'
                        + GetServiceLinks(dealerInfo, serviceType)
                        + '</div></div>'
                        + '<img src="http://cache.bmwusa.com/image_7833da51-bbb9-4ecb-934e-234fd026396a.arox" />';

    return boxText;
}

function DisplayNewInformation(dealerId, serviceType)
{

    var infoBoxLat = $('#infoBoxLat').text();
    var infoBoxLng = $('#infoBoxLng').text();

    var block = '';
    var dealer = $.grep(Dealers, function(n, i)
    {
        return (n.Id == dealerId);
    });

    if (dealer != null)
    {
        var dealerInfo = getDealerInformation(dealer[0], serviceType);

        if (dealerInfo != null && infoBoxLat == dealerInfo.Lat && infoBoxLng == dealerInfo.Lng)
        {

            block += GetDealerAddressBlock(dealerInfo);
            block += GetDealerHoursBlock(dealerInfo);
            block += GetDealerPhoneBlock(dealerInfo);

            $('#infoBoxDetails').html(block);

            $('#infoBoxServicesPanel').html(GetServiceLinks(dealerInfo, serviceType));
            //$(".ServiceImage").tipTip({ defaultPosition: "top", edgeOffset: 0 });
        }
        else
        {
            var latLng = new google.maps.LatLng(dealerInfo.Lat, dealerInfo.Lng);
            //check to see if marker already exists at that latlng, if so, select it.
            for (var i in markers)
            {
                if (latLng == markers[i].getPosition())
                {
                    SelectDealerMarker(dealerInfo.Id, serviceType);
                    return;
                }
            }

            closeInfoBox(infoBox);

            addNewServiceMarker(latLng, dealerInfo, serviceType);
        }
    }
}

function GetServiceLinks(dealerInfo, serviceType)
{
    var block = '';
    var nvsText = 'New Vehicle Sales';
    var cpoText = 'Certified Pre-Owned';
    var cbsText = 'BMW Service';
    var ccrcText = 'Collision Repair Center';

    var serviceChoice = serviceType != null ? serviceType : filterBy;
    var imgSrc = '';

    if (dealerInfo.HasNVS)
    {
        if (serviceChoice == 'N' || serviceChoice == 'M')
        {
            imgSrc = 'http://cache.bmwusa.com/image_4797fab5-ee78-4a47-bb03-771ed2f85a6e.arox?v=1';
        }
        else
        {
            imgSrc = 'http://cache.bmwusa.com/image_4d999c03-2aee-4bf4-8d6d-43d419f41cc7.arox?v=1';
        }

        block += '<a class="LinkPlain" href="Javascript:DisplayNewInformation(' + dealerInfo.Id + ', \'' + NVSService + '\');">';
        block += '<img class="ServiceImage" src="' + imgSrc + '" style="width: 73px" title="' + nvsText + '" />';
        block += '</a>';
    }

    if (dealerInfo.HasCPO)
    {
        if (serviceChoice == 'C')
        {
            imgSrc = 'http://cache.bmwusa.com/image_0bbf7249-3f3e-41e8-aeb4-0f42c766be7a.arox?v=1';
        }
        else
        {
            imgSrc = 'http://cache.bmwusa.com/image_cdc8557e-9c71-479d-9788-573e4d840434.arox?v=1';
        }

        block += '<a class="LinkPlain" href="Javascript:DisplayNewInformation(' + dealerInfo.Id + ', \'' + CPOService + '\');">';
        block += '<img class="ServiceImage" src="' + imgSrc + '" style="width: 73px" title="' + cpoText + '" />';
        block += '</a>';
    }

    if (dealerInfo.HasCBS)
    {
        if (serviceChoice == 'S')
        {
            imgSrc = 'http://cache.bmwusa.com/image_b72c651e-c610-4aa4-b5db-9a59429f76ea.arox?v=1';
        }
        else
        {
            imgSrc = 'http://cache.bmwusa.com/image_d42f1c07-0316-4377-84c2-935f51848f16.arox?v=1';
        }

        block += '<a class="LinkPlain" href="Javascript:DisplayNewInformation(' + dealerInfo.Id + ', \'' + CBSService + '\');">';
        block += '<img class="ServiceImage" src="' + imgSrc + '" style="width: 73px" title="' + cbsText + '" />';
        block += '</a>';
    }

    if (dealerInfo.HasCCRC)
    {
        if (serviceChoice == 'E')
        {
            imgSrc = 'http://cache.bmwusa.com/image_cc1feba6-14b8-4416-83fa-f44c68491a6e.arox?v=1';
        }
        else
        {
            imgSrc = 'http://cache.bmwusa.com/image_e63b48a4-4552-4068-8ddb-87062e965120.arox?v=1';
        }

        block += '<a class="LinkPlain" href="Javascript:DisplayNewInformation(' + dealerInfo.Id + ', \'' + CCRCService + '\');">';
        block += '<img class="ServiceImage" src="' + imgSrc + '" style="width: 73px" title="' + ccrcText + '" />';
        block += '</a>';
    }

    return block;
}

function GetPreferredDealerBlock(dealerId)
{
    for (var i in dealerLocatorViewModel.myDealers())
    {
        if (dealerId == dealerLocatorViewModel.myDealers()[i].dealerId)
        {
            return '<a id="infoBoxPreferredDealerLink" class="LinkPlain" title="Remove from My Dealers" href="javascript: RemovePreferredDealer(\'' + dealerId + '\');">'
                    + '<img id="infoBoxPreferredDealerImg" alt="Remove from My Dealers" src="http://cache.bmwusa.com/image_45e9eb18-6f58-4f89-847c-7b6ec0db61fa.arox" />'
                    + '</a></div>';
        }
    }

    return '<a id="infoBoxPreferredDealerLink" class="LinkPlain" title="Add to My Dealers" href="javascript: AddPreferredDealer(\'' + dealerId + '\');">'
            + '<img id="infoBoxPreferredDealerImg" alt="Add to My Dealers" src="http://cache.bmwusa.com/image_4e9c2bf8-9067-4b61-a08d-252090b22c14.arox" />'
            + '</a></div>';
}

function RemovePreferredDealer(dealerId)
{
    dealerLocatorViewModel.MyDealerRemoveByDealerId(dealerId);

    // toggle function to add
    var href = $('#infoBoxPreferredDealerLink').attr('href').replace('Remove', 'Add');
    $('#infoBoxPreferredDealerLink').attr('href', href);
    $('#infoBoxPreferredDealerLink').attr('title', "Add to My Dealers");

    // toggle image to filled star
    $('#infoBoxPreferredDealerImg').attr('src', 'http://cache.bmwusa.com/image_4e9c2bf8-9067-4b61-a08d-252090b22c14.arox')
    $('#infoBoxPreferredDealerImg').attr('alt', "Add to My Dealers");
}

function AddPreferredDealer(dealerId)
{
    dealerLocatorViewModel.AddMyPreferredDealer(dealerId, false, true);

    // toggle function to remove
    var href = $('#infoBoxPreferredDealerLink').attr('href').replace('Add', 'Remove');
    $('#infoBoxPreferredDealerLink').attr('href', href);
    $('#infoBoxPreferredDealerLink').attr('title', "Remove from My Dealers");

    // toggle image to filled star
    $('#infoBoxPreferredDealerImg').attr('src', 'http://cache.bmwusa.com/image_45e9eb18-6f58-4f89-847c-7b6ec0db61fa.arox')
    $('#infoBoxPreferredDealerImg').attr('alt', "Remove from My Dealers");
}

function GetDealerAddressBlock(dealerInfo)
{
    var block = '<div id="dealerLocatorDealerAddress" class="Grey85Color" style="margin-bottom: 10px; margin-top: 10px;">'
        + '<div id="dealerLocatorDealerAddressImg" class="InlineBlock" style="height: auto; vertical-align: top; width: 14px">'
        + '<img src="http://cache.bmwusa.com/image_f1010fc9-c399-4c9d-9e4f-4ca93c65dfca.arox?v=1" /></div>'
        + '<div id="dealerLocatorDealerAddressText" class="InlineBlock" style="margin-left: 7px">' + dealerInfo.Address + '<br/>'
        + dealerInfo.City + ',&nbsp;' + dealerInfo.State + '&nbsp;' + dealerInfo.Zip + '</div>'
        + '<div style="margin-left: 21px"><a href="javascript: ShowDirections();">Get Directions</a></div>'
        + '<div style="margin-left: 21px"><img src="http://cache.bmwusa.com/image_c3fbff98-acd0-43f2-a6ad-da06e77f5071.arox" />&nbsp;<a class="LinkPlain" target="_new" href="http://' + dealerInfo.Url + '">Dealer website</a></div>'
        + '<div id="infoBoxLat" style="display:none;">' + dealerInfo.Lat + '</div>'
        + '<div id="infoBoxLng" style="display:none;">' + dealerInfo.Lng + '</div>'
        + '</div>';

    return block;
}

function GetDealerHoursBlock(dealerInfo)
{
    var block = '';

    if (dealerInfo.Hours != '')
    {
        block = '<div id="dealerLocatorDealerHours" class="Grey85Color" style="margin-bottom:10px;">'
            + '<div id="dealerLocatorDealerHourImg" class="InlineBlock" style="height: auto; vertical-align: top; width: 14px">'
            + '<img src="http://cache.bmwusa.com/image_9fbe9593-ea95-40fb-ab79-4e7b2cd2cfb6.arox" /></div>'
            + '<div id="dealerLocatorDealerHourText" class="InlineBlock" style="margin-left: 7px">' + dealerInfo.Hours + '</div></div>';
    }

    return block;
}

function GetDealerPhoneBlock(dealerInfo)
{
    var block = '';

    if (dealerInfo.Phone != '')
    {
        block = '<div id="dealerLocatorDealerPhone" class="Grey85Color" style="margin-bottom:10px;">'
            + '<div id="dealerLocatorDealerPhoneImg" class="InlineBlock" style="height: auto; vertical-align: top; width: 14px">'
            + '<img src="http://cache.bmwusa.com/image_5cab9930-4832-44eb-814e-e66a5e6daab8.arox" /></div>'
            + '<div id="dealerLocatorDealerHourText" class="InlineBlock" style="margin-left: 7px">Tel: ' + dealerInfo.Phone;

        if (dealerInfo.Fax)
        {
            block += '<br/>Fax: ' + dealerInfo.Fax;
        }

        block += '</div></div>';
    }

    return block;
}

function GetDealerMCertifiedBlock(dealerInfo)
{
    var block = '';

    if (dealerInfo.IsMCertified)
    {
        block = '<div id="infoBoxMCertified"><div id="dealerLocatorMCertImg" class="InlineBlock" style="height: auto; vertical-align: middle; width: 14px">'
            + '<img src="http://cache.bmwusa.com/image_eaf3a3d0-0066-4d15-8aa9-42ac4aff28fb.arox" /></div>'
            + '<div id="dealerLocatorMCertText" class="InlineBlock" style=" margin-left: 7px; vertical-align: middle;" title="BMW M Certified dealers offer specially trained sales consultants and service technicians who can provide their expertise on all high performance M models.">M Certified Dealer</div></div>';
    }
    else
    {
        block = '<div id="infoBoxMCertified"></div>'
    }

    return block;
}

function getDealerInformation(selectedDealer, serviceSelection)
{
    var dealerInfo = { 'HasNVS': false, 'HasCPO': false, 'HasCBS': false, 'HasCCRC': false,
        'Name': '', 'Address': '', 'City': '', 'State': '', 'Zip': '',
        'Hours': '', 'Phone': '', 'Fax': '', 'IsMCertified': false,
        'Lat': '', 'Lng': '', 'Id': '', 'Url': '', 'Services': ''
    };

    var baseLat = 0.0;
    var baseLng = 0.0;

    switch (serviceSelection)
    {
        case NVSService:
            baseLat = selectedDealer.NVS.Lat;
            baseLng = selectedDealer.NVS.Lng;
            break;
        case CPOService:
            baseLat = selectedDealer.CPO.Lat;
            baseLng = selectedDealer.CPO.Lng;
            break;
        case CBSService:
            baseLat = selectedDealer.CBS.Lat;
            baseLng = selectedDealer.CBS.Lng;
            break;
        case CCRCService:
            baseLat = selectedDealer.CCRC.Lat;
            baseLng = selectedDealer.CCRC.Lng;
            break;
        case MCertified:
            baseLat = selectedDealer.NVS.Lat;
            baseLng = selectedDealer.NVS.Lng;
            break;
    }

    if (selectedDealer.NVS != null)
    {
        dealerInfo.HasNVS = true;
        if (selectedDealer.NVS.Lat == baseLat && selectedDealer.NVS.Lng == baseLng)
        {
            dealerInfo.Services += 'New&nbsp;Vehicles';
        }
    }

    if (selectedDealer.CPO != null)
    {
        dealerInfo.HasCPO = true;

        if (selectedDealer.CPO.Lat == baseLat && selectedDealer.CPO.Lng == baseLng)
        {
            if (dealerInfo.Services != '')
            {
                dealerInfo.Services += ', ';
            }

            dealerInfo.Services += 'Certified&nbsp;Pre-Owned';
        }
    }

    if (selectedDealer.CBS != null)
    {
        dealerInfo.HasCBS = true;

        if (selectedDealer.CBS.Lat == baseLat && selectedDealer.CBS.Lng == baseLng)
        {
            if (dealerInfo.Services != '')
            {
                dealerInfo.Services += ', ';
            }

            dealerInfo.Services += 'BMW&nbsp;Service';
        }
    }

    if (selectedDealer.CCRC != null)
    {
        dealerInfo.HasCCRC = true;

        if (selectedDealer.CCRC.Lat == baseLat && selectedDealer.CCRC.Lng == baseLng)
        {
            if (dealerInfo.Services != '')
            {
                dealerInfo.Services += ', ';
            }

            dealerInfo.Services += 'Certified&nbsp;Collision&nbsp;Repair';
        }
    }

    switch (serviceSelection)
    {
        case 'N':
            {
                if (selectedDealer.NVS != null)
                {
                    dealerInfo.Id = selectedDealer.Id;
                    dealerInfo.Name = selectedDealer.Name;
                    dealerInfo.Address = selectedDealer.NVS.Address;
                    dealerInfo.City = selectedDealer.NVS.City;
                    dealerInfo.State = selectedDealer.NVS.State;
                    dealerInfo.Zip = selectedDealer.NVS.Zip;
                    dealerInfo.Hours = selectedDealer.NVS.Hours;
                    dealerInfo.Phone = selectedDealer.NVS.Phone;
                    dealerInfo.Fax = selectedDealer.NVS.Fax;
                    dealerInfo.Lat = selectedDealer.NVS.Lat;
                    dealerInfo.Lng = selectedDealer.NVS.Lng;
                    dealerInfo.Url = selectedDealer.NVS.Url;
                    dealerInfo.IsMCertified = selectedDealer.MCertified;
                }
                break;
            }
        case 'C':
            {
                if (selectedDealer.CPO != null)
                {
                    dealerInfo.Id = selectedDealer.Id;
                    dealerInfo.Name = selectedDealer.Name;
                    dealerInfo.Address = selectedDealer.CPO.Address;
                    dealerInfo.City = selectedDealer.CPO.City;
                    dealerInfo.State = selectedDealer.CPO.State;
                    dealerInfo.Zip = selectedDealer.CPO.Zip;
                    dealerInfo.Hours = selectedDealer.CPO.Hours;
                    dealerInfo.Phone = selectedDealer.CPO.Phone;
                    dealerInfo.Fax = selectedDealer.CPO.Fax;
                    dealerInfo.Lat = selectedDealer.CPO.Lat;
                    dealerInfo.Lng = selectedDealer.CPO.Lng;
                    dealerInfo.Url = selectedDealer.CPO.Url;
                    dealerInfo.IsMCertified = selectedDealer.MCertified;
                }
                break;
            }
        case 'S':
            {
                if (selectedDealer.CBS != null)
                {
                    dealerInfo.Id = selectedDealer.Id;
                    dealerInfo.Name = selectedDealer.Name;
                    dealerInfo.Address = selectedDealer.CBS.Address;
                    dealerInfo.City = selectedDealer.CBS.City;
                    dealerInfo.State = selectedDealer.CBS.State;
                    dealerInfo.Zip = selectedDealer.CBS.Zip;
                    dealerInfo.Hours = selectedDealer.CBS.Hours;
                    dealerInfo.Phone = selectedDealer.CBS.Phone;
                    dealerInfo.Fax = selectedDealer.CBS.Fax;
                    dealerInfo.Lat = selectedDealer.CBS.Lat;
                    dealerInfo.Lng = selectedDealer.CBS.Lng;
                    dealerInfo.Url = selectedDealer.CBS.Url;
                    dealerInfo.IsMCertified = selectedDealer.MCertified;
                }
                break;
            }
        case 'E':
            {
                if (selectedDealer.CCRC != null)
                {
                    dealerInfo.Id = selectedDealer.Id;
                    dealerInfo.Name = selectedDealer.Name;
                    dealerInfo.Address = selectedDealer.CCRC.Address;
                    dealerInfo.City = selectedDealer.CCRC.City;
                    dealerInfo.State = selectedDealer.CCRC.State;
                    dealerInfo.Zip = selectedDealer.CCRC.Zip;
                    dealerInfo.Hours = selectedDealer.CCRC.Hours;
                    dealerInfo.Phone = selectedDealer.CCRC.Phone;
                    dealerInfo.Fax = selectedDealer.CCRC.Fax;
                    dealerInfo.Lat = selectedDealer.CCRC.Lat;
                    dealerInfo.Lng = selectedDealer.CCRC.Lng;
                    dealerInfo.Url = selectedDealer.CCRC.Url;
                    dealerInfo.IsMCertified = selectedDealer.MCertified;
                }
                break;
            }
        case 'M':
            {
                if (selectedDealer.NVS != null)
                {
                    dealerInfo.Id = selectedDealer.Id;
                    dealerInfo.Name = selectedDealer.Name;
                    dealerInfo.Address = selectedDealer.NVS.Address;
                    dealerInfo.City = selectedDealer.NVS.City;
                    dealerInfo.State = selectedDealer.NVS.State;
                    dealerInfo.Zip = selectedDealer.NVS.Zip;
                    dealerInfo.Hours = selectedDealer.NVS.Hours;
                    dealerInfo.Phone = selectedDealer.NVS.Phone;
                    dealerInfo.Fax = selectedDealer.NVS.Fax;
                    dealerInfo.Lat = selectedDealer.NVS.Lat;
                    dealerInfo.Lng = selectedDealer.NVS.Lng;
                    dealerInfo.Url = selectedDealer.NVS.Url;
                    dealerInfo.IsMCertified = selectedDealer.MCertified;
                }
                break;
            }
    }

    return dealerInfo;
}

function clearClusters(e)
{
    e.preventDefault();
    e.stopPropagation();
    markerClusterer.clearMarkers();
}

function SearchByActiveMode()
{	
	
		
	    if ($('#searchByAddress').val() != '' && $('#searchByAddress').val() != 'City, State or Zip Code')
        {	
			SelectPMAFromAddress($('#searchByAddress').val());
        }
   
}



function passDealer(dealerID){
	dealer = dealerID;
	SelectDealer(dealerID);
	InitializeMap();
    SelectDealerMarker(dealerID);
}



$(document).ready(function()
{
    
});
