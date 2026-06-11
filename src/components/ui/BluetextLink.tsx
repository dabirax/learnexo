import React from 'react'
import type { ChildrenProps } from '../../utils/types/baseTypes'

const BlueTextLink: React.FC<ChildrenProps> = ({children}) => {
  return (
    <span className="text-violet-600 hover:text-violet-700 font-bold transition-colors">
      {children}
    </span>
  );
}

export default BlueTextLink