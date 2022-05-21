import { Injectable } from '@nestjs/common';
import {JoinRequestDto} from "./dto/join.request.dto";
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
       const  user = await this.usersRepository.findOne({ where : {email }});
    }
}
