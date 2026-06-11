import React from 'react';

function ContactPopup({ isOpen, Onclose, contactName, contactPhone }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-80 rounded-xl bg-white p-6 shadow-lg">
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
                    onClick={Onclose}
                >
                    ✕
                </button>
                <h3 className="mb-4 text-lg font-bold text-gray-900">보호자 연락처</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p className="flex justify-between">
                        <span className="font-medium">이름(담당자):</span>
                        <span>{contactName || '정보 없음'}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">연락처:</span>
                        <span className="font-bold text-accent">{contactPhone || '정보 없음'}</span>
                    </p>
                </div>
                <div className="mt-6">
                    <a
                        href={`tel:${contactPhone}`}
                        className="block w-full rounded-lg bg-accent py-2 text-center font-bold text-white transition-colors hover:bg-orange-500"
                    >
                        전화 걸기
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ContactPopup;
