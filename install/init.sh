
bin/console doctrine:database:create
bin/console doctrine:schema:update --force
bin/console doctrine:fixtures:load --no-interaction
bin/console assets:install --symlink
bin/console assetic:dump --env=prod
bin/console assetic:dump
bin/console app:init
