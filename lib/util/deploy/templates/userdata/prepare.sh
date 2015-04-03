## ------ START:  BASE:       Prepare Environment & Deployment Directories ------ ##
cat <<'EOF' >> /home/ubuntu/.bashrc
export NODE_ENV='$NODE_ENV'
export SCRIPT_NAME='$SCRIPT_NAME'
export S3_APP_SCRIPT_PATH='$S3_APP_SCRIPT_PATH'
EOF

if [ ! -d "$DEPLOY_DIR" ]; then
  mkdir $DEPLOY_DIR
  chmod 755 $DEPLOY_DIR
  chown ubuntu:ubuntu $DEPLOY_DIR
fi
## ------ START:  BASE:       Prepare Environment & Deployment Directories ------ ##