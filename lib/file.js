
"use strict";

const path = require('path');
const fs = require('fs');

module.exports = Object.freeze({
    getCurrentDirectoryBase:()=>{
        return path.basename(process.cwd());
    },
    directoryExists : (file)=>{
        return fs.existsSync(file);
    }
});