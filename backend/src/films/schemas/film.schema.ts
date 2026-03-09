import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema({ _id: false })
export class ScheduleItem {
  @Prop({ required: true })
  id: string;

  @Prop()
  daytime?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  hall?: string | number;

  @Prop()
  rows?: number;

  @Prop()
  seats?: number;

  @Prop()
  price?: number;

  @Prop({ type: [String], default: [] })
  taken?: string[];
}

const ScheduleItemSchema = SchemaFactory.createForClass(ScheduleItem);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  rating?: number;

  @Prop()
  director?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  title?: string;

  @Prop()
  about?: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  cover?: string;

  @Prop({ type: [ScheduleItemSchema], default: [] })
  schedule?: ScheduleItem[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
