## ------ START:  UserData: Download application.sh (even if its not newer) ------ ##
s3cmd -f --config /home/ubuntu/.s3cfg ls $S3_APP_SCRIPT_PATH | md5sum | awk '{ print $1 }' > /tmp/deployCurrentMd5.txt
s3cmd -f --config /home/ubuntu/.s3cfg get $S3_APP_SCRIPT_PATH /opt/$SCRIPT_NAME
chown ubuntu:ubuntu /tmp/deployCurrentMd5.txt
chmod o+x /opt/$SCRIPT_NAME
chown ubuntu:ubuntu /opt/$SCRIPT_NAME
## ------ END:    UserData: Download application.sh (even if its not newer) ------ ##