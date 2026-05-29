import { useAuth } from '../../context/AuthContext'; //

function UserProfile(){

    const { user }=useAuth();

    if(!user){
        return(<div>사용자 정보 로딩 또는 로그인이 필요함.......</div>)
    }
    return(
        <div className="bg-white flex flex-col">
            <div className="flex">
                <div
                    style={{
                        backgroundColor: 'yellow',
                        width:'64px',
                        height:'64px',
                        borderRadius:'50%',
                        border: '1px solid yellow',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        textAlign:'center',
                        fontSize: '40px',
                    }}>
                    {user.nickname.charAt(0)}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <h2 style={{color:"black"}}>{user.nickname}님</h2>
                    <p className="text-xs">가입일: {user.createdAt}</p>
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default UserProfile;