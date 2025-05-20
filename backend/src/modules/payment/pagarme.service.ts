// Placeholder: /home/ubuntu/quantza_app/backend/src/modules/payment/pagarme.service.ts
// Serviço para interagir com a API do Pagar.me (Sandbox)

// import pagarme from 'pagarme'; // SDK oficial do Pagar.me
// import pagarmeConfig from "../../../pagarmeConfig.json_placeholder.json"; // Carregar chaves do placeholder

interface PaymentDetails {
  rideId: string;
  userId: string;
  amount: number; // Em centavos (ex: R$ 25.50 deve ser 2550)
  paymentMethod: "credit_card" | "pix"; // E outros que o Pagar.me suportar
  cardHash?: string; // Se for cartão de crédito, gerado no frontend
  cardId?: string; // Se for cartão salvo
  customer?: { // Detalhes do cliente
    external_id: string; // userId do seu sistema
    name: string;
    email: string;
    // ... outros dados do cliente conforme documentação Pagar.me
  };
  // ... outros detalhes específicos do método de pagamento
}

export class PagarmeService {
  private apiKey: string;

  constructor() {
    // this.apiKey = pagarmeConfig.api_key; // Usar a chave de API do placeholder
    this.apiKey = "YOUR_PAGARME_API_KEY_SANDBOX"; // Placeholder direto
    if (!this.apiKey || this.apiKey === "YOUR_PAGARME_API_KEY_SANDBOX") {
      console.warn("Pagar.me API key is not configured. Payment processing will be simulated.");
    }
  }

  async processPayment(paymentDetails: PaymentDetails): Promise<{ transactionId: string; status: string; message: string }> {
    if (!this.apiKey || this.apiKey === "YOUR_PAGARME_API_KEY_SANDBOX") {
      console.log(`Simulating Pagar.me payment for ride ${paymentDetails.rideId}, amount: ${paymentDetails.amount / 100}`);
      // Simular uma transação bem-sucedida
      return {
        transactionId: `sim_txn_${Date.now()}`,
        status: "paid",
        message: "Pagamento simulado com sucesso (Pagar.me Sandbox).",
      };
    }

    // Lógica real de integração com Pagar.me SDK
    // try {
    //   const client = await pagarme.client.connect({ api_key: this.apiKey });
    //   const transaction = await client.transactions.create({
    //     amount: paymentDetails.amount,
    //     payment_method: paymentDetails.paymentMethod,
    //     card_hash: paymentDetails.cardHash, // Se aplicável
    //     // ... outros parâmetros da transação
    //     async: false, // Para processamento síncrono
    //     customer: paymentDetails.customer,
    //     metadata: {
    //       ride_id: paymentDetails.rideId,
    //       user_id: paymentDetails.userId,
    //     }
    //   });

    //   console.log(`Pagar.me transaction created for ride ${paymentDetails.rideId}:`, transaction);

    //   if (transaction.status === 'paid') {
    //     return {
    //       transactionId: transaction.id,
    //       status: transaction.status,
    //       message: "Pagamento processado com sucesso via Pagar.me.",
    //     };
    //   } else {
    //     // Tratar outros status (authorized, processing, refused, etc.)
    //     console.error(`Pagar.me transaction for ride ${paymentDetails.rideId} status: ${transaction.status}`);
    //     throw new Error(`Falha no pagamento: ${transaction.status_reason || transaction.status}`);
    //   }
    // } catch (error: any) {
    //   console.error(`Error processing Pagar.me payment for ride ${paymentDetails.rideId}:`, error);
    //   throw new Error(`Erro ao processar pagamento: ${error.message}`);
    // }
    return { // Fallback de simulação caso a lógica real esteja comentada
        transactionId: `sim_fallback_txn_${Date.now()}`,
        status: "paid",
        message: "Pagamento simulado (fallback) com sucesso (Pagar.me Sandbox).",
      };
  }

  // Outros métodos: criar cliente, salvar cartão, consultar transação, etc.
}

// export const pagarmeService = new PagarmeService();

