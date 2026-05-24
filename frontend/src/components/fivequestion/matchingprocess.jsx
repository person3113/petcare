import './matchingprocess.css';

function MatchingProcess({ filled }) {
    const percent=Math.round(filled*20);   // 진행현황을 퍼센트로 변환 + 반올림

    return(
        <div className="matchingprocess">
            <div className="matchingprocess-text">
                <span className="matchingprocess-step">{filled}/5</span>
                <span className="matchingprocess-percent">{percent}%</span>
            </div>
            <div className="matchingprocess-bar-background">
                {/* 아래 스타일은 동적으로 받는 것이므로 css문서로 옮겨서 사용할 수 없음 */}
                <div className="matchingprocess-bar-filled" style={{width:`${percent}%`}} />
            </div>
        </div>
        );
    }

export default MatchingProcess;