bin/console assets:install --symlink
bin/console cache:clear --no-warmup
bin/console assetic:dump --env=prod
bin/console assetic:dump
#bin/console assetic:watch
chmod 770 * -Rf
chown www-data.www-data * -Rf
