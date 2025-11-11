import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "Usuario, alias o correo electrónico con el que deseas iniciar sesión.",
    example: "aromero"
  })
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty({
    description: "Contraseña asociada al usuario.",
    example: "Periferia123!"
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
