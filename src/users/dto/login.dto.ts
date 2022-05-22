import {  PickType } from "@nestjs/swagger";
import { Users } from "../../entities/Users";

// 픽타입 이용 설정 다 받기
export  class LoginDto extends  PickType(Users , [
  'email' , 'password'
] as const ){}

