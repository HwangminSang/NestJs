import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { WorkspaceMembers } from "../entities/WorkspaceMembers";
import { Channels } from "../entities/Channels";
import { ChannelMembers } from "../entities/ChannelMembers";
import { Workspaces } from "../entities/Workspaces";
import { ChannelChats } from "../entities/ChannelChats";

@Module({
  imports : [TypeOrmModule.forFeature([Workspaces,Users ,ChannelChats ,Channels ,ChannelMembers])],
  controllers: [ChannelsController],
  providers: [ChannelsService]
})
export class ChannelsModule {}
