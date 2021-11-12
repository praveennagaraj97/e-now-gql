import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GQLContentWithUserSession } from 'src/types';

export function requestDestructFromExectuionContext(context: ExecutionContext) {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext<GQLContentWithUserSession>();

  return req;
}
