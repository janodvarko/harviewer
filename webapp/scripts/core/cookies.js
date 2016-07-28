/* See license.txt for terms of usage */

/**
 * @module core/cookies
 */
define([
    "./string"
],

function(Str) {

//*************************************************************************************************

/**
 * Helper functions for handling cookies.
 * @alias module:core/cookies
 */
var Cookies =
{
    /**
     * @param {String} name The name of the cookie to get the value of.
     * @return {String} The cookie value if found, else `null` if the cookie exists but has no
     *     value, else `undefined`.
     */
    getCookie: function(name)
    {
        var cookies = document.cookie.split(";");
        for (var i= 0; i<cookies.length; i++)
        {
            var cookie = cookies[i].split("=");
            if (Str.trim(cookie[0]) === name)
                return cookie[1].length ? unescape(Str.trim(cookie[1])) : null;
        }
    },

    /**
     * Sets a cookie.
     * @param {String} name The name of the cookie.
     * @param {String} value The value of the cookie.
     * @param {Number} expires Cookie expiry in days.
     * @param {String} path The path of the cookie.
     * @param {String} domain The domain of the cookie.
     * @param {Boolean} secure Is the cookie secure?
     */
    setCookie: function(name, value, expires, path, domain, secure)
    {
        var today = new Date();
        today.setTime(today.getTime());

        if (expires)
            expires = expires * 1000 * 60 * 60 * 24;

        var expiresDate = new Date(today.getTime() + expires);
        document.cookie = name + "=" + escape(value) +
            (expires ? ";expires=" + expiresDate.toGMTString() : "") +
            (path ? ";path=" + path : "") +
            (domain ? ";domain=" + domain : "") +
            (secure ? ";secure" : "");
    },

    /**
     * Removes a cookie, by setting its expiry to a date in the past.
     * @param {String} name The name of the cookie.
     * @param {String} path The path of the cookie.
     * @param {String} domain The domain of the cookie.
     */
    removeCookie: function(name, path, domain)
    {
        if (this.getCookie(name))
        {
            document.cookie = name + "=" +
                (path ? ";path=" + path : "") +
                (domain ? ";domain=" + domain : "") +
                ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
    },

    toggleCookie: function(name)
    {
        var value = this.getBooleanCookie(name);
        this.setCookie(name, !value);
    },

    /**
     * Returns a `true`/`false` value for the cookie with name, `name`.
     * @param {String} name The name of the cookie.
     * @return {Boolean} `false` if the cookie does not exist, or has a value == `"false"`,
     *     else `true`.
     */
    getBooleanCookie: function(name)
    {
        var value = this.getCookie(name);
        return (!value || value === "false") ? false : true;
    },

    /**
     * Sets a `true`/`false` cookie value for the cookie with name, `name`.
     * @param {String} name The name of the cookie.
     * @param {Object} value The value to set.  If truthy, the cookie value will be set to
     *     `"true"`, else it will be set to `"false"`.
     */
    setBooleanCookie: function(name, value)
    {
        this.setCookie(name, value ? "true" : "false");
    }
};

return Cookies;

//*************************************************************************************************
});
