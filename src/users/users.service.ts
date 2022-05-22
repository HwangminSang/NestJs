import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { Repository , Connection } from "typeorm";
import { JoinRequestDto } from "./dto/join.request.dto";
import { WorkspaceMembers } from "../entities/WorkspaceMembers";
import { ChannelMembers } from "../entities/ChannelMembers";

@Injectable()
export class UsersService {
    constructor(
      // 레포지토리가 테이블과 엔티티를 이어준다
      @InjectRepository(Users)
    private usersRepository : Repository<Users>,
      @InjectRepository(WorkspaceMembers)
    private  workspaceMemberRepository : Repository<WorkspaceMembers>,
      @InjectRepository(ChannelMembers)
      private  channelMembers : Repository<ChannelMembers>,
      private  connection:Connection
    ) {}
    findAllUser() :string{
        return "";
    }

    // 트랜잭션
   async creatUser(joinRequestDto : JoinRequestDto) {
      // 트랜잭션 처리  insert문이 3번나가기떄문에 도중에 하나라도 실패시 롤백 하도록 설정하는방법.
     //this.usersRepository 로 한다면 queryRunner의 connection과는 다른 초기설정 했던 conncetion 객체를 가져오기떄문에 주의!!
     const queryRunner = this.connection.createQueryRunner();
     await queryRunner.connect();
     await  queryRunner.startTransaction();

      // findOne 이용하여 해당 이메일의 사용자 여부를 확인
     const {email , nickname , password } =joinRequestDto;
       const  user = await queryRunner.manager.getRepository(Users).findOne({ where : {email }});
     //이미 존재하는 회원이라고 에러를 던져주자자
       if(user){
         // status : 401
       throw new UnauthorizedException('이미 존재하는 회원입니다');
       }
       const hashedPassword = await  bcrypt.hash(password , 12);
   try{
     //1번째 방법
     const returnedUser= await queryRunner.manager.getRepository(Users).save({
       email,
       nickname,
       password: hashedPassword,
     })
     //2번쨰방법
     const workspaceMember = queryRunner.manager.getRepository(WorkspaceMembers).create();
     workspaceMember.UserId=returnedUser.id
     workspaceMember.WorkspaceId=1;
      await queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMember);

     //3번쨰 방법

    await queryRunner.manager.getRepository(ChannelMembers).save({
       UserId :returnedUser.id,
       ChannelId:1,
     });
     //성공한다면 commit
     await  queryRunner.commitTransaction();

   }catch(error){
     console.log(error)
     //실패시 rollback
     await  queryRunner.rollbackTransaction();
     throw  error;

   }finally {
     //connection 객체 pool에 반환
    await  queryRunner.release();
   }


     return true;
    }

}
