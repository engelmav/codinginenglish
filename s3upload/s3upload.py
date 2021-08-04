import boto3
from botocore.exceptions import NoCredentialsError
import os
import argparse

arg_parser = argparse.ArgumentParser(description='Upload files to DigitalOcean/S3')
arg_parser.add_argument('Path',
        metavar='<path>',
        type=str,
        help='path to the file you wish to upload')
arg_parser.add_argument('DestFilename',
        metavar='<destination filename>',
        type=str,
        help='the filename given to the uploaded file in s3.')

args = arg_parser.parse_args()

file_path = args.Path
dest_filename = args.DestFilename

ACCESS_KEY = os.getenv('SPACES_ACCESS_KEY')
SECRET_KEY = os.getenv('SPACES_SECRET_KEY')


def upload_to_aws(local_file, bucket, s3_file):
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY, endpoint_url='https://nyc3.digitaloceanspaces.com')

    try:
        print('uploading...')
        s3.upload_file(local_file, bucket, s3_file)
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False


uploaded = upload_to_aws(file_path, 'cie-assets', dest_filename)

