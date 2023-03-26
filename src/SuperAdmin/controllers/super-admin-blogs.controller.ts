import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../Infrastructure';
import { BlogFilter } from '../../Model';
import { adminQuery } from '../useCases';

@Controller('/api/sa/blogs')
@UseGuards(BasicAuthGuard)
export class SuperAdminBlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async getBlogsForAdmin(@Query() filter: BlogFilter) {
    return await this.queryBus.execute(
      new adminQuery.GetPaginatedBlogs(filter),
    );
  }
}
