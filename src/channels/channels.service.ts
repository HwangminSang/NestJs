import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { Channels } from "../entities/Channels";
import { ChannelMembers } from "../entities/ChannelMembers";
import { Workspaces } from "../entities/Workspaces";
import { ChannelChats } from "../entities/ChannelChats";
import { Users } from "../entities/Users";

@Injectable()
export class ChannelsService {
  constructor( @InjectRepository(Channels)
               private  channelsRepository : Repository<Channels>,
               @InjectRepository(ChannelMembers)
               private  channelMembersRepository : Repository<ChannelMembers>,
               @InjectRepository(Workspaces)
               private  workspacesRepository : Repository<Workspaces>,
               @InjectRepository(ChannelChats)
               private  channelChatsRepository : Repository<ChannelChats>,
               @InjectRepository(Users)
               private  usersRepository : Repository<Users>,
               private  connection:Connection,
  ) {}

 async findById( id  : number){
    return this.channelsRepository.findOne({where : { id }})
 }

 async getWorkspaceChannels(url : string , myId : number){
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        {myId}
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        {url}
      )
 }

  async getWorkspaceChannel( url  : string , name : string){
    return this.channelsRepository.findOne({
      where : {
        name
      },
     relations : [ 'Workspace'],
    })
  }


  async getWorkspaceChannelMembers( url  : string , name : string){
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels','channels','channels.name = :name' , {name})
      .innerJoin('channels.Workspace','workspace','workspace.url = :url',{url})
      .getMany();
  }
}
