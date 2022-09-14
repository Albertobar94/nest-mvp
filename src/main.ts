import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exceptions/all-exceptions.filter";
import { executionTimeInterceptor } from "./interceptors/execution-time.interceptor";
import { DatabaseErrorInterceptor } from "./interceptors/database-error.interceptor";
import { TransformResponseInterceptor } from "./interceptors/transform-response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ExceptionFilters, Interceptors
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalInterceptors(
    new executionTimeInterceptor(),
    new TransformResponseInterceptor(),
    new DatabaseErrorInterceptor(),
  );

  // Security headers and cors
  app.getHttpAdapter().getInstance().set("etag", false);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Vending Machine")
    .setDescription("The Vending Machine API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
