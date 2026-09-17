import React from 'react'
import ConvMessage from "./ConvMessage";
import ConvHeader from "./ConvHeader";
import ConvFooter from "./ConvFooter";
const Content = () => {
    return (
        <div className="conversation">
            <ConvHeader />
            <ConvMessage />
            <ConvFooter />
        </div>
    )
}
export default Content