import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { Connection, Repository } from "typeorm";
import { WorkspaceMembers } from "../entities/WorkspaceMembers";
import { ChannelMembers } from "../entities/ChannelMembers";
import { Workspaces } from "../entities/Workspaces";
import { Channels } from "../entities/Channels";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";


//해당 클래스를 상속받아서 쓰는 클래스에서  di받은 필드에 접근하기위해서 필드주입.  그외에는 생성자 주입!
@Injectable()
export class WorkspacesService {
  constructor( @InjectRepository(Users)
               private usersRepository : Repository<Users>,
               @InjectRepository(WorkspaceMembers)
               private  workspaceMemberRepository : Repository<WorkspaceMembers>,
               @InjectRepository(Channels)
               private  channelsRepository : Repository<Channels>,
               @InjectRepository(ChannelMembers)
               private  channelMembersRepository : Repository<ChannelMembers>,
               @InjectRepository(Workspaces)
               private  workspacesRepository : Repository<Workspaces>,
               private  connection:Connection,
               ) {}


     async findById (id :number){
    // ==  this.workspacesRepository.findOne({ where : { id }})
      return this.workspacesRepository.findByIds([id]);
     }


  async findMyWorkspaces(myId :number){

      return this.workspacesRepository.find({
        where : {
          WorkspaceMembers : [ { UserId : myId }]
        }
      })
  }

    async  createWorkspace(user : Users ,createWorkspaceDto: CreateWorkspaceDto) {
    //트랜잭션 !!
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await  queryRunner.startTransaction();
      const { } =user;
      const {  url  } =createWorkspaceDto;

      try{

         const returned = await queryRunner.manager.getRepository(Workspaces).save({
              name,
              url,
              OwnerId : myId,
            });

        // PromiseAll 사용 병렬적으로 동시 실행 < 안에 함수들은 await >
        // 콤마 찍어두면 앞에꺼는 무시됨!!!
        const [,channelReturned] = await  Promise.all([
           queryRunner.manager.getRepository(WorkspaceMembers).save({
            UserId : myId ,
            WorkspaceId : returned.id
          }),
          queryRunner.manager.getRepository(Channels).save({
            name : '일반',
            WorkspaceId : returned.id
          })
        ])

        await  queryRunner.manager.getRepository(ChannelMembers).save({
          UserId : myId,
          ChannelId :  channelReturned.id
        })

      }catch (error){
        console.log(error)
        await  queryRunner.rollbackTransaction();
        throw  error;
      }finally {
        await  queryRunner.release();
      }
  }

  // 쿼리 빌더로 사용
  async  getWorkspaceMembers(url : string){
    await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      //sqlInjection 방어
     // innserJoin시 조인되는 테이블을 가져오지는 않는다
      .innerJoin('members.Workspace', 'w', 'w.url=:url', { url })
      .getMany();  // 자바스크립트로 객체로 바꾸다보니 좀 늦을수도 있다.
  }
  // 쿼리 빌더로 사용
  async  createWorkspaceMembers(url : string , email : string){
 // this.workspacesRepository.createQueryBuilder('w').innerJoinAndSelect('w.Channels','channels').getOne();
   const workspace = await this.workspacesRepository.findOne({
      where : {url},
      join : {
        alias : 'workspace',
        //조인과 동시에 select 하여 channel 안의 정보도 다 들고온다
        innerJoinAndSelect : {
          channels : 'workspace.Channels'
        }
      }
    });
    const user = await this.usersRepository.findOne({where : { email }})
    if (!user){
      return null;
     }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMemberRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find((
      v)=> v.name === '일반' ).id;
    channelMember.UserId= user.id;
    await  this.channelMembersRepository.save(channelMember);

  }

  async getWorkspaceMember(url : string , id : number){
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id',{id})
      // .andWhere('user.name = :name'.{name})
      // 조인만 하고 workpspaces의 정보는 가져오지않늗나
      .innerJoin( 'user.Workspaces','workspaces','workspaces.url = :url',{
        url
      })
      .getOne();

  }

}
