// Used with with selenium-standalone npm package
// https://www.npmjs.com/package/selenium-standalone
module.exports = {
    version: "3.4.0",
    drivers: {
        chrome: {
            version: "2.37",
        },
        firefox: {
            version: "0.20.1",
        },
        ie: {
            version: "3.4.0",
            arch: "ia32",
        },
    },
    javaArgs: [
        "-Dwebdriver.firefox.bin=c:/apps/Firefox/firefox.exe",
    ],
};
