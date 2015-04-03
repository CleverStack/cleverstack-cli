## ------ START:  BASE:       Config ------ ##
export PROJECT                  ='myProject'
export NODE_ENV                 ='DEV'
export S3_DEPLOYMENT_KEY        ='your_iam_key'
export S3_DEPLOYMENT_SECRET     ='your_iam_secret'
export S3_DEPLOYMENT_BUCKET     ='your_s3_bucket_name'
export S3_DEPLOYMENT_PASSPHRASE ='your_s3_passphrase'
## ------ END:    BASE:       Config ------ ##

## ------ START:  ADVANCED:   Config ------ ##
export IP                       =`/sbin/ifconfig|grep inet|head -n 1|cut -d: -f2|cut -d\  -f1`
export DEPLOY_DIR               ='/opt'
export SCRIPT_NAME              ='$PROJECT.sh'
export S3_APP_SCRIPT_PATH       ="s3://$S3_DEPLOYMENT_BUCKET/$NODE_ENV/$SCRIPT_NAME"
## ------ END:    ADVANCED:   Config ------ ##
