import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface SessionMetadata {
  userId: ObjectId;
  deviceId: string;
  updateDate: Date;
  ip: Array<string | 'undetected'>;
  title?: string;
}

export interface SessionJWTMeta {
  userId: string;
  deviceId: string;
  updateDate: string;
}

export interface RefreshTokenPayload extends JwtPayload, SessionJWTMeta {}

export interface SessionFilter {
  userId: string;
  deviceId: string;
}

export interface RefreshTokenDbResponse {
  deviceId: string;
  updateDate: Date;
}

export interface UpdateRefreshTokenMeta {
  userId: string;
  deviceId: string;
  ip: string | null;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
