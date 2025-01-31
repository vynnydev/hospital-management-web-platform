import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Card, CardContent } from '@/components/ui/organisms/card';

interface Report {
  title: string;
  date: string;
  type: string;
}

interface ReportsSliderProps {
  reports: Report[];
}

export const ReportsSlider: React.FC<ReportsSliderProps> = ({ reports }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSlide = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 pt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Relatórios e Documentos
        </h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleSlide('left')}
            aria-label="Deslizar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleSlide('right')}
            aria-label="Deslizar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {reports.map((report, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 w-[300px] cursor-pointer hover:shadow-lg transition-all dark:bg-gray-800"
          >
            <CardContent className="p-6 border rounded-md">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-blue-500 font-medium">
                  {report.type}
                </span>
                <h4 className="font-semibold">{report.title}</h4>
                <time className="text-sm text-gray-500">
                  {new Date(report.date).toLocaleDateString()}
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};