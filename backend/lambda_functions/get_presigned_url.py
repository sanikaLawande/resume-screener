import json
import boto3
import uuid

s3 = boto3.client('s3')

BUCKET = "resume-screener-uploads-sanika-lawande-1"

def lambda_Handler(event, context):
    try:
        body = json.loads(event['body'])
        filename = body['filename']

        key = f"uploads/{uuid.uuid4()}_{filename}"

        url = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': BUCKET,
                'Key': key,
                'ContentType': 'application/pdf'
            },
            ExpiresIn=300
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "https://main.d24kkwmtqcku3u.amplifyapp.com",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": json.dumps({
                "uploadUrl": url
            })
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }