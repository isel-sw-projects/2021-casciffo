import {ResearchAddenda} from "../../../model/research/ResearchModel";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";
import {ADDENDA_ID_PARAMETER} from "../../../common/Constants";
import {MyError} from "../../error-view/MyError";
import {useToastMsgContext} from "../../context/ToastMsgContext";
import {useErrorHandler} from "react-error-boundary";
import React from "react";


type Props = {
    service: ResearchAggregateService
}

export function AddendaDetails(props: Props) {

    const [addendaId, setAddendaId] = useState<string>("")
    const [addenda, setAddenda] = useState<ResearchAddenda>({})
    const [isAddendaReady, setIsAddendaReady] = useState(false)

    const {showErrorToastMsg, showToastMsg} = useToastMsgContext()
    const errorHandler = useErrorHandler()

    const {researchId} = useParams()
    const {hash} = useLocation()

    useEffect(() => {
        try {
            const params = MyUtil.parseUrlHash(hash).find(params => params.key === ADDENDA_ID_PARAMETER)
            if (!params) {
                errorHandler(new MyError("Página da adenda não existe", 404))
            }
            const pId = params!.value
            setAddendaId(pId)

            props.service
                .fetchAddendaDetails(researchId!, pId)
                .then(setAddenda)
                .then(_ => setIsAddendaReady(true))
                .catch(errorHandler)
        } catch (e: unknown) {
            errorHandler(e)
        }
    }, [errorHandler, hash, props.service, researchId])


    return <React.Fragment>
    </React.Fragment>
}