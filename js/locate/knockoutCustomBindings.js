// ifAny
// Allows you to perform an if-like binding, passing multiple view model properties for evaluation.
// Pass multiple as an array, such as data-bind="ifAny: [PropertyOne, PropertyTwo, PropertyThree]"
// or pass just one, such as data-bind="ifAny: PropertyOne".
// Also allows you to use containerless control / virtual element syntax such as
// <!-- ko ifAny: [PropertyOne, PropertyTwo, PropertyThree] -->
//   <div data-bind="text: PropertyOne"></div>
// <!-- /ko -->
ko.bindingHandlers.ifAny = {
    makeTemplateValueAccessor: function (valueAccessor)
    {
        var value = valueAccessor();
        var result = false;

        if (value.constructor == Array)
        {
            for (index in value)
            {
                var unwrapped = ko.utils.unwrapObservable(value[index]);
                if (unwrapped || unwrapped === 0)
                {
                    result = true;
                    break;
                }
            }
        }
        else
        {
            var unwrapped = ko.utils.unwrapObservable(value);
            if (unwrapped || unwrapped === 0)
            {
                result = true;
            }
        }

        return function () { return { 'if': result, 'templateEngine': ko.nativeTemplateEngine.instance} };
    },
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
    {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers.ifAny.makeTemplateValueAccessor(valueAccessor));
    },
    'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
    {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers.ifAny.makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.virtualElements.allowedBindings.ifAny = true;


// flashMovie
// Allows you to inject a SWF into an element. Replaces the FlashPlaceholder and Swf controls.
// Requires a binding context of type Bmw.ViewModel.CmsPlaceholders.FlashMovieViewModel.
// Example: <div data-bind="flashMovie: ByoLandingSwf">Search Engine Text</div><div id="AlternativeContent"></div>
ko.bindingHandlers.flashMovie = {
    init: function (element, valueAccessor)
    {
        var value = ko.toJS(valueAccessor());

        var flashobj = new SWFObject(value.MovieUrl, "SWFContent", value.Width, value.Height, "8", "#FFFFFF");
        flashobj.addParam("name", "SWFContent");
        flashobj.addParam("wmode", "opaque");
        flashobj.addParam("allowScriptAccess", "always");
        flashobj.addParam("pluginspage", "http://www.macromedia.com/go/getflashplayer");
        flashobj.addParam("quality", "high");

        if (value.VariablesString)
        {
            flashobj.addParam("flashvars", value.VariablesString);
        }

        if (value.VariablesDictionary)
        {
            var dictionary = value.VariablesDictionary;
            for (variable in dictionary)
            {
                flashobj.addVariable(variable, dictionary[variable]);
            }
        }

        if (swfobject.getFlashPlayerVersion().major >= 9)
        {
            flashobj.write(element);
            SWFFormFixAuto();
        }
        else
        {
            var $flashDiv = $(element);

            if (value.AlternateContentSelector)
            {
                $flashDiv.hide();
                $(value.AlternateContentSelector).show();
            }
            else if (value.AlternateImageUrl)
            {
                var $image = $('<img />').attr({ "src": value.AlternateImageUrl, "width": value.Width, "height": value.Height });
                $flashDiv.html('');
                $flashDiv.append($image);
            }
        }
    }
};

// CurrencyFormatter
// converts the numeric input value to its currency notation. 21000 converts to $21,000.00
// options: displayCents, prependText, appendText
// Example: <span data-bind="CurrencyFormatter: Price, prependText:'Starting at ', appendText:' MSRP'"></span>
ko.bindingHandlers.Currency = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var num = ko.utils.unwrapObservable(value);
        var displayCents = allBindings.displayCents ? true : false;
        var prependText = allBindings.prependText ? allBindings.prependText : '';
        var appendText = allBindings.appendText ? allBindings.appendText : '';

        if (isNaN(num)) num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));

        var $formattedValue = (prependText + ((sign) ? '' : '-') + '$' + num +  ((displayCents) ? ('.' + cents) : '') + appendText);
        $(element).html('');
        $(element).append($formattedValue)
    }
};