import { Global, Module } from "@nestjs/common";
import { RemindersQueueService } from "./reminders-queue.service";

@Global()
@Module({
  providers: [RemindersQueueService],
  exports: [RemindersQueueService],
})
export class RemindersModule {}
