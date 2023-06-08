import React, { useEffect, useState } from 'react';
import { audioElement } from '../../../../App';
import styles from './ProgressBar.module.css'
import { Slider } from '@mui/material';

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {

            const currentTime = audioElement.currentTime;
            const calculatedProgress = (currentTime / 30) * 100
            //     clearInterval(interval);
            setProgress(calculatedProgress)
            // }
        }, 100); // Update progress every second

        return () => {
            clearInterval(interval); // Clear the interval on component unmount
        };
    }, []);

    return (
        // <div className={styles.progressBar}>
        //     <progress value={progress} max={100}></progress>
        // </div>
        <Slider
            aria-label="time-indicator"
            size="small"
            value={audioElement.currentTime}
            min={0}
            step={1}
            max={30}
            onChange={(_, value) => audioElement.currentTime = value}
            sx={{
                color: 'var(--primary-color)',
                height: 4,
                padding: 0,
                '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    padding: 0,
                    '&:before': {
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                    },
                    '&.Mui-active': {
                        width: 20,
                        height: 20,
                    },
                },
                '& .MuiSlider-rail': {
                    opacity: 0.28,
                }
            }}
        />
    );
};

export default ProgressBar;
