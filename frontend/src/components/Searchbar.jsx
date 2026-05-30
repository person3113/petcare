import React, { useState } from 'react';
import SearchModal from './SearchModal.jsx';

function Searchbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button 
                type="button" 
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors mr-2"
                aria-label="검색"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
            <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default Searchbar;
