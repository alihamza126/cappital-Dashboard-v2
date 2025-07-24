import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardSkeleton = () => {
    return (
        <div className="dashboard-skeleton">
            <div className="stat-item d-flex flex-column flex-md-row" style={{ height: '190px' }}>
                <div className="flex-fill h-100 mb-2 mb-md-0 me-md-2">
                    <Skeleton height='100%' borderRadius={10} />
                </div>
                <div className="flex-fill h-100">
                    <Skeleton height='100%' borderRadius={10} />
                </div>
            </div>

            <h2 className="subjects-title mt-4 d-flex justify-content-center">
                <Skeleton width={200} height={50} borderRadius={10} />
            </h2>
            <div className="stats mt-2">
                <div className="stat-item d-flex flex-column flex-md-row" style={{ height: '180px' }}>
                    <div className="flex-fill h-100 mb-2 mb-md-0 me-md-2">
                        <Skeleton height='100%' borderRadius={10} />
                    </div>
                    <div className="flex-fill h-100 mb-2 mb-md-0 me-md-2">
                        <Skeleton height='100%' borderRadius={10} />
                    </div>
                    <div className="flex-fill h-100">
                        <Skeleton height='100%' borderRadius={10} />
                    </div>
                </div>
            </div>

            <div className=" mt-5 stat-item d-flex flex-column flex-md-row" style={{ height: '400px' }}>
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

export default DashboardSkeleton;
