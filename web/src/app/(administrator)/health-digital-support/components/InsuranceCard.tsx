/* eslint-disable prefer-const */
import { IInsurance, ISUSInfo, TInsuranceType } from '@/types/patient-types';
import { useMemo } from 'react';

interface InsuranceCardProps {
  patientName: string;
  insuranceType: TInsuranceType;
  insuranceData?: IInsurance | ISUSInfo;
}

export default function InsuranceCard({ patientName, insuranceType, insuranceData }: InsuranceCardProps) {
  // Definir propriedades baseadas no tipo de seguro (Convênio ou SUS)
  const cardProperties = useMemo(() => {
    // Gerar um número formatado para o cartão (simulado para demonstração)
    const formatCardNumber = (input: string): string => {
      const cleanNumber = input.replace(/\D/g, '');
      const groups = cleanNumber.match(/.{1,4}/g) || [];
      return groups.join(' ');
    };

    // Cor e informações específicas para cada tipo de cartão
    if (insuranceType === 'Convênio') {
      const insuranceDetails = insuranceData as IInsurance;
      const cardNumber = insuranceDetails?.cardNumber || '0000000000000000';
      
      // Escolher uma cor e logo com base no nome da seguradora
      let bgColor = 'from-purple-400 to-purple-600';
      let textColor = 'text-white';
      let logoName = 'Convênio';
      
      if (insuranceDetails?.name?.toLowerCase().includes('amil')) {
        bgColor = 'from-blue-400 to-blue-600';
        logoName = 'AMIL';
      } else if (insuranceDetails?.name?.toLowerCase().includes('bradesco')) {
        bgColor = 'from-red-400 to-red-600';
        logoName = 'BRADESCO SAÚDE';
      } else if (insuranceDetails?.name?.toLowerCase().includes('unimed')) {
        bgColor = 'from-green-400 to-green-600';
        logoName = 'UNIMED';
      } else if (insuranceDetails?.name?.toLowerCase().includes('notre')) {
        bgColor = 'from-indigo-400 to-indigo-600';
        logoName = 'NOTREDAME';
      } else if (insuranceDetails?.name?.toLowerCase().includes('sulamerica')) {
        bgColor = 'from-blue-500 to-blue-700';
        logoName = 'SULAMÉRICA';
      } else if (insuranceDetails?.name?.toLowerCase().includes('porto')) {
        bgColor = 'from-yellow-400 to-yellow-600';
        logoName = 'PORTO SEGURO';
        textColor = 'text-gray-800';
      }
      
      return {
        bgColor,
        textColor,
        title: insuranceDetails?.name || 'Convênio',
        subtitle: insuranceDetails?.planType || 'Plano',
        cardNumber: formatCardNumber(cardNumber),
        expiry: insuranceDetails?.expirationDate ? new Date(insuranceDetails.expirationDate).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }) : 'MM/AA',
        logo: logoName,
        holderName: patientName.toUpperCase(),
        cvv: '***'
      };
    } else if (insuranceType === 'SUS') {
      const susInfo = insuranceData as ISUSInfo;
      return {
        bgColor: 'from-teal-400 to-teal-600',
        textColor: 'text-white',
        title: 'SUS',
        subtitle: 'Sistema Único de Saúde',
        cardNumber: formatCardNumber(susInfo?.cartaoSUS || '0000000000000000'),
        expiry: susInfo?.dataEmissao ? new Date(susInfo.dataEmissao).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }) : 'MM/AA',
        logo: 'SUS',
        holderName: patientName.toUpperCase(),
        cvv: '***'
      };
    } else {
      return {
        bgColor: 'from-gray-400 to-gray-600',
        textColor: 'text-white',
        title: 'Particular',
        subtitle: 'Sem convênio',
        cardNumber: '0000 0000 0000 0000',
        expiry: 'MM/AA',
        logo: '',
        holderName: patientName.toUpperCase(),
        cvv: '***'
      };
    }
  }, [patientName, insuranceType, insuranceData]);

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-xl overflow-hidden shadow-lg bg-gradient-to-r ${cardProperties.bgColor} p-4 relative`}>
        {/* Ícone de Chip do Cartão */}
        <div className="absolute top-4 left-4">
          <div className="w-10 h-7 bg-yellow-300 rounded-md opacity-80 flex items-center justify-center">
            <div className="w-8 h-5 border-2 border-yellow-600 rounded-sm"></div>
          </div>
        </div>
        
        {/* Logo da Operadora */}
        <div className="absolute top-4 right-4">
          <div className={`${cardProperties.textColor} font-bold text-xl`}>
            {cardProperties.logo}
          </div>
        </div>
        
        {/* Número do Cartão */}
        <div className="mt-12 text-center">
          <div className={`${cardProperties.textColor} font-mono text-xl tracking-wider`}>
            {cardProperties.cardNumber}
          </div>
        </div>
        
        {/* Informações do Titular */}
        <div className="mt-6 flex justify-between">
          <div>
            <div className={`${cardProperties.textColor} text-xs opacity-75`}>Titular</div>
            <div className={`${cardProperties.textColor} font-semibold truncate max-w-[180px]`}>
              {cardProperties.holderName}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`${cardProperties.textColor} text-xs opacity-75`}>Validade</div>
            <div className={`${cardProperties.textColor} font-mono`}>
              {cardProperties.expiry}
            </div>
          </div>
        </div>
        
        {/* Nome do Plano/Convênio */}
        <div className="mt-4">
          <div className={`${cardProperties.textColor} text-xs opacity-75`}>Plano</div>
          <div className={`${cardProperties.textColor} font-semibold flex items-center justify-between`}>
            <span>{cardProperties.subtitle}</span>
            <span className="text-sm opacity-80">{cardProperties.title}</span>
          </div>
        </div>
        
        {/* Decoração Gráfica */}
        <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-white opacity-5"></div>
      </div>
    </div>
  );
}