import {Transaction} from '../domain/model/transaction.entity';
import {TransactionResource, RegisterTransactionResource, UpdateTransactionResource} from './transaction-response';
import {RegisterTransactionRequest, UpdateTransactionRequest} from './transaction-request';

export class TransactionAssembler {
  static toEntity(resource: TransactionResource): Transaction {
    return {
      id: resource.id,
      transactionType: resource.transactionType,
      transactionCategory: resource.transactionCategory,
      transactionMethod: resource.transactionMethod,
      amount: resource.amount,
      currency: resource.currency,
      description: resource.description,
      transactionDate: resource.transactionDate
    };
  }

  static toEntities(resources: TransactionResource[]): Transaction[] {
    return resources.map(r => this.toEntity(r));
  }

  static toCreateRequest(resource: RegisterTransactionResource): RegisterTransactionRequest {
    return {
      transactionType: resource.transactionType,
      transactionCategory: resource.transactionCategory,
      transactionMethod: resource.transactionMethod,
      amount: resource.amount,
      currency: resource.currency,
      description: resource.description,
      transactionDate: resource.transactionDate
    };
  }

  static toUpdateRequest(resource: UpdateTransactionResource): UpdateTransactionRequest {
    return {
      transactionType: resource.transactionType,
      transactionCategory: resource.transactionCategory,
      transactionMethod: resource.transactionMethod,
      amount: resource.amount,
      currency: resource.currency,
      description: resource.description,
      transactionDate: resource.transactionDate
    };
  }

  static toRegisterResource(entity: Transaction): RegisterTransactionResource {
    return {
      transactionType: entity.transactionType,
      transactionCategory: entity.transactionCategory,
      transactionMethod: entity.transactionMethod,
      amount: entity.amount,
      currency: entity.currency,
      description: entity.description,
      transactionDate: entity.transactionDate
    };
  }

  static toUpdateResource(entity: Transaction): UpdateTransactionResource {
    return {
      transactionType: entity.transactionType,
      transactionCategory: entity.transactionCategory,
      transactionMethod: entity.transactionMethod,
      amount: entity.amount,
      currency: entity.currency,
      description: entity.description,
      transactionDate: entity.transactionDate
    };
  }
}