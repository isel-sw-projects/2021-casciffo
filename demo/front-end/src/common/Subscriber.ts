interface Subscriber<E> {
    notify(change: E) : void;
}

export default Subscriber;