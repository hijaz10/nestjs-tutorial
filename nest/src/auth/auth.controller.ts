import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authdto } from 'src/dto';

@Controller('auth')
export class Authcontroller {
    constructor(private authservice: AuthService){}

    @Post('signup')
    signup(@Body() dto: Authdto){
        return this.authservice.signup(dto)
    }
    
    @HttpCode(200)
    @Post('login')
    login(@Body() dto: Authdto){
        return this.authservice.Login(dto)
    }
} 