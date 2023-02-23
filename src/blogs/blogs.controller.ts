import { Controller, Get } from '@nestjs/common';
import { BlogsService } from './blogs.service';
@Controller()
export class BlogsController {
  constructor(private blogService: BlogsService) {}
  @Get()
  async helloApiBlogs() {
    return this.blogService.hello();
  }
}
