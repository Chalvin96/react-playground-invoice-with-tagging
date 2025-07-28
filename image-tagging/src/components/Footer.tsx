interface FooterProps {
    currentView: 'editor' | 'invoice';
    onViewChange: (view: 'editor' | 'invoice') => void;
}

const Footer: React.FC<FooterProps> = ({ currentView, onViewChange }) => {
    return (
        <footer className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg print:hidden">
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => onViewChange('editor')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'editor'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Editor
                </button>
                <button
                    onClick={() => onViewChange('invoice')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'invoice'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Invoice
                </button>
            </div>
        </footer>
    );
};

export default Footer; 