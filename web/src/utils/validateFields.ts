// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um CPF (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11) return cpf
  
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata um telefone ((XX) XXXXX-XXXX)
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length !== 11) return phone
  
  return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

/**
 * Formata uma data (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleDateString('pt-BR')
}

/**
 * Calcula a idade a partir da data de nascimento
 */
export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Valida CEP
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  // Expressão regular simples para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Algoritmo de validação do CPF
  let sum = 0
  let remainder
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) remainder = 0
  
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
  
  sum = 0
  
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) remainder = 0
  
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false
  
  return true
}