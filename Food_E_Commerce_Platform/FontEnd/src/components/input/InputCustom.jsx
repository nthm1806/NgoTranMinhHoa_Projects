import { iconSend } from '../icon/Icon';
import styles from './styles.module.css';

export const InputCustom = ({textComment, setTextComment, onComment}) => {
    const handleComment = (text) =>{
        onComment(text)
        setTextComment('')
    }
    return (
        <label className={styles.label}>
            <span className={styles.icon} onClick={()=> handleComment(textComment)}>
                {iconSend}
            </span>
            <input
            onKeyPress={(e) => {
                if(e.key === 'Enter'){
                    handleComment(e.target.value)
                }
            }}
            onChange={(e) => setTextComment(e.target.value)}
            value={textComment}
                type="text"
                className={styles.input}
                placeholder="Đánh giá và nêu cảm nghĩ của bạn ..."
                autoComplete="off"
            />
        </label>
    );
};


