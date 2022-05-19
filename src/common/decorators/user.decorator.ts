import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// 다른곳에서 어노테이션으로 사용가능
export const User = createParamDecorator(
  //익명함수로 만들어준다
  (data : unknown , ctx : ExecutionContext)=>{
  const request = ctx.switchToHttp().getRequest();
  return request.user;
  }
)
