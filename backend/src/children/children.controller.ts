import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChildrenService, ChildResponse } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { EnrollChildDto } from './dto/enroll-child.dto';
import { ListChildrenQueryDto } from './dto/list-children-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import CONSTANTS from 'src/common/constants';

@ApiTags('children')
@Controller('parents/children')
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_CHILDREN_READ)
  @ApiOperation({
    summary: 'Get all children managed by the authenticated parent',
  })
  @ApiResponse({
    status: 200,
    description: 'List of children returned successfully.',
  })
  @ApiQuery({
    name: 'education_stage',
    required: false,
    enum: ['PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED'],
  })
  @ApiQuery({ name: 'education_year', required: false, type: Number })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  async getChildren(
    @Req() req: { user: { userId: number } },
    @Query() query: ListChildrenQueryDto,
  ): Promise<ChildResponse[]> {
    const parentId = req.user.userId;
    return this.childrenService.getChildrenByParent(parentId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_CHILDREN_CREATE)
  @ApiOperation({
    summary: 'Create a new child profile under the authenticated parent',
  })
  @ApiBody({ type: CreateChildDto })
  @ApiResponse({ status: 201, description: 'Child created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  async createChild(
    @Req() req: { user: { userId: number } },
    @Body() createChildDto: CreateChildDto,
  ) {
    const parentId = req.user.userId;
    const child = await this.childrenService.createChild(
      parentId,
      createChildDto,
    );
    return child;
  }

  @Patch(':childId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_CHILDREN_UPDATE)
  @ApiOperation({
    summary: 'Update a child profile',
  })
  @ApiParam({ name: 'childId', type: 'number' })
  @ApiBody({ type: UpdateChildDto })
  @ApiResponse({ status: 200, description: 'Child updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  async updateChild(
    @Req() req: { user: { userId: number } },
    @Param('childId', ParseIntPipe) childId: number,
    @Body() updateDto: UpdateChildDto,
  ) {
    const parentId = req.user.userId;
    return this.childrenService.updateChild(parentId, childId, updateDto);
  }

  @Post(':childId/enroll')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_CHILDREN_ENROLL)
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
    @Req() req: { user: { userId: number } },
    @Param('childId', ParseIntPipe) childId: number,
    @Body() enrollDto: EnrollChildDto,
  ) {
    const parentId = req.user.userId;
    return this.childrenService.enrollChild(parentId, childId, enrollDto);
  }
}
