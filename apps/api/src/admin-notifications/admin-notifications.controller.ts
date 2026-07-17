import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ProfessionalGuard } from "../auth/professional.guard";
import { AdminNotificationsService } from "./admin-notifications.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Controller("admin/notifications")
@UseGuards(ProfessionalGuard)
export class AdminNotificationsController {
  constructor(private service: AdminNotificationsService) {}

  @Get()
  list() {
    return this.service.listSent();
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateCampaignDto) {
    return this.service.create(req.user.userId, dto);
  }
}
