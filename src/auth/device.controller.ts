import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshJwtAuthGuard, User } from '../helpers';
import { AuthQueryRepository } from './repos';
import { SessionJwtMeta, VoidPromise } from '../Model';
import { AuthService } from './auth.service';

@Controller('api/security/devices')
export class DeviceController {
  constructor(
    private queryRepo: AuthQueryRepository,
    private service: AuthService,
  ) {}
  @Get()
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getDevices(@User() userMeta: SessionJwtMeta) {
    return await this.service.getSessions(userMeta);
  }

  @Delete()
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionsExcludeCurrent(
    @User() userMeta: SessionJwtMeta,
  ): VoidPromise {
    await this.service.killSessionsExcludeCurrent(userMeta);
    return;
  }

  @Delete(':id')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionById(
    @User() userMeta: SessionJwtMeta,
    @Param('id') deviceId: string,
  ) {
    await this.service.killSession(userMeta, deviceId);
    return;
  }
}
