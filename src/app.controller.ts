import {Controller, Get} from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/')
  root() {
    return 'Hello World!';
  }
}
