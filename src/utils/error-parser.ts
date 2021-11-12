import { HttpStatus } from '@nestjs/common';

export const errorParse: (err: any) => { msg: string; errCode: number } = (
  err: any,
) => {
  console.log(err);

  if (err.hasOwnProperty('detail')) {
    if (err.code === '23505') {
      return { msg: err.detail, errCode: HttpStatus.NOT_ACCEPTABLE };
    }

    if (err.code === '22P02') {
      return {
        msg: 'invalid input syntax',
        errCode: HttpStatus.NOT_ACCEPTABLE,
      };
    }
    return { msg: err.detail, errCode: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  if (err.hasOwnProperty('response')) {
    return { msg: err.response?.message, errCode: err.response?.statusCode };
  }

  return { msg: 'Something went wrong', errCode: 500 };
};
