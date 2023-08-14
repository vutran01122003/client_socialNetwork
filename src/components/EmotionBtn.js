import Tippy from '@tippyjs/react/headless';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useState } from 'react';

function EmotionBtn({ setContent }) {

    const [openEmotionBtn, setOpenEmotionBtn] = useState(false);

    const handleToggleOpenEmotionBtn = (e) => {
        setOpenEmotionBtn(prev => !prev)
    }

    const handleAddEmotionIcon = (EmotionValue) => {
        setContent(prev => prev + EmotionValue);
    }

    const emotionIcons = 
        [
            '🙂', '😀', '😄', '😆', '😅', '😂', '🤣', '😊', '☹️', '😞', '😔', '😖', '😓', '😢', 
            '😢', '😭', '😟', '😣', '😩', '😫', '🤔', '😉', '😏', '😌', '😍', '😘', '😕', '😙', 
            '😚', '😤', '😠', '😳', '🙃', '😇', '😈', '😐', '😛', '😝', '😜', '😋', '🤤', '😎', 
            '😒', '🙁', '😴', '😪', '😱', '😰', '😑', '👿', '💀', '👻', '🤡', '🐧'
        ]
   
    return (
        <div >
             <Tippy
                interactive
                visible={openEmotionBtn}
                placement='top-end'
                zIndex={9999}
                onClickOutside={handleToggleOpenEmotionBtn}
                render={attrs => (
                    <div className="emotion_wrapper" tabIndex="-1" {...attrs}>
                        <h3 className='emotion_title'>Emotion icons</h3>
                        <div className='emotion__icons_wrapper'>   
                        {emotionIcons.map((emotionIcon, index) => 
                            <div 
                                key={index}
                                onClick={() => {
                                    handleAddEmotionIcon(emotionIcon);
                                    handleToggleOpenEmotionBtn();
                                }}
                                className='emotion__icon_wrapper'
                            >
                                    {emotionIcon}
                            </div> 
                        )}
                        </div>
                    </div>
                )}
        >   
                <div onClick={handleToggleOpenEmotionBtn}>
                    <InsertEmoticonIcon sx={{ color: '#FFC000' }} />
                </div>
            </Tippy>
        </div>
    );
}

export default EmotionBtn;
