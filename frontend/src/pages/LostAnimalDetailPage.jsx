import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../api/http.js';
import AnimalInfoBox from '../components/animaldetail/AnimalInfoBox';
import AnimalImg from '../components/animaldetail/AnimalImg';
import AnimalInfoTab from '../components/animaldetail/AnimalInfoTab';

function LostAnimalDetailPage() {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchLostAnimal() {
            try {
                const data = await request(`/api/lost-animals/${id}`, { method: 'GET' });
                if (!isMounted) return;
                setAnimal(data?.data || data);
            } catch (err) {
                console.log('분실동물 데이터 로딩 실패', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
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
        weight: animal.weight || '정보 없음',
        isNeutered: animal.isNeutered || '미상',
        socialization: animal.socialization || '정보 없음',
        healthStatus: animal.healthStatus || '정보 없음',
        geminiIntro: null,
        isLiked: false,
    };

    return (
        <div className="mx-auto max-w-5xl py-6">
            <h1 className="text-xl font-bold text-gray-900">분실동물 상세 페이지</h1>
            <p className="text-sm text-gray-600">동물의 id: {id}</p>
            <div className="mt-6 flex flex-col gap-10 lg:flex-row">
                <div className="min-w-[320px] flex-1">
                    <AnimalImg images={normalizedAnimal.images || []} />
                </div>
                <div className="min-w-[320px] flex-1">
                    <AnimalInfoBox animal={normalizedAnimal} onFavoriteChange={setAnimal} />
                </div>
            </div>
            <AnimalInfoTab animal={normalizedAnimal} />
        </div>
    );
}

export default LostAnimalDetailPage;
