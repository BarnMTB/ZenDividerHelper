document.addEventListener('DOMContentLoaded', function () {

    const appName = "ZenDivider"
    const appVersion = "202505_1.0 WebExtensions_FF"
    const appAbout = appName + " by BarnMTB, Version " + appVersion + ", https://github.com/BarnMTB/ZenDivider"
    const defaultTitle = appName
    const targetTextBox = document.getElementById('titleInput'); // Target textbox that contains input, locate by ID

    //-----------------------------------------------Grab Query from URL
    function grabTextQuery() {
        var url = window.location.href; // Get the full URL of the current page
        var parsedUrl = new URL(url); // Create a URL object to parse the URL
        var queryParams = parsedUrl.searchParams; // Get the search parameters from the URL

        // Get the value of the 'text' query parameter
        var textValue = queryParams.get('text');

        console.log(textValue); // Print the value of the 'text' query parameter
        targetTextBox.value = textValue; // Set the text value in the target textbox to the query

        renameTabTitleCommit();
        removeEmptyTextQuery();
    }

    //-----------------------------------------------Monitor text change
    targetTextBox.addEventListener('input', function () {
        renameTabTitleCommit();
        updateTextQueryCommit();
        //appInfoRevealCheck();
    });

    //-----------------------------------------------Change tab's title
    function renameTabTitle(input) {
        if (typeof input != 'string') { throw new Error("Invalid input: Expected a string."); };

        if (input == "") { document.title = defaultTitle }
        else if (input != null) { document.title = input }
        else { document.title = defaultTitle };
    }
    function renameTabTitleCommit() {
        renameTabTitle(targetTextBox.value);
    }

    grabTextQuery();

    //-----------------------------------------------Remove empty query from URL
    function removeEmptyTextQuery() {
        const url = new URL(window.location.href);
        const textParam = url.searchParams.get("text");

        if (textParam === "") {
            url.searchParams.delete("text");
            window.history.replaceState({}, document.title, url.toString());
        }
    }
    //-----------------------------------------------Update Query from URL
    function updateTextQuery(input) {
        const url = new URL(window.location.href); // Get the current URL

        url.searchParams.set("text", input); // Modify the query parameter "text"
        window.history.replaceState(null, "", url); // Update the browser's address bar without reloading the page
    }
    function updateTextQueryCommit() {
        removeEmptyTextQuery();
        updateTextQuery(targetTextBox.value);
    }

    //-----------------------------------------------Click anywhere to start typing
    /*
    document.addEventListener("click", function () {
        targetTextBox.focus();
    });
    */

    //-----------------------------------------------Unfocuses when pressing Esc or Enter
    targetTextBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === "Escape") {
            appInfoRevealCheck();
            targetTextBox.blur();
            updateTextQueryCommit();
        }
    });

    //-----------------------------------------------Show App Info
    function appInfoRevealCheck() {
        if (targetTextBox.value.toLowerCase() === (appName + ":about").toLowerCase() || targetTextBox.value.toLowerCase() === (appName + ":info").toLowerCase()) {
            targetTextBox.value = appAbout;
        }
    }


});