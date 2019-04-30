apt update
apt install -y mysql-server
apt install -y curl vim

apt install apt-transport-https lsb-release
wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg # Download the signing key
sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list' # Add Ondrej's repo to sources list.
apt update

apt install php7.3 php7.3-common php7.3-cli
apt install php7.3-bcmath php7.3-bz2 php7.3-curl php7.3-gd php7.3-intl php7.3-json php7.3-mbstring php7.3-readline php7.3-xml php7.3-zip

curl https://getcaddy.com | bash -s personal http.cors

sudo cat <<EOF > /etc/init.d/camagru.sh
#!/usr/bin/env bash
cd /git && ./build.php && ./config/database.php && caddy &
EOF

chmod +x /etc/init.d/camagru.sh

sudo update-rc.d camagru.sh defaults

mysql < /git/init.sql
