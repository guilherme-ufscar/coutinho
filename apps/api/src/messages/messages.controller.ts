import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ProfessionalGuard } from "../auth/professional.guard";
import { MessagesService } from "./messages.service";
import { SendMessageDto } from "./dto/send-message.dto";

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messages: MessagesService) {}

  @Get("messages/me")
  myThread(@Req() req: any) {
    return this.messages.getThreadWithMessages(req.user.userId);
  }

  @Post("messages/me")
  sendMine(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.messages.send(req.user.userId, req.user.userId, dto.body);
  }

  @Get("admin/threads")
  @UseGuards(ProfessionalGuard)
  listThreads() {
    return this.messages.listForProfessional();
  }

  @Get("admin/clients/:id/messages")
  @UseGuards(ProfessionalGuard)
  async clientThread(@Param("id") id: string) {
    await this.messages.assertClientExists(id);
    return this.messages.getThreadWithMessages(id);
  }

  @Post("admin/clients/:id/messages")
  @UseGuards(ProfessionalGuard)
  async replyToClient(@Param("id") id: string, @Req() req: any, @Body() dto: SendMessageDto) {
    await this.messages.assertClientExists(id);
    return this.messages.send(id, req.user.userId, dto.body);
  }
}
