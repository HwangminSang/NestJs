import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import {UsersService} from "./users.service";
import {JoinRequestDto} from "./dto/join.request.dto";
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { UserResponseDto } from "../common/dto/user.response.dto";
import { User } from "../common/decorators/user.decorator";
import { UndefinedToNullInterceptor } from "../interceptors/undefinedToNull.interceptor";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { LoggedInGuard } from "../auth/logged-in.guard";
import { NotLoggedInGuard } from "../auth/not-logged-in.guard";
import { LoginDto } from "./dto/login.dto";

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
        return user || false;
    }
    @UseGuards(NotLoggedInGuard)
    @ApiOperation({summary : '회원가입'})
    @Post()
    async join(@Body() joinRequestDto : JoinRequestDto){
        // await를 추가해야지 서비스단에서 던지 에러를 필터가 잡아 처리 후 클라이언트에게 보내준다  !!!
            await this.userService.creatUser(joinRequestDto);

    }

    // 알아서 STATUS 200으로 설명 및 반환

    @ApiOperation({summary : '로그인'})
    @ApiOkResponse({
        description : '로그인성공',
        type : UserResponseDto,
    })
    @ApiUnauthorizedResponse({
        description :'로그인 실패'
    })
    @ApiBody({type : LoginDto})
    @UseGuards(LocalAuthGuard) // 컨트롤러에 접근하기전에 권한 체크가 주요목적!!!  로그인 여부 찾기 !!!  인터셉터보다 먼저 시작된다     그래서 가드에서 문제가 있으면 excpetionfilter로 넘어감
    @Post('login')
    logIn(@Body() loginDto  :LoginDto) {
        console.log(loginDto.email , loginDto.password);
        return  loginDto;
    }

    // req , res 웬만하면 쓰지말자 그럼 express에 결합된다!!
    @ApiOperation({summary : '로그아웃'})
    @UseGuards(LoggedInGuard) //로그인한 사람만 로그아웃가능
    @Post('logout')
    logOut(@Req() req , @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid',{httpOnly : true});
        res.send('ok');
    }


}
