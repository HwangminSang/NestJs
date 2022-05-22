
// 인터셉터 보다 먼저 실행된다.
// 컨트롤러에 접근하기전에 권한 체크가 주요목적!!!  로그인 여부 찾기 !!!  인터셉터보다 먼저 시작된다     그래서 가드에서 문제가 있으면 excpetionfilter로 넘어감
// 스프링 시큐얼리티와 유사하다.

import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//프로바이더
@Injectable()
export  class LocalAuthGuard extends AuthGuard('local'){

    async canActivate(context: ExecutionContext) :Promise<boolean>{
      const can = await  super.canActivate(context);
      if(can){
        const request = context.switchToHttp().getRequest();
        console.log('login for cookie')
        await super.logIn(request);
      }
    return true;
    }
}
