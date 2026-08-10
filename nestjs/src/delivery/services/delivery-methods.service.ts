import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryMethodEntity } from '../entities/delivery-method.entity';
import { CreateDeliveryMethodDto, UpdateDeliveryMethodDto } from '../dto/delivery-method.dto';

@Injectable()
export class DeliveryMethodsService {
  constructor(
    @InjectRepository(DeliveryMethodEntity)
    private readonly repo: Repository<DeliveryMethodEntity>,
  ) {}

  findAllActive(): Promise<DeliveryMethodEntity[]> {
    return this.repo.find({ where: { isActive: true }, order: { baseFee: 'ASC' } });
  }

  findAllForAdmin(): Promise<DeliveryMethodEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateDeliveryMethodDto): Promise<DeliveryMethodEntity> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateDeliveryMethodDto): Promise<DeliveryMethodEntity> {
    const method = await this.repo.findOne({ where: { id } });
    if (!method) throw new NotFoundException(`Delivery method ${id} not found.`);
    Object.assign(method, dto);
    return this.repo.save(method);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete({ id });
  }

  /**
   * Server-side fee computation — the ONLY place a delivery fee is
   * ever decided. Never trust a fee value from the client; it only
   * ever sends a deliveryMethodId.
   */
  async calculateFee(deliveryMethodId: number, totalQuantity: number): Promise<{ method: DeliveryMethodEntity; fee: number }> {
    const method = await this.repo.findOne({ where: { id: deliveryMethodId, isActive: true } });
    if (!method) throw new NotFoundException('Selected delivery method is not available.');

    const fee = Number(method.baseFee) + Number(method.perItemFee) * totalQuantity;
    return { method, fee };
  }
}
