import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    description: "Contenido de la publicación, máximo 280 caracteres.",
    example: "¡Hola equipo! Hoy lanzamos la nueva funcionalidad.",
    maxLength: 280
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  message!: string;
}
