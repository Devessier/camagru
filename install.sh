apt-get update
apt-get install -y mysql-server
apt-get install -y curl vim
curl https://getcaddy.com | bash -s personal

sudo echo "cd /git && ./build.sh && nohup caddy &" > /etc/init.d/test
chmod +x /etc/init.d/test
