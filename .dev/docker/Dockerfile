FROM php:7.4-apache

RUN apt-get update \
    && apt-get install -y \
        less \
        subversion \
        sudo \
        default-mysql-client-core \
    && curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

# install php unit
RUN \
    curl -L https://phar.phpunit.de/phpunit-7.phar -o /tmp/phpunit \
    && chmod a+x /tmp/phpunit

ENTRYPOINT ["tail", "-f", "/dev/null"]