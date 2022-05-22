import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export  class LoggedInGuard implements CanActivate{
  canActivate(context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

       const request=context.switchToHttp().getRequest();

       // true를 리턴시 컨트롤러 진행
    return request.isAuthenticated();
  }

}
