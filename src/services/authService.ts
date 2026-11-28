import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  AuthLoginResponse,
  AuthRegisterResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth';
import type { User } from '@/types/user';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthRegisterResponse> => {
    const { data } = await api.post<AuthRegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },
  login: async (payload: LoginPayload): Promise<AuthLoginResponse> => {
    const { data } = await api.post<AuthLoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },
};

export const authApi = authService;
