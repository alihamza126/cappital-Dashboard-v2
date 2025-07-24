import React, { Suspense } from 'react'
import Preloader from '../../components/preloader/Preloader';
import StickyNav from '../stickyNav/StickyNav';
const AboutUs = React.lazy(() => import('../../components/about-us/About_Us'));

const About = () => {
    return (
        <>
            <Suspense fallback={<Preloader/>}>
               <StickyNav/>
            </Suspense>
            <Suspense fallback={<Preloader/>}>
                <AboutUs />
            </Suspense>
        </>
    )
}

export default About