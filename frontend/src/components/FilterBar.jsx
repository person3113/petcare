import React from 'react';
import { PROCESS_STATES } from '../constants.js';

function FilterBar({
  sidoList,
  sigunguList,
  shelterList,
  filters,
  onChange,
  disabledSigungu,
  disabledShelter,
}) {
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    onChange({ ...filters, [name]: nextValue });
  }

  return (
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-gray-700">
          시도
          <select
            name="sido"
            value={filters.sido}
            onChange={handleChange}
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
            value={filters.sigungu}
            onChange={handleChange}
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
            value={filters.shelterName}
            onChange={handleChange}
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
            value={filters.kind}
            onChange={handleChange}
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
            value={filters.status}
            onChange={handleChange}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">전체</option>
            {PROCESS_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          성별
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
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
            value={filters.isNeutered}
            onChange={handleChange}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">전체</option>
            <option value="예">예</option>
            <option value="아니오">아니오</option>
            <option value="미상">미상</option>
          </select>
        </label>
      </div>

    </section>
  );
}

export default FilterBar;
