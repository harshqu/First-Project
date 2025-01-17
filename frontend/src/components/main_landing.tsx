import Cookies from "js-cookie"
import NotProfile from "./not-approved";
import Profile from "./profilepage";
export default function ProfilePage() {
    const approved = Cookies.get('approved');
    const admin = Cookies.get('admin');
    return (
        <>
            {
                approved === 'false' && admin === 'false' ?
                <NotProfile/> :
                <Profile/>
            }
        </>
    )
}