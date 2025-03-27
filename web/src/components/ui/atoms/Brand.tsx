'use client';

import { Role } from '@/utils/types/maps'
import { BrandIcon } from './BrandIcon'
import { useEffect, useState } from 'react';

export interface IBrandProps {
  className?: string
  shortForm?: boolean
  type?: Role
}

export const Brand = ({
  shortForm = false,
  className,
  type = undefined,
}: IBrandProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`grid place-items-center z-50 ${className}`}>
      <div className="text-xl">
        {shortForm ? (
          <div className="flex items-center gap-2 font-medium tracking-tighter font-playfair">
            <BrandIcon />
            <div>
              <div className="flex gap-1">
                <h1 className='text-slate-100 dark:text-slate-100 text-sm'>Cognitiva</h1>
                {type ? <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span> : null}
              </div>
              <h1 className="text-xs text-slate-100 dark:text-gray-500">Cognitiva Studio</h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-medium tracking-tighter font-playfair">
            <BrandIcon />
            <div>
              <div className="flex gap-1">
                <h1 className='text-slate-100 dark:text-slate-100'>Cognitiva</h1>
                {type ? <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span> : null}
              </div>
              <h1 className="text-xs text-slate-100 dark:text-gray-500">Cognitiva Studio</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}