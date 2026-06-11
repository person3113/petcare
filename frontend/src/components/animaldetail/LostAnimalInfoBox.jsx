import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favorites.js';
import Button from '../Button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ContactPopup from './ContactPopup';

function LostAnimalInfoBox({ animal, onFavoriteChange }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    if (!animal) return (<div>데이터 로드 안됨</div>);

    const {
        kind,
        age,
        gender,
        color,
        description,
        liked,
        callName, 
        shelterTel 
    } = animal;

    return (
        <div className="max-w-[600px] p-5 text-left">
            <div className="flex items-center gap-3">
                <h1 className="!text-4xl font-bold m-0">
                    {kind || '품종 미상'}
                </h1>
                <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-600 border border-red-200">
                    목격자를 찾습니다!
                </span>
            </div>

            <div className="mt-1 rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
                <h2 className="!text-accent font-bold">기본 정보</h2>
                <hr className="text-accent my-3"></hr>
                <div className="pt-2 text-sm text-gray-600 space-y-2">
                    <p className="flex"><span className="w-25 text-gray-500">종</span> <span className="font-medium">{kind ? kind.replace(/\[.*\\]\s*/, '') : '정보 없음'}</span></p>
                    <p className="flex"><span className="w-25 text-gray-500">나이</span> <span className="font-medium">{age || '정보 없음'}</span></p>
                    <p className="flex"><span className="w-25 text-gray-500">성별</span> <span className="font-medium">{gender || '정보 없음'}</span></p>
                    <p className="flex"><span className="w-25 text-gray-500">색상</span> <span className="font-medium">{color || '정보 없음'}</span></p>
                </div>
            </div>

            {description && (
                <div className="bg-orange-50 p-4 rounded-lg m-2 border border-orange-100">
                    <h2 className="!text-accent font-bold mb-2">특징</h2>
                    <p className="text-gray-800 font-medium leading-relaxed">
                        {description}
                    </p>
                </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                    text="보호자 연락처 보기"
                    flex={2}
                    bgColor="#f59e0b"
                    textColor="white"
                    onClick={() => setIsPopupOpen(true)}
                />
            </div>

            <ContactPopup
                isOpen={isPopupOpen}
                contactName={callName}
                contactPhone={shelterTel}
                Onclose={() => setIsPopupOpen(false)}
            />
        </div>
    );
}

export default LostAnimalInfoBox;
