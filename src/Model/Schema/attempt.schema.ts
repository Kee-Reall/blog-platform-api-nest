import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Attempt {
  @Prop({ required: true })
  endpointAndIp: string;

  @Prop({ default: new Date().toISOString() })
  date: string;
}
