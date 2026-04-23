import json
import boto3
import uuid
import io
import re
from datetime import datetime

s3 = boto3.client('s3', region_name='ap-south-1')
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('resumes')

KEYWORDS = {
    'python': 10, 'java': 8, 'javascript': 8,
    'react': 7,   'node': 7,  'aws': 10,
    'sql': 6,     'git': 5,   'docker': 7,
    'django': 7,  'flask': 7, 'html': 4,
    'css': 4,     'linux': 6, 'mongodb': 6,
    'rest': 6,    'api': 6,   'agile': 5,
    'machine learning': 9, 'database': 5
}

def extract_text(bucket, key):
    try:
        import PyPDF2
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read()
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        return text.lower()
    except Exception as e:
        print('PDF error:', e)
        return ''

def score_resume(text):
    score = 0
    matched = []
    for kw, pts in KEYWORDS.items():
        if kw in text:
            score += pts
            matched.append(kw)
    return score, matched

def get_email(text):
    emails = re.findall(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
        text
    )
    return emails[0] if emails else 'Not found'

def get_rank(score):
    if score >= 80: return 'Excellent'
    if score >= 60: return 'Good'
    if score >= 40: return 'Average'
    return 'Below Average'

def lambda_Handler(event, context):
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        key    = event['Records'][0]['s3']['object']['key']
        print(f'Processing: {key} from {bucket}')

        text  = extract_text(bucket, key)
        score, matched = score_resume(text)
        email = get_email(text)
        rank  = get_rank(score)
        name  = key.replace('.pdf','').replace('_',' ').replace('-',' ').title()

        item = {
            'resumeId':          str(uuid.uuid4()),
            'candidateName':     name,
            'email':             email,
            'score':             score,
            'rank':              rank,
            'matchedKeywords':   matched,
            'fileName':          key,
            'uploadedAt':        datetime.now().isoformat(),
            'totalKeywords':     len(matched)
        }

        table.put_item(Item=item)
        print(f'Saved: score={score}, rank={rank}')

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Done', 'score': score})
        }
    except Exception as e:
        print('Error:', e)
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}