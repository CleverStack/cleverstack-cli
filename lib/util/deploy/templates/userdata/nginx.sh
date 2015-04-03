sudo apt-get update
sudo apt-get -y install nginx

sudo cat << 'EOF' > /etc/nginx/nginx.conf

user www-data;
worker_processes 4;
pid /var/run/nginx.pid;
worker_rlimit_nofile 8192;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] $status '
            '"$request" $body_bytes_sent "$http_referer" '
            '"$http_user_agent" "$http_x_forwarded_for"';
    log_format  byte '$bytes_sent';
    access_log /var/log/nginx/access.log main;

    client_header_timeout 3m;
    client_body_timeout 3m;
    send_timeout 3m;

    server_tokens off;

    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    server_names_hash_bucket_size 128;

    gzip on;
    gzip_min_length 1100;
    gzip_buffers 4 8k;
    gzip_types text/plain text/css application/x-javascript text/xml application/xml text/javascript;

    output_buffers 1 32k;
    postpone_output 1460;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    directio 4m;

    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    server {
        listen 80;
        access_log /var/log/nginx/dev.log main;

        location /api/ {

            rewrite /api/(.*) /$1  break;

            proxy_pass         http://127.0.0.1:8080/;
            proxy_redirect     off;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   X-NginX-Proxy    true;
            proxy_connect_timeout      90;
            proxy_send_timeout         90;
            proxy_read_timeout         90;
            proxy_buffer_size          4k;
            proxy_buffers              4 32k;
            proxy_busy_buffers_size    64k;
            proxy_temp_file_write_size 64k;

            # websockets:
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            client_max_body_size       30m;
            client_body_buffer_size    128k;
        }

        location / {

            proxy_pass         http://metrorefunds-prod.s3-website-us-east-1.amazonaws.com/;
            proxy_redirect     off;
            proxy_set_header   Host             "metrorefunds-prod.s3-website-us-east-1.amazonaws.com";
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   X-NginX-Proxy    true;
            proxy_connect_timeout      90;
            proxy_send_timeout         90;
            proxy_read_timeout         90;
            proxy_buffer_size          4k;
            proxy_buffers              4 32k;
            proxy_busy_buffers_size    64k;
            proxy_temp_file_write_size 64k;

            client_max_body_size       30m;
            client_body_buffer_size    128k;

        }

    }
}

EOF

sudo /etc/init.d/nginx restart
