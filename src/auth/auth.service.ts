import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{

  // 생성자로 di 받고
  constructor(
    @InjectRepository(Users) private userRepository : Repository<Users>,
              ){

  }
  // 해당 회원 존재 유무 및 비밀번호 검사
  async validateUser(email: string, password: string) {
    //`  You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '@naver.com )  문법 오류
    // 기존 { where : email }
    const user= await this.userRepository.findOne({
      where : { email } ,
      select : ['id', 'email' , 'password' , 'nickname'],
      },) ;
    console.log(email ,password , user)
    if(!user){
      return null;
    }
    //비동기로 비밀번호 비교
    //Error: data and hash arguments required
    // 비밀번호 비교가 제대로 안되고있을떄
    const result = await bcrypt.compare(password, user.password);

    if(result){
     //패스워드만 뺴서 가져온다
      const {password , ... userWithoutPassword } = user;  //== delete user.password
      console.log(userWithoutPassword)
      return userWithoutPassword;
    }
    return null;

  }
}
