import React from "react";
import {MyUtil} from "../../common/MyUtil";
export function Dashboard() {
    document.title = MyUtil.DASHBOARD_TITLE
    return <React.Fragment>
        {/*<!-- header*/}
        <nav className="navbar navbar-fixed-top" id="header">
            <div className="container-fluid">
                <div className="navbar-header">
                    <div id="sidebar-toggle-button">
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                    <div className="brand">
                        <a href="web-analytics-overview.html">
                            <span className="hidden-xs-down m-r-3">Web Analytics </span><span className="lead">Overview</span>
                        </a>
                    </div>

                </div>
            </div>
        </nav>
        {/*header */}

         {/*sidebar */}
        <div className="sidebar-toggle" id="sidebar">
            <ul className="nav nav-sidebar">
                <li>
                    <a href="web-analytics-real-time.html">
                        <i className="fa fa-clock-o fa-lg fa-fw" aria-hidden="true"></i>
                        <span>Real Time</span>
                    </a>
                </li>
                <li role="separator" className="divider"></li>
                <li>
                    <a href="web-analytics-overview.html" className="active">
                        <i className="fa fa-newspaper-o fa-lg fa-fw" aria-hidden="true"></i>
                        <span>Overview</span>
                    </a>
                </li>
                <li role="separator" className="divider"></li>
            </ul>
        </div>
        {/*sidebar*/}

        {/*page-content-wrapper*/}
        <div className="page-content-toggle" id="page-content-wrapper">
            <div className="container-fluid">

                {/*1st row*/}
                <div className="row m-b-1">
                    <div className="col-md-12">
                        <div className="card card-block">
                            <h4 className="card-title m-b-2">Revenue - 2015 <span className="tag m-l-1" id="revenue-tag">$2,781,450</span></h4>
                            <div id="revenue-spline-area-chart"></div>
                        </div>
                    </div>
                </div>
                {/*1st row*/}

                {/*2nd row*/}
                <div className="row m-b-1">
                    <div className="col-md-12">
                        <div className="card card-block">
                            <h4 className="card-title m-b-2">Revenue By Category</h4>
                            <span className="tag custom-tag hidden-sm-down">Try clicking on any segment</span>
                            <div className="row">
                                <div className="col-md-4">
                                    <div id="annual-revenue-by-category-pie-chart"></div>
                                </div>
                                <div className="col-md-8 hidden-sm-down">
                                    <div id="monthly-revenue-by-category-column-chart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*2nd row*/}

                {/*3rd row*/}
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card card-block">
                            <h4 className="card-title m-b-2">
                                <span id="visitors-chart-heading">New vs Returning Visitors </span>
                                <button className="btn pull-right invisible" type="button" id="visitors-chart-back-button"><i className="fa fa-angle-left fa-lg" aria-hidden="true"></i> Back</button>
                            </h4>
                            <span className="tag custom-tag" id="visitors-chart-tag">Try clicking on any segment</span>
                            <div id="visitors-chart"></div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card card-block">
                            <h4 className="card-title m-b-2">Users</h4>
                            <div id="users-spline-chart"></div>
                        </div>
                    </div>
                </div>
                {/*/3rd row*/}

            </div>
            {/*/.container-fluid*/}

        </div>
        {/*/page-content-wrapper*/}

    </React.Fragment>;
}