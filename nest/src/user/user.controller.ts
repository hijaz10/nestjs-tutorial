import { Controller,Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Controller('users')
export class userController{
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@Req() req: any){
        return req.user
    }
}