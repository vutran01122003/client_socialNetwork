import Account from '../UserCard';

function SidebarLeft({ auth }) {
    return (
        <div className='app_sidebar_left'>
            <div className='sidebar_left'>
                <div className='sidebar_account'>
                    <Account user={auth.user} />
                </div>
            </div>
        </div>
    );
}

export default SidebarLeft;
