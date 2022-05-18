import { Injectable } from '@nestjs/common';
import {JoinRequestDto} from "./dto/join.request.dto";

@Injectable()
export class UsersService {
    findAllUser() :string{
        return "";
    }

    creatUser(email: string, nickname: string, password: string) {
        return "";
    }
}
