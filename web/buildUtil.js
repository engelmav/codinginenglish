const AWS = require("aws-sdk");
var fs = require("fs");
var ftp = require("basic-ftp");

class UploadToSpacesPlugin {
  constructor(options) {
    this.options = options;
  }

  s3Upload(assetFilename) {
    console.log("**** Uploading", assetFilename);
    const { SPACES_ACCESS_KEY, SPACES_SECRET_KEY } = process.env;
    const creds = {};
    const credsObj = AWS.Credentials(creds);
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = SPACES_ACCESS_KEY;
    (AWS.config.secretAccessKey = SPACES_SECRET_KEY),
      (AWS.config.region = "us-east-1");

    const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
    });
    const { outputPath, s3Folder } = this.options;
    const assetFilePath = outputPath + "/" + assetFilename;
    console.log("*** assetFilePath", assetFilePath);
    const fileStream = fs.createReadStream(assetFilePath);
    const params = {
      Bucket: "cie-assets",
      Key: `${s3Folder}/${assetFilename}`,
      Body: fileStream,
      ACL: "public-read",
    };

    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log("Upload completed.", data);
    });
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("UploadToSpacesPlugin", (compilation) => {
      Object.keys(compilation.assets).map((asset) => this.s3Upload(asset));
    });
  }
}

var ftpClient;

async function ftpUpload(file) {
  const _client = ftpClient || (ftpClient = new ftp.Client());
  const access = await _client.access({
    host: host,
    port: port,
    user: username,
    password: password,
    secure: secure,
  });
}

module.exports = UploadToSpacesPlugin;
