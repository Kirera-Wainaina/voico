/*
 * these is where the MIMETypes will be handled
 */

interface MIMETypesInterface {
  [index: string]: string
}

const MIMETypes: MIMETypesInterface = {
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

exports.findMIMETypeFromExtension = function (extension: string) {
  return MIMETypes[extension]
}

exports.findExtensionFromMIMEType = function (mimetype: string) {
  return Object.keys(MIMETypes).
    find(extension => MIMETypes[extension] === mimetype)
}
