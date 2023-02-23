//import {} from '@nestjs/mongoose';
export interface BlogInputModel {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogLogicModel {
  //  id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
}
