"use strict";
/*
 * these is where the MIMETypes will be handled
 */
Object.defineProperty(exports, "__esModule", { value: true });
const MIMETypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.webm': 'audio/webm',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.xml': 'text/xml'
};
exports.findMIMETypeFromExtension = function (extension) {
    return MIMETypes[extension];
};
exports.findExtensionFromMIMEType = function (mimetype) {
    return Object.keys(MIMETypes).
        find(extension => MIMETypes[extension] === mimetype);
};
