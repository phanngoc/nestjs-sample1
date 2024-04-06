import path from "path";
import {DataSource} from "typeorm";

const dataSource = new DataSource({
  name: "default",
  type: "postgres",
  database: "nestjs",
  host: "postgresql",
  port: 5432,
  username: "nestjs",
  password: "password",
  logging: true,
  synchronize: true,
  migrationsRun: true,
  dropSchema: false,
  entities: ["./src/entities/**/*.entity{.ts,.js}"],
  migrations: ["./src/db/migrations/*{.ts,.js}"],
});

export default dataSource;