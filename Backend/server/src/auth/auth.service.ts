import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(username: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already in use.');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      email,
      password: hashed,
    });

    return user.save();

  }



  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = {
      email: user.email,
      username: user.username,
      sub: user._id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Store hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    await user.save();

    return { accessToken, refreshToken };

  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const payload: any = this.jwtService.verify(refreshToken, {     // here we decode the refresh token  and check its validity
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.sub);  // We extract the user’s ID (payload.sub) from the token.

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);  // We compare the provided refresh token against the hashed refresh token stored in MongoDB.
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Create new access token
      const newAccessToken = this.jwtService.sign(    // So we generate a new access token for the user
        {
          sub: user._id,
          username: user.username,
          email: user.email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      );

      return { accessToken: newAccessToken };
      
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }
}
