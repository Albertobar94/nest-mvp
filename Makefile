export DOCKER_DB_NAME := nest-dev-server

export DB_NAME := nest-dev-db
export DB_HOST := localhost
export DB_USER := postgres
export DB_PWD := postgres
export DB_PORT := 5432

export SERVICE_NAME := nest-dev-server
export SERVICE_PORT := 3000

db-start: 
	docker run --rm \
		--name $(DOCKER_DB_NAME) \
		-e 'POSTGRES_PASSWORD=$(DB_PWD)' \
		-e 'POSTGRES_USER=$(DB_USER)' \
		-e 'POSTGRES_DB=$(DB_NAME)' \
		-p $(DB_PORT):$(DB_PORT) \
		-d postgres:12-alpine

db-client:
	docker exec -it $(DOCKER_DB_NAME) \
		psql -h $(DB_HOST) -U $(DB_USER) -d $(DB_NAME)

db-stop:
	docker stop $(DOCKER_DB_NAME)

prepare:
	chmod +x scripts/kill-backend.sh

build: 
	docker build -t $(SERVICE_NAME) .

start:
	scripts/kill-backend.sh
	docker run --rm --name $(SERVICE_NAME) -d -p $(SERVICE_PORT):$(SERVICE_PORT) $(SERVICE_NAME)

start-debug:
	scripts/kill-backend.sh
	docker run --rm --name $(SERVICE_NAME) -it -p $(SERVICE_PORT):$(SERVICE_PORT) $(SERVICE_NAME)

stop: 
	scripts/kill-backend.sh

