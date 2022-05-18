import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {DmsService} from "./dms.service";


@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private readonly dmsService :DmsService) {
  }

  //1번쨰 query받기
/*  @Get(':id/chats')
    getChat(@Query() query , @Param() param){
        const {perPage , page }=query;
        param.id  , param.url
  }*/

    //2번째 방식
    @Get(':id/chats')
    getChat(@Query('perPage') perPage ,@Query('page') page
            ,@Param('id') id, @Param('url') url){


    }

  @Post(':id/chats')
    postChat(@Body() body){

  }
}
