import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: any;

// nest 시작작
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port= process.env.PORT || 5000;
  await app.listen(5000);
  console.log(`eqweq${port}`)

  // hot -reload 적용
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
