import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('resumes')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def lambda_handler(event, context):
    try:
        response = table.scan()
        resumes  = response['Items']

        resumes.sort(
            key=lambda x: int(x.get('score', 0)),
            reverse=True
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin':  'https://main.d24kkwmtqcku3u.amplifyapp.com',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps(resumes, cls=DecimalEncoder)
        }
    except Exception as e:
        print('Error:', e)
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }