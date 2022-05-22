import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy } from 'passport-local';
//프로바이더
@Injectable()
export  class LocalStrategy extends  PassportStrategy(Strategy){

  constructor(private authService : AuthService) {
    super({ usernameField : 'email' , passwordField : 'password'});
  }

  async validate(email : string , password : string , done : CallableFunction){
    const user = await  this.authService.validateUser(email,password);
    //유저가 존재하지 않으면 401
    if(!user){
      throw new UnauthorizedException();
    }

    return done(null,user) // 첫번째 인수로 에러  , 두번째로 해당 회원정보
  }


}
