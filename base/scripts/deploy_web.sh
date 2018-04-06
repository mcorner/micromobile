#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
. $DIR/../aws_config.sh
aws --profile $AWS_PROFILE s3 sync platforms/browser/www s3://$DEPLOY_WWW_BUCKET
