# Ajax Spinner
Handles showing/hiding ajax-spinners

JQuery plugin for handling showing/hiding ajax-spinners.
It can show/hide an ajax spinner.
There's two parts:
- An big Ajax-spinner, that fills the entire screen, but is only shown if it's a long time process.
- An little network indicator, that are turned on instantly every time an ajax call is in process.

# Usage
Include the javascript file and the css file containing your spinner.

```html
<link rel="stylesheet" href="ajaxSpinner.css"/>
<script type="text/javascript" src="ajaxSpinner.js"></script>

```

Initialize the Ajax Spinner

```javascript
$(function () {
    $().ajaxSpinner();
});
```

On your page, you'll need a div that can take up the entire window
```html
<div class="loading" id="loadingContainer">Loading...</div>
```

You may also have a small network indicator that shows up instantly.
If you ie use http://getbootstrap.com, you have the glyphicons (http://glyphicons.com), 
you can use an icon:

```html
<span id="networkActivity">
    <span class="glyphicon glyphicon-flash inactive"></span>
</span>
```

Specify two classes `active` and `inactive` on how to show/hide the network indicator.
Example:
```css
#networkActivity .active {
	-webkit-transition: all 50ms ease;
	-moz-transition: all 50ms ease;
	-o-transition: all 50ms ease;
	transition: all 50ms ease;
	color: black;
}

#networkActivity .inactive {
	-webkit-transition: all 50ms ease;
	-moz-transition: all 50ms ease;
	-o-transition: all 50ms ease;
	transition: all 50ms ease;
	color: white;
}
```

# Methods

Method | Description
------ | -----------
`init` | Initializes the AjaxSpinner.
`isShown` | Returns true/false to tell whether or not the spinner is currently shown.
`show` | Force showing spinner
`hide` | Force hiding spinner

Methods are called using parameter to `ajaxSpinner`.

## Example

### Show whether or not the spinner is currently shown

```javascript
alert('Spinner is shown: ' + $().ajaxSpinner('isShown'));
```

# Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
`spinnerMinimumShowing` | Integer | `600` | Minimum time in ms to show spinner. If we've started to show the spinner, this is the minimum time it's shown.
`spinnerTimeBeforeShowingSpinner` | Integer | 500 | We won't show spinner before this time (in ms) is passed.
`spinnerMinimumWaitTime` | Integer | 50 | When waiting, don't wait less than this.
`fadeIn` | Integer | `100` | Fade in time for spinner.
`fadeOut` | Integer | `100` | Fade out time for spinner.
`loadingContainerId` | String | `#loadingContainer` | Id for loadingContainer.
`networkActivityIconId` | String | `#networkActivity span` | Selector for small icon that quickly shows network activity.
`activeClass` | String | `active`| Added class for 'networkActivityIconId' when network there's network activity.
`inactiveClass` | String | `inactive` | Added class for 'networkActivityIconId' when network there's no network activity.

## Example of overriding defaults

```javascript
$(function () {
    $().ajaxSpinner({fadeIn: 2000, loadingContainerId: '#myOwnContainer'});
});
```
