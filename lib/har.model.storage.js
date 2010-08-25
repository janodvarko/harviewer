/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR) {

// ************************************************************************************************

var indexedDB = window.indexedDB;
if (!indexedDB)
    indexedDB = window.moz_indexedDB;

HAR.Model.Storage =
{
    db: null,

    initialize: function()
    {
        if (!this.isEnabled())
            return;

        log("IndexedDB available");

        var self = this;
        var request = indexedDB.open("HARDB", "HAR Store");
        request.onsuccess = function(event)
        {
            var version = "1.5";
            var db = event.result;
            if (db.version !== version)
            {
                db.removeObjectStore("HAR").onsuccess = function(event)
                {
                    var store = db.createObjectStore("HAR", "id", true);
                    store.onsuccess = function(event) {
                        log("Object store created");
                        self.onLoadData(db);
                    }
                    db.setVersion(version);
                };
            }
            else
            {
                log("Object store is ready");
                self.onLoadData(db);
            }
        }
    },

    onLoadData: function(db)
    {
        this.db = db;
    },

    isEnabled: function()
    {
        return !!indexedDB;
    },

    save: function(label, harLog, size)
    {
        if (!this.isEnabled())
            return;

        var record = {
            label: label,
            date: new Date().getTime(),
            har: harLog,
            size: size
        };

        var objectStore = this.db.objectStore("HAR", false);
        objectStore.add(record).onsuccess = function(event)
        {
            log("HAR saved into database");
        }
    },

    getAll: function(callback)
    {
        var result = [];
        var request = this.db.objectStore("HAR").openCursor();
        request.onsuccess = function(event)
        {
            var cursor = event.result;

            // If cursor is null then we've completed the enumeration.
            if (!cursor)
                return callback(result);

            result.push(cursor.value);
            cursor["continue"]();
        };
    }
};

// ************************************************************************************************
// Registration

//HAR.registerModule(HAR.Model.Storage);

// ************************************************************************************************
}});
