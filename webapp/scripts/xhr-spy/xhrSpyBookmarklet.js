javascript:(function(){
    var head=document.getElementsByTagName("head")[0];
    var create=document.createElement;
    var a=create("script");
    a.type="text/javascript";
    a.src="http://legoas/har/viewer/webapp/scripts/requireplugins-jquery-1.4.2.js";
    head.appendChild(a);

    var a=create("script");
    a.type="text/javascript";
    a.src="ttp://legoas/har/viewer/webapp/scripts/xhrSpy.js";
    document.getElementsByTagName("head")[0].appendChild(a);
})();
