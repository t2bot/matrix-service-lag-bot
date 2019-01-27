# matrix-service-lag-bot
Measures lag to various t2bot.io services. This is somewhat general purpose, but designed for usage by t2bot.io.

# Running

**Note**: this is not intended to be run on anything other than a Docker environment.

```bash
mkdir -p /mnt/vol/service-lag-bot/config
vi /mnt/vol/service-lag-bot/config/production.yaml  # Copy all of the default.yaml values
docker run -d -v /mnt/vol/service-lag-bot:/data -p 9000:9000 t2bot/matrix-service-lag-bot
```
