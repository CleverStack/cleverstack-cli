## ------ START: Release Locking mechanism ------ ##
rm -f $PIDFILE
echo "PID:$SCRIPT_PID - $(date) | Lock released ($PIDFILE)"
exit 0
## ------ END:  Release Locking mechanism ------ ##