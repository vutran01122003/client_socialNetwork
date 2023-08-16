import { useSelector } from 'react-redux';
import Post from '../components/home/Post';
import Status from '../components/home/Status';
import { authSelector } from '../redux/selector';

function Home() {
    const auth = useSelector(authSelector);

    return (
        <>
            {auth.user && (
                <div className='home'>
                    <Status auth={auth} />
                    <Post auth={auth} />
                </div>
            )}
        </>
    );
}

export default Home;
