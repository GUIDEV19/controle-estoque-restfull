import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { IsString } from "class-validator";

export class EntityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEnum(['unity', 'people', 'supplier'])
  type: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsNumber()
  @IsNotEmpty()
  daughter: number;

}