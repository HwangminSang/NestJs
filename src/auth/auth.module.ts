import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { LocalSerializer } from "./local.serializer";
import { Users } from "../entities/Users";

@Module({
  // 남의 모듈이면 import
  imports : [
    PassportModule.register({ session : true}) , // 토큰 기반이라서 session  : false
   //repository사용
    TypeOrmModule.forFeature([Users]),
  ],
  // @Injectable 있으면 프로바이더
  providers : [AuthService , LocalStrategy , LocalSerializer ],
})
export class AuthModule{

}
