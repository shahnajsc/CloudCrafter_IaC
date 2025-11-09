DATA_DIR			= $(HOME)/data
DB_DIR				= $(DATA_DIR)/db

DOCKER_COMPOSE_FILE	= docker-compose.yml
ENV_FILE			= .env
D_COMPOSE			= docker compose --env-file $(ENV_FILE) --file $(DOCKER_COMPOSE_FILE)

# Colors
RED			= \033[0;31m
GREEN		= \033[0;32m
PINK		= \033[0;35m
RESET		= \033[0;36m

.PHONY : all up down stop start re logs clean fclean mkdirs precheck info setup migrate seed fullrun

all: up

mkdirs:
	@mkdir -p $(DB_DIR)
	@echo -e "$(PINK)Postgres DB data directory created.$(RESET)"

precheck:
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Docker is missing.$(RESET)"; exit 1; }
	@command -v docker compose >/dev/null 2>&1 || { echo "$(RED)Docker Compose is missing.$(RESET)"; exit 1; }
	@echo -e "$(GREEN)Docker and Docker Compose available.$(RESET)"

up: mkdirs precheck
	@$(D_COMPOSE) up --build -d
	@echo -e "$(GREEN)All services are up and running.$(RESET)"

down:
	@$(D_COMPOSE) down
	@echo -e "$(PINK)All services stopped and removed.$(RESET)"

stop:
	@$(D_COMPOSE) stop
	@echo -e "$(PINK)All services stopped.$(RESET)"

start:
	@$(D_COMPOSE) start
	@echo -e "$(GREEN)All services running.$(RESET)"

logs:
	@$(D_COMPOSE) logs --follow

# Clean-up targets

clean: down
	@sudo rm -rf $(DATA_DIR)
	@echo -e "$(PINK)Data directory cleaned.$(RESET)"

fclean: clean
	@$(D_COMPOSE) down -v --rmi all
	@echo -e "$(PINK)All containers, images, and volumes removed.$(RESET)"

info:
	@echo
	@echo "===============================| IMAGES |==============================="
	@docker images
	@echo
	@echo "=============================| CONTAINERS |============================="
	@docker ps -a
	@echo
	@echo "===============| NETWORKS |==============="
	@docker network ls
	@echo
	@echo "======| VOLUMES |======"
	@docker volume ls
	@echo
