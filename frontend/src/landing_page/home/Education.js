import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";
function Education() {
    return (
       <div className='container mt-5'>
                 <div className='row'>
                        <div className='col-6'>
                            <img src='media/images/education.svg' style={{width: "70%"}} />
                     </div>
                     <div className='col-6'>
                         <h1 className='mb-3 fs-2' >Free and open market education</h1>
                         <p>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
                         <a href='#' className='mx-5' style={{ textDecoration: "none" }}>Varsity   <IoIosArrowRoundForward /> </a>

                          <p className='mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
                         <a href='#' className='mx-5' style={{ textDecoration: "none" }}>TradingQ&A  <IoIosArrowRoundForward /> </a>
                     </div>
                 </div>
             </div>
    );
}

export default Education;