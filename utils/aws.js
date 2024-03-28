const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const {
  MediaConvertClient,
  CreateJobCommand,
} = require("@aws-sdk/client-mediaconvert");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const aws = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "ap-south-1",
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
  },
  cloudfront: {
    fqdn: process.env.AWS_CLOUDFRONT_DOMAIN,
    keyId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID,
    key: fs.readFileSync("./.keys/aws.pem"),
  },
  mediaConvert: {
    role: process.env.AWS_MEDIACONVERT_ROLE,
    outputPresets: [
      { preset: "System-Avc_16x9_360p_29_97fps_1200kbps", resolution: 360 },
      { preset: "System-Avc_16x9_720p_29_97fps_3500kbps", resolution: 720 },
      {
        preset: "System-Avc_16x9_1080p_29_97fps_8500kbps",
        resolution: 1080,
      },
    ],
  },
};

async function convertVideo(videoFileName, resolutions, outputFolder) {
  const client = new MediaConvertClient({
    region: aws.region,
    credentials: aws.credentials,
  });
  const outputs = aws.mediaConvert.outputPresets
    .filter(({ resolution }) => resolutions.includes(resolution))
    .map(({ preset, resolution }) => ({
      Name: "Apple HLS",
      Outputs: [
        {
          Preset: preset,
          OutputSettings: {
            HlsSettings: {
              SegmentModifier: "seg",
            },
          },
          NameModifier: `-${resolution}`,
        },
      ],
      OutputGroupSettings: {
        Type: "HLS_GROUP_SETTINGS",
        HlsGroupSettings: {
          SegmentLength: 10,
          Destination: "s3://" + process.env.AWS_S3_BUCKET + `/${outputFolder}`,
          MinSegmentLength: 0,
        },
      },
    }));
  const command = new CreateJobCommand({
    Role: aws.mediaConvert.role,
    Settings: {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      OutputGroups: outputs,
      FollowSource: 1,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
          FileInput: "s3://" + aws.s3.bucket + videoFileName,
        },
      ],
    },
    AccelerationSettings: {
      Mode: "DISABLED",
    },
    StatusUpdateInterval: "SECONDS_15",
    Priority: 0,
  });
  return await client.send(command);
}

function getCloudfrontUrl(fileName) {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  date = date.toISOString();

  return getSignedUrl({
    url: aws.cloudfront.fqdn + `${fileName}`,
    keyPairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID,
    dateLessThan: date.split("T")[0],
    privateKey: fs.readFileSync("./key.pem"),
  });
}

async function upload(file, name) {
  const client = new S3Client({
    credentials: aws.credentials,
    region: aws.region,
  });
  const command = new PutObjectCommand({
    Key: `${name}`,
    Bucket: aws.s3bucket,
    Body: file,
  });
  return client.send(command);
}

function getS3Url(fileName) {
  return `https://${aws.s3.bucket}.s3.${aws.region}.amazonaws.com/${fileName}`;
}

function deleteFile(fileName) {
  const client = new S3Client({
    credentials: aws.credentials,
    region: aws.region,
  });
  const command = new DeleteObjectCommand({
    Key: `${fileName}`,
    Bucket: aws.s3bucket,
    Body: file,
  });
  return client.send(command);
}

module.exports = {
  aws,
  convertVideo,
  getCloudfrontUrl,
  getS3Url,
  upload,
  deleteFile,
};
