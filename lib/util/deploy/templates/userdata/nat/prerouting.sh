# Ubuntu cannot bind port 80, so we do this here in userdata as root so it redirects 80 to 8080 (where node is running)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080