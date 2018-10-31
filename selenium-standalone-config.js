// Used with with selenium-standalone npm package
// https://www.npmjs.com/package/selenium-standalone
module.exports = {
    version: "3.14.0",
    drivers: {
        chrome: {
            version: "2.43",
        },
        firefox: {
            comment: ">0.21.0 doesn't work in Intern yet",
            version: "0.21.0",
        },
        ie: {
            version: "3.4.0",
            arch: "ia32",
        },
        edge: {
            version: "17134",
        },
    },
    javaArgs: [
        "-Dwebdriver.firefox.bin=c:/apps/Firefox/firefox.exe",
    ],
};
