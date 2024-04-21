

```bash
$ yarn install
```

## Running the app

```bash
# development
yarn run start
```

## Run migration:
Create migration sql from entity class.

```
npx ts-node ./node_modules/typeorm/cli.js migration:generate src/db/migrations/create-table-threads --d ./ormconfig.ts
```

Run migration sql.

```
npx ts-node ./node_modules/typeorm/cli.js migration:run --d ./ormconfig.ts
```

## Frontend:

Create react app.

```
yarn create react-app my-app
```

Connect redis cluster by CLI.

```
docker-compose exec nestjs sh
redis-cli -c -h redis-node-5 -a bitnami
```
