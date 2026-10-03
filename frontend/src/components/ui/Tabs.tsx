import { ReactNode, createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || 'banks');
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: any) {
  return (
    <div className="flex border-b border-gray-200">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: any) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const { activeTab, setActiveTab } = context;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
        {
          'border-blue-600 text-blue-600': activeTab === value,
          'border-transparent text-gray-600 hover:text-gray-900': activeTab !== value,
        }
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: any) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  const { activeTab } = context;
  return activeTab === value ? <div className={className}>{children}</div> : null;
}
