/* eslint-disable @typescript-eslint/no-explicit-any */
// services/examAnalysis.ts

import { load } from '@tensorflow-models/universal-sentence-encoder';

interface ExamResult {
  type: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
}

export class ExamAnalysis {
  private model: any;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    this.model = await load();
  }

  async analyzeExam(
    currentExam: ExamResult,
    previousExams: ExamResult[]
  ): Promise<{
    status: 'normal' | 'attention' | 'critical';
    analysis: string;
    trend: 'improving' | 'stable' | 'worsening';
  }> {
    const status = this.checkExamStatus(currentExam);
    const trend = this.analyzeTrend(currentExam, previousExams);
    
    return {
      status,
      analysis: this.generateAnalysis(currentExam, status),
      trend,
    };
  }

  private checkExamStatus(exam: ExamResult): 'normal' | 'attention' | 'critical' {
    const { value, referenceRange } = exam;
    
    if (value < referenceRange.min || value > referenceRange.max) {
      const deviation = Math.abs(
        (value - (referenceRange.max + referenceRange.min) / 2) /
        (referenceRange.max - referenceRange.min)
      );
      
      return deviation > 0.5 ? 'critical' : 'attention';
    }
    
    return 'normal';
  }

  private analyzeTrend(
    currentExam: ExamResult,
    previousExams: ExamResult[]
  ): 'improving' | 'stable' | 'worsening' {
    if (previousExams.length === 0) return 'stable';
    
    const lastExam = previousExams[previousExams.length - 1];
    const change = ((currentExam.value - lastExam.value) / lastExam.value) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'worsening' : 'improving';
  }

  private generateAnalysis(
    exam: ExamResult,
    status: 'normal' | 'attention' | 'critical'
  ): string {
    // Lógica para gerar análise textual do exame
    return `Resultado ${exam.value} ${exam.unit} - Status: ${status}`;
  }
}