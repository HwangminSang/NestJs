import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {LoggerMiddleware} from "./middlewares/logger.middleware";
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelChats } from "./entities/ChannelChats";
import { ChannelMembers } from "./entities/ChannelMembers";
import { Channels } from "./entities/Channels";
import { DMs } from "./entities/DMs";
import { Mentions } from "./entities/Mentions";
import { Users } from "./entities/Users";
import { WorkspaceMembers } from "./entities/WorkspaceMembers";
import { Workspaces } from "./entities/Workspaces";
import { AuthModule } from "./auth/auth.module";

//.env 파일을 현제 프로젝트가 아니고 다른 aws 비밀공간에 넣어두었을떄 비동기요청으로 처리할수도 있기떄문에 이렇게 한다.
const getData= async ()=>{
     // const response=await axios.get('/비밀키요청');
     // return response.data;
}

//컨테이너
// node의 라우터가 모듈이라고 생각하자.
// 의존성 주입을 내가 마음대로 해줄수있다.
@Module({
  imports: [ConfigModule.forRoot({ isGlobal :true  , load :[getData] } )
    // 설정 forRoot 객체라고 생각하자
    // Orm 설정  , .env 이용없이 함
    , TypeOrmModule.forRootAsync({
      inject : [ConfigService],  // process를 읽기위해서 forRootAsync 사용 및 configService 사용
      useFactory : async  (configService : ConfigService)=> {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            ChannelChats,
            ChannelMembers,
            Channels,
            DMs,
            Mentions,
            Users,
            WorkspaceMembers,
            Workspaces,
          ],
          migrations: [__dirname + '/src/migrations/*.ts'],
          cli: { migrationsDir: 'src/migrations' },
          autoLoadEntities: true,
          charset: 'utf8mb4',
          synchronize: false,  //처음만 true   그 이후에는 false  아니면 계속  테이블을 drop 하고 create함
          logging: true,  //로깅 보여주기
          keepConnectionAlive: true,  // hot-loding 시 계속 사용가능
        }
      }
    } )
    // A - > B  -> app.module  즉 B만 들어와도된다
    , AuthModule
    , UsersModule
    , WorkspacesModule
    , ChannelsModule
    , DmsModule
  ], //여기에 넣어준다. router   ConfigModule모듈 추가  , , load : [getEnv] 해서 외부서비스에서 env정보를 가져올수도 있다
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
