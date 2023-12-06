import { Http2ServerRequest } from "http2";
import path from "path";
import { Readable } from "stream";
import fs from "fs";

const busboy = require("busboy");
const { generateRandomName, log } = require("./utils");
const mimes = require("./MIMEHandler");

interface Fields {
  [index: string]: string
}

interface FileInfo {
  filename: string,
  encoding: string,
  mimeType: string
}

module.exports = class {
  request: Http2ServerRequest;
  fields: Fields;
  thereIsFile: boolean;
  fileNumber: number;
  uploadedFiles: string[];

  constructor(request:Http2ServerRequest) {
    this.request = request;
    this.fields = {};
    this.thereIsFile = false;
    this.fileNumber = 0;
    this.uploadedFiles = [];

    // handlefields method isn't bound to this like the other methods
    this.handleFields = this.handleFields.bind(this);
  }

  run() {
    return new Promise((resolve, reject) => {
      const bb = busboy({ headers: this.request.headers });

      bb.on("field", this.handleFields);
      bb.on(
        "file", 
        (name: string, stream: Readable, info: FileInfo) => this.saveFiles(name, stream, info, resolve)
      );
      bb.on("close", () => this.onRetrievingAllData(resolve));
      this.request.pipe(bb)
    })

  }

  handleFields(name: string, value: string) {
    this.fields[name] = value;
  }

  saveFiles(name: string, stream: Readable, info: FileInfo, resolve: any) {
    const randomName = generateRandomName();
    const ext = mimes.findExtensionFromMIMEType(info.mimeType);
    const filePath = path.join(__dirname, '..', "uploaded", `${randomName}${ext}`);
    stream.pipe(fs.createWriteStream(filePath))
      .on("finish", () => this.onSavingFile(filePath, resolve))
  }

  onSavingFile(filePath: string, resolve:any) {
    this.uploadedFiles.push(filePath)
    this.thereIsFile = true;
    this.fileNumber += 1;

    if (this.fileNumber == Number(this.fields.fileNumber)) {
      log("All files have been saved")
      resolve([this.fields, this.uploadedFiles])
    }
  }

  onRetrievingAllData(resolve: any) {
    log("All data has been received");
    if (this.thereIsFile) {
      if (!this.fields.fileNumber) {
        throw new Error("fileNumber field was not uploaded");
      } else if (this.fileNumber == Number(this.fields.fileNumber)) {
        resolve([this.fields, this.uploadedFiles]);
      } else {
        return ;
      }
    }
  }
}