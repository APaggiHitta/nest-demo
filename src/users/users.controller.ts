import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { UsersDbService } from './usersDb.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinSizeValidatorPipe } from '../pipes/min-size-validator.pipe';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/UserCredentials.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getUsers(@Query('name') name?: string) {
    if (name) {
      return this.usersDbService.getUserByName(name);
    }
    return this.usersDbService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(
    /*@Headers('token') token?: string*/ @Req()
    request: Request & { user: any },
  ) {
    // if (token !== '1234') {
    //   return 'Token inválido';
    // }
    console.log(request.user);
    return 'Este endpoint es para obtener el perfil de un usuario';
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Ruta protegida';
  }

  @Get('auth0/protected')
  getAuth0Protected(@Req() req: Request) {
    return JSON.stringify(req.oidc.user);
  }

  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  // @UsePipes(MinSizeValidatorPipe)
  getUserImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'El archivo debe ser menor a 100kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
      MinSizeValidatorPipe,
    )
    file: Express.Multer.File,
  ) {
    // return this.cloudinaryService.uploadImage(file);
    return file;
  }

  // @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    try {
      throw new Error();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de cafe fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es un mensaje');
  }

  @Get('request')
  getRequest(@Req() request: Request) {
    console.log(request);
    return 'Esta ruta loguea el request';
  }
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.usersDbService.getUserById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user: CreateUserDto,
    @Req() request: Request & { now: string },
  ) {
    return this.authService.singUp({
      ...user,
      createdAt: request.now,
    });
  }

  @Post('signin')
  async signIn(@Body() user: UserCredentialsDto) {
    return this.authService.signIn(user.email, user.password);
  }

  @Put()
  updateUser() {
    return 'Este endpoint es para actualizar un usuario';
  }

  @Delete()
  deleteUser() {
    return 'Este endpoint es para eliminar un usuario';
  }
}
