import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const CourseSkeleton = () => {
    return (
        <div className="dashboard-skeleton">
            <div className="mt-2 stat-item d-flex flex-column flex-md-row" style={{ height: '190px' }}>
                <div className="flex-fill h-100 mb-2 mb-md-0 me-md-2">
                    <Skeleton height='100%' borderRadius={10} />
                </div>
            </div>
            <div className="mt-4 stat-item d-flex flex-column flex-md-row" style={{ height: '190px' }}>
                <div className="flex-fill h-100 mb-2 mb-md-0 me-md-2">
                    <Skeleton height='100%' borderRadius={10} />
                </div>
                <div className="flex-fill h-100">
                    <Skeleton height='100%' borderRadius={10} />
                </div>
            </div>
        </div>
    );
};

export default CourseSkeleton;
