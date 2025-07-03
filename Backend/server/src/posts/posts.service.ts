import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post as PostModel, PostDocument } from './posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserDocument } from '../auth/auth.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPost(username: string, dto: CreatePostDto) {
    const post = new this.postModel({
      title: dto.title,
      description: dto.description,
      author: username,
    });
    return post.save();
  }

  async getTimelinePosts(username: string) {
    // Find user to get their following list
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new Error('User not found.');
    }

    // Include user's own posts + those of users they follow
    return this.postModel
      .find({ author: { $in: [username, ...user.following] } })
      .sort({ createdAt: -1 });
  }
}

