import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Token } from './token.model';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
}
