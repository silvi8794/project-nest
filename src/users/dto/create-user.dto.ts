import { 
    IsEmail, 
    IsNotEmpty, 
    MinLength 
} from "class-validator";

export class CreateUserDto {
    @IsEmail({}, {message: 'Email should be a valid email'})
    @IsNotEmpty({message: 'Email should not be empty'})
    email: string;

    @IsNotEmpty({message: 'Password should not be empty'})
    @MinLength(8, {message: 'Password should be at least 8 characters long'})
    password: string;

    @IsNotEmpty({message: 'Name should not be empty'})
    name: string;

    @IsNotEmpty({message: 'Role should not be empty'})
    role: string;
}
