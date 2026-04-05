import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import CONSTANTS from 'src/common/constants';

@Injectable()
export class JwtAuthGuard
  extends AuthGuard(CONSTANTS.AUTH.JWT)
  implements CanActivate
{
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add custom authentication logic here if needed
    return super.canActivate(context);
  }
}
