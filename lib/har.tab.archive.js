/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

HAR.Tab.ArchiveView = domplate(
{
    id: "Archive",
    label: "viewer.tab.Local DB",

    tag:
        TABLE({"class": "archiveTable", cellpadding: 0, cellspacing: 0,
            onclick: "$onClickEntry"},
            TBODY(
                FOR("entry", "$entries",
                    TR({"class": "archiveRow"},
                        TD({"class": "archiveCol"},
                            INPUT({type: "checkbox"})
                        ),
                        TD({"class": "label archiveCol"},
                            DIV("$entry.label")
                        ),
                        TD({"class": "date archiveCol"},
                            DIV("$entry.date|formatDate")
                        ),
                        TD({"class": "config archiveCol"},
                            SPAN("$entry.har.log.creator.name"),
                            SPAN("$entry.har.log.creator.version"),
                            SPAN(", "),
                            SPAN("$entry.har.log.browser.name"),
                            SPAN("$entry.har.log.browser.version")
                        ),
                        TD({"class": "size archiveCol"},
                            DIV("$entry.size|formatSize")
                        )
                    )
                )
            )
        ),

    defaultTag:
        DIV({style: "padding: 10px"}, "You need Firefox 4.0 with IndexedDB support in order to use this feature"),

    onClickEntry: function(event)
    {
        
    },

    formatSize: function(size)
    {
        return HAR.Lib.formatSize(size);
    },

    formatDate: function(date)
    {
        return new Date(date).toLocaleString();
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Module

    initialize: function()
    {
        if (HAR.Model.Storage.isEnabled())
        {
            var tab = HAR.Viewer.getTab("Preview");
            tab.toolBar.addButton({tag: this.Save.tag});
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Tab

    onUpdateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;
        var tabArchiveBody = getElementByClass(viewBody, "tabArchiveBody");
        if (hasClass(tab, "ArchiveTab") && !tabArchiveBody.updated)
        {
            //tabArchiveBody.updated = true;
            HAR.Tab.ArchiveView.render({}, tabArchiveBody);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    render: function(inputData, parentNode)
    {
        clearNode(parentNode);

        if (!HAR.Model.Storage.isEnabled())
            return this.defaultTag.append(inputData, parentNode);

        // Create toolbar
        this.toolBar = new HAR.ToolBar();
        this.toolBar.addButton({label: "My Button"});
        this.toolBar.render(parentNode);

        var self = this;
        stores = HAR.Model.Storage.getAll(function(result) {
            self.tag.replace({entries: result}, parentNode);
        });
    },
});

// ************************************************************************************************

HAR.Tab.ArchiveView.Save = domplate(
{
    tag:
        SPAN({"class": "harSaveButton harButton image",
            title: $STR("tooltip.Save HAR File"),
            onclick: "$onClick"}),

    onClick: function(event)
    {
        var size = HAR.Model.getSize();
        var inputData = HAR.Model.inputData;
        if (!inputData)
            return;

        var label = inputData.log.comment ? inputData.log.comment : "My HAR log";
        HAR.Model.Storage.save(label, HAR.Model.inputData, size);
    }
});

// ************************************************************************************************
// Registration

// Feature detection. This tab uses IndexedDB and it's available only in case
// this API is supported by the current browser.
if (HAR.Model.Storage.isEnabled())
{
    HAR.registerTab(HAR.Tab.ArchiveView, "Schema");
    HAR.registerModule(HAR.Tab.ArchiveView);
}

// ************************************************************************************************
}}});
