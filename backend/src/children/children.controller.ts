import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { EnrollChildDto } from './dto/enroll-child.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import CONSTANTS from 'src/common/constants';

@ApiTags('children')
@Controller('parents/children')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all children managed by the authenticated parent',
  })
  @ApiResponse({
    status: 200,
    description: 'List of children returned successfully.',
  })
  async getChildren(@Req() req): Promise<User[]> {
    const parentId = req.user.userId;
    return this.childrenService.getChildrenByParent(parentId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new child profile under the authenticated parent',
  })
  @ApiBody({ type: CreateChildDto })
  @ApiResponse({ status: 201, description: 'Child created successfully.' })
  async createChild(@Req() req, @Body() createChildDto: CreateChildDto) {
    const parentId = req.user.userId;
    const child = await this.childrenService.createChild(
      parentId,
      createChildDto,
    );
    return {
      message: 'Child created successfully.',
      child: { id: child.id, name: child.name },
    };
  }

  @Post(':childId/enroll')
  @ApiOperation({ summary: 'Enroll a child with a specific linked teacher' })
  @ApiParam({ name: 'childId', type: 'number' })
  @ApiBody({ type: EnrollChildDto })
  @ApiResponse({ status: 201, description: 'Child enrolled successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Not authorized or parent not linked to the teacher.',
  })
  @ApiResponse({ status: 404, description: 'Child or Teacher not found.' })
  @ApiResponse({
    status: 409,
    description: 'Child already enrolled with this teacher.',
  })
  async enrollChild(
    @Req() req,
    @Param('childId', ParseIntPipe) childId: number,
    @Body() enrollDto: EnrollChildDto,
  ) {
    const parentId = req.user.userId;
    return this.childrenService.enrollChild(parentId, childId, enrollDto);
  }
}
