// Placeholder: /home/ubuntu/quantza_app/backend/src/modules/user/user.controller.ts
// Responsável por lidar com as requisições HTTP relacionadas aos perfis de usuário

import { UserService } from "./user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req: any, res: any) {
    const userId = req.user?.id || "fake-user-id-from-token"; // Simulação
    try {
      const profile = await this.userService.getUserProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user profile (placeholder)", error: error.message });
    }
  }

  async updateProfile(req: any, res: any) {
    const userId = req.user?.id || "fake-user-id-from-token"; // Simulação
    const profileData = req.body;
    try {
      const result = await this.userService.updateUserProfile(userId, profileData);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating user profile (placeholder)", error: error.message });
    }
  }

  async switchProfile(req: any, res: any) {
    const userId = req.user?.id || "fake-user-id-from-token"; // Simulação
    const { newRole } = req.body; // Espera-se 'PASSENGER' ou 'PARTNER'

    if (!newRole || (newRole !== 'PASSENGER' && newRole !== 'PARTNER')) {
        return res.status(400).json({ message: "Invalid role specified. Must be 'PASSENGER' or 'PARTNER'." });
    }

    try {
      const result = await this.userService.switchUserProfile(userId, newRole);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error switching user profile (placeholder)", error: error.message });
    }
  }

  async getCurrentRole(req: any, res: any) {
    const userId = req.user?.id || "fake-user-id-from-token"; // Simulação
    try {
      const role = await this.userService.getCurrentRole(userId);
      res.status(200).json({ role });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching current role (placeholder)", error: error.message });
    }
  }
}

