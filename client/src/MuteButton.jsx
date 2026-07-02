import React, { useState } from 'react';
import { isMuted, toggleMute } from './audio';

export default function MuteButton() {
    const [muted, setMuted] = useState(isMuted());
    return (
        <button className="mute-btn" onClick={() => setMuted(toggleMute())}
            title={muted ? 'Ativar som' : 'Silenciar'}>
            {muted ? 'SOM: OFF' : 'SOM: ON'}
        </button>
    );
}
