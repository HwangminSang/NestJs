import {ApiProperty} from "@nestjs/swagger";
import { JoinRequestDto } from "../../users/dto/join.request.dto";

//상속가능
export class UserResponseDto extends JoinRequestDto{

  @ApiProperty({
    required : true ,
    example : 1 ,
    description : '아이디'
  })
  id : number


}
