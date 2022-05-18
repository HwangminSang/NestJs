import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import cookieParser from 'cookie-parser';
import session from 'express-session';
declare const module: any;

// nest 시작작
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  //스웨거 설정시 뱐수이름 config로!! 아니면 페이지가 안나온다
  const config = new DocumentBuilder()
      .setTitle('HMS NEST_JS API')
      .setDescription('Nest_Js Api 설계 문서')
      .setVersion('1.0')
      .addCookieAuth('connect.sid')
      .build();

  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

    const port= process.env.PORT || 5001;
    await app.listen(port,()=>{
        console.log(`현재 실행되는 포트는 ${port} 입니다`)
    });

  //쿠기설정
  app.use(cookieParser());
  //세션 설정
  app.use(
      session({
        resave : true,
        saveUninitialized : false ,
        secret : process.env.COOKIE_SECRET,
        cookie : {
          httpOnly : true,
        }
      })
  )
  // hot -reload 적용
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
