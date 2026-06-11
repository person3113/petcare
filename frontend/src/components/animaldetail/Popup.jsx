import Button from '../Button';
import { FaCheckDouble,FaCheck  } from "react-icons/fa";
import { BsBrightnessHigh } from "react-icons/bs";

function Popup({ isOpen,Onclose,shelterName }){

    //팝업창 닫은 상태일때 아무것도 안보임
    if(!isOpen)return null;

    //팝업창의
    const SearchShelter=()=>{
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(shelterName)}`;
        window.open(searchUrl, '_blank');
    }

    const popupstyle={
        position: 'relative',
    };
    const closebuttonstyle={
        position: 'absolute',
        top: '10px',
        right: '15px',
    };
    const sheltercallstyle={
        position: 'absolute',
        bottom: '30px',
        right: '35px',
        marginTop: '20px',
    };
    return(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500/50"
             onClick={Onclose} /*배경 클릭 시 닫기*/
        >
            <div className="fixded bg-white rounded-lg p-10 w-full max-w-[600px] max-h-[800px] shadow-2xl m-4"
                 onClick={(e) => e.stopPropagation()} //팝업창 클릭때는 안닫히게
                 style={popupstyle}
            >
                {/*팝업창 x버튼*/}
                <div style={closebuttonstyle}>
                    <Button
                        text="X"
                        bgColor="white"
                        textColor="gray-500"
                        onClick={Onclose}
                    />
                </div>

                <div className="popup-content flex flex-col justify-center gap-3 mb-15" >
                    <h2 className="!text-xl !font-bold !text-green-800 !mb-2">
                        <span><FaCheckDouble className="text-green-400"/></span>
                        신청하러 가기 전에 다시한번 확인하세요!!
                    </h2>
                    <div className="flex flex-col gap-5 mb-3">
                        <p className="font-bold flex gap-6"><span><FaCheck className="text-green-800"/></span>입양신청서</p>
                        <p className="font-bold flex gap-6"><span><FaCheck className="text-green-800"/></span>신분증</p>
                        <p className="font-bold flex gap-6"><span><FaCheck className="text-green-800"/></span>거주지 증명서</p>
                        <p className="font-bold flex gap-6"><span><FaCheck className="text-green-800"/></span>입양 후 책임서약서</p>
                        <p className="font-bold flex gap-6"><span><FaCheck className="text-green-800"/></span>돌봄 계획서</p>
                    </div>
                    <div className="text-xs text-accent p-5 text-center leading-relaxed italic bg-amber-50 rounded-lg">
                        <span><BsBrightnessHigh className="text-accent"/></span>충분한 준비는 보호자와 아이들 모두의 행복을 위한 중요한 단계입니다
                        <p className="text-[10px] text-red-800">✱필요한 서류들은 보호소마다 다를 수 있으므로 정확한 준비는 보호소 상담을 통해 확인해주세요</p>
                    </div>
                </div>

                <div style={sheltercallstyle}>
                    <Button
                        text="보호소 검색"
                        bgColor="#f59e0b"
                        textColor="white"
                        onClick={SearchShelter}
                    />
                </div>
            </div>
        </div>
    );
}

export default Popup;