## ------ START:  Release script self updater ------ ##
RELEASE_VERSION_DIFF=0
RELEASE_MD5_CURRENT='/tmp/releaseCurrentMd5.txt'
RELEASE_MD5_NEW='/tmp/releaseNewMd5.txt'
touch $RELEASE_MD5_CURRENT

NEW_RELEASE_NOT_EMPTY=`s3cmd -f --config /home/ubuntu/.s3cfg ls s3://$S3_DEPLOYMENT_BUCKET/$NODE_ENV/$REPO_NAME.sh | wc -l`
if [ $NEW_RELEASE_NOT_EMPTY -ne 0 ]; then

  # Get the latest hash
  s3cmd -f --config /home/ubuntu/.s3cfg ls s3://$S3_DEPLOYMENT_BUCKET/$NODE_ENV/$REPO_NAME.sh | md5sum | awk '{ print $1 }' > $RELEASE_MD5_NEW
  
  RELEASE_VERSION_DIFF=`diff $RELEASE_MD5_NEW $RELEASE_MD5_CURRENT | wc -l`
  if [ $RELEASE_VERSION_DIFF -ne 0 ]
  then
    echo "PID:$SCRIPT_PID - $(date) | Release SCRIPT MD5 has changed, fetching a new copy of this release script..."
    s3cmd -f --config /home/ubuntu/.s3cfg get s3://$S3_DEPLOYMENT_BUCKET/$NODE_ENV/$REPO_NAME.sh /opt/$REPO_NAME.sh

    echo "PID:$SCRIPT_PID - $(date) | Release SCRIPT was updated, updating RELEASE_MD5_CURRENT"
    cat $RELEASE_MD5_NEW > $RELEASE_MD5_CURRENT
  fi
fi
## ------ END:    Release script self updater ------ ##
