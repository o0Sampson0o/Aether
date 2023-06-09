
// ----------------------------------------    dependencies    ----------------------------------------
const fs = require("fs");

// ----------------------------------------        utils       ----------------------------------------
const dateUtils = require("date-and-time");

const white = "\x1b[37m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red ="\x1b[31m";
const reset = "\x1b[0m";
const MODE = {
    msg: "MSG",
    suc: "SUC",
    war: "WAR",
    err: "ERR"
}

function LOG(mode, string) {
    const dateString = dateUtils.format(new Date(), 'YYYY/MM/DD HH:mm:ss'); 
    if (mode === MODE.msg) {
        console.log(white);
    } else if (mode === MODE.suc) {
        console.log(green);
    } else if (mode === MODE.war) {
        console.log(yellow);
    } else if (mode === MODE.err) {
        console.log(red);
    }

    const message = `[${mode}]\t${dateString}\n\t: ${string}\n`;
    console.log(message);
    console.log(reset);
    fs.appendFileSync("log.txt", message+'\n', function(err) {
        if(err) {
            return console.error(err);
        }
    }); 
}

module.exports.LOG = LOG;
module.exports.MODE = MODE;