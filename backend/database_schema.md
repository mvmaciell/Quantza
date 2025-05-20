# Esquema Inicial do Banco de Dados PostgreSQL - Quantza MVP

**Data:** 14 de Maio de 2025

Este documento descreve o esquema inicial do banco de dados PostgreSQL para o Produto Mínimo Viável (MVP) do aplicativo Quantza. O design visa a modularidade, escalabilidade e facilidade de manutenção, alinhado com os requisitos do projeto.

## Convenções

*   Nomes de tabelas e colunas em `snake_case`.
*   Chaves primárias são `id` do tipo `UUID` (gerado automaticamente) ou `SERIAL` para simplicidade inicial, dependendo da necessidade de unicidade global.
*   Datas de criação e atualização (`created_at`, `updated_at`) são do tipo `TIMESTAMPTZ` com valor padrão `NOW()`.
*   Tipos `ENUM` serão usados para campos com um conjunto restrito de valores.

## Tipos ENUM Globais

```sql
CREATE TYPE user_role AS ENUM (
    'PASSENGER',
    'PARTNER'
);

CREATE TYPE ride_status AS ENUM (
    'REQUESTED',
    'ACCEPTED',
    'DRIVER_ARRIVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED_BY_USER',
    'CANCELLED_BY_PARTNER',
    'NO_DRIVER_FOUND'
);

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'SUCCEEDED',
    'FAILED'
);

CREATE TYPE transaction_type AS ENUM (
    'RIDE_PAYMENT',
    'RIDE_EARNING',
    'SUBSCRIPTION_FEE',
    'WITHDRAWAL',
    'POINTS_REWARD',
    'DONATION'
);

CREATE TYPE partner_status AS ENUM (
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'SUSPENDED'
);
```

## Tabelas

### 1. `users`

Armazena informações sobre todos os usuários da plataforma (passageiros e parceiros).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL, -- ID do Firebase Auth
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50) UNIQUE,
    profile_image_url TEXT,
    current_role user_role DEFAULT 'PASSENGER',
    -- Pontos acumulados pelo usuário
    points_balance INTEGER DEFAULT 0 CHECK (points_balance >= 0),
    -- Total doado pelo usuário
    total_donated NUMERIC(10, 2) DEFAULT 0.00,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `partners_details`

Armazena informações específicas dos parceiros (motoristas).

```sql
CREATE TABLE partners_details (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    cnh_number VARCHAR(100) NOT NULL,
    cnh_image_url TEXT,
    vehicle_model VARCHAR(100),
    vehicle_plate VARCHAR(20) UNIQUE,
    vehicle_document_url TEXT,
    status partner_status DEFAULT 'PENDING_APPROVAL',
    -- Saldo disponível para saque
    earning_balance NUMERIC(10, 2) DEFAULT 0.00,
    average_rating NUMERIC(3, 2) DEFAULT 0.00,
    total_rides_completed INTEGER DEFAULT 0,
    bank_account_details JSONB, -- Para informações de saque
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `rides`

Armazena informações sobre cada corrida solicitada.

```sql
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES users(id),
    partner_id UUID REFERENCES users(id), -- Pode ser NULL até um parceiro aceitar
    status ride_status NOT NULL DEFAULT 'REQUESTED',
    
    origin_latitude DOUBLE PRECISION NOT NULL,
    origin_longitude DOUBLE PRECISION NOT NULL,
    origin_address TEXT,
    
    destination_latitude DOUBLE PRECISION NOT NULL,
    destination_longitude DOUBLE PRECISION NOT NULL,
    destination_address TEXT,
    
    estimated_fare NUMERIC(10, 2), -- Preço estimado Quantza
    actual_fare NUMERIC(10, 2),    -- Preço final após a corrida
    distance_km NUMERIC(10, 2),
    duration_minutes INTEGER,
    
    -- Informações do comparador de preços (armazenar o que foi mostrado ao usuário)
    competitor_prices_snapshot JSONB, -- Ex: {"competitor_a_fare": 22.50, "competitor_b_fare": 20.75}
    
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ, -- Quando o parceiro inicia a corrida com o passageiro
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    passenger_rating_for_partner INTEGER CHECK (passenger_rating_for_partner BETWEEN 1 AND 5),
    passenger_comment_for_partner TEXT,
    partner_rating_for_passenger INTEGER CHECK (partner_rating_for_passenger BETWEEN 1 AND 5),
    partner_comment_for_passenger TEXT,
    
    donation_amount NUMERIC(10, 2) DEFAULT 0.00, -- 1% do actual_fare
    points_earned INTEGER DEFAULT 0,

    payment_id UUID, -- Referência ao pagamento (será preenchido após o pagamento)

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `payments`

Registra todas as transações de pagamento (corridas, assinaturas).

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id), -- Quem está pagando ou recebendo (no caso de saque)
    ride_id UUID UNIQUE REFERENCES rides(id), -- Opcional, se for pagamento de corrida
    pagarme_transaction_id VARCHAR(255) UNIQUE, -- ID da transação no Pagar.me
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method_details JSONB, -- Detalhes do método (ex: last4 do cartão)
    transaction_type transaction_type NOT NULL,
    description TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
-- Adicionar referência de `payment_id` na tabela `rides` após a criação de `payments`
ALTER TABLE rides ADD CONSTRAINT fk_rides_payment FOREIGN KEY (payment_id) REFERENCES payments(id);

### 5. `user_payment_methods`

Armazena os métodos de pagamento tokenizados dos usuários (Pagar.me).

```sql
CREATE TABLE user_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    pagarme_card_id VARCHAR(255) UNIQUE NOT NULL, -- ID do cartão no Pagar.me
    brand VARCHAR(50),
    last_four_digits VARCHAR(4),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. `points_transactions`

Histórico de ganho e gasto de pontos.

```sql
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    ride_id UUID REFERENCES rides(id), -- Opcional, se os pontos foram ganhos em uma corrida
    points_amount INTEGER NOT NULL, -- Positivo para ganho, negativo para gasto
    transaction_type VARCHAR(100) NOT NULL, -- Ex: 'RIDE_COMPLETION', 'PREMIUM_SIGNUP_BONUS'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. `donations_log`

Log das doações realizadas.

```sql
CREATE TABLE donations_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    ride_id UUID NOT NULL REFERENCES rides(id),
    amount NUMERIC(10, 2) NOT NULL,
    donation_target TEXT, -- Para onde foi a doação (pode ser um placeholder inicialmente)
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. `partner_incentives`

Define os desafios e metas para parceiros.

```sql
CREATE TABLE partner_incentives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_metric VARCHAR(100), -- Ex: 'rides_completed', 'rating_average'
    target_value INTEGER, -- Ex: 10 (corridas), 4.9 (rating)
    reward_amount NUMERIC(10, 2), -- Valor em dinheiro
    reward_points INTEGER, -- Pontos bônus
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. `partner_incentive_progress`

Progresso dos parceiros nos desafios.

```sql
CREATE TABLE partner_incentive_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_user_id UUID NOT NULL REFERENCES users(id),
    incentive_id UUID NOT NULL REFERENCES partner_incentives(id),
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (partner_user_id, incentive_id)
);
```

### 10. `push_notification_tokens`

Armazena os tokens de dispositivo para notificações push (FCM).

```sql
CREATE TABLE push_notification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    device_token TEXT NOT NULL UNIQUE,
    device_type VARCHAR(50), -- 'ANDROID', 'IOS'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Índices Importantes (Exemplos)

```sql
-- Para buscas rápidas de usuários
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Para buscas de corridas por status e passageiro/parceiro
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX idx_rides_partner_id ON rides(partner_id);

-- Para buscas de pagamentos
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_pagarme_transaction_id ON payments(pagarme_transaction_id);
```

Este esquema inicial cobre as funcionalidades principais do MVP. Ele foi projetado para ser relacional e permitir consultas eficientes. A modularidade é incentivada pela separação de preocupações em diferentes tabelas. Conforme o aplicativo evolui, este esquema pode ser expandido com novas tabelas e colunas através de migrações de banco de dados.

