import { HttpException, Injectable } from "@nestjs/common";
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
      // 유효성 체크
     if(!email){
       //HttpException으로 던지면 클라이언트 쪽에서 400에러가 뜬다. 그냥 throw를 한다면 서버에는 오류가 뜨지만 사용자 쪽에서는 201 뜬다. 왜냐하면 async안에서 처리하기떄문에
       throw  new HttpException('이메일을 입력하세요' , 400);
     }
     if(!nickname){
       throw  new HttpException('이메일을 입력하세요' , 400);
     }
     if(!password){
       throw  new HttpException('패스워드를 입력하세요' , 400);
     }
      // findOne 이용하여 해당 이메일의 사용자 여부를 확인
       const  user = await this.usersRepository.findOne({ where : {email }});
     //이미 존재하는 회원이라고 에러를 던져주자자
       if(user){
         //throw 시 자동으로 return되어 아래는 실행안한다
       throw  new Error('이미 존재하는 회원입니다');
       }
       const hashedPassword = await  bcrypt.hash(password , 12);
        await  this.usersRepository.save({
          email,
          nickname,
          password : hashedPassword ,
        })
    }
}
