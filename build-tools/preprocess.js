var pp = require("preprocess");

var args = process.argv.slice(2);

var infile = args[0];
var outfile = args[1];

pp.preprocessFileSync(infile, outfile, {}, { type: "js" });
