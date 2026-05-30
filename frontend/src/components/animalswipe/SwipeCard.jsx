//motion:html태그에 애니메이션 사용가능
import { motion } from 'framer-motion';

function SwipeCard({ currentAnimal, exitX, setexitX, setnowIndex, onLike}) {

    // 드래그가 끝났을 때 판단 async:기다려야 하는 함수임을 선언, await: 이 작업이 끝날때까지 대기
    const handleDragEnd = async (event, info, animal) => {
        //info.offset.x: 카드가 처음 위치에서 가로로 이동한 픽셀 값
        if (info.offset.x > 100) { //오른쪽으로 100픽셀 이상 밀었을때
            setexitX(500); // 오른쪽으로 날아가기 설정
            console.log(`${animal.kind} 찜하기`); //찜하기
            onLike(currentAnimal.id); //찜 개수 증가
            //카드 인덱스 증가
            setnowIndex((prev) => prev + 1);

        } else if (info.offset.x < -100) {//왼쪽으로 100픽셀이상 밀었을때
            setexitX(-500); // 왼쪽으로 날아가기 설정
            console.log(`${animal.kind} 패스`);
            // 다음 카드로 넘어가기 (인덱스 증가)
            setnowIndex((prev) => prev + 1);
        }
    };


    return(
        <motion.div
            className="absolute h-full w-full cursor-grab"
            drag="x" //가로로 이동
            dragConstraints={{ left: 0, right: 0 }} //드래그 범위:드래그후 놓으면 돌아올 자리
            //사용자가 카드를 놓았을때
            onDragEnd={(e, info) => handleDragEnd(e, info, currentAnimal)}

            // 나타날 때 애니메이션: 선명해지며 살짝 위로 올라오는
            initial={{ scale: 0.9, opacity: 0, y: 10 }} //초기값:크기 0.9,투명,y축 10만큼 아래
            animate={{ scale: 1, opacity: 1, y: 0 }} //애니메이션: 크가1,선명,원래위치

            // 사라질 때 실행(exitX 방향으로 날아감)
            exit={{
                x: exitX,  //이 값이 왼,오 결정
                opacity: 0, //날아가면서 투명해짐
                rotate: exitX > 0 ? 25 : -25, // 날아갈 때 살짝 회전(+:시게방향,-:반시계)
                transition: { duration: 0.3 } //0.3초동안
            }}
        >
            {/* 카드 UI 디자인 */}
            <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
                <img
                    src={currentAnimal.images[0]}
                    alt={currentAnimal.kind}
                    className="h-[360px] w-full object-cover pointer-events-none"
                />
                <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{currentAnimal.kind}</h3>
                        <span>{currentAnimal.gender}</span>
                    </div>
                    <p>나이: {currentAnimal.age}</p>
                    <p>색: {currentAnimal.color}</p>
                    <div>보호소: {currentAnimal.shelterName}</div>
                </div>
            </div>
        </motion.div>
    )
}

export default SwipeCard;
