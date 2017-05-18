/**
 * JQuery plugin for handling showing/hiding ajax-spinners
 * It can show/hide an ajax spinner
 * There's two parts
 * - An big Ajax-spinner, that fills the entire screen, but is only shown if it's a long time process.
 * - An little network indicator, that are turned on instantly every time an ajax call is in process.
 */
(function ($) {

    var ajaxSpinnerShown = false; // Do we show the spinner right now?
    var ajaxSpinnerStartTime = 0; // When did we start to show the spinner?
    var opts;

    var methods = {
        /**
         * Initializes AjaxSpinner
         */
        init : function(options) {
            // Extend our default options with those provided.
            // Note that the first argument to extend is an empty
            // object – this is to keep from overriding our "defaults" object.
            opts = $.extend( {}, $.fn.ajaxSpinner.defaults, options );

            $(opts.loadingContainerId).hide(); // Make sure the loading container is hidden in the beginning

            $(document).ajaxStart(function () { ajaxStart(); });
            $(document).ajaxComplete(function () { ajaxComplete(); });

            return this;
        },
        /**
         * Show the spinner
         */
        show : function() {
            $(opts.loadingContainerId).fadeIn(opts.fadeIn);
            ajaxSpinnerStartTime = new Date().getTime();
            ajaxSpinnerShown = true;
            if (opts.checkEveryMilliSeconds > 0) {
                setTimeout(function() {
                    checkIsAjaxStillActive();
                }, opts.checkEveryMilliSeconds);
            }
            return this;
        },
        /**
         * Hide the spinner
         */
        hide : function() {
            $(opts.loadingContainerId).fadeOut(opts.fadeOut, function() { ajaxSpinnerShown = false; });
            return this;
        },
        /**
         * Is the AjaxSpinner shown?
         * @returns {boolean}
         */
        isShown : function() {
            return ajaxSpinnerShown;
        }
    };

    function checkIsAjaxStillActive() {
        var spinnerIsShown = new Date().getTime() - ajaxSpinnerStartTime;
        if (jQuery.active === 0 || spinnerIsShown > opts.spinnerMaximumTime) {
            // Is not longer active or max time is passed
            if (ajaxSpinnerShown) {
                ajaxComplete();
            }
        } else {
            setTimeout(function() {
                checkIsAjaxStillActive();
            }, opts.checkEveryMilliSeconds);
        }
    }

    function ajaxStart() {
        ajaxSpinnerShown = true;
        var networkActivityIcon = $(opts.networkActivityIconId);
        networkActivityIcon.removeClass(opts.inactiveClass);
        networkActivityIcon.addClass(opts.activeClass);
        setTimeout(function () {
            if (ajaxSpinnerShown === true) {
                methods.show.apply(this, arguments);
            }
        }, opts.spinnerTimeBeforeShowingSpinner);
    }

    function ajaxComplete() {
        var networkActivityIcon = $(opts.networkActivityIconId);
        networkActivityIcon.addClass(opts.inactiveClass);
        networkActivityIcon.removeClass(opts.activeClass);
        var spinnerIsShown = new Date().getTime() - ajaxSpinnerStartTime;
        if (spinnerIsShown > opts.spinnerMinimumShowing) {
            // Time is up
            methods.hide.apply(this, arguments);
        } else {
            // Wait a little longer, so we don't see the entire screen flashing
            var waitALittleLonger = opts.spinnerMinimumShowing - spinnerIsShown;
            if (waitALittleLonger < opts.spinnerMinimumWaitTime) {
                waitALittleLonger = opts.spinnerMinimumWaitTime; // Wait no less than spinnerMinimumWaitTime
            }
            setTimeout(function() {
                methods.hide.apply(this, arguments);
            }, waitALittleLonger);
        }
    }

    // Plugin definition.
    $.fn.ajaxSpinner = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.ajaxSpinner');
        }
    };

    // Plugin defaults – added as a property on our plugin function.
    $.fn.ajaxSpinner.defaults = {
        spinnerMinimumShowing: 600,                     // Minimum time to show spinner
        spinnerTimeBeforeShowingSpinner: 500,           // We won't show spinner before this time is passed
        spinnerMinimumWaitTime: 50,                     // When waiting, don't wait less than this
        spinnerMaximumTime: 60000,                      // Maximum time to show spinner. Only in use when checkEveryMilliSeconds > 0
        fadeIn: 100,                                    // Fade in time for spinner
        fadeOut: 100,                                   // Fade out time for spinner
        loadingContainerId: "#loadingContainer",        // Id for loadingContainer
        networkActivityIconId: "#networkActivity span", // Selector for small icon that quickly shows network activity
        activeClass: "active",                          // Added class for 'networkActivityIconId' when network there's network activity
        inactiveClass: 'inactive',                      // Added class for 'networkActivityIconId' when network there's no network activity
        checkEveryMilliSeconds: 1000                    // Check every x milliseconds, to see if ajax is still running or spinnerMaximumTime is passed
    };

})(jQuery);
