import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

// main.ts에서 등록해줘야한다
//잡고자 하는 exception
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
  // sevice에서 던지 exception정보
  catch(exception: any, host: ArgumentsHost): any {

        const ctx=host.switchToHttp();  // http를 가져온다
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const err   = exception.getResponse() as
          | { message : any , statusCode : number }  // 내가 직접 발생시킨에러   throw new UnauthorizedException('이미 존재하는 회원입니다');
          | {error : string , statusCode : 400 ; message : string[] }; // class - validator 던져주는 에러 형태

      console.log(err);


         // class - validator 던져주는 에러형태를 커스텀 해준다
        if(typeof err !== 'string' && err.statusCode === 400){
          return response.status(status).json({
            success : false ,
            code    : status,
            data    : err.message,
          })
        }

       return response.status(status).json({
          success : false ,
          code : status ,
          data : err.message
        })


  }

}
