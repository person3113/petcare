import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { request } from '../api/http.js';
import LostAnimalInfoBox from '../components/animaldetail/LostAnimalInfoBox';
import AnimalImg from '../components/animaldetail/AnimalImg';
import LostAnimalDetailSection from '../components/animaldetail/LostAnimalDetailSection';

function LostAnimalDetailPage() {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        function fetchLostAnimal() {
            request(`/api/lost-animals/${id}`, { method: 'GET' })
                .then(data => {
                    if (!isMounted) return;
                    setAnimal(data?.data || data);
                })
                .catch(err => {
                    console.log('분실동물 데이터 로딩 실패', err);
                })
                .finally(() => {
                    if (isMounted) {
                        setLoading(false);
                    }
                });
        }

        fetchLostAnimal();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <div>...로딩중...</div>;
    }
    if (!animal) {
        return <div>데이터가 없습니다</div>;
    }

    const normalizedAnimal = {
        ...animal,
        images: animal.images || [],
    };

    return (
        <div className="mx-auto max-w-5xl py-6">
            <div className="path ml-6">
                <Link to="/" className="text-sm text-gray-500 hover:underline">메인 화면 </Link>
                <span>&gt; </span>
                <Link to="/lost-animals" className="text-sm text-gray-500 hover:underline">분실 동물 </Link>
                <span>&gt; </span>
                <span className="text-sm text-accent"> 상세 페이지</span>
            </div>
            
            <div className="mt-6 flex flex-col gap-10 lg:flex-row">
                <div className="min-w-[320px] flex-1">
                    <AnimalImg images={normalizedAnimal.images || []} />
                </div>
                <div className="min-w-[320px] flex-1">
                    <LostAnimalInfoBox animal={normalizedAnimal} onFavoriteChange={setAnimal} />
                </div>
            </div>
            <LostAnimalDetailSection animal={normalizedAnimal} />
        </div>
    );
}

export default LostAnimalDetailPage;
