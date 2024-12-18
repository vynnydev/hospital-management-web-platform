import { MetricCardProps } from "@/services/types/metrics";

// components/StatusBadge.tsx
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

// components/TrendIndicator.tsx
const TrendIndicator: React.FC<{ direction: string; value: number }> = ({ direction, value }) => {
  const getTrendColor = (): string => {
    switch (direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (): string => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <span className={`flex items-center ${getTrendColor()}`}>
      {getTrendIcon()}
      <span className="ml-1">{value}%</span>
    </span>
  );
};

// utils/dateFormatter.ts
const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// components/MetricCard.tsx
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  status,
  timestamp,
  icon,
  details
}) => {
  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressWidth = (value: string): string => {
    return value.replace('%', '');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-semibold">
          {value}
        </span>
        <span className="ml-1 text-gray-500 text-xl">
          {unit}
        </span>
      </div>

      {/* Barra de Progresso Principal */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full ${getProgressColor(value)} transition-all duration-500 ease-in-out`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <TrendIndicator 
            direction={trend.direction}
            value={trend.value}
          />
          <span className="ml-2 text-sm text-gray-500">
            vs. último período
          </span>
        </div>
      )}

      {details && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500">{details.subtitle}</span>
          <div className="mt-2 space-y-2">
            {details.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${getProgressColor(Number(getProgressWidth(item.value)))} transition-all duration-500 ease-in-out`}
                      style={{ width: item.value }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Atualizado: {formatDateTime(timestamp)}
      </div>
    </div>
  );
};

export default MetricCard;