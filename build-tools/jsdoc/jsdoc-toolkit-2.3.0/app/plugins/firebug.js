JSDOC.PluginManager.registerPlugin(
    "JSDOC.firebugPlugin",
    {
        onSymbol: function(symbol)
        {
            // @dialog
            var dialogs = symbol.comment.getTag("dialog");
            if (dialogs.length) {
                symbol.isa = "CONSTRUCTOR";
                symbol.isDialog = true;
                symbol.classDesc = dialogs[0].desc;
            }

            // @domplate
            var domplates = symbol.comment.getTag("domplate");
            if (domplates.length) {
                symbol.isa = "CONSTRUCTOR";
                symbol.isDomplate = true;
                symbol.classDesc = domplates[0].desc;
            }

            // @panel
            var panels = symbol.comment.getTag("panel");
            if (panels.length) {
                symbol.isa = "CONSTRUCTOR";
                symbol.isPanel = true;
                symbol.classDesc = panels[0].desc;
            }

            // @module
            var modules = symbol.comment.getTag("module");
            if (modules.length) {
                symbol.isa = "CONSTRUCTOR";
                symbol.isModule = true;
                symbol.classDesc = modules[0].desc;
            }

            // @service
            var services = symbol.comment.getTag("service");
            if (services.length) {
                symbol.isa = "CONSTRUCTOR";
                symbol.isService = true;
                symbol.classDesc = services[0].desc;
            }
        }
    }
);