apt-get update
apt-get install -y mysql-server
apt-get install -y curl vim
apt-get install -y php php-mysql php-xml
curl https://getcaddy.com | bash -s personal

sudo cat <<EOF > /etc/init.d/camagru.sh
#!/usr/bin/env bash
cd /git && ./build.php && caddy &
EOF

chmod +x /etc/init.d/camagru.sh

sudo update-rc.d camagru.sh defaults
