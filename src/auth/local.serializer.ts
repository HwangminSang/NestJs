import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class LocalSerializer extends PassportSerializer{

  constructor(private readonly authService : AuthService,
              @InjectRepository(Users) private usersRepository : Repository<Users>) {
    super();
  }
  // 유저의 아이디만 뽑아서 session에 저장
  serializeUser(user: Users, done: CallableFunction) {
    console.log(user)
    // id가 없을경우 문제
      done(null,user.id);
  }

  // session의 id를 이용하여 req.user에 user정보를 넣어주는 역할
  async deserializeUser(userId: string , done: CallableFunction){

    return await this.usersRepository
      // 비동기는 에러 대비를 하자
      .findOneOrFail(
        {
          id : +userId,
        },
        {
          select : [ 'id' , 'email' , 'nickname'],
          relations : ['Workspaces'],  //  join
        },
      ).then( user =>{
        console.log(user);
        done(null , user);
      })
      .catch( error => done(error));
  }
}
