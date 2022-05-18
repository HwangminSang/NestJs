import {Controller, Delete, Get, Post} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {

    @Get()
    getMyWorkspaces(){

    }
    @Post()
    createdWorkspace(){
    }
//워크스페이스 사용자가져오기
    @Get(':url/members')
    getAllMembersFromWorkspace(){
    }
//워크스페이스에 사용자초대
    @Post(':url/members')
    inviteMembersToWorkspace(){
    }

//워크스페이스에 사용자 삭제
    @Delete(':url/members/:id')
    deleteMemberFromWorkspace(){
    }
    //워크스페이스 사용자 정보 가져오기
    @Get(':url/members/:id')
    getMemberInfoWorkspace(){
    }

}
