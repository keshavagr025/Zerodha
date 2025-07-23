import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";

function Stats() {
    return (
        <div className='container p-5'>
            <div className='row p-5'>
                <div className='col-6 p-5'>
                    <h1 className='pb-4'>Trust with confidence</h1>
                    <h4>Customer-first always</h4>
                    <p className='text-muted'>That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments and contribute to 15% of daily retail exchange volumes in India.</p>
                    <h4>No spam or gimmicks</h4>
                    <p className='text-muted'>No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. Our philosophies.</p>
                    <h4>The Zerodha universe</h4>
                    <p className='text-muted'>Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                    <h4>Do better with money</h4>
                    <p className='text-muted'>With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.</p>
                </div>
                <div className='col-6'>
                    <img src='media/images/ecosystem.png' alt='Stats' style={{ width: '90%' }} className='img-fluid' />
                    <div>
                        <a href='#' className='mx-5' style={{textDecoration: "none"}}>Explore our products <IoIosArrowRoundForward/> </a>
                        <a href='#' style={{textDecoration: "none"}}>Try Kite demo < IoIosArrowRoundForward /> </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;