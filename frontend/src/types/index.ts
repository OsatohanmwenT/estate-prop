import { ROLES } from "~/constants";

export type TSuccessResponse<TData> = {
  success: true;
  message: string;
  data: TData;
};

export type TErrorResponse = {
  success: false;
  message: string;
  data?: null;
  error: string;
};

export type ROLE_TYPES = (typeof ROLES)[keyof typeof ROLES];

export type ROLE_ARRAY_TYPE = typeof ROLES[keyof typeof ROLES][];