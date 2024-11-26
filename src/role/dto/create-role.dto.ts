import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString({message: 'Name should be a string'})
    @IsNotEmpty({message: 'Name should not be empty'})
    name: string;

    @IsString({message: 'Description should be a string'})
    description?: string;

}
