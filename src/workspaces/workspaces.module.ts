import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entities/Users";
import { WorkspaceMembers } from "../entities/WorkspaceMembers";
import { ChannelMembers } from "../entities/ChannelMembers";
import { Channels } from "../entities/Channels";
import { Workspaces } from "../entities/Workspaces";

@Module({
  imports : [TypeOrmModule.forFeature([Users ,WorkspaceMembers ,Channels ,ChannelMembers ,Workspaces])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
