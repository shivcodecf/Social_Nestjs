import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/auth.schema';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users = await this.userModel.find().select('-password');
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const me = await this.userModel
      .findById(req.user.userId)
      .select('-password');

    if (!me) {
      throw new NotFoundException('User not found');
    }

    return me;

  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.userModel.findOne({ username }).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  async followUser(
    @Param('username') username: string,
    @Req() req: RequestWithUser,
  ) {
    if (username === req.user.username) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const followUser = await this.userModel.findOne({ username: req.user.username });

    if (! followUser) {
      throw new NotFoundException('Current user not found.');
    }

    if (! followUser.following.includes(username)) {
       followUser.following.push(username);
       await  followUser.save();
    }

    return { message: `Followed ${username}` };
    
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/unfollow')
  async unfollowUser(
    @Param('username') username: string,
    @Req() req: RequestWithUser,
  ) {
    if (username === req.user.username) {
      throw new BadRequestException('You cannot unfollow yourself.');
    }

    const unfollowUser = await this.userModel.findOne({ username: req.user.username });

    if (!unfollowUser) {
      throw new NotFoundException('Current user not found.');
    }

    unfollowUser.following = unfollowUser.following.filter((u) => u !== username);

    await unfollowUser.save();

    return { message: `Unfollowed ${username}` };
  }
}
