import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidersEntity } from './entity/sliders.entity';
import { SliderService } from './slider.service';
import { SlidersResolver } from './sliders.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SlidersEntity])],
  providers: [SlidersResolver, SliderService],
})
export class SlidersModule {}
