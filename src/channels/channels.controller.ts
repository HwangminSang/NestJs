import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { ChannelsService } from "./channels.service";
import { User } from "../common/decorators/user.decorator";
import { PostChatDto } from "./dto/post-chat.dto";
@ApiTags('Channel')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {

    constructor(private readonly channelsService : ChannelsService) {
    }

    //모든 채널
    @Get(':id/chats')
    getAllChannel(@Query('perPage') perPage ,@Query('page') page
        ,@Param('id') id, @Param('url') url){

    }
    //특정 채널 가져오기
    @Get('name')
    getSpecificChannel(){

    }


    //해당 채널의 맴버 가져오기
    @Get(':name/members')
    getAllMembers(){
    }

    //해당 채널에 맴버초대
    @Post(':name/members')
    inviteMembers(){

    }

   //채널 한개 만들기
    @Post('')
    CreateChannel(@Query('perPage') perPage ,@Query('page') page
        ,@Param('id') id, @Param('url') url){

    }



    //채팅방 한개 가져오기
    @Get(':name/chats')
    getChat(@Query('url') url ,@Query('name') name ){

    }
    //채팅방 생성
    @Post(':name/chats')
    postChat(
      @Param('url') url : string,
      @Param('name') name :string,
      @Body() body : PostChatDto,
      @User() user){
        return this.channelsService.postChat({url , content : body.content , name , myId : user.id});
    }

}
