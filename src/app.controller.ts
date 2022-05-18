import {Controller, Get, Inject, Injectable, Post} from '@nestjs/common';
import { AppService } from './app.service';


//req, res 알아야한다
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService,
              //쓸떄는 이렇게
              @Inject('CUSTOM_KEY') private readonly customValue,
              ) {}

  @Get('/test')
  testEnv(): string {
    return this.appService.testEnv();
  }


  @Get()
  getUser(): string {
    console.log(this.customValue);
    return this.appService.getUser();
  }

  @Post()
  joinUser(): string {
    return this.appService.joinUser();
  }

}
