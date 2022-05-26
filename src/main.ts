import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import cookieParser from 'cookie-parser';
import session from "express-session";
import { HttpExceptionFilter } from "./http-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import passport from 'passport';
import dotenv from "dotenv";
import { ValidationTypes } from "class-validator";
declare const module: any;

// nest 시작작
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//validation 추가
  app.useGlobalPipes(new ValidationPipe(
  //
  // //자동으로 controller 단에서 string을 number로 바꿔준다. < id :number 면 string을 number로 바꿔줌>
  //   transform : true,
))
 //httpException필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());
  //스웨거 설정시 뱐수이름 config로!! 아니면 페이지가 안나온다
  const config = new DocumentBuilder()
      .setTitle('HMS NEST_JS API')
      .setDescription('Nest_Js Api 설계 문서')
      .setVersion('1.0')
      .addCookieAuth('connect.sid')
      .build();

  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);
  dotenv.config();


  //쿠기설정
  app.use(cookieParser());
  app.use(
    session({
       secret : process.env.COOKIE_SECRET,
      resave : false,
      saveUninitialized : false ,
      cookie  : {
      httpOnly : true,
    }
  }));
  //세션 설정


  //패스포트 사용 로그인
  app.use(passport.initialize());
  //패스포트에서 session 사용
  app.use(passport.session());
  const port= process.env.PORT || 5001;
  await app.listen(port,()=>{
    console.log(`현재 실행되는 포트는 ${port} 입니다`)
  });
  // hot -reload 적용
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
