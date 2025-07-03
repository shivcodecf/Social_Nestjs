import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(req.user.username, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('timeline')
  async getTimeline(@Req() req: RequestWithUser) {
    return this.postsService.getTimelinePosts(req.user.username);
  }
}
