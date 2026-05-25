import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getStatsSummary } from '../../api/stats.js';
import CountUp from '../CountUp.jsx';

const ShowValue = () => {
    const navigate = useNavigate();
    const [state, setState]=useState({
        protecting:0,   // 보호중인 유기동물
        rescued:0,  // 이번달 구조
        connected:0,    //연결된 인연
    });

    useEffect(()=>{
        // 백엔드에서 통계데이터 불러오기
        getStatsSummary().then(data=>{
            setState({
                protecting:data.totalProtecting||0,
                rescued:data.totalRescued||0,
                connected:data.totalAdopted||0,
                });
            }).catch(()=>console.log('데이터 로딩 실패'));
        // test용 더미데이터
        /*setState({
            protecting:123,
            month:456,
            connected:789,
            });
        */
    },[]);

    return(
        <div className="state-section">
            <div className="state-box" onClick={()=>navigate('/animals')}>
                <span className="state-value"><CountUp end={state.protecting} duration={1.2} /></span>
                <span className="value-name">보호중인 유기동물</span>
            </div>
            <div className="state-box" onClick={()=>navigate('/animals')}>
                <span className="state-value"><CountUp end={state.rescued} duration={1.2} /></span>
                <span className="value-name">이번달 구조동물</span>
            </div>
            <div className="state-box" onClick={()=>navigate('/animalswipe')}>
                <span className="state-value"><CountUp end={state.connected} duration={1.2} /></span>
                <span className="value-name">연결된 인연</span>
            </div>
        </div>
        )

    }
export default ShowValue;
