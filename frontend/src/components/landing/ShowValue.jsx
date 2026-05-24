import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const ShowValue = () => {
    const navigate = useNavigate();
    const [state, setState]=useState({
        protecting:0,   // 보호중인 유기동물
        monthprotect:0,  // 이번달 구조
        connected:0,    //연결된 인연
    });

    useEffect(()=>{
        // 백엔드에서 통계데이터 불러오기

        // test용 더미데이터
        setState({
            protecting:123,
            monthprotect:456,
            connected:789,
            });
    },[]);

    return(
        <div className="state-section">
            <div className="state-box" onClick={()=>navigate('')}>
                {/* toLocaleString() 통계수에 단위마다 ','추가 */}
                <span className="state-value">{state.protecting.toLocaleString()}</span>
                <span className="value-name">보호중인 유기동물</span>
            </div>
            <div className="state-box" onClick={()=>navigate('')}>
                <span className="state-value">{state.monthprotect.toLocaleString()}</span>
                <span className="value-name">이번달 구조동물</span>
            </div>
            <div className="state-box" onClick={()=>navigate('')}>
                <span className="state-value">{state.connected.toLocaleString()}</span>
                <span className="value-name">연결된 인연</span>
            </div>
        </div>
        )

    }
export default ShowValue;