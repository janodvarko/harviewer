/* See license.txt for terms of usage */

define([
    "../domplate/domplate",
    "../core/lib",
    "i18n!../nls/requestList",
    "./harModel",
    "../core/cookies",
],

function(Domplate, Lib, Strings, HarModel) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;

var EntrySizeInfoTip = domplate(
{
    tag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getSize"),
            DIV({
                "class": "sizeInfoTip",
                style: "display: $file|getCachedDisplayStyle"
            }, "$file|getCached")
        ),

    zippedTag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getBodySize"),
            DIV({"class": "sizeInfoTip"}, "$file|getContentSize"),
            DIV({
                "class": "sizeInfoTip",
                style: "display: $file|getCachedDisplayStyle"
            }, "$file|getCached")
        ),

    getSize: function(file)
    {
        var transferredSize = HarModel.getEntryTransferredSize(file);
        if (transferredSize < 0) {
            return Strings.unknownSize;
        }

        return Lib.formatString(Strings.tooltipSize,
            Lib.formatSize(transferredSize),
            Lib.formatNumber(transferredSize));
    },

    getBodySize: function(file)
    {
        var transferredSize = HarModel.getEntryTransferredSize(file);
        if (transferredSize < 0) {
            return Strings.unknownSize;
        }

        return Lib.formatString(Strings.tooltipZippedSize,
            Lib.formatSize(transferredSize),
            Lib.formatNumber(transferredSize));
    },

    getContentSize: function(file)
    {
        var contentSize = HarModel.getEntryUncompressedSize(file);
        if (contentSize < 0) {
            return Strings.unknownSize;
        }

        return Lib.formatString(Strings.tooltipUnzippedSize,
            Lib.formatSize(contentSize),
            Lib.formatNumber(contentSize));
    },

    getCached: function(file)
    {
        return HarModel.isCachedEntry(file) ? Strings.resourceFromCache : "";
    },

    getCachedDisplayStyle: function(file)
    {
        return HarModel.isCachedEntry(file) ? "block" : "none";
    },

    render: function(requestList, row, parentNode)
    {
        var file = row.repObject;

        var uncompressedSize = HarModel.getEntryUncompressedSize(file);
        var transferredSize = HarModel.getEntryTransferredSize(file);
        if (uncompressedSize === transferredSize) {
            return this.tag.replace({file: file}, parentNode);
        }

        return this.zippedTag.replace({file: file}, parentNode);
    }
});

return EntrySizeInfoTip;

});
