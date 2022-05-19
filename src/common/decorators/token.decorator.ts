import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// 다른곳에서 어노테이션으로 사용가능
//reponse의 토큰을 가져온다
export const Token = createParamDecorator(
  //익명함수로 만들어준다
  (data : unknown , ctx : ExecutionContext)=>{
  const response = ctx.switchToHttp().getResponse();
  return response.locals.jwt;
  }
)
// @Token() token 으로 다른곳에서 사용가능!
