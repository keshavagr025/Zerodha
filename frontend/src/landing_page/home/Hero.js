import React from 'react'

function Hero() {
    return (
       <div className='container p-5 mb-10'>
        <div className='row text-center'>
            <img src='media/images/homeHero.png' alt='hero' className='mb-4' />
            <h1 className='mt-5'>Invest in everything</h1>
            <p>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
            <button style={{width: '23%', margin: '0 auto'}} className='btn btn-primary p-3 fs-5'>Signup Now</button>
        </div>
       </div>
    );
}

export default Hero;