# Cifroo 
## Plataforma de comunicación segura.
Cifroo es una plataforma pensada para crear redes sociales en las que sus miembros quieren tener el control de sus datos y privacidad en sus comunicaciones.

## Instalación
Para la instalacion es necesaria tener una cuenta en [https://cloudconvert.com/](https://cloudconvert.com/). La app utiliza su API para convertir los documentos a PDF y poder visualizarlos. Por supuesto borra todos los archivos despues de subirlos. 

### Configurar el servidor de mysql
 ```
* SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```
```
 * SET GLOBAL max_allowed_packet=524288000;
```
### Instalar la app
Instalar las dependencias.

```
composer install
```

Crea la base de datos y carga los datos de ejemplo

```
bin/console doctrine:schema:update --force
bin/console doctrine:fixtures:load --no-interaction
```

Instala los assets.

```
bin/console assets:install --symlink
bin/console assetic:dump --env=prod
bin/console assetic:dump
```

Inicializa la base de datos y crea el usuario administrador.

```
bin/console app:init
```
Inicia el servicio de websocket
```
php bin/console gos:websocket:server
```
