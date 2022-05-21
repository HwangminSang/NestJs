import {  PickType } from "@nestjs/swagger";
import { Users } from "../../entities/Users";

// PickType을 이용하여 Users엔티티의 명시한 칼럼들을 가져온다
export class JoinRequestDto extends PickType(Users, [
    'email','nickname', 'password'
] as const){}
