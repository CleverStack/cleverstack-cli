## ------ START:  EC2:      Set the hostname of the server ------ ##
HOSTNAME="$PROJECT-$NODE_ENV"

echo $HOSTNAME > /etc/project
echo "$HOSTNAME" > /etc/hostname
echo "$IP $HOSTNAME" >> /etc/hosts

cat <<'EOF' > /etc/rc.local
if [ -f /etc/project ] ; then
  echo "`cat /etc/project`-`/sbin/ifconfig|grep inet|head -n 1|cut -d: -f2|cut -d\  -f1|sed 's/\./\-/g'`" > /etc/hostname
  hostname "`cat /etc/hostname`"
fi
exit 0
EOF

hostname "$HOSTNAME"
## ------ END:    EC2:      Set the hostname of the server ------ ##