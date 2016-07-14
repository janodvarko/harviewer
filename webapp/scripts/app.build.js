({
    appDir: "../",

    baseUrl: "scripts/",

    dir: "../../webapp-build",

    // Comment out the optimize line if you want
    // the code minified by Closure Compiler using
    // the "simple" optimizations mode
    //optimize: "simple",

    optimizeCss: "standard",

    modules: [
        {
            name: "harViewer",
            include: [
                "nls/harViewer",
                "nls/homeTab",
                "nls/harStats",
                "nls/previewTab",
                "nls/requestBody",
                "nls/requestList"
            ],
            excludeShallow: [
                "domplate/domplate",
                "core/trace"
            ]
        },
        {
            name: "harPreview",
            include: [
                "nls/requestBody",
                "nls/requestList"
            ],
            excludeShallow: [
                "domplate/domplate",
                "core/trace"
            ]
        }
    ]
});
