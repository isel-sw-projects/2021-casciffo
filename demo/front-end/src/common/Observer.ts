import Subscriber from "./Subscriber";

class MyObserver<E> {
    private _state: E;
    private _subscribers: Array<Subscriber<E>> = []
    constructor(observedElement: E) {
        this._state = observedElement
    }

    subscribe(sub: Subscriber<E>) {
        this._subscribers.push(sub)
    }

    setState(newState: E) {
        this._state = newState
        this._subscribers.forEach(sub => sub.notify)
    }

    getState() {
        return this._state
    }
}

export default MyObserver