const htmlFile = "ZenDivider/ZenDivider.html";

//-----------------------------------------------Spawner function
async function spawnDivider(currentTab, text = null) {
    try {
        let url = htmlFile;
        if (text) {
            // Encode the text for URL safety
            url += `?text=${encodeURIComponent(text)}`;
        }

        // Create the new tab before the current tab
        const newTab = await browser.tabs.create({
            url: url,
            index: currentTab.index,
            active: !text
        });
        
        console.log("Opened a divider in tab ID:", newTab.id);
        return newTab;
    } catch (error) {
        console.error("Error opening a divider with tab index:", error);
        
        // Second try: Create tab without index (default position)
        try {
            const fallbackTab = await browser.tabs.create({
                url: url,
                active: !text
            });
            
            console.log("Opened a divider in fallback tab ID:", fallbackTab.id);
            return fallbackTab;
        } catch (fallbackError) {
            console.error("Error opening a divider in fallback attempt:", fallbackError);
            throw fallbackError; // Re-throw the error if both attempts fail
        }
    }
}


//-----------------------------------------------Browser Toolbar Button
browser.action.onClicked.addListener(async (tab) => {
    try {
        await spawnDivider(tab);
    } catch (error) {
        console.error("Failed to handle browser action click:", error);
    }
});

//-----------------------------------------------Context Menu
browser.menus.create({
    id : "newdivider_contextmenu_toolsmenu",
    title: "New Divider",
    command : "_execute_action",
    contexts : ["tools_menu"]
});

browser.menus.create({
    id : "newdivider_contextmenu_tabs",
    title: "New Divider",
    //command : "_execute_action",
    contexts : ["tab"]
});
// Handle context menu clicks
browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "newdivider_contextmenu_tabs") {
        try {
            await spawnDivider(tab);
            console.log(tab, info);
        } catch (error) {
            console.error("Failed to handle context menu click:", error);
        }
    }
});

//-----------------------------------------------Omnibox
browser.omnibox.setDefaultSuggestion({
    description: "Create a new divider"
});

browser.omnibox.onInputEntered.addListener(async (text, disposition) => {
    try {
        // Get the current tab to determine position
        const currentTab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
        
        console.log("Omnibox Entered:", text, disposition);
        if (text === "") {
            // Default suggestion was selected (empty text)
            spawnDivider(currentTab);
        } else {
            // User entered text - pass it to spawnExample
            spawnDivider(currentTab, text);
        }
    } catch (error) {
        console.error("Omnibox error:", error);
    }
});