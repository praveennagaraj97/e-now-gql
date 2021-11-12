import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEnity } from './entities/user.entity';
import type {
  CreateUserInputType,
  FindOnyByEmailAndPasswordInputType,
  FindOnyByUserNameAndPasswordInputType,
  UpdatePasswordInputType,
} from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEnity)
    private readonly userRepository: Repository<UserEnity>,
  ) {}

  /**
   * @description Saves new user object into database
   * @param CreateUserInputType
   * @returns Promise<UserEnity>
   */
  create(dto: CreateUserInputType): Promise<UserEnity> {
    const userData = Object.assign(new UserEnity(), dto);

    return this.userRepository.save(userData);
  }

  /**
   * @description find user by there username and password
   * @param FindOnyByUserNameAndPasswordInputType
   * @returns Promise<UserEnity>
   */
  async findOnyByUserNameAndPassword(
    dto: FindOnyByUserNameAndPasswordInputType,
  ): Promise<UserEnity> {
    try {
      const user = await this.userRepository.findOne({
        where: { userName: dto.userName },
      });

      if (!user) {
        throw new UnauthorizedException(`No user found with ${dto.userName}`);
      }

      const isPasswordValid = await user.comparePassword(dto.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(`Invalid password entered`);
      }

      delete user.password;

      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @description find user by there email and password
   * @param FindOnyByEmailAndPasswordInputType
   * @returns Promise<UserEnity>
   */
  async findOnyByEmailAndPassword(
    dto: FindOnyByEmailAndPasswordInputType,
  ): Promise<UserEnity> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException(`No user found with ${dto.email}`);
      }

      const isPasswordValid = await user.comparePassword(dto.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(`Invalid password entered`);
      }

      delete user.password;

      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @description find user by there id, Note use this after validations.
   * @param string
   * @returns Promise<UserEnity>
   */
  async findById(id: string): Promise<UserEnity> {
    try {
      const user = await this.userRepository.findOne(id, {
        loadRelationIds: true,
      });

      if (!user) {
        throw new UnauthorizedException(
          'User not found, Provided token is not valid',
        );
      }

      delete user.password;

      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @description find user by there id, Note use this after validations.
   * @param string
   * @returns Promise<boolean>
   */
  async checkUserExistById(id: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @description updates user with session token
   * @returns Promise<Boolean>
   */
  async updatePassword(dto: UpdatePasswordInputType): Promise<boolean> {
    try {
      if (dto.currentPassword === dto.newPassword) {
        throw new UnprocessableEntityException(
          'Current password and new password cannot be same',
        );
      }

      const user = await this.userRepository.findOne({ where: { id: dto.id } });

      if (!user) {
        throw new UnauthorizedException('No User found');
      }

      const isValid = await user.comparePassword(dto.currentPassword);

      if (!isValid) {
        throw new UnauthorizedException('Provided current password is invalid');
      }

      user.password = dto.newPassword;

      await this.userRepository.save(user);

      return true;
    } catch (e) {
      throw e;
    }
  }
}
