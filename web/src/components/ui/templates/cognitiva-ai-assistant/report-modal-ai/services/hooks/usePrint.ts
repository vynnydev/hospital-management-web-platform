/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePrint.ts
import { useCallback } from 'react';
import { convertToImageUrl } from '../functions/imagePresenter';
import { IPrintData, IReportModalData } from '../../../../../../../types/report-medication-types';

export const usePrint = () => {
  // Função interna para realizar a impressão
  const print = async (template: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(template);
    printWindow.document.close();

    return new Promise((resolve) => {
      const images = printWindow.document.getElementsByTagName('img');
      let loadedImages = 0;

      const tryPrint = () => {
        if (loadedImages === images.length) {
          setTimeout(() => {
            printWindow.print();
            resolve(true);
          }, 1000);
        }
      };

      if (images.length === 0) {
        tryPrint();
      } else {
        Array.from(images).forEach((img) => {
          if (img.complete) {
            loadedImages++;
            tryPrint();
          } else {
            img.onload = () => {
              loadedImages++;
              tryPrint();
            };
            img.onerror = () => {
              loadedImages++;
              tryPrint();
            };
          }
        });
      }
    });
  };

  const processImages = useCallback((medicationImages: any) => {
    const firstImageSet = medicationImages[0] || {};
    const images = {
      usage: firstImageSet.usage || '',
      application: firstImageSet.application || '',
      precaution: firstImageSet.precaution || ''
    };

    return {
      usage: convertToImageUrl(images?.usage),
      application: convertToImageUrl(images?.application),
      precaution: convertToImageUrl(images?.precaution)
    };
  }, []);

  const preparePrintData = useCallback((rawData: IReportModalData): IPrintData => {
    const vitalsData = {
        temperature: String(
            rawData?.raw?.data?.analysis?.lastVitals?.[0]?.temperature || "00.0"
        ),
        pressure: 
            rawData?.raw?.data?.analysis?.lastVitals?.[0]?.bloodPressure || "000/00",
        heartRate: String(
            rawData?.raw?.data?.analysis?.lastVitals?.[0]?.heartRate || "00"
        ),
        saturation: String(
            rawData?.raw?.data?.analysis?.lastVitals?.[0]?.oxygenSaturation || "00"
        )
    };
        
    const medications = rawData.raw.data.patient.treatment.medications || [];
    const medicationImages = rawData.raw.data.analysis.medicationImages || [];
    const processedImages = processImages(medicationImages);

    return {
      data: rawData,
      vitalsData,
      medications,
      processedImages
    };
  }, [processImages]);

  // Função handlePrint que aceita o evento
  const handlePrint = useCallback(async (e: React.MouseEvent<HTMLButtonElement>, template: string) => {
    e.preventDefault();
    try {
      await print(template);
    } catch (error) {
      console.error('Erro ao imprimir:', error);
    }
  }, []);

  return { handlePrint, preparePrintData };
};