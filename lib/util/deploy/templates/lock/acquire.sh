## ------ START:  Locking mechanism ------ ##
SCRIPT_PID=$$
BASENAME=${0##*/}
PIDFILE_BASE=/tmp/$BASENAME
PIDFILE=$PIDFILE_BASE.$$

#Look for existing Lock files
PIDFILES=`ls $PIDFILE_BASE*`

if [ -n "$PIDFILES" ] ; then
    echo "PID:$SCRIPT_PID - $(date) | Lock files are present."
    for P in $PIDFILES ; do
        # Get the PID
        PID=`cat $P`
        if [ -f /proc/$PID/cmdline ] ; then
            CMD=`cat /proc/$PID/cmdline`
            if [ "${CMD//$BASENAME}" != "$CMD" ] ; then
                echo "PID:$SCRIPT_PID - $(date) | Lock acquisition failed, exited script."
                exit 1
            else
                echo "PID:$SCRIPT_PID - $(date) | Lock found was bogus, deleting it."
                rm -f $P
            fi
        else
            echo "PID:$SCRIPT_PID - $(date) | Lock found is dead, deleting it."
            rm -f $P
        fi
    done
fi

echo "PID:$SCRIPT_PID - $(date) | Lock acquired ($PIDFILE)"
echo $$ > $PIDFILE
## ------ END:    Locking mechanism ------ ##
