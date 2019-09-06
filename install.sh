echo "U:$SENGRID_USERNAME" "P:$SENDGRID_KEY"

apt-get update
apt-get install -y mysql-server
apt-get install -y curl vim

apt-get install -y sendmail-bin sendmail m4

echo "AuthInfo:smtp.sendgrid.net \"U:$SENGRID_USERNAME\" \"P:$SENDGRID_KEY\" \"M:PLAIN\"" >> /etc/mail/access

cp /git/sendmail.mc /etc/mail/sendmail.mc
cd /etc/mail
m4 sendmail.mc > sendmail.cf
makemap hash access < access
service sendmail restart

apt-get install -y apt-transport-https lsb-release
wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg # Download the signing key
sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list' # Add Ondrej's repo to sources list.
apt-get update

apt-get install -y php7.3 php7.3-common php7.3-cli
apt-get install -y php7.3-bcmath php7.3-bz2 php7.3-curl php7.3-gd php7.3-intl php7.3-json php7.3-mbstring php7.3-readline php7.3-xml php7.3-zip php7.3-mysql

curl https://getcaddy.com | bash -s personal http.cors

sudo cat <<EOF > /etc/init.d/camagru.sh
#!/usr/bin/env bash
cd /git && ./build.php && ./config/setup.php && caddy &
EOF

chmod +x /etc/init.d/camagru.sh

sudo update-rc.d camagru.sh defaults

mysql < /git/init.sql
