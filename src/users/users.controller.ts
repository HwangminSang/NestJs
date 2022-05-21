import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import {UsersService} from "./users.service";
import {JoinRequestDto} from "./dto/join.request.dto";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserResponseDto } from "../common/dto/user.response.dto";
import { User } from "../common/decorators/user.decorator";
import { UndefinedToNullInterceptor } from "../interceptors/undefinedToNull.interceptor";

//컨트롤러 전체에 인터셉터 전용하여 undefeined 일경우 null로 대체
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
    //의존성 주입
    constructor(private  readonly  userService:UsersService) {
    }

    @ApiOkResponse({
        type : UserResponseDto,
        description : '회원 한명 조회 성공',
    })
    @ApiOperation({summary : '내정보 조회'})
    @Get()
    // req 대신에 내가 만든 어노테이션 사용
    getUsers(@User() user){
        return user;
    }

    @ApiOperation({summary : '회원가입'})
    @Post()
    join(@Body() body : JoinRequestDto){
          this.userService.creatUser(body.email,body.nickname,body.password );
    }

    // 알아서 STATUS 200으로 설명 및 반환
    @ApiOkResponse({
        description : '로그인성공',
        type : UserResponseDto,
    })
    @ApiUnauthorizedResponse({
        description :'로그인 실패'
    })
    @ApiOperation({summary : '로그인'})
    @Post('login')
    logIn(@User() user) {
        return  user;
    }

    // req , res 웬만하면 쓰지말자 그럼 express에 결합된다!!
    @ApiOperation({summary : '로그아웃'})
    @Post('logout')
    logOut(@Req() req , @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid',{httpOnly : true});
        res.send('ok');
    }


}
