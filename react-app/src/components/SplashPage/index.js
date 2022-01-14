import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'


function SplashPage() {



    return (
        <>
            <img src="https://humbleimages.s3.amazonaws.com/c381634f49bb4fec8e2810e970bae41f.png" alt="header" className='splash' />
            <div className="splash header">
                <h1>IMAGINE A PLACE...</h1>
                <h2>...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</h2>
            </div>
            <div className="splash sell">
                <h2 className='splash_text'>Create an invite-only place where you belong</h2>
                <h4 className='splash_text'>Harmony servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.</h4>
            </div>
            <div className="splash about">
                <h2 className='splash_text'>Created By</h2>
                <div id='authors'>
                    <div className='author_detail'>
                        <img src="https://avatars.githubusercontent.com/u/14840521?v=4" alt="" />
                        <p className='splash_text'>Seth Holland</p>
                        <div className="author_links">
                            <a href='https://www.linkedin.com/in/seth-holland/' target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin splash_text"></i></a>
                            <a href='https://github.com/LaterBlackBird' target="_blank" rel="noopener noreferrer"><i className="fab fa-github-square splash_text"></i></a>
                        </div>
                    </div>
                    <div className='author_detail'>
                        <img src="https://avatars.githubusercontent.com/u/88457702?v=4" alt="" />
                        <p className='splash_text'>Aaron Brubeck</p>
                        <div className="author_links">
                            <a href='https://www.linkedin.com/in/aaron-brubeck-458890183/' target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin splash_text"></i></a>
                            <a href='https://github.com/Baroobarecked' target="_blank" rel="noopener noreferrer"><i className="fab fa-github-square splash_text"></i></a>
                        </div>
                    </div>
                    <div className='author_detail'>
                        <img src="https://avatars.githubusercontent.com/u/87047392?v=4" alt="" />
                        <p className='splash_text'>Corbin Arcus</p>
                        <div className="author_links">
                            <a href='https://www.linkedin.com/in/corbin-arcus-23621121a/' target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin splash_text"></i></a>
                            <a href='https://github.com/Corbin-Arcus' target="_blank" rel="noopener noreferrer"><i className="fab fa-github-square splash_text"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SplashPage
