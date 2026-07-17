import { Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateMealPlanDto } from "./dto/meal-plan.dto";
import { CreateWorkoutDto } from "./dto/workout.dto";

@Injectable()
export class AdminClientsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  listClients() {
    return this.prisma.user.findMany({
      where: { role: Role.CLIENT },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        anamnesis: { select: { status: true, submittedAt: true } },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true, plan: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getClientDetail(id: string) {
    const client = await this.prisma.user.findUnique({
      where: { id, role: Role.CLIENT },
      include: {
        anamnesis: true,
        assessments: { orderBy: { recordedAt: "asc" } },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1, include: { plan: true } },
        mealPlans: { orderBy: { createdAt: "desc" }, take: 1, include: { meals: { include: { items: { include: { food: true } } } } } },
        workouts: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!client) throw new NotFoundException("Cliente não encontrado.");
    return client;
  }

  async createMealPlan(clientId: string, dto: CreateMealPlanDto) {
    await this.assertClient(clientId);
    return this.prisma.mealPlan.create({
      data: {
        clientId,
        meals: {
          create: dto.meals.map((meal) => ({
            time: meal.time,
            name: meal.name,
            notes: meal.notes,
            items: { create: meal.items.map((item) => ({ foodId: item.foodId, quantityGrams: item.quantityGrams, notes: item.notes })) },
          })),
        },
      },
      include: { meals: { include: { items: true } } },
    });
  }

  async publishMealPlan(mealPlanId: string, professionalId: string) {
    const mealPlan = await this.prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: { publishedAt: new Date(), createdById: professionalId },
    });
    await this.prisma.notification.create({
      data: {
        userId: mealPlan.clientId,
        type: "PLANO_PUBLICADO",
        title: "Seu plano alimentar foi publicado",
        body: "A equipe publicou um novo plano alimentar para você. Confira na área de Nutrição.",
        sentAt: new Date(),
      },
    });
    this.audit.log(professionalId, "PUBLISH", "MealPlan", mealPlan.id, { clientId: mealPlan.clientId });
    return mealPlan;
  }

  async createWorkout(clientId: string, dto: CreateWorkoutDto) {
    await this.assertClient(clientId);
    return this.prisma.workout.create({
      data: {
        clientId,
        letter: dto.letter,
        exercises: {
          create: dto.exercises.map((ex, i) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            load: ex.load,
            restSeconds: ex.restSeconds,
            notes: ex.notes,
            order: ex.order ?? i,
          })),
        },
      },
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async publishWorkout(workoutId: string, professionalId: string) {
    const workout = await this.prisma.workout.update({
      where: { id: workoutId },
      data: { publishedAt: new Date(), createdById: professionalId },
    });
    await this.prisma.notification.create({
      data: {
        userId: workout.clientId,
        type: "TREINO_ATUALIZADO",
        title: `Treino ${workout.letter} publicado`,
        body: "A equipe publicou/atualizou um treino para você. Confira na área de Treino.",
        sentAt: new Date(),
      },
    });
    this.audit.log(professionalId, "PUBLISH", "Workout", workout.id, { clientId: workout.clientId, letter: workout.letter });
    return workout;
  }

  private async assertClient(id: string) {
    const client = await this.prisma.user.findUnique({ where: { id, role: Role.CLIENT } });
    if (!client) throw new NotFoundException("Cliente não encontrado.");
  }
}
