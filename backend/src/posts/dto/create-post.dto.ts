import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  message!: string;
}
