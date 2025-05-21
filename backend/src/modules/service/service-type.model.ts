import { Schema, model, Document } from 'mongoose';

/**
 * Interface para o tipo de serviço
 */
export interface IServiceType extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumPrice: number;
  available: boolean;
  requiresVerification: boolean;
  allowedVehicleTypes: string[];
  modifiers: {
    name: string;
    type: 'fixed' | 'percentage';
    value: number;
    condition?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema para o tipo de serviço
 */
const ServiceTypeSchema = new Schema<IServiceType>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerKm: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerMinute: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    requiresVerification: {
      type: Boolean,
      default: false,
    },
    allowedVehicleTypes: {
      type: [String],
      default: [],
    },
    modifiers: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['fixed', 'percentage'],
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        condition: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Modelo para o tipo de serviço
 */
const ServiceType = model<IServiceType>('ServiceType', ServiceTypeSchema);

export default ServiceType;
