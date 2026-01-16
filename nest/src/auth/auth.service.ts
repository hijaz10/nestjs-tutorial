import { ForbiddenException, Injectable } from '@nestjs/common';
import { Authdto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async signup(dto: Authdto){
    try {
      const hash = await argon.hash(dto.password)

      const user = await this.prisma.user.create({
        data:{
          email:dto.email,
          hash,
        },
      })

    return this.signToken(user.id, user.email)
      
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError && error.code === 'P2002'){
        throw new ForbiddenException('Email already exists')
      }

      throw error;
    }
    }

  async Login(dto: Authdto){
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      }
    })
    if(!user){
      throw new ForbiddenException('Credentials incorrect')
    }

    const password = await argon.verify(user.hash, dto.password)

    if(!password){
      throw new ForbiddenException('Incorrect credentials')
    }
    return this.signToken(user.id, user.email)
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
  const payload = {
    sub: userId, 
    email,
  };

  const secret = this.config.get('JWT_SECRET')

  const token = await this.jwt.signAsync(payload, {
    expiresIn: '1h',
    secret: secret, 
  });

  return { access_token: token };

}

}
