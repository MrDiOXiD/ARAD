import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from '../entities/user-address.entity';
import {  CreateUserAddressDto, UpdateUserAddressDto, UserAddressResponseDto } from '../dto/user-address.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Injectable()
export class UserAddressesService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private readonly addressRepository: Repository<UserAddressEntity>,
  ) {}

async findAllForUser(userId: number): Promise<UserAddressResponseDto[]> {
  const rows = await this.addressRepository.find({
    where: { user: { id: userId } },
    order: { isDefault: 'DESC', createdAt: 'DESC' },
  });
  return rows.map((row) => this.toResponseDto(row));
}


  /**
   * Loads one address and verifies it belongs to the requesting user.
   * Every mutating method below goes through this — never trust an
   * address id alone, always check ownership, otherwise any logged-in
   * user could read/edit/delete another user's saved address (IDOR).
   */
  private async findOwned(addressId: number, userId: number): Promise<UserAddressEntity> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException(`Address ${addressId} not found.`);
    }
    if (address.user.id !== userId) {
      // 404, not 403 — don't reveal that an address with this id exists
      // at all for another account.
      throw new NotFoundException(`Address ${addressId} not found.`);
    }
    return address;
  }

  async create(user: UserEntity, dto: CreateUserAddressDto): Promise<UserAddressResponseDto> {
  const address = this.addressRepository.create({ ...dto, user });

  if (dto.isDefault) {
    await this.clearExistingDefault(user.id);
  }

  const saved = await this.addressRepository.save(address);
  return this.toResponseDto(saved);
}


  async update(
  addressId: number,
  userId: number,
  dto: UpdateUserAddressDto,
): Promise<UserAddressResponseDto> {
  const address = await this.findOwned(addressId, userId);

  if (dto.isDefault) {
    await this.clearExistingDefault(userId);
  }

  Object.assign(address, dto);
  const saved = await this.addressRepository.save(address);
  return this.toResponseDto(saved);
}

  async remove(addressId: number, userId: number): Promise<void> {
    const address = await this.findOwned(addressId, userId);
    await this.addressRepository.remove(address);
  }

async setDefault(addressId: number, userId: number): Promise<UserAddressResponseDto> {
  const address = await this.findOwned(addressId, userId);
  await this.clearExistingDefault(userId);
  address.isDefault = true;
  const saved = await this.addressRepository.save(address);
  return this.toResponseDto(saved);
}

  /** Keeps "at most one default address per user" true before setting a new one. */
  private async clearExistingDefault(userId: number): Promise<void> {
    await this.addressRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );
  }
  
  private toResponseDto(entity: UserAddressEntity): UserAddressResponseDto {
    const { user, ...rest } = entity;
    return rest;
  }
}
