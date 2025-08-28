interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}


export const Modal: React.FC<ModalProps> =({
    isOpen, 
    onClose, 
    children, 
    className = ""
})=>{
    if(!isOpen) return null;

    return (
        <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div> 
    )
}
