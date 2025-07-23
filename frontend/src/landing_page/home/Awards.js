import React from 'react'

function Awards() {
    return (
        <div className='container mt-5 '>
            <div className='row text-center'>
                <div className='col-6 p-5'>
                    <img src='media/images/largestBroker.svg' alt='Awards' className='mb-4' />
                </div>
                <div className='col-6 p-5 mt-3'>
                    <h1>Largest Broker in India</h1>
                    <p className='mb-5'>2+ million Zerodha clients contribute to over 15% of all retail order volumes in india daily by trading and investing in: .</p>
                    <div className='row'>
                        <div className='col-6'>
                            <ul>
                                <li>Futures and Options</li>
                                <li>Commodity derivatives</li>
                                <li>Currency derivatives</li>
                            </ul>
                        </div>
                        <div className='col-6'>
                             <ul>
                                <li>Stocks & IPO</li>
                                <li>Direct mutual funds</li>
                                <li>Bonds and Govt. Sercurtiy</li>
                            </ul>
                        </div>
                    </div>
                    <img src='media\images\pressLogos.png' alt='Award' style={{width: '90%'}} className='mt-6 pt-5' />
                </div>
            </div>
        </div>
    );
}

export default Awards;