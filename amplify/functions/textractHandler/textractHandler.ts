import { TextractClient, StartDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import type { S3Handler } from 'aws-lambda';

const client = new TextractClient({ region: process.env.AWS_REGION });

export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    
    const command = new StartDocumentTextDetectionCommand({
      DocumentLocation: { S3Object: { Bucket: bucket, Name: key } },
      NotificationChannel: {
        RoleArn: process.env.TEXTRACT_ROLE_ARN!,
        SNSTopicArn: process.env.TEXTRACT_SNS_TOPIC_ARN!,
      }
    });

    await client.send(command);
    console.log(`Textract started on ${key}`);
  }
};
