import React from 'react'

const ConvHeader = () => {
  return (
        <div className="convenav navs">
                <div className="conveuser">
                    <div className="profile">
                        <img src="./img/tumblr_ovlq7qnBBR1uebi0uo1_1280.jpg" alt="" />
                    </div>
                    <div className="profileInformation">
                        <h4>Ihsan</h4>
                        <p>en ligne hier à 10:56 AM</p>
                    </div>
                </div>
                <div className="tools">
                    <div className="tool">
                        <img src="./img/icons8-search-64.png" alt="" />
                    </div>
                    <div className="tool">
                        <img src="./img/icons8-menu-vertical-50.png" alt="" />
                    </div>
                </div>
            </div>

  )
}

export default ConvHeader