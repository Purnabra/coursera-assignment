import React from 'react'

const Notification = () => {
    return (
        <div className="window blue">
            <div className="winicon">
                <img src="./img/icons8-notification-off-96.png" alt="" />
            </div>
            <div className="wininfo">
                <div>
                    <p>Être averti·e en cas de nouveaux messages</p>
                </div>
                <div>
                    <p>Activer les notifications sur le bureau</p>
                    <img src="./img/icons8-arrow-96.png" alt="" />
                </div>
            </div>
            <div className="winclose">
                <img src="./img/icons8-close-90.png" alt="" />
            </div>
        </div>
    )
}

export default Notification