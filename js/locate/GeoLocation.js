/// <reference path="~/JavaScript/jQuery/plugins/jQuery.Timer.js" />

var html5GeolocationCancelled = false;
var requestingHtml5GeoLocation = false;
var geoLocateCookie =
{
    Zip: "OfferZip",
    Region: "regiontypeid",
    Result: "glResult"
};

(function GeoLocation()
{
    gl = {};
    gl.GetGeoLocationService = {};
    gl.GetGeoLocationService.Url = CONNECTION_TYPE + WCF_SERVICES_URL + GEOLOCATION_URL_PART;

    gl.GetGeoLocationService.Methods = {
        GetRegionByZip: "GetRegionByZip",
        GetRegionByCenterId: "GetRegionByCenterId",
        GetRegionFromIP: "GetRegionFromIP",
        GetRegionFromLatLong: "GetRegionFromLatLong",
        ValidateZip: "ValidateZip"
    };
    
    gl.ValidateZip = function(zip, callback)
    {
        var getIPUrl = gl.GetGeoLocationService.Url + gl.GetGeoLocationService.Methods.ValidateZip + "/" + zip + "?callbackName=isvalidzip";
        $.jsonp(
        {
            url: getIPUrl,
            callback: "isvalidzip",
            success: function(json)
            {
                callback(json, zip);
            },
            error: function()
            {
                //alert('error validate zip');
            }
        });
    }

    gl.GetRegionByZip = function(zip, callback, errorCallback)
    {
        var getIPUrl = gl.GetGeoLocationService.Url + gl.GetGeoLocationService.Methods.GetRegionByZip + "/" + zip + "?callbackName=region";
        $.jsonp(
        {
            url: getIPUrl,
            callback: "region",
            success: function(json)
            {
                createGeoLocateCookie(geoLocateCookie.Zip, zip, false);
                SetRegionCookies(json);
                callback(json);
            },
            error: function(error)
            {
                if (errorCallback)
                {
                    errorCallback(error);
                }
            }
        });
    }

    gl.GetRegionByCenterId = function(centerid, callback, errorCallback)
    {
        var getIPUrl = gl.GetGeoLocationService.Url + gl.GetGeoLocationService.Methods.GetRegionByCenterId + "/" + centerid + "?callbackName=region";
        $.jsonp(
        {
            url: getIPUrl,
            callback: "region",
            success: function(json)
            {
                SetRegionCookies(json);
                callback(json);
            },
            error: function(error)
            {
                if (errorCallback)
                {
                    errorCallback(error);
                }
            }
        });
    }

    gl.GetRegionFromIP = function(ip, callback, errorCallback)
    {
        var getIPUrl = gl.GetGeoLocationService.Url + gl.GetGeoLocationService.Methods.GetRegionFromIP + "/" + ip + "?callbackName=region";

        $.jsonp(
        {
            url: getIPUrl,
            callback: "region",
            success: function(json)
            {
                SetZipCookie(json);
                SetRegionCookies(json);
                callback(json);
            },
            error: function(error)
            {
                if (errorCallback)
                {
                    errorCallback(error);
                }
            }
        });
    }

    gl.GetRegionFromLatLong = function(latlong, callback, errorCallback)
    {
        var getIPUrl = gl.GetGeoLocationService.Url + gl.GetGeoLocationService.Methods.GetRegionFromLatLong + "/" + latlong + "?callbackName=region";

        $.jsonp(
        {
            url: getIPUrl,
            callback: "region",
            success: function(json)
            {
                SetZipCookie(json);
                SetRegionCookies(json);
                callback(json);
            },
            error: function(error)
            {
                if (errorCallback)
                {
                    errorCallback(error);
                }
            }
        });
    }
} ());

function SetRegionCookies(glresult)
{
    if (glresult && glresult.RegionId != null)
    {
        if (glresult.RegionId != 5)
        {
            createGeoLocateCookie(geoLocateCookie.Result, JSON.stringify(glresult), false);
            createGeoLocateCookie(geoLocateCookie.Region, glresult.RegionId, false);
        }
        else
        {
            createGeoLocateCookie(geoLocateCookie.Result, JSON.stringify(glresult), true);
            createGeoLocateCookie(geoLocateCookie.Region, glresult.RegionId, true);
        }
    }
}

function SetZipCookie(glresult)
{
    if (glresult && glresult.ZipCode && glresult.ZipCode.length > 0)
    {
        createGeoLocateCookie(geoLocateCookie.Zip, glresult.ZipCode, false);
    }
}

function SetNationalRegionCookie()
{
    createGeoLocateCookie(geoLocateCookie.Region, "5", true);
}

(function DealerGeoLocation()
{
    dgl = {};
    dgl.DealerGeoLocationService = {};
    dgl.DealerGeoLocationService.Url = CONNECTION_TYPE + WCF_SERVICES_URL + GEOLOCATION_URL_PART;
    dgl.DealerGeoLocationService.Methods = {
        GetDealerByIP: "GetDealerByIP",
        GetDealerById: "GetDealerById",
        GetDealerForLatLong: "GetDealerForLatLong"
    };
    dgl.GetDealerByIP = function(ip, callback)
    {
        if (ip)
        {
            var getDealerByIPUrl = dgl.DealerGeoLocationService.Url + dgl.DealerGeoLocationService.Methods.GetDealerByIP + "/" + ip + "?callbackName=dealer";
            $.jsonp(
                    {
                        url: getDealerByIPUrl,
                        callback: "dealer",
                        success: function(json)
                        {
                            callback(json);
                        },
                        error: function()
                        {
                            // alert('error getting dealer by ip');
                        }
                    });
        }
    };
    dgl.GetDealerById = function(id, callback)
    {
        if (id)
        {
            var getDealerByIdUrl = dgl.DealerGeoLocationService.Url + dgl.DealerGeoLocationService.Methods.GetDealerById + "/" + id + "?callbackName=dealer";
            $.jsonp(
                {
                    url: getDealerByIdUrl,
                    callback: "dealer",
                    success: function(json)
                    {
                        callback(json);
                    },
                    error: function()
                    {
                        //alert('error getting dealer by id');
                    }
                });
        }
    };
    dgl.GetDealerForLatLong = function(latlong, callback)
    {
        if (latlong)
        {
            var getDealerForLatLongUrl = dgl.DealerGeoLocationService.Url + dgl.DealerGeoLocationService.Methods.GetDealerForLatLong + "/" + latlong + "?callbackName=dealer";
            $.jsonp(
                    {
                        url: getDealerForLatLongUrl,
                        callback: "dealer",
                        success: function(json)
                        {
                            callback(json);
                        },
                        error: function()
                        {
                            //alert('error getting dealer by lat long');
                        }
                    });
        }
    };
} ());

function GetGeoLocationRegion(zipCode, centerId, regionId, onSuccess, onError, html5IsSession)
{
    if (html5IsSession == undefined)
    {
        html5IsSession = true;
    }

    // check result cookie
    if (readGeoLocateCookie(geoLocateCookie.Result))
    {
        var glResult = JSON.parse(readGeoLocateCookie(geoLocateCookie.Result));
        if (glResult && ((glResult.ZipCode && glResult.ZipCode == zipCode || !zipCode || zipCode == '') || (glResult.RegionId && glResult.RegionId == regionId || !regionId || regionId == '')))
        {
            onSuccess(glResult);
            return true;
        }
    }

    // check for regionid in cookie and passed variables
    var regionExists = readGeoLocateCookie(geoLocateCookie.Region) || (regionId && regionId.length > 0);
    var zipCodeExists = readGeoLocateCookie(geoLocateCookie.Zip) || (zipCode && zipCode.length > 0);
    var centerIdExists = centerId && centerId.length > 0;
    
    // all three false call html5 geo or geo by ip
    if (!regionExists && !zipCodeExists && !centerIdExists)
    {
        Html5GeoLocation(function (position)
        {
            var latlong = position.coords.latitude + ',' + position.coords.longitude;
            gl.GetRegionFromLatLong(latlong, onSuccess, onError);
        },
        function (error)
        {
            gl.GetRegionFromIP(CLIENT_IP_ADDRESS, onSuccess, onError);
        },
        function ()
        {
            gl.GetRegionFromIP(CLIENT_IP_ADDRESS, onSuccess, onError);
        },
        html5IsSession);

    }
    else
    {
        // if centerid exists GetRegionByCenterId
        if (centerIdExists)
        {
            gl.GetRegionByCenterId(centerId, onSuccess, onError);
        }
        else if (!regionExists && zipCodeExists)
        {
            if (!zipCode || zipCode.length <= 0)
            {
                zipCode = readGeoLocateCookie(geoLocateCookie.Zip);
            }

            gl.GetRegionByZip(zipCode, onSuccess, onError);
        }
        else if (regionExists)
        {
            if (!regionId || regionId.length <= 0)
            {
                regionId = readGeoLocateCookie(geoLocateCookie.Region);
            }

            var glResult = {};
            glResult.RegionId = regionId;
            onSuccess(glResult);
        }
    }
}

function Html5GeoLocation(onSuccess, onError, onNoHtml5Geolocation, requestTimeout, isSession)
{
    if (isSession == undefined)
    {
        isSession = true;
    }

    if (!requestTimeout)
    {
        requestTimeout = 10000;
    }

    if (!html5GeolocationCancelled && navigator.geolocation)
    {
        //get position from cookie and call geolocation 
        if (readGeoLocateCookie("HTML5UserGeoPosition"))
        {
            var latlong = readGeoLocateCookie("HTML5UserGeoPosition");
            if (latlong && latlong.length > 0)
            {
                var geoposition = {};
                geoposition.coords = {};
                geoposition.coords.latitude = latlong.split(',')[0];
                geoposition.coords.longitude = latlong.split(',')[1];
                return Html5GeolocationSuccess(geoposition, onSuccess, isSession);
            }
        }

        requestingHtml5GeoLocation = true;

        $(document).oneTime(requestTimeout + 2000, "ff", function()
        {
            if (requestingHtml5GeoLocation)
            {
                requestingHtml5GeoLocation = false;
                Html5GeolocationUnavailable(onNoHtml5Geolocation);
            }
        });

        return navigator.geolocation.getCurrentPosition(function(position) { Html5GeolocationSuccess(position, onSuccess) }, function(error) { Html5GeolocationError(error, onError) }, { timeout: requestTimeout });
    }
    else
    {
        Html5GeolocationUnavailable(onNoHtml5Geolocation);
    }
}

function Html5GeolocationUnavailable(onNoHtml5Geolocation)
{
    // Html5 Geolocation has either timed out or been cancelled
    // so we don't want to rerun the function
    if (!html5GeolocationCancelled)
    {
        html5GeolocationCancelled = true;
        requestingHtml5GeoLocation = false;
        onNoHtml5Geolocation();
    }
}

function Html5GeolocationError(error, onError)
{
    requestingHtml5GeoLocation = false;
    onError();
}

function Html5GeolocationSuccess(position, onSuccess, isSession)
{
    requestingHtml5GeoLocation = false;
    var latlong = position.coords.latitude + ',' + position.coords.longitude;
    createGeoLocateCookie("HTML5UserGeoPosition", latlong, isSession); //save location in cookie
    onSuccess(position);
}

/* cookie functions */
function createGeoLocateCookie(name, value, isSession)
{
    var days = 31;

    if (!isSession)
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

function readGeoLocateCookie(name)
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

function eraseGeoLocateCookie(name)
{
    createGeoLocateCookie(name, "", -1);
}
