import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {NextFunction,Request,Response} from "express";

@Injectable() // 싱글턴(Singleton)으로 객체 생성후 메모리에 저장 . 즉 Nest js IOC 컨테이너가 관리하게 한다.
export class LoggerMiddleware implements  NestMiddleware{
    // 맴버변수 선언 로그찍기위해
    private logger=new Logger('HTTP');  //context는 Express의 debug처럼 비숫하게 보여준다

  //NestMiddleware를 구현했기떄문에 해당 인터페이스의 메소드를 오버라이딩 필수!
    use(request : Request, response: Response, next: NextFunction): void {
        //첫번쨰실행
        const { ip , method , originalUrl }= request;
        const userAgent = request.get('user-agent') || '';

        //마지막실행
        //응답줄떄
        response.on('finish',()=>{
            const { statusCode }=response;
            const contentLength = response.get('content-length');
            //로그찍기
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        })
        //2번쨰실행
        //다음으로 넘기기
        next();
    }

}
