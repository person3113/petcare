import Button from '../Button';
import { FaCheckDouble,FaCheck  } from "react-icons/fa";
import { BsBrightnessHigh } from "react-icons/bs";

function Popup({ isOpen,Onclose,shelterName }){

    //팝업창 닫은 상태일때 아무것도 안보임
    if(!isOpen)return null;

    const SearchShelter=()=>{
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(shelterName)}`;
        window.open(searchUrl, '_blank');
    }

    return(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500/50 p-4"
             onClick={Onclose} /*배경 클릭 시 닫기*/
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
                 onClick={(e) => e.stopPropagation()} //팝업창 클릭때는 안닫히게
            >
                {/*팝업창 x버튼*/}
                <div className="flex justify-end mb-2">
                    <Button
                        text="X"
                        bgColor="white"
                        textColor="gray-500"
                        onClick={Onclose}
                    />
                </div>

                <div className="popup-content flex flex-col justify-center mb-6" >
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2 mb-1">
                            <FaCheckDouble className="text-green-500"/>
                            신청하러 가기 전에 다시 한번 확인하세요!!
                        </h2>
                        <p className="text-sm text-gray-500 ml-8">
                            ✱ 필요한 서류들은 보호소마다 다를 수 있으므로 정확한 준비는 보호소 상담을 통해 확인해주세요.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 mb-6 ml-2 bg-green-50/50 p-5 rounded-xl border border-green-100">
                        <p className="font-medium flex items-center gap-3 text-gray-700"><FaCheck className="text-green-600"/> 입양신청서</p>
                        <p className="font-medium flex items-center gap-3 text-gray-700"><FaCheck className="text-green-600"/> 신분증</p>
                        <p className="font-medium flex items-center gap-3 text-gray-700"><FaCheck className="text-green-600"/> 거주지 증명서</p>
                        <p className="font-medium flex items-center gap-3 text-gray-700"><FaCheck className="text-green-600"/> 입양 후 책임서약서</p>
                        <p className="font-medium flex items-center gap-3 text-gray-700"><FaCheck className="text-green-600"/> 돌봄 계획서</p>
                    </div>
                </div>

                {}
                <div className="flex justify-end mt-auto">
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