import { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const actualOpen = open !== undefined ? open : isOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  return (
    <>
      {Array.isArray(children) ? (
        children.map((child, idx) =>
          child?.type?.name === 'DialogTrigger'
            ? {
                ...child,
                props: {
                  ...child.props,
                  onClick: () => handleOpenChange(true),
                },
              }
            : child
        )
      ) : (
        children
      )}

      {actualOpen && (
        <DialogContent onOpenChange={handleOpenChange}>
          {children}
        </DialogContent>
      )}
    </>
  );
}

export function DialogTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>;
}

export function DialogContent({ onOpenChange, children }: { onOpenChange: (open: boolean) => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end p-4">
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: any) {
  return <div className={`mb-4 ${className || ''}`} {...props} />;
}

export function DialogTitle({ className, ...props }: any) {
  return <h2 className={`text-xl font-semibold ${className || ''}`} {...props} />;
}

export function DialogDescription({ className, ...props }: any) {
  return <p className={`text-gray-600 text-sm ${className || ''}`} {...props} />;
}
