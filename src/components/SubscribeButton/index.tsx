import styles from './styles.module.scss';

interface SubscribeButtunProps {
    priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtunProps) {
    return (
        <button 
        type="button"
        className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    )
}