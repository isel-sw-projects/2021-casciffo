import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type MyModelProps = {
    show: boolean
    onCloseButtonClick: () => void
    onSuccessButtonClick: () => void
    content: JSX.Element
}

export function VerticallyCenteredPopup(props: MyModelProps) {
    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.content}
            </Modal.Body>
            <Modal.Footer>
                <Button className={"flex float-start"} onClick={props.onCloseButtonClick} variant={"outline-danger"}>Fechar</Button>
                <Button className={"flex float-end"} onClick={props.onSuccessButtonClick} variant={"outline-success"}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}