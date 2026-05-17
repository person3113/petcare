function Tag(props){

    const keyword = props.keyword; //중성화,건강,성별 등
    let result = null;  //결과: 중성화 완료, 건강 양호 등

    if(props.result)result="_"+props.result; //만약에 #성별 과 같은 태그일 경우 _필요없어서 나중에 붙여주는 방식 사용

    return(
        <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
            #{keyword}{result}
        </span>
    )
}

export default Tag;