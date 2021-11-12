import type { Request, Response } from 'express';
import { UserRoles } from 'src/constants/enum';

export interface GQLContextType {
  req: Request;
  res: Response;
}

export interface FileType {
  source: string;
  id: string;
  bucket?: string;
}

export interface ExpressRequestWithUserSession extends Request {
  uid: string;
  user: UserType;
}

export interface GQLContentWithUserSession {
  req: ExpressRequestWithUserSession;
  res: Response;
}

export type UserType = {
  id: string;
  userName: string;
  email: string;
  userRole: UserRoles;
};

export type StorageServiceProviders = 'local' | 'aws' | 'cloudinary' | 'gcp';
