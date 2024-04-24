#!/bin/bash

# Update the system
sudo yum update -y

# Install Apache web server and PHP 7
sudo amazon-linux-extras enable php7.4
sudo yum install -y httpd php php-mysqlnd

# Start the Apache service
sudo systemctl start httpd
sudo systemctl enable httpd

# Create index directory
sudo mkdir -p /var/www/html/index

# Create a sample index.html file
#echo "<h1>Test Page</h1><p>This is a test page.</p>" | sudo tee /var/www/html/index/index.html

# Download and install WordPress
cd /var/www/html
sudo wget -c https://wordpress.org/latest.tar.gz -O - | sudo tar -xz

# Move WordPress files to the root directory
#sudo mv /var/www/html/index/index.html .
sudo mv wordpress/* .
sudo rmdir wordpress

# Set permissions
sudo chown -R apache:apache /var/www/html
sudo chmod -R 755 /var/www/html

# Configure WordPress
sudo cp wp-config-sample.php wp-config.php

# Replace the database configuration values
sudo sed -i "s/database_name_here/${db_name}/" wp-config.php
sudo sed -i "s/username_here/${db_username}/" wp-config.php
sudo sed -i "s/password_here/${db_password}/" wp-config.php
sudo sed -i "s/localhost/${db_host}/" wp-config.php

# Set WordPress Address (URL) and Site Address (URL)
echo "define('WP_HOME','http://${alb_dns_name}');" | sudo tee -a wp-config.php
echo "define('WP_SITEURL','http://${alb_dns_name}');" | sudo tee -a wp-config.php


# Modify site description
echo "update_option('blogdescription', 'Welcome to Ameera Web App!');" | sudo tee -a wp-config.php

# Modify the number of blog posts shown on the homepage
echo "update_option('posts_per_page', 10);" | sudo tee -a wp-config.php

# Install WP-CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Allow www-data user to run wp-cli commands
sudo chown -R apache:apache /var/www

# Install and activate Twenty Twenty-One theme
sudo -u apache -- wp theme install twentytwentyone --activate --path=/var/www/html

# Install and activate plugins
sudo -u apache -- wp plugin install classic-editor --activate --path=/var/www/html
sudo -u apache -- wp plugin install akismet --activate --path=/var/www/html

# Restart Apache to apply changes
sudo systemctl restart httpd
