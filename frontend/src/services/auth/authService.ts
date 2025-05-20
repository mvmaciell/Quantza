// Placeholder: /home/ubuntu/quantza_app/frontend/src/services/auth/authService.ts
// Serviço para lidar com as chamadas de API de autenticação para o backend

// const API_URL = 'http://localhost:3000/api/auth'; // Ajustar para o URL do seu backend

export const authService = {
  register: async (userData: any) => {
    console.log("authService.register called with:", userData);
    // const response = await fetch(`${API_URL}/register`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userData),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to register');
    // }
    // return response.json();
    // Simular que o backend pede para verificar email após registro
    return { message: "User registered successfully (placeholder), please verify your email.", userId: "fake-user-id", verificationRequired: "email", contact: userData.email };
  },

  login: async (credentials: any) => {
    console.log("authService.login called with:", credentials);
    // const response = await fetch(`${API_URL}/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(credentials),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to login');
    // }
    // const data = await response.json();
    // Store token (e.g., AsyncStorage)
    return { message: "User logged in successfully (placeholder)", token: "fake-jwt-token", userId: "fake-user-id" };
  },

  socialLogin: async (provider: string, token: string) => {
    console.log(`authService.socialLogin for ${provider} with token:`, token);
    // const response = await fetch(`${API_URL}/social-login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ provider, token }),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || `Failed to login with ${provider}`);
    // }
    // const data = await response.json();
    // Store token
    return { message: `Social login with ${provider} successful (placeholder)`, token: "fake-jwt-token", userId: "fake-user-id" };
  },

  forgotPassword: async (email: string) => {
    console.log("authService.forgotPassword for:", email);
    // const response = await fetch(`${API_URL}/forgot-password`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email }),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to send password reset email');
    // }
    // return response.json();
    return { message: "Password reset email sent (placeholder)" };
  },

  sendVerificationCode: async (contact: string, type: 'email' | 'phone') => {
    console.log(`authService.sendVerificationCode for ${type} to ${contact}`);
    // const response = await fetch(`${API_URL}/send-verification-code`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ contact, type }),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to send verification code');
    // }
    // return response.json();
    return { message: `Verification code resent to ${contact} (placeholder)` };
  },

  verifyCode: async (contact: string, code: string, type: 'email' | 'phone') => {
    console.log(`authService.verifyCode for ${type} to ${contact} with code ${code}`);
    // const response = await fetch(`${API_URL}/verify-code`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ contact, code, type }),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to verify code');
    // }
    // return response.json();
    if (code === "123456") { // Simular código correto
      return { success: true, message: `${type} verified successfully (placeholder)` };
    }
    return { success: false, message: `Invalid verification code for ${type} (placeholder)` };
  },

  // Adicionar mais funções conforme necessário (ex: logout)
};

