import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookservice: WebhookService){}

    @Get()
    verifyWebhook(@Query() query:any){
      return this.webhookservice.verifyWebhook(query);
    }
    
    @Post()
    receiveMessage(@Body() body:any){
     return this.webhookservice.receiveMessage(body);

    }
}
