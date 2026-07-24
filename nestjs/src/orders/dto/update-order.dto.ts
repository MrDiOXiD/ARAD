import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

// Using @nestjs/swagger's PartialType (instead of @nestjs/mapped-types)
// so the generated Swagger schema keeps the field descriptions/examples
// defined on CreateOrderDto instead of losing them.
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
