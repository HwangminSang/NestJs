import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
      // 레포지토리가 테이블과 엔티티를 이어준다
      @InjectRepository(Users)
    private usersRepository : Repository<Users>,
    ) {}
    findAllUser() :string{
        return "";
    }

   async creatUser(email: string, nickname: string, password: string) {
      // findOne 이용하여 해당 이메일의 사용자 여부를 확인
       const  user = await this.usersRepository.findOne({ where : {email }});
     //이미 존재하는 회원이라고 에러를 던져주자자
       if(user){
         // status : 401
       throw new UnauthorizedException('이미 존재하는 회원입니다');
       }
       const hashedPassword = await  bcrypt.hash(password , 12);
        await  this.usersRepository.save({
          email,
          nickname,
          password : hashedPassword ,
        })
    }
}
