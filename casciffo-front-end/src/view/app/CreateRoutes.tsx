import {Route, Routes} from "react-router-dom";
import RequiresAuth from "../login-view/RequiresAuth";
import {Dashboard} from "./Dashboard";
import {StatisticsService} from "../../services/StatisticsService";
import {Login} from "../login-view/Login";
import {UserService} from "../../services/UserService";
import {Logout} from "../login-view/Logout";
import {Proposals} from "../proposals-view/Proposals";
import ProposalService from "../../services/ProposalService";
import {CreateProposal} from "../proposal-form-view/CreateProposal";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {ProposalDetailsPage} from "../proposal-details-view/proposal/ProposalDetailsPage";
import {Research} from "../researches-view/Research";
import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {ResearchDetailsPage} from "../research-details/research/ResearchDetailsPage";
import {Users} from "../users-view/Users";
import {NotificationsView} from "../notifications/NotificationsView";
import {NotificationService} from "../../services/NotificationService";
import React from "react";
import {UserDetails} from "../users-view/UserDetails";
import {DataPage} from "../input-data-view/DataPage";
import {ConstantsService} from "../../services/ConstantsService";
import {PatientService} from "../../services/PatientService";

export function CreateRoutes() {

    return (
        <Routes>

            <Route path={"/"} element={RequiresAuth(<Dashboard statisticsService={new StatisticsService()}/>)}/>
            <Route path={"/login"} element={<Login UserService={new UserService()}/>}/>
            <Route path={"/logout"} element={<Logout/>}/>
            <Route path={"/propostas"}
                   element={RequiresAuth(<Proposals service={new ProposalService()}/>)}/>
            <Route path={"/propostas/criar"}
                   element={RequiresAuth(<CreateProposal
                       service={new ProposalAggregateService()}
                   />)}
            />
            <Route path={"/propostas/:proposalId"}
                   element={RequiresAuth(<ProposalDetailsPage proposalService={new ProposalAggregateService()}/>)}
            />

            <Route path={"/ensaios"}
                   element={RequiresAuth(<Research researchService={new ResearchAggregateService()}/>)}
            />

            <Route path={"/ensaios/:researchId"}
                   element={RequiresAuth(<ResearchDetailsPage researchService={new ResearchAggregateService()}/>)}
            />

            <Route path={"/utilizadores"}
                   element={RequiresAuth(<Users service={new UserService()}/>)}/>

            <Route path={"/utilizadores/:userId/notificacoes"}
                   element={RequiresAuth(<NotificationsView service={new NotificationService()}/>)}/>
            <Route path={"/utilizadores/:userId"}
                   element={RequiresAuth(<UserDetails service={new UserService()}/>)}/>
            <Route path={"/dados"}
                    element={RequiresAuth(
                        <DataPage
                            constantsService={new ConstantsService()}
                            patientService={new PatientService()}/>
                    )}/>

        </Routes>
    );
}