import {useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import './question.css';

// 질문 목록
// 1. 내가 반려동물을 기르려는 이유 = 원하는 관계
// 2. 현재 나의 거주 형태
// 3. 나의 가구형태
// 4. 나의 생활은? -> 집을 비우는 시간에 대해서
// 5. 나의 반려동물에 대한 경험

function Question({answers, setAnswers}) {
    const navigate = useNavigate();
    const question = [
    {id:1, label:'Q1.입양동기', q:'당신이 입양을 결정하게 된 이유는 무엇인가요?', opts:['외로움을 많이 느껴서', '동반자를 가지고 싶어서', '좋은 인연을 찾고 싶어서', '추천을 받아서', '기타']},
    {id:2, label:'Q2.거주지', q:'당신은 어떤 집에서 거주중인가요?', opts:['원룸', '빌라', '아파트', '주택', '기타']},
    {id:3, label:'Q3.가구형태', q:'당신은 누구와 살아가고 있나요?', opts:['1인가구', '동거인이 있어요', '자녀가 있어요', '기타']},
    {id:4, label:'Q4.생활스타일', q:'당신의 생활은 어떤 느낌인가요?', opts:['집순이, 집에 거의 있어요', '가장, 일을 하고 있어서 항상 집에 있지 못해요', '외향형, 주말에도 집밖에는 나가요!', '나는 아니지만 집에 상주하는 사람이 있어요', '기타']},
    {id:5, label:'Q5.입양경험', q:'당신은 반려동물을 기른적이 있나요?', opts:['키워본적은 있지만 지금은 아니에요', '지금도 키우고 있어요.', '처음이에요.', '기타']}
    ];
    const [openIndex, setOpenIndex] = useState(null);   // 선택되 질문박스를 구분하니깐 열린 박스에 대한 인덱스 저장
    const boxRefs=useRef([]);   // 페이지 진입시 첫 질문에 스크롤 세팅 + 미응답 질문으로 스크롤
    const finish=answers.every(a=>a!==null);    // 모두 응답되었다면 finish==1 제출버튼 활성화

    // qi:질문의 순서 인덱스. oi:옵션, 즉 답변의 순서 인덱스
    function SelectHandler(qi,oi) {
        const next=[...answers];
        next[qi]=oi;
        setAnswers(next);   // 답을 setAnswers()로 저장하기
        setOpenIndex(null); // 선택을 했으니 박스를 축소
    }

    function ToggleHandler(qi) {
        setOpenIndex(prev=>prev===qi?null:qi);
        setTimeout(()=>boxRefs.current[qi]?.scrollIntoView({behavior:'smooth', block:'nearest'}),100);
    }

    function Submit() {
        if(!finish){
            alert('응답하지 않은 문항이 있습니다. 모든 문항에 답해주십시오.');
            // 미응답 질문중 가장 빠른 번호로 스크롤
            const fastBlank=answers.findIndex(a=>a===null);
            boxRefs.current[fastBlank]?.scrollIntoView({behavior:'smooth', block:'nearest'});
            return;
        }
        // 설문제출이 성고했으니 매칭 결과페이지로
        navigate('/match-result');
    }

    // 전체 질문 목록 및 버튼에 대한 출력
    return(
        <div className="question-wrapper">
            {/* 동적으로 순회해서 여기에 qi, oi를 선언하는게 더 코드가 간단해짐 */}
            {question.map((q, qi)=> {
                const isOpen = openIndex === qi;
                const isAnswer = answers[qi] !== null;

                // 각 질문에 대한 박스를 map에 의해서 반복적으로 출력
                return(
                    /* 각 질문과 옵션에 대한 것을 키값으로 받음
                        박스로 스크롤할대 사용
                        선택상태에 따라서 축소 혹은 전체보여주기
                        선택되었다면 ToggleHandler로 next를 다음 박스로 전달 */
                    <div key={q.id} ref={el => boxRefs.current[qi] = el}
                        className={['question-box',
                        isAnswer?'question-box-answered':'',
                        isOpen?'question-box-opened':''].filter(Boolean).join(' ')}
                        onClick={()=>ToggleHandler(qi)}
                    >
                        <div className="question-box-header">
                            <span>{q.label}</span>
                            <span>{q.q}</span>
                        </div>
                        {/* 선택 유무에 따라서 감춰지는 부분, isOpen이 TRUE일때만 보여짐, 선택지 */}
                        {isOpen && (
                            <div className="question-box-options">
                                {/* 한 질문의 선택지들을 map으로 순회 */}
                                {q.opts.map((opt, oi)=>(
                                    // 수정할때 이미 선택한 것을 구분하기위해 '~selected'를 뒤에 추가해서 별도의 css를 부여
                                    // 클릭 이벤트가 생겼을때 ToggleHandler가 실행되지 않도록 막음, SelectHandler만 실행되게 도와줌
                                    <button key={oi} className={['question-box-opt',
                                        answers[qi] === oi ? 'question-box-option-selected' : '',
                                        ].filter(Boolean).join(' ')}
                                        onClick={(event)=>{event.stopPropagation(); SelectHandler(qi, oi);}}
                                    >
                                {opt}
                                </button>
                            ))}

                        </div>
                    )}
                {!isOpen && isAnswer &&(
                    <div className="question-box-selected">
                        <span>{q.opts[answers[qi]]}</span>
                    </div>
                )}
                </div>
                );
            })}
            {/* 이전, 다음, 제출 버튼 */}
            <div className="question-buttons">
                <button className="question-buttons-prev"
                    onClick={()=>{
                    const target=openIndex===null?0:openIndex-1;
                    if(target >= 0)ToggleHandler(target);}}
                    >이전</button>
                <button className="question-buttons-next"
                    onClick={()=>{
                        const target=openIndex===null?0:openIndex+1;
                        if(target < 5)ToggleHandler(target);}}
                    >다음</button>
                <button className={
                    finish?"question-buttons-finish":"question-buttons-noFinish"}
                    onClick={Submit}>
                    제출</button>
            </div>
        </div>
        );
    }

export default Question;