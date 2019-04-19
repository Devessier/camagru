apt-get update
apt-get install -y mysql-server
mysql < /git/configs/default-user.sql
apt-get install -y curl vim htop unzip
curl https://getcaddy.com | bash -s personal
