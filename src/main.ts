import { DatabaseErrorInterceptor } from "./interceptors/database-error.interceptor";
import { TransformResponseInterceptor } from "./interceptors/transform-response.interceptor";
import helmet from "helmet";
// import * as csurf from "csurf";
import { AppModule } from "./app.module";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./exceptions/all-exceptions.filter";
import { executionTimeInterceptor } from "./interceptors/execution-time.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Errors
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalInterceptors(
    new executionTimeInterceptor(),
    new TransformResponseInterceptor(),
    new DatabaseErrorInterceptor(),
  );

  // Setting Security headers and cors
  app.getHttpAdapter().getInstance().set("etag", false);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // app.use(csurf());

  // Setting Swagger
  const config = new DocumentBuilder()
    .setTitle("Vending Machine")
    .setDescription("The Vending Machine API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
