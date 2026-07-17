import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ProfessionalGuard } from "../auth/professional.guard";
import { AdminClientsService } from "./admin-clients.service";
import { CreateMealPlanDto } from "./dto/meal-plan.dto";
import { CreateWorkoutDto } from "./dto/workout.dto";

@Controller("admin")
@UseGuards(ProfessionalGuard)
export class AdminClientsController {
  constructor(private service: AdminClientsService) {}

  @Get("clients")
  listClients() {
    return this.service.listClients();
  }

  @Get("clients/:id")
  clientDetail(@Param("id") id: string) {
    return this.service.getClientDetail(id);
  }

  @Post("clients/:id/meal-plan")
  createMealPlan(@Param("id") id: string, @Body() dto: CreateMealPlanDto) {
    return this.service.createMealPlan(id, dto);
  }

  @Post("meal-plans/:id/publish")
  publishMealPlan(@Param("id") id: string, @Req() req: any) {
    return this.service.publishMealPlan(id, req.user.userId);
  }

  @Post("clients/:id/workout")
  createWorkout(@Param("id") id: string, @Body() dto: CreateWorkoutDto) {
    return this.service.createWorkout(id, dto);
  }

  @Post("workouts/:id/publish")
  publishWorkout(@Param("id") id: string, @Req() req: any) {
    return this.service.publishWorkout(id, req.user.userId);
  }
}
