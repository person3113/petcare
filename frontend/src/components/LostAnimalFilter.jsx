import React from 'react';

function LostAnimalFilter({
  sidoList,
  sigunguList,
  filters,
  onChange,
  disabledSigungu,
}) {
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    onChange({ ...filters, [name]: nextValue });
  }

  return (
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
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
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
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
      </div>
    </section>
  );
}

export default LostAnimalFilter;
