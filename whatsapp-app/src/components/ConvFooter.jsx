import React from 'react'

const ConvFooter = () => {
    return (
        <div className="convebottom">
            <div className="tools">
                <div className="tool">
                    <img src="./img/icons8-smiling-90.png" alt="" />
                </div>
                <div className="tool">
                    <img src="./img/icons8-attach-100.png" alt="" />
                </div>
            </div>
            <input type="text" placeholder="Taper un message" />
            <div className="tool">
                <img src="./img/icons8-microphone-96.png" alt="" />
            </div>
        </div>
    )
}

export default ConvFooter