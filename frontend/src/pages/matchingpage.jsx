import {useState} from 'react';
import Question from '../component/fivequestion/question.jsx';
import MatchingProcess from '../component/fivequestion/matchingprocess.jsx';


function Matching() {
    const [answers, setAnswers]=useState([null, null, null, null, null]);
    const filled = answers.filter(a=>a!==null).length;

    return(
        <>
            {/* 진행도, 현재 진행사항을 보여주기 */}
            <MatchingProcess filled={filled} />
            {/* 질문 5개 + 이동 밒 제출 버튼*/}
            <Question answers={answers} setAnswers={setAnswers} />
        </>
        )
    }

export default Matching;