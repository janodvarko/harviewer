/* See license.txt for terms of usage */

require.def("core/cookies", [
    "core/lib"
],

function(Lib) {

//*************************************************************************************************

var Cookies =
{
    getCookie: function(name)
    {
        var cookies = document.cookie.split(";");
        for (var i= 0; i<cookies.length; i++)
        {
            var cookie = cookies[i].split("=");
            if (Lib.trim(cookie[0]) == name)
                return cookie[1].length ? unescape(Lib.trim(cookie[1])) : null;
        }
    },

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

    getBooleanCookie: function(name)
    {
        var value = this.getCookie(name);
        return (!value || value == "false") ? false : true;
    },

    setBooleanCookie: function(name, value)
    {
        this.setCookie(name, value ? "true" : "false");
    }
};

return Cookies;

//*************************************************************************************************
});
