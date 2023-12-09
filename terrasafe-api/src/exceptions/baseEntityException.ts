import { NotFoundException } from "@nestjs/common";

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id: number) {
    super(`${entityName} with ID ${id} not found`);
  }
}
