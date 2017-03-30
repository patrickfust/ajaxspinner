/**
 * JQuery plugin for handling showing/hiding ajax-spinners
 * It can show/hide an ajax spinner
 * There's two parts
 * - An big Ajax-spinner, that fills the entire screen, but is only shown if it's a long time process.
 * - An little network indicator, that are turned on instantly every time an ajax call is in process.
 */
(function ($) {

    // Plugin definition.
    $.fn.ajaxSpinner = function( options ) {

        // Extend our default options with those provided.
        // Note that the first argument to extend is an empty
        // object – this is to keep from overriding our "defaults" object.
        var opts = $.extend( {}, $.fn.ajaxSpinner.defaults, options );

        var ajaxSpinner = false; // Do we show the spinner right now?
        var ajaxSpinnerStartTime = 0; // When did we start to show the spinner?

        $(opts.loadingContainerId).hide();
        var networkActivityIcon = $(opts.networkActivityIconId);

        $(document).ajaxStart(function () {
            ajaxSpinner = true;
            networkActivityIcon.removeClass(opts.inactiveClass);
            networkActivityIcon.addClass(opts.activeClass);
            setTimeout(function () {
                if (ajaxSpinner === true) {
                    $(opts.loadingContainerId).fadeIn(opts.fadeIn);
                    ajaxSpinnerStartTime = new Date().getTime();
                }
            }, opts.spinnerTimeBeforeShowingSpinner);
        });

        $(document).ajaxComplete(function () {
            networkActivityIcon.addClass(opts.inactiveClass);
            networkActivityIcon.removeClass(opts.activeClass);
            var spinnerIsShown = new Date().getTime() - ajaxSpinnerStartTime;
            if (spinnerIsShown > opts.spinnerMinimumShowing) {
                // Time is up
                $(opts.loadingContainerId).fadeOut(opts.fadeOut, function() { ajaxSpinner = false; });
            } else {
                // Wait a little longer, so we don't see the entire screen flashing
                var waitALittleLonger = opts.spinnerMinimumShowing - spinnerIsShown;
                if (waitALittleLonger < 50) {
                    waitALittleLonger = 50; // Wait no less than 50 ms
                }
                setTimeout(function() {
                    $(opts.loadingContainerId).fadeOut(opts.fadeOut, function() { ajaxSpinner = false; });
                }, waitALittleLonger);
            }
        });

        return this;
    };

    // Plugin defaults – added as a property on our plugin function.
    $.fn.ajaxSpinner.defaults = {
        spinnerMinimumShowing: 600,             // Minimum time to show spinner
        spinnerTimeBeforeShowingSpinner: 500,   // We won't show spinner before this time is passed
        fadeIn: 100,                            // Fade in time for spinner
        fadeOut: 100,                           // Fade out time for spinner
        loadingContainerId: "#loadingContainer",// Id for loadingContainer
        networkActivityIconId: "#networkActivity span", // Selector for small icon that quickly shows network activity
        activeClass: "active",                          // Added class for 'networkActivityIconId' when network there's network activity
        inactiveClass: 'inactive'                       // Added class for 'networkActivityIconId' when network there's no network activity
    };

})(jQuery);
