# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

## Запуск в Docker Compose

### 1) Подготовка переменных окружения

В корне проекта создайте `.env` из примера:

`cp .env.example .env`

Для Windows PowerShell:

`Copy-Item .env.example .env`

При необходимости отредактируйте значения в `.env`.

### 2) Сборка и запуск

Из корня проекта:

`docker compose up -d --build`

### 3) Проверка доступности

* Приложение: [http://localhost](http://localhost)
* pgAdmin: [http://localhost:8080](http://localhost:8080)

### 4) Данные для входа в pgAdmin

Берутся из `.env`:

* `PGADMIN_DEFAULT_EMAIL` (по умолчанию `admin@admin.com`)
* `PGADMIN_DEFAULT_PASSWORD` (по умолчанию `admin`)

### 5) Подключение PostgreSQL в pgAdmin

Внутри pgAdmin при создании подключения к серверу используйте:

* Host: `database`
* Port: `5432`
* Database: `prac`
* Username: `postgres`
* Password: `postgres`

### 6) Остановка

`docker compose down`

## Публикация Docker-образов в GHCR

В репозитории настроен workflow `.github/workflows/docker-images.yml`, который собирает и публикует образы в GitHub Container Registry (`ghcr.io`).

### Когда запускается

* `push` в `main`
* `push` тега `v*`
* `workflow_dispatch` (ручной запуск)
* `pull_request` (только сборка без публикации)

### Какие образы публикуются

* `ghcr.io/<owner>/<repo>/backend`
* `ghcr.io/<owner>/<repo>/frontend-builder`
* `ghcr.io/<owner>/<repo>/frontend`

### Теги образов

* `latest` для default-ветки
* тег ветки/тега Git
* sha-тег коммита

### Как скачать образ

`docker pull ghcr.io/<owner>/<repo>/backend:latest`

## Автодеплой через GitHub Actions

В репозитории настроен второй workflow `.github/workflows/deploy.yml`.

Как это работает:

* `docker-images.yml` собирает и публикует образы в GHCR.
* `deploy.yml` запускается после успешного завершения сборки и по SSH обновляет контейнеры на сервере.

`deploy.yml` автоматически деплоит ветки:

* `main`
* `review-*`

Также поддерживается ручной запуск (`workflow_dispatch`) с выбором `image_tag`.

Перед использованием добавьте Secrets в GitHub Repository Settings -> Secrets and variables -> Actions:

* `DEPLOY_HOST` — IP/домен сервера (например `213.165.219.199`)
* `DEPLOY_USER` — SSH-пользователь на сервере
* `DEPLOY_SSH_KEY` — приватный SSH-ключ (в формате PEM/OpenSSH)
* `DEPLOY_PATH` — путь до директории деплоя на сервере (например `~/film-deploy`)

## Деплой на удалённый сервер

Ниже — минимальный сценарий деплоя на сервер `213.165.219.199` без build context (только запуск образов из GHCR).

### 1) Подготовка DNS

Убедитесь, что записи доменов указывают на сервер:

* `egorfilm.nomorepartiessite.ru` -> `213.165.219.199`
* `api.egorfilm.nomorepartiessite.ru` -> `213.165.219.199`

### 2) Подключение к серверу и установка Docker

Подключитесь по SSH:

`ssh <user>@213.165.219.199`

Установите Docker Engine и Docker Compose Plugin (если ещё не установлены).

### 3) Подготовка директории проекта на сервере

`mkdir -p ~/film-deploy && cd ~/film-deploy`

Скопируйте в эту директорию файлы:

* `deploy/docker-compose.yml`
* `deploy/.env.example` (переименуйте в `.env` и заполните)

### 4) Настройка `.env`

Обязательно укажите:

* `GHCR_REPO=ghcr.io/<owner>/<repo>`
* `IMAGE_TAG=latest` (или конкретный git tag/sha)

Если GHCR-пакеты приватные — выполните логин:

`docker login ghcr.io -u <github-username>`

### 5) Запуск

Создайте директории для сертификатов:

`mkdir -p certbot/www certbot/conf`

Для первичной выдачи сертификата используйте certbot в standalone-режиме:

`docker compose run --rm --service-ports certbot certonly --standalone --preferred-challenges http -d egorfilm.nomorepartiessite.ru -d api.egorfilm.nomorepartiessite.ru --agree-tos -m <your-email> --no-eff-email`

После успешной выдачи сертификата запустите проект:

`docker compose up -d`

### 6) Проверка

`docker compose ps`

Проверьте в браузере:

* `https://egorfilm.nomorepartiessite.ru`
* `https://api.egorfilm.nomorepartiessite.ru/api/afisha/films`
* `http://egorfilm.nomorepartiessite.ru:8080` (pgAdmin)

Проверка редиректа:

* `http://egorfilm.nomorepartiessite.ru` -> `https://egorfilm.nomorepartiessite.ru`
* `http://api.egorfilm.nomorepartiessite.ru` -> `https://api.egorfilm.nomorepartiessite.ru`

### 7) Продление сертификата

Ручное продление:

`docker compose run --rm --service-ports certbot renew --standalone`

Автоматическое продление (cron, ежедневно в 03:00):

`0 3 * * * cd /home/<user>/film-deploy && docker compose run --rm --service-ports certbot renew --standalone && docker compose exec frontend nginx -s reload`




