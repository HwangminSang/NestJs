import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";


//서비스단 비즈니로직
@Injectable()
export class AppService {
  //di 생성자를 통해
  constructor(private readonly configService:ConfigService) {
  }

  getUser():string {
    return "회원한명가져오기";
  }

  joinUser() :string {
    return "회원등록하기";
  }

  testEnv() :string {
    // return process.env.EXAMPLE;
    return  this.configService.get('EXAMPLE');
  }
}
