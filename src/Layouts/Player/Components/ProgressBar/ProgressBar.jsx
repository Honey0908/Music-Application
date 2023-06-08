import React, { useEffect, useState } from 'react';
import { audioElement } from '../../../../App';
import { Slider } from '@mui/material';

const ProgressBar = () => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(audioElement.currentTime);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Slider
            aria-label="time-indicator"
            size="small"
            value={currentTime}
            min={0}
            step={0.1}
            max={30}
            onChange={(_, value) => (audioElement.currentTime = value)}
            sx={{
                color: 'var(--text-color)',
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
                },
            }}
        />
    );
};

export default ProgressBar;
