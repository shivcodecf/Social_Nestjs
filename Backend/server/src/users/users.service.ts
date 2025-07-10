import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/auth.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async follow(userId: string, followUsername: string) {
    const followUser = await this.userModel
      .findOne({ username: followUsername })
      .exec() as UserDocument | null;

    if (!followUser) {
      throw new NotFoundException('User to follow not found');
    }

    if (followUser._id?.toString() === userId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    await this.userModel.updateOne(
      { _id: userId },
      { $addToSet: { following: followUsername } },
      
      
    );

    return  { message: 'Followed successfully!' };
       
  }

  async unfollow(userId: string, followUsername: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { following: followUsername } },
    );
     return { message: 'Unfollowed successfully!' };
  }

  async getUserProfile(username: string) {
    return this.userModel.findOne({ username }).select('-password');
  }
  
}
