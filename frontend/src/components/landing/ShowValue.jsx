import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getRealtimeSummary } from '../../api/stats.js';
import CountUp from '../CountUp.jsx';

const ShowValue = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        todayDate: "",
        totalRescued: 0,
        totalAdopted: 0,
        totalEuthanized: 0,
    });

    useEffect(() => {
        getRealtimeSummary().then(res => {
            const data = res.data;
            setState({
                todayDate: data.todayDate || "",
                totalRescued: data.totalRescued || 0,
                totalAdopted: data.totalAdopted || 0,
                totalEuthanized: data.totalEuthanized || 0,
            });
        }).catch(() => console.log('통계치 가져오기 에러'));
    }, []);

    const calcRate = (part, total) => {
        if (total === 0) return "0.0";
        return ((part / total) * 100).toFixed(1);
    };

    return (
        <div style={{ width: '100%' }}>
            {state.todayDate && (
                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#555' }}>
                    {state.todayDate}(오늘 날짜) 유기동물 통계
                </div>
            )}
            <div className="state-section">
                <div className="state-box" onClick={() => navigate('/animals')}>
                    <span className="state-value">
                        <CountUp end={state.totalRescued} duration={1.2} /> 마리
                    </span>
                    <span className="value-name">구조</span>
                </div>
                <div className="state-box" onClick={() => navigate('/animals')}>
                    <span className="state-value">
                        <CountUp end={state.totalAdopted} duration={1.2} /> 마리 ({calcRate(state.totalAdopted, state.totalRescued)} %)
                    </span>
                    <span className="value-name">입양률</span>
                </div>
                <div className="state-box" onClick={() => navigate('/animals')}>
                    <span className="state-value">
                        <CountUp end={state.totalEuthanized} duration={1.2} /> 마리 ({calcRate(state.totalEuthanized, state.totalRescued)} %)
                    </span>
                    <span className="value-name">안락사율</span>
                </div>
            </div>
        </div>
    );
}
export default ShowValue;
