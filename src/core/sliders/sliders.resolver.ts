import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { catchError, from, map } from 'rxjs';
import { UserRoles } from 'src/constants/enum';
import { IsAuthenticatedGuard } from 'src/shared/guards/is-authenticated.guard';
import { Roles, RolesGuard } from 'src/shared/guards/role.guard';
import { errorParse } from 'src/utils/error-parser';
import { CreateSliderDTO, UpdateSliderDTO } from './dto';
import {
  CreateSliderResponseSchema,
  DeleteSliderReponseSchema,
  SliderSchema,
  SlidersResponseSchema,
  UpdateSlidersResponseSchema,
} from './schema/sliders.schema';
import { SliderService } from './slider.service';

@Resolver(() => SliderSchema)
export class SlidersResolver {
  constructor(private sliderService: SliderService) {}

  @Query(() => SlidersResponseSchema)
  getSliders() {
    return from(this.sliderService.find()).pipe(
      map((sliders) => ({ sliders, message: 'List of sliders' })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Mutation(() => CreateSliderResponseSchema)
  async addSlider(
    @Args('input') input: CreateSliderDTO,
    @Args('sliderImage', { type: () => GraphQLUpload, nullable: false })
    sliderImage: FileUpload,
  ) {
    return from(this.sliderService.create(input, sliderImage)).pipe(
      map((slider) => ({ ...slider, message: 'Slider added successfully' })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => UpdateSlidersResponseSchema)
  updateSlider(
    @Args('input') input: UpdateSliderDTO,
    @Args('sliderImage', { type: () => GraphQLUpload, nullable: true })
    sliderImage?: FileUpload,
  ) {
    return from(this.sliderService.update(input, sliderImage)).pipe(
      map((slider) => ({ ...slider, message: 'Slider updated successfully' })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => DeleteSliderReponseSchema)
  deleteSlider(@Args('id') id: string) {
    return from(this.sliderService.delete(id)).pipe(
      map(() => ({ message: 'Slider deleted successfully' })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }
}
