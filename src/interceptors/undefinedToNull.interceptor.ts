import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

//인터셉터  컨트롤 전, 후 처리가능
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor{

  intercept(context: ExecutionContext, next: CallHandler<any>)
            : Observable<any> | Promise<Observable<any>> {
   //컨트롤 전부분




    //후 부분  return 값이 dataㄹ 들어온다 {data : user }
    // JSON에 undefined가 들어가면 에러가 나기때문에 null로 바꿔주는 여할
    return next.handle().pipe(map(data => data === undefined ? null : data))
  }

}
