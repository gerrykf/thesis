

```shell
docker run -d \
  --name health-backend \
  --network health-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=health-mysql \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASS=000000 \
  -e DB_NAME=health_management \
  health-backend:1.0.0
```
