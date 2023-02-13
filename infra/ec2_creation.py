#!/usr/bin/env python3
import os
from dotenv import load_dotenv

# load our env file
print ('Loading env file')
load_dotenv()

import aws_cdk as cdk

from ec2_deploy.ec2_deploy_stack import Ec2DeployStack

print ('Creating environment')
cdk_env = cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION'))

app = cdk.App()

app = cdk.App()
Ec2DeployStack(
    app,
    'Ec2DeployStack',
    env=cdk_env
)

# synthesize it
print ('Synthesizing stack')
app.synth()