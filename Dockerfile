FROM php:7.4-apache

# check for update and install subversion and mysql
RUN apt-get update \
    && apt-get install -y \
        subversion \
        default-mysql-client-core

# add and activate mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# install wp-cli
RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

# install phpunit
RUN curl -L https://phar.phpunit.de/phpunit-7.phar -o /usr/local/bin/phpunit \
    && chmod +x /usr/local/bin/phpunit

RUN cd /var/www/html \
    && wp core download --allow-root

CMD "apache2-foreground"