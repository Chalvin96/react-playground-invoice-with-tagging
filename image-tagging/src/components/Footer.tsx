import { Button } from '@/components/ui/button';

interface FooterProps {
    currentView: 'editor' | 'invoice';
    onViewChange: (view: 'editor' | 'invoice') => void;
}

const Footer: React.FC<FooterProps> = ({ currentView, onViewChange }) => {
    return (
        <footer className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg print:hidden">
            <div className="flex justify-center gap-4">
                <Button
                    onClick={() => onViewChange('editor')}
                    variant={currentView === 'editor' ? 'default' : 'secondary'}
                    className="px-6 py-2"
                >
                    Editor
                </Button>
                <Button
                    onClick={() => onViewChange('invoice')}
                    variant={currentView === 'invoice' ? 'default' : 'secondary'}
                    className="px-6 py-2"
                >
                    Invoice
                </Button>
            </div>
        </footer>
    );
};

export default Footer; 