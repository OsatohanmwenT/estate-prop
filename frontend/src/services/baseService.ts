import { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";
import { TSuccessResponse } from "~/types";
import { createAxiosInstance } from "./axiosInstance";

type BaseServiceConfig = {
  params?: Record<string, unknown>;
  headers?: AxiosHeaders | Record<string, string>;
  timeout?: number;
};

export abstract class BaseService {
  protected clientUrl: string;
  protected apiInstance: AxiosInstance;

  constructor(clientUrl: string, headers?: Record<string, string>) {
    this.clientUrl = clientUrl;
    this.apiInstance = createAxiosInstance(this.clientUrl, headers);
  }

  protected async handleRequest<TData>(
    request: Promise<AxiosResponse<TSuccessResponse<TData>>>
  ): Promise<TData> {
    try {
      const response = await request;
      console.log(
        `[BaseService] Response from ${this.clientUrl}:`,
        response.data
      );
      return response.data.data;
    } catch (e) {
      console.error(`[BaseService] Error from ${this.clientUrl}:`, e);
      if (e instanceof AxiosError) {
        throw new Error(e.response?.data?.message || e.message);
      }
      throw new Error("Something went wrong while processing your request");
    }
  }

  public async get<TData>(
    url: string,
    config?: BaseServiceConfig
  ): Promise<TData> {
    return this.handleRequest(
      this.apiInstance.get(url, {
        ...config,
        responseType: "json",
      })
    );
  }

  public async post<TResponse, TData>(
    url: string,
    data: TData,
    config?: BaseServiceConfig
  ): Promise<TResponse> {
    return this.handleRequest(this.apiInstance.post(url, data, config));
  }

  public async put<TResponse, TData>(
    url: string,
    data: TData,
    config?: BaseServiceConfig
  ): Promise<TResponse> {
    return this.handleRequest(this.apiInstance.put(url, data, config));
  }

  public async patch<TResponse, TData>(
    url: string,
    data: TData,
    config?: BaseServiceConfig
  ): Promise<TResponse> {
    return this.handleRequest(this.apiInstance.patch(url, data, config));
  }

  public async delete<TData>(
    url: string,
    config?: BaseServiceConfig
  ): Promise<TData> {
    return this.handleRequest(this.apiInstance.delete(url, config));
  }
}
