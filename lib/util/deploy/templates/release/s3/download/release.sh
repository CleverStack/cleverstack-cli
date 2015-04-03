## ------ START:  Standard Node AMI Release Script ------ ##
S3_PATH="s3://$S3_DEPLOYMENT_BUCKET/$NODE_ENV/$REPO_NAME.tgz"
RUNNING_LIST=`forever list | grep -c '\n'`
FOREVER_PID_FILE="/opt/$REPO_NAME.pid"
FOREVER_LOG_FILE="/opt/$REPO_NAME.log"

# Only do a release if we did not just get a new release script
if [ $RELEASE_VERSION_DIFF -eq 0 ]; then

  # MD5 Tracking hases for updating the applications code from S3
  MD5OLD='/tmp/oldMd5.txt'
  MD5NEW='/tmp/newMd5.txt'
  touch $MD5OLD
  s3cmd -f --config /home/ubuntu/.s3cfg ls $S3_PATH | md5sum | awk '{ print $1 }' > $MD5NEW
  VERSION_DIFF=`diff $MD5NEW $MD5OLD | wc -l`

  if [ $VERSION_DIFF -ne 0 ]; then
    echo "PID:$SCRIPT_PID - $(date) | Release required (MD5 has changed), updating $REPO_NAME on $NODE_ENV..."

    DEPLOYMENT_DIR="/opt/$REPO_NAME"
    if [ ! -d $DEPLOYMENT_DIR ]; then
      echo "PID:$SCRIPT_PID - $(date) | SETUP: the DEPLOYMENT_DIR and set owner as ubuntu..."
        sudo mkdir $DEPLOYMENT_DIR
        sudo chown ubuntu:ubuntu $DEPLOYMENT_DIR
    fi

    echo "PID:$SCRIPT_PID - $(date) | Changing to $DEPLOYMENT_DIR (DEPLOYMENT_DIR)..."
    cd $DEPLOYMENT_DIR

    echo "PID:$SCRIPT_PID - $(date) | Release starting download of new code release (S3)..."
    s3cmd -f --config /home/ubuntu/.s3cfg get $S3_PATH /opt/$REPO_NAME.tgz
    mkdir /opt/$REPO_NAME
    sudo chown ubuntu:ubuntu /opt/$REPO_NAME
    sudo chmod 775 /opt/$REPO_NAME
    tar -xzvf /opt/$REPO_NAME.tgz

    echo "PID:$SCRIPT_PID - $(date) | Release Running NPM install & init+update git submodules..."
    sudo npm install
    sudo git submodule init
    sudo git submodule update

    if [ $RUNNING_LIST -eq 3 ]; then # Node is running fine
      echo "PID:$SCRIPT_PID - $(date) | Forever is RESTARTING the $NODE_ENV application..."
      forever restart 0
    elif [ $RUNNING_LIST -eq 1 ]; then # No node processes are running through forever
      echo "PID:$SCRIPT_PID - $(date) | Forever is STARTING the $NODE_ENV application because it was NOT running..."
      forever start --spinSleepTime 1000 --pidFile $FOREVER_PID_FILE -a -l $FOREVER_LOG_FILE app.js
    else
      echo "PID:$SCRIPT_PID - $(date) | Forever is running multiple processes, attempting to fix the problem..."
      forever stopall
      forever start --spinSleepTime 1000 --pidFile $FOREVER_PID_FILE -a -l $FOREVER_LOG_FILE app.js
    fi

    # Update the md5
    echo "PID:$SCRIPT_PID - $(date) | Release updating current MD5 to $MD5NEW"
    cat $MD5NEW > $MD5OLD

    echo "PID:$SCRIPT_PID - $(date) | Release finished!"
  else 

    if [ $RUNNING_LIST -eq 1 ]; then # No node processes are running through forever
      echo "PID:$SCRIPT_PID - $(date) | Forever is STARTING the $NODE_ENV application because it was NOT running..."
      forever start --spinSleepTime 1000 --pidFile $FOREVER_PID_FILE -a -l $FOREVER_LOG_FILE /opt/$REPO_NAME/app.js
    elif [ $RUNNING_LIST -ne 3 ]; then
      echo "PID:$SCRIPT_PID - $(date) | Forever is running multiple processes, attempting to fix the problem..."
      forever stopall
      forever start --spinSleepTime 1000 --pidFile $FOREVER_PID_FILE -a -l $FOREVER_LOG_FILE /opt/$REPO_NAME/app.js
    fi

    echo "PID:$SCRIPT_PID - $(date) | Release not required, exiting"
  fi
fi
## ------ END:  Standard Node AMI Release Script ------ ##
