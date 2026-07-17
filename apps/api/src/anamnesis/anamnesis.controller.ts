import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AnamnesisService } from "./anamnesis.service";
import { UpdateAnamnesisDto } from "./dto/update-anamnesis.dto";

@Controller("anamnesis")
@UseGuards(JwtAuthGuard)
export class AnamnesisController {
  constructor(private anamnesisService: AnamnesisService) {}

  @Get("me")
  getMine(@Req() req: any) {
    return this.anamnesisService.getOrCreate(req.user.userId);
  }

  @Patch("me")
  updateMine(@Req() req: any, @Body() dto: UpdateAnamnesisDto) {
    return this.anamnesisService.updateDraft(req.user.userId, dto);
  }

  @Post("me/submit")
  submitMine(@Req() req: any) {
    return this.anamnesisService.submit(req.user.userId);
  }
}
