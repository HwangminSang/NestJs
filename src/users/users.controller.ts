import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JoinRequestDto} from "./dto/join.request.dto";

@Controller('api/users')
export class UsersController {
    //의존성 주입
    constructor(private  readonly  userService:UsersService) {
    }

    @Get()
    findAllUser(@Req() req){
        return req.user;
    }

    //
    @Post()
    creatUser(@Body() data : JoinRequestDto){
        const {email,nickname,password}= data;

        return  this.userService.creatUser(email,nickname,password);
    }

    @Post('login')
    logIn():string{
        return  '';
    }

    // req , res 웬만하면 쓰지말자 그럼 express에 결합된다!!
    @Post('logout')
    logOut(@Req() req , @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid',{httpOnly : true});
        res.send('ok');
    }


}
