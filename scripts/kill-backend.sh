if docker ps | grep "nest-dev-server"; then
    docker kill ${SERVICE_NAME}
else
    echo nest-dev-server not running
fi
