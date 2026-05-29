function Tag(props){

    const keyword = props.keyword; //중성화,건강,성별 등
    let result = null;  //결과: 중성화 완료, 건강 양호 등

    if(props.result)result="_"+props.result; //만약에 #성별 과 같은 태그일 경우 _필요없어서 나중에 붙여주는 방식 사용

    return(
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            #{keyword}{result}
        </span>
    )
}

export default Tag;
