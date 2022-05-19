import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {LoggerMiddleware} from "./middlewares/logger.middleware";
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';


// .env 파일을 현제 프로젝트가 아니고 다른 aws 비밀공간에 넣어두었을떄 비동기요청으로 처리할수도 있기떄문에 이렇게 한다.
// const getEnv= async ()=>{
//      const response=await axios.get('/비밀키요청');
//      return response.data;
// }

//컨테이너
// node의 라우터가 모듈이라고 생각하자.
// 의존성 주입을 내가 마음대로 해줄수있다.
@Module({
  imports: [ConfigModule.forRoot({ isGlobal :true }), UsersModule, WorkspacesModule, ChannelsModule, DmsModule], //여기에 넣어준다. router   ConfigModule모듈 추가  , , load : [getEnv] 해서 외부서비스에서 env정보를 가져올수도 있다
  controllers: [],
  providers: [ConfigService
            //클래스 말고 이렇게 내가 정해서 넣어줄수도 있다
            ,{
              provide :'CUSTOM_KEY',
              useValue : 'CUSTOM_VALUE'
            }
            ],  //ConfigService는 제공
  // providers: [AppService],
  // // providers : [
  // //     {  provide : 고유한 키 ( @Injectable하면 해당 클래스의 고유한 키가 만들어짐 ) AppService
  // //        useClass:   AppService         } ]

})

//만든 로그미들웨어 적용해주기
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    //forRoutes()  주소 or 컨트롤러 적어줄수있다.
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }



}
