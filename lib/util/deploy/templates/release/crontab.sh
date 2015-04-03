echo "PID:$SCRIPT_PID - $(date) | Updating crontab for user ubuntu..."

echo "* * * * * bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log
* * * * * sleep 10; bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log
* * * * * sleep 20; bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log
* * * * * sleep 30; bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log
* * * * * sleep 40; bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log
* * * * * sleep 50; bash /opt/$REPO_NAME.sh 2>&1 >> /tmp/deploy.log" > ~/ubuntu.crontab
crontab ~/ubuntu.crontab