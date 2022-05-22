import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WorkspacesService } from "./workspaces.service";
import { Users } from "../entities/Users";
import { User } from "../common/decorators/user.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";


@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {

    constructor(
      private workspacesServcie : WorkspacesService
    ) {
    }

    //커스텀한 @User 사용
    @Get()
    getMyWorkspaces(@User() user : Users){

         return this.workspacesServcie.findMyWorkspaces(user.id);
    }
    @Post()
    createdWorkspace(@User() user : Users  , @Body() createWorkspaceDto : CreateWorkspaceDto){

        return this.workspacesServcie.createWorkspace(user,createWorkspaceDto);
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
