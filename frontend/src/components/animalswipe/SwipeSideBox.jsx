import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button.jsx';

function SwipeSideBox({LikeCnt,filter,onFilterChange}) {

    //샘플
    const sidoList=[
        {code:'1', name:"서울광역시"},
        {code:'2', name:"부산광역시"},
        {code:'3', name:"대전광역시"}
    ];
    const sigunguList=[
        {code:'1', name:"종로구"},
        {code:'2', name:"용산구"},
        {code:'3', name:"마포구"},
    ];
    const shelterList=[
        {id:'1', name:"서울보호소"},
        {id:'2', name:"부산보호소"},
        {id:'3', name:"대전보호소"},
    ];

    const disabledSigungu = !filter.sido; // 시도를 선택하지 않았으면, 시군구는 비활성화
    const disabledShelter = !filter.sigungu; // 시군구를 선택하지 않았으면, 보호소는 비활성화

    
    return(
        <div className="flex flex-col items-center gap-2">
            {/*오늘의 찜 부분*/}
            <div className="flex h-[150px] w-[300px] flex-col items-center justify-center rounded-[25px] border-2 border-gray-300 bg-white">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">오늘의 찜</h2>
                <h2 className="text-3xl font-bold text-gray-900">{LikeCnt}</h2>
            </div>
            {/*todo:다른 필터링 등 사이드바에 넣을 내용 여기 추가*/}
            {/*설문하러가기 버튼*/}
            <div className="flex gap-3 h-[180px] w-[300px] flex-col items-center justify-center rounded-[25px] border-2 border-gray-300 bg-white">
                <h2>매칭 테스트</h2>
                <p>5문항으로 조건 적용</p>
                <Link to="/survey">
                    <Button text="시작하기" width="250px"/>
                </Link>
            </div>
            {/*필터*/}
            <div className="flex py-6 w-[300px] flex-col items-center justify-center rounded-[25px] border-2 border-gray-300 bg-white">
                <h4>필터</h4>
                <section className="w-full rounded-2xl bg-white p-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            시도
                            <select
                                name="sido"
                                value={filter.sido}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            >
                                <option value="">전체</option>
                                {sidoList.map((item) => (
                                    <option key={item.code} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            시군구
                            <select
                                name="sigungu"
                                value={filter.sigungu}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                disabled={disabledSigungu}
                            >
                                <option value="">전체</option>
                                {sigunguList.map((item) => (
                                    <option key={item.code} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            보호소
                            <select
                                name="shelterName"
                                value={filter.shelterName}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                disabled={disabledShelter}
                            >
                                <option value="">전체</option>
                                {shelterList.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            축종
                            <select
                                name="kind"
                                value={filter.kind}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            >
                                <option value="">전체</option>
                                <option value="[개]">[개]</option>
                                <option value="[고양이]">[고양이]</option>
                                <option value="[기타축종]">[기타축종]</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            상태
                            <select
                                name="status"
                                value={filter.status}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            >
                                <option value="">전체</option>
                                <option value="보호중">보호중</option>
                                <option value="종료(입양)">종료(입양)</option>
                                <option value="종료(반환)">종료(반환)</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            성별
                            <select
                                name="gender"
                                value={filter.gender}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            >
                                <option value="">전체</option>
                                <option value="수컷">수컷</option>
                                <option value="암컷">암컷</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-gray-700">
                            중성화
                            <select
                                name="isNeutered"
                                value={filter.isNeutered}
                                onChange={onFilterChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            >
                                <option value="">전체</option>
                                <option value="예">예</option>
                                <option value="아니오">아니오</option>
                                <option value="미상">미상</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="onlySocialized"
                                checked={filter.onlySocialized}
                                onChange={onFilterChange}
                            />
                            사회화 정보 있는 아이만
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="onlyHealthy"
                                checked={filter.onlyHealthy}
                                onChange={onFilterChange}
                            />
                            건강 상태 양호만
                        </label>
                    </div>
                </section>
            </div>

        </div>

    )
}

export default SwipeSideBox;
