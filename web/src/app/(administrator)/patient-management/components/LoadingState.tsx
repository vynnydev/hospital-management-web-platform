interface LoadingStateProps {
    message?: string;
    progress?: number;
}
  
export const LoadingState: React.FC<LoadingStateProps> = ({ message, progress }) => {
    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
                    {progress && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{progress}%</span>
                    )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse overflow-hidden">
                <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress ?? 0}%` }}
                />
            </div>
        </div>
    );
};