import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { command, query } from '../useCases';
import { RefreshJwtAuthGuard, User } from '../../Infrastructure';
import { SessionDocument, SessionJwtMeta, VoidPromise } from '../../Model';

@Controller('api/security/devices')
@UseGuards(RefreshJwtAuthGuard)
export class DeviceController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getDevices(
    @User() userMeta: SessionJwtMeta,
  ): Promise<SessionDocument[]> {
    return await this.queryBus.execute(new query.GetSessions(userMeta));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionsExcludeCurrent(
    @User() userMeta: SessionJwtMeta,
  ): VoidPromise {
    await this.commandBus.execute(
      new command.KillAllSessionsExcludeCurrent(userMeta),
    );
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionById(
    @User() userMeta: SessionJwtMeta,
    @Param('id') deviceId: string,
  ): VoidPromise {
    await this.commandBus.execute(new command.KillSession(deviceId, userMeta));
    return;
  }
}
