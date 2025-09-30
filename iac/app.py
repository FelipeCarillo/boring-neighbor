#!/usr/bin/env python3
import os

import aws_cdk as cdk

from iac.serverless_stack.main import IacStack
from iac.


app = cdk.App()
IacStack(app, "IacStack")

app.synth()
