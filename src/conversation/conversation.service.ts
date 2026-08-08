import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageSender } from '@prisma/client';
@Injectable()
export class ConversationService {
  constructor( private readonly prisma: PrismaService,){}

  async resolveConversation(businessId:string, customerId:string){
    const now = new Date();
    
    const conversation = await this.prisma.conversation.findFirst({
      where:{
        businessId,
        customerId,
        status:'ACTIVE',
        expiresAt:{
          gt:now
        },
      },
      orderBy:{
        lastMessageAt:'desc'
      }
    });
      if(conversation){
      return this.prisma.conversation.update({
        where:{
          id: conversation.id,
        },
        data:{
          lastMessageAt:now,
          expiresAt:new Date(now.getTime() + 24*60*60*1000,)
        }
      })
    }

      return this.prisma.conversation.create({
        data:{
          businessId,
          customerId,
          status:'ACTIVE',
          startedAt:now,
          lastMessageAt:now,
          expiresAt:new Date(
            now.getTime() + 24*60*60*1000,
          ),
        },
      });

  }

  async recordMessage(
    conversationId:string,
    sender:MessageSender,
    content:string,
    providerMessageId?:string,
  ){
    return this.prisma.message.create({
      data:{
        conversationId,
        sender,
        content,
        providerMessageId,
      },
    });
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
