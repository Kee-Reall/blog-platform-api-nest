// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
//
// export type AttemptDocument = HydratedDocument<Attempt>;
//
// @Schema({ versionKey: false })
// export class Attempt {
//   @Prop({ required: true })
//   endpointAndIp: string;
//
//   @Prop({ default: () => new Date() })
//   date: Date;
//
//   public async killYourSelfWithDelay() {
//     const that = this as unknown as AttemptDocument;
//     const model = that.constructor as Model<AttemptDocument>;
//     setTimeout(() => model.deleteOne(this), 60000);
//   }
// }
//
// const AttemptSchema = SchemaFactory.createForClass(Attempt);
